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
  /**
   * The animated half of the last live write, and nothing else. A private map entry, carried by no
   * public surface, and why an override needs one is ADR-060's. See ADR-060.
   */
  overlay: Readonly<Record<string, unknown>>;
};
/**
 * One retained Motion, and the token every handle to it captures.
 *
 * The token comes from the same `#nextToken` the track entries use, because the staleness machinery
 * is per-entry rather than per-track-ness, which is ADR-061's. No reader trusts `definition.tracks`,
 * because it is empty for a runtime add and authoritative for a loaded one: `#ownedBy` is the one
 * owner of which tracks a motion has. See ADR-056 and ADR-061.
 */
type MotionEntry = {
  definition: MotionDefinition;
  token: number;
};
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}
/**
 * One side effect a structural commit needs in place before the graph is asked to accept it.
 *
 * `revert` is the inverse, and it is optional because a removal and a motion destroy reach the
 * candidate graph with no hook applied yet. An effect counts as applied only once its `apply`
 * returned, which is `#apply`'s own. See `U-7` and `RA-2`.
 */
interface SchemaEffect {
  readonly apply: () => void;
  readonly revert?: () => void;
}
/**
 * One structural transaction, as data, and now only the pair the graph is asked to accept.
 *
 * `tracks` and `motions` are what the graph is asked to accept and, once it has, what the retained
 * maps become, adopted from the same pair that built the snapshot so the committed graph and the maps
 * cannot drift. Why an untouched entry is handed through by identity is ADR-058's, and `RA-7`
 * compares them that way.
 *
 * Each half is optional: a half this commit did not move is absent rather than handed back, and what
 * pointer adoption buys and costs is ADR-064's third amendment. `#stageTracks` and `#stageMotions`
 * are the only two things that make one, and therefore the only two allowed to fill this. `RA-92`.
 *
 * What a plan no longer carries is a hook list: a commit's hooks are derived from what it commits,
 * by `#derive` below, and every entry point is a map builder that names no hook at all. Why a hook
 * list assembled per op cannot compose two is ADR-064's, and `RA-65` is the first case that can
 * tell the two apart. See ADR-064.
 */
interface SchemaPlan {
  readonly tracks?: Map<string, TrackEntry>;
  readonly motions?: Map<string, MotionEntry>;
}
/**
 * What one accepted pair costs, and the only thing in this file that names a hook.
 *
 * `effects` are applied before the graph sees the candidate and reverted in **apply order** when it
 * refuses, which is ADR-045's republish-before-restore rule rather than an incidental ordering.
 * `settle` runs only after acceptance. See ADR-031 and ADR-045.
 *
 * `touched` names the nodes this transaction changed and is seeded into one flush once the commit
 * settled. Empty is a real answer rather than a default, and why a commit that derives no node does
 * not flush at all is ADR-064's amendment. Which nodes a removal names, and why a solver is the
 * reader an edge test misses, is ADR-051's amendment. See `RA-98` and `RA-99`.
 */
