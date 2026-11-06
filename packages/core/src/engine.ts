import type {
  LivePatch,
  MotionDefinition,
  PatchBatch,
  PatchListener,
  ProjectDefinition,
  ResolvedRequires,
  SlotSpec,
  Structure,
  SourceStructure,
  TrackDefinition,
  TriggerSignal,
} from "./contract/v5";
import { isModel, outputModelId, outputPluginId } from "./contract/v5";
import { unknownNameMessage } from "./contract/registry-message";
import { parseTrackDefinition } from "./contract/v5-parse";
import type { MotionHandle } from "./contract/motion-handle";
import type { SchemaTransaction } from "./contract/schema-transaction";
import type { ValueTransaction } from "./contract/value-transaction";
import type { TrackHandle } from "./contract/track-handle";
import { describeDiagnostics } from "./contract/diagnostics";
import { resolveTriggerDefinition } from "./contract/validate-v5";
import { validateV5 } from "./validate-v5";
import { type PluginCapabilities } from "./ports/plugin-capabilities";
import { readOutcome } from "./lang/outcome";
import { IncrementalGraphBuilder } from "./graph/builders/incremental";
import { createDefaultTriggerFactory } from "./adapters/trigger-factory/default";
import { Motion, type MotionTrackEntry } from "./domain/motion";
import { unreachable } from "./lang/exhaustive";
import { defineOwnValue } from "./lang/own-property";
import { collect, report } from "./domain/completion";
import type { PluginCatalog } from "./domain/plugin-catalog";
import type { RenderMetadata } from "./ports/render-metadata";
import { qualifyFreeTrack, qualifyMotionTrack } from "./graph/ids";
import { qualifySource } from "./graph/dependency-edges";
import type { ComposeResolver } from "./runtime/graph-runtime";
import { Track } from "./runtime/track";
import { PassthroughProcessor } from "./runtime/processors/passthrough";
import { ComputedProcessor, defaultPluginValues } from "./runtime/processors/computed";
import { LocalInput } from "./runtime/local-input";
import { createValueEvaluator } from "./runtime/evaluate-values";
import { deriveSourceContract } from "./contract/v5-infer";
import { assertClock, type Clock } from "./ports/clock";
import { assertInterpolator, type Interpolator } from "./ports/interpolator";
import { assertScheduler, type Scheduler } from "./ports/scheduler";
import { acceptsExternalSignal } from "./ports/trigger-factory";
import type { ClockConsumer, CreatedTrigger, TriggerFactory } from "./ports/trigger-factory";
import { afterCleanup } from "./runtime/report";
import { ProjectRuntime, type StagedTrack } from "./runtime/project-runtime";
import type { BoundSlot, BoundSlotEntry, BoundSlots } from "./runtime/bound-slot";
import { isRecord } from "./runtime/publisher-outcome";
import { compareEdges, type GraphNode } from "./graph/ir";
import {
  isOptionalSlot,
  isShapeSlot,
  needsSlotStructure,
  slotDeclaration,
} from "./contract/slot-declaration";

