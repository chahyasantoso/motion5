import type { ProjectDefinition, TrackDefinition } from "../contract/v5";
import type { Clock } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import { qualifyFreeTrack } from "../graph/ids";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";

export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly disposeComposition?: () => void;
}

export class ProjectRuntime {
  readonly #project: ProjectDefinition;
  readonly #graph: GraphRuntime;
  readonly #instances = new Map<string, object>();
  readonly #adopted = new Map<string, { track: TrackDefinition; owner: object }>();
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #disposeComposition: () => void;
  #disposed = false;

  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        scheduler: options.scheduler,
      });
    } catch (error) {
      this.#disposeComposition();
      throw error;
    }
  }
  get project(): ProjectDefinition {
    return this.#project;
  }
  get graph(): GraphRuntime {
    return this.#graph;
  }
  get instanceCount(): number {
    return this.#instances.size;
  }
  mount(nodeId: string, instance: object = {}): object {
    this.#assertLive();
    if (this.#instances.has(nodeId)) throw new TypeError(`Node "${nodeId}" is already mounted.`);
    this.#graph.attach(nodeId);
    this.#instances.set(nodeId, instance);
    return instance;
  }
  unmount(nodeId: string): void {
    this.#assertLive();
    const instance = this.#instances.get(nodeId);
    if (instance === undefined) return;
    this.#instances.delete(nodeId);
    this.#graph.detach(nodeId);
  }
  /** Add a runtime-created track to the same graph as authored free tracks. */
  adopt(track: TrackDefinition, owner: object): { readonly id: string; readonly track: TrackDefinition } {
    this.#assertLive();
    // Reuse P2-01's qualification (never invent a parallel `~/` prefix by hand). This also
    // validates the authored track id, so a bad id fails before anything is mutated.
    const id = qualifyFreeTrack(track.id).value;
    if (this.#graph.state.hasNode(id) || this.#adopted.has(id))
      throw new TypeError(`Adopted track "${id}" already exists.`);
    // The stored track keeps its authored (unqualified) id: buildGraphIR qualifies free
    // tracks itself via qualifyFreeTrack, and rejects any authored id that already contains
    // '/'. Composing the freeTracks list from the authored baseline plus every currently
    // adopted track (rather than a stale `#project.freeTracks` snapshot) keeps multiple
    // adoptions and destructions consistent with each other.
    const nextFreeTracks = [
      ...(this.#project.freeTracks ?? []),
      ...[...this.#adopted.values()].map((entry) => entry.track),
      track,
    ];
    this.#graph.binding.replace({ ...this.#project, freeTracks: nextFreeTracks });
    this.#adopted.set(id, { track, owner });
    this.mount(id);
    return Object.freeze({ id, track });
  }
  /** Destroy an adopted track. Only the owner can destroy; others detach via unmount. */
  destroyAdopted(nodeId: string, owner: object): void {
    this.#assertLive();
    const adopted = this.#adopted.get(nodeId);
    if (adopted === undefined) throw new TypeError(`Node "${nodeId}" is not adopted.`);
    if (adopted.owner !== owner) throw new TypeError(`Only the adopting owner can destroy "${nodeId}".`);
    this.unmount(nodeId);
    this.#adopted.delete(nodeId);
    const remaining = [
      ...(this.#project.freeTracks ?? []),
      ...[...this.#adopted.values()].map((entry) => entry.track),
    ];
    this.#graph.binding.replace({ ...this.#project, freeTracks: remaining });
  }
  seek(nodeId: string, progress: number) {
    this.#assertLive();
    this.#setProgress(nodeId, progress);
    return this.#graph.invalidate([nodeId]);
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const nodeId of [...this.#instances.keys()]) this.#graph.detach(nodeId);
    this.#instances.clear();
    this.#adopted.clear();
    this.#graph.dispose();
    this.#disposeComposition();
  }
  #assertLive(): void {
    if (this.#disposed) throw new Error("ProjectRuntime is disposed.");
  }
}
