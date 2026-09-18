// Docs: ./graph-runtime.md
import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode, GraphIR } from "../graph/ir";
import { GraphPublisher, type PublisherNode, type PublisherSnapshot } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";
import { deferredScheduler, type Cancel, type Scheduler } from "../ports/scheduler";
import { unreachable } from "../domain/exhaustive";
import {
  CLEAN_TRACE,
  batchFor,
  describeError,
  reportDiagnostic,
  retainedDiagnostic,
  sinkFailure,
  type ReportTrace,
  type RetainTrace,
} from "./report";
import {
  frameRequest,
  requestSeeds,
  requestTick,
  seedRequest,
  type PublishRequest,
} from "./publish-request";
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
  isFlushing,
  isPending,
  isRetiring,
  memoHit,
  reportSink,
  requeuing,
  retaining,
  retiring,
  unbookDrain,
  warmMemo,
  type PendingPublication,
  type RuntimePhase,
  type SnapshotMemo,
} from "./graph-runtime-state";
export type ComposeNode = PublisherNode["compose"];
export type ComposeResolver = (node: GraphNode) => ComposeNode;
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
  #pending: PendingPublication = NOTHING_PENDING;
  #drainHandle: Cancel | undefined;
  #phase: RuntimePhase = IDLE;
  #memo: SnapshotMemo = COLD_MEMO;
  #membersRevision = 0;
  #lastTick = 0;
  #sequence = 0;
  #trace: ReportTrace = CLEAN_TRACE;
  readonly #retain: RetainTrace = (advance) => {
    this.#trace = advance(this.#trace);
  };
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
    return retainedDiagnostic(this.#trace);
  }
  /**
   * The diagnostic describing a failed handover, or `undefined` until a handover has failed.
   *
   * A host whose `onFlushError` throws is contained rather than allowed to reroute a runtime
   * failure, and this is where the containment leaves a trace instead of erasing one. The sink's
   * own exception is retained here, is never delivered anywhere, and never replaces the runtime
   * diagnostic it failed to carry. A distinct hook was refused because a hook is a second sink and
   * therefore a second thing that can throw. Issue #410, and see ADR-091.
   */
  get lastSinkError(): Diagnostic | undefined {
    return sinkFailure(this.#trace);
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
    this.#publisherNodes.clear();
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
   * moves `#sequence` and notifies every batch subscriber, because `#drainScheduled` replays a
   * deferral that carried no frame through `flush([])`, precisely so the drain publishes what the
   * pending payload carried. A deferral that carried a frame replays through `flushAtTick` instead,
   * so this verb is one of the two branches rather than the whole of the drain. Emptiness is a
   * project-tier question and `ProjectRuntime.#publishSeeds` owns it. See ADR-080 and ADR-088.
   */
  flush(seeds: readonly string[]): PatchBatch {
    this.#assertLive();
    return this.#publish(seedRequest(seeds));
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
    return this.#publish(frameRequest(seeds, tick));
  }
  #publish(request: PublishRequest): PatchBatch {
    const deferred = this.#deferIfFlushing(request);
    if (deferred !== undefined) return deferred;
    this.#advanceFrame(request);
    return this.#flushSeeds(requestSeeds(request));
  }
  #advanceFrame(request: PublishRequest): void {
    switch (request.kind) {
      case "seeds":
        return;
      case "frame":
        return this.#advanceTick(request.tick);
      default:
        return unreachable(request);
    }
  }
  #deferIfFlushing(request: PublishRequest): PatchBatch | undefined {
    if (!isFlushing(this.#phase)) return undefined;
    const seeds = requestSeeds(request);
    this.#pending = deferring(this.#pending, seeds, requestTick(request));
    // The batch says which future the work has, and the member that books is the one that knows.
    const scheduled = this.#scheduleDrain();
    return batchFor(this.#sequence, { kind: "deferred-in-flush", seeds, scheduled });
  }
  #advanceTick(tick: number): void {
    this.#assertTick(tick);
    this.#lastTick = tick;
  }
  #assertTick(tick: number): void {
    if (!Number.isFinite(tick)) throw new TypeError("Runtime ticks must be finite.");
    if (tick < this.#lastTick) throw new RangeError("Runtime ticks must be monotonic.");
  }
  #flushSeeds(seeds: readonly string[]): PatchBatch {
    if (isFlushing(this.#phase)) throw new Error("GraphRuntime is already flushing.");
    const carried = deferredSeeds(this.#pending);
    this.#pending = retaining(this.#pending, this.#lastTick);
    this.#releaseBooking();
    const effectiveSeeds = [...new Set([...seeds, ...carried])];
    try {
      const snapshot = this.#snapshotFor();
      this.#sequence += 1;
      this.#phase = beginFlush(this.#phase);
      return this.#publisher.flush(snapshot, effectiveSeeds, this.#sequence);
    } catch (error) {
      this.#pending = requeuing(this.#phase, this.#pending, effectiveSeeds);
      throw error;
    } finally {
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
   * booking a claim about the scheduler; `#drainScheduled` still refuses a job a port declined to
   * cancel, and since issue #408 it refuses on `isRetiring` rather than on the one discriminant, so
   * a job arriving while teardown is still running is refused too. See ADR-083, ADR-084 and ADR-090.
   */
  dispose(): void {
    if (isRetiring(this.#phase)) return;
    this.#phase = retiring(this.#phase);
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
  #addMember(nodeId: string): void {
    if (this.#members.has(nodeId)) return;
    this.#members.add(nodeId);
    this.#membersRevision += 1;
  }
  #dropMember(nodeId: string): void {
    if (!this.#members.delete(nodeId)) return;
    this.#membersRevision += 1;
  }
  #scheduleDrain(): boolean {
    const scheduler = this.#scheduler;
    if (scheduler === undefined) return false;
    const booked = bookingDrain(this.#phase);
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

  #drainScheduled(): void {
    this.#releaseBooking();
    if (isRetiring(this.#phase) || !isPending(this.#pending)) return;
    const tick = deferredTick(this.#pending);
    try {
      if (tick === undefined) this.flush([]);
      else this.flushAtTick([], tick);
    } catch (error) {
      this.#report(FLUSH_FAILURE_RULE, `Scheduled flush failed: ${describeError(error)}`);
    }
  }
  #onTick(event: ClockTick): void {
    if (isRetiring(this.#phase)) return;
    if (event.tick <= this.#lastTick) {
      this.#report(
        CLOCK_REGRESSION_RULE,
        `Clock tick ${event.tick} did not advance past ${this.#lastTick}.`,
      );
      return;
    }
    this.#advanceConsumers(event);
    this.#flushTick(event);
  }
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
  #flushTick(event: ClockTick): void {
    if (isRetiring(this.#phase)) return;
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
  #report(ruleId: string, message: string, tick: number = this.#lastTick): void {
    // The phase selects the sink and nothing else: retention below is total, so a retired runtime
    // withholds rather than discards.
    const sink = reportSink(this.#phase, this.#onFlushError);
    reportDiagnostic(sink, this.#retain, ruleId, message, tick, [...this.#members]);
  }
  #assertLive(): void {
    if (isRetiring(this.#phase)) throw new Error("GraphRuntime is disposed.");
  }
}