export interface EngineOptions {
  readonly clock: Clock;
  readonly interpolator: Interpolator;
  readonly scheduler: Scheduler;
  readonly plugins: PluginCatalog;
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
  readonly tracks: Map<string, Track>;
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
  readonly #capabilities: PluginCatalog;
  constructor(options: EngineOptions) {
    assertClock(options.clock);
    assertInterpolator(options.interpolator);
    assertScheduler(options.scheduler);
    this.#options = options;
    this.#capabilities = options.plugins;
  }
  load(project: ProjectDefinition): ProjectHandle {
    const acceptedProject = assertValidProject(project, this.#capabilities);
    const tracks = new Map<string, Track>();
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
    const compileTrack = (trackDef: TrackDefinition, nodeId: string): Track => {
      const existing = tracks.get(nodeId);
      if (existing) return existing;
      const parsed = readOutcome(
        parseTrackDefinition(trackDef, nodeId, {
          isPluginRegistered: (pluginId) => this.#capabilities.isPluginAdmitted(pluginId),
          pluginDefinition: (pluginId) => this.#capabilities.pluginDefinition(pluginId),
          model: (modelId: string) => this.#capabilities.model(modelId),
          modelIds: () => this.#capabilities.modelIds(),
          pluginIds: () => this.#capabilities.pluginIds(),
        }),
        (value) => value,
        (diagnostics) => {
          throw new TypeError(describeDiagnostics(diagnostics));
        },
      );
      const pluginId = outputPluginId(parsed.output);
      if (pluginId !== undefined) {
        const plugin = this.#capabilities.pluginDefinition?.(pluginId);
        // Admitted id, no definition -> refuse before any Track: no slots, never publishes.
        if (plugin === undefined)
          throw new TypeError(
            `plugin-unknown at ${nodeId}.output.plugin: ${unknownNameMessage(
              "plugin",
              pluginId,
              this.#capabilities.pluginIds?.(),
            )}`,
          );
        const valuesSpec = isModel(plugin.inputs.values)
          ? plugin.inputs.values.spec
          : plugin.inputs.values;
        // Contract-checked pre-compile, rechecked at runtime: easing can leave a declared range.
        readOutcome(
          deriveSourceContract(parsed.input.values, valuesSpec, `${nodeId}.input.values`, "plugin"),
          () => undefined,
          (diagnostics) => {
            throw new TypeError(describeDiagnostics(diagnostics));
          },
        );
        const localInput = new LocalInput(
          createValueEvaluator(
            defaultPluginValues(parsed.input.values, plugin),
            this.#options.interpolator,
            valuesSpec,
          ),
        );
        const processor = new ComputedProcessor({
          nodeId,
          plugin,
          values: parsed.input.values,
          interpolator: this.#options.interpolator,
          ...(parsed.input.param === undefined ? {} : { param: parsed.input.param }),
        });
        const track = new Track(nodeId, localInput, processor);
        tracks.set(nodeId, track);
        return track;
      }
      const modelId = outputModelId(parsed.output);
      if (modelId === undefined) throw new TypeError(`Track "${nodeId}" names no model output.`);
      const model = this.#capabilities.model(modelId);
      if (model === undefined)
        throw new TypeError(
          `model-unknown at ${nodeId}.output.model: ${unknownNameMessage(
            "model",
            modelId,
            this.#capabilities.modelIds(),
          )}`,
        );
      const spec = model.spec;
      const localInput = new LocalInput(
        createValueEvaluator(parsed.input.values, this.#options.interpolator, spec),
      );
      const processor = new PassthroughProcessor({
        nodeId,
        values: parsed.input.values,
        interpolator: this.#options.interpolator,
        model,
      });
      const track = new Track(nodeId, localInput, processor);
      tracks.set(nodeId, track);
      return track;
    };
    const compile = (nodeId: string): Track => {
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
          invalidate: (_progress, changedIds) => {
            switch (built.kind) {
              case "trigger-created":
                // Pre-Motion closure runs only here; nothing to invalidate.
                return;
              case "motion-created": {
                if (changedIds.length === 0) return;
                switch (state.kind) {
                  case "building":
                  case "disposed":
                    return;
                  case "ready":
                    state.runtime.invalidate(changedIds);
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
      const checkCommittedSources = (): void => {
        const checkTrack = (
          track: TrackDefinition,
          consumerId: string,
          sourceId: (source: string) => string,
        ): void => {
          const pluginId = outputPluginId(track.output);
          if (pluginId === undefined) return;
          const plugin = this.#capabilities.pluginDefinition?.(pluginId);
          if (plugin === undefined) return;
          const consumer = tracks.get(consumerId);
          if (consumer?.processorKind !== "computed") return;
          const requires = track.input?.requires;
          const declared = plugin.inputs.requires ?? {};
          const structures: Record<string, SourceStructure> = {};
          let ready = true;
          for (const [slotName, declaredSlot] of Object.entries(declared)) {
            const slot = slotDeclaration(declaredSlot);
            const binding = requires?.[slotName];
            if (binding === undefined) {
              if (!isOptionalSlot(slot)) ready = false;
              continue;
            }
            if (isShapeSlot(slot)) continue;
            const requiredStructure = needsSlotStructure(slot);
            if (typeof binding === "string") {
              const structure = tracks.get(sourceId(binding))?.structureAtCommit();
              if (structure === undefined) {
                if (requiredStructure) ready = false;
                continue;
              }
              defineOwnValue(structures, slotName, structure);
              continue;
            }
            const members: Record<string, Structure<unknown>> = {};
            let complete = true;
            for (const [key, memberSource] of Object.entries(binding)) {
              const structure = tracks.get(sourceId(memberSource))?.structureAtCommit();
              if (structure === undefined) {
                complete = false;
                break;
              }
              defineOwnValue(members, key, structure);
            }
            if (!complete) {
              if (requiredStructure) ready = false;
              continue;
            }
            defineOwnValue(structures, slotName, Object.freeze(members));
          }
          if (!ready) return;
          if (plugin.prepare !== undefined) {
            consumer.prepareCommit(Object.freeze(structures));
          }
        };
        for (const motion of acceptedProject.motions)
          for (const track of motion.tracks) {
            const consumerId = qualifyMotionTrack(motion.id, track.id).value;
            checkTrack(track, consumerId, (source) => qualifySource(source, motion.id));
          }
        for (const track of acceptedProject.freeTracks ?? []) {
          const consumerId = qualifyFreeTrack(track.id).value;
          checkTrack(track, consumerId, (source) => qualifySource(source, "~"));
        }
      };
      checkCommittedSources();
      const boundSlots = (node: GraphNode, requires: ResolvedRequires): BoundSlots => {
        type MutableEntry =
          | { readonly kind: "single"; readonly bound: BoundSlot }
          | { readonly kind: "map"; readonly members: Record<string, BoundSlot> };
        const entries: Record<string, MutableEntry> = {};
        for (const [slot, binding] of Object.entries(node.track.input?.requires ?? {}))
          if (isRecord(binding)) defineOwnValue(entries, slot, { kind: "map", members: {} });
        for (const edge of [...node.edges].sort(compareEdges)) {
          const requirement = edge.requirement;
          const sourceTrack = tracks.get(edge.sourceId);
          const structure =
            sourceTrack?.structureAtCommit() ?? sourceTrack?.outputStructure("values");
          const slotValues = requires[requirement.slot];
          let values: unknown;
          if (requirement.memberKey === undefined) values = slotValues;
          else values = isRecord(slotValues) ? slotValues[requirement.memberKey] : undefined;
          const bound: BoundSlot = Object.freeze({
            sourceId: edge.sourceId,
            values,
            ...(structure === undefined ? {} : { structure }),
          });
          if (requirement.memberKey === undefined) {
            defineOwnValue(entries, requirement.slot, { kind: "single", bound });
            continue;
          }
          const existing = entries[requirement.slot];
          if (existing === undefined) {
            const members: Record<string, BoundSlot> = {};
            defineOwnValue(members, requirement.memberKey, bound);
            defineOwnValue(entries, requirement.slot, { kind: "map", members });
            continue;
          }
          switch (existing.kind) {
            case "map":
              defineOwnValue(existing.members, requirement.memberKey, bound);
              break;
            case "single":
              throw new TypeError(`Slot '${requirement.slot}' mixes single and member bindings.`);
            default:
              return unreachable(existing);
          }
        }
        const slots: Record<string, BoundSlotEntry> = {};
        for (const [slot, entry] of Object.entries(entries)) {
          switch (entry.kind) {
            case "single":
              defineOwnValue(slots, slot, Object.freeze({ kind: "single", bound: entry.bound }));
              break;
            case "map":
              defineOwnValue(
                slots,
                slot,
                Object.freeze({ kind: "map", members: Object.freeze(entry.members) }),
              );
              break;
            default:
              return unreachable(entry);
          }
        }
        return Object.freeze(slots);
      };
      const compose: ComposeResolver = (node) => {
        const track = tracks.get(node.id);
        if (!track) throw new TypeError(`Unknown graph node "${node.id}".`);
        return (requires) => track.compose(boundSlots(node, requires));
      };
      const created = new ProjectRuntime(acceptedProject, {
        clock: this.#options.clock,
        scheduler: this.#options.scheduler,
        compose,
        isPluginRegistered: (pluginId) => this.#capabilities.isPluginAdmitted(pluginId),
        capabilities: this.#capabilities,
        graphBuilder: new IncrementalGraphBuilder(this.#capabilities),
        setProgress: (nodeId, progress) => tracks.get(nodeId)?.setProgress(progress),
        rewriteValues: (nodeId, values) => tracks.get(nodeId)?.replaceValues(values),
        rewriteParamValues: (nodeId, param) => tracks.get(nodeId)?.replaceParam(param),
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
