import type { Diagnostic, ProjectDefinition, TrackDefinition } from "../contract/v5";
import { validateKeyframes } from "../contract/validate-v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import { Diagnostics, type DiagnosticsSnapshot } from "./diagnostics";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";

import type { GraphBuilder } from "../ports/graph-builder";

export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly compileTrack?: (track: TrackDefinition, nodeId?: string) => void;
  readonly disposeTrack?: (nodeId: string) => void;
  readonly addMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeMotionTrack?: (motionId: string, trackId: string) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly disposeComposition?: () => void;
  /** Capacity of the bounded diagnostics history. Diagnostics itself supplies the default. */
  readonly diagnosticsCapacity?: number;
  readonly graphBuilder?: GraphBuilder;
}

export class ProjectRuntime {
  readonly #project: ProjectDefinition;
  readonly #graph: GraphRuntime;
  readonly #instances = new Map<string, object>();
  readonly #adopted = new Map<
    string,
    { track: TrackDefinition; owner: object; motionId?: string }
  >();
  readonly #diagnostics: Diagnostics;
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #compileTrack: ((track: TrackDefinition, nodeId?: string) => void) | undefined;
  readonly #disposeTrack: ((nodeId: string) => void) | undefined;
  readonly #addMotionTrack:
    | ((motionId: string, trackId: string, duration?: number) => void)
    | undefined;
  readonly #removeMotionTrack: ((motionId: string, trackId: string) => void) | undefined;
  readonly #disposeComposition: () => void;
  #disposed = false;

  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#compileTrack = options.compileTrack;
    this.#disposeTrack = options.disposeTrack;
    this.#addMotionTrack = options.addMotionTrack;
    this.#removeMotionTrack = options.removeMotionTrack;
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    this.#diagnostics = new Diagnostics(options.diagnosticsCapacity);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        scheduler: options.scheduler,
        onClockTick: options.onClockTick,
        graphBuilder: options.graphBuilder,
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
  /** Add a runtime-created track to the graph (as a free track or into a specific motion). */
  adopt(
    track: TrackDefinition,
    owner: object,
    options?: { motionId?: string },
  ): { readonly id: string; readonly track: TrackDefinition } {
    this.#assertLive();
    const motionId = options?.motionId;
    if (motionId !== undefined) {
      const motionExists = this.#project.motions.some((m) => m.id === motionId);
      if (!motionExists) throw new TypeError(`Unknown motion "${motionId}".`);
    }

    const id =
      motionId !== undefined
        ? qualifyMotionTrack(motionId, track.id).value
        : qualifyFreeTrack(track.id).value;

    if (this.#graph.state.hasNode(id) || this.#adopted.has(id))
      throw new TypeError(`Adopted track "${id}" already exists.`);

    // Validate keyframes at the same trust level as authored tracks.
    // compilePercentKeyframes only silently filters bad stops; validateKeyframes
    // rejects them with diagnostics (non-finite p, non-monotonic, duplicates).
    const keyframeDiagnostics: Diagnostic[] = [];
    validateKeyframes(track.keyframes, `adopt(${track.id}).keyframes`, keyframeDiagnostics);
    const keyframeErrors = keyframeDiagnostics.filter(({ severity }) => severity === "error");
    if (keyframeErrors.length > 0)
      throw new TypeError(
        keyframeErrors
          .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
          .join(" "),
      );

    // Compile keyframes before any graph mutation so malformed keyframes fail atomically.
    this.#compileTrack?.(track, id);

    this.#adopted.set(id, { track, owner, motionId });
    this.#graph.replaceGraph(this.#buildProjectSnapshot());
    this.mount(id);

    if (motionId !== undefined) {
      this.#addMotionTrack?.(motionId, id, track.duration);
    }

    return Object.freeze({ id, track });
  }
  /** Destroy an adopted track. Only the owner can destroy; others detach via unmount. */
  destroyAdopted(nodeId: string, owner: object): void {
    this.#assertLive();
    const adopted = this.#adopted.get(nodeId);
    if (adopted === undefined) throw new TypeError(`Node "${nodeId}" is not adopted.`);
    if (adopted.owner !== owner)
      throw new TypeError(`Only the adopting owner can destroy "${nodeId}".`);
    // Use evictNode (not unmount) so the listener set is freed, not just the patch.
    // Adopted nodes are permanent destructions; unmount's remount-safe remove() would
    // leave the #nodeListeners entry alive until dispose().
    this.#instances.delete(nodeId);
    this.#graph.evictNode(nodeId);
    this.#adopted.delete(nodeId);
    this.#disposeTrack?.(nodeId);
    if (adopted.motionId !== undefined) {
      this.#removeMotionTrack?.(adopted.motionId, nodeId);
    }
    this.#graph.replaceGraph(this.#buildProjectSnapshot());
  }
  #buildProjectSnapshot(): ProjectDefinition {
    const adoptedList = [...this.#adopted.values()];
    const freeAdopted = adoptedList
      .filter((entry) => entry.motionId === undefined)
      .map((e) => e.track);
    const nextFreeTracks = [...(this.#project.freeTracks ?? []), ...freeAdopted];

    const nextMotions = this.#project.motions.map((motion) => {
      const motionAdopted = adoptedList
        .filter((entry) => entry.motionId === motion.id)
        .map((e) => e.track);
      return motionAdopted.length === 0
        ? motion
        : { ...motion, tracks: [...motion.tracks, ...motionAdopted] };
    });

    return {
      ...this.#project,
      motions: nextMotions,
      freeTracks: nextFreeTracks,
    };
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
