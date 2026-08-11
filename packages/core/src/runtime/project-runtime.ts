import type { ProjectDefinition } from "../contract/v5";
import type { Clock } from "../ports/clock";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";

export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly compose: ComposeResolver;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly disposeComposition?: () => void;
}

export class ProjectRuntime {
  readonly #project: ProjectDefinition;
  readonly #graph: GraphRuntime;
  readonly #instances = new Map<string, object>();
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #disposeComposition: () => void;
  #disposed = false;

  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    try { this.#graph = new GraphRuntime(project, options.clock, options.compose); } catch (error) { this.#disposeComposition(); throw error; }
  }
  get project(): ProjectDefinition { return this.#project; }
  get graph(): GraphRuntime { return this.#graph; }
  get instanceCount(): number { return this.#instances.size; }
  mount(nodeId: string, instance: object = {}): object { this.#assertLive(); if (this.#instances.has(nodeId)) throw new TypeError(`Node "${nodeId}" is already mounted.`); this.#graph.attach(nodeId); this.#instances.set(nodeId, instance); return instance; }
  unmount(nodeId: string): void { this.#assertLive(); const instance = this.#instances.get(nodeId); if (instance === undefined) return; this.#instances.delete(nodeId); this.#graph.detach(nodeId); }
  seek(nodeId: string, progress: number) { this.#assertLive(); this.#setProgress(nodeId, progress); return this.#graph.invalidate([nodeId]); }
  dispose(): void { if (this.#disposed) return; this.#disposed = true; for (const nodeId of [...this.#instances.keys()]) this.#graph.detach(nodeId); this.#instances.clear(); this.#graph.dispose(); this.#disposeComposition(); }
  #assertLive(): void { if (this.#disposed) throw new Error("ProjectRuntime is disposed."); }
}
