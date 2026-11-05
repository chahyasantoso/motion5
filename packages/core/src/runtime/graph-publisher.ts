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
import { PluginNodeError } from "./plugin-output";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE, type PatchBatch } from "./patch-registry";
import {
  PublishFailureError,
  blockedOutcome,
  composedOutcome,
  failPublication,
  failedOutcome,
  firstBlockingSource,
  isRecord,
  outcomeOf,
  pendingOutcome,
  publishFailureRule,
  type NodeOutcome,
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

export interface PublisherNode extends GraphNode {
  readonly compose: (requires: ResolvedRequires) => PublisherComposition;
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
      const collected = this.#collectIdentifiedInputs(node, outputsFor);
      const composed = node.compose(collected.requires);
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
      else defineOwnValue((entry.members ??= {}), requirement.memberKey, outputs);
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
