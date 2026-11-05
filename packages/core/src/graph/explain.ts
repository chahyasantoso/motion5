import { unreachable } from "../lang/exhaustive";
import {
  isModel,
  isOptionalModel,
  type Diagnostic,
  type ProjectDefinition,
  type SlotSpec,
} from "../contract/v5";
import { deriveCommittedContract } from "./committed-contract";
import { checkSlotOutput } from "./slot-check";
import type { SlotOutcome } from "./slot-check";
import { buildGraphIR, collectTrack, compareEdges, type GraphEdge, type GraphNode } from "./ir";
import { UNJUDGED_CAPABILITIES, type PluginCapabilities } from "../ports/plugin-capabilities";

/** One slot's fit in the committed graph, as an inspection answer rather than a refusal. */
export interface ExplainSlot {
  readonly slot: string;
  readonly kind: "model" | "typed" | "shape";
  /** Model id for a model slot; data type id for a typed slot; output names for a shape slot. */
  readonly requires: readonly string[];
  readonly sources: readonly string[];
  readonly outcome: "compatible" | "incompatible" | "unproven" | "unbound";
  readonly message?: string;
}

export interface ExplainNode {
  readonly nodeId: string;
  readonly plugin?: string;
  readonly typeId?: string;
  readonly slots: readonly ExplainSlot[];
}

export interface ExplainReport {
  readonly nodes: readonly ExplainNode[];
  readonly diagnostics: readonly Diagnostic[];
  readonly lines: readonly string[];
}

function requirementNames(slot: SlotSpec): readonly string[] {
  switch (slot.kind) {
    case "model":
      return Object.freeze([slot.model.id]);
    case "typed":
      return Object.freeze([slot.type.id]);
    case "shape":
      return Object.freeze(Object.keys(slot.outputs));
    default:
      return unreachable(slot);
  }
}

function worse(left: SlotOutcome, right: SlotOutcome): SlotOutcome {
  if (left === "incompatible" || right === "incompatible") return "incompatible";
  if (left === "unproven" || right === "unproven") return "unproven";
  return "compatible";
}

function slotEdges(node: GraphNode, slot: string): readonly GraphEdge[] {
  return node.edges.filter((edge) => edge.requirement?.slot === slot).sort(compareEdges);
}

function typedOutcome(
  edge: GraphEdge,
  slot: Extract<SlotSpec, { kind: "typed" }>,
  source: GraphNode | undefined,
): { outcome: SlotOutcome; message?: string } {
  const contract = source?.contract;
  if (contract === undefined)
    return { outcome: "unproven", message: "the source has no committed contract." };
  if (contract.typeId !== undefined) {
    if (contract.typeId === slot.type.id) return { outcome: "compatible" };
    return {
      outcome: "incompatible",
      message: `the source is '${contract.typeId}', not '${slot.type.id}'.`,
    };
  }
  const producer = contract.outputs.values;
  if (producer === undefined)
    return { outcome: "incompatible", message: "the producer publishes no values output." };
  const checked = checkSlotOutput(producer, slot.type.spec);
  return {
    outcome: checked.outcome,
    ...(checked.message === undefined ? {} : { message: checked.message }),
  };
}

function modelOutcome(
  edge: GraphEdge,
  slot: Extract<SlotSpec, { kind: "model" }>,
  source: GraphNode | undefined,
): { outcome: SlotOutcome; message?: string } {
  void edge;
  const contract = source?.contract;
  if (contract === undefined)
    return { outcome: "unproven", message: "the source has no committed contract." };
  if (contract.typeId !== undefined) {
    if (slot.model.legacyTypeId !== undefined && contract.typeId === slot.model.legacyTypeId) {
      return { outcome: "compatible" };
    }
    return {
      outcome: "incompatible",
      message: `the source is '${contract.typeId}', not '${slot.model.id}'.`,
    };
  }
  const producer = contract.outputs.values;
  if (producer === undefined)
    return { outcome: "incompatible", message: "the producer publishes no values output." };
  if (producer.modelId === slot.model.id) {
    return { outcome: "compatible" };
  }
  return {
    outcome: "incompatible",
    message: `the source implements '${producer.modelId ?? "none"}', not '${slot.model.id}'.`,
  };
}

