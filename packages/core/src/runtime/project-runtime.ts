// Docs: ./project-runtime.md
import type {
  AuthoredPluginGroup,
  AuthoredProperty,
  ObservationDefinition,
  PatchBatch,
  ProjectDefinition,
  TrackDefinition,
  MotionDefinition,
  TriggerSignal,
} from "../contract/v5";
import { readPluginValues } from "../contract/keyframe-shape";
import type { MotionHandle } from "../contract/motion-handle";
import type { SchemaTransaction } from "../contract/schema-transaction";
import type { ValueTransaction } from "../contract/value-transaction";
import type {
  AuthoredValues,
  LiveValues,
  RequireView,
  TrackHandle,
} from "../contract/track-handle";
import { validateMotionTrigger, validateTrackDefinition } from "../contract/validate-v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import type { LiveWriteResult } from "../domain/track";
import type { ResolvedPlugins, TrackConfigView } from "../domain/plugins";
import {
  removeKeyframe as removeAuthoredKeyframe,
  setKeyframe as setAuthoredKeyframe,
  type AuthoredKeyframes,
} from "../domain/authoring/keyframes";
import { sameCompiledTrackInput } from "../domain/authoring/recompile";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import { describeError } from "./schema-refusals";
import {
  COMMIT,
  OPEN_RECIPE,
  READ,
  admitOrRefuse,
  batchClosing,
  batchOpening,
  closing,
  entering,
  idle,
  immediateVerb,
  isRetiring,
  leaving,
  opening,
  retired,
  retiring,
  seeding,
  seedsIn,
  stagedIn,
  teardownOwed,
  valueVerb,
  type ProjectPhase,
  type VerbClass,
} from "./project-phase";
import { collect, report, runSettleSteps } from "./rollback";
import { planCommit } from "./commit-plan";
import { runPlan } from "./run-plan";
import { refuse } from "./refusal";
import {
  expectLive,
  expectValid,
  isLive,
  resolveToken,
  stale,
  validated,
  type Resolved,
} from "./results";
import { deferredValueBatch, emptyValueBatch } from "./value-batch";
import { AUTHORED, isOverlaid, liveWritten, type ValueState } from "./value-state";
import { applyEdit, boundGroup, type AuthoringEdit } from "./authoring-edit";
import {
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
  motionId?: string;
  token: number;
  valueState: ValueState;
};

type MotionEntry = {
  definition: MotionDefinition;
  token: number;
};
/**
 * A replacement already installed by the staging seam, with its displaced Track held for rollback.
 *
 * Before commit starts, rollback restores the displaced Track and releases the replacement.
 * Commit finalizes adoption and releases the displaced Track; that release can throw after the
 * replacement became irreversible. A throwing commit is not a promise that rollback can restore
 * a usable old Track. The staging seam owns cleanup if it throws before returning this handle.
 */
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}

interface OpenTransaction {
  tracks: Map<string, TrackEntry>;
  motions: Map<string, MotionEntry>;
}

interface StagedPair {
  readonly tracks?: Map<string, TrackEntry>;
  readonly motions?: Map<string, MotionEntry>;
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
   *
   * Returning means acceptance; an optional completion runs only after definition adoption.
   * Throwing before return means refusal and the supplier owns cleanup. Post-acceptance cleanup
   * or re-seeding failures are reported without restoring a stale definition. Issues #340/#341.
   */
  readonly replaceMotionTrigger?: (
    motionId: string,
    definition: MotionDefinition,
  ) => void | (() => void);
  readonly setMotionStagger?: (motionId: string, stagger?: number) => void | (() => void);
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
  #nextToken = 1;

