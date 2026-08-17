import type {
  Diagnostic,
  MotionDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../contract/v5";
import { validateTrackDefinition } from "../contract/validate-v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import { Diagnostics, type DiagnosticsSnapshot } from "./diagnostics";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";

import type { GraphBuilder } from "../ports/graph-builder";

type AdoptedEntry = { track: TrackDefinition; owner: object; motionId?: string };

export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly compileTrack?: (track: TrackDefinition, nodeId?: string) => void;
  readonly disposeTrack?: (nodeId: string) => void;
  readonly addMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeMotionTrack?: (motionId: string, trackId: string) => void;
  readonly createMotion?: (definition: MotionDefinition) => void;
  readonly destroyMotion?: (motionId: string) => void;
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
  readonly #adopted = new Map<string, AdoptedEntry>();
  readonly #motions = new Map<string, MotionDefinition>();
  readonly #diagnostics: Diagnostics;
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #compileTrack: ((track: TrackDefinition, nodeId?: string) => void) | undefined;
  readonly #disposeTrack: ((nodeId: string) => void) | undefined;
  readonly #addMotionTrack:
    | ((motionId: string, trackId: string, duration?: number) => void)
    | undefined;
  readonly #removeMotionTrack: ((motionId: string, trackId: string) => void) | undefined;
  readonly #createMotion: ((definition: MotionDefinition) => void) | undefined;
  readonly #destroyMotion: ((motionId: string) => void) | undefined;
  readonly #disposeComposition: () => void;
  #disposed = false;

  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    for (const motion of project.motions) this.#motions.set(motion.id, motion);
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#compileTrack = options.compileTrack;
    this.#disposeTrack = options.disposeTrack;
    this.#addMotionTrack = options.addMotionTrack;
    this.#removeMotionTrack = options.removeMotionTrack;
    this.#createMotion = options.createMotion;
    this.#destroyMotion = options.destroyMotion;
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    this.#diagnostics = new Diagnostics(options.diagnosticsCapacity);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        scheduler: options.scheduler,
        onClockTick: options.onClockTick,
        graphBuilder: options.graphBuilder,
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
  /**
   * Create an empty runtime Motion. Core currently uses a manual trigger for every Motion;
   * trigger.type is retained for schema fidelity but scroll/time drivers are not wired here.
   */
  addMotion(definition: MotionDefinition): { readonly id: string } {
    this.#assertLive();
    if (definition.tracks.length > 0)
      throw new TypeError(`Runtime Motion "${definition.id}" must start with empty tracks.`);
    if (this.#motions.has(definition.id))
      throw new TypeError(`Motion "${definition.id}" already exists.`);
    const candidateMotions = new Map(this.#motions);
    candidateMotions.set(definition.id, { ...definition, tracks: [] });
    this.#graph.replaceGraph(this.#buildProjectSnapshot(this.#adopted, candidateMotions));
    const accepted = candidateMotions.get(definition.id)!;
    this.#motions.set(definition.id, accepted);
    this.#createMotion?.(accepted);
    return Object.freeze({ id: definition.id });
  }
  /** Destroy a Motion only after its runtime-owned tracks have been removed. */
  destroyMotion(motionId: string): void {
    this.#assertLive();
    const definition = this.#motions.get(motionId);
    if (definition === undefined) throw new TypeError(`Unknown motion "${motionId}".`);
    if (definition.tracks.length > 0)
      throw new TypeError(`Motion "${motionId}" still has authored tracks.`);
    const owned = [...this.#adopted.values()].filter((entry) => entry.motionId === motionId);
    if (owned.length > 0)
      throw new TypeError(
        `Motion "${motionId}" still has ${owned.length} track(s). Remove them before destroying it.`,
      );
    const candidateMotions = new Map(this.#motions);
    candidateMotions.delete(motionId);
    this.#graph.replaceGraph(this.#buildProjectSnapshot(this.#adopted, candidateMotions));
    this.#motions.delete(motionId);
    this.#destroyMotion?.(motionId);
  }
  /** Add a runtime-created track to the graph (as a free track or into a specific motion). */
  adopt(
    track: TrackDefinition,
    owner: object,
    options?: { motionId?: string },
  ): { readonly id: string; readonly track: TrackDefinition } {
    this.#assertLive();
    const motionId = options?.motionId;
    if (motionId !== undefined && !this.#motions.has(motionId))
      throw new TypeError(`Unknown motion "${motionId}".`);
    const id =
      motionId !== undefined
        ? qualifyMotionTrack(motionId, track.id).value
        : qualifyFreeTrack(track.id).value;
    if (this.#graph.state.hasNode(id) || this.#adopted.has(id))
      throw new TypeError(`Adopted track "${id}" already exists.`);
    if (this.#instances.has(id)) throw new TypeError(`Node "${id}" is already mounted.`);
    const validation = validateTrackDefinition(track, `adopt(${track.id})`);
    const keyframeErrors = validation.diagnostics.filter(({ severity }) => severity === "error");
    if (!validation.valid || validation.value === null)
      throw new TypeError(
        keyframeErrors
          .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
          .join(" ") || `Track "${track.id}" failed validation.`,
      );
    const acceptedTrack = validation.value;
    const candidateAdopted = new Map(this.#adopted);
    candidateAdopted.set(id, { track: acceptedTrack, owner, motionId });
    try {
      this.#compileTrack?.(acceptedTrack, id);
      this.#graph.replaceGraph(this.#buildProjectSnapshot(candidateAdopted, this.#motions));
    } catch (error) {
      this.#disposeTrack?.(id);
      throw error;
    }
    this.#adopted.set(id, { track: acceptedTrack, owner, motionId });
    this.mount(id);
    if (motionId !== undefined) this.#addMotionTrack?.(motionId, id, acceptedTrack.duration);
    return Object.freeze({ id, track: acceptedTrack });
  }
  /** Destroy an adopted track. Only the owner can destroy; others detach via unmount. */
  destroyAdopted(nodeId: string, owner: object): void {
    this.#assertLive();
    const adopted = this.#adopted.get(nodeId);
    if (adopted === undefined) throw new TypeError(`Node "${nodeId}" is not adopted.`);
    if (adopted.owner !== owner)
      throw new TypeError(`Only the adopting owner can destroy "${nodeId}".`);
    const candidateAdopted = new Map(this.#adopted);
    candidateAdopted.delete(nodeId);
    this.#graph.replaceGraph(this.#buildProjectSnapshot(candidateAdopted, this.#motions));
    this.#adopted.delete(nodeId);
    this.#instances.delete(nodeId);
    this.#graph.evictNode(nodeId);
    this.#disposeTrack?.(nodeId);
    if (adopted.motionId !== undefined) this.#removeMotionTrack?.(adopted.motionId, nodeId);
  }
  #buildProjectSnapshot(
    adopted: ReadonlyMap<string, AdoptedEntry>,
    motions: ReadonlyMap<string, MotionDefinition>,
  ): ProjectDefinition {
    const adoptedList = [...adopted.values()];
    const freeAdopted = adoptedList
      .filter((entry) => entry.motionId === undefined)
      .map((e) => e.track);
    const nextMotions = [...motions.values()].map((motion) => {
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
      freeTracks: [...(this.#project.freeTracks ?? []), ...freeAdopted],
    };
  }
  seek(nodeId: string, progress: number) {
    this.#assertLive();
    this.#setProgress(nodeId, progress);
    const batch = this.#graph.invalidate([nodeId]);
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
    this.#motions.clear();
    this.#graph.dispose();
    this.#disposeComposition();
  }
  #assertLive(): void {
    if (this.#disposed) throw new Error("ProjectRuntime is disposed.");
  }
}
