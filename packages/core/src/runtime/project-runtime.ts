// Docs: ./project-runtime.md
import type {
  AuthoredPluginGroup,
  AuthoredProperty,
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
  MotionDefinition,
  TriggerSignal,
} from "../contract/v5";
import { PLUGIN_GOALS_SLOT } from "../contract/solver-slots";
import { StaleMotionHandleError, type MotionHandle } from "../contract/motion-handle";
import type { SchemaTransaction } from "../contract/schema-transaction";
import {
  StaleTrackHandleError,
  type AuthoredValues,
  type LiveValues,
  type RequireView,
  type TrackHandle,
} from "../contract/track-handle";
import { validateMotionTrigger, validateTrackDefinition } from "../contract/validate-v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import type { LiveWriteResult } from "../domain/track";
import type { ResolvedPlugins, TrackConfigView } from "../domain/plugins";
import {
  readBoundGroup,
  readsAsProperty,
  removeGroup,
  removeKeyframe as removeAuthoredKeyframe,
  removeRequire,
  setGroup,
  setKeyframe as setAuthoredKeyframe,
  setRequire,
  type AuthoredKeyframes,
  type BoundGroup,
} from "../domain/authoring/keyframes";
import { sameCompiledTrackInput } from "../domain/authoring/recompile";
import { observationEdgeKey } from "../graph/ir";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import {
  describeDiagnostics,
  immediateInTransaction,
  nestedTransaction,
  propertyEntry,
  reservedGoalSlot,
  unboundGroup,
} from "./schema-refusals";
import { rejectAfterRollback, runRollbackSteps } from "./rollback";
import {
  EMPTY_KEYFRAMES,
  NO_OVERLAY,
  authoredValues,
  requireViews,
  sameTrigger,
  splitAuthoredValues,
  withAuthoredValues,
  withKeyframes,
  withStagger,
} from "./authored-values";
import { Diagnostics, type DiagnosticsSnapshot } from "./diagnostics";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";
import type { GraphNode } from "../graph/ir";
import type { MemberState } from "./graph-publisher";
import type { GraphBuilder } from "../ports/graph-builder";

type TrackEntry = {
  track: TrackDefinition;
  owner: object;
  motionId?: string;
  token: number;
  overlay: Readonly<Record<string, unknown>>;
};

type MotionEntry = {
  definition: MotionDefinition;
  token: number;
};
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}

interface SchemaEffect {
  readonly apply: () => void;
  readonly revert?: () => void;
}

interface SchemaPlan {
  readonly tracks?: Map<string, TrackEntry>;
  readonly motions?: Map<string, MotionEntry>;
}

interface SchemaCommit {
  readonly effects: readonly SchemaEffect[];
  readonly settle: readonly (() => void)[];
  readonly touched: readonly string[];
}

interface OpenTransaction {
  tracks: Map<string, TrackEntry>;
  motions: Map<string, MotionEntry>;
}
/**
 * The one seam by which a live value reaches the compiled Track this runtime does not own.
 *
 * One hook, because there is one mechanism, and what separates `setValues` from `overrideValues` is
 * the retained definition, which is ADR-060's. `undefined` for the overlay is a write no animated key
 * is involved in, which keeps a static-only write on the path it was already on. See ADR-059,
 * ADR-060.
 */
export type LiveValueWriter = (
  nodeId: string,
  values: LiveValues,
  overlay: Readonly<Record<string, unknown>> | undefined,
  rebase: boolean,
) => LiveWriteResult | undefined;
/**
 * How this layer asks what an authored record resolves to.
 *
 * One hook, one implementation: `PluginRegistry.resolveForKeyframes` stays the only owner of key
 * ownership, slot declaration and the plugin chain, and this runtime depends on a function rather
 * than on a registry it has no other reason to hold. See ADR-062.
 */
export type KeyframeResolver = (
  keyframes: Readonly<Record<string, unknown>>,
  path: string,
  track: TrackConfigView,
) => ResolvedPlugins;
export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  /**
   * How one node's interpolated state is read, forwarded to `GraphRuntime` untouched.
   *
   * Total, for the reason the option it forwards to gives. The function it returns resolves the
   * compiled Track per call.
   */
  readonly interpolated?: (node: GraphNode) => () => MemberState;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly writeValues?: LiveValueWriter;
  readonly compileTrack?: (track: TrackDefinition, nodeId?: string) => void;
  readonly disposeTrack?: (nodeId: string) => void;
  readonly stageTrack?: (track: TrackDefinition, nodeId: string) => StagedTrack;
  /**
   * The registry's own answer about one authored record, as data rather than as a refusal.
   *
   * Optional, because a project may be loaded with no `PluginRegistry` at all, and total when it is
   * present. With no seam every replacement builds, which keeps every prior registry-free rig
   * byte-identical. The second parameter is a diagnostics path rather than a node id, spelled exactly
   * as `compileTrack` spells it, which is the signature ADR-062 named. See ADR-062.
   */
  readonly resolveKeyframes?: KeyframeResolver;
  readonly addMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly replaceMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeMotionTrack?: (motionId: string, trackId: string) => void;
  /**
   * The two tier 0 seams: a Motion's trigger and its stagger, neither of which any node carries.
   *
   * Two hooks rather than one, because which one an edit asks is half of what the edit claims, and
   * why is ADR-061's amendment. Named beside the `addMotionTrack` family, and named for what they do:
   * a trigger carries a disposable resource behind it, a stagger is a bare field. See ADR-061.
   */
  readonly replaceMotionTrigger?: (motionId: string, definition: MotionDefinition) => void;
  readonly setMotionStagger?: (motionId: string, stagger?: number) => void;
  /**
   * The signal a live Motion's trigger takes, and the third seam this layer holds for one reason.
   *
   * A hook here rather than a closure over the engine's Motion map, so the one owner of the recipe
   * refusal can be asked before a signal reaches a live port. An unknown motion id is still refused
   * by the layer that owns the Motion. See ADR-064's amendment.
   */
  readonly signalMotion?: (motionId: string, signal: TriggerSignal) => void;
  readonly createMotion?: (definition: MotionDefinition) => void;
  readonly destroyMotion?: (motionId: string) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly disposeComposition?: () => void;
  readonly diagnosticsCapacity?: number;
  readonly graphBuilder?: GraphBuilder;
}
export class ProjectRuntime {
  readonly #project: ProjectDefinition;
  readonly #graph: GraphRuntime;
  readonly #instances = new Map<string, object>();

