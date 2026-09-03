import type {
  MotionDefinition,
  Patch,
  PatchBatch,
  PatchListener,
  ProjectDefinition,
  TrackDefinition,
  TriggerSignal,
} from "./contract/v5";
import type { MotionHandle } from "./contract/motion-handle";
import type { SchemaTransaction } from "./contract/schema-transaction";
import type { TrackHandle } from "./contract/track-handle";
import { describeDiagnostics } from "./contract/diagnostics";
import { resolveTriggerDefinition, validateV5 } from "./contract/validate-v5";
import { IncrementalGraphBuilder } from "./adapters/graph-builder/incremental";
import { createDefaultTriggerFactory } from "./adapters/trigger-factory/default";
import { compilePercentKeyframes } from "./domain/keyframe-compiler";
import { flattenAuthoredKeyframes } from "./domain/keyframe-groups";
import { Motion, type MotionTrackEntry } from "./domain/motion";
import { PluginRegistry, type RequirementInputs } from "./domain/plugins";
import { Track } from "./domain/track";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import type { ClockConsumer, CreatedTrigger, TriggerFactory } from "./ports/trigger-factory";
import { ProjectRuntime, type StagedTrack } from "./runtime/project-runtime";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins?: PluginRegistry;
  readonly triggerFactory?: TriggerFactory;
}
export interface ProjectHandle {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatch;
  signal(motionId: string, signal: TriggerSignal): void;
  addMotion(definition: MotionDefinition): { readonly id: string };
  destroyMotion(motionId: string): void;
  /**
   * Runs `recipe` as one transaction and commits what it staged exactly once.
   *
   * `SchemaTransaction` is the narrowed surface the recipe is handed, and it is a surface rather
   * than a fence: the recipe closes over this handle too, so a verb that applies immediately
   * refuses by name with `schema-transaction-immediate` while a recipe is open, whether it is
   * reached through a handle or through this object. What one costs, what a throw inside it commits,
   * and which verbs refuse are ADR-064's. See ADR-064.
   */
  edit<T>(recipe: (transaction: SchemaTransaction) => T): T;
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
  track(nodeId: string): TrackHandle;
  /**
   * The two probes, and the reason they exist rather than a single upsert verb.
   *
   * Neither throws for an id this project does not have, so a caller writes the branch at its own
   * call site: `addTrack` assigns a node id and mounts, `replace` refuses a definition whose id would
   * move the node, and one name over both would have a cost and a refusal set depending on which one
   * it landed in. Same relationship `Handle.live` has to every throwing member.
   */
  tryTrack(nodeId: string): TrackHandle | undefined;
  motion(motionId: string): MotionHandle;
  tryMotion(motionId: string): MotionHandle | undefined;
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
interface CompilableTrack {
  readonly id: string;
  readonly duration?: number;
  readonly keyframes?: Readonly<Record<string, unknown>>;
}
type RuntimeLike = ProjectRuntime;
function createHandle(runtime: RuntimeLike): ProjectHandle {
  const handle: ProjectHandle = {
    mount: (nodeId, instance = {}) => runtime.mount(nodeId, instance),
    unmount: (nodeId) => runtime.unmount(nodeId),
    seek: (nodeId, progress) => runtime.seek(nodeId, progress),
    signal: (motionId, value) => runtime.signal(motionId, value),
    addMotion: (definition) => runtime.addMotion(definition),
    destroyMotion: (motionId) => runtime.destroyMotion(motionId),
    edit: <T>(recipe: (transaction: SchemaTransaction) => T) => runtime.edit(recipe),
    addTrack: (track, options) => runtime.addTrack(track, options),
    track: (nodeId) => runtime.track(nodeId),
    tryTrack: (nodeId) => runtime.tryTrack(nodeId),
    motion: (motionId) => runtime.motion(motionId),
    tryMotion: (motionId) => runtime.tryMotion(motionId),
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
// Local on purpose. ProjectRuntime formats its own errors for its own layer, and promoting a shared
// formatter into the contract module would widen the package's declaration surface, which a
// governance gate scans, for two call sites.
function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
/**
 * Runs every step, then reports once.
 *
 * Teardown has no partial success worth keeping. A step that throws leaves the steps behind it
 * unrun, and those are the ones that dispose the Motion, drop the map entry, and release the
 * compiled Track, so stopping early converts one host failure into a leak. Every step is therefore
 * attempted and the failures are collected. Issues #143 and #145.
 *
 * A lone failure is rethrown verbatim rather than wrapped. `ProjectRuntime.rejectAfterRollback`
 * attaches whatever a rollback hook threw to its own `AggregateError`, and callers assert on that
 * value's identity and message, so renaming a single host failure here would break the precedence
 * contract this is meant to support. See ADR-035.
 */
function runAllAndReportOnce(steps: readonly (() => void)[], context: string): void {
  const failures: unknown[] = [];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length === 0) return;
  throw failures.length === 1 ? failures[0] : new AggregateError(failures, context);
}
/**
 * Returns the error to throw for `failure`, after running `cleanup`.
 *
 * A cleanup failure is attached, never substituted. The reason an operation was refused outranks
 * anything its teardown reports, because the caller can act on the first and not on the second.
 * Same rule and same shape as `ProjectRuntime.rejectAfterRollback`, applied at the owner that
 * created the things being released. Returns rather than throws so control flow at each call site
 * is a plain `throw`, with no reliance on never-returning call analysis.
 */
function afterCleanup(failure: unknown, cleanup: () => void): unknown {
  try {
    cleanup();
  } catch (cleanupFailure) {
    return new AggregateError(
      [failure, cleanupFailure],
      `${describeError(failure)} Cleanup failed: ${describeError(cleanupFailure)}`,
    );
  }
  return failure;
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
    // Named once, because two things ask it now: the load-time compile below, and the seam that hands
    // `ProjectRuntime` the registry's answer about a candidate. One reference, so the compile and the
    // predicate cannot end up asking different registries. See ADR-062.
    const registry = this.#plugins;
    const tracks = new Map<string, Track>();
    const nodes = new Map<string, CompilableTrack>();
    const motionTrackIds = new Map<string, readonly string[]>();
    for (const motion of acceptedProject.motions) {
      const ids = motion.tracks.map((track) => qualifyMotionTrack(motion.id, track.id).value);
      motionTrackIds.set(motion.id, ids);
      for (const track of motion.tracks)
        nodes.set(qualifyMotionTrack(motion.id, track.id).value, { ...track, id: track.id });
    }
    for (const track of acceptedProject.freeTracks ?? [])
      nodes.set(qualifyFreeTrack(track.id).value, { ...track, id: track.id });
    // One owner for resolve, prepare, compile, and construct. Both entry points below reached the
    // same four steps in their own copy, which is how the authored keyframes could be flattened for
    // plugin resolution on one path and reach the interpolator still grouped on the other.
    const compileTrack = (trackDef: CompilableTrack, nodeId: string): Track => {
      const existing = tracks.get(nodeId);
      if (existing) return existing;
      const path = `${nodeId}.keyframes`;
      const resolved = registry?.resolveForKeyframes(trackDef.keyframes ?? {}, path, {
        id: nodeId,
        duration: trackDef.duration,
      });
      // Flattened with or without a registry. The resolver already did it when one exists; when
      // none does there is no resolver to fall back on, and an authored group would reach the
      // percent map and the interpolator as a nested object neither reads any stops from, so the
      // track would compile with no diagnostics and then hold still.
      const authoredKeyframes =
        resolved?.authoredKeyframes ?? flattenAuthoredKeyframes(trackDef.keyframes ?? {}).keyframes;
      const preparedKeyframes = {
        ...authoredKeyframes,
        ...(resolved?.preparation.keyframes ?? {}),
      };
      const keyframeCompilation = compilePercentKeyframes(preparedKeyframes, path);
      const diagnostics = [...(resolved?.diagnostics ?? []), ...keyframeCompilation.diagnostics];
      if (diagnostics.some(({ severity }) => severity === "error"))
        throw new TypeError(describeDiagnostics(diagnostics));
      const track = new Track({
        interpolator: this.#options.interpolator,
        interpolationConfig: { ...trackDef, keyframes: authoredKeyframes },
        ...(resolved ? { plugins: resolved } : {}),
        nodeId,
      });
      tracks.set(nodeId, track);
      return track;
    };
    const compile = (nodeId: string): Track => {
      const definition = nodes.get(nodeId);
      if (!definition) throw new TypeError(`Unknown graph node "${nodeId}".`);
      return compileTrack(definition, nodeId);
    };
    const compileTrackDefinition = (trackDef: CompilableTrack, targetNodeId?: string): void => {
      const nodeId =
        targetNodeId ??
        (trackDef.id.includes("/") ? trackDef.id : qualifyFreeTrack(trackDef.id).value);
      compileTrack(trackDef, nodeId);
    };
    const stageTrackDefinition = (trackDef: CompilableTrack, nodeId: string): StagedTrack => {
      const displaced = tracks.get(nodeId);
      // `compileTrack` intentionally reuses a live entry. Remove it only for the synchronous build,
      // then restore it if preparation rejects. Nothing outside this owner can observe the gap.
      tracks.delete(nodeId);
      let replacement: Track;
      try {
        replacement = compileTrack(trackDef, nodeId);
      } catch (error) {
        if (displaced !== undefined) tracks.set(nodeId, displaced);
        throw error;
      }
      let settled = false;
      return {
        commit() {
          if (settled) return;
          settled = true;
          displaced?.dispose();
        },
        rollback() {
          if (settled) return;
          settled = true;
          if (displaced === undefined) tracks.delete(nodeId);
          else tracks.set(nodeId, displaced);
          replacement.dispose();
        },
      };
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
    let runtime: ProjectRuntime | undefined;
    // Drops both registrations before disposing, so a created trigger has exactly one owner even
    // when a host `dispose` throws: the entry is already gone, so no later teardown can reach it a
    // second time and no caller can reach a released driver by id. Issue #145.
    const releaseMotion = (motionId: string): void => {
      const created = createdTriggers.get(motionId);
      consumers.delete(motionId);
      createdTriggers.delete(motionId);
      created?.dispose();
    };
    // Hoisted out of the runtime options because the failed-load path needs it too: when `load()`
    // throws before the runtime exists, there is no `runtime.dispose()` to route through. Emptying
    // the maps before disposing anything also makes this idempotent, which it must be, because
    // `ProjectRuntime`'s constructor already calls it when `GraphRuntime` throws. Issue #143.
    const disposeComposition = (): void => {
      const built = [...motions.values()];
      const triggers = [...createdTriggers.values()];
      const composed = [...tracks.values()];
      motions.clear();
      consumers.clear();
      createdTriggers.clear();
      tracks.clear();
      // Triggers first, then Motions, then Tracks, unchanged: a driver must stop emitting before
      // the Motion it feeds goes away. Every created trigger is covered here, including one built
      // for a Motion that never reached `motions`, so releaseMotion is not repeated.
      runAllAndReportOnce(
        [
          ...triggers.map((trigger) => () => trigger.dispose()),
          ...built.map((motion) => () => motion.dispose()),
          ...composed.map((track) => () => track.dispose()),
        ],
        "Composition disposal failed.",
      );
    };
    // One owner of the registration, because the trigger swap below has to make exactly the decision
    // the build made, and two copies of an exhaustive switch is how they end up disagreeing about a
    // binding kind. Total and exhaustive, with no `??` fallback, so a push-driven trigger cannot
    // silently inherit motion.onTick, and no Motion can ever hold both a driver and its own clock
    // advance.
    const bindClock = (motionId: string, motion: Motion, created: CreatedTrigger): void => {
      const binding = created.clockBinding;
      switch (binding.kind) {
        case "driver":
          consumers.set(motionId, { onTick: (event) => binding.onTick(event) });
          break;
        case "motion":
          consumers.set(motionId, { onTick: (event) => motion.onTick(event) });
          break;
        case "none":
          break;
      }
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
            // The runtime always exists by the time a Motion can invalidate: buildMotion runs from
            // the load-time loop after construction, or from the createMotion hook the runtime
            // itself calls. The optional call states that rather than asserting it.
            if (ids.length > 0) runtime?.invalidate(ids);
          },
          stagger: definition.stagger,
        });
        constructed = true;
        motion.play();
        if (consumers.has(definition.id))
          throw new TypeError(`Motion "${definition.id}" already has a clock consumer.`);
        bindClock(definition.id, motion, created);
        return motion;
      } catch (error) {
        throw afterCleanup(error, () => {
          // releaseMotion owns the clock consumer and the created trigger. Nothing owned the
          // Motion: it is never returned on this path, so it never enters `motions`, so
          // disposeComposition cannot reach it either. Without this the instance keeps the
          // lifecycle attachment and the trigger subscription play() made, and ADR-032's
          // exactly-once disposal is exactly zero. Issue #134.
          const steps = [() => releaseMotion(definition.id)];
          if (constructed) steps.push(() => motion.dispose());
          runAllAndReportOnce(steps, `Cleaning up motion "${definition.id}" failed.`);
        });
      }
    };
    try {
      for (const nodeId of nodes.keys()) compile(nodeId);
      // The only seam between the publisher's edge resolution and `Track.compose`, and it forwards
      // one argument because there is only one to forward. The flat input bag that used to travel
      // beside the scoped requirement inputs is gone with the channel that filled it, so this seam
      // can no longer undo the namespace separation the publisher established: there is no
      // parameter here to merge an upstream value into. See ADR-044 and ADR-047.
      const compose =
        (node: {
          id: string;
          track: { duration?: number; keyframes?: Readonly<Record<string, unknown>> };
        }) =>
        (requirementInputs: RequirementInputs) => {
          const track = tracks.get(node.id)!;
          const snapshot = track.compose(requirementInputs);
          return {
            values: snapshot.values,
            sourceProgress: snapshot.progress,
            sourceRevisions: {},
          };
        };
      const created = new ProjectRuntime(acceptedProject, {
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
        compose,
        // What the track interpolated, and nothing about the graph. Where the member sits in its
        // chain is `SolveMember.base`, derived once by `resolveSolvers` and joined in by the
        // publisher, so this closure needs no opinion about a requirement slot named `base` and
        // there is no second answer for it to disagree with. See ADR-051.
        //
        // The map is resolved when the publisher calls, exactly as `compose` above resolves it,
        // because the compiled map is the single owner and this closure outlives the entry it
        // reads: the publisher caches one node per graph node, and a live write the interpolator
        // declined replaces a compiled Track without touching the graph. A captured instance was
        // the disposed one from that commit on, and a solver was the one reader of it.
        // See ADR-031 and ADR-060.
        interpolated: (node) => () => {
          const track = tracks.get(node.id);
          // Unreachable through a solver member, whose node exists because its Track compiled.
          // Refused by name rather than omitted, because omitting `interpolated` makes the
          // publisher report that a member exposes no interpolated function, which names this seam
          // instead of the node that is missing.
          if (!track) throw new TypeError(`Unknown graph node "${node.id}".`);
          return { id: node.id, values: track.interpolated(), progress: track.progress };
        },
        graphBuilder: new IncrementalGraphBuilder(),
        setProgress: (nodeId, progress) => tracks.get(nodeId)?.setProgress(progress),
        // One hook for one mechanism, and the compiled Track is the one owner of the split inside
        // it. Whether the retained definition moved with the write is `ProjectRuntime`'s question,
        // so there is nothing here for a second hook to do. An absent Track answers `undefined`,
        // which is the one thing that is not a decline: there is no timeline to escalate for.
        // See ADR-059 and ADR-060.
        writeValues: (nodeId, values, overlay, rebase) =>
          tracks.get(nodeId)?.writeValues(values, overlay, rebase),
        compileTrack: compileTrackDefinition,
        disposeTrack,
        stageTrack: stageTrackDefinition,
        // The registry's answer about a candidate, handed over as data rather than as a refusal, so
        // a structural edit that provably cannot move what a Track is built from pays the resolve
        // and not the timeline build. Nothing else changes hands: it is the same call `compileTrack`
        // makes, on the same registry, so `PluginRegistry` stays the only implementation of it and
        // no layer gains a registry it has no other reason to hold. With none injected there is
        // nothing to resolve and nothing to compare, which is the posture `compileTrack` already
        // takes above, and every replacement builds exactly as it did before. See ADR-062.
        resolveKeyframes: registry?.resolveForKeyframes.bind(registry),
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
        replaceMotionTrigger: (motionId, definition) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          const trigger = resolveTriggerDefinition(
            definition.trigger,
            `motions.${motionId}.trigger`,
          );
          // Built before anything is released, on addMotion's own rule: a driver that cannot be
          // created -- a scroll trigger with no registered source is the live case -- must leave
          // the Motion driving the one it already had rather than driving none. See ADR-032.
          const created = triggerFactory.create({
            motionId,
            definition,
            trigger,
            clock: this.#options.clock,
            scheduler: this.#options.scheduler,
          });
          const displaced = createdTriggers.get(motionId);
          // The replacement is recorded before the displaced one is released, so a host `dispose`
          // that throws can never leave the new driver with no owner: disposeComposition reaches it
          // either way, which is the ownership rule releaseMotion already states.
          createdTriggers.set(motionId, created);
          consumers.delete(motionId);
          bindClock(motionId, motion, created);
          try {
            motion.setTrigger(created.port, created.acceptsExternalSignal);
          } catch (error) {
            // The swap never landed, so the replacement is what has no owner left. Restore the
            // displaced registrations and release what this hook built, on buildMotion's own
            // cleanup shape: the failure that refused the edit outranks what its cleanup reports.
            // See ADR-035.
            consumers.delete(motionId);
            if (displaced === undefined) createdTriggers.delete(motionId);
            else {
              createdTriggers.set(motionId, displaced);
              bindClock(motionId, motion, displaced);
            }
            throw afterCleanup(error, () => created.dispose());
          }
          // Released last, so every step that can refuse has refused before the driver moved. A
          // host `dispose` that throws is reported rather than swallowed: it is a teardown failure
          // at the layer that owns the host resource, and the swap it follows has already landed.
          displaced?.dispose();
        },
        setMotionStagger: (motionId, stagger) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          // The stagger rule has one owner, and it is this class: an absent value is zero and a
          // negative or non-finite one is refused, at construction and here through the same
          // function. `ProjectRuntime` asks no copy of it.
          motion.setStagger(stagger);
        },
        // Moved off a closure over this map and onto the runtime, so the one owner of the recipe
        // refusal is asked before a signal can reach a live trigger port. Nothing else about it
        // moves: an unknown motion id is refused here, verbatim, by the layer that owns the Motion.
        signalMotion: (motionId, signal) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          motion.signal(signal);
        },
        createMotion: (definition) => motions.set(definition.id, buildMotion(definition, [])),
        destroyMotion: (motionId) => {
          const motion = motions.get(motionId);
          if (!motion) return;
          // The map entry goes first, so a teardown failure can neither leave a destroyed Motion
          // reachable by id nor let project disposal dispose it a second time. Then every step is
          // attempted: a host trigger `dispose` that threw used to stop this hook before
          // `motion.dispose()`, leaving a mounted Motion with a live lifecycle and trigger
          // subscription plus a stale entry here, while ProjectRuntime stayed uncommitted. This is
          // also the rollback path for a rejected addMotion, so its failure is reported to
          // rejectAfterRollback rather than swallowed. Issue #145.
          motions.delete(motionId);
          runAllAndReportOnce(
            [() => releaseMotion(motionId), () => motion.dispose()],
            `Destroying motion "${motionId}" failed.`,
          );
        },
        onClockTick: (event) => {
          // One fanout owner and one report, sharing the teardown paths' collect-then-report shape
          // for the same reason: a throwing consumer must not stop the consumers behind it.
          runAllAndReportOnce(
            [...consumers.values()].map((consumer) => () => consumer.onTick(event)),
            "Clock consumer fanout failed.",
          );
        },
        disposeComposition,
      });
      runtime = created;
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
      return createHandle(created);
    } catch (error) {
      throw afterCleanup(error, () => {
        // `load()` owns everything it created, including the runtime. `GraphRuntime` takes the
        // project's only `Clock.subscribe` in its own constructor, and a caller that never received
        // a handle can never release it, so a failed load had to dispose the runtime itself.
        // Issue #143.
        //
        // Exactly one owner: `runtime.dispose()` already calls disposeComposition, which owns the
        // Motions, the created triggers and the compiled Tracks, so calling both would dispose
        // everything twice. Only a failure that preceded the runtime leaves the composition here.
        if (runtime === undefined) disposeComposition();
        else runtime.dispose();
      });
    }
  }
}