function shapeOutcome(
  edge: GraphEdge,
  slot: Extract<SlotSpec, { kind: "shape" }>,
  source: GraphNode | undefined,
): { outcome: SlotOutcome; message?: string } {
  void edge;
  const contract = source?.contract;
  if (contract === undefined)
    return { outcome: "unproven", message: "the source has no committed contract." };
  let outcome: SlotOutcome = "compatible";
  let message: string | undefined;
  for (const [output, required] of Object.entries(slot.outputs)) {
    const checked = checkSlotOutput(contract.outputs[output], required);
    outcome = worse(outcome, checked.outcome);
    if (message === undefined && checked.message !== undefined) message = checked.message;
  }
  return { outcome, ...(message === undefined ? {} : { message }) };
}

function explainNode(node: GraphNode, nodeById: ReadonlyMap<string, GraphNode>): ExplainNode {
  const contract = node.contract;
  if (contract?.plugin === undefined) {
    return Object.freeze({
      nodeId: node.id,
      ...(contract?.typeId === undefined ? {} : { typeId: contract.typeId }),
      slots: Object.freeze([]),
    });
  }
  const slots: ExplainSlot[] = [];
  for (const [slotName, slot] of Object.entries(contract.slots)) {
    const edges = slotEdges(node, slotName);
    if (edges.length === 0) {
      slots.push(
        Object.freeze({
          slot: slotName,
          kind: slot.kind,
          requires: requirementNames(slot),
          sources: Object.freeze([]),
          outcome: "unbound",
        }),
      );
      continue;
    }
    let outcome: SlotOutcome = "compatible";
    let message: string | undefined;
    for (const edge of edges) {
      const source = nodeById.get(edge.sourceId);
      let checked: { outcome: SlotOutcome; message?: string };
      switch (slot.kind) {
        case "model":
          checked = modelOutcome(edge, slot, source);
          break;
        case "typed":
          checked = typedOutcome(edge, slot, source);
          break;
        case "shape":
          checked = shapeOutcome(edge, slot, source);
          break;
        default:
          return unreachable(slot);
      }
      outcome = worse(outcome, checked.outcome);
      if (message === undefined && checked.message !== undefined) message = checked.message;
    }
    slots.push(
      Object.freeze({
        slot: slotName,
        kind: slot.kind,
        requires: requirementNames(slot),
        sources: Object.freeze(edges.map((edge) => edge.sourceId)),
        outcome,
        ...(message === undefined ? {} : { message }),
      }),
    );
  }
  return Object.freeze({
    nodeId: node.id,
    plugin: contract.plugin,
    ...(contract.typeId === undefined ? {} : { typeId: contract.typeId }),
    slots: Object.freeze(slots),
  });
}

function uncommittedNodes(
  project: ProjectDefinition,
  capabilities: PluginCapabilities,
): readonly GraphNode[] {
  const nodes: GraphNode[] = [];
  const diagnostics: Diagnostic[] = [];
  for (const motion of project.motions)
    for (const [index, track] of motion.tracks.entries()) {
      const node = collectTrack(track, "motion", motion.id, index, diagnostics);
      if (node !== undefined) nodes.push(node);
    }
  for (const [index, track] of (project.freeTracks ?? []).entries()) {
    const node = collectTrack(track, "free", "~", index, diagnostics);
    if (node !== undefined) nodes.push(node);
  }
  return nodes.map((node) => {
    const contract = deriveCommittedContract(node.track, node.id, capabilities);
    return contract === undefined ? node : Object.freeze({ ...node, contract });
  });
}

/** Inspects every node, slot binding and type fit without publishing anything. */
export function explain(
  project: ProjectDefinition,
  capabilities: PluginCapabilities = UNJUDGED_CAPABILITIES,
): ExplainReport {
  const built = buildGraphIR(project, capabilities);
  const graphNodes = built.graph?.nodes ?? uncommittedNodes(project, capabilities);
  const nodeById = new Map(graphNodes.map((node) => [node.id, node] as const));
  const nodes = graphNodes.map((node) => explainNode(node, nodeById));
  const lines = nodes.flatMap((node) =>
    node.slots.map(
      (slot) =>
        `${node.nodeId} [${slot.kind}:${slot.requires.join(",")}] <- ${slot.sources.join(",") || "(unbound)"}: ${slot.outcome}${slot.message === undefined ? "" : ` (${slot.message})`}`,
    ),
  );
  return Object.freeze({
    nodes: Object.freeze(nodes),
    diagnostics: built.diagnostics,
    lines: Object.freeze(lines),
  });
}
