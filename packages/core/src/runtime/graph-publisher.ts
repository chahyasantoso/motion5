import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic, Outputs, ResolvedRequires } from "../contract/v5";
import { isImmutableLeaf } from "../domain/values";
import { compareEdges, type GraphIR, type GraphNode } from "../graph/ir";
import { firstPendingEdge } from "../graph/references";
/** One refusal of a composed value, named by the publication's rule. */
class CompositionOutputError extends TypeError {
  readonly ruleId = "composition-output-shape" as const;
  constructor(message: string) {
    super(message);
    this.name = this.ruleId;
  }
}
type PluginInputs = Readonly<Record<string, unknown>>;
type RequirementInputs = Readonly<Record<string, PluginInputs>>;
import { PluginNodeError } from "./plugin-output";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE, type PatchBatch } from "./patch-registry";
import {
  PublishFailureError,
  blockedOutcome,
  composedOutcome,
  expectInputRecord,
  expectRecord,
  failPublication,
  failedOutcome,
  firstBlockingSource,
  hasValue,
  isRecord,
  outcomeOf,
  pendingOutcome,
  publishFailureRule,
  sourceValues,
  type NodeOutcome,
  type SourceValues,
} from "./publisher-outcome";
import { closeUpstream, reachable } from "./publisher-reach";
import { defineOwnValue } from "../lang/own-property";

/**
 * Node state before any plugin runs, as the node reports it. No `base`: topology, owned by
 * `resolveSolvers` on `SolveMember.base`; deriving it here = two owners. */
export interface PublisherComposition {
  readonly outputs: Outputs;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  /** Warnings a plugin's optional `validate` returned, on the ready patch. */
  readonly diagnostics?: readonly Diagnostic[];
}

interface IdentifiedInputs {
  readonly requires: ResolvedRequires;
  readonly sourceRevisions: Record<string, number>;
}

const EMPTY_IDENTIFIED_INPUTS: IdentifiedInputs = Object.freeze({
  requires: Object.freeze({}),
  sourceRevisions: Object.freeze({}),
});
export interface PublisherNode extends GraphNode {
  /** Compose against scoped requirement inputs: record per plugin, entry per slot. One parameter,
   * no flat bag: no upstream value enters the authored namespace. */
  readonly compose: (requirementInputs: RequirementInputs) => PublisherComposition;
  /** Identified-table path, used when the node selects a plugin. Full named outputs, not grouped
   * `values`. */
  readonly composeIdentified?: (requires: ResolvedRequires) => PublisherComposition;
}
/**
 * Graph a flush runs over, one composer per node. `nodeById` narrowed so the publisher stops
 * rebuilding each tick; `dependants` from `GraphIR` unchanged. */
export interface PublisherSnapshot extends GraphIR {
  readonly nodes: readonly PublisherNode[];
  readonly nodeById: Readonly<Record<string, PublisherNode>>;
  readonly members?: ReadonlySet<string>;
}
export interface PublisherFailure {
  readonly nodeId: string;
  readonly error: unknown;
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
  if (!isRecord(value)) return false;
  return Object.entries(value).every(
    ([key, item]) => !key.startsWith("_") && isRendererNeutral(item, seen),
  );
}
function validateComposition(outputs: unknown): asserts outputs is Outputs {
  if (!isRecord(outputs) || !isRendererNeutral(outputs))
    throw new CompositionOutputError(
      "Composition output must contain only renderer-neutral values.",
    );
}
// Freeze inputs one level down: composer cannot reach accumulator. No projection — slot is
// scope, values arrive whole by name. Dicts freeze where assembled.
function freezeRequirementInputs(
  collected: Readonly<Record<string, Record<string, unknown>>>,
): RequirementInputs {
  const scoped: Record<string, Readonly<Record<string, unknown>>> = {};
  for (const [plugin, slots] of Object.entries(collected))
    scoped[plugin] = Object.freeze({ ...slots });
  return Object.freeze(scoped) as RequirementInputs;
}

export class GraphPublisher {
  readonly #registry: PatchRegistry;

