import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import { createDefaultGraphBuilder } from "../graph/builders/default";
import { UNJUDGED_CAPABILITIES } from "../ports/plugin-capabilities";
import type { GraphNode, GraphIR } from "../graph/ir";
import type { CommittedContract } from "../graph/committed-contract";
import { GraphPublisher, type PublisherNode, type PublisherSnapshot } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";
import { deferredScheduler, type Cancel, type Scheduler } from "../ports/scheduler";
import type { RuleId } from "../contract/rule-id";
import { unreachable } from "../lang/exhaustive";
import {
  CLEAN_TRACE,
  batchFor,
  describeWithCauses,
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
  deferredWork,
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
export type ComposeIdentifiedResolver = (node: GraphNode) => PublisherNode["composeIdentified"];
export const CLOCK_REGRESSION_RULE = "clock-tick-regression" satisfies RuleId;
export const CLOCK_CONSUMER_FAILURE_RULE = "clock-consumer-failure" satisfies RuleId;
export const FLUSH_FAILURE_RULE = "flush-failure" satisfies RuleId;
export const SCHEDULER_FAILURE_RULE = "scheduler-failure" satisfies RuleId;

import type { GraphBuilder } from "../ports/graph-builder";
export interface GraphRuntimeOptions {
  readonly scheduler?: Scheduler;
  readonly onFlushError?: (diagnostic: Diagnostic) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly graphBuilder?: GraphBuilder;
  /** Identified-table composition seam; undefined for grouped-only runtimes. */
  readonly composeIdentified?: ComposeIdentifiedResolver;
}
export class GraphRuntime {
  readonly #binding: GraphBinding;
  readonly #registry: PatchRegistry;
  readonly #publisher: GraphPublisher;
  readonly #clock: Clock;
  readonly #compose: ComposeResolver;
  readonly #composeIdentified: ComposeIdentifiedResolver | undefined;

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
    this.#binding = new GraphBinding(project, {
      builder: options.graphBuilder ?? createDefaultGraphBuilder(UNJUDGED_CAPABILITIES),
    });
    this.#registry = new PatchRegistry();
    this.#publisher = new GraphPublisher(this.#registry);
    this.#clock = clock;
    this.#compose = compose;
    this.#composeIdentified = options.composeIdentified;

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
  /** Failed-handover diagnostic, else `undefined`. A throwing `onFlushError` is contained: its
   * exception lands here, undelivered, never replacing the runtime's own diagnostic. */
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
  replaceGraph(project: ProjectDefinition, carried?: ReadonlyMap<string, CommittedContract>): void {
    this.#assertLive();
    this.#binding.replace(project, carried);
    for (const id of this.#members)
      if (!this.#binding.graph.nodeById[id]) {
        this.#dropMember(id);
        this.#registry.evict(id);
      }
    this.#publisherNodes.clear();
    this.#memo = COLD_MEMO;
  }
  /** Publishes `seeds` plus deferred pending, answers batch; never moves `#lastTick`, which
   * belongs to `flushAtTick`. Reentrant publishes nothing; empty seeds still derive and notify. */
  flush(seeds: readonly string[]): PatchBatch {
    this.#assertLive();
    return this.#publish(seedRequest(seeds));
  }
  /** Publishes `seeds` at `tick`, answers batch; only member that moves `#lastTick`, and the tick
   * is required. Reentrancy answered first, so a skipped publish records no frame. */
  flushAtTick(seeds: readonly string[], tick: number): PatchBatch {
    this.#assertLive();
    // Tick validity before reentrancy: a frame this runtime could never reach is refused, not queued.
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
    this.#pending = deferring(this.#pending, requestSeeds(request), requestTick(request));
    // Read what the deferral owes, not the request: a booking claims a drain with something to
    // publish, and a frame-only request still owes a publication.
    const owed = deferredWork(this.#pending);
    switch (owed.kind) {
      case "nothing":
        return batchFor(this.#sequence, { kind: "empty" });
      // Booking travels inside the answer, taken even when a replaying drain contributed no work.
      case "seeds":
        return batchFor(this.#sequence, {
          kind: "deferred-in-flush",
          seeds: owed.seeds,
          scheduled: this.#scheduleDrain(),
        });
      // A frame-only deferral names its tick, not a payload it lacks.
      case "frame":
        return batchFor(this.#sequence, {
          kind: "deferred-frame-in-flush",
          tick: owed.tick,
          scheduled: this.#scheduleDrain(),
        });
      default:
        return unreachable(owed);
    }
  }
  #advanceTick(tick: number): void {
    this.#assertTick(tick);
    this.#lastTick = tick;
  }
  // Asked twice: by flushAtTick before deferring, and by #advanceTick before recording.
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
  /** Retires this runtime once; `disposed` is terminal. An accepted drain is cancelled, not left
   * to be refused, and a job the port declined to cancel is refused on `isRetiring`. */
  dispose(): void {
    if (isRetiring(this.#phase)) return;
    this.#phase = retiring(this.#phase);
    // Release before the phase goes terminal: a retired runtime must not hold a job it only refuses.
    this.#releaseBooking();
    this.#phase = DISPOSED;
    this.#unsubscribe();
    this.#members.clear();
    this.#pending = NOTHING_PENDING;
    this.#publisherNodes.clear();
    this.#memo = COLD_MEMO;
    this.#registry.dispose();
  }
  // Publisher composition calls the injected compose, keeping derivation inside this boundary.
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
    const composeIdentified = this.#composeIdentified?.(node);
    const publisherNode: PublisherNode = Object.freeze({
      ...node,
      compose: this.#compose(node),
      ...(composeIdentified === undefined ? {} : { composeIdentified }),
    });
    this.#publisherNodes.set(node, publisherNode);
    return publisherNode;
  }
  // Sole add path, so the snapshot revision cannot lag it.
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
        `Deferred flush scheduling failed: ${describeWithCauses(error)}`,
      );
    }
    return this.#drainHandle !== undefined;
  }

  // Phase drops before the port: a throwing cancel must not leave a booking owed.
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
        `Deferred flush cancellation failed: ${describeWithCauses(error)}`,
      );
    }
  }

  // Release before flushing, so a subscriber deferring again books its own follow-up drain.
  #drainScheduled(): void {
    this.#releaseBooking();
    if (isRetiring(this.#phase) || !isPending(this.#pending)) return;
    const tick = deferredTick(this.#pending);
    try {
      if (tick === undefined) this.flush([]);
      else this.flushAtTick([], tick);
    } catch (error) {
      this.#report(FLUSH_FAILURE_RULE, `Scheduled flush failed: ${describeWithCauses(error)}`);
    }
  }
  // Two error boundaries under one subscription: consumers and graph fail independently.
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
        `Clock consumers at tick ${event.tick} failed: ${describeWithCauses(error)}`,
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
        `Flush at tick ${event.tick} failed: ${describeWithCauses(error)}`,
        event.tick,
      );
    }
  }
  #report(ruleId: RuleId, message: string, tick: number = this.#lastTick): void {
    // Phase selects the sink only; retention is total, so a retired runtime withholds, not discards.
    const sink = reportSink(this.#phase, this.#onFlushError);
    reportDiagnostic(sink, this.#retain, ruleId, message, tick, [...this.#members]);
  }
  #assertLive(): void {
    if (isRetiring(this.#phase)) throw new Error("GraphRuntime is disposed.");
  }
}
