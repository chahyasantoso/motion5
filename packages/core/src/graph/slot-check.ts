import type { Diagnostic, FieldSpec, ValueSpec } from "../contract/v5";
import type { SourceContract } from "../contract/v5-infer";
import { diagnostic } from "../contract/diagnostics";
import { compareEdges, type GraphEdge, type GraphNode } from "./ir";

/** Load-time structural verdicts: `compatible` found every stated requirement, `incompatible` is a known contradiction, and `unproven` is missing evidence, not the same as compatible. */
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

// The only admitting outcome; refusals name `slot-incompatible` or `slot-unproven`.
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

/** Compares one producer output with the slot's `ValueSpec`: an absent producer fits only an optional slot output; an optional producer output is unproven for a required slot output. */
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

function describeOutputSpec(spec: ValueSpec): string {
  return spec.kind;
}

function pathFor(edge: GraphEdge, output: string): string {
  const requirement = edge.requirement;
  if (requirement === undefined) return `${edge.observerId}.outputs.${output}`;
  const member = requirement.memberKey === undefined ? "" : `.${requirement.memberKey}`;
  return `${edge.observerId}.input.requires.${requirement.slot}${member}.outputs.${output}`;
}

/** Every slot check the graph can answer, in canonical order, from committed contracts only; contractless nodes and unbound slots are skipped; `graph/dependency-check.ts` owns admission. */
export function checkSlotFit(nodes: readonly GraphNode[]): readonly Diagnostic[] {
  const nodeById = new Map(nodes.map((node) => [node.id, node] as const));
  const diagnostics: Diagnostic[] = [];
  for (const node of nodes) {
    const contract = node.contract;
    if (contract?.plugin === undefined) continue;
    const edgeBySlot = new Map<string, GraphNode["edges"]>();
    for (const edge of node.edges) {
      const requirement = edge.requirement;
      if (requirement === undefined || requirement.plugin !== contract.plugin) continue;
      const found = edgeBySlot.get(requirement.slot) ?? [];
      edgeBySlot.set(requirement.slot, [...found, edge]);
    }
    for (const [slot, edges] of edgeBySlot) {
      const spec = contract.slots[slot];
      if (spec === undefined) continue;
      for (const edge of [...edges].sort(compareEdges)) {
        const producer = nodeById.get(edge.sourceId)?.contract?.outputs;
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