  constructor(registry: PatchRegistry) {
    this.#registry = registry;
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
    // `lastReady` not `get`: non-ready patch owns no values; `sourceValues` fallback wants last
    // composed pose.
    const valuesFor = (sourceId: string) =>
      sourceValues(outcomeFor(sourceId), this.#registry.lastReady(sourceId));
    this.#registry.beginBatch(tick, seeds);
    try {
      for (const id of snapshot.order) {
        if (!affected.has(id)) continue;
        const node = byId[id];
        if (node === undefined) continue;
        outcomes.set(id, this.#publishNode(node, byId, outcomeFor, valuesFor));
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
  #publishNode(
    node: PublisherNode,
    byId: PublisherSnapshot["nodeById"],
    outcomeFor: (nodeId: string) => NodeOutcome,
    valuesFor: (sourceId: string) => SourceValues,
  ): NodeOutcome {
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
    const pendingMatch = firstPendingEdge(node.edges, compareEdges, (sourceId) =>
      node.composeIdentified === undefined
        ? hasValue(valuesFor(sourceId))
        : outputsFor(sourceId) !== undefined,
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
      const collected = this.#collectInputs(node, byId, valuesFor, outputsFor);
      const composed = node.composeIdentified
        ? node.composeIdentified(collected.identified)
        : node.compose(collected.inputs);
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
        diagnostics: merged.diagnostics ?? [],
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

  /** Scoped requirement inputs for one node, plus source revisions. Solver join first: solver
   * members scope under the plugin its root edge names. */
  #collectInputs(
    node: PublisherNode,
    byId: PublisherSnapshot["nodeById"],
    valuesFor: (sourceId: string) => SourceValues,
    outputsFor: (sourceId: string) => Outputs | undefined,
  ): {
    readonly inputs: RequirementInputs;
    readonly identified: ResolvedRequires;
    readonly sourceRevisions: Record<string, number>;
  } {
    const identified =
      node.composeIdentified === undefined
        ? EMPTY_IDENTIFIED_INPUTS
        : this.#collectIdentifiedInputs(node, outputsFor);
    if (node.composeIdentified !== undefined)
      return {
        inputs: Object.freeze({}),
        identified: identified.requires,
        sourceRevisions: identified.sourceRevisions,
      };
    const collected: Record<string, Record<string, unknown>> = {};
    // One accumulator per dict slot, beside `collected` until loop ends: assembled apart so each
    // record freezes once, when complete.
    const memberSlots = new Map<string, Map<string, Record<string, unknown>>>();
    const sourceRevisions: Record<string, number> = {};

    for (const edge of [...node.edges].sort(compareEdges)) {
      const sourcePatch = this.#registry.get(edge.sourceId);
      // Unreachable in normal flow: pending pre-check classified every edge. Guard only; failures
      // named by the reader raising them.
      const sourceRecord = expectInputRecord(valuesFor(edge.sourceId), edge.sourceId);
      if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
      const requirement = edge.requirement;
      // Dict entry lands under authored key inside slot, not at slot: N entries at slot = one
      // destination, last edge wins, rest dropped silently.
      if (requirement.memberKey !== undefined) {
        const slots = memberSlots.get(requirement.plugin) ?? new Map();
        memberSlots.set(requirement.plugin, slots);
        const members = slots.get(requirement.slot) ?? {};
        slots.set(requirement.slot, members);
        // Every authored member stays own data property, including "__proto__".
        defineOwnValue(members, requirement.memberKey, sourceRecord);
        continue;
      }
      // Slot is scope: values arrive whole by name. No projection, no flat merge: no key collides,
      // no guard needed.
      (collected[requirement.plugin] ??= {})[requirement.slot] = sourceRecord;
    }
    // Frozen at assembly, canonical key order: collected over `edgesByRole` (sorts `compareEdges`),
    // member key last tiebreak.
    for (const [plugin, slots] of memberSlots)
      for (const [slot, members] of slots)
        (collected[plugin] ??= {})[slot] = Object.freeze(members);
    // One memo, `Track`'s: key = seed + scoped inputs; members ride inside, so lengths, root, target,
    // solver state compare together. Inputs+members alone stale on animation.
    return {
      inputs: freezeRequirementInputs(collected),
      identified: identified.requires,
      sourceRevisions: { ...sourceRevisions, ...identified.sourceRevisions },
    };
  }

  // Named outputs for identified node, by slot and member key. Empty authored map -> empty member
  // record ({} is a binding the plugin decides); PluginTrack narrows it.
  #collectIdentifiedInputs(
    node: PublisherNode,
    outputsFor: (sourceId: string) => Outputs | undefined,
  ): IdentifiedInputs {
    interface SlotBinding {
      single?: Outputs;
      members?: Record<string, Outputs>;
    }
    const slots = new Map<string, SlotBinding>();
    for (const [slot, binding] of Object.entries(node.track.input?.requires ?? {}))
      if (isRecord(binding)) slots.set(slot, { members: {} });
    const sourceRevisions: Record<string, number> = {};
    for (const edge of [...node.edges].sort(compareEdges)) {
      const requirement = edge.requirement;
      const outputs = outputsFor(edge.sourceId);
      if (outputs === undefined)
        failPublication({ kind: "missing-upstream", sourceId: edge.sourceId });
      const sourcePatch = this.#registry.get(edge.sourceId);
      if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
      const entry = slots.get(requirement.slot) ?? {};
      if (requirement.memberKey === undefined) entry.single = outputs;
      else (entry.members ??= {})[requirement.memberKey] = outputs;
      slots.set(requirement.slot, entry);
    }
    const requires: Record<string, Outputs | Record<string, Outputs>> = {};
    for (const [slot, entry] of slots) {
      if (entry.single !== undefined) requires[slot] = entry.single;
      else if (entry.members !== undefined) requires[slot] = Object.freeze(entry.members);
    }
    return { requires: Object.freeze(requires), sourceRevisions };
  }
}
