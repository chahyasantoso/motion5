import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode, GraphIR } from "../graph/ir";
import { GraphPublisher, type PublisherNode, type PublisherSnapshot } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";
import { deferredScheduler, type Cancel, type Scheduler } from "../ports/scheduler";
import { describeError, reportDiagnostic } from "./diagnostic-report";
import {
  COLD_MEMO,
  DISPOSED,
  IDLE,
  NOTHING_PENDING,
  beginFlush,
  bookingDrain,
  deferredSeeds,
  deferredTick,
  deferring,
  endFlush,
  isDisposed,
  isFlushing,
  isPending,
  memoHit,
  requeuing,
  retaining,
  unbookDrain,
  warmMemo,
  type PendingPublication,
  type RuntimePhase,
  type SnapshotMemo,
} from "./graph-runtime-state";
export type ComposeNode = PublisherNode["compose"];
export type ComposeResolver = (node: GraphNode) => ComposeNode;
export const DEFERRED_FLUSH_RULE = "reentrant-flush-deferred";
export const CLOCK_REGRESSION_RULE = "clock-tick-regression";
export const CLOCK_CONSUMER_FAILURE_RULE = "clock-consumer-failure";
export const FLUSH_FAILURE_RULE = "flush-failure";
export const SCHEDULER_FAILURE_RULE = "scheduler-failure";
import type { MemberState } from "./graph-publisher";
import type { GraphBuilder } from "../ports/graph-builder";
export interface GraphRuntimeOptions {
  readonly scheduler?: Scheduler;
  readonly onFlushError?: (diagnostic: Diagnostic) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly graphBuilder?: GraphBuilder;
  /**
   * Answers, for one node, how to read what it interpolated.
   *
   * Total on purpose. The provider is optional, because a runtime with no solver in it needs none,
   * but its answer is not: a supplier that could return `undefined` for a node it has no compiled
   * Track for made the publisher report that a member exposes no interpolated function, which names
   * this seam instead of the missing node. The function it returns resolves that Track per call, so
   * nothing here may capture one. See ADR-031 and ADR-051.
   */
  readonly interpolated?: (node: GraphNode) => () => MemberState;
}
/**
 * Answers the batch a deferred publication hands back, and which of two futures the work has.
 *
 * `scheduled` is a question only `#scheduleDrain` can answer, and issue #383 is that the message
 * answered it wrongly in both halves: it named an `invalidate` ADR-082 retired from this tier, and
 * it named a scheduler a runtime built without one does not have. The rule id does not move.
 */
function deferredBatch(sequence: number, seeds: readonly string[], scheduled: boolean): PatchBatch {
  const ids = Object.freeze([...seeds]);
  const diagnostic: Diagnostic = Object.freeze({
    ruleId: DEFERRED_FLUSH_RULE,
    path: "deferred-flush",
    message: scheduled
      ? "A flush requested while subscribers were being notified was queued as one follow-up publication for a scheduled drain."
      : "A flush requested while subscribers were being notified was queued as one follow-up publication carried by the next flush.",
    severity: "warning",
    ids,
  });
  return Object.freeze({
    tick: sequence,
    seeds: ids,
    patches: Object.freeze([]),
    diagnostics: Object.freeze([diagnostic]),
  }) as PatchBatch;
}

