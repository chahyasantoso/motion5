import type {
  MotionDefinition,
  ObservationDefinition,
  Patch,
  PatchBatch,
  PatchListener,
  ProjectDefinition,
  TrackDefinition,
  TriggerSignal,
} from "./contract/v5";
import { describeDiagnostics } from "./contract/diagnostics";
import { resolveTriggerDefinition, validateV5 } from "./contract/validate-v5";
import { IncrementalGraphBuilder } from "./adapters/graph-builder/incremental";
import { createDefaultTriggerFactory } from "./adapters/trigger-factory/default";
import { compilePercentKeyframes } from "./domain/keyframe-compiler";
import { Motion, type MotionTrackEntry } from "./domain/motion";
import { PluginRegistry } from "./domain/plugins";
import { Track } from "./domain/track";
import type { ImmutableRecord } from "./domain/values";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import type { ClockConsumer, CreatedTrigger, TriggerFactory } from "./ports/trigger-factory";
import { ProjectRuntime } from "./runtime/project-runtime";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins?: PluginRegistry;
  readonly triggerFactory?: TriggerFactory;
}
export interface TrackHandle {
  readonly id: string;
  readonly track: TrackDefinition;
  remove(): void;
  replace(next: TrackDefinition): void;
  addObserve(observation: ObservationDefinition): void;
  removeObserve(observation: ObservationDefinition): void;
}
export interface ProjectHandle {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatch;
  signal(motionId: string, signal: TriggerSignal): void;
  addMotion(definition: MotionDefinition): { readonly id: string };
  destroyMotion(motionId: string): void;
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
  track(nodeId: string): TrackHandle;
  dependantsOf(nodeId: string): readonly string[];
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
    addMotion: (definition) => runtime.addMotion(definition),
    destroyMotion: (motionId) => runtime.destroyMotion(motionId),
    addTrack: (track, options) => runtime.addTrack(track, options),
    track: (nodeId) => runtime.track(nodeId),
    dependantsOf: (nodeId) => runtime.dependantsOf(nodeId),
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
      if (!definition) throw new TypeError(`Unknown graph node "${nodeId}".`);
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
      trackDef: { id: string; duration?: number; keyframes?: Readonly<Record<string, unknown>> },
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
      tracks.set(
        nodeId,
        new Track({
          interpolator: this.#options.interpolator,
          interpolationConfig: trackDef,
          ...(resolved ? { plugins: resolved } : {}),
        }),
      );
    };
    const disposeTrack = (nodeId: string): void => {
      const track = tracks.get(nodeId);
      if (track) {
        track.dispose();
        tracks.delete(nodeId);
      }
    };
    const motions = new Map<string, Motion>();
    const createdTriggers = new Map<string, CreatedTrigger>();
    const consumers = new Map<string, ClockConsumer>();
    const triggerFactory = this.#options.triggerFactory ?? createDefaultTriggerFactory();
    let runtime: ProjectRuntime;
    const releaseMotion = (motionId: string): void => {
      consumers.delete(motionId);
      createdTriggers.get(motionId)?.dispose();
      createdTriggers.delete(motionId);
    };
    const buildMotion = (
      definition: MotionDefinition,
      entries: readonly MotionTrackEntry[],
    ): Motion => {
      // Narrow once, at the boundary that already proved the trigger valid, and hand the canonical
      // form to the factory. Factories never re-derive the discriminated union themselves.
      const trigger = resolveTriggerDefinition(
        definition.trigger,
        `motions.${definition.id}.trigger`,
      );
      const created = triggerFactory.create({
        motionId: definition.id,
        definition,
        trigger,
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
      });
      createdTriggers.set(definition.id, created);
      let motion!: Motion;
      // A flag rather than a nullable local, so the invalidate closure and the clockBinding
      // registration site below keep reading a Motion that is always present by the time they run.
      // The catch is the only place that has to ask whether an instance exists at all.
      let constructed = false;
      try {
        motion = new Motion({
          clock: this.#options.clock,
          scheduler: this.#options.scheduler,
          tracks: entries,
          // The compiled map is the single owner. Motion holds ids and resolves per use, so a
          // recompiled node can never leave it driving a disposed Track. See ADR-031.
          resolveTrack: (id) => tracks.get(id),
          trigger: created.port,
          disposeTracks: false,
          listenToClock: false,
          acceptsExternalSignal: created.acceptsExternalSignal,
          invalidate: () => {
            const ids = motion.tracks.map((t) => t.id);
            if (ids.length > 0) runtime.invalidate(ids);
          },
          stagger: definition.stagger,
        });
        constructed = true;
        motion.play();
        if (consumers.has(definition.id))
          throw new TypeError(`Motion "${definition.id}" already has a clock consumer.`);
        // Total and exhaustive. No `??` fallback, so a push-driven trigger cannot silently inherit
        // motion.onTick, and no Motion can ever hold both a driver and its own clock advance.
        const binding = created.clockBinding;
        switch (binding.kind) {
          case "driver":
            consumers.set(definition.id, { onTick: (event) => binding.onTick(event) });
            break;
          case "motion":
            consumers.set(definition.id, { onTick: (event) => motion.onTick(event) });
            break;
          case "none":
            break;
        }
        return motion;
      } catch (error) {
        releaseMotion(definition.id);
        // releaseMotion owns the clock consumer and the created trigger. Nothing owned the Motion:
        // it is never returned on this path, so it never enters `motions`, so disposeComposition
        // cannot reach it either. Without this the instance keeps the lifecycle attachment and the
        // trigger subscription play() made, and ADR-032's exactly-once disposal is exactly zero.
        // Disposed after releaseMotion, matching the destroyMotion hook and disposeComposition.
        // Issue #134.
        if (constructed) motion.dispose();
        throw error;
      }
    };
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
          motion.addTrack({ id: trackId, ...(duration === undefined ? {} : { duration }) });
        },
        replaceMotionTrack: (motionId, trackId, duration) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          motion.replaceTrack({ id: trackId, ...(duration === undefined ? {} : { duration }) });
        },
        removeMotionTrack: (motionId, trackId) => motions.get(motionId)?.removeTrack(trackId),
        createMotion: (definition) => motions.set(definition.id, buildMotion(definition, [])),
        destroyMotion: (motionId) => {
          const motion = motions.get(motionId);
          if (motion) {
            releaseMotion(motionId);
            motion.dispose();
            motions.delete(motionId);
          }
        },
        onClockTick: (event) => {
          const failures: unknown[] = [];
          for (const consumer of consumers.values()) {
            try {
              consumer.onTick(event);
            } catch (error) {
              failures.push(error);
            }
          }
          if (failures.length > 0)
            throw failures.length === 1
              ? failures[0]
              : new AggregateError(failures, "Clock consumer fanout failed.");
        },
        disposeComposition: () => {
          for (const motionId of [...motions.keys()]) releaseMotion(motionId);
          for (const motion of motions.values()) motion.dispose();
          motions.clear();
          for (const trigger of createdTriggers.values()) trigger.dispose();
          createdTriggers.clear();
          consumers.clear();
          for (const track of tracks.values()) track.dispose();
          tracks.clear();
        },
      });
      for (const motionDefinition of acceptedProject.motions) {
        const ids = motionTrackIds.get(motionDefinition.id) ?? [];
        // Conditional spread, so a load-time entry never carries an explicitly undefined duration
        // while the hook-built entries omit the key. One entry shape, both construction paths.
        const entries = ids.map((id) => {
          const duration = nodes.get(id)?.duration;
          return { id, ...(duration === undefined ? {} : { duration }) };
        });
        motions.set(motionDefinition.id, buildMotion(motionDefinition, entries));
      }
      return createHandle(runtime, (motionId, signal) => {
        const motion = motions.get(motionId);
        if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
        motion.signal(signal);
      });
    } catch (error) {
      for (const motionId of [...motions.keys()]) releaseMotion(motionId);
      for (const motion of motions.values()) motion.dispose();
      motions.clear();
      for (const trigger of createdTriggers.values()) trigger.dispose();
      createdTriggers.clear();
      for (const track of tracks.values()) track.dispose();
      throw error;
    }
  }
}
