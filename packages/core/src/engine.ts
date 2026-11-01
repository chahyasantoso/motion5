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
import {
  UNJUDGED_CAPABILITIES,
  admitsPlugin,
  type PluginCapabilities,
} from "./ports/plugin-capabilities";
import { readOutcome } from "./lang/outcome";
import { IncrementalGraphBuilder } from "./graph/builders/incremental";
import { createDefaultTriggerFactory } from "./adapters/trigger-factory/default";
import { Motion, type MotionTrackEntry } from "./domain/motion";
import { unreachable } from "./lang/exhaustive";
import { collect, report } from "./domain/completion";
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
  readonly plugins?: PluginCatalog;
  readonly triggerFactory?: TriggerFactory;
}
export interface ProjectHandle {
  mount(nodeId: string, instance?: object): object;
  unmount(nodeId: string): void;
  seek(nodeId: string, progress: number): PatchBatch;
  signal(motionId: string, signal: TriggerSignal): void;
  addMotion(definition: MotionDefinition): { readonly id: string };
  destroyMotion(motionId: string): void;
  /** Runs `recipe` as one transaction; commits staged once. An immediate-apply verb refuses by name (`schema-transaction-immediate`) while open. */
  edit<T>(recipe: (transaction: SchemaTransaction) => T): T;
  /** Runs `recipe` as one value batch; publishes staged once. Defers publication, not the write. Refusals: `value-batch-immediate`, `value-batch-structural`. */
  values(recipe: (transaction: ValueTransaction) => void): PatchBatch;
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle;
  track(nodeId: string): TrackHandle;
  /** Probe: no throw on unknown id; caller branches. `addTrack` assigns and mounts, `replace` refuses an id-moving definition. */
  tryTrack(nodeId: string): TrackHandle | undefined;
  motion(motionId: string): MotionHandle;
  tryMotion(motionId: string): MotionHandle | undefined;
  motionIds(): readonly string[];
  freeTrackIds(): readonly string[];
  mountedNodeIds(): readonly string[];
  dependantsOf(nodeId: string): readonly string[];
  /** Last published patch, none if never published. `LivePatch`, not `Patch`: terminal patches reach `subscribeNode` once, unreadable after eviction; `destroyed` impossible. */
  get(nodeId: string): LivePatch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
  /** Render metadata for a node, `undefined` if the project holds no track for it. Read from the compiled Track, not a second map; reaches no plugin or graph. */
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
// Build tag; no definite-assignment assertion.
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
          isPluginRegistered: (pluginId) => admitsPlugin(this.#capabilities, pluginId),
        }),
        (value) => value,
        (diagnostics) => {
          throw new TypeError(describeDiagnostics(diagnostics));
        },
      );
      if (parsed.plugin !== undefined) {
        const plugin = this.#capabilities.pluginDefinition?.(parsed.plugin);
        // Admitted id, no definition -> refuse before any PluginTrack: no slots, never publishes.
        if (plugin === undefined)
          throw new TypeError(
            `plugin-unknown at ${nodeId}.plugin: '${parsed.plugin}' is not admitted.`,
          );
        // Contract-checked pre-compile, rechecked at runtime: easing can leave a declared range.
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
      // `compileTrack` reuses live entries -> remove, restore on reject; gap unobservable outside this owner.
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
          // `disposed` before snapshot, maps cleared before release: re-entrant host sees nothing.
          motions.clear();
          consumers.clear();
          createdTriggers.clear();
          tracks.clear();
          nodes.clear();
          motionTrackIds.clear();
          // Triggers, Motions, Tracks: driver disposed before its Motion; unadopted triggers covered.
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
      // Narrow once; factory gets the canonical form, never re-derives.
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
          // Compiled map sole owner; Motion resolves ids per use -> no disposed Track left driving.
          resolveTrack: (id) => tracks.get(id),
          trigger: built.trigger.port,
          disposeTracks: false,
          listenToClock: false,
          acceptsExternalSignal: acceptsExternalSignal(built.trigger.clockBinding),
          invalidate: () => {
            switch (built.kind) {
              case "trigger-created":
                // Pre-Motion closure runs only here; nothing to invalidate.
                return;
              case "motion-created": {
                const ids = built.motion.tracks.map((t) => t.id);
                // Runtime exists once a Motion can invalidate; state names owner.
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
        // `releaseMotion` owns consumer + trigger; failing Motion never entered `motions` -> dispose here.
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
    // One admission owner, both sites; host re-entry -> state read after build; `disposed` releases Motion.
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
        isPluginRegistered: (pluginId) => admitsPlugin(this.#capabilities, pluginId),
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
          // Built before release: failed creation leaves the existing trigger, not none.
          const created = triggerFactory.create({
            motionId,
            definition,
            trigger,
            clock: this.#options.clock,
            scheduler: this.#options.scheduler,
          });
          const displaced = createdTriggers.get(motionId);
          // Register replacement before releasing displaced: throwing host `dispose` leaves new driver owned.
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
            // Swap never landed -> replacement unowned: restore displaced, release built; refusal outranks cleanup report.
            consumers.delete(motionId);
            if (displaced === undefined) createdTriggers.delete(motionId);
            else {
              createdTriggers.set(motionId, displaced);
              bindClock(motionId, motion, displaced);
            }
            throw afterCleanup(error, "cleanup", () => created.dispose());
          }
          // Return marks acceptance; runtime adopts before cleanup; both releases run.
          return () =>
            runAllAndReportOnce(
              [complete, () => displaced?.dispose()],
              `Completing trigger replacement for "${motionId}" failed.`,
            );
        },
        setMotionStagger: (motionId, stagger) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          // Motion validates schedule, runtime publishes after; only this callback replaced; driver callbacks keep the invalidation guard.
          return motion.acceptStagger(stagger, () => undefined);
        },
        // Unknown motion id refused here, verbatim, by the Motion owner, before any trigger port.
        signalMotion: (motionId, signal) => {
          const motion = motions.get(motionId);
          if (!motion) throw new TypeError(`Unknown motion "${motionId}".`);
          motion.signal(signal);
        },
        createMotion: (definition) => adoptMotion(definition, []),
        destroyMotion: (motionId) => {
          const motion = motions.get(motionId);
          if (!motion) return;
          // Entry deleted first: no id-reachable or double-disposed Motion; every step runs; addMotion rollback.
          motions.delete(motionId);
          runAllAndReportOnce(
            [() => releaseMotion(motionId), () => motion.dispose()],
            `Destroying motion "${motionId}" failed.`,
          );
        },
        onClockTick: (event) => {
          // One fanout owner; throwing consumer cannot stop the rest.
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
        // Conditional spread: load-time and hook-built entries both omit undefined duration.
        const entries = ids.map((id) => {
          const duration = nodes.get(id)?.duration;
          return { id, ...(duration === undefined ? {} : { duration }) };
        });
        adoptMotion(motionDefinition, entries);
      }
      return createHandle(created, (nodeId) => tracks.get(nodeId)?.plugins);
    } catch (error) {
      throw afterCleanup(error, "cleanup", () => {
        // State names sole cleanup owner; constructor failure may already have run the composition hook.
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
