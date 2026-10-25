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
import { parseTrackDefinition } from "./contract/v5-parse";
import type { MotionHandle } from "./contract/motion-handle";
import type { SchemaTransaction } from "./contract/schema-transaction";
import type { ValueTransaction } from "./contract/value-transaction";
import type { TrackHandle } from "./contract/track-handle";
import { describeDiagnostics } from "./contract/diagnostics";
import { resolveTriggerDefinition } from "./contract/validate-v5";
import { validateV5 } from "./validate-v5";
import { UNJUDGED_CAPABILITIES, type PluginCapabilities } from "./ports/plugin-capabilities";
import { readOutcome } from "./lang/outcome";
import { IncrementalGraphBuilder } from "./graph/builders/incremental";
import { createDefaultTriggerFactory } from "./adapters/trigger-factory/default";
import { Motion, type MotionTrackEntry } from "./domain/motion";
import { unreachable } from "./lang/exhaustive";
import { collect, report } from "./domain/completion";
import { PluginRegistry } from "./domain/plugins";
import type { PluginCatalog } from "./domain/plugin-catalog";
import type { RenderMetadata } from "./ports/render-metadata";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import type { ComposeIdentifiedResolver, ComposeResolver } from "./runtime/graph-runtime";
import { ValueTrack } from "./runtime/value-track";
import { PluginTrack } from "./runtime/plugin-track";
import { deriveSourceContract } from "./contract/v5-infer";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import { acceptsExternalSignal } from "./ports/trigger-factory";
import type { ClockConsumer, CreatedTrigger, TriggerFactory } from "./ports/trigger-factory";
import { afterCleanup } from "./runtime/report";
import { ProjectRuntime, type StagedTrack } from "./runtime/project-runtime";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins?: PluginRegistry | PluginCatalog;
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
interface Composition {
  readonly tracks: Map<string, ValueTrack | PluginTrack>;
  readonly nodes: Map<string, TrackDefinition>;
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
function assertValidProject(project: unknown, capabilities: PluginCapabilities): ProjectDefinition {
  return readOutcome(
    validateV5(project, capabilities),
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
function runAllAndReportOnce(steps: readonly (() => void)[], context: string): void {
  report(collect(steps), context);
}
export class Engine {
  readonly #options: EngineOptions;
  readonly #capabilities: PluginCapabilities;
  constructor(options: EngineOptions) {
    assertClock(options.clock);
    assertInterpolator(options.interpolator);
    assertScheduler(options.scheduler);
    this.#options = options;
    this.#capabilities = options.plugins ?? UNJUDGED_CAPABILITIES;
  }
  load(project: ProjectDefinition): ProjectHandle {
    const acceptedProject = assertValidProject(project, this.#capabilities);
    const tracks = new Map<string, ValueTrack | PluginTrack>();
    const nodes = new Map<string, TrackDefinition>();
    const motionTrackIds = new Map<string, readonly string[]>();
    for (const motion of acceptedProject.motions) {
      const ids = motion.tracks.map((track) => qualifyMotionTrack(motion.id, track.id).value);
      motionTrackIds.set(motion.id, ids);
      for (const track of motion.tracks)
        nodes.set(qualifyMotionTrack(motion.id, track.id).value, track);
    }
    for (const track of acceptedProject.freeTracks ?? [])
      nodes.set(qualifyFreeTrack(track.id).value, track);
    const compileTrack = (trackDef: TrackDefinition, nodeId: string): ValueTrack | PluginTrack => {
      const existing = tracks.get(nodeId);
      if (existing) return existing;
      const parsed = readOutcome(
        parseTrackDefinition(trackDef, nodeId, {
          isPluginRegistered: (pluginId) =>
            this.#capabilities.isPluginAdmitted?.(pluginId) ??
            this.#capabilities.capabilityOf(pluginId) !== undefined,
        }),
        (value) => value,
        (diagnostics) => {
          throw new TypeError(describeDiagnostics(diagnostics));
        },
      );
      if (parsed.plugin !== undefined) {
        const plugin = this.#capabilities.pluginDefinition?.(parsed.plugin);
        if (plugin === undefined)
          throw new TypeError(
            `plugin-unknown at ${nodeId}.plugin: '${parsed.plugin}' is not admitted.`,
          );
        // The authored values are checked against the plugin's declared local contract before the
        // track is compiled. The same contract is rechecked at runtime because easing can leave a
        // declared range even when the authored stops did not.
        readOutcome(
          deriveSourceContract(
            parsed.input.values,
            plugin.inputs.values,
            `${nodeId}.input.values`,
            "plugin",
          ),
          () => undefined,
          (diagnostics) => {
            throw new TypeError(describeDiagnostics(diagnostics));
          },
        );
        const track = new PluginTrack({
          nodeId,
          plugin,
          values: parsed.input.values,
          interpolator: this.#options.interpolator,
        });
        tracks.set(nodeId, track);
        return track;
      }
      const track = new ValueTrack({
        nodeId,
        values: parsed.input.values,
        interpolator: this.#options.interpolator,
      });
      tracks.set(nodeId, track);
      return track;
    };
    const compile = (nodeId: string): ValueTrack | PluginTrack => {
      const definition = nodes.get(nodeId);
      if (!definition) throw new TypeError(`Unknown graph node "${nodeId}".`);
      return compileTrack(definition, nodeId);
    };
    const compileTrackDefinition = (trackDef: TrackDefinition, targetNodeId?: string): void => {
      const nodeId =
        targetNodeId ??
        (trackDef.id.includes("/") ? trackDef.id : qualifyFreeTrack(trackDef.id).value);
      compileTrack(trackDef, nodeId);
    };
    const stageTrackDefinition = (trackDef: TrackDefinition, nodeId: string): StagedTrack => {
      const displaced = tracks.get(nodeId);
      // `compileTrack` intentionally reuses a live entry. Remove it only for the synchronous build,
      // then restore it if preparation rejects. Nothing outside this owner can observe the gap.
      tracks.delete(nodeId);
      let replacement: ValueTrack | PluginTrack;
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
          ...(definition.stagger === undefined ? {} : { stagger: definition.stagger }),
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
        throw afterCleanup(error, "cleanup", () => {
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
    // One owner of whether this composition may take a Motion, and both adoption sites go through
    // it. `motions.set(id, buildMotion(...))` evaluated its argument first and neither site said
    // what made that safe, so the guarantee was held by a deferral policy two modules away that
    // nothing here names. The state is the answer instead: `building` and `ready` adopt, `disposed`
    // releases what the build created rather than writing it into maps disposeComposition has
    // already snapshotted and cleared, where it would be the one Motion a one-pass teardown cannot
    // reach. Read after the build rather than before, because construction is where a host callback
    // reenters. The refusal outranks what its release reports, on buildMotion's own cleanup shape.
    // engine.md owns why the disposed arm has no behavioural case. Issue #469, and see ADR-092.
    const adoptMotion = (
      definition: MotionDefinition,
      entries: readonly MotionTrackEntry[],
    ): Motion => {
      const motion = buildMotion(definition, entries);
      switch (state.kind) {
        case "building":
        case "ready":
          motions.set(definition.id, motion);
          return motion;
        case "disposed":
          throw afterCleanup(
            new TypeError(
              `Composition for motion "${definition.id}" was disposed before it was adopted.`,
            ),
            "cleanup",
            () =>
              runAllAndReportOnce(
                [() => releaseMotion(definition.id), () => motion.dispose()],
                `Releasing unadopted motion "${definition.id}" failed.`,
              ),
          );
        default:
          return unreachable(state);
      }
    };
    try {
      for (const nodeId of nodes.keys()) compile(nodeId);
      const compose: ComposeResolver = (node) => () => {
        const track = tracks.get(node.id);
        if (!track) throw new TypeError(`Unknown graph node "${node.id}".`);
        if (track instanceof PluginTrack) {
          throw new TypeError(
            `Plugin track "${node.id}" composes through its identified input path.`,
          );
        }
        return {
          outputs: track.outputs(),
          sourceProgress: track.progress,
          sourceRevisions: {},
        };
      };
      const composeIdentified: ComposeIdentifiedResolver = (node) => {
        const track = tracks.get(node.id);
        if (!(track instanceof PluginTrack)) return undefined;
        return (requires) => track.compose(requires);
      };
      const created = new ProjectRuntime(acceptedProject, {
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
        compose,
        composeIdentified,
        isPluginRegistered: (pluginId) =>
          this.#capabilities.isPluginAdmitted?.(pluginId) ??
          this.#capabilities.capabilityOf(pluginId) !== undefined,
        capabilities: this.#capabilities,
        graphBuilder: new IncrementalGraphBuilder(this.#capabilities),
        setProgress: (nodeId, progress) => tracks.get(nodeId)?.setProgress(progress),
        rewriteValues: (nodeId, values) => tracks.get(nodeId)?.replaceValues(values),
        overlayValues: (nodeId, value) => tracks.get(nodeId)?.replaceOverlay(value),
        compileTrack: compileTrackDefinition,
        disposeTrack,
        stageTrack: stageTrackDefinition,
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
            throw afterCleanup(error, "cleanup", () => created.dispose());
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
        createMotion: (definition) => adoptMotion(definition, []),
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
        adoptMotion(motionDefinition, entries);
      }
      return createHandle(created, (nodeId) => tracks.get(nodeId)?.plugins);
    } catch (error) {
      throw afterCleanup(error, "cleanup", () => {
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