interface SchemaCommit {
  readonly effects: readonly SchemaEffect[];
  readonly settle: readonly (() => void)[];
  readonly touched: readonly string[];
}
/**
 * The pending pair one open recipe is staging, and the whole of the transaction owner's state.
 *
 * Mutable in exactly its two fields, and no op log beside them. Each half starts as the retained
 * map by identity and is replaced by a copy on the first op that stages into it, which is
 * `#stageTracks`'s own. See ADR-064 and `RA-93`.
 */
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
  /**
   * The retained pair, and the two fields a commit adopts rather than rewrites.
   *
   * Not `readonly`, because a commit replaces the map object rather than rewriting its entries, which
   * is ADR-064's third amendment. The map it adopts was made by `#stageTracks` or `#stageMotions` and
   * nothing holds it afterwards. Every reader still goes through `#readTracks` and `#readMotions`,
   * which answer a `ReadonlyMap`, and both in-place tiers still write through these by id.
   * See `RA-92` and `RA-97`.
   */
  #tracks = new Map<string, TrackEntry>();
  #motions = new Map<string, MotionEntry>();
  readonly #schemaOwner = {};
  #nextToken = 1;
  /**
   * The open transaction, and the one piece of state `edit` adds to this class.
   *
   * Present exactly while a recipe is running, and the same shape the retained maps are, read
   * through the two accessors below so no verb learns it is inside a recipe. See ADR-064.
   */
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
  /**
   * The retained tracks, or the pending ones while a recipe is open.
   *
   * Every structural read in this class goes through this rather than reaching `#tracks` directly,
   * which is the one accessor ADR-064 puts in front of the pair. The two in-place tiers keep
   * reading the retained maps and refuse by name inside a recipe instead. See ADR-064.
   */
  #readTracks(): ReadonlyMap<string, TrackEntry> {
    return this.#open?.tracks ?? this.#tracks;
  }
  /** The same question about the other map, and the same reason. */
  #readMotions(): ReadonlyMap<string, MotionEntry> {
    return this.#open?.motions ?? this.#motions;
  }
  /**
   * The track map this commit will hand over, mutable, and copied once rather than once per op.
   *
   * Outside a recipe it is a copy of the retained map. Inside one it is the pair the recipe is
   * staging, made once by the first op that stages anything and written into in place by every op
   * after that, so n ops cost one copy. Why the copy outside a recipe is the floor rather than an
   * expense to remove is ADR-064's third amendment.
   *
   * Called after an entry point's last refusal and never before it, because a half that is still the
   * retained map by identity is the whole answer to whether the recipe staged anything. That
   * ordering rule is the same amendment's. See `RA-93` and `RA-95`.
   */
  #stageTracks(): Map<string, TrackEntry> {
    const open = this.#open;
    if (open === undefined) return new Map(this.#tracks);
    if (open.tracks === this.#tracks) open.tracks = new Map(this.#tracks);
    return open.tracks;
  }
  /** The same question about the other map, and the same reason. */
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
  /**
   * Attaches one member, and the one owner of mounting.
   *
   * Split from the public verb because a commit mounts too, for the reason ADR-064's amendment
   * records. The public member owns the contract, this owns the attach. See `RA-80`.
   */
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
  /**
   * The narrowed surface one recipe is handed, and a projection rather than a second author.
   *
   * Every member forwards to the member this class already has, so there is one owner of what an op
   * costs. The narrowing is a statement about what a recipe is handed and never one about what it
   * can reach, and every immediate verb refuses at itself instead, which is ADR-064's amendment.
   * `addMotion` resolves the handle it returns through `motion`, because the id is what the entry
   * point answers. See ADR-064.
   */
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
  /**
   * Which nodes read one node, and the one owner of that question.
   *
   * Read from `GraphIR.dependents`, never rederived, so it names both kinds of reader: the observer
   * of an edge, and a solver that reads this node as a chain member. Why an edge walk misses the
   * second, why two consumers share one mechanism, and why `#derive` calls neither `dependantsOf`
   * nor a parameter of its own are all ADR-051's amendment.
   *
   * Deduplicated and frozen here, so the public member has nothing left to do, and first occurrence
   * wins, which is the committed node order. See `RA-86`, `RA-87` and `RA-99`.
   */
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
  /**
   * Every readable track a motion owns, in commit order, and the one owner of that question.
   *
   * Three readers ask it: the count in the destroy refusal, and both `MotionHandle.definition` and
   * `MotionHandle.trackIds`. Each carried its own filter before, which is how a motion could report
   * `tracks: []` while owning three, and ADR-061 records why they share this one. The committed
   * snapshot was the fourth and is not, for ADR-064's third amendment's reason.
   *
   * It takes the map explicitly because a plan builder asks about the tracks it is about to commit
   * while a handle asks about the readable ones, and reading `#tracks` here would make that
   * difference invisible at the call site. See ADR-061.
   */
  #ownedBy(
    tracks: ReadonlyMap<string, TrackEntry>,
    motionId: string,
  ): readonly (readonly [string, TrackEntry])[] {
    return [...tracks.entries()].filter(([, entry]) => entry.motionId === motionId);
  }
  /**
   * The entry for a node id, or the refusal for an id this project never had. Separate from
   * `#liveEntry` below, which answers about a captured token rather than about an id, and both are
   * one lookup with one message rather than a copy per caller.
   */
  #entryOf(nodeId: string): TrackEntry {
    const entry = this.#readTracks().get(nodeId);
    if (!entry) throw new TypeError(`Unknown graph node "${nodeId}".`);
    return entry;
  }
  /**
   * The one place in this file that compares a captured token against the live one, generic over the
   * entry rather than over the map it came from because the comparison is the same question about
   * either. The two probes below are two names for two maps rather than two copies of the rule, which
   * `SH-7` measures as a count. See ADR-056 and ADR-061.
   */
  #liveOf<E extends { readonly token: number }>(
    entries: ReadonlyMap<string, E>,
    id: string,
    token: number,
  ): E | undefined {
    const entry = entries.get(id);
    return entry !== undefined && entry.token === token ? entry : undefined;
  }
  /**
   * The probe every `live` getter reads, so `TrackHandle.live` and every throwing member answer the
   * same question about the same handle.
   *
   * One comparison with two readers rather than a copy per member, which is ADR-056's. Asked of the
   * pending pair while a recipe is open, so a handle issued inside one is live for the rest of it and
   * never live after an abort. See ADR-056 and ADR-064.
   */
  #entryIfLive(id: string, token: number): TrackEntry | undefined {
    return this.#liveOf(this.#readTracks(), id, token);
  }
  /**
   * The resolver every handle member and every private mutation path goes through, so the contract
   * is uniform by construction rather than by four call sites agreeing. See ADR-056.
   */
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
  /**
   * This handle's motion id, once the handle is known to be live. Reading the id and refusing a
   * stale handle are the same call, so there is no order for a member to get wrong.
   */
  #liveId(motionId: string, token: number): string {
    return this.#liveMotion(motionId, token).definition.id;
  }
  /**
   * The Motion definition as it currently stands, tracks included, projected through `#ownedBy`
   * rather than answered from the entry, for the reason ADR-061 records. See ADR-061.
   */
  #motionDefinition(entry: MotionEntry): MotionDefinition {
    const id = entry.definition.id;
    return Object.freeze({
      ...entry.definition,
      tracks: this.#ownedBy(this.#readTracks(), id).map(([, owned]) => owned.track),
    });
  }
  /**
   * Destroys a Motion that owns no tracks, from the id or from a live handle.
   *
   * The refusal counts through `#ownedBy`, so it names the list `MotionHandle.trackIds` shows, and
   * inside a recipe it counts what that recipe staged: a Motion whose last track the same recipe
   * removed is destroyable in it.
   */
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
  /**
   * Refuses `verb` while a recipe is open, named at the verb rather than at the tier so the message
   * tells a caller which call to move out. See ADR-064.
   */
  #refuseInsideRecipe(verb: string): void {
    if (this.#open !== undefined) immediateInTransaction(verb);
  }
  /**
   * Installs a Motion's trigger, and reaches no node and no edge doing it.
   *
   * Tier 0, which is a claim about the mechanism rather than about the cost: `trigger` appears in no
   * `GraphNode`, so `#commit` is the wrong path rather than an expensive one, and `RA-33` measures
   * that as a `replaceGraph` call count. It is refused inside a recipe because an edit that reaches
   * the driver layer immediately cannot be undone by one that throws. See `RA-68`.
   *
   * The order is the whole contract, and ADR-061's amendment owns why: the recipe refusal, then
   * staleness, then `validateMotionTrigger`, which is the owner `addMotion` already asks, then the
   * redundant edit, then the seam, whose failure is reported verbatim, and the retained definition
   * last, once nothing that can refuse is left. See ADR-035 and ADR-061.
   */
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
  /**
   * Moves a Motion's stagger, which no driver reads.
   *
   * The same tier and the same order as the trigger above, with one difference: there is no contract
   * rule to ask, because the seam is where that refusal already lives and a copy here would be a
   * second owner of it. The seam is therefore asked before the retained definition moves, which is
   * what keeps a refused edit from being recorded as one.
   *
   * An unchanged value asks the seam nothing, and a cleared one leaves no key behind. See ADR-061.
   */
  #setStagger(id: string, token: number, stagger: number | undefined): void {
    this.#refuseInsideRecipe("setStagger");
    const entry = this.#liveMotion(id, token);
    const motionId = entry.definition.id;
    if (entry.definition.stagger === stagger) return;
    this.#setMotionStagger?.(motionId, stagger);
    this.#motions.set(motionId, { ...entry, definition: withStagger(entry.definition, stagger) });
  }
  /**
   * Every member resolves the entry before it reads an argument, which makes staleness the first
   * answer rather than a second one. `tryTrack` refuses here as well, for the reason ADR-061 records:
   * whether this handle is the live one at all is a different question from an id it cannot find.
   */
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
  /**
   * Drops one node from the pair, and names no hook. The eviction, the dispose and the Motion
   * deregistration are one settle step `#derive` owns, derived from the id being absent from the
   * committed pair. See ADR-064.
   */
  #removeTrack(id: string, token: number): void {
    this.#assertLive();
    this.#liveEntry(id, token);
    const tracks = this.#stageTracks();
    tracks.delete(id);
    this.#commit({ tracks });
  }
  /**
   * The registry's answer about one authored record, or nothing when no registry was injected.
   *
   * The diagnostics path is spelled exactly as `compileTrack` spells it, because the seam's second
   * parameter is a path rather than a node id. See ADR-062.
   */
  #resolve(nodeId: string, track: TrackDefinition): ResolvedPlugins | undefined {
    return this.#resolveKeyframes?.(track.keyframes ?? {}, `${nodeId}.keyframes`, {
      id: nodeId,
      duration: track.duration,
    });
  }
  /**
   * Whether a replacement has to build a new timeline, and the one place a candidate is resolved.
   *
   * The resolve is validation and is never skipped, and only the timeline build is skippable, which
   * is ADR-062's amendment: a predicate that skipped the resolve would delete a validator rather than
   * a cost. So the candidate is resolved here, refused here, and only then read as data. The retained
   * record is resolved beside it rather than kept anywhere, on the same record's reason.
   *
   * Asked from `#derive` rather than from `#replaceTrack`, which moves it from once per op to once
   * per committed replacement and leaves it exactly where it was for every caller outside a recipe.
   * What the answer is compared with is `sameCompiledTrackInput`'s question rather than this one's.
   * See ADR-062 and ADR-064.
   */
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
  /**
   * Replaces one node's definition in the pair, preserving its node id and its token.
   *
   * A map builder: the staging, the Motion republish and their reverts are `#derive`'s answer,
   * derived from the retained definition and the committed one. See `RA-65` and ADR-064.
   */
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
  /**
   * The one path by which a structural change reaches the graph, or the open transaction.
   *
   * While a recipe is open there is nothing to do here: every entry point already wrote into the
   * open pair, and `edit` is the one thing that applies it. With none open the pair is applied
   * immediately. See ADR-064.
   */
  #commit(plan: SchemaPlan): void {
    if (this.#open !== undefined) return;
    this.#apply(plan);
  }
  /**
   * Applies one accepted pair: derive, apply the effects, ask the graph, settle, and flush once.
   *
   * The one owner of an ordering three records make load-bearing: ADR-031 for the compiled map,
   * ADR-035 for rollback precedence, ADR-045 for republish-before-restore. `replaceGraph` and
   * `rejectAfterRollback` have one call site each, and so does every hook.
   *
   * The derivation runs before the try, so a candidate refused inside it costs no teardown at all.
   * The effects are applied inside it, so a hook that throws is rolled back exactly as a refused
   * candidate is, and each is recorded only after its `apply` returned.
   *
   * One flush ends it, seeded with `touched`, and it runs after the settle steps rather than before
   * them, because a new node is mounted by one of those steps. `replaceGraph` seeds nothing itself,
   * which is why `addObserve` on a manual clock with no tick used to be invisible forever. `RA-8`.
   *
   * An empty `touched` returns without calling `invalidate`, for the reason ADR-064's amendment
   * records. See `RA-10`.
   */
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
  /**
   * What one accepted pair costs, read against the retained pair.
   *
   * A hook list assembled by the entry point is correct for one change and cannot compose two,
   * which is the correction ADR-064 records and `RA-65` is the first case to tell apart.
   *
   * Four categories, each of them the hook set its own entry point used to name, unchanged: a
   * created Motion built before the graph is asked and destroyed if it refuses (ADR-032), a removed
   * track settling its eviction, dispose and deregistration as one step, a destroyed Motion
   * settling after that with nothing to revert, and an added or replaced track compiling before the
   * graph is asked and registering with its Motion after it accepted (ADR-031), with the staging
   * build skipped when the compiled input provably did not move (ADR-062).
   *
   * Motions are created before any track compiles, because one commit may add a Motion and a track
   * to it. Effects are reverted in apply order, so a replacement's staging rollback still runs
   * before its Motion entry is restored. See ADR-045 and ADR-064.
   */
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
      // Republish the displaced compiled Track before restoring Motion: its restore call resolves
      // and seeds by id, so the old instance must already be live. Reverts run in apply order,
      // which is what puts the staging rollback above ahead of this one. See ADR-031 and ADR-045.
      if (motionId !== undefined)
        effects.push({
          apply: () => this.#replaceMotionTrack?.(motionId, nodeId, next.duration),
          revert: () => this.#replaceMotionTrack?.(motionId, nodeId, previous.duration),
        });
      settle.push(() => staged?.commit());
      // The edited node, and only it. Every node whose incoming edge set moved is downstream of
      // this one, and the publisher walks dependents from the seed, so naming it is sufficient.
      // `addObserve` and `removeObserve` route through here, which is what makes them publish.
      touched.push(nodeId);
    }
    return { effects, settle, touched };
  }
  /**
   * Adopts the accepted pair, which is a pointer move rather than a rewrite.
   *
   * A named member rather than two lines inside `#apply`, because the ownership change is the thing
   * worth stating where the assignment is: the retained fields are not `readonly` and a plan builder
   * may not keep what it handed over. What the rewrite this replaced cost, and which hazard the
   * read-out existed for, are ADR-064's third amendment. See `RA-92` and `RA-97`.
   */
  #adoptMaps(tracks: Map<string, TrackEntry>, motions: Map<string, MotionEntry>): void {
    this.#tracks = tracks;
    this.#motions = motions;
  }
  /**
   * The one live-value write path.
   *
   * `rebase` is the only difference between the two entry points: an override leaves the retained
   * definition alone and a `setValues` rewrites it, and the same boolean is what makes the animated
   * half sticky or revertible at the interpolator. Which keys are legal, what the live Track is
   * written with, when the graph is invalidated, and where the diagnostics go are all shared, so the
   * two cannot answer differently, invalidate twice, or record in two places. It is also what names
   * the verb in the recipe refusal, so the two entry points refuse under their own names without a
   * second guard.
   *
   * Tier 2, and refused inside a recipe for the reason tier 0 is: it ends at its own `invalidate`,
   * so it publishes inside the recipe and would survive an abort. See `RA-68` and ADR-064.
   *
   * Order, and it is load-bearing. Validate the rewritten definition when an animated key is named,
   * because an authored stop list is definition-shaped input and `validateKeyframes` owns its shape.
   * Then write through the one hook, which is where every key is classified and refused, so a
   * refusal throws from the layer holding the resolved plugins with nothing written here. Then
   * rewrite the retained entry and its overlay, escalate if the hook declined, and end at one
   * `invalidate`. Nothing can observe the gap, because no flush happens until that invalidate.
   *
   * Not a `#commit` caller, and it must not become one: topology did not change, so there is no
   * candidate graph to accept and nothing to roll back. It reaches the same `invalidate` a commit
   * now ends at, from the other tier, which is the one thing the two paths have ever shared.
   *
   * A static-only write validates nothing and builds nothing, which keeps its cost exactly what it
   * was. No `replaceGraph` on either path. See ADR-059 and ADR-060.
   */
  #writeValues(nodeId: string, entry: TrackEntry, values: AuthoredValues, rebase: boolean) {
    this.#refuseInsideRecipe(rebase ? "setValues" : "overrideValues");
    const { statics, animated } = splitAuthoredValues(values);
    // An animated key is involved when this call names one, and also when the last one did: a
    // revert names no key at all, so the retained overlay is what keeps `overrideValues({})` from
    // being read as a static-only write that leaves a patched timeline patched.
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
    // The escalation, and it is neither `#replaceTrack` nor `replaceGraph`. Topology did not change,
    // and the compiled definition is allowed to differ from the retained one, which is what an
    // override already is. A fresh Track starts at progress 0 and nothing in this path re-seeks, so
    // the one line that restores it is here, in the only path that escalates, rather than bolted on
    // top of a path that resets it. See ADR-060.
    if (written !== undefined && !written.patched) {
      this.#stageTrack?.(rewritten, nodeId)?.commit();
      this.#setProgress(nodeId, written.progress);
    }
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  /**
   * The bound-group precondition every authored edit shares, and the one owner of it.
   *
   * A plugin this node authors no group for is `keyframe-group-unbound`, which is
   * `setKeyframeGroup`'s job in the structural tier and is what buys the cheap price in the
   * value tier: a bound group's plugin is already in the chain, so a leaf added to it can
   * neither add a composer nor move one. A name this node authors as an ordinary property is
   * not a group either, and that is `readBoundGroup`'s answer rather than a second shape check
   * here.
   *
   * It answers with the record beside the group, so no caller re-reads `entry.track.keyframes`
   * after the refusal has already proved it is there. See ADR-062 and ADR-063.
   */
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
  /** One value-tier flush, shared by authored-property recompiles and no-ops. */
  #invalidateOne(nodeId: string) {
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  /**
   * Recompiles one edited authored record in place, preserving this node's playhead.
   *
   * Validation and the registry resolve both run before the live Track is touched. The read through
   * `writeValues` then supplies the progress the existing Track owns, and the staged replacement is
   * re-seeked after it becomes live. No graph operation is involved because a leaf carries no edge.
   */
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
  /**
   * Edits one property of a plugin group this node already authors.
   *
   * An existing leaf goes through the live-write owner, preserving its per-key refusal ordering. A
   * new or removed leaf cannot be expressed as a mask, so the authored candidate is validated,
   * resolved, and recompiled in place instead. The bound-group precondition keeps every path in the
   * value tier: the plugin is already in the chain and no edge can move.
   */
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
    // Idempotent observation semantics, not a stale guard. Adding an edge that is already declared
    // and removing one that is not are both no-ops on a live handle, which is a different question
    // from whether the handle is the live one at all: that was answered above. Nothing is committed
    // on either no-op, so nothing is flushed either, and inside a recipe nothing is staged, which is
    // what lets a recipe of nothing but no-ops end without a candidate build. See `RA-66`.
    if (add) {
      if (index >= 0) return;
      observations.push(observation);
    } else {
      if (index < 0) return;
      observations.splice(index, 1);
    }
    this.#replaceTrack(id, token, { ...entry.track, observes: observations });
  }
  /**
   * One binding edit on an already-bound plugin, and the one owner of the order all four binding
   * verbs follow.
   *
   * Staleness first, through the resolver every member of the handle reads. Then the unbound-group
   * refusal, which is answered from the retained record on this node and is a different question
   * from anything the registry answers about a candidate. Then the edit, which is where a slot the
   * caller named is checked against the one reservation this surface has and where the pure editor
   * that knows the group layout runs. Then the redundant edit, by identity, because the pure layer
   * returns the record it was given when nothing changed and comparing anything else would be a
   * second opinion about whether an edit happened. Then the commit.
   *
   * The goals-slot reservation sits inside the edit rather than ahead of it, and that order is the
   * honest one: it answers about a slot of a group this node authors, so the group has to exist for
   * the question to be about anything at all. A `setRequire` at that slot on a node authoring no
   * such group is `keyframe-group-unbound`, which names the primitive that would originate one.
   *
   * `#replaceTrack` rather than a plan of its own, for the reason `#replaceWithObservation` already
   * routes there: a binding edit is a candidate the graph accepts or refuses, which is exactly the
   * transaction `#commit` owns, and a sixth copy of that ordering is what A1 deleted. What this
   * primitive is not is `replace()` at the call site, where a caller hands in a whole definition and
   * has to have decided every other field of it already.
   *
   * So the price is one candidate build, one edge delta and one flush, and there is no fast lane
   * missing: a binding adds, removes or redirects a `GraphEdge`, which is the boundary the value tier
   * is forbidden to cross. What it no longer pays is the timeline build on the far side of that
   * boundary, because a binding edit changes no compiled property; the resolve it does pay is the
   * validation rather than an expense, because `compileTrack` reuses a live entry and never asks the
   * registry. Inside a recipe it is structural, so it travels with the transaction and costs its
   * share of one commit. See ADR-045, ADR-062 and ADR-064.
   */
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
  /**
   * Binds one entry of a solver's goals slot, addressed by the member id it is authored under.
   *
   * The same tier, the same owner of order and the same pure editor as `setRequire`, with the slot
   * fixed rather than named. That is the whole of what the verb buys: the caller cannot reach the
   * scalar spelling of the slot, which the loader refuses as `keyframes-targets-shape`, and one slot
   * has one verb rather than two that would have to stay in agreement. No editor of its own, because
   * a dict entry is a dict entry and `setRequire` already owns what one is. See ADR-057 and ADR-063.
   *
   * Whether the member id names a leaf of this solver's chain, whether two spellings name one
   * member, and whether the solver also bound the bare goal slot are all `resolveSolvers`' questions.
   * They arrive from the candidate graph and roll the commit back, rather than being asked here,
   * because a per-primitive copy of them is a second owner that can disagree with the loader.
   */
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
  /**
   * One whole-group edit, and the one owner of the order both group verbs follow.
   *
   * Staleness first, through the resolver every member of the handle reads. Then the property-entry
   * refusal, which is answered from the retained record on this node and is the only thing about a
   * group edit that no other layer can see: a plugin name and a keyframe name share one namespace,
   * so writing a group over an authored property would drop every stop the author wrote and removing
   * one would delete a property the caller never named. Then the pure edit, which is the only thing
   * that knows the group layout and which refuses `keyframe-group-shape` rather than committing a
   * husk. Then the redundant edit, by identity. Then the commit.
   *
   * An absent record reads as one frozen empty one, which is what lets `setKeyframeGroup` originate
   * on a track that authors nothing with no branch here, and lets `removeKeyframeGroup` answer by
   * identity on it rather than committing an empty record on the way to removing nothing.
   *
   * No registry question is asked and none is missing: whether the plugin exists, whether it claims
   * each leaf of the group's `values`, and whether it declares each bound slot all arrive from
   * `PluginRegistry` at the resolve this commit pays, which is where a candidate is validated
   * rather than where an expense is incurred. See ADR-062.
   */
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
  /**
   * Writes an edited authored record back onto `track` and commits it as a replacement.
   *
   * The one owner of what an authored edit leaves behind, so the six verbs in this tier cannot
   * disagree about it. A record that ends up holding nothing loses the key rather than being
   * committed as `{}`, on the rule the pure layer already follows two levels down: omitting a slot is
   * how a section binds nothing, omitting the section is how a group binds nothing, and omitting
   * `keyframes` is how a track authors nothing. An edit may not leave behind a shape that is legal
   * only because nothing refuses it. See ADR-063.
   */
  #writeKeyframes(
    id: string,
    token: number,
    track: TrackDefinition,
    keyframes: AuthoredKeyframes,
  ): void {
    this.#replaceTrack(id, token, withKeyframes(track, keyframes));
  }
  /**
   * The committed pair as one authored document, walked once.
   *
   * One walk, bucketed by the owner each entry already names, with the free tracks falling out of
   * the same pass. A bucket fills in map order, so each motion's list is the list a per-motion filter
   * produced, and a motion that owns nothing answers with an empty list rather than with no key.
   * What asking `#ownedBy` per motion used to cost, and why this is not a second derivation of the
   * fact that member owns, are both ADR-064's third amendment. See `RA-89` and `RA-91`.
   *
   * Every untouched entry's definition is handed through by identity, for ADR-058's reason.
   * See `RA-90` and ADR-058.
   */
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
