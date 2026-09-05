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
import { readPluginValues } from "../contract/keyframe-shape";
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
  commitInFlight,
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
  /**
   * Whether a live value write is in force on this node's compiled `Track`.
   *
   * The compiled Track carries a mask, a patched timeline, or both, and the retained definition may
   * not say so: that gap is what an override is. A fresh Track is built from a definition and
   * carries neither, so the timeline build is what dropped a write, and it was the only thing that
   * did. C3 made that build conditional, so the four binding verbs stopped dropping one, and this
   * is the fact the predicate reads to keep paying for it. See ADR-066.
   *
   * Recorded from the write being asked for rather than from what the backend answered, which is
   * the conservative direction the predicate already commits to: a write that reached no compiled
   * Track costs one build it does not strictly need, and nothing can under-report.
   */
  liveWrite: boolean;
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
  #inFlight = 0;
  #pendingTeardown = false;
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
          liveWrite: false,
        });
    }
    for (const track of project.freeTracks ?? [])
      this.#tracks.set(qualifyFreeTrack(track.id).value, {
        track,
        owner: this.#schemaOwner,
        token: this.#nextToken++,
        overlay: NO_OVERLAY,
        liveWrite: false,
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
    // Seeds no flush, deliberately, and measured where the reason is written. A member arrives here
    // and nothing publishes, which looks like the asymmetry A2 left behind: a node mounted by a
    // commit is seeded by `#apply` and a node mounted by a caller is seeded by nobody. A seed here
    // was drafted, implemented and refused on three measurements. `T-1` owns the asymmetry as real
    // rather than pending, `trigger-time` owns that a time Motion does not emit before its first
    // tick and a mount precedes every tick, and `PatchRegistry.publish` drops a candidate through
    // `samePatch`, so this flush would not add a publication but take the next one: the `seek` that
    // follows would publish nothing and hand its caller an empty batch. Run 33712936651 is the 21
    // cases that says so, `RA-8` among them. See `RA-100`, `RA-101` and ADR-066.
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
   *
   * A recipe that disposed the runtime is answered with its own value and commits nothing. The
   * liveness this member asserts on entry is stale by the time it decides to apply, because the
   * recipe is allowed to invalidate it and ADR-064's amendment says so deliberately. See `RA-109`,
   * `RA-110` and ADR-064's amendment of 2026-09-04.
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
    // The liveness asserted on entry is stale here. ADR-064's amendment leaves `dispose` reachable
    // from inside a recipe, on the reason that teardown has to be reachable from a `catch`, so a
    // precondition asked before the callback is not one on what follows it. Answered rather than
    // refused, because a recipe that tore the project down from its own `catch` would lose its
    // answer to a refusal about the teardown, and a disposed runtime has cleared its retained pair
    // and disposed its graph, so there is nothing left for the staged pair to be committed to.
    if (this.#disposed) return answer;
    if (open.tracks !== this.#tracks || open.motions !== this.#motions)
      this.#commit({ tracks: open.tracks, motions: open.motions });
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
    const readers: readonly string[] | undefined = this.#graph.graph.dependants[nodeId];
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
    tracks.set(id, {
      track: accepted,
      owner,
      motionId,
      token,
      overlay: NO_OVERLAY,
      liveWrite: false,
    });
    // A map builder and nothing else. That the compile runs before the graph is asked, that the
    // Motion entry is written after it because Motion resolves by id against the live compiled map,
    // and that the mount settles last are all `#derive`'s answer now, derived from the fact that
    // this id is absent from the retained pair. That is also what makes an add-then-remove inside
    // one recipe cost nothing at all rather than mounting a node the committed graph lacks.
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
    // A disposed runtime has no live entry, stated here rather than left to the fact that the
    // teardown empties both maps. Those two stopped being simultaneous when the teardown became
    // deferrable past a commit, and a handle answering `live` inside that window would be reporting
    // a project whose `dispose()` has already returned. Not a throw, so the reading ladder above is
    // untouched. See ADR-064's amendment of 2026-09-05 and `RA-116`.
    if (this.#disposed) return undefined;
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

  #liveChildNode(motionId: string, token: number, trackId: string): string {
    // Resolved into a local before the child name is qualified, so this order is stated here
    // rather than left to how a call site happens to nest the two expressions. See ADR-056.
    const owner = this.#liveId(motionId, token);
    return qualifyMotionTrack(owner, trackId).value;
  }

  #writableEntry(id: string, token: number): TrackEntry {
    this.#assertLive();
    return this.#liveEntry(id, token);
  }

  #writableMotion(id: string, token: number): MotionEntry {
    this.#assertLive();
    return this.#liveMotion(id, token);
  }

  #writableId(motionId: string, token: number): string {
    return this.#writableMotion(motionId, token).definition.id;
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
    this.#boundary(() => {
      const entry = this.#writableMotion(id, token);
      const motionId = entry.definition.id;
      const diagnostics = validateMotionTrigger(trigger, `setTrigger(${motionId}).trigger`);
      if (diagnostics.some(({ severity }) => severity === "error"))
        throw new TypeError(describeDiagnostics(diagnostics));
      if (sameTrigger(entry.definition.trigger, trigger)) return;
      const definition = Object.freeze({ ...entry.definition, trigger });
      this.#replaceMotionTrigger?.(motionId, this.#motionDefinition({ ...entry, definition }));
      this.#motions.set(motionId, { ...entry, definition });
      // No flush on this tier, so the report has nowhere else to live. Asked last rather than
      // between the seam and the write, for the same reason the write itself completes: a refusal in
      // the middle leaves the driver layer holding a trigger no retained definition names. Tier 2's
      // `#invalidateOne` answers the same condition with the same string. See ADR-069.
      this.#assertLive();
    });
  }

  #setStagger(id: string, token: number, stagger: number | undefined): void {
    this.#refuseInsideRecipe("setStagger");
    this.#boundary(() => {
      const entry = this.#writableMotion(id, token);
      const motionId = entry.definition.id;
      if (entry.definition.stagger === stagger) return;
      this.#setMotionStagger?.(motionId, stagger);
      this.#motions.set(motionId, {
        ...entry,
        definition: withStagger(entry.definition, stagger),
      });
      this.#assertLive();
    });
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
        runtime.#addTrack(track, runtime.#schemaOwner, {
          motionId: runtime.#writableId(id, token),
        }),
      track: (trackId: string) => runtime.track(runtime.#liveChildNode(id, token, trackId)),
      tryTrack: (trackId: string) => runtime.tryTrack(runtime.#liveChildNode(id, token, trackId)),
      setTrigger: (next: MotionDefinition["trigger"]) => runtime.#setTrigger(id, token, next),
      setStagger: (stagger?: number) => runtime.#setStagger(id, token, stagger),
      destroy: () => runtime.#removeMotion(runtime.#writableId(id, token)),
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
        runtime.#writeValues(id, runtime.#writableEntry(id, token), next, false),
      setValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, runtime.#writableEntry(id, token), next, true),
    });
  }

  #removeTrack(id: string, token: number): void {
    this.#writableEntry(id, token);
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
    const entry = this.#writableEntry(id, token);
    const expected =
      entry.motionId !== undefined
        ? qualifyMotionTrack(entry.motionId, next.id).value
        : qualifyFreeTrack(next.id).value;
    if (expected !== id) throw new TypeError(`Replacement must preserve node id "${id}".`);
    const validation = validateTrackDefinition(next, `replaceTrack(${id})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const tracks = this.#stageTracks();
    // No overlay and no live write, which is the same claim at two levels: a replacement builds a
    // fresh Track, and the predicate above is what keeps that true when the compiled input did not
    // move. See ADR-066.
    tracks.set(id, {
      ...entry,
      track: validation.value,
      overlay: NO_OVERLAY,
      liveWrite: false,
    });
    this.#commit({ tracks });
  }

  #commit(plan: SchemaPlan): void {
    if (this.#open !== undefined) return;
    // Read after the recipe check and never before it, so a recipe opened from inside a hook stages
    // as usual and is refused once, at the moment it would apply, by the one owner of this refusal.
    if (this.#inFlight > 0) commitInFlight();
    this.#apply(plan);
  }

  #boundary<T>(body: () => T): T {
    this.#inFlight++;
    try {
      return body();
    } finally {
      this.#inFlight--;
      if (this.#inFlight === 0 && this.#pendingTeardown) this.#teardown();
    }
  }

  #apply(plan: SchemaPlan): void {
    // An absent half resolves to the map this class already holds, so the adoption assigns it back
    // to itself. Read directly rather than through the accessors: a recipe is never open here.
    const tracks = plan.tracks ?? this.#tracks;
    const motions = plan.motions ?? this.#motions;
    // Raised ahead of the derivation rather than ahead of the effect loop, because `#derive` asks
    // `resolveKeyframes`, which is caller code and can dispose from there too. The raise, the
    // decrement and the drain are `#boundary`'s rather than this member's: four direct writes need
    // the same three statements, and an ordering enforced at five call sites is enforced at the
    // first of them. See ADR-064's amendment of 2026-09-05 and ADR-069.
    this.#boundary(() => {
      const commit = this.#derive(tracks, motions);
      // Nothing has been applied yet, so a disposal asked for during the derivation refuses with
      // nothing to roll back.
      this.#assertLive();
      const applied: SchemaEffect[] = [];
      try {
        for (const effect of commit.effects) {
          effect.apply();
          applied.push(effect);
          // Re-asked after every hook, because every one of them is caller code and a precondition
          // asserted before a callback is not a precondition on what follows it. The teardown is
          // deferred to this member's `finally`, so the rollback below still hands a live graph and
          // a live composition the inverse of what these effects just built. That is the whole
          // reason the deferral exists. See `RA-114`.
          this.#assertLive();
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
      // Deliberately unguarded, unlike the loop above. A settle step has no revert because it is not
      // allowed to fail, so abandoning this phase halfway leaves a staged Track neither committed
      // nor rolled back and a Motion registered against a node that never mounted. The teardown
      // follows this phase rather than interrupting it. See `RA-117`.
      for (const step of commit.settle) step();
      // The flush is the one thing a disposal skips rather than completes, on the same reason an
      // empty seed set is skipped: a batch nobody can read still opens, moves the sequence and
      // drains whatever a deferred flush was holding. See ADR-064's amendments of 2026-09-03 and
      // 2026-09-05, and `RA-10`.
      if (this.#disposed || commit.touched.length === 0) return;
      const batch = this.#graph.invalidate(commit.touched);
      this.#diagnostics.recordAll(batch.diagnostics);
    });
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
      // The resolve is asked unconditionally and the build additionally runs when a live write is
      // in force, and that order is the whole correctness of it. Spelled
      // `retained.liveWrite || needsBuild` it short-circuits, so the resolve never runs, and the
      // resolve is the only place a registry sees an already-compiled node's candidate: skipping it
      // deletes a validator rather than a cost, which is the defect C1 refused to ship. The build
      // is also the only thing that dropped a live value write, so it is paid for that too rather
      // than leaving an override the documentation says is gone. See `RA-103`, `RA-105`, ADR-066.
      const needsBuild = this.#needsTimelineBuild(nodeId, previous, next);
      if (needsBuild || retained.liveWrite)
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
      // The edited node, and only it: the publisher walks dependants from the seed, so naming it is
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
    // The refusal stays outside the boundary, because a refused call is not inside a callback and
    // has nothing to survive. See ADR-069.
    return this.#boundary(() => {
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
        // In force from here until something builds a fresh Track for this node. See ADR-066.
        liveWrite: true,
      });
      // The escalation, and it is neither `#replaceTrack` nor `replaceGraph`: topology did not change
      // and the compiled definition is allowed to differ from the retained one. The re-seek is here
      // because this is the only path that escalates. See ADR-060.
      if (written !== undefined && !written.patched) {
        this.#stageTrack?.(rewritten, nodeId)?.commit();
        this.#setProgress(nodeId, written.progress);
      }
      return this.#invalidateOne(nodeId);
    });
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
    this.#assertLive();
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
    return this.#boundary(() => {
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
      this.#tracks.set(nodeId, {
        ...entry,
        track: accepted,
        overlay: NO_OVERLAY,
        liveWrite: false,
      });
      staged?.commit();
      if (written !== undefined) this.#setProgress(nodeId, written.progress);
      return this.#invalidateOne(nodeId);
    });
  }

  #setKeyframe(
    nodeId: string,
    token: number,
    plugin: string,
    key: string,
    value: AuthoredProperty,
  ) {
    const entry = this.#writableEntry(nodeId, token);
    this.#refuseInsideRecipe("setKeyframe");
    const { keyframes, bound } = this.#boundGroup(nodeId, entry, plugin);
    // Asked through the one reader of the section rather than off the field, so this path and the
    // pure editor cannot disagree about what the group authors. See `RA-106` and issue #255.
    if (Object.hasOwn(readPluginValues(bound.group), key))
      return this.#writeValues(nodeId, entry, { [key]: value }, true);
    const edited = setAuthoredKeyframe(keyframes, bound, key, value);
    return this.#recompileKeyframes(nodeId, entry, edited, "setKeyframe");
  }
  #removeKeyframe(nodeId: string, token: number, plugin: string, key: string) {
    const entry = this.#writableEntry(nodeId, token);
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
    const entry = this.#writableEntry(id, token);
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
    const entry = this.#writableEntry(id, token);
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
    const entry = this.#writableEntry(id, token);
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
  /**
   * Tears this project down, once, and refuses everything from the moment it is called.
   *
   * Reachable from caller code that this runtime is in the middle of calling, which is why the
   * refusal and the release are two things rather than one. See ADR-064's amendment of 2026-09-05.
   */
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    // Deferred rather than refused, and answered rather than ignored. A composition hook reaches
    // this member from inside the commit it is part of, and releasing the graph and the composition
    // here would hand that commit's rollback the inverse of effects it can no longer apply. Every
    // member refuses from the line above onward, and `#apply`'s `finally` releases exactly once.
    if (this.#inFlight > 0) {
      this.#pendingTeardown = true;
      return;
    }
    this.#teardown();
  }

  #teardown(): void {
    this.#pendingTeardown = false;
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
