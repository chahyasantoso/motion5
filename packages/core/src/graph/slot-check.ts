import type { Diagnostic, FieldSpec, ValueSpec } from "../contract/v5";
import type { SourceContract } from "../contract/v5-infer";
import { deriveSourceContract } from "../contract/v5-infer";
import { diagnostic } from "../contract/diagnostics";
import { parseTrackDefinition } from "../contract/v5-parse";
import { compareEdges, edgeRequirement, type GraphEdge, type GraphNode } from "./ir";
import type { PluginCapabilities } from "../ports/plugin-capabilities";

/**
 * The load-time structural check between one producer's output contract and one consumer slot.
 *
 * Three outcomes, and only two of them refuse. `compatible` means every structural requirement the
 * slot states was found. `incompatible` means a known contradiction exists. `unproven` means the
 * evidence is insufficient, which is not the same thing as compatible: an empty undeclared source
 * cannot satisfy a required typed field, and no reader may turn that silence into `any`.
 *
 * Ranges, row counts and semantic relationships stay out. They are runtime validation's question,
 * and passing this check is not a proof of them.
 */
export type SlotOutcome = "compatible" | "incompatible" | "unproven";

export interface SlotCheck {
  readonly outcome: SlotOutcome;
  readonly message?: string;
}

function fieldsOf(spec: ValueSpec): Readonly<Record<string, FieldSpec>> {
  return spec.kind === "table" ? spec.schema.row.fields : spec.fields;
}

function kindName(spec: ValueSpec): string {
  return spec.kind;
}

function incompatible(message: string): SlotCheck {
  return Object.freeze({ outcome: "incompatible", message });
}

function unproven(message: string): SlotCheck {
  return Object.freeze({ outcome: "unproven", message });
}

const COMPATIBLE: SlotCheck = Object.freeze({ outcome: "compatible" });

function checkFields(producer: SourceContract, required: ValueSpec): SlotCheck {
  const producerFields = fieldsOf(producer.spec);
  for (const [name, field] of Object.entries(fieldsOf(required))) {
    const found = producerFields[name];
    if (found === undefined) {
      if (field.optional === true) continue;
      if (!producer.proven)
        return unproven(
          `field '${name}' is required but the producer is an empty undeclared source.`,
        );
      return incompatible(`field '${name}' is required but the producer does not declare it.`);
    }
    if (found.kind !== field.kind)
      return incompatible(
        `field '${name}' is ${found.kind} on the producer but ${field.kind} in the slot.`,
      );
    if (field.optional !== true && found.optional === true)
      return incompatible(
        `field '${name}' may be absent on the producer but the slot requires it.`,
      );
  }
  return COMPATIBLE;
}

/**
 * Compare one producer output with the `ValueSpec` the consumer slot declares for it.
 *
 * `producer` is absent when the producer does not publish that output at all. A slot output may
 * declare `optional`; then absence is compatible. A producer output that is itself optional is
 * unproven for a required slot output, because the value may be absent at run time even though the
 * contract names it.
 */
export function checkSlotOutput(
  producer: SourceContract | undefined,
  required: ValueSpec,
): SlotCheck {
  if (producer === undefined) {
    if (required.optional === true) return COMPATIBLE;
    return incompatible("the producer does not publish this output.");
  }
  if (producer.spec.kind !== required.kind)
    return incompatible(
      `the producer publishes a ${kindName(producer.spec)} but the slot requires a ${kindName(required)}.`,
    );
  if (required.optional !== true && producer.spec.optional === true)
    return unproven("the producer declares this output optional, so its presence is unproven.");
  return checkFields(producer, required);
}

function outputsOf(
  node: GraphNode,
  capabilities: PluginCapabilities,
): Readonly<Record<string, SourceContract>> | undefined {
  const pluginId = node.track.plugin;
  if (pluginId === undefined) {
    const parsed = parseTrackDefinition(node.track, node.id);
    if (parsed.kind === "refused") return undefined;
    const inferred = deriveSourceContract(
      parsed.value.input.values,
      parsed.value.input.schema,
      `${node.id}.input.values`,
    );
    if (inferred.kind === "refused") return undefined;
    return Object.freeze({ values: inferred.value });
  }
  const definition = capabilities.pluginDefinition?.(pluginId);
  if (definition === undefined) return undefined;
  const outputs: Record<string, SourceContract> = {};
  for (const [name, spec] of Object.entries(definition.outputs))
    outputs[name] = Object.freeze({ spec, proven: true });
  return Object.freeze(outputs);
}

function describeOutputSpec(spec: ValueSpec): string {
  return spec.kind;
}

function pathFor(edge: GraphEdge, output: string): string {
  const requirement = edgeRequirement(edge);
  if (requirement === undefined) return `${edge.observerId}.outputs.${output}`;
  const member = requirement.memberKey === undefined ? "" : `.${requirement.memberKey}`;
  return `${edge.observerId}.input.requires.${requirement.slot}${member}.outputs.${output}`;
}

/**
 * Every slot check the graph can answer, in canonical order.
 *
 * A producer's contract is derived once per node. A slot with no bound edge is not checked here:
 * `graph/dependency-check.ts` owns required-slot presence, and an omitted optional slot has nothing
 * to compare. Map members are separate edges and therefore separate checks.
 */
export function checkSlotFit(
  nodes: readonly GraphNode[],
  capabilities: PluginCapabilities,
): readonly Diagnostic[] {
  if (capabilities.pluginDefinition === undefined) return Object.freeze([]);
  const contracts = new Map<string, Readonly<Record<string, SourceContract>> | undefined>();
  for (const node of nodes) contracts.set(node.id, outputsOf(node, capabilities));

  const diagnostics: Diagnostic[] = [];
  for (const node of nodes) {
    const pluginId = node.track.plugin;
    if (pluginId === undefined) continue;
    const definition = capabilities.pluginDefinition(pluginId);
    if (definition === undefined) continue;
    const slots = definition.inputs.requires ?? {};
    const edgeBySlot = new Map<string, GraphNode["edges"]>();
    for (const edge of node.edges) {
      const requirement = edgeRequirement(edge);
      if (requirement === undefined || requirement.plugin !== pluginId) continue;
      const found = edgeBySlot.get(requirement.slot) ?? [];
      edgeBySlot.set(requirement.slot, [...found, edge]);
    }
    for (const [slot, edges] of edgeBySlot) {
      const spec = slots[slot];
      if (spec === undefined) continue;
      for (const edge of [...edges].sort(compareEdges)) {
        const producer = contracts.get(edge.sourceId);
        if (producer === undefined) continue;
        for (const [output, required] of Object.entries(spec.outputs)) {
          const result = checkSlotOutput(producer[output], required);
          if (result.outcome === "compatible") continue;
          const ruleId = result.outcome === "incompatible" ? "slot-incompatible" : "slot-unproven";
          diagnostics.push(
            diagnostic(
              ruleId,
              pathFor(edge, output),
              `Slot '${slot}' output '${output}' (${describeOutputSpec(required)}) ${result.message ?? ""}`.trim(),
            ),
          );
        }
      }
    }
  }
  return Object.freeze(diagnostics);
}
