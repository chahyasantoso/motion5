import type { PublisherComposition } from "./publisher-outcome";
import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic, Outputs, Structure } from "../contract/v5";
import type { BoundSlot, BoundSlotEntry, BoundSlots } from "./bound-slot";
import { isImmutableLeaf } from "../domain/values";
import { type GraphIR } from "../graph/ir";
import { compareEdges, type GraphNode } from "../graph/node";
import { firstPendingEdge } from "../graph/references";
/** One refusal of a composed value, named by the publication's rule. */
class CompositionOutputError extends TypeError {
  readonly ruleId = "composition-output-shape" as const;
  constructor(message: string) {
    super(message);
    this.name = this.ruleId;
  }
}
import { PluginNodeError } from "./plugin-output";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE, type PatchBatch } from "./patch-registry";
import {
  PublishFailureError,
  blockedOutcome,
  composedOutcome,
  failPublication,
  failedOutcome,
  firstBlockingSource,
  outcomeOf,
  pendingOutcome,
  publishFailureRule,
  type NodeOutcome,
} from "./publisher-outcome";
import { closeUpstream, reachable } from "./publisher-reach";
import { defineOwnValue } from "../lang/own-property";
import { unreachable } from "../lang/exhaustive";
import { isPlainRecord } from "../lang/plain-record";

/**
 * Node state before any plugin runs, as the node reports it. No `base`: topology, owned by
 * `resolveSolvers` on `SolveMember.base`; deriving it here = two owners. */
interface BoundInputs {
  readonly slots: BoundSlots;
  readonly sourceRevisions: Record<string, number>;
}

export interface PublisherNode extends GraphNode {
  readonly compose: (slots: BoundSlots) => PublisherComposition;
}
/**
 * Graph a flush runs over, one composer per node. `nodeById` narrowed so the publisher stops
 * rebuilding each tick; `dependants` from `GraphIR` unchanged. */
export interface PublisherSnapshot extends GraphIR {
  readonly nodes: readonly PublisherNode[];
  readonly nodeById: Readonly<Record<string, PublisherNode>>;
  readonly members?: ReadonlySet<string>;
}

