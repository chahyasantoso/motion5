// Docs: ./engine.md
import type {
  LivePatch,
  MotionDefinition,
  PatchBatch,
  PatchListener,
  ProjectDefinition,
  TrackDefinition,
  TriggerSignal,
} from "./contract/v5";
import type { MotionHandle } from "./contract/motion-handle";
import type { SchemaTransaction } from "./contract/schema-transaction";
import type { ValueTransaction } from "./contract/value-transaction";
import type { TrackHandle } from "./contract/track-handle";
import { describeDiagnostics } from "./contract/diagnostics";
import { resolveTriggerDefinition } from "./contract/validate-v5";
import { validateV5 } from "./validate-v5";
import { readOutcome } from "./domain/outcome";
import { IncrementalGraphBuilder } from "./graph/builders/incremental";
import { createDefaultTriggerFactory } from "./adapters/trigger-factory/default";
import { compilePercentKeyframes } from "./domain/keyframe-compiler";
import { flattenAuthoredKeyframes } from "./domain/keyframe-groups";
import { Motion, type MotionTrackEntry } from "./domain/motion";
import { unreachable } from "./lang/exhaustive";
import { collect, report } from "./domain/completion";
import { PluginRegistry, type RenderMetadata, type RequirementInputs } from "./domain/plugins";
import { Track } from "./domain/track";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import { acceptsExternalSignal } from "./ports/trigger-factory";
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
  /**
   * Runs `recipe` as one value batch and publishes what it staged exactly once.
   *
   * The value tier's transaction, and `edit`'s counterpart rather than its cousin: this one defers
   * publication instead of deferring the write, so every verb inside still applies immediately and
   * still refuses on its own terms. `ValueTransaction` is the narrowed surface the recipe is handed,
   * and it is a surface rather than a fence for exactly the reason `edit`'s is: the recipe closes
   * over this handle too, so a verb that publishes, mounts or commits refuses by name while a batch
   * is open, with `value-batch-immediate` for the immediate family and `value-batch-structural` for
   * every structural verb. What one costs and what it answers are ADR-078's. See ADR-078.
   */
  values(recipe: (transaction: ValueTransaction) => void): PatchBatch;
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
  motionIds(): readonly string[];
  freeTrackIds(): readonly string[];
  mountedNodeIds(): readonly string[];
  dependantsOf(nodeId: string): readonly string[];
  /**
   * The patch this node last published, or nothing if it has published none.
   *
   * `LivePatch` rather than `Patch`: a terminal patch is delivered to `subscribeNode` once and is
   * never readable back, because eviction drops the registry entry before it notifies. A reader
   * here accounts for `ready`, `blocked` and `error` and cannot receive `destroyed`, so the
   * declaration states that instead of asking every call site to narrow past a variant it cannot
   * get. See ADR-098.
   */
  get(nodeId: string): LivePatch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
  /**
   * The render metadata for one node, or `undefined` for a node this project holds no track for.
   *
   * The channel a renderer needs to serialize plugin output, answered by the compiled Track rather
   * than by a second map beside it, so a recompiled node reports the chain it actually has. It is a
   * read: no renderer reaches a Track, a plugin, or the graph through it. See ADR-073.
   */
  renderMetadata(nodeId: string): RenderMetadata | undefined;
  dispose(): void;
}
interface CompilableTrack {
  readonly id: string;
  readonly duration?: number;
  readonly keyframes?: Readonly<Record<string, unknown>>;
}
interface Composition {
  readonly tracks: Map<string, Track>;
  readonly nodes: Map<string, CompilableTrack>;
  readonly motionTrackIds: Map<string, readonly string[]>;
  readonly motions: Map<string, Motion>;
  readonly createdTriggers: Map<string, CreatedTrigger>;
  readonly consumers: Map<string, ClockConsumer>;
}
type CompositionState =
  | {
      readonly kind: "building";
      readonly cleanupOwner: "composition";
      readonly composition: Composition;
    }
  | {
      readonly kind: "ready";
      readonly cleanupOwner: "runtime";
      readonly composition: Composition;
      readonly runtime: ProjectRuntime;
    }
  | { readonly kind: "disposed"; readonly cleanupOwner: "none" };
