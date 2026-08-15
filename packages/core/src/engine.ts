import type {
  Diagnostic,
  Patch,
  PatchBatch,
  PatchListener,
  ProjectDefinition,
  TrackDefinition,
  TriggerSignal,
} from "./contract/v5";
import { validateV5 } from "./contract/validate-v5";
import { IncrementalGraphBuilder } from "./adapters/graph-builder/incremental";
import { compilePercentKeyframes } from "./domain/keyframe-compiler";
import { Motion } from "./domain/motion";
import { PluginRegistry } from "./domain/plugins";
import { Track } from "./domain/track";
import type { ImmutableRecord } from "./domain/values";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import { createManualTriggerPort, type TriggerPort } from "./ports/trigger";
import { ProjectRuntime } from "./runtime/project-runtime";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins?: PluginRegistry;
}
export interface ProjectHandle {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatch;
  signal(motionId: string, signal: TriggerSignal): void;
  subscribe(nodeId: string, listener: PatchListener): () => void;
  get(nodeId: string): Patch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
  adopt(
    track: TrackDefinition,
    owner: object,
    options?: { motionId?: string },
  ): { readonly id: string; readonly track: TrackDefinition };
  destroyAdopted(nodeId: string, owner: object): void;
  dispose(): void;
}
type RuntimeLike = ProjectRuntime;
function createHandle(
  runtime: RuntimeLike,
  signal: (motionId: string, signal: TriggerSignal) => void,
): ProjectHandle {
  const handle: ProjectHandle = {
    mount: (nodeId, instance = {}) => runtime.mount(nodeId, instance),
    unmount: (nodeId) => runtime.unmount(nodeId),
    seek: (nodeId, progress) => runtime.seek(nodeId, progress),
    signal,
    subscribe: (nodeId, listener) => runtime.graph.registry.subscribeNode(nodeId, listener),
    get: (nodeId) => runtime.graph.registry.get(nodeId),
    subscribeNode: (nodeId, listener) => runtime.graph.registry.subscribeNode(nodeId, listener),
    adopt: (track, owner, options) => runtime.adopt(track, owner, options),
    destroyAdopted: (nodeId, owner) => runtime.destroyAdopted(nodeId, owner),
    dispose: () => runtime.dispose(),
  };
  Object.defineProperty(handle, "_runtime", {
    value: runtime,
    enumerable: false,
    writable: false,
    configurable: false,
  });
  return handle;
}
function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
function assertValidProject(project: unknown): ProjectDefinition {
  const result = validateV5(project);
  if (!result.valid || result.value === null)
    throw new TypeError(
      result.diagnostics.length === 0
        ? "Project failed v5 validation."
        : describeDiagnostics(result.diagnostics),
    );
  return result.value;
}