  #phase: ProjectPhase<OpenTransaction> = idle();
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
  readonly #replaceMotionTrigger: ProjectRuntimeOptions["replaceMotionTrigger"];
  readonly #setMotionStagger: ProjectRuntimeOptions["setMotionStagger"];
  readonly #signalMotion: ((motionId: string, signal: TriggerSignal) => void) | undefined;
  readonly #createMotion: ((definition: MotionDefinition) => void) | undefined;
  readonly #destroyMotion: ((motionId: string) => void) | undefined;
  readonly #disposeComposition: () => void;
  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    for (const motion of project.motions) {
      this.#motions.set(motion.id, { definition: motion, token: this.#nextToken++ });
      for (const track of motion.tracks)
        this.#tracks.set(qualifyMotionTrack(motion.id, track.id).value, {
          track,
          motionId: motion.id,
          token: this.#nextToken++,
          valueState: AUTHORED,
        });
    }
    for (const track of project.freeTracks ?? [])
      this.#tracks.set(qualifyFreeTrack(track.id).value, {
        track,
        token: this.#nextToken++,
        valueState: AUTHORED,
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
    return stagedIn(this.#phase)?.tracks ?? this.#tracks;
  }

  #readMotions(): ReadonlyMap<string, MotionEntry> {
    return stagedIn(this.#phase)?.motions ?? this.#motions;
  }

  #stageTracks(): Map<string, TrackEntry> {
    const open = stagedIn(this.#phase);
    if (open === undefined) return new Map(this.#tracks);
    if (open.tracks === this.#tracks) open.tracks = new Map(this.#tracks);
    return open.tracks;
  }

  #stageMotions(): Map<string, MotionEntry> {
    const open = stagedIn(this.#phase);
    if (open === undefined) return new Map(this.#motions);
    if (open.motions === this.#motions) open.motions = new Map(this.#motions);
    return open.motions;
  }
  mount(nodeId: string, instance: object = {}): object {
    this.#admit(immediateVerb("mount", "asserted"));
    return this.#mountNode(nodeId, instance);
  }

  #mountNode(nodeId: string, instance: object = {}): object {
    if (this.#instances.has(nodeId)) throw new TypeError(`Node "${nodeId}" is already mounted.`);
    this.#graph.attach(nodeId);
    this.#instances.set(nodeId, instance);
    return instance;
  }
  unmount(nodeId: string): void {
    this.#admit(immediateVerb("unmount", "asserted"));
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
    this.#admit(OPEN_RECIPE);
    const open: OpenTransaction = { tracks: this.#tracks, motions: this.#motions };
    this.#phase = opening(this.#phase, open);
    let answer: T;
    try {
      answer = recipe(this.#transaction());
    } finally {
      this.#phase = closing(this.#phase);
    }
    if (isRetiring(this.#phase)) return answer;
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
      refuse({ kind: "invalid-definition", diagnostics: triggerDiagnostics });
    if (definition.tracks.length > 0)
      throw new TypeError(`Runtime Motion "${definition.id}" must start with empty tracks.`);
    if (this.#readMotions().has(definition.id))
      throw new TypeError(`Motion "${definition.id}" already exists.`);
    const accepted = { ...definition, tracks: [] };
    const motions = this.#stageMotions();
    motions.set(accepted.id, { definition: accepted, token: this.#nextToken++ });
    this.#commit({ motions });
    return Object.freeze({ id: accepted.id });
  }
  destroyMotion(motionId: string): void {
    this.#assertLive();
    if (!this.#readMotions().has(motionId)) refuse({ kind: "unknown-motion", motionId });
    this.#removeMotion(motionId);
  }
  /**
   * Hands one signal to the layer that owns this Motion's trigger.
   *
   * Tier 0's twin, refused inside a recipe on the rule every immediate verb shares, and the hook
   * keeps its own refusal for an unknown motion id. See ADR-064's amendment.
   */
  signal(motionId: string, signal: TriggerSignal): void {
    this.#admit(immediateVerb("signal", "asserted"));
    this.#signalMotion?.(motionId, signal);
  }
  /**
   * The resolver for one Motion, refusing an id this project never had. Separate from `tryMotion`
   * for the reason `#entryOf` is separate from `#entryIfLive`: this one refuses and that one answers.
   */
  motion(motionId: string): MotionHandle {
    this.#admit(READ);
    const entry = this.#readMotions().get(motionId);
    if (!entry) refuse({ kind: "unknown-motion", motionId });
    return this.#motionHandle(motionId, entry.token);
  }
  tryMotion(motionId: string): MotionHandle | undefined {
    this.#admit(READ);
    const entry = this.#readMotions().get(motionId);
    return entry === undefined ? undefined : this.#motionHandle(motionId, entry.token);
  }
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle {
    return this.#addTrack(track, options);
  }
  track(nodeId: string): TrackHandle {
    this.#admit(READ);
    const entry = this.#entryOf(nodeId);
    return this.#handle(nodeId, entry.token);
  }
  tryTrack(nodeId: string): TrackHandle | undefined {
    this.#admit(READ);
    const entry = this.#readTracks().get(nodeId);
    return entry === undefined ? undefined : this.#handle(nodeId, entry.token);
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
    this.#admit(READ);
    return this.#readersOf(nodeId);
  }

  #readersOf(nodeId: string): readonly string[] {
    const readers: readonly string[] | undefined = this.#graph.graph.dependants[nodeId];
    return Object.freeze(readers === undefined ? [] : [...new Set(readers)]);
  }
  /**
   * Every Motion id this project holds, in committed order.
   *
   * The first of three enumeration readers, and one contract covers all three. Total, frozen, and
   * in the order the committed maps carry, answered through the same accessors every structural
   * read uses: inside an open recipe a reader sees what that recipe staged, and inside a commit's
   * own hook it sees the retained pair the rest of that hook sees. Live-gated exactly as
   * `dependantsOf` is and refused on nothing else, because a read publishes nothing and mounts
   * nothing, so it cannot be placed in front of an owning operation's publication.
   *
   * They exist so no consumer keeps a second copy of the document's ids beside it. Widening
   * `SchemaTransaction` with them was declined: a recipe closes over this project already, so a
   * second spelling of one read would be two owners for it. See ADR-064 and issue #362.
   */
  motionIds(): readonly string[] {
    this.#admit(READ);
    return Object.freeze([...this.#readMotions().keys()]);
  }
  /**
   * Every track node id no Motion owns, which is the unowned half of the one ownership filter
   * `MotionHandle.trackIds` already reads, so the two cannot disagree about committed order.
   */
  freeTrackIds(): readonly string[] {
    this.#admit(READ);
    return Object.freeze(this.#ownedBy(this.#readTracks(), undefined).map(([node]) => node));
  }
  /**
   * Every node mounted right now, which no staged pair carries: `mount`, `unmount` and a commit's
   * own settlement are what move it.
   */
  mountedNodeIds(): readonly string[] {
    this.#admit(READ);
    return Object.freeze([...this.#instances.keys()]);
  }
  #addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle {
    this.#assertLive();
    const motionId = options?.motionId;
    if (motionId !== undefined && !this.#readMotions().has(motionId))
      refuse({ kind: "unknown-motion", motionId });
    const id =
      motionId !== undefined
        ? qualifyMotionTrack(motionId, track.id).value
        : qualifyFreeTrack(track.id).value;
    if (this.#readTracks().has(id)) throw new TypeError(`Track "${id}" already exists.`);
    const accepted = expectValid(
      validated(validateTrackDefinition(track, `addTrack(${track.id})`)),
    );
    const token = this.#nextToken++;
    const tracks = this.#stageTracks();
    tracks.set(id, {
      track: accepted,
      motionId,
      token,
      valueState: AUTHORED,
    });
    this.#commit({ tracks });
    return this.#handle(id, token);
  }

  #ownedBy(
    tracks: ReadonlyMap<string, TrackEntry>,
    motionId: string | undefined,
  ): readonly (readonly [string, TrackEntry])[] {
    return [...tracks.entries()].filter(([, entry]) => entry.motionId === motionId);
  }

  #entryOf(nodeId: string): TrackEntry {
    const entry = this.#readTracks().get(nodeId);
    if (!entry) refuse({ kind: "unknown-node", nodeId });
    return entry;
  }

  #liveOf<E extends { readonly token: number }>(
    entries: ReadonlyMap<string, E>,
    id: string,
    token: number,
  ): Resolved<E> {
    if (isRetiring(this.#phase)) return stale();
    return resolveToken(entries, id, token);
  }

  #entryIfLive(id: string, token: number): Resolved<TrackEntry> {
    return this.#liveOf(this.#readTracks(), id, token);
  }

  #liveEntry(id: string, token: number): TrackEntry {
    return expectLive(this.#entryIfLive(id, token), { kind: "track", id });
  }
  #motionIfLive(id: string, token: number): Resolved<MotionEntry> {
    return this.#liveOf(this.#readMotions(), id, token);
  }
  #liveMotion(id: string, token: number): MotionEntry {
    return expectLive(this.#motionIfLive(id, token), { kind: "motion", id });
  }

  #liveId(motionId: string, token: number): string {
    return this.#liveMotion(motionId, token).definition.id;
  }

  #liveChildNode(motionId: string, token: number, trackId: string): string {
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

  #admit(verb: VerbClass): "allow" | "join" {
    return admitOrRefuse(this.#phase, verb);
  }

  #setTrigger(id: string, token: number, trigger: MotionDefinition["trigger"]): void {
    this.#admit(immediateVerb("setTrigger", "resolved"));
    this.#boundary(() => {
      const entry = this.#writableMotion(id, token);
      const motionId = entry.definition.id;
      const diagnostics = validateMotionTrigger(trigger, `setTrigger(${motionId}).trigger`);
      if (diagnostics.some(({ severity }) => severity === "error"))
        refuse({ kind: "invalid-definition", diagnostics });
      if (sameTrigger(entry.definition.trigger, trigger)) return;
      const definition = Object.freeze({ ...entry.definition, trigger });
      const complete = this.#replaceMotionTrigger?.(
        motionId,
        this.#motionDefinition({ ...entry, definition }),
      );
      this.#motions.set(motionId, { ...entry, definition });
      this.#completeMotionEdit(complete);
    });
  }

  #setStagger(id: string, token: number, stagger: number | undefined): void {
    this.#admit(immediateVerb("setStagger", "resolved"));
    this.#boundary(() => {
      const entry = this.#writableMotion(id, token);
      const motionId = entry.definition.id;
      if (entry.definition.stagger === stagger) return;
      const complete = this.#setMotionStagger?.(motionId, stagger);
      this.#motions.set(motionId, {
        ...entry,
        definition: withStagger(entry.definition, stagger),
      });
      this.#completeMotionEdit(
        complete,
        this.#ownedBy(this.#tracks, motionId).map(([id]) => id),
      );
    });
  }

  #completeMotionEdit(complete: void | (() => void), touched: readonly string[] = []): void {
    runSettleSteps([() => complete?.(), () => this.#assertLive(), () => this.#flush(touched)]);
  }

  #motionHandle(id: string, token: number): MotionHandle {
    const runtime = this;
    return Object.freeze({
      id,
      get live(): boolean {
        return isLive(runtime.#motionIfLive(id, token));
      },
      get definition(): MotionDefinition {
        return runtime.#motionDefinition(runtime.#liveMotion(id, token));
      },
      get trackIds(): readonly string[] {
        const owner = runtime.#liveId(id, token);
        return Object.freeze(runtime.#ownedBy(runtime.#readTracks(), owner).map(([node]) => node));
      },
      addTrack: (track: TrackDefinition) =>
        runtime.#addTrack(track, { motionId: runtime.#writableId(id, token) }),
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
        return isLive(runtime.#entryIfLive(id, token));
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
        runtime.#authorEdit(id, token, { kind: "add-observe", observation }),
      removeObserve: (observation: ObservationDefinition) =>
        runtime.#authorEdit(id, token, { kind: "remove-observe", observation }),
      setRequire: (plugin: string, slot: string, source: string, memberKey?: string) =>
        runtime.#authorEdit(id, token, { kind: "bind-slot", plugin, slot, source, memberKey }),
      removeRequire: (plugin: string, slot: string, memberKey?: string) =>
        runtime.#authorEdit(id, token, { kind: "unbind-slot", plugin, slot, memberKey }),
      setKeyframeGroup: (plugin: string, group: AuthoredPluginGroup) =>
        runtime.#authorEdit(id, token, { kind: "set-group", plugin, group }),
      removeKeyframeGroup: (plugin: string) =>
        runtime.#authorEdit(id, token, { kind: "remove-group", plugin }),
      setGoal: (plugin: string, memberId: string, source: string) =>
        runtime.#authorEdit(id, token, { kind: "bind-goal", plugin, memberId, source }),
      removeGoal: (plugin: string, memberId: string) =>
        runtime.#authorEdit(id, token, { kind: "unbind-goal", plugin, memberId }),
      setKeyframe: (plugin: string, key: string, value: AuthoredProperty) =>
        runtime.#setKeyframe(id, token, plugin, key, value),
      removeKeyframe: (plugin: string, key: string) =>
        runtime.#removeKeyframe(id, token, plugin, key),
      overrideValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, () => runtime.#writableEntry(id, token), next, false),
      setValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, () => runtime.#writableEntry(id, token), next, true),
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
      refuse({ kind: "invalid-definition", diagnostics: resolved.diagnostics });
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
    const accepted = expectValid(validated(validateTrackDefinition(next, `replaceTrack(${id})`)));
    const tracks = this.#stageTracks();
    tracks.set(id, {
      ...entry,
      track: accepted,
      valueState: AUTHORED,
    });
    this.#commit({ tracks });
  }

  #commit(plan: StagedPair): void {
    if (this.#admit(COMMIT) === "join") return;
    const tracks = plan.tracks ?? this.#tracks,
      motions = plan.motions ?? this.#motions;
    this.#boundary(() => {
      this.#assertSameLifetimes(this.#motions, motions);
      this.#assertSameLifetimes(this.#tracks, tracks);
      const readers = new Map<string, readonly string[]>(),
        needsBuild = new Set<string>();
      for (const id of this.#tracks.keys())
        if (!tracks.has(id)) readers.set(id, this.#readersOf(id));
      for (const [id, entry] of tracks) {
        const old = this.#tracks.get(id);
        if (
          old !== undefined &&
          old.track !== entry.track &&
          this.#needsTimelineBuild(id, old.track, entry.track)
        )
          needsBuild.add(id);
      }
      const commit = planCommit(
        { tracks: this.#tracks, motions: this.#motions },
        { tracks, motions },
        { needsBuild, readers },
      );
      this.#assertLive();
      runPlan(commit, {
        createMotion: (x) => this.#createMotion?.(x),
        destroyMotion: (id) => this.#destroyMotion?.(id),
        compileTrack: (x, id) => this.#compileTrack?.(x, id),
        stageTrack: (x, id) => this.#stageTrack?.(x, id),
        replaceMotionTrack: (m, id, d) => this.#replaceMotionTrack?.(m, id, d),
        commitStaged: (x) => x?.commit(),
        rollbackStaged: (x) => x?.rollback(),
        disposeTrack: (id) => this.#disposeTrack?.(id),
        evictNode: (id) => {
          this.#instances.delete(id);
          this.#graph.evictNode(id);
        },
        mountNode: (id) => this.#mountNode(id),
        addMotionTrack: (m, id, d) => this.#addMotionTrack?.(m, id, d),
        removeMotionTrack: (m, id) => this.#removeMotionTrack?.(m, id),
        assertLive: () => this.#assertLive(),
        accept: () => this.#graph.replaceGraph(this.#snapshot(tracks, motions)),
        adopt: () => {
          this.#tracks = tracks;
          this.#motions = motions;
        },
        publish: (ids) => this.#flush(ids),
      });
    });
  }

  #boundary<T>(body: () => T): T {
    this.#phase = entering(this.#phase);
    try {
      return body();
    } finally {
      this.#phase = leaving(this.#phase);
      if (teardownOwed(this.#phase)) this.#teardown(true);
    }
  }

  #flush(touched: readonly string[]): void {
    if (isRetiring(this.#phase)) return;
    this.#publishSeeds(touched);
  }

  #publishSeeds(seeds: readonly string[]): PatchBatch {
    this.#assertLive();
    if (seeds.length === 0) return emptyValueBatch(this.#graph.sequence);
    return this.#invalidateSeeds(seeds);
  }

  #invalidateSeeds(nodeIds: readonly string[]): PatchBatch {
    const batch = this.#graph.flush(nodeIds);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }

  #assertSameLifetimes<E extends { readonly token: number }>(
    retained: ReadonlyMap<string, E>,
    candidate: ReadonlyMap<string, E>,
  ): void {
    for (const [id, entry] of candidate) {
      const previous = retained.get(id);
      if (previous !== undefined && previous.token !== entry.token)
        throw new TypeError(
          `schema-transaction-recreated: "${id}" was removed and recreated in one transaction. ` +
            "Use an in-place edit or commit removal before recreation.",
        );
    }
  }

  #writeValues(
    nodeId: string,
    resolveEntry: () => TrackEntry,
    values: AuthoredValues,
    rebase: boolean,
  ) {
    this.#admit(valueVerb(rebase ? "setValues" : "overrideValues", "resolved"));
    return this.#boundary(() => {
      const entry = resolveEntry();
      const { statics, animated } = splitAuthoredValues(values);
      const writing = liveWritten(animated);
      const involved = isOverlaid(writing) || isOverlaid(entry.valueState);
      const rewritten = rebase || involved ? withAuthoredValues(entry.track, values) : entry.track;
      // Validated and then discarded: this write stages no definition, so the refusal is the
      // whole of what validating the candidate is for here.
      if (involved)
        expectValid(validated(validateTrackDefinition(rewritten, `writeValues(${nodeId})`)));
      const mask = { ...authoredValues(entry.track), ...statics };
      const written = this.#writeValuesHook(nodeId, mask, involved ? animated : undefined, rebase);
      // The seam has taken the write and carries no inverse, so the state it left is recorded on
      // the way out, whichever of the two fallible reads below is the last one reached. The
      // definition is adopted inside the try, because a replacement that never staged is one this
      // entry may not claim.
      let adopted: TrackEntry = { ...entry, valueState: writing };
      let staged: StagedTrack | undefined;
      let progress: number | undefined;
      try {
        if (written !== undefined && !written.patched) {
          progress = written.progress;
          staged = this.#stageTrack?.(rewritten, nodeId);
        }
        if (rebase) adopted = { ...adopted, track: rewritten };
      } finally {
        this.#tracks.set(nodeId, adopted);
      }
      return this.#completeWrite(nodeId, staged, progress);
    });
  }

  #completeWrite(
    nodeId: string,
    staged: StagedTrack | undefined,
    progress: number | undefined,
  ): PatchBatch {
    if (staged === undefined && progress === undefined) return this.#publishValue(nodeId);
    let batch!: PatchBatch;
    runSettleSteps([
      () => staged?.commit(),
      () => {
        if (progress !== undefined) this.#setProgress(nodeId, progress);
      },
      () => {
        batch = this.#publishValue(nodeId);
      },
    ]);
    return batch;
  }

  #invalidateOne(nodeId: string) {
    this.#assertLive();
    return this.#invalidateSeeds([nodeId]);
  }

  #publishValue(nodeId: string): PatchBatch {
    const seeded = seeding(this.#phase, nodeId);
    if (seeded === undefined) return this.#invalidateOne(nodeId);
    this.#assertLive();
    this.#phase = seeded;
    return deferredValueBatch(this.#graph.sequence, [nodeId]);
  }

  #recompileKeyframes(
    nodeId: string,
    entry: TrackEntry,
    keyframes: AuthoredKeyframes,
    verb: string,
  ) {
    return this.#boundary(() => {
      const next = withKeyframes(entry.track, keyframes);
      const accepted = expectValid(validated(validateTrackDefinition(next, `${verb}(${nodeId})`)));
      const resolved = this.#resolve(nodeId, accepted);
      if (resolved?.diagnostics.some(({ severity }) => severity === "error"))
        refuse({ kind: "invalid-definition", diagnostics: resolved.diagnostics });
      const clear = isOverlaid(entry.valueState) ? NO_OVERLAY : undefined;
      const written = this.#writeValuesHook(nodeId, authoredValues(entry.track), clear, true);
      // The recording the mask path makes, for the same reason and on the same way out. A stage
      // that survives is what earns the accepted definition and the state saying the build removed
      // every live write standing on this node.
      let adopted: TrackEntry = { ...entry, valueState: liveWritten(clear) };
      let staged: StagedTrack | undefined;
      let progress: number | undefined;
      try {
        progress = written?.progress;
        staged = this.#stageTrack?.(accepted, nodeId);
        adopted = { ...entry, track: accepted, valueState: AUTHORED };
      } finally {
        this.#tracks.set(nodeId, adopted);
      }
      return this.#completeWrite(nodeId, staged, progress);
    });
  }

  #setKeyframe(
    nodeId: string,
    token: number,
    plugin: string,
    key: string,
    value: AuthoredProperty,
  ) {
    this.#admit(valueVerb("setKeyframe", "resolved"));
    const entry = this.#writableEntry(nodeId, token);
    const { keyframes, bound } = boundGroup(nodeId, entry.track, plugin);
    if (Object.hasOwn(readPluginValues(bound.group), key))
      return this.#writeValues(nodeId, () => entry, { [key]: value }, true);
    const edited = setAuthoredKeyframe(keyframes, bound, key, value);
    return this.#recompileKeyframes(nodeId, entry, edited, "setKeyframe");
  }
  #removeKeyframe(nodeId: string, token: number, plugin: string, key: string) {
    this.#admit(valueVerb("removeKeyframe", "resolved"));
    const entry = this.#writableEntry(nodeId, token);
    const { keyframes, bound } = boundGroup(nodeId, entry.track, plugin);
    const edited = removeAuthoredKeyframe(keyframes, bound, key);
    if (edited === keyframes) return this.#publishValue(nodeId);
    return this.#recompileKeyframes(nodeId, entry, edited, "removeKeyframe");
  }
  #authorEdit(id: string, token: number, edit: AuthoringEdit): void {
    const entry = this.#writableEntry(id, token);
    const next = applyEdit({ nodeId: id, motionId: entry.motionId, track: entry.track }, edit);
    if (next === entry.track) return;
    this.#replaceTrack(id, token, next);
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
    this.#admit(valueVerb("seek", "asserted"));
    this.#setProgress(nodeId, progress);
    return this.#publishValue(nodeId);
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
    return this.#writeValues(nodeId, () => this.#entryOf(nodeId), values, false);
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
    return this.#writeValues(nodeId, () => this.#entryOf(nodeId), values, true);
  }
  /**
   * Runs `recipe` as one value batch and publishes what it staged exactly once.
   *
   * The second tier, and what `edit(recipe)` is for the structural one. Every verb reached inside
   * still applies its own write immediately and still refuses on its own terms; what the batch owns
   * is the publication. So `n` writes across `n` nodes cost one invalidate, one notification per
   * affected node and one sequence move, where the same sequence spelled one write at a time costs
   * `n` of each, and the answer is the batch that one publication produced. What a staged verb
   * answers in the meantime is a deferred batch naming its own node.
   *
   * A recipe that staged nothing publishes nothing and answers an empty batch, because an empty seed
   * list still opens a batch, notifies every batch subscriber and moves the sequence. A recipe that
   * disposed the project is reported rather than answered, with `ProjectRuntime is disposed.` in
   * place of the batch, because the batch is the answer to this call and there is no batch: that
   * keeps the value tier's one failure contract. See ADR-078, ADR-064 and issue #288.
   */
  values(recipe: (transaction: ValueTransaction) => void): PatchBatch {
    this.#admit(immediateVerb("values", "asserted"));
    this.#phase = batchOpening(this.#phase);
    let seeds: readonly string[] = [];
    try {
      recipe(this.#valueTransaction());
    } finally {
      seeds = seedsIn(this.#phase) ?? seeds;
      this.#phase = batchClosing(this.#phase);
    }
    this.#assertLive();
    return this.#boundary(() => this.#publishSeeds(seeds));
  }

  #valueTransaction(): ValueTransaction {
    const runtime = this;
    return Object.freeze({
      seek: (nodeId: string, progress: number) => runtime.seek(nodeId, progress),
      setValues: (nodeId: string, values: AuthoredValues) => runtime.setValues(nodeId, values),
      overrideValues: (nodeId: string, values: AuthoredValues) =>
        runtime.overrideValues(nodeId, values),
      track: (nodeId: string) => runtime.track(nodeId),
      tryTrack: (nodeId: string) => runtime.tryTrack(nodeId),
    });
  }
  /**
   * Publishes for `nodeIds` and answers the batch that publication produced.
   *
   * A list that names nothing is answered rather than published, through the one owner of what an
   * empty seed list means, which is the member `values(recipe)` publishes through too. An empty
   * list still opens a batch, notifies every batch subscriber and moves the sequence, and a caller
   * that asked for nothing to be invalidated is owed none of that. What a caller can read is
   * unchanged: this verb always answers a real `PatchBatch`, and for an empty list that batch
   * carries the sequence the graph is already on. See ADR-080 and issue #371.
   */
  invalidate(nodeIds: readonly string[]) {
    this.#admit(immediateVerb("invalidate", "asserted"));
    return this.#publishSeeds(nodeIds);
  }
  /**
   * Tears this project down, once, and refuses everything from the moment it is called.
   *
   * Reachable from caller code that this runtime is in the middle of calling, which is why the
   * refusal and the release are two things rather than one. See ADR-067.
   * Every release step is attempted. Direct release reports collected failures; a deferred release
   * records diagnostics without replacing the outcome of the operation it follows.
   */
  dispose(): void {
    if (isRetiring(this.#phase)) return;
    this.#phase = retiring(this.#phase);
    if (teardownOwed(this.#phase)) this.#teardown(false);
  }

  #teardown(deferred: boolean): void {
    this.#phase = retired();
    const failures = collect([
      ...[...this.#instances.keys()].map((nodeId) => () => this.#graph.detach(nodeId)),
      () => {
        this.#instances.clear();
        this.#tracks.clear();
        this.#motions.clear();
      },
      () => this.#graph.dispose(),
      () => this.#disposeComposition(),
    ]);
    const describe = (failure: unknown, seen = new Set<unknown>()): string => {
      try {
        const message = String(describeError(failure));
        if (!(failure instanceof AggregateError)) return message;
        if (seen.has(failure)) return "[circular release failure]";
        seen.add(failure);
        try {
          return [message, ...failure.errors.map((cause: unknown) => describe(cause, seen))].join(
            "; ",
          );
        } finally {
          seen.delete(failure);
        }
      } catch {
        return "Release failed with an unprintable thrown value.";
      }
    };
    for (const failure of failures) {
      this.#diagnostics.record(
        Object.freeze({
          ruleId: "project-release-failed",
          path: "dispose",
          message: describe(failure),
          severity: "error",
        }),
      );
    }
    if (!deferred) report(failures, "Project release failed.");
  }
  #assertLive(): void {
    if (isRetiring(this.#phase)) refuse({ kind: "disposed" });
  }
}