export class GraphRuntime {
  readonly #binding: GraphBinding;
  readonly #registry: PatchRegistry;
  readonly #publisher: GraphPublisher;
  readonly #clock: Clock;
  readonly #compose: ComposeResolver;
  readonly #interpolated: ((node: GraphNode) => () => MemberState) | undefined;
  readonly #scheduler: Scheduler | undefined;
  readonly #onFlushError: ((diagnostic: Diagnostic) => void) | undefined;
  readonly #onClockTick: ((event: ClockTick) => void) | undefined;
  readonly #unsubscribe: () => void;
  readonly #members = new Set<string>();
  readonly #publisherNodes = new Map<GraphNode, PublisherNode>();
  /**
   * What a reentrant call deferred: its seeds and the frame number it carried, as one value.
   *
   * A bare seed set held this until issue #380, so a deferred `flushAtTick` kept its work and lost
   * the frame it was asked to reach. See ADR-084.
   */
  #pending: PendingPublication = NOTHING_PENDING;
  /**
   * The scheduler's own handle on the drain this runtime booked, held as long as the booking is.
   *
   * A booking is a claim about the scheduler, not about `#phase` alone, which is what issue #389
   * found: the handle was discarded, so a publication that consumed the drain left the job
   * outstanding and the next deferral booked a second for one drain. See ADR-084 and ADR-038.
   */
  #drainHandle: Cancel | undefined;
  /**
   * This runtime's whole lifecycle, as one value.
   *
   * `#disposed`, `#flushing` and `#scheduledDrain` held it until issue #376, and two of their
   * eight combinations meant nothing. Every combination this one can hold is real, including a
   * flushing runtime that already owes the scheduler a drain, which is what a reentrant deferral
   * creates and what a `draining` phase beside `flushing` could not have expressed. `disposed`
   * carries nothing, so a retired runtime cannot be mid-flush or hold a booking. See ADR-083.
   */
  #phase: RuntimePhase = IDLE;
  /**
   * The memoised publisher snapshot and the whole of the key it is answered by, as one value.
   *
   * `#snapshot`, `#snapshotGraph` and `#snapshotMembers` held it until issue #376, with `-1` for
   * cold, and `replaceGraph` cleared two of the three. A key that can be half-cleared is what
   * this retires: the value and its key are assigned together or not at all. See ADR-058 and
   * ADR-083.
   */
  #memo: SnapshotMemo = COLD_MEMO;
  #membersRevision = 0;
  #lastTick = 0;
  #sequence = 0;
  #lastFlushError: Diagnostic | undefined;
  constructor(
    project: ProjectDefinition,
    clock: Clock,
    compose: ComposeResolver,
    options: GraphRuntimeOptions = {},
  ) {
    this.#binding = new GraphBinding(project, { builder: options.graphBuilder });
    this.#registry = new PatchRegistry();
    this.#publisher = new GraphPublisher(this.#registry);
    this.#clock = clock;
    this.#compose = compose;
    this.#interpolated = options.interpolated;
    // Wrapped once here rather than guarded at every call site below. Issue #377, and see ADR-086.
    this.#scheduler =
      options.scheduler === undefined ? undefined : deferredScheduler(options.scheduler);
    this.#onFlushError = options.onFlushError;
    this.#onClockTick = options.onClockTick;
    this.#unsubscribe = this.#clock.subscribe((event) => this.#onTick(event));
  }
  get state() {
    return this.#binding.state;
  }
  get graph(): GraphIR {
    return this.#binding.graph;
  }
  get registry(): PatchRegistry {
    return this.#registry;
  }
  get tick(): number {
    return this.#lastTick;
  }
  get sequence(): number {
    return this.#sequence;
  }
  get lastFlushError(): Diagnostic | undefined {
    return this.#lastFlushError;
  }
  get memberCount(): number {
    return this.#members.size;
  }
  get pendingSeeds(): readonly string[] {
    return deferredSeeds(this.#pending);
  }
  attach(nodeId: string): void {
    this.#assertLive();
    if (!this.#binding.graph.nodeById[nodeId])
      throw new TypeError(`Unknown graph node "${nodeId}".`);
    this.#addMember(nodeId);
  }
  detach(nodeId: string): void {
    this.#assertLive();
    this.#dropMember(nodeId);
    this.#registry.remove(nodeId);
  }
  evictNode(nodeId: string): void {
    this.#assertLive();
    this.#dropMember(nodeId);
    this.#registry.evict(nodeId);
  }
  replaceGraph(project: ProjectDefinition): void {
    this.#assertLive();
    this.#binding.replace(project);
    for (const id of this.#members)
      if (!this.#binding.graph.nodeById[id]) {
        this.#dropMember(id);
        this.#registry.evict(id);
      }
    // Residency, not staleness, and the difference is worth stating because the line looks like the
    // other one. Every closure a publisher node carries resolves the compiled map per call, so an
    // entry that survives a rebuild is not stale; but this map is keyed by the graph node object and
    // holds it strongly, so without the clear every node a rebuild replaced would be retained for
    // the life of the runtime. A cache's residency is answered inside the layer that holds it, which
    // is why it is one line here rather than an eviction hook every caller has to remember.
    // See ADR-058.
    this.#publisherNodes.clear();
    // The memo goes with them, and for the same reason rather than for correctness: it is keyed on
    // the graph identity, so an entry from the replaced graph could never be read, but holding one
    // would retain every node the clear above exists to release. One assignment, and the key
    // leaves with the value it belongs to: this used to clear two of the memo's three fields and
    // leave the membership revision behind, which stayed harmless only because warmth also needed
    // the value. See ADR-083.
    this.#memo = COLD_MEMO;
  }
  /**
   * Publishes for `seeds`, unioned with whatever a deferred drain left pending, and answers it.
   *
   * The seed-list entry, and the whole of it: this verb cannot reach the clock's frame number.
   * `flush(seeds, tick?)` carried both operations behind one name until issue #374, so which of the
   * two a caller meant was stated by whether a second argument was present, and the one that
   * consumes a frame number the clock will reuse was the one reachable by accident. `flushAtTick`
   * owns that transition now and states it as a required parameter. See ADR-082.
   *
   * `seeds` has no default either, since issue #371's follow-up: an omitted argument used to ask
   * for a full graph recompute, the most expensive answer this class has, selected by saying
   * nothing. Every caller states its list, and the one that wants every member says so.
   *
   * An empty list is not a cheap flush and is not treated as one. It still derives the snapshot,
   * moves `#sequence` and notifies every batch subscriber, because `#scheduleDrain` calls
   * `flush([])` precisely so a deferred drain publishes what `#pendingSeeds` carried. Emptiness is
   * a project-tier question and `ProjectRuntime.#publishSeeds` owns it. See ADR-080.
   */
  flush(seeds: readonly string[]): PatchBatch {
    this.#assertLive();
    return this.#deferIfFlushing(seeds) ?? this.#flushSeeds(seeds);
  }
  /**
   * Publishes for `seeds` at `tick`, advancing the clock's frame number, and answers that batch.
   *
   * The clock's entry, and the only member that may move `#lastTick`. `#flushTick` is its only
   * caller in `src`, which is what keeps a live edit structurally unable to consume a frame number
   * the clock will reuse on its next frame: the verb the project tier holds has no such parameter,
   * and `clock-tick-identity` reads that separation from the other side. The transition is required
   * rather than optional, so it can never be selected by omission. See ADR-082.
   *
   * A reentrant call is answered before the tick is consumed, deliberately and in that order. A
   * flush requested while subscribers are being notified publishes nothing now, so moving the frame
   * number for it would record a frame that did not run. `publisher-reentrancy` reads that.
   *
   * The frame is carried rather than dropped, which is the half issue #380 left undecided. It
   * travels with the deferred seeds and is recorded by the publication that does run, so nothing
   * claims a frame that did not happen and nothing loses one that was asked for. See ADR-084.
   */
  flushAtTick(seeds: readonly string[], tick: number): PatchBatch {
    this.#assertLive();
    // Validity before the reentrancy question, so a frame this runtime could never reach is refused
    // rather than queued. Recording it stays the separate act it was.
    this.#assertTick(tick);
    const deferred = this.#deferIfFlushing(seeds, tick);
    if (deferred !== undefined) return deferred;
    this.#advanceTick(tick);
    return this.#flushSeeds(seeds);
  }
  /**
   * Answers the deferred batch for a flush requested inside one, or `undefined` when none is open.
   *
   * The one owner of the reentrancy answer, for both public verbs. Queueing the seeds and scheduling
   * the drain is the answer rather than a step before it, which is why this hands back the batch and
   * not a boolean: two callers that had to ask and then act could act differently.
   *
   * `tick` is optional because one of the two verbs has no frame to hand over, not because a caller
   * may choose: `flush` cannot name one, `flushAtTick` states its own. That keeps the deferred
   * payload one owner rather than a seed set here and a frame number beside it. Issue #380.
   */
  #deferIfFlushing(seeds: readonly string[], tick?: number): PatchBatch | undefined {
    if (!isFlushing(this.#phase)) return undefined;
    this.#pending = deferring(this.#pending, seeds, tick);
    // The batch says which future the work has, and the member that books is the one that knows.
    const scheduled = this.#scheduleDrain();
    return deferredBatch(this.#sequence, seeds, scheduled);
  }
  /**
   * Records `tick` as the frame number this runtime has reached, having re-asked that it may.
   *
   * The one write to `#lastTick`. Validity is `#assertTick`'s question, so a rejected tick leaves
   * the runtime on the frame it was already on.
   */
  #advanceTick(tick: number): void {
    this.#assertTick(tick);
    this.#lastTick = tick;
  }
  /**
   * Refuses a frame number this runtime cannot reach, and answers nothing when it can.
   *
   * The one owner of tick validity, asked twice on purpose: once by `flushAtTick` before it decides
   * whether to defer, so an impossible frame is refused rather than queued, and once by the one
   * write above, which cannot be reached without it. Issue #380.
   */
  #assertTick(tick: number): void {
    if (!Number.isFinite(tick)) throw new TypeError("Runtime ticks must be finite.");
    if (tick < this.#lastTick) throw new RangeError("Runtime ticks must be monotonic.");
  }
  /**
   * Publishes for `seeds` plus whatever a deferred drain left pending, and answers that batch.
   *
   * The publication mechanics both public verbs share, and nothing else: no liveness answer, no
   * reentrancy answer and no clock transition, because each of those has an owner above. Its one
   * precondition is asserted rather than stated, because an assertion is not a second owner of a
   * decision, it is the check that the decision held: it must not be called in the `flushing`
   * phase, which `#deferIfFlushing` answers for both callers. Any failure between taking the
   * pending payload and publishing re-queues the seeds this call was carrying and rethrows, so the
   * work is deferred rather than dropped. Issue #378 is that the boundary used to begin after the
   * snapshot was derived, and derivation runs injected caller code.
   */
  #flushSeeds(seeds: readonly string[]): PatchBatch {
    // Asked before anything moves, which is the whole of issue #382. A caller reaching here during
    // a publication would otherwise take the pending payload, release the booking and move
    // `#sequence` before failing deeper down under a lower-level message: mutated state, and the
    // failure misattributed. Unreachable today, and one branch is what that costs.
    if (isFlushing(this.#phase)) throw new Error("GraphRuntime is already flushing.");
    const carried = deferredSeeds(this.#pending);
    // The seeds are taken and a frame this verb cannot reach is not. `flush` has no parameter to
    // publish one with, so clearing the whole payload here dropped a frame a deferred `flushAtTick`
    // asked for, and the drain the `finally` books below is what replays it. Issue #392.
    this.#pending = retaining(this.#pending, this.#lastTick);
    this.#releaseBooking();
    const effectiveSeeds = [...new Set([...seeds, ...carried])];
    try {
      // Inside the boundary, which is the whole of issue #378: deriving a snapshot builds publisher
      // nodes on a cold memo, and building one calls the injected `compose` and `interpolated`
      // suppliers, so caller code throws here. `#sequence` moves inside with it and nothing
      // observable moves with that. `beginFlush` does not, because the reentrancy window has to
      // stay exactly where it is.
      const snapshot = this.#snapshotFor();
      this.#sequence += 1;
      this.#phase = beginFlush(this.#phase);
      return this.#publisher.flush(snapshot, effectiveSeeds, this.#sequence);
    } catch (error) {
      // The frame, if there was one, was consumed before this call, so the requeue carries none.
      // It re-queues onto a live runtime only, which is issue #401: derivation above runs caller
      // code, caller code may dispose this runtime and then throw, and a terminal runtime holding
      // work no phase can ever book a drain for disagrees with the record instead of preserving
      // anything.
      this.#pending = requeuing(this.#phase, this.#pending, effectiveSeeds);
      throw error;
    } finally {
      // `endFlush` is total and disposal is terminal, so a subscriber that disposed the runtime
      // mid-flush leaves it disposed here rather than idle, and the booking below is refused for
      // the same reason. Both of those were hand-cleared boolean writes before ADR-083.
      this.#phase = endFlush(this.#phase);
      if (isPending(this.#pending)) this.#scheduleDrain();
    }
  }
  /**
   * Retires this runtime, once.
   *
   * `disposed` is terminal and carries nothing, so two of the states this used to clear by hand
   * are gone rather than cleared: a retired runtime cannot be mid-flush and cannot hold a drain
   * booking, because neither is representable beside that discriminant. A drain the scheduler
   * already accepted is cancelled rather than left to run and be refused, since issue #389 made the
   * booking a claim about the scheduler; `#drainScheduled` still refuses on the one discriminant,
   * for a job a port declined to cancel. See ADR-083 and ADR-084.
   */
  dispose(): void {
    if (isDisposed(this.#phase)) return;
    // Before the phase goes terminal, because a retired runtime should not leave the scheduler
    // holding a job it will only refuse.
    this.#releaseBooking();
    this.#phase = DISPOSED;
    this.#unsubscribe();
    this.#members.clear();
    this.#pending = NOTHING_PENDING;
    this.#publisherNodes.clear();
    this.#memo = COLD_MEMO;
    this.#registry.dispose();
  }
  /**
   * The frozen snapshot every flush runs over, derived once and reused until something in it moved.
   *
   * `nodes`, `nodeById` and `dependants` are all pure functions of the `GraphIR` identity. Publisher
   * nodes are cached per graph node, `finalizeGraph` derives reverse topology once per graph, and
   * every closure a publisher node carries resolves the compiled map when the publisher calls it, so
   * an entry that survives a recompile is not stale. A second tick over a graph that did not move
   * therefore has nothing left to compute, and steady-state ticking allocates nothing for graph
   * shape. Optimisation 7c of issue #223.
   *
   * Membership is the one part that moves without the graph moving, so it is keyed rather than
   * aliased: the snapshot carries a copy of the member set and `#membersRevision` is what the memo
   * is keyed on. Handing over the live set inside a frozen object would be a cache whose answer
   * changes without its key changing, and it would let a memo keyed on the graph alone look correct.
   *
   * Both halves of that key now travel with the snapshot as one value, so warmth is one question
   * asked once rather than a three-part conjunction over fields that could be cleared apart. See
   * ADR-058 and ADR-083.
   */
  #snapshotFor(): PublisherSnapshot {
    const graph = this.#binding.graph;
    const warm = memoHit(this.#memo, graph, this.#membersRevision);
    if (warm !== undefined) return warm;
    const nodes = graph.nodes.map((node) => this.#publisherNode(node));
    const nodeById: Record<string, PublisherNode> = {};
    for (const node of nodes) nodeById[node.id] = node;
    const snapshot: PublisherSnapshot = Object.freeze({
      ...graph,
      nodes: Object.freeze(nodes),
      nodeById: Object.freeze(nodeById),
      members: new Set(this.#members),
    });
    this.#memo = warmMemo(snapshot, graph, this.#membersRevision);
    return snapshot;
  }
  /**
   * One publisher node per graph node, composed once and reused for as long as the graph holds it.
   *
   * `#compose` and the optional `#interpolated` are resolved here rather than per flush, and both of
   * the closures they return read the compiled map when the publisher calls them, so nothing cached
   * here can outlive a recompile. See ADR-031 and ADR-051.
   */
  #publisherNode(node: GraphNode): PublisherNode {
    const cached = this.#publisherNodes.get(node);
    if (cached) return cached;
    const interpolatedFn = this.#interpolated?.(node);
    const publisherNode: PublisherNode = Object.freeze({
      ...node,
      compose: this.#compose(node),
      ...(interpolatedFn ? { interpolated: interpolatedFn } : {}),
    });
    this.#publisherNodes.set(node, publisherNode);
    return publisherNode;
  }
  /**
   * The two ways membership moves, and the one owner of the revision the snapshot is keyed on.
   *
   * Three call sites mutated the set directly before this, and a cache each of them has to remember
   * to invalidate is the shape ADR-058 refuses, so they state the change and the revision follows
   * from it. A no-op add or remove moves nothing: a key that moved when the answer did not would
   * rebuild the snapshot for free.
   */
  #addMember(nodeId: string): void {
    if (this.#members.has(nodeId)) return;
    this.#members.add(nodeId);
    this.#membersRevision += 1;
  }
  #dropMember(nodeId: string): void {
    if (!this.#members.delete(nodeId)) return;
    this.#membersRevision += 1;
  }
  /**
   * Books one follow-up drain with the scheduler, or answers that there is nothing to book.
   *
   * `bookingDrain` is the whole question, asked once. It hands back the phase that carries the
   * booking, or `undefined` for the two cases that used to be two more terms in a conjunction: a
   * disposed runtime has no follow-up to run, and a phase already carrying a booking would book a
   * second job for one drain, which is the coalescing `scheduler-reentrancy` measures. A
   * transition rather than a boolean, for the reason `#deferIfFlushing` hands back a batch: two
   * callers that had to ask and then act could act differently. See ADR-083.
   *
   * It answers whether the scheduler is now holding a job for this runtime, because the diagnostic
   * a deferral hands back has to say so and this is the only member that knows. Issue #383.
   */
  #scheduleDrain(): boolean {
    const scheduler = this.#scheduler;
    if (scheduler === undefined) return false;
    const booked = bookingDrain(this.#phase);
    // The handle is the answer rather than a fourth branch: the port holds a job for this runtime
    // exactly when it is set, so a booking already held answers true where `bookingDrain` declined,
    // a disposed runtime answers false, and a `schedule` that threw answers false because the
    // boundary below released it. Issue #383.
    if (booked === undefined) return this.#drainHandle !== undefined;
    this.#phase = booked;
    try {
      this.#drainHandle = scheduler.schedule(() => this.#drainScheduled());
    } catch (error) {
      this.#releaseBooking();
      this.#report(
        SCHEDULER_FAILURE_RULE,
        `Deferred flush scheduling failed: ${describeError(error)}`,
      );
    }
    return this.#drainHandle !== undefined;
  }

  /**
   * Releases the drain booking and cancels the job it was a claim about.
   *
   * The one owner of "this runtime no longer owes a follow-up", and the whole of issue #389: the
   * booking was a claim about `#phase` while the handle `schedule` answered with was thrown away,
   * so a publication that consumed the drain left the job outstanding and the next deferral booked
   * a second for one drain.
   *
   * The phase is lowered before the port is touched, so a `cancel` that throws cannot leave this
   * runtime believing it still owes a drain. Cancelling a job already running is the no-op the
   * `Cancel` contract allows, which is what `#drainScheduled` does to the booking it consumes. See
   * ADR-084 and ADR-038.
   */
  #releaseBooking(): void {
    const handle = this.#drainHandle;
    this.#drainHandle = undefined;
    this.#phase = unbookDrain(this.#phase);
    if (handle === undefined) return;
    try {
      handle.cancel();
    } catch (error) {
      this.#report(
        SCHEDULER_FAILURE_RULE,
        `Deferred flush cancellation failed: ${describeError(error)}`,
      );
    }
  }

  /**
   * Runs the booked drain: releases the booking, then publishes whatever was deferred.
   *
   * The order is the one the boolean pair had, and it is load-bearing in both directions. Releasing
   * first is what lets the flush below book its own follow-up when a subscriber defers again;
   * asking about disposal after is what keeps a job the scheduler accepted before `dispose` from
   * publishing over a retired registry. A public verb rather than `#flushSeeds` for the reason
   * ADR-082 gives: nothing guarantees a scheduler cannot run this while a flush is in flight, and
   * the deferral fallback that protects it lives in the public verb, which is also what carries a
   * still-pending frame forward into the next deferral. Which of the two verbs runs is decided by
   * whether the deferral carried a frame, never by this member's convenience.
   */
  #drainScheduled(): void {
    this.#releaseBooking();
    if (isDisposed(this.#phase) || !isPending(this.#pending)) return;
    // Replayed through the verb that owns clock transitions, so the frame a reentrant call arrived
    // with is recorded by the publication that finally runs. It cannot have been overtaken: the
    // only writer of `#lastTick` is a publication that also takes this payload. Issue #380.
    const tick = deferredTick(this.#pending);
    try {
      if (tick === undefined) this.flush([]);
      else this.flushAtTick([], tick);
    } catch (error) {
      this.#report(FLUSH_FAILURE_RULE, `Scheduled flush failed: ${describeError(error)}`);
    }
  }
  #onTick(event: ClockTick): void {
    if (isDisposed(this.#phase)) return;
    if (event.tick <= this.#lastTick) {
      this.#report(
        CLOCK_REGRESSION_RULE,
        `Clock tick ${event.tick} did not advance past ${this.#lastTick}.`,
      );
      return;
    }
    // Two boundaries, one subscription. Advancing the clock consumers and flushing the graph fail
    // for unrelated reasons, so they are reported under unrelated rule ids and neither can be
    // diagnosed as the other. See ADR-039.
    this.#advanceConsumers(event);
    this.#flushTick(event);
  }
  /**
   * Advances the clock consumers for `event` inside their own error boundary.
   *
   * The fanout stays with the single `onClockTick` owner, and so does the rule that one throwing
   * consumer does not stop the consumers behind it. This boundary only decides how that owner's
   * failure is labelled, which is why there is still exactly one clock subscription.
   */
  #advanceConsumers(event: ClockTick): void {
    try {
      this.#onClockTick?.(event);
    } catch (error) {
      this.#report(
        CLOCK_CONSUMER_FAILURE_RULE,
        `Clock consumers at tick ${event.tick} failed: ${describeError(error)}`,
        event.tick,
      );
    }
  }
  /**
   * Flushes the graph for `event` inside its own error boundary.
   *
   * The flush runs whether or not a consumer threw. A boundary that also cancelled the flush would
   * not be a separate boundary: one Motion's driver would drop the frame for every node in the
   * project, which is the fanout rule applied one step further out. Disposal from inside a consumer
   * is the one thing that does stop it, because there is no longer a runtime to flush and `flush`
   * would only refuse with a failure this tick did not cause.
   */
  #flushTick(event: ClockTick): void {
    if (isDisposed(this.#phase)) return;
    try {
      this.flushAtTick([...this.#members], event.tick);
    } catch (error) {
      this.#report(
        FLUSH_FAILURE_RULE,
        `Flush at tick ${event.tick} failed: ${describeError(error)}`,
        event.tick,
      );
    }
  }
  /**
   * Records one diagnostic and hands it to the host once, and answers nothing once retired.
   *
   * `tick` defaults to the last flushed tick, which is what a scheduled drain or a rejected clock
   * regression is about. The two tick boundaries pass the tick they are handling instead: a
   * consumer failure happens before `flush` advances `#lastTick`, so the default would file it
   * under the previous frame and undo the attribution this exists for.
   *
   * Building the diagnostic and handing it over belong to `diagnostic-report.ts`, which is the one
   * owner of what a host may do to a runtime failure. Issue #400: `#onFlushError` is host code with
   * no boundary of its own, so a sink that threw left through whichever of these five callers was
   * reporting, and from `#releaseBooking` that position is after the deferred payload has been
   * taken and before the publication boundary that would have put it back.
   *
   * A terminal runtime reports nothing new, which is issue #393. `dispose` releases its booking
   * before the phase goes terminal, so an ordinary disposal still reports a port that refuses to
   * cancel; what this refuses is the reentrant case, where the handler for one failure retires the
   * runtime and the failure still unwinding then files a diagnostic against an object that has
   * already stopped being able to act on one. `disposed` carries nothing, and a diagnostic on a
   * retired runtime is something it would carry for the life of the object. See ADR-083.
   */
  #report(ruleId: string, message: string, tick: number = this.#lastTick): void {
    if (isDisposed(this.#phase)) return;
    this.#lastFlushError = reportDiagnostic(this.#onFlushError, ruleId, message, tick, [
      ...this.#members,
    ]);
  }
  #assertLive(): void {
    if (isDisposed(this.#phase)) throw new Error("GraphRuntime is disposed.");
  }
}