  #tracks = new Map<string, TrackEntry>();
  #motions = new Map<string, MotionEntry>();
  readonly #schemaOwner = {};
  #nextToken = 1;

  #open: OpenTransaction | undefined;
  readonly #diagnostics: Diagnostics;
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #writeValuesHook: LiveValueWriter;
  readonly #compileTrack: ((track: TrackDefinition, nodeId?: string) => void) | undefined;
  readonly #disposeTrack: ((nodeId: string) => void) | undefined;
  readonly #stageTrack: ((track: TrackDefinition, nodeId: string) => StagedTrack) | undefined;
  readonly #resolveKeyframes: KeyframeResolver | undefined;
  readonly #addMotionTrack:
    | ((motionId: string, trackId: string, duration?: number) => void)
    | undefined;
  readonly #replaceMotionTrack:
    | ((motionId: string, trackId: string, duration?: number) => void)
    | undefined;
  readonly #removeMotionTrack: ((motionId: string, trackId: string) => void) | undefined;
  readonly #replaceMotionTrigger:
    | ((motionId: string, definition: MotionDefinition) => void)
    | undefined;
  readonly #setMotionStagger: ((motionId: string, stagger?: number) => void) | undefined;
  readonly #signalMotion: ((motionId: string, signal: TriggerSignal) => void) | undefined;
  readonly #createMotion: ((definition: MotionDefinition) => void) | undefined;
  readonly #destroyMotion: ((motionId: string) => void) | undefined;
  readonly #disposeComposition: () => void;
  #disposed = false;
  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    for (const motion of project.motions) {
      this.#motions.set(motion.id, { definition: motion, token: this.#nextToken++ });
      for (const track of motion.tracks)
        this.#tracks.set(qualifyMotionTrack(motion.id, track.id).value, {
          track,
          owner: this.#schemaOwner,
          motionId: motion.id,
          token: this.#nextToken++,
          overlay: NO_OVERLAY,
        });
    }
    for (const track of project.freeTracks ?? [])
      this.#tracks.set(qualifyFreeTrack(track.id).value, {
        track,
        owner: this.#schemaOwner,
        token: this.#nextToken++,
        overlay: NO_OVERLAY,
      });
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#writeValuesHook = options.writeValues ?? (() => undefined);
    this.#compileTrack = options.compileTrack;
    this.#disposeTrack = options.disposeTrack;
    this.#stageTrack = options.stageTrack;
    this.#resolveKeyframes = options.resolveKeyframes;
    this.#addMotionTrack = options.addMotionTrack;
    this.#replaceMotionTrack = options.replaceMotionTrack;
    this.#removeMotionTrack = options.removeMotionTrack;
    this.#replaceMotionTrigger = options.replaceMotionTrigger;
    this.#setMotionStagger = options.setMotionStagger;
    this.#signalMotion = options.signalMotion;
    this.#createMotion = options.createMotion;
    this.#destroyMotion = options.destroyMotion;
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    this.#diagnostics = new Diagnostics(options.diagnosticsCapacity);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        scheduler: options.scheduler,
        onClockTick: options.onClockTick,
        graphBuilder: options.graphBuilder,
        interpolated: options.interpolated,
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
  get diagnostics(): DiagnosticsSnapshot {
    return this.#diagnostics.snapshot();
  }

  #readTracks(): ReadonlyMap<string, TrackEntry> {
    return this.#open?.tracks ?? this.#tracks;
  }

  #readMotions(): ReadonlyMap<string, MotionEntry> {
    return this.#open?.motions ?? this.#motions;
  }

  #stageTracks(): Map<string, TrackEntry> {
    const open = this.#open;
    if (open === undefined) return new Map(this.#tracks);
    if (open.tracks === this.#tracks) open.tracks = new Map(this.#tracks);
    return open.tracks;
  }

  #stageMotions(): Map<string, MotionEntry> {
    const open = this.#open;
    if (open === undefined) return new Map(this.#motions);
    if (open.motions === this.#motions) open.motions = new Map(this.#motions);
    return open.motions;
  }
  mount(nodeId: string, instance: object = {}): object {
    this.#assertLive();
    this.#refuseInsideRecipe("mount");
    return this.#mountNode(nodeId, instance);
  }

  #mountNode(nodeId: string, instance: object = {}): object {
    if (this.#instances.has(nodeId)) throw new TypeError(`Node "${nodeId}" is already mounted.`);
    this.#graph.attach(nodeId);
    this.#instances.set(nodeId, instance);
    return instance;
  }
  unmount(nodeId: string): void {
    this.#assertLive();
    this.#refuseInsideRecipe("unmount");
    if (!this.#instances.has(nodeId)) return;
    this.#instances.delete(nodeId);
    this.#graph.detach(nodeId);
  }
  /**
   * Runs `recipe` as one transaction and commits what it staged exactly once.
   *
   * What one costs, why an abort needs no compensation path, and why a recipe that staged nothing
   * commits nothing are ADR-064's. That the copy is taken after an entry point's last refusal
   * rather than before it is `#stageTracks`'s own. See `RA-66`, `RA-95` and ADR-064.
   */
  edit<T>(recipe: (transaction: SchemaTransaction) => T): T {
    this.#assertLive();
    if (this.#open !== undefined) nestedTransaction();
    const open: OpenTransaction = { tracks: this.#tracks, motions: this.#motions };
    this.#open = open;
    let answer: T;
    try {
      answer = recipe(this.#transaction());
    } finally {
      // Cleared before the commit rather than after it, so the settle steps mount against the
      // retained pair and an `edit` after a throw finds no transaction open.
      this.#open = undefined;
    }
    if (open.tracks !== this.#tracks || open.motions !== this.#motions)
      this.#apply({ tracks: open.tracks, motions: open.motions });
    return answer;
  }

  #transaction(): SchemaTransaction {
    const runtime = this;
    return Object.freeze({
      addMotion: (definition: MotionDefinition) => runtime.motion(runtime.addMotion(definition).id),
      motion: (motionId: string) => runtime.motion(motionId),
      tryMotion: (motionId: string) => runtime.tryMotion(motionId),
      addTrack: (track: TrackDefinition, options?: { motionId?: string }) =>
        runtime.addTrack(track, options),
      track: (nodeId: string) => runtime.track(nodeId),
      tryTrack: (nodeId: string) => runtime.tryTrack(nodeId),
    });
  }
  addMotion(definition: MotionDefinition): { readonly id: string } {
    this.#assertLive();
    const triggerDiagnostics = validateMotionTrigger(
      definition.trigger,
      `addMotion(${definition.id}).trigger`,
    );
    if (triggerDiagnostics.some(({ severity }) => severity === "error"))
      throw new TypeError(describeDiagnostics(triggerDiagnostics));
    if (definition.tracks.length > 0)
      throw new TypeError(`Runtime Motion "${definition.id}" must start with empty tracks.`);
    if (this.#readMotions().has(definition.id))
      throw new TypeError(`Motion "${definition.id}" already exists.`);
    const accepted = { ...definition, tracks: [] };
    const motions = this.#stageMotions();
    motions.set(accepted.id, { definition: accepted, token: this.#nextToken++ });
    // A map builder and nothing else. Which hooks a created Motion costs is `#derive`'s answer, and
    // the track half is absent because this commit did not move it. See ADR-032 and ADR-064.
    this.#commit({ motions });
    return Object.freeze({ id: accepted.id });
  }
  destroyMotion(motionId: string): void {
    this.#assertLive();
    if (!this.#readMotions().has(motionId)) throw new TypeError(`Unknown motion "${motionId}".`);
    this.#removeMotion(motionId);
  }
  /**
   * Hands one signal to the layer that owns this Motion's trigger.
   *
   * Tier 0's twin, refused inside a recipe on the rule every immediate verb shares, and the hook
   * keeps its own refusal for an unknown motion id. See ADR-064's amendment.
   */
  signal(motionId: string, signal: TriggerSignal): void {
    this.#assertLive();
    this.#refuseInsideRecipe("signal");
    this.#signalMotion?.(motionId, signal);
  }
  /**
   * The resolver for one Motion, refusing an id this project never had. Separate from `tryMotion`
   * for the reason `#entryOf` is separate from `#entryIfLive`: this one refuses and that one answers.
   */
  motion(motionId: string): MotionHandle {
    this.#assertLive();
    const entry = this.#readMotions().get(motionId);
    if (!entry) throw new TypeError(`Unknown motion "${motionId}".`);
    return this.#motionHandle(motionId, entry.token);
  }
  tryMotion(motionId: string): MotionHandle | undefined {
    this.#assertLive();
    const entry = this.#readMotions().get(motionId);
    return entry === undefined ? undefined : this.#motionHandle(motionId, entry.token);
  }
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle {
    return this.#addTrack(track, this.#schemaOwner, options);
  }
  track(nodeId: string): TrackHandle {
    this.#assertLive();
    const entry = this.#entryOf(nodeId);
    return this.#handle(nodeId, entry.token);
  }
  /**
   * The same resolution as `track` above without the refusal, and the probe an upsert is written
   * with: a caller branches on the answer at its own call site. Why a single `setTrack` verb is not
   * on this surface is ADR-063's. See ADR-063.
   */
  tryTrack(nodeId: string): TrackHandle | undefined {
    this.#assertLive();
    const entry = this.#readTracks().get(nodeId);
    return entry === undefined ? undefined : this.#handle(nodeId, entry.token);
  }
  adopt(
    track: TrackDefinition,
    owner: object,
    options?: { motionId?: string },
  ): { readonly id: string; readonly track: TrackDefinition } {
    const handle = this.#addTrack(track, owner, options);
    return Object.freeze({ id: handle.id, track: handle.definition });
  }
  destroyAdopted(nodeId: string, owner: object): void {
    this.#assertLive();
    const entry = this.#readTracks().get(nodeId);
    if (!entry || entry.owner !== owner)
      throw new TypeError(
        !entry
          ? `Node "${nodeId}" is not adopted.`
          : `Only the adopting owner can destroy "${nodeId}".`,
      );
    this.#removeTrack(nodeId, entry.token);
  }
  /**
   * Every node that reads this one, for an editor's preflight rather than for enforcement.
   *
   * Enforcement stays where ADR-050 put it, in the candidate graph. What this member owns is the
   * public contract: the live gate, and an id this project never had answered rather than refused,
   * because a preflight that refused an unknown id would make an editor ask twice. A projection of
   * `#readersOf`, which owns the question. See ADR-050 and ADR-051.
   */
  dependantsOf(nodeId: string): readonly string[] {
    this.#assertLive();
    return this.#readersOf(nodeId);
  }

  #readersOf(nodeId: string): readonly string[] {
    const readers: readonly string[] | undefined = this.#graph.graph.dependents[nodeId];
    return Object.freeze(readers === undefined ? [] : [...new Set(readers)]);
  }
  #addTrack(track: TrackDefinition, owner: object, options?: { motionId?: string }): TrackHandle {
    this.#assertLive();
    const motionId = options?.motionId;
    if (motionId !== undefined && !this.#readMotions().has(motionId))
      throw new TypeError(`Unknown motion "${motionId}".`);
    const id =
      motionId !== undefined
        ? qualifyMotionTrack(motionId, track.id).value
        : qualifyFreeTrack(track.id).value;
    if (this.#readTracks().has(id)) throw new TypeError(`Track "${id}" already exists.`);
    const validation = validateTrackDefinition(track, `addTrack(${track.id})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const accepted = validation.value;
    const token = this.#nextToken++;
    const tracks = this.#stageTracks();
    tracks.set(id, { track: accepted, owner, motionId, token, overlay: NO_OVERLAY });
    // A map builder and nothing else: the compile, the Motion registration and the mount are
    // `#derive`'s answer, derived from this id being absent from the retained pair.
    // See ADR-031 and ADR-064.
    this.#commit({ tracks });
    return this.#handle(id, token);
  }

  #ownedBy(
    tracks: ReadonlyMap<string, TrackEntry>,
    motionId: string,
  ): readonly (readonly [string, TrackEntry])[] {
    return [...tracks.entries()].filter(([, entry]) => entry.motionId === motionId);
  }

  #entryOf(nodeId: string): TrackEntry {
    const entry = this.#readTracks().get(nodeId);
    if (!entry) throw new TypeError(`Unknown graph node "${nodeId}".`);
    return entry;
  }

  #liveOf<E extends { readonly token: number }>(
    entries: ReadonlyMap<string, E>,
    id: string,
    token: number,
  ): E | undefined {
    const entry = entries.get(id);
    return entry !== undefined && entry.token === token ? entry : undefined;
  }

  #entryIfLive(id: string, token: number): TrackEntry | undefined {
    return this.#liveOf(this.#readTracks(), id, token);
  }

  #liveEntry(id: string, token: number): TrackEntry {
    const entry = this.#entryIfLive(id, token);
    if (entry === undefined) throw new StaleTrackHandleError(id);
    return entry;
  }
  #motionIfLive(id: string, token: number): MotionEntry | undefined {
    return this.#liveOf(this.#readMotions(), id, token);
  }
  #liveMotion(id: string, token: number): MotionEntry {
    const entry = this.#motionIfLive(id, token);
    if (entry === undefined) throw new StaleMotionHandleError(id);
    return entry;
  }

  #liveId(motionId: string, token: number): string {
    return this.#liveMotion(motionId, token).definition.id;
  }

  #motionDefinition(entry: MotionEntry): MotionDefinition {
    const id = entry.definition.id;
    return Object.freeze({
      ...entry.definition,
      tracks: this.#ownedBy(this.#readTracks(), id).map(([, owned]) => owned.track),
    });
  }

  #removeMotion(motionId: string): void {
    const owned = this.#ownedBy(this.#readTracks(), motionId);
    if (owned.length)
      throw new TypeError(
        `Motion "${motionId}" still has ${owned.length} track(s). Remove them before destroying it.`,
      );
    const motions = this.#stageMotions();
    motions.delete(motionId);
    this.#commit({ motions });
  }

  #refuseInsideRecipe(verb: string): void {
    if (this.#open !== undefined) immediateInTransaction(verb);
  }

  #setTrigger(id: string, token: number, trigger: MotionDefinition["trigger"]): void {
    this.#refuseInsideRecipe("setTrigger");
    const entry = this.#liveMotion(id, token);
    const motionId = entry.definition.id;
    const diagnostics = validateMotionTrigger(trigger, `setTrigger(${motionId}).trigger`);
    if (diagnostics.some(({ severity }) => severity === "error"))
      throw new TypeError(describeDiagnostics(diagnostics));
    if (sameTrigger(entry.definition.trigger, trigger)) return;
    const definition = Object.freeze({ ...entry.definition, trigger });
    this.#replaceMotionTrigger?.(motionId, this.#motionDefinition({ ...entry, definition }));
    this.#motions.set(motionId, { ...entry, definition });
  }

  #setStagger(id: string, token: number, stagger: number | undefined): void {
    this.#refuseInsideRecipe("setStagger");
    const entry = this.#liveMotion(id, token);
    const motionId = entry.definition.id;
    if (entry.definition.stagger === stagger) return;
    this.#setMotionStagger?.(motionId, stagger);
    this.#motions.set(motionId, { ...entry, definition: withStagger(entry.definition, stagger) });
  }

  #motionHandle(id: string, token: number): MotionHandle {
    const runtime = this;
    return Object.freeze({
      id,
      get live(): boolean {
        return runtime.#motionIfLive(id, token) !== undefined;
      },
      get definition(): MotionDefinition {
        return runtime.#motionDefinition(runtime.#liveMotion(id, token));
      },
      get trackIds(): readonly string[] {
        const owner = runtime.#liveId(id, token);
        return Object.freeze(runtime.#ownedBy(runtime.#readTracks(), owner).map(([node]) => node));
      },
      addTrack: (track: TrackDefinition) =>
        runtime.#addTrack(track, runtime.#schemaOwner, { motionId: runtime.#liveId(id, token) }),
      track: (trackId: string) =>
        runtime.track(qualifyMotionTrack(runtime.#liveId(id, token), trackId).value),
      tryTrack: (trackId: string) =>
        runtime.tryTrack(qualifyMotionTrack(runtime.#liveId(id, token), trackId).value),
      setTrigger: (next: MotionDefinition["trigger"]) => runtime.#setTrigger(id, token, next),
      setStagger: (stagger?: number) => runtime.#setStagger(id, token, stagger),
      destroy: () => runtime.#removeMotion(runtime.#liveId(id, token)),
    });
  }
  #handle(id: string, token: number): TrackHandle {
    const runtime = this;
    return Object.freeze({
      id,
      get live(): boolean {
        return runtime.#entryIfLive(id, token) !== undefined;
      },
      get definition(): TrackDefinition {
        return runtime.#liveEntry(id, token).track;
      },
      get requires(): readonly RequireView[] {
        return requireViews(runtime.#liveEntry(id, token).track);
      },
      remove: () => runtime.#removeTrack(id, token),
      replace: (next: TrackDefinition) => runtime.#replaceTrack(id, token, next),
      addObserve: (observation: ObservationDefinition) =>
        runtime.#replaceWithObservation(id, token, observation, true),
      removeObserve: (observation: ObservationDefinition) =>
        runtime.#replaceWithObservation(id, token, observation, false),
      setRequire: (plugin: string, slot: string, source: string, memberKey?: string) =>
        runtime.#setRequire(id, token, plugin, slot, source, memberKey),
      removeRequire: (plugin: string, slot: string, memberKey?: string) =>
        runtime.#removeRequire(id, token, plugin, slot, memberKey),
      setKeyframeGroup: (plugin: string, group: AuthoredPluginGroup) =>
        runtime.#setKeyframeGroup(id, token, plugin, group),
      removeKeyframeGroup: (plugin: string) => runtime.#removeKeyframeGroup(id, token, plugin),
      setGoal: (plugin: string, memberId: string, source: string) =>
        runtime.#setGoal(id, token, plugin, memberId, source),
      removeGoal: (plugin: string, memberId: string) =>
        runtime.#removeGoal(id, token, plugin, memberId),
      setKeyframe: (plugin: string, key: string, value: AuthoredProperty) =>
        runtime.#setKeyframe(id, token, plugin, key, value),
      removeKeyframe: (plugin: string, key: string) =>
        runtime.#removeKeyframe(id, token, plugin, key),
      overrideValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, runtime.#liveEntry(id, token), next, false),
      setValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, runtime.#liveEntry(id, token), next, true),
    });
  }

  #removeTrack(id: string, token: number): void {
    this.#assertLive();
    this.#liveEntry(id, token);
    const tracks = this.#stageTracks();
    tracks.delete(id);
    this.#commit({ tracks });
  }

  #resolve(nodeId: string, track: TrackDefinition): ResolvedPlugins | undefined {
    return this.#resolveKeyframes?.(track.keyframes ?? {}, `${nodeId}.keyframes`, {
      id: nodeId,
      duration: track.duration,
    });
  }

  #needsTimelineBuild(
    nodeId: string,
    current: TrackDefinition,
    candidate: TrackDefinition,
  ): boolean {
    const resolved = this.#resolve(nodeId, candidate);
    if (resolved === undefined) return true;
    if (resolved.diagnostics.some(({ severity }) => severity === "error"))
      throw new TypeError(describeDiagnostics(resolved.diagnostics));
    return !sameCompiledTrackInput(
      { definition: current, resolved: this.#resolve(nodeId, current) },
      { definition: candidate, resolved },
    );
  }

  #replaceTrack(id: string, token: number, next: TrackDefinition): void {
    const entry = this.#liveEntry(id, token);
    const expected =
      entry.motionId !== undefined
        ? qualifyMotionTrack(entry.motionId, next.id).value
        : qualifyFreeTrack(next.id).value;
    if (expected !== id) throw new TypeError(`Replacement must preserve node id "${id}".`);
    const validation = validateTrackDefinition(next, `replaceTrack(${id})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const tracks = this.#stageTracks();
    tracks.set(id, { ...entry, track: validation.value, overlay: NO_OVERLAY });
    this.#commit({ tracks });
  }

  #commit(plan: SchemaPlan): void {
    if (this.#open !== undefined) return;
    this.#apply(plan);
  }

  #apply(plan: SchemaPlan): void {
    // An absent half resolves to the map this class already holds, so the adoption assigns it back
    // to itself. Read directly rather than through the accessors: a recipe is never open here.
    const tracks = plan.tracks ?? this.#tracks;
    const motions = plan.motions ?? this.#motions;
    const commit = this.#derive(tracks, motions);
    const applied: SchemaEffect[] = [];
    try {
      for (const effect of commit.effects) {
        effect.apply();
        applied.push(effect);
      }
      this.#graph.replaceGraph(this.#snapshot(tracks, motions));
    } catch (error) {
      const steps: (() => void)[] = [];
      for (const effect of applied) {
        if (effect.revert !== undefined) steps.push(effect.revert);
      }
      rejectAfterRollback(error, () => runRollbackSteps(steps));
    }
    this.#adoptMaps(tracks, motions);
    for (const step of commit.settle) step();
    if (commit.touched.length === 0) return;
    const batch = this.#graph.invalidate(commit.touched);
    this.#diagnostics.recordAll(batch.diagnostics);
  }

  #derive(
    tracks: ReadonlyMap<string, TrackEntry>,
    motions: ReadonlyMap<string, MotionEntry>,
  ): SchemaCommit {
    const effects: SchemaEffect[] = [];
    const settle: (() => void)[] = [];
    const touched: string[] = [];
    for (const [motionId, entry] of motions) {
      if (this.#motions.has(motionId)) continue;
      const definition = entry.definition;
      effects.push({
        apply: () => this.#createMotion?.(definition),
        revert: () => this.#destroyMotion?.(motionId),
      });
    }
    for (const [nodeId, entry] of this.#tracks) {
      if (tracks.has(nodeId)) continue;
      const motionId = entry.motionId;
      settle.push(() => {
        this.#instances.delete(nodeId);
        this.#graph.evictNode(nodeId);
        this.#disposeTrack?.(nodeId);
        if (motionId !== undefined) this.#removeMotionTrack?.(motionId, nodeId);
      });
      // Not the removed node, which is gone, but every node that was reading it. Why an edge test
      // misses a solver reading its chain members, why this is read here rather than after
      // `replaceGraph`, and why a seed the committed graph does not contain is harmless rather than
      // filtered are all ADR-051's amendment. See `RA-98` and `RA-99`.
      touched.push(...this.#readersOf(nodeId));
    }
    for (const motionId of this.#motions.keys())
      if (!motions.has(motionId)) settle.push(() => this.#destroyMotion?.(motionId));
    for (const [nodeId, entry] of tracks) {
      const retained = this.#tracks.get(nodeId);
      const motionId = entry.motionId;
      if (retained === undefined) {
        const added = entry.track;
        effects.push({
          apply: () => this.#compileTrack?.(added, nodeId),
          revert: () => this.#disposeTrack?.(nodeId),
        });
        if (motionId !== undefined)
          settle.push(() => this.#addMotionTrack?.(motionId, nodeId, added.duration));
        settle.push(() => this.#mountNode(nodeId));
        // The new node publishes, which it never did before, and one whose sources have not
        // published yet lands on blocked with a pending diagnostic. See `RA-9`.
        touched.push(nodeId);
        continue;
      }
      if (retained.track === entry.track) continue;
      const previous = retained.track;
      const next = entry.track;
      let staged: StagedTrack | undefined;
      // Conditional, and nothing else about the transaction moves: there is no fast lane for an
      // edge. A skipped build leaves `staged` undefined, so the settle step below is the no-op it
      // already was for a caller that wired no staging seam at all. See ADR-062.
      if (this.#needsTimelineBuild(nodeId, previous, next))
        effects.push({
          apply: () => {
            staged = this.#stageTrack?.(next, nodeId);
          },
          revert: () => staged?.rollback(),
        });
      // Republish the displaced compiled Track before restoring Motion, which is what reverts
      // running in apply order buys. See ADR-031 and ADR-045.
      if (motionId !== undefined)
        effects.push({
          apply: () => this.#replaceMotionTrack?.(motionId, nodeId, next.duration),
          revert: () => this.#replaceMotionTrack?.(motionId, nodeId, previous.duration),
        });
      settle.push(() => staged?.commit());
      // The edited node, and only it: the publisher walks dependents from the seed, so naming it is
      // sufficient. `addObserve` and `removeObserve` route through here, which makes them publish.
      touched.push(nodeId);
    }
    return { effects, settle, touched };
  }

  #adoptMaps(tracks: Map<string, TrackEntry>, motions: Map<string, MotionEntry>): void {
    this.#tracks = tracks;
    this.#motions = motions;
  }

  #writeValues(nodeId: string, entry: TrackEntry, values: AuthoredValues, rebase: boolean) {
    this.#refuseInsideRecipe(rebase ? "setValues" : "overrideValues");
    const { statics, animated } = splitAuthoredValues(values);
    // An animated key is involved when this call names one, and also when the last one did: a
    // revert names no key at all, which is what the retained overlay is for. See ADR-060.
    const involved = Object.keys(animated).length > 0 || Object.keys(entry.overlay).length > 0;
    const rewritten = rebase || involved ? withAuthoredValues(entry.track, values) : entry.track;
    if (involved) {
      const validation = validateTrackDefinition(rewritten, `writeValues(${nodeId})`);
      if (!validation.valid) throw new TypeError(describeDiagnostics(validation.diagnostics));
    }
    const mask = { ...authoredValues(entry.track), ...statics };
    const written = this.#writeValuesHook(nodeId, mask, involved ? animated : undefined, rebase);
    this.#tracks.set(nodeId, {
      ...entry,
      track: rebase ? rewritten : entry.track,
      overlay: animated,
    });
    // The escalation, and it is neither `#replaceTrack` nor `replaceGraph`: topology did not change
    // and the compiled definition is allowed to differ from the retained one. The re-seek is here
    // because this is the only path that escalates. See ADR-060.
    if (written !== undefined && !written.patched) {
      this.#stageTrack?.(rewritten, nodeId)?.commit();
      this.#setProgress(nodeId, written.progress);
    }
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }

  #boundGroup(
    nodeId: string,
    entry: TrackEntry,
    plugin: string,
  ): { keyframes: AuthoredKeyframes; bound: BoundGroup } {
    const keyframes = entry.track.keyframes;
    const bound = keyframes === undefined ? undefined : readBoundGroup(keyframes, plugin);
    if (keyframes === undefined || bound === undefined) unboundGroup(nodeId, plugin);
    return { keyframes, bound };
  }

  #invalidateOne(nodeId: string) {
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }

  #recompileKeyframes(
    nodeId: string,
    entry: TrackEntry,
    keyframes: AuthoredKeyframes,
    verb: string,
  ) {
    const next = withKeyframes(entry.track, keyframes);
    const validation = validateTrackDefinition(next, `${verb}(${nodeId})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const accepted = validation.value;
    const resolved = this.#resolve(nodeId, accepted);
    if (resolved?.diagnostics.some(({ severity }) => severity === "error"))
      throw new TypeError(describeDiagnostics(resolved.diagnostics));
    const written = this.#writeValuesHook(
      nodeId,
      authoredValues(entry.track),
      Object.keys(entry.overlay).length === 0 ? undefined : NO_OVERLAY,
      true,
    );
    const staged = this.#stageTrack?.(accepted, nodeId);
    this.#tracks.set(nodeId, { ...entry, track: accepted, overlay: NO_OVERLAY });
    staged?.commit();
    if (written !== undefined) this.#setProgress(nodeId, written.progress);
    return this.#invalidateOne(nodeId);
  }

  #setKeyframe(
    nodeId: string,
    token: number,
    plugin: string,
    key: string,
    value: AuthoredProperty,
  ) {
    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("setKeyframe");
    const { keyframes, bound } = this.#boundGroup(nodeId, entry, plugin);
    if (Object.hasOwn(bound.group.values ?? {}, key))
      return this.#writeValues(nodeId, entry, { [key]: value }, true);
    const edited = setAuthoredKeyframe(keyframes, bound, key, value);
    return this.#recompileKeyframes(nodeId, entry, edited, "setKeyframe");
  }
  #removeKeyframe(nodeId: string, token: number, plugin: string, key: string) {
    const entry = this.#liveEntry(nodeId, token);
    this.#refuseInsideRecipe("removeKeyframe");
    const { keyframes, bound } = this.#boundGroup(nodeId, entry, plugin);
    const edited = removeAuthoredKeyframe(keyframes, bound, key);
    if (edited === keyframes) return this.#invalidateOne(nodeId);
    return this.#recompileKeyframes(nodeId, entry, edited, "removeKeyframe");
  }
  #replaceWithObservation(
    id: string,
    token: number,
    observation: ObservationDefinition,
    add: boolean,
  ): void {
    const entry = this.#liveEntry(id, token);
    const observations = [...(entry.track.observes ?? [])];
    const key = observationEdgeKey(observation, id, entry.motionId ?? "~");
    const index = observations.findIndex(
      (candidate) => observationEdgeKey(candidate, id, entry.motionId ?? "~") === key,
    );
    // Idempotent observation semantics rather than a stale guard, which was answered above. Neither
    // no-op commits anything, so neither flushes and neither stages inside a recipe, which is what
    // lets a recipe of nothing but no-ops end without a candidate build. See `RA-66`.
    if (add) {
      if (index >= 0) return;
      observations.push(observation);
    } else {
      if (index < 0) return;
      observations.splice(index, 1);
    }
    this.#replaceTrack(id, token, { ...entry.track, observes: observations });
  }

  #editRequire(
    id: string,
    token: number,
    plugin: string,
    edit: (keyframes: AuthoredKeyframes, bound: BoundGroup) => AuthoredKeyframes,
  ): void {
    const entry = this.#liveEntry(id, token);
    const { keyframes, bound } = this.#boundGroup(id, entry, plugin);
    const next = edit(keyframes, bound);
    if (next === keyframes) return;
    this.#writeKeyframes(id, token, entry.track, next);
  }
  #setRequire(
    id: string,
    token: number,
    plugin: string,
    slot: string,
    source: string,
    memberKey?: string,
  ): void {
    this.#editRequire(id, token, plugin, (keyframes, bound) => {
      if (slot === PLUGIN_GOALS_SLOT) reservedGoalSlot(bound.plugin, slot);
      return setRequire(keyframes, bound, slot, source, memberKey);
    });
  }
  #removeRequire(
    id: string,
    token: number,
    plugin: string,
    slot: string,
    memberKey?: string,
  ): void {
    this.#editRequire(id, token, plugin, (keyframes, bound) => {
      if (slot === PLUGIN_GOALS_SLOT) reservedGoalSlot(bound.plugin, slot);
      return removeRequire(keyframes, bound, slot, memberKey);
    });
  }

  #setGoal(id: string, token: number, plugin: string, memberId: string, source: string): void {
    this.#editRequire(id, token, plugin, (keyframes, bound) =>
      setRequire(keyframes, bound, PLUGIN_GOALS_SLOT, source, memberId),
    );
  }
  #removeGoal(id: string, token: number, plugin: string, memberId: string): void {
    this.#editRequire(id, token, plugin, (keyframes, bound) =>
      removeRequire(keyframes, bound, PLUGIN_GOALS_SLOT, memberId),
    );
  }

  #editGroup(
    id: string,
    token: number,
    plugin: string,
    edit: (keyframes: AuthoredKeyframes) => AuthoredKeyframes,
  ): void {
    const entry = this.#liveEntry(id, token);
    const keyframes = entry.track.keyframes ?? EMPTY_KEYFRAMES;
    if (readsAsProperty(keyframes, plugin)) propertyEntry(id, plugin);
    const next = edit(keyframes);
    if (next === keyframes) return;
    this.#writeKeyframes(id, token, entry.track, next);
  }
  #setKeyframeGroup(id: string, token: number, plugin: string, group: AuthoredPluginGroup): void {
    this.#editGroup(id, token, plugin, (keyframes) => setGroup(keyframes, plugin, group));
  }
  #removeKeyframeGroup(id: string, token: number, plugin: string): void {
    this.#editGroup(id, token, plugin, (keyframes) => removeGroup(keyframes, plugin));
  }

  #writeKeyframes(
    id: string,
    token: number,
    track: TrackDefinition,
    keyframes: AuthoredKeyframes,
  ): void {
    this.#replaceTrack(id, token, withKeyframes(track, keyframes));
  }

  #snapshot(
    tracks: ReadonlyMap<string, TrackEntry>,
    motions: ReadonlyMap<string, MotionEntry>,
  ): ProjectDefinition {
    const owned = new Map<string, TrackDefinition[]>();
    const freeTracks: TrackDefinition[] = [];
    for (const entry of tracks.values()) {
      if (entry.motionId === undefined) {
        freeTracks.push(entry.track);
        continue;
      }
      const bucket = owned.get(entry.motionId);
      if (bucket === undefined) owned.set(entry.motionId, [entry.track]);
      else bucket.push(entry.track);
    }
    return {
      ...this.#project,
      motions: [...motions.values()].map((entry) => ({
        ...entry.definition,
        tracks: owned.get(entry.definition.id) ?? [],
      })),
      freeTracks,
    };
  }
  seek(nodeId: string, progress: number) {
    this.#assertLive();
    this.#refuseInsideRecipe("seek");
    this.#setProgress(nodeId, progress);
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  /**
   * Writes `nodeId`'s values, leaving the authored definition exactly as it was.
   *
   * The revertible half of the pair: a static key is masked at read time, an animated key has its
   * tweens replaced against a retained base, and both are sticky until the next live write or a real
   * `replace()`. See ADR-059 and ADR-060.
   */
  overrideValues(nodeId: string, values: AuthoredValues) {
    this.#assertLive();
    return this.#writeValues(nodeId, this.#entryOf(nodeId), values, false);
  }
  /**
   * Rewrites `nodeId`'s authored values, topology untouched.
   *
   * The authored half: the retained `TrackDefinition` moves with the live values, so
   * `handle.definition` and the composition cannot disagree, and it still costs one invalidate
   * rather than a staged Track and a graph rebuild. See ADR-059 and ADR-060.
   */
  setValues(nodeId: string, values: AuthoredValues) {
    this.#assertLive();
    return this.#writeValues(nodeId, this.#entryOf(nodeId), values, true);
  }
  invalidate(nodeIds: readonly string[]) {
    this.#assertLive();
    this.#refuseInsideRecipe("invalidate");
    const batch = this.#graph.invalidate(nodeIds);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    for (const nodeId of [...this.#instances.keys()]) this.#graph.detach(nodeId);
    this.#instances.clear();
    this.#tracks.clear();
    this.#motions.clear();
    this.#open = undefined;
    this.#graph.dispose();
    this.#disposeComposition();
  }
  #assertLive(): void {
    if (this.#disposed) throw new Error("ProjectRuntime is disposed.");
  }
}
