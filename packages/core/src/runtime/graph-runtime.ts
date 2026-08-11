import type { Diagnostic, ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode } from "../graph/ir";
import { GraphPublisher, type PublisherNode } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";

export type ComposeNode = PublisherNode["compose"];
export type ComposeResolver = (node: GraphNode) => ComposeNode;

export const DEFERRED_FLUSH_RULE = "reentrant-flush-deferred";

/**
 * The batch returned to a caller whose flush was queued instead of executed. It publishes
 * nothing and names the seeds it deferred, so a reentrant caller can never mistake it for a
 * real publication.
 */
function deferredBatch(tick: number, seeds: readonly string[]): PatchBatch {
  const ids = Object.freeze([...seeds]);
  const diagnostic: Diagnostic = Object.freeze({
    ruleId: DEFERRED_FLUSH_RULE,
    path: ids.join(","),
    message:
      "A flush requested while subscribers were being notified was queued as one follow-up " +
      "invalidation for the next tick.",
    severity: "warning",
    ids,
  });
  return Object.freeze({
    tick,
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
  readonly #unsubscribe: () => void;
  readonly #members = new Set<string>();
  readonly #pendingSeeds = new Set<string>();
  #lastTick = 0;
  #flushing = false;
  #disposed = false;

  constructor(project: ProjectDefinition, clock: Clock, compose: ComposeResolver) {
    this.#binding = new GraphBinding(project);
    this.#registry = new PatchRegistry();
    this.#publisher = new GraphPublisher(this.#registry);
    this.#clock = clock;
    this.#compose = compose;
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
  get publisher(): GraphPublisher {
    return this.#publisher;
  }
  get tick(): number {
    return this.#lastTick;
  }
  get memberCount(): number {
    return this.#members.size;
  }
  /** Seeds deferred by reentrant flush requests, waiting for the next flush to drain them. */
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

  flush(seeds: readonly string[] = [...this.#members], tick = this.#lastTick): PatchBatch {
    this.#assertLive();
    // Reentrancy policy: one flush at a time, no recursion, no second clock. A flush asked
    // for while this runtime is already flushing (in practice from a patch subscriber) is
    // never executed inline. Its seeds are coalesced into a single pending set that the next
    // flush drains exactly once, so the follow-up is neither recursive nor lost.
    if (this.#flushing) {
      for (const seed of seeds) this.#pendingSeeds.add(seed);
      return deferredBatch(this.#lastTick, seeds);
    }
    if (tick < this.#lastTick) throw new RangeError("Runtime ticks must be monotonic.");
    this.#lastTick = tick;
    const carried = [...this.#pendingSeeds];
    this.#pendingSeeds.clear();
    const effectiveSeeds = [...new Set([...seeds, ...carried])];
    const nodes = this.#binding.graph.nodes.map((node) =>
      Object.freeze({ ...node, compose: this.#compose(node) }),
    );
    this.#flushing = true;
    try {
      return this.#publisher.flush(
        Object.freeze({ ...this.#binding.graph, nodes: Object.freeze(nodes) }),
        effectiveSeeds,
        tick,
      );
    } catch (error) {
      // A failed drain must not swallow the follow-up it was carrying.
      for (const seed of carried) this.#pendingSeeds.add(seed);
      throw error;
    } finally {
      this.#flushing = false;
    }
  }

  invalidate(seeds: readonly string[]): PatchBatch {
    this.#assertLive();
    return this.flush(seeds, this.#lastTick + 1);
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#unsubscribe();
    this.#members.clear();
    this.#pendingSeeds.clear();
  }
  #onTick(event: ClockTick): void {
    if (this.#disposed) return;
    if (event.tick <= this.#lastTick)
      throw new RangeError("Clock ticks must be strictly increasing.");
    this.flush([...this.#members], event.tick);
  }
  #assertLive(): void {
    if (this.#disposed) throw new Error("GraphRuntime is disposed.");
  }
}
