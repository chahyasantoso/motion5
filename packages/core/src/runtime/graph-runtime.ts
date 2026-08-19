import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode, GraphIR } from "../graph/ir";
import { GraphPublisher, type PublisherNode } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";
import type { Scheduler } from "../ports/scheduler";
export type ComposeNode = PublisherNode["compose"];
export type ComposeResolver = (node: GraphNode) => ComposeNode;
export const DEFERRED_FLUSH_RULE = "reentrant-flush-deferred";
export const CLOCK_REGRESSION_RULE = "clock-tick-regression";
export const CLOCK_CONSUMER_FAILURE_RULE = "clock-consumer-failure";
export const FLUSH_FAILURE_RULE = "flush-failure";
export const SCHEDULER_FAILURE_RULE = "scheduler-failure";
import type { GraphBuilder } from "../ports/graph-builder";
export interface GraphRuntimeOptions {
  readonly scheduler?: Scheduler;
  readonly onFlushError?: (diagnostic: Diagnostic) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly graphBuilder?: GraphBuilder;
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
  readonly #scheduler: Scheduler | undefined;
  readonly #onFlushError: ((diagnostic: Diagnostic) => void) | undefined;
  readonly #onClockTick: ((event: ClockTick) => void) | undefined;
  readonly #unsubscribe: () => void;
  readonly #members = new Set<string>();
  readonly #pendingSeeds = new Set<string>();
  readonly #publisherNodes = new Map<GraphNode, PublisherNode>();
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
      throw new TypeError(`Unknown graph node \"${nodeId}\".`);
    this.#members.add(nodeId);
  }
  detach(nodeId: string): void {
    this.#assertLive();
    this.#members.delete(nodeId);
    this.#registry.remove(nodeId);
  }
  evictNode(nodeId: string): void {
    this.#assertLive();
    this.#members.delete(nodeId);
    this.#registry.evict(nodeId);
  }
  clearPublisherCache(): void {
    this.#publisherNodes.clear();
  }
  replaceGraph(project: ProjectDefinition): void {
    this.#assertLive();
    this.#binding.replace(project);
    for (const id of this.#members)
      if (!this.#binding.graph.nodeById[id]) {
        this.#members.delete(id);
        this.#registry.evict(id);
      }
    this.#publisherNodes.clear();
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
    const graph = this.#binding.graph;
    const nodes = graph.nodes.map((node) => {
      const cached = this.#publisherNodes.get(node);
      if (cached) return cached;
      const publisherNode = Object.freeze({ ...node, compose: this.#compose(node) });
      this.#publisherNodes.set(node, publisherNode);
      return publisherNode;
    });
    const nodeById = Object.freeze(Object.fromEntries(nodes.map((node) => [node.id, node])));
    this.#sequence += 1;
    this.#flushing = true;
    try {
      return this.#publisher.flush(
        Object.freeze({ ...graph, nodes: Object.freeze(nodes), nodeById }),
        effectiveSeeds,
        this.#sequence,
      );
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
    this.#scheduledDrain = false;
    this.#registry.dispose();
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
