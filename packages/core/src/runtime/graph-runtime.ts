import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode, GraphIR } from "../graph/ir";
import { GraphPublisher, type PublisherNode, type PublisherSnapshot } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";
import type { Scheduler } from "../ports/scheduler";
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
function deferredBatch(sequence: number, seeds: readonly string[]): PatchBatch {
  const ids = Object.freeze([...seeds]);
  const diagnostic: Diagnostic = Object.freeze({
    ruleId: DEFERRED_FLUSH_RULE,
    path: "deferred-flush",
    message:
      "A flush requested while subscribers were being notified was queued as one follow-up invalidation for the scheduler.",
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
/**
 * Renders `error` for a diagnostic message, keeping every original cause.
 *
 * An `AggregateError` is flattened rather than printed by its own message. The clock consumer
 * fanout reports two or more failures as one aggregate whose message is only the boundary's
 * context string, so printing that alone would name the boundary and drop every cause it
 * collected, which is the same attribution loss this module is fixing one level up. Recursive, so
 * a nested aggregate flattens too. Issue #154.
 */
function describe(error: unknown): string {
  if (error instanceof AggregateError) {
    const causes = error.errors.map((cause: unknown) => describe(cause)).join("; ");
    return [error.message, causes].filter((part) => part.length > 0).join(" ");
  }
  return error instanceof Error ? error.message : String(error);
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
  readonly #pendingSeeds = new Set<string>();
  readonly #publisherNodes = new Map<GraphNode, PublisherNode>();
  #snapshot: PublisherSnapshot | undefined;
  #snapshotGraph: GraphIR | undefined;
  #snapshotMembers = -1;
  #membersRevision = 0;
  #lastTick = 0;
  #sequence = 0;
  #lastFlushError: Diagnostic | undefined;
  #flushing = false;
  #scheduledDrain = false;
  #disposed = false;
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
    this.#scheduler = options.scheduler;
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
    return [...this.#pendingSeeds];
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
    // would retain every node the clear above exists to release.
    this.#snapshot = undefined;
    this.#snapshotGraph = undefined;
  }
  flush(seeds: readonly string[] = [...this.#members], tick?: number): PatchBatch {
    this.#assertLive();
    if (this.#flushing) {
      for (const seed of seeds) this.#pendingSeeds.add(seed);
      this.#scheduleDrain();
      return deferredBatch(this.#sequence, seeds);
    }
    if (tick !== undefined) {
      if (!Number.isFinite(tick)) throw new TypeError("Runtime ticks must be finite.");
      if (tick < this.#lastTick) throw new RangeError("Runtime ticks must be monotonic.");
      this.#lastTick = tick;
    }
    const carried = [...this.#pendingSeeds];
    this.#pendingSeeds.clear();
    this.#scheduledDrain = false;
    const effectiveSeeds = [...new Set([...seeds, ...carried])];
    const snapshot = this.#snapshotFor();
    this.#sequence += 1;
    this.#flushing = true;
    try {
      return this.#publisher.flush(snapshot, effectiveSeeds, this.#sequence);
    } catch (error) {
      for (const seed of effectiveSeeds) this.#pendingSeeds.add(seed);
      throw error;
    } finally {
      this.#flushing = false;
      if (this.#pendingSeeds.size > 0) this.#scheduleDrain();
    }
  }
  invalidate(seeds: readonly string[]): PatchBatch {
    this.#assertLive();
    return this.flush(seeds);
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#unsubscribe();
    this.#members.clear();
    this.#pendingSeeds.clear();
    this.#publisherNodes.clear();
    this.#snapshot = undefined;
    this.#snapshotGraph = undefined;
    this.#scheduledDrain = false;
    this.#registry.dispose();
  }
  /**
   * The frozen snapshot every flush runs over, derived once and reused until something in it moved.
   *
   * `nodes`, `nodeById` and `dependents` are all pure functions of the `GraphIR` identity. Publisher
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
   * See ADR-058.
   */
  #snapshotFor(): PublisherSnapshot {
    const graph = this.#binding.graph;
    const cached = this.#snapshot;
    if (
      cached !== undefined &&
      this.#snapshotGraph === graph &&
      this.#snapshotMembers === this.#membersRevision
    )
      return cached;
    const nodes = graph.nodes.map((node) => this.#publisherNode(node));
    const nodeById: Record<string, PublisherNode> = {};
    for (const node of nodes) nodeById[node.id] = node;
    const snapshot: PublisherSnapshot = Object.freeze({
      ...graph,
      nodes: Object.freeze(nodes),
      nodeById: Object.freeze(nodeById),
      members: new Set(this.#members),
    });
    this.#snapshot = snapshot;
    this.#snapshotGraph = graph;
    this.#snapshotMembers = this.#membersRevision;
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
  #scheduleDrain(): void {
    if (this.#scheduler === undefined || this.#scheduledDrain || this.#disposed) return;
    this.#scheduledDrain = true;
    try {
      this.#scheduler.schedule(() => {
        this.#scheduledDrain = false;
        if (this.#disposed || this.#pendingSeeds.size === 0) return;
        try {
          this.flush([]);
        } catch (error) {
          this.#report(FLUSH_FAILURE_RULE, `Scheduled flush failed: ${describe(error)}`);
        }
      });
    } catch (error) {
      this.#scheduledDrain = false;
      this.#report(SCHEDULER_FAILURE_RULE, `Deferred flush scheduling failed: ${describe(error)}`);
    }
  }
  #onTick(event: ClockTick): void {
    if (this.#disposed) return;
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
        `Clock consumers at tick ${event.tick} failed: ${describe(error)}`,
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
    if (this.#disposed) return;
    try {
      this.flush([...this.#members], event.tick);
    } catch (error) {
      this.#report(
        FLUSH_FAILURE_RULE,
        `Flush at tick ${event.tick} failed: ${describe(error)}`,
        event.tick,
      );
    }
  }
  /**
   * Records one diagnostic and hands it to the host once.
   *
   * `tick` defaults to the last flushed tick, which is what a scheduled drain or a rejected clock
   * regression is about. The two tick boundaries pass the tick they are handling instead: a
   * consumer failure happens before `flush` advances `#lastTick`, so the default would file it
   * under the previous frame and undo the attribution this exists for.
   */
  #report(ruleId: string, message: string, tick: number = this.#lastTick): void {
    const diagnostic: Diagnostic = Object.freeze({
      ruleId,
      path: String(tick),
      message,
      severity: "error",
      ids: Object.freeze([...this.#members]),
    });
    this.#lastFlushError = diagnostic;
    this.#onFlushError?.(diagnostic);
  }
  #assertLive(): void {
    if (this.#disposed) throw new Error("GraphRuntime is disposed.");
  }
}
