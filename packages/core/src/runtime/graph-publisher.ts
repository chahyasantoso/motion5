import { diagnostic } from "../contract/diagnostics";
import type { Diagnostic } from "../contract/v5";
import { compareEdges, type GraphEdge, type GraphIR, type GraphNode } from "../graph/ir";
import { firstPendingEdge } from "../graph/references";
import { CompositionOutputError } from "../domain/track";
import type { RequirementInputs } from "../domain/plugins";
import { PatchRegistry, REENTRANT_BATCH_MESSAGE, type PatchBatch } from "./patch-registry";
import {
  PublishFailureError,
  blockedOutcome,
  composedOutcome,
  expectInputRecord,
  expectOutputRecord,
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

/**
 * One node's timeline state before any plugin runs, as the node itself reports it.
 *
 * It carries no `base`, deliberately. Which node a member hangs from is topology; `resolveSolvers`
 * already derived it into `SolveMember.base`. Having the supplier of `interpolated` re-derive it
 * from the member's edges made one fact answerable in two places, and taught `engine.ts` a
 * requirement slot name it had no reason to know. See ADR-051.
 */
export interface MemberState {
  readonly id: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
}
/**
 * One chain member as its solver receives it: what the member reported, plus where the derivation
 * says it sits. The publisher joins the two, so neither side has to know the other's half.
 *
 * `goal` is the third part of that join and it is present only on a chain leaf the author addressed.
 * It carries the goal node's published values rather than its id, because a plugin holds no registry
 * and reading one would make the solver a graph consumer. See issue #195.
 */
export interface SolverMember extends MemberState {
  readonly base: string;
  readonly goal?: Readonly<Record<string, unknown>>;
}

export interface PublisherComposition {
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
}
export interface PublisherNode extends GraphNode {
  /**
   * Composes the node against its scoped requirement inputs: one record per plugin, one entry per
   * requirement slot the track bound.
   *
   * One parameter, and deliberately only one. There is no flat bag beside it, so there is no code
   * path by which an upstream value can enter the node's authored value namespace. That is a
   * stronger guarantee than "no caller merges one": no parameter exists to merge one with.
   * See ADR-044 and ADR-047.
   */
  readonly compose: (requirementInputs: RequirementInputs) => PublisherComposition;
  readonly interpolated?: () => MemberState;
}
/**
 * The graph a flush runs over, with a composer on every node.
 *
 * `nodeById` narrows too, and that narrowing is what lets the publisher stop rebuilding it. The
 * runtime already assembles that map from the very nodes it puts in `nodes`, so the publisher was
 * walking `nodes` once per tick to recover types the snapshot could simply carry. `dependants` comes
 * from `GraphIR` unchanged, derived once per graph by `finalizeGraph`.
 */
export interface PublisherSnapshot extends GraphIR {
  readonly nodes: readonly PublisherNode[];
  readonly nodeById: Readonly<Record<string, PublisherNode>>;
  readonly members?: ReadonlySet<string>;
}
export interface PublisherFailure {
  readonly nodeId: string;
  readonly error: unknown;
}

/**
 * The diagnostic one node's failure becomes, and the one place a thrown value is classified.
 *
 * Two `instanceof` checks where there were three, and the pair that is left is the pair that means
 * something. `PublishFailureError` carries this publisher's own failure as data, so its rule id is a
 * total function of that data rather than a field on one of two classes. `CompositionOutputError` is
 * the domain's, thrown by `validateComposition` here and reachable from inside `node.compose`, so its
 * class is the only thing that identifies it and `domain/track.ts` owns it. Anything else a composer
 * throws is a composition failure with no name of its own, which is what it was. Issue #443.
 *
 * Named `nodeFailure` rather than `diagnostic`, because it classifies a thrown value and holds no
 * shape of its own. The frozen object, the frozen payload and the severity all come from the one
 * constructor now. The old name said constructor while the body was a classifier, and the body was
 * one of the four raw literals that spelled `severity: "error"` for itself; the rename and the
 * collapse are the same correction rather than two. See ADR-097 and issue #449.
 */
function nodeFailure(nodeId: string, error: unknown): Diagnostic {
  const ruleId =
    error instanceof PublishFailureError
      ? publishFailureRule(error.failure)
      : error instanceof CompositionOutputError
        ? error.ruleId
        : "composition-failure";
  return diagnostic(ruleId, nodeId, error instanceof Error ? error.message : String(error), [
    nodeId,
  ]);
}
/**
 * A node's edges of one role in canonical order. `compareEdges` in `graph/ir.ts` is the only
 * ordering owner, so which source wins an output merge is never authored-order dependent and
 * never a property of how an id encodes.
 *
 * `role` names the composition phase: inputs are collected before `node.compose`, outputs are
 * merged after it. Every input edge now carries a requirement, so this split is also the split
 * between derived dependencies and authored `observes` entries. See ADR-047.
 */
function edgesByRole(node: PublisherNode, role: GraphEdge["role"]): readonly GraphEdge[] {
  return node.edges.filter((edge) => edge.role === role).sort(compareEdges);
}
/**
 * The plugin whose slots a solver's members belong under, read off the edge that made it a solver.
 *
 * The publisher holds no plugin knowledge, and this is where that stays true. A hardcoded `ik` here
 * would deliver a spring integrator's or a spline sampler's members under the name of the plugin
 * that happened to be IK's, which would make the first non-kinematic solver an edit to this file
 * rather than a plugin. `resolveSolvers` classifies a solver by its `root` edge, so the same edge
 * names the scope. See ADR-051.
 */
function solvingPluginOf(node: PublisherNode): string | undefined {
  return node.edges
    .filter((edge) => edge.role === "input" && edge.requirement?.slot === "root")
    .sort(compareEdges)[0]?.requirement?.plugin;
}
function isRendererNeutral(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null) return true;
  if (typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.every((item) => isRendererNeutral(item, seen));
  if (!isRecord(value)) return false;
  return Object.entries(value).every(
    ([key, item]) => !key.startsWith("_") && isRendererNeutral(item, seen),
  );
}
function validateComposition(values: unknown): asserts values is Readonly<Record<string, unknown>> {
  if (!isRecord(values) || !isRendererNeutral(values))
    throw new CompositionOutputError(
      "Composition output must contain only renderer-neutral values.",
    );
}
function mergeValues(
  base: Readonly<Record<string, unknown>>,
  overlay: Readonly<Record<string, unknown>> | undefined,
): Readonly<Record<string, unknown>> {
  return overlay === undefined ? base : Object.freeze({ ...base, ...overlay });
}
/**
 * Freezes the collected scoped inputs one level down, so a composer cannot reach back into the
 * publisher's accumulator. There is no projection step: the slot is the scope, so the source's
 * values arrive whole and under their own names. See ADR-044.
 *
 * One level is still enough with dict-valued slots in play, because a dict is frozen where it is
 * assembled rather than here: nesting the freeze would make this function walk a shape it does not
 * own. See ADR-057.
 */
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
    // Graph shape is read, never derived. Both of these were rebuilt here on every tick, and the
    // second walked every edge of every node plus every solver's members to do it, over a graph that
    // changes at most once between ticks. `finalizeGraph` owns both now, so the two walks below cost
    // O(affected) instead of O(V+E) and a steady-state tick allocates nothing for graph shape.
    const byId = snapshot.nodeById;
    const isMember = (nodeId: string) =>
      snapshot.members ? snapshot.members.has(nodeId) : Object.hasOwn(byId, nodeId);
    const affected = closeUpstream(
      reachable(snapshot.dependants, seeds),
      byId,
      (sourceId) => this.#registry.get(sourceId) !== undefined,
      isMember,
    );
    // One map of one closed value, where three Sets and a Map answered the same question and the
    // order to ask them in was written out by hand at the top of the loop.
    const outcomes = new Map<string, NodeOutcome>();
    const outcomeFor = (nodeId: string) => outcomeOf(outcomes, nodeId);
    // `lastReady` rather than `get`: a non-ready patch owns no values now, and the pose every
    // fallback in `sourceValues` has always wanted is the last one a composition produced. See
    // ADR-098.
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
        /* preserve original flush failure */
      }
      throw error;
    }
  }

  /**
   * Publishes one node and answers what it ended up as, which is the one decision per node.
   *
   * The precedence is the order it always was and is now stated by three steps rather than by a
   * disjunction over three collections: a source in a state that stops this node blocks it, a source
   * that graph construction accepted and nothing has published leaves it pending, and anything its own
   * composition throws fails it. Each of the three publishes exactly what it published before.
   */
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
    // A source that graph construction already accepted but that has not published a
    // value yet (typically because it is not currently a member) is pending, not failed.
    // Classified up front, before composition is attempted, so this is never decided by
    // catching an exception. graph/references.ts is the single owner of this decision.
    const pendingMatch = firstPendingEdge(node.edges, compareEdges, (sourceId) =>
      hasValue(valuesFor(sourceId)),
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
      const collected = this.#collectInputs(node, byId, valuesFor);
      const composed = node.compose(collected.inputs);
      validateComposition(composed.values);
      const merged = this.#mergeOutputs(node, composed, collected.sourceRevisions, valuesFor);
      this.#registry.publish({
        nodeId: id,
        values: merged.values,
        sourceProgress: merged.sourceProgress,
        sourceRevisions: merged.sourceRevisions,
        status: "ready",
        diagnostics: [],
      });
      return composedOutcome(merged);
    } catch (error) {
      const failure = nodeFailure(id, error);
      this.#registry.publish({
        nodeId: id,
        status: "error",
        diagnostics: [failure],
      });
      return failedOutcome(failure);
    }
  }

  /**
   * The scoped requirement inputs one node composes against, and the revisions its sources carry.
   *
   * The solver join and the input phase, in that order, because a solver's members are scoped under
   * the plugin its own root edge names and the loop below delivers every other slot. Every failure it
   * can raise is named data now rather than one of three error classes.
   */
  #collectInputs(
    node: PublisherNode,
    byId: PublisherSnapshot["nodeById"],
    valuesFor: (sourceId: string) => SourceValues,
  ): {
    readonly inputs: RequirementInputs;
    readonly sourceRevisions: Record<string, number>;
  } {
    const collected: Record<string, Record<string, unknown>> = {};
    // One accumulator per dict-valued slot, kept beside `collected` until the input loop is
    // done. Assembled separately rather than merged in place so the slot's own record is
    // frozen once, at a point where it is known to be complete.
    const memberSlots = new Map<string, Map<string, Record<string, unknown>>>();
    const sourceRevisions: Record<string, number> = {};
    if (node.solves && node.solves.length > 0) {
      const solvingPlugin = solvingPluginOf(node);
      // Unreachable through `resolveSolvers`, which derives `solves` only for a node holding
      // a `root` edge. Failed rather than defaulted to a plugin name, because a publisher
      // that guesses one is the thing this lookup exists to delete.
      if (solvingPlugin === undefined) failPublication({ kind: "solver-scope", nodeId: node.id });
      const membersList: SolverMember[] = [];
      for (const memberRef of node.solves) {
        const memberNode = byId[memberRef.id];
        if (typeof memberNode?.interpolated !== "function")
          failPublication({ kind: "member-interpolation", memberId: memberRef.id });
        // `base` comes off `solves`, where `resolveSolvers` already derived it, rather than
        // from a second walk over the member's edges by whoever supplies `interpolated`.
        const state = memberNode.interpolated();
        // And so does `goal`, for the same reason: a goal is one authored dict entry that
        // `readPluginBindings` expanded into its own binding, so the node it names is an
        // ordinary input edge of this solver and is already resolved by the pending check
        // above. The slot delivers that same value under the author's own key through the
        // loop below; this join is what carries the qualified member id, which is the one
        // thing a plugin holding no graph cannot recover. The guard is the same defensive
        // invariant the input loop carries.
        let goal: Readonly<Record<string, unknown>> | undefined;
        if (memberRef.goal !== undefined) {
          goal = expectRecord(valuesFor(memberRef.goal), {
            kind: "goal-shape",
            nodeId: node.id,
            memberId: memberRef.id,
            goalId: memberRef.goal,
          });
        }
        membersList.push(
          Object.freeze(
            goal === undefined
              ? { ...state, base: memberRef.base }
              : { ...state, base: memberRef.base, goal },
          ),
        );
      }
      (collected[solvingPlugin] ??= {}).members = Object.freeze(membersList);
    }
    for (const edge of edgesByRole(node, "input")) {
      const sourcePatch = this.#registry.get(edge.sourceId);
      // Unreachable in normal flow: the pending pre-check above already classified every
      // edge as resolved before this loop runs. Kept as a defensive invariant guard only,
      // and both of its failures are named by the reader that raises them.
      const sourceRecord = expectInputRecord(valuesFor(edge.sourceId), edge.sourceId);
      if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
      const requirement = edge.requirement;
      // Unreachable by construction now that `observes` is output-only: every input edge is
      // derived from a binding and carries its scope. Thrown rather than skipped, because an
      // edge in the input phase with nothing to scope it has no destination at all, and a
      // silent skip would drop a dependency graph construction accepted. Same shape as the
      // two guards above. See ADR-047.
      if (requirement === undefined) failPublication({ kind: "input-requirement", edge });
      // A dict entry is delivered under its authored key inside the slot rather than at the
      // slot itself. Assigning at the slot gave N entries one destination, so the last edge
      // in canonical order was the only one that arrived and the rest were dropped with no
      // diagnostic: survivable only while nothing read the channel, which is exactly how the
      // next consumer of it inherits a last-write-wins bug. See ADR-057.
      if (requirement.memberKey !== undefined) {
        const slots = memberSlots.get(requirement.plugin) ?? new Map();
        memberSlots.set(requirement.plugin, slots);
        const members = slots.get(requirement.slot) ?? {};
        slots.set(requirement.slot, members);
        members[requirement.memberKey] = sourceRecord;
        continue;
      }
      // The slot is the scope, so the source's values arrive whole and under their own names.
      // Nothing is projected and nothing is flat-merged, so there is no key left to collide
      // with and no collision guard left to reach. See ADR-044.
      (collected[requirement.plugin] ??= {})[requirement.slot] = sourceRecord;
    }
    // Frozen at assembly, in canonical key order: the entries were collected over
    // `edgesByRole`, which sorts by `compareEdges`, and the member key is its last tiebreak.
    for (const [plugin, slots] of memberSlots)
      for (const [slot, members] of slots)
        (collected[plugin] ??= {})[slot] = Object.freeze(members);
    // One memo, and it is `Track`'s. Its key is the seed as well as the requirement inputs,
    // and the members travel inside those inputs, so member lengths are covered by the same
    // comparison that covers the root and the target, together with the solver's own
    // interpolated state and progress. A second cache keyed on inputs and members alone
    // looked like an optimisation and was strictly weaker: an animated value on a solver
    // track changed nothing in that key, so the solver held still after tick one with no
    // error and no diagnostic. See ADR-051.
    return { inputs: freezeRequirementInputs(collected), sourceRevisions };
  }

  /**
   * Merges every output observation onto one composition, in canonical edge order.
   *
   * The output phase, named. Which source wins is `compareEdges`'s and never authored order, and the
   * revisions this collects join the ones the input phase collected, because a patch records what it
   * read on both sides of `compose`. See ADR-034 and ADR-047.
   */
  #mergeOutputs(
    node: PublisherNode,
    composed: PublisherComposition,
    sourceRevisions: Record<string, number>,
    valuesFor: (sourceId: string) => SourceValues,
  ): PublisherComposition {
    let values = composed.values;
    for (const edge of edgesByRole(node, "output")) {
      const sourcePatch = this.#registry.get(edge.sourceId);
      // Unreachable in normal flow, same reasoning as the input-side guard. Renderer neutrality is
      // asked after the shape, and both answer under the one rule id this side has.
      const sourceRecord = expectOutputRecord(valuesFor(edge.sourceId), edge.sourceId);
      if (!isRendererNeutral(sourceRecord))
        failPublication({ kind: "output-shape", sourceId: edge.sourceId });
      if (sourcePatch) sourceRevisions[edge.sourceId] = sourcePatch.revision;
      values = mergeValues(values, sourceRecord);
    }
    return {
      ...composed,
      values,
      sourceRevisions: { ...composed.sourceRevisions, ...sourceRevisions },
    };
  }
}