// Only place a thrown value is classified: plugin diagnostics, publish failure as data,
// `CompositionOutputError`'s rule, else composition-failure.
function nodeFailure(nodeId: string, error: unknown): readonly Diagnostic[] {
  if (error instanceof PluginNodeError) return error.diagnostics;
  const ruleId =
    error instanceof PublishFailureError
      ? publishFailureRule(error.failure)
      : error instanceof CompositionOutputError
        ? error.ruleId
        : "composition-failure";
  return [
    diagnostic(ruleId, nodeId, error instanceof Error ? error.message : String(error), [nodeId]),
  ];
}
function isRendererNeutral(value: unknown, seen = new WeakSet<object>()): boolean {
  if (typeof value !== "object" || value === null) return isImmutableLeaf(value);
  if (seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.every((item) => isRendererNeutral(item, seen));
  if (!isPlainRecord(value)) return false;
  return Object.entries(value).every(
    ([key, item]) => !key.startsWith("_") && isRendererNeutral(item, seen),
  );
}
function validateComposition(outputs: unknown): asserts outputs is Outputs {
  if (!isPlainRecord(outputs) || !isRendererNeutral(outputs))
    throw new CompositionOutputError(
      "Composition output must contain only renderer-neutral values.",
    );
}

export class GraphPublisher {
  readonly #registry: PatchRegistry;
  readonly #structureOf: (sourceId: string) => Structure<unknown> | undefined;

  constructor(
    registry: PatchRegistry,
    options: { readonly structureOf?: (sourceId: string) => Structure<unknown> | undefined } = {},
  ) {
    this.#registry = registry;
    this.#structureOf = options.structureOf ?? (() => undefined);
  }

  flush(snapshot: PublisherSnapshot, seeds: readonly string[], tick: number): PatchBatch {
    if (this.#registry.notifying) throw new Error(REENTRANT_BATCH_MESSAGE);
    // Graph shape read, never derived: `finalizeGraph` owns it -> walks O(affected), not O(V+E);
    // steady-state tick allocates nothing.
    const byId = snapshot.nodeById;
    const isMember = (nodeId: string) =>
      snapshot.members ? snapshot.members.has(nodeId) : Object.hasOwn(byId, nodeId);
    const affected = closeUpstream(
      reachable(snapshot.dependants, seeds),
      byId,
      (sourceId) => this.#registry.get(sourceId) !== undefined,
      isMember,
    );
    // One map of one closed value: three Sets and a Map answered the same question, hand-ordered.
    const outcomes = new Map<string, NodeOutcome>();
    const outcomeFor = (nodeId: string) => outcomeOf(outcomes, nodeId);
    this.#registry.beginBatch(tick, seeds);
    try {
      for (const id of snapshot.order) {
        if (!affected.has(id)) continue;
        const node = byId[id];
        if (node === undefined) continue;
        outcomes.set(id, this.#publishNode(node, outcomeFor));
      }
      return this.#registry.closeBatch();
    } catch (error) {
      try {
        this.#registry.closeBatch();
      } catch {
        /* keep original failure */
      }
      throw error;
    }
  }

  /** Publish one node, answer what it became: one decision per node. Precedence: blocking ->
   * blocked, accepted-unpublished -> pending, throw -> failed. */
  #publishNode(node: PublisherNode, outcomeFor: (nodeId: string) => NodeOutcome): NodeOutcome {
    const id = node.id;
    const blocking = firstBlockingSource(node.edges, compareEdges, outcomeFor);
    if (blocking !== undefined) {
      this.#registry.publish({
        nodeId: id,
        status: "blocked",
        diagnostics: [
          diagnostic("blocked-upstream", id, `Blocked by upstream state at ${blocking}.`, [
            blocking,
            id,
          ]),
        ],
      });
      return blockedOutcome(blocking);
    }
    // Source accepted, nothing published (often not a member) -> pending, not failed: decided up
    // front, never by catching. graph/references.ts owns it.
    const outputsFor = (sourceId: string): Outputs | undefined => {
      const outcome = outcomeFor(sourceId);
      if (outcome.kind === "composed") return outcome.composition.outputs;
      return this.#registry.lastReady(sourceId)?.outputs;
    };
    const pendingMatch = firstPendingEdge(
      node.edges,
      compareEdges,
      (sourceId) => outputsFor(sourceId) !== undefined,
    );
    if (pendingMatch !== undefined) {
      this.#registry.publish({
        nodeId: id,
        status: "blocked",
        diagnostics: [pendingMatch.diagnostic],
      });
      return pendingOutcome(pendingMatch.diagnostic);
    }
    try {
      const collected = this.#bindSlots(node, outputsFor);
      const composed = node.compose(collected.slots);
      validateComposition(composed.outputs);
      const merged = {
        ...composed,
        sourceRevisions: { ...composed.sourceRevisions, ...collected.sourceRevisions },
      };
      this.#registry.publish({
        nodeId: id,
        outputs: merged.outputs,
        sourceProgress: merged.sourceProgress,
        sourceRevisions: merged.sourceRevisions,
        status: "ready",
        diagnostics: [],
      });
      return composedOutcome(merged);
    } catch (error) {
      const failures = nodeFailure(id, error);
      const first =
        failures[0] ??
        diagnostic("composition-failure", id, "Composition failed without a diagnostic.", [id]);
      this.#registry.publish({
        nodeId: id,
        status: "error",
        diagnostics: failures.length === 0 ? [first] : failures,
      });
      return failedOutcome(first);
    }
  }

  // One resolved slot map: source id, published outputs and the source's committed structure.
  #bindSlots(
    node: PublisherNode,
    outputsFor: (sourceId: string) => Outputs | undefined,
  ): BoundInputs {
    type MutableEntry =
      | { readonly kind: "single"; readonly bound: BoundSlot }
      | { readonly kind: "map"; readonly members: Record<string, BoundSlot> };
    const entries: Record<string, MutableEntry> = {};
    for (const [slot, binding] of Object.entries(node.track.input?.requires ?? {}))
      if (isPlainRecord(binding)) defineOwnValue(entries, slot, { kind: "map", members: {} });
    const sourceRevisions: Record<string, number> = {};
    for (const edge of [...node.edges].sort(compareEdges)) {
      const requirement = edge.requirement;
      const outputs = outputsFor(edge.sourceId);
      if (outputs === undefined)
        failPublication({ kind: "missing-upstream", sourceId: edge.sourceId });
      const sourcePatch = this.#registry.get(edge.sourceId);
      if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
      const structure = this.#structureOf(edge.sourceId);
      const bound: BoundSlot = Object.freeze({
        sourceId: edge.sourceId,
        values: outputs,
        ...(structure === undefined ? {} : { structure }),
      });
      if (requirement.memberKey === undefined) {
        defineOwnValue(entries, requirement.slot, { kind: "single", bound });
        continue;
      }
      const existing = entries[requirement.slot];
      if (existing === undefined) {
        const members: Record<string, BoundSlot> = {};
        defineOwnValue(members, requirement.memberKey, bound);
        defineOwnValue(entries, requirement.slot, { kind: "map", members });
        continue;
      }
      switch (existing.kind) {
        case "map":
          defineOwnValue(existing.members, requirement.memberKey, bound);
          break;
        case "single":
          throw new TypeError(`Slot '${requirement.slot}' mixes single and member bindings.`);
        default:
          return unreachable(existing);
      }
    }
    const slots: Record<string, BoundSlotEntry> = {};
    for (const [slot, entry] of Object.entries(entries)) {
      switch (entry.kind) {
        case "single":
          defineOwnValue(slots, slot, Object.freeze({ kind: "single", bound: entry.bound }));
          break;
        case "map":
          defineOwnValue(
            slots,
            slot,
            Object.freeze({ kind: "map", members: Object.freeze(entry.members) }),
          );
          break;
        default:
          return unreachable(entry);
      }
    }
    return { slots: Object.freeze(slots), sourceRevisions };
  }
}