export class Engine {
  readonly #options: EngineOptions;
  readonly #plugins: PluginRegistry | undefined;
  constructor(options: EngineOptions) {
    assertClock(options.clock);
    assertInterpolator(options.interpolator);
    assertScheduler(options.scheduler);
    this.#options = options;
    this.#plugins = options.plugins;
  }
  load(project: ProjectDefinition): ProjectHandle {
    const acceptedProject = assertValidProject(project);
    const tracks = new Map<string, Track>();
    const nodes = new Map<
      string,
      { id: string; duration?: number; keyframes?: Readonly<Record<string, unknown>> }
    >();
    const motionTrackIds = new Map<string, readonly string[]>();
    for (const motion of acceptedProject.motions) {
      const ids = motion.tracks.map((track) => qualifyMotionTrack(motion.id, track.id).value);
      motionTrackIds.set(motion.id, ids);
      for (const track of motion.tracks)
        nodes.set(qualifyMotionTrack(motion.id, track.id).value, { ...track, id: track.id });
    }
    for (const track of acceptedProject.freeTracks ?? [])
      nodes.set(qualifyFreeTrack(track.id).value, { ...track, id: track.id });
    const compile = (nodeId: string): Track => {
      const existing = tracks.get(nodeId);
      if (existing) return existing;
      const definition = nodes.get(nodeId);
      if (!definition) throw new TypeError(`Unknown graph node \"${nodeId}\".`);
      const path = `${nodeId}.keyframes`;
      const resolved = this.#plugins?.resolveForKeyframes(definition.keyframes ?? {}, path, {
        id: nodeId,
        duration: definition.duration,
      });
      const preparedKeyframes = {
        ...(definition.keyframes ?? {}),
        ...(resolved?.preparation.keyframes ?? {}),
      };
      const keyframeCompilation = compilePercentKeyframes(preparedKeyframes, path);
      const diagnostics = [...(resolved?.diagnostics ?? []), ...keyframeCompilation.diagnostics];
      if (diagnostics.some(({ severity }) => severity === "error"))
        throw new TypeError(describeDiagnostics(diagnostics));
      const track = new Track({
        interpolator: this.#options.interpolator,
        interpolationConfig: definition,
        ...(resolved ? { plugins: resolved } : {}),
      });
      tracks.set(nodeId, track);
      return track;
    };
    const compileTrackDefinition = (
      trackDef: {
        id: string;
        duration?: number;
        keyframes?: Readonly<Record<string, unknown>>;
      },
      targetNodeId?: string,
    ): void => {
      const nodeId =
        targetNodeId ??
        (trackDef.id.includes("/") ? trackDef.id : qualifyFreeTrack(trackDef.id).value);
      if (tracks.has(nodeId)) return;
      const path = `${nodeId}.keyframes`;
      const resolved = this.#plugins?.resolveForKeyframes(trackDef.keyframes ?? {}, path, {
        id: nodeId,
        duration: trackDef.duration,
      });
      const preparedKeyframes = {
        ...(trackDef.keyframes ?? {}),
        ...(resolved?.preparation.keyframes ?? {}),
      };
      const keyframeCompilation = compilePercentKeyframes(preparedKeyframes, path);
      const diagnostics = [...(resolved?.diagnostics ?? []), ...keyframeCompilation.diagnostics];
      if (diagnostics.some(({ severity }) => severity === "error"))
        throw new TypeError(describeDiagnostics(diagnostics));
      const track = new Track({
        interpolator: this.#options.interpolator,
        interpolationConfig: trackDef,
        ...(resolved ? { plugins: resolved } : {}),
      });
      tracks.set(nodeId, track);
    };
    const disposeTrack = (nodeId: string): void => {
      const track = tracks.get(nodeId);
      if (track) {
        track.dispose();
        tracks.delete(nodeId);
      }
    };
    const motions = new Map<string, Motion>();
    try {
      for (const nodeId of nodes.keys()) compile(nodeId);
      const compose =
        (node: {
          id: string;
          track: { duration?: number; keyframes?: Readonly<Record<string, unknown>> };
        }) =>
        (inputs: Readonly<Record<string, unknown>>) => {
          const snapshot = tracks.get(node.id)!.compose(inputs as Readonly<ImmutableRecord>);
          return {
            values: snapshot.values,
            sourceProgress: snapshot.progress,
            sourceRevisions: {},
          };
        };
      let runtime: ProjectRuntime;
      runtime = new ProjectRuntime(acceptedProject, {
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
        compose,
        graphBuilder: new IncrementalGraphBuilder(),
        setProgress: (nodeId, progress) => tracks.get(nodeId)?.setProgress(progress),
        compileTrack: compileTrackDefinition,
        disposeTrack,
        addMotionTrack: (motionId, trackId, duration) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          const track = tracks.get(trackId);
          if (!track) throw new TypeError(`Unknown graph node "${trackId}".`);
          motion.addTrack({ id: trackId, track, duration });
        },
        removeMotionTrack: (motionId, trackId) => {
          const motion = motions.get(motionId);
          if (motion) {
            motion.removeTrack(trackId);
          }
        },
        onClockTick: (event) => {
          for (const motion of motions.values()) {
            motion.onTick(event);
          }
        },
        disposeComposition: () => {
          for (const motion of motions.values()) motion.dispose();
          motions.clear();
          for (const track of tracks.values()) track.dispose();
          tracks.clear();
        },
      });
      for (const motionDefinition of acceptedProject.motions) {
        const ids = motionTrackIds.get(motionDefinition.id) ?? [];
        const entries = ids.map((id) => {
          const track = tracks.get(id);
          if (!track) throw new TypeError(`Unknown graph node \"${id}\".`);
          const definition = nodes.get(id);
          return { id, track, duration: definition?.duration };
        });
        const triggerPort = createManualTriggerPort();
        let motion: Motion;
        motion = new Motion({
          clock: this.#options.clock,
          scheduler: this.#options.scheduler,
          tracks: entries,
          trigger: triggerPort,
          disposeTracks: false,
          listenToClock: false,
          invalidate: () => {
            const currentIds = motion.tracks.map((t) => t.id);
            if (currentIds.length > 0) runtime.invalidate(currentIds);
          },
          stagger: motionDefinition.stagger,
        });
        motion.play();
        motions.set(motionDefinition.id, motion);
      }
      return createHandle(runtime, (motionId, signal) => {
        const motion = motions.get(motionId);
        if (!motion) throw new TypeError(`Unknown motion \"${motionId}\".`);
        motion.signal(signal);
      });
    } catch (error) {
      for (const motion of motions.values()) motion.dispose();
      for (const track of tracks.values()) track.dispose();
      throw error;
    }
  }
}
