import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode } from "../graph/ir";
import { GraphPublisher, type PublisherNode } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";
import type { Scheduler } from "../ports/scheduler";

export type ComposeNode = PublisherNode["compose"];
export type ComposeResolver = (node: GraphNode) => ComposeNode;

export const DEFERRED_FLUSH_RULE = "reentrant-flush-deferred";
export const CLOCK_REGRESSION_RULE = "clock-tick-regression";
export const FLUSH_FAILURE_RULE = "flush-failure";
export const SCHEDULER_FAILURE_RULE = "scheduler-failure";

export interface GraphRuntimeOptions {
  readonly scheduler?: Scheduler;
  readonly onFlushError?: (diagnostic: Diagnostic) => void;
}
function deferredBatch(sequence: number, seeds: readonly string[]): PatchBatch {
  const ids = Object.freeze([...seeds]);
  const diagnostic: Diagnostic = Object.freeze({
    ruleId: DEFERRED_FLUSH_RULE,
    path: ids[0] ?? "",
    message:
      "A flush requested while subscribers were being notified was queued as one follow-up " +
      "invalidation for the scheduler.",
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
function describe(error: unknown): string {
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
    this.#binding = new GraphBinding(project);
    this.#registry = new PatchRegistry();
    this.#publisher = new GraphPublisher(this.#registry);
    this.#clock = clock;
    this.#compose = compose;
    this.#scheduler = options.scheduler;
    this.#onFlushError = options.onFlushError;
    this.#unsubscribe = this.#clock.subscribe((event) => this.#onTick(event));
  }
  get binding(): GraphBinding {
    return this.#binding;
  }
  get state() {
    return this.#binding.state;
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
    try {
      this.flush([...this.#members], event.tick);
    } catch (error) {
      this.#report(FLUSH_FAILURE_RULE, `Flush at tick ${event.tick} failed: ${describe(error)}`);
    }
  }
  #report(ruleId: string, message: string): void {
    const diagnostic: Diagnostic = Object.freeze({
      ruleId,
      path: String(this.#lastTick),
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
