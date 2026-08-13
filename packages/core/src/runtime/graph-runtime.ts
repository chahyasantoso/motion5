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
  /**
   * Where a deferred follow-up flush is drained. This is an injected seam, never a clock: it
   * adds no frame source and does not advance the frame number, so a project with no ticking
   * clock still drains the work a subscriber queued.
   */
  readonly scheduler?: Scheduler;
  /**
   * Where a failure that escaped a flush is reported. A clock dispatch must never propagate
   * one, because the frame loop is the one caller that cannot recover from an exception, so
   * this callback and `lastFlushError` are the only channels for seeing it.
   */
  readonly onFlushError?: (diagnostic: Diagnostic) => void;
}

/**
 * The batch returned to a caller whose flush was queued instead of executed. It publishes
 * nothing and names the seeds it deferred, so a reentrant caller can never mistake it for a
 * real publication. It carries the current batch identity because it did not create one.
 */
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
  /** The clock's frame number. Only a clock tick or an explicit caller tick advances it. */
  #lastTick = 0;
  /** Batch identity. Advanced once per executed flush, never by the clock. */
  #sequence = 0;
  #lastFlushError: Diagnostic | undefined;
  #flushing = false;
  /** True between scheduling a drain and that drain running. Coalesces follow-ups to one. */
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
  /** The last frame number this runtime saw from its clock. */
  get tick(): number {
    return this.#lastTick;
  }
  /** The identity of the last batch this runtime published. Independent of the clock. */
  get sequence(): number {
    return this.#sequence;
  }
  /** The last failure that escaped a flush, or undefined when none has. */
  get lastFlushError(): Diagnostic | undefined {
    return this.#lastFlushError;
  }
  get memberCount(): number {
    return this.#members.size;
  }
  /** Seeds deferred by reentrant flush requests, waiting for the scheduled drain. */
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
  }

  /**
   * Publish the closure of `seeds`. `tick` is the clock's frame number and is optional: only
   * the frame owner supplies one. A publication that does not belong to a frame, such as a
   * seek, advances batch identity alone and leaves the frame number for the clock to fill.
   */
  flush(seeds: readonly string[] = [...this.#members], tick?: number): PatchBatch {
    this.#assertLive();
    // Reentrancy policy: one flush at a time, no recursion, no second clock. A flush asked
    // for while this runtime is already flushing (in practice from a patch subscriber) is
    // never executed inline. Its seeds are coalesced into a single pending set, and one drain
    // is scheduled through the injected scheduler, so the follow-up is neither recursive nor
    // dependent on a later clock tick that a scroll- or seek-driven project never produces.
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
    const nodes = this.#binding.graph.nodes.map((node) =>
      Object.freeze({ ...node, compose: this.#compose(node) }),
    );
    this.#sequence += 1;
    this.#flushing = true;
    try {
      return this.#publisher.flush(
        Object.freeze({ ...this.#binding.graph, nodes: Object.freeze(nodes) }),
        effectiveSeeds,
        this.#sequence,
      );
    } catch (error) {
      // A failed drain must not swallow the work it was carrying, including the seeds it was
      // asked to publish: the caller has no other record of them.
      for (const seed of effectiveSeeds) this.#pendingSeeds.add(seed);
      throw error;
    } finally {
      this.#flushing = false;
      // Seeds can arrive during notification or survive a failure. Either way the queue owns
      // its own drain from here; nothing else will come back for it.
      if (this.#pendingSeeds.size > 0) this.#scheduleDrain();
    }
  }

  /** Publish a change that did not come from a frame. Never consumes a clock frame number. */
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
      // Scheduling is an injected boundary and can fail. Clear the guard before reporting so
      // a later invalidation retries instead of finding a drain that was never scheduled and
      // leaving the pending seeds stranded for the lifetime of the runtime.
      this.#scheduledDrain = false;
      this.#report(SCHEDULER_FAILURE_RULE, `Deferred flush scheduling failed: ${describe(error)}`);
    }
  }

  #onTick(event: ClockTick): void {
    if (this.#disposed) return;
    // Everything below is reported, never thrown. A clock dispatch is the one caller that
    // cannot recover: both shipped clocks would abandon their remaining listeners, and the
    // browser clock would never request another frame, so a single escaping error ends every
    // animation in the project for the lifetime of the page.
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
