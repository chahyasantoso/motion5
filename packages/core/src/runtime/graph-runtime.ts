import type { ProjectDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import { GraphBinding } from "../graph/binding";
import type { GraphNode } from "../graph/ir";
import { GraphPublisher, type PublisherNode } from "./graph-publisher";
import { PatchRegistry, type PatchBatch } from "./patch-registry";

export type ComposeNode = PublisherNode["compose"];
export type ComposeResolver = (node: GraphNode) => ComposeNode;

/**
 * The one project-wide owner of binding, live state, publisher, registry, and clock input.
 *
 * Motion instances do not construct this object. They attach membership and request seeds;
 * the single clock subscription remains here, so detach and reattach cannot reset the tick
 * sequence used by retry scheduling.
 */
export class GraphRuntime {
  readonly #binding: GraphBinding;
  readonly #registry: PatchRegistry;
  readonly #publisher: GraphPublisher;
  readonly #clock: Clock;
  readonly #compose: ComposeResolver;
  readonly #unsubscribe: () => void;
  readonly #members = new Set<string>();
  #lastTick = 0;
  #disposed = false;

  constructor(project: ProjectDefinition, clock: Clock, compose: ComposeResolver) {
    this.#binding = new GraphBinding(project);
    this.#registry = new PatchRegistry();
    this.#publisher = new GraphPublisher(this.#registry);
    this.#clock = clock;
    this.#compose = compose;
    this.#members = new Set(this.#binding.graph.nodes.map(({ id }) => id));
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

  attach(nodeId: string): void {
    this.#assertLive();
    if (!this.#binding.graph.nodeById[nodeId]) throw new TypeError(`Unknown graph node \"${nodeId}\".`);
    this.#members.add(nodeId);
  }

  detach(nodeId: string): void {
    this.#assertLive();
    this.#members.delete(nodeId);
  }

  flush(seeds: readonly string[] = [...this.#members], tick = this.#lastTick): PatchBatch {
    this.#assertLive();
    if (tick < this.#lastTick) throw new RangeError("Runtime ticks must be monotonic.");
    this.#lastTick = tick;
    const nodes = this.#binding.graph.nodes.map((node) =>
      Object.freeze({ ...node, compose: this.#compose(node) }),
    );
    return this.#publisher.flush(
      Object.freeze({ ...this.#binding.graph, nodes: Object.freeze(nodes) }),
      seeds,
      tick,
    );
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#unsubscribe();
    this.#members.clear();
  }

  #onTick(event: ClockTick): void {
    if (this.#disposed) return;
    if (event.tick <= this.#lastTick) throw new RangeError("Clock ticks must be strictly increasing.");
    this.flush([...this.#members], event.tick);
  }

  #assertLive(): void {
    if (this.#disposed) throw new Error("GraphRuntime is disposed.");
  }
}
