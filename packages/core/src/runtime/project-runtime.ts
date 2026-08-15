import type { ProjectDefinition, TrackDefinition } from "../contract/v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import { qualifyFreeTrack } from "../graph/ids";
import { Diagnostics, type DiagnosticsSnapshot } from "./diagnostics";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";

export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly compileTrack?: (track: TrackDefinition) => void;
  readonly disposeTrack?: (nodeId: string) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly disposeComposition?: () => void;
  /** Capacity of the bounded diagnostics history. Diagnostics itself supplies the default. */
  readonly diagnosticsCapacity?: number;
}

export class ProjectRuntime {
  readonly #project: ProjectDefinition;
  readonly #graph: GraphRuntime;
  readonly #instances = new Map<string, object>();
  readonly #adopted = new Map<string, { track: TrackDefinition; owner: object }>();
  readonly #diagnostics: Diagnostics;
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #compileTrack: ((track: TrackDefinition) => void) | undefined;
  readonly #disposeTrack: ((nodeId: string) => void) | undefined;
  readonly #disposeComposition: () => void;
  #disposed = false;

  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#compileTrack = options.compileTrack;
    this.#disposeTrack = options.disposeTrack;
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    this.#diagnostics = new Diagnostics(options.diagnosticsCapacity);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        scheduler: options.scheduler,
        onClockTick: options.onClockTick,
        // Flush-level diagnostics (clock regression, flush/scheduler failure) feed the same
        // single buffer as patch/batch diagnostics below; no second, parallel stream.
        onFlushError: (diagnostic) => this.#diagnostics.record(diagnostic),
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
  /** A bounded, inspection-only snapshot of every diagnostic recorded for this project. */
  get diagnostics(): DiagnosticsSnapshot {
    return this.#diagnostics.snapshot();
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
  adopt(
    track: TrackDefinition,
    owner: object,
  ): { readonly id: string; readonly track: TrackDefinition } {
    this.#assertLive();
    // Reuse P2-01's qualification (never invent a parallel `~/` prefix by hand). This also
    // validates the authored track id, so a bad id fails before anything is mutated.
    const id = qualifyFreeTrack(track.id).value;
    if (this.#graph.state.hasNode(id) || this.#adopted.has(id))
      throw new TypeError(`Adopted track "${id}" already exists.`);

    // Compile keyframes before any graph mutation so malformed keyframes fail atomically.
    this.#compileTrack?.(track);

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
    this.#graph.clearPublisherCache();
    this.#adopted.set(id, { track, owner });
    this.mount(id);
    return Object.freeze({ id, track });
  }
  /** Destroy an adopted track. Only the owner can destroy; others detach via unmount. */
  destroyAdopted(nodeId: string, owner: object): void {
    this.#assertLive();
    const adopted = this.#adopted.get(nodeId);
    if (adopted === undefined) throw new TypeError(`Node "${nodeId}" is not adopted.`);
    if (adopted.owner !== owner)
      throw new TypeError(`Only the adopting owner can destroy "${nodeId}".`);
    this.unmount(nodeId);
    this.#adopted.delete(nodeId);
    this.#disposeTrack?.(nodeId);
    const remaining = [
      ...(this.#project.freeTracks ?? []),
      ...[...this.#adopted.values()].map((entry) => entry.track),
    ];
    this.#graph.binding.replace({ ...this.#project, freeTracks: remaining });
    this.#graph.clearPublisherCache();
  }
  seek(nodeId: string, progress: number) {
    this.#assertLive();
    this.#setProgress(nodeId, progress);
    const batch = this.#graph.invalidate([nodeId]);
    // Everything already carried inline on the batch (pending-reference warnings, composition
    // failures) also lands in the one bounded diagnostics buffer. Patches and the batch itself
    // are untouched; this is additional retained history, not a new delivery path.
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  invalidate(nodeIds: readonly string[]) {
    this.#assertLive();
    const batch = this.#graph.invalidate(nodeIds);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
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