type RuntimeLike = ProjectRuntime;
function createHandle(
  runtime: RuntimeLike,
  renderMetadata: (nodeId: string) => RenderMetadata | undefined,
): ProjectHandle {
  const handle: ProjectHandle = {
    mount: (nodeId, instance = {}) => runtime.mount(nodeId, instance),
    unmount: (nodeId) => runtime.unmount(nodeId),
    seek: (nodeId, progress) => runtime.seek(nodeId, progress),
    signal: (motionId, value) => runtime.signal(motionId, value),
    addMotion: (definition) => runtime.addMotion(definition),
    destroyMotion: (motionId) => runtime.destroyMotion(motionId),
    edit<T>(recipe: (transaction: SchemaTransaction) => T) {
      return runtime.edit(recipe);
    },
    values: (recipe) => runtime.values(recipe),
    addTrack: (track, options) => runtime.addTrack(track, options),
    track: (nodeId) => runtime.track(nodeId),
    tryTrack: (nodeId) => runtime.tryTrack(nodeId),
    motion: (motionId) => runtime.motion(motionId),
    tryMotion: (motionId) => runtime.tryMotion(motionId),
    motionIds: () => runtime.motionIds(),
    freeTrackIds: () => runtime.freeTrackIds(),
    mountedNodeIds: () => runtime.mountedNodeIds(),
    dependantsOf: (nodeId) => runtime.dependantsOf(nodeId),
    get: (nodeId) => runtime.graph.registry.get(nodeId),
    subscribeNode: (nodeId, listener) => runtime.graph.registry.subscribeNode(nodeId, listener),
    renderMetadata,
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
  return readOutcome(
    validateV5(project),
    (value) => value,
    (diagnostics) => {
      throw new TypeError(
        diagnostics.length === 0
          ? "Project failed v5 validation."
          : describeDiagnostics(diagnostics),
      );
    },
  );
}
// The two states buildMotion passes through, so what has been built is one tag rather than a
// definite-assignment assertion a reader has to cross-check against a boolean. engine.md owns why.
type MotionBuild =
  | { readonly kind: "trigger-created"; readonly trigger: CreatedTrigger }
  | { readonly kind: "motion-created"; readonly trigger: CreatedTrigger; readonly motion: Motion };
function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
function runAllAndReportOnce(steps: readonly (() => void)[], context: string): void {
  report(collect(steps), context);
}
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
    const composition: Composition = {
      tracks,
      nodes,
      motionTrackIds,
      motions,
      createdTriggers,
      consumers,
    };
    let state: CompositionState = {
      kind: "building",
      cleanupOwner: "composition",
      composition,
    };
    const triggerFactory = this.#options.triggerFactory ?? createDefaultTriggerFactory();
    const releaseMotion = (motionId: string): void => {
      const created = createdTriggers.get(motionId);
      consumers.delete(motionId);
      createdTriggers.delete(motionId);
      created?.dispose();
    };
    const disposeComposition = (): void => {
      switch (state.kind) {
        case "building":
        case "ready": {
          const { motions, createdTriggers, tracks, consumers, nodes, motionTrackIds } =
            state.composition;
          state = { kind: "disposed", cleanupOwner: "none" };
          const built = [...motions.values()];
          const triggers = [...createdTriggers.values()];
          const composed = [...tracks.values()];
          motions.clear();
          consumers.clear();
          createdTriggers.clear();
          tracks.clear();
          nodes.clear();
          motionTrackIds.clear();
          // Triggers first, then Motions, then Tracks, unchanged: a driver must stop emitting
          // before the Motion it feeds goes away. Every created trigger is covered here, including
          // one built for a Motion that never reached `motions`, so releaseMotion is not repeated.
          runAllAndReportOnce(
            [
              ...triggers.map((trigger) => () => trigger.dispose()),
              ...built.map((motion) => () => motion.dispose()),
              ...composed.map((track) => () => track.dispose()),
            ],
            "Composition disposal failed.",
          );
          return;
        }
        case "disposed":
          return;
        default:
          return unreachable(state);
      }
    };
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
        default:
          return unreachable(binding);
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
      let built: MotionBuild = { kind: "trigger-created", trigger: created };
      try {
        const motion = new Motion({
          clock: this.#options.clock,
          scheduler: this.#options.scheduler,
          tracks: entries,
          // The compiled map is the single owner. Motion holds ids and resolves per use, so a
          // recompiled node can never leave it driving a disposed Track. See ADR-031.
          resolveTrack: (id) => tracks.get(id),
          trigger: built.trigger.port,
          disposeTracks: false,
          listenToClock: false,
          acceptsExternalSignal: acceptsExternalSignal(built.trigger.clockBinding),
          invalidate: () => {
            switch (built.kind) {
              case "trigger-created":
                // The closure is handed to the constructor that produces the Motion, so the one
                // state it can run in before there is a Motion to read is this one. The retired
                // spelling read an unassigned local through a definite-assignment assertion here
                // and would have thrown on a member of undefined. There is nothing to invalidate.
                return;
              case "motion-created": {
                const ids = built.motion.tracks.map((t) => t.id);
                // The runtime always exists by the time a Motion can invalidate: buildMotion runs
                // from the load-time loop after construction, or from the createMotion hook the
                // runtime itself calls. The state makes that owner explicit rather than asserting
                // it through a separate local.
                if (ids.length === 0) return;
                switch (state.kind) {
                  case "building":
                  case "disposed":
                    return;
                  case "ready":
                    state.runtime.invalidate(ids);
                    return;
                  default:
                    return unreachable(state);
                }
              }
              default:
                return unreachable(built);
            }
          },
          stagger: definition.stagger,
        });
        built = { kind: "motion-created", trigger: built.trigger, motion };
        motion.play();
        if (consumers.has(definition.id))
          throw new TypeError(`Motion "${definition.id}" already has a clock consumer.`);
        bindClock(definition.id, built.motion, built.trigger);
        return built.motion;
      } catch (error) {
        // releaseMotion owns the clock consumer and the created trigger. Nothing owns the Motion:
        // it is never returned on this path, so it never enters `motions`, so disposeComposition
        // cannot reach it either. Without the second step the instance keeps the lifecycle
        // attachment and the trigger subscription play() made, and ADR-032's exactly-once disposal
        // is exactly zero. Issue #134. The tag is what makes that obligation visible: one state
        // owns an instance, and it is the only state that owes its disposal.
        const state = built;
        throw afterCleanup(error, () => {
          const steps: (() => void)[] = [() => releaseMotion(definition.id)];
          switch (state.kind) {
            case "trigger-created":
              break;
            case "motion-created": {
              const { motion } = state;
              steps.push(() => motion.dispose());
              break;
            }
            default:
              unreachable(state);
          }
          runAllAndReportOnce(steps, `Cleaning up motion "${definition.id}" failed.`);
        });
      }
    };
    try {
      for (const nodeId of nodes.keys()) compile(nodeId);
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
          let complete: () => void;
          try {
            complete = motion.acceptTrigger(
              created.port,
              acceptsExternalSignal(created.clockBinding),
            );
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
          // Returning marks acceptance. Runtime adopts the definition before asking for cleanup.
          // Motion's displaced subscription and the factory's resource are independent releases:
          // neither failure can skip the other or turn the accepted driver into a refused edit.
          return () =>
            runAllAndReportOnce(
              [complete, () => displaced?.dispose()],
              `Completing trigger replacement for "${motionId}" failed.`,
            );
        },
        setMotionStagger: (motionId, stagger) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          // Motion alone validates and accepts the schedule. Runtime adopts before re-seeding,
          // and owns the one publication afterwards. Only this operation's callback is replaced;
          // ordinary driver callbacks still reach the guarded public invalidation path.
          return motion.acceptStagger(stagger, () => undefined);
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
      state = { kind: "ready", cleanupOwner: "runtime", composition, runtime: created };
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
      return createHandle(created, (nodeId) => tracks.get(nodeId)?.plugins);
    } catch (error) {
      throw afterCleanup(error, () => {
        // The state names the sole cleanup owner. A constructor failure may have already invoked
        // the composition hook, so the disposed arm is intentionally a no-op.
        switch (state.cleanupOwner) {
          case "composition":
            disposeComposition();
            return;
          case "runtime":
            state.runtime.dispose();
            return;
          case "none":
            return;
          default:
            return unreachable(state);
        }
      });
    }
  }
}
