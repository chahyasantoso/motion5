import type {
  PatchBatch,
  ProjectDefinition,
  TrackDefinition,
  MotionDefinition,
  TriggerSignal,
  Value,
} from "../contract/v5";
import type { MotionHandle } from "../contract/motion-handle";
import type { SchemaTransaction } from "../contract/schema-transaction";
import type { ValueTransaction } from "../contract/value-transaction";
import type { TrackHandle } from "../contract/track-handle";
import { validateMotionTrigger, validateTrackDefinition } from "../contract/validate-v5";
import type { ParsedValues } from "../contract/v5-parse";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
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
import {
  NO_PORTS,
  completing,
  installed,
  type ProjectPorts,
  type StagedTrack,
} from "./project-ports";
import {
  RuntimeMotionHandle,
  RuntimeTrackHandle,
  type HandleHost,
  type MotionHost,
  type TrackHost,
} from "./project-handles";
import { collect, report } from "../domain/completion";
import { diagnostic as buildDiagnostic } from "../contract/diagnostics";
import { afterCleanup, batchFor, runSteps } from "./report";
import { planCommit } from "./commit-plan";
import { runPlan } from "./run-plan";
import { refuse } from "./refusal";
import { expectLive, expectValid, isLive, resolveToken, stale, type Resolved } from "./results";
import { AUTHORED, type ValueState } from "./value-state";
import { applyEdits, applyValueEdits } from "./edit-apply";
import { classifyBatch } from "./edit-batch";
import type { TrackLookup, ValueChange } from "./edit-plan-values";
import type { PlanEnvironment, PlanState, PlannedChange, PlannedTrack } from "./edit-plan";
import {
  isValueEdit,
  publicVerbOf,
  type CheapEdit,
  type Edit,
  type LiveEdit,
  type StructuralEdit,
} from "./edit-types";
import { sameTrigger, withStagger } from "./authored-values";
import { Diagnostics, type DiagnosticsSnapshot } from "./diagnostics";
import {
  GraphRuntime,
  type ComposeIdentifiedResolver,
  type ComposeResolver,
} from "./graph-runtime";
import type { GraphNode } from "../graph/ir";
import type { CommittedContract } from "../graph/committed-contract";

import type { GraphBuilder } from "../ports/graph-builder";
import { UNJUDGED_CAPABILITIES, type PluginCapabilities } from "../ports/plugin-capabilities";
import { unreachable } from "../lang/exhaustive";

interface FreeTrackEntry {
  readonly kind: "free";
  readonly track: TrackDefinition;
  readonly token: number;
  readonly valueState: ValueState;
  // Contract at last structural commit. `undefined` until a graph build, then again after
  // `replace-track`/`replace-input` (only movers); other edits keep it so rebuilds carry, never re-infer.
  readonly contract: CommittedContract | undefined;
}

interface OwnedTrackEntry {
  readonly kind: "owned";
  readonly track: TrackDefinition;
  readonly motionId: string;
  readonly token: number;
  readonly valueState: ValueState;
  readonly contract: CommittedContract | undefined;
}

type TrackEntry = FreeTrackEntry | OwnedTrackEntry;

function trackMotionId(entry: TrackEntry): string | undefined {
  switch (entry.kind) {
    case "free":
      return undefined;
    case "owned":
      return entry.motionId;
    default:
      return unreachable(entry);
  }
}

type MotionEntry = {
  definition: MotionDefinition;
  token: number;
};
interface OpenTransaction {
  tracks: Map<string, TrackEntry>;
  motions: Map<string, MotionEntry>;
  // Nodes whose final track must not be diffed for a timeline build: binding edits move
  // compiled-compare input the timeline never consumes. `fullBuild` clears the mark.
  readonly noBuild: Set<string>;
  /** Nodes a full replacement or removal touched, which a later binding may not mark `noBuild`. */
  readonly fullBuild: Set<string>;
}

// The empty answer a commit outside a recipe reads, so the skip set is total rather than optional.
const NO_BUILD: ReadonlySet<string> = Object.freeze(new Set<string>());

interface TracksStaged {
  readonly kind: "tracks";
  readonly tracks: Map<string, TrackEntry>;
}

interface MotionsStaged {
  readonly kind: "motions";
  readonly motions: Map<string, MotionEntry>;
}

interface BothStaged {
  readonly kind: "both";
  readonly tracks: Map<string, TrackEntry>;
  readonly motions: Map<string, MotionEntry>;
}

type StagedPair = TracksStaged | MotionsStaged | BothStaged;

function resolveStagedPair(
  plan: StagedPair,
  retainedTracks: Map<string, TrackEntry>,
  retainedMotions: Map<string, MotionEntry>,
): { readonly tracks: Map<string, TrackEntry>; readonly motions: Map<string, MotionEntry> } {
  switch (plan.kind) {
    case "tracks":
      return { tracks: plan.tracks, motions: retainedMotions };
    case "motions":
      return { tracks: retainedTracks, motions: plan.motions };
    case "both":
      return { tracks: plan.tracks, motions: plan.motions };
    default:
      return unreachable(plan);
  }
}

export type { StagedTrack };
export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  /** The identified-table composition seam, forwarded to `GraphRuntime` untouched. */
  readonly composeIdentified?: ComposeIdentifiedResolver;
  /** Whether an authored `track.plugin` id names an admitted plugin; the structural tier needs it to validate plugin tracks. Absent keeps no-plugin paths. */
  readonly isPluginRegistered?: (pluginId: string) => boolean;

  readonly setProgress?: (nodeId: string, progress: number) => void;
  /** Replaces the authored values a compiled Track evaluates, cheap tier; values arrive parsed and validated, a node with no compiled Track is a no-op. */
  readonly rewriteValues?: (nodeId: string, values: ParsedValues) => void;
  /** Stands one whole evaluated value over a compiled Track, or `undefined` drops it; validated by the runtime; no compiled Track = no-op; the authored definition never moves. */
  readonly overlayValues?: (nodeId: string, value: Value | undefined) => void;
  readonly compileTrack?: (track: TrackDefinition, nodeId?: string) => void;
  readonly disposeTrack?: (nodeId: string) => void;
  readonly stageTrack?: (track: TrackDefinition, nodeId: string) => StagedTrack;
  readonly addMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly replaceMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeMotionTrack?: (motionId: string, trackId: string) => void;
  /** Trigger swap seam: return accepts, completion runs post-adoption; a throw before return refuses, supplier owns cleanup; post-accept failures report without restoring the stale definition. */
  readonly replaceMotionTrigger?: (
    motionId: string,
    definition: MotionDefinition,
  ) => void | (() => void);
  readonly setMotionStagger?: (motionId: string, stagger?: number) => void | (() => void);
  /** The signal a live Motion's trigger takes; the recipe refusal is asked here before a signal reaches a live port, unknown ids stay refused by the Motion's owner. */
  readonly signalMotion?: (motionId: string, signal: TriggerSignal) => void;
  readonly createMotion?: (definition: MotionDefinition) => void;
  readonly destroyMotion?: (motionId: string) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly disposeComposition?: () => void;
  readonly diagnosticsCapacity?: number;
  readonly graphBuilder?: GraphBuilder;
  /** What a structural plan may ask about plugins, as data; absent = `UNJUDGED_CAPABILITIES`, which asks nothing and refuses nothing. */
  readonly capabilities?: PluginCapabilities;
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
  readonly #ports: ProjectPorts;
  readonly #handleHost: HandleHost;
  readonly #isPluginRegistered: ((pluginId: string) => boolean) | undefined;
  readonly #capabilities: PluginCapabilities;
  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    this.#isPluginRegistered = options.isPluginRegistered;
    this.#capabilities = options.capabilities ?? UNJUDGED_CAPABILITIES;
    for (const motion of project.motions) {
      this.#motions.set(motion.id, { definition: motion, token: this.#nextToken++ });
      for (const track of motion.tracks)
        this.#tracks.set(qualifyMotionTrack(motion.id, track.id).value, {
          kind: "owned",
          track,
          motionId: motion.id,
          token: this.#nextToken++,
          valueState: AUTHORED,
          contract: undefined,
        });
    }
    for (const track of project.freeTracks ?? [])
      this.#tracks.set(qualifyFreeTrack(track.id).value, {
        kind: "free",
        track,
        token: this.#nextToken++,
        valueState: AUTHORED,
        contract: undefined,
      });
    // The one place seam optionality and receiver are answered: uninstalled seams read their
    // NO_PORTS no-op, installed ones bind to this runtime. Nothing below is optional.
    this.#ports = Object.freeze({
      track: Object.freeze({
        compile: installed(this, options.compileTrack, NO_PORTS.track.compile),
        dispose: installed(this, options.disposeTrack, NO_PORTS.track.dispose),
        stage: installed(this, options.stageTrack, NO_PORTS.track.stage),
      }),
      motion: Object.freeze({
        create: installed(this, options.createMotion, NO_PORTS.motion.create),
        destroy: installed(this, options.destroyMotion, NO_PORTS.motion.destroy),
        addTrack: installed(this, options.addMotionTrack, NO_PORTS.motion.addTrack),
        replaceTrack: installed(this, options.replaceMotionTrack, NO_PORTS.motion.replaceTrack),
        removeTrack: installed(this, options.removeMotionTrack, NO_PORTS.motion.removeTrack),
        replaceTrigger: completing(this, options.replaceMotionTrigger),
        setStagger: completing(this, options.setMotionStagger),
        signal: installed(this, options.signalMotion, NO_PORTS.motion.signal),
      }),
      value: Object.freeze({
        rewrite: installed(this, options.rewriteValues, NO_PORTS.value.rewrite),
        overlay: installed(this, options.overlayValues, NO_PORTS.value.overlay),
        seek: installed(this, options.setProgress, NO_PORTS.value.seek),
      }),
      host: Object.freeze({
        disposeComposition: installed(
          this,
          options.disposeComposition,
          NO_PORTS.host.disposeComposition,
        ),
      }),
    });
    // What a handle may ask back, resolved once: a handle is a class, it cannot reach a
    // private member. Which liveness order each verb gets is still decided here.
    this.#handleHost = Object.freeze<HandleHost>({
      track: Object.freeze<TrackHost>({
        live: (id, token) => isLive(this.#entryIfLive(id, token)),
        definition: (id, token) => this.#liveEntry(id, token).track,
        applyStructural: (id, token, edit) => this.#applyStructural(id, token, edit),
        applyCheap: (id, token, edit) => this.#applyCheap(id, token, edit),
        applyLive: (id, token, edit) => this.#applyLive(id, token, edit),
      }),
      motion: Object.freeze<MotionHost>({
        live: (id, token) => isLive(this.#motionIfLive(id, token)),
        definition: (id, token) => this.#motionDefinition(this.#liveMotion(id, token)),
        trackIds: (id, token) => {
          const owner = this.#liveId(id, token);
          return Object.freeze(this.#ownedBy(this.#readTracks(), owner).map(([node]) => node));
        },
        addTrack: (id, token, track) =>
          this.#addTrack(track, { motionId: this.#writableId(id, token) }),
        track: (id, token, trackId) => this.track(this.#liveChildNode(id, token, trackId)),
        tryTrack: (id, token, trackId) => this.tryTrack(this.#liveChildNode(id, token, trackId)),
        setTrigger: (id, token, trigger) => this.#setTrigger(id, token, trigger),
        setStagger: (id, token, stagger) => this.#setStagger(id, token, stagger),
        destroy: (id, token) => this.#removeMotion(this.#writableId(id, token)),
      }),
    });
    this.#diagnostics = new Diagnostics(options.diagnosticsCapacity);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        ...(options.scheduler === undefined ? {} : { scheduler: options.scheduler }),
        ...(options.onClockTick === undefined ? {} : { onClockTick: options.onClockTick }),
        ...(options.graphBuilder === undefined ? {} : { graphBuilder: options.graphBuilder }),
        ...(options.composeIdentified === undefined
          ? {}
          : { composeIdentified: options.composeIdentified }),
        onFlushError: (diagnostic) => this.#diagnostics.record(diagnostic),
      });
    } catch (error) {
      // The construction failure is the diagnosis; the host's release is subordinate, so both
      // leave together. `afterCleanup` owns that precedence.
      throw afterCleanup(error, "cleanup", () => this.#ports.host.disposeComposition());
    }
    // The load's own graph is the first structural commit, so its contracts are what every later
    // rebuild carries. Reading them back rather than deriving again keeps one owner of derivation.
    for (const [id, entry] of this.#tracks) {
      const contract = this.#graph.graph.nodeById[id]?.contract;
      if (contract !== undefined) this.#tracks.set(id, { ...entry, contract });
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
  /** Runs `recipe` as one transaction and commits what it staged exactly once; a recipe that disposed the runtime still gets its value and commits nothing. */
  edit<T>(recipe: (transaction: SchemaTransaction) => T): T {
    this.#admit(OPEN_RECIPE);
    const open: OpenTransaction = {
      tracks: this.#tracks,
      motions: this.#motions,
      noBuild: new Set<string>(),
      fullBuild: new Set<string>(),
    };
    this.#phase = opening(this.#phase, open);
    let answer: T;
    try {
      answer = recipe(this.#transaction());
    } finally {
      this.#phase = closing(this.#phase);
    }
    if (isRetiring(this.#phase)) return answer;
    if (open.tracks !== this.#tracks || open.motions !== this.#motions)
      this.#commit({ kind: "both", tracks: open.tracks, motions: open.motions }, open.noBuild);
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
    this.#commit({ kind: "motions", motions });
    return Object.freeze({ id: accepted.id });
  }
  destroyMotion(motionId: string): void {
    this.#assertLive();
    if (!this.#readMotions().has(motionId)) refuse({ kind: "unknown-motion", motionId });
    this.#removeMotion(motionId);
  }
  /** Hands one signal to the layer owning this Motion's trigger; refused inside a recipe, and the hook keeps its own unknown-id refusal. */
  signal(motionId: string, signal: TriggerSignal): void {
    this.#admit(immediateVerb("signal", "asserted"));
    this.#ports.motion.signal(motionId, signal);
  }
  /** The resolver for one Motion, refusing an id this project never had; `tryMotion` answers instead of refusing. */
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
  /** Every node reading this one, for editor preflight not enforcement; enforcement stays in the candidate graph, and an unknown id answers empty rather than refusing. */
  dependantsOf(nodeId: string): readonly string[] {
    this.#admit(READ);
    return this.#readersOf(nodeId);
  }

  // Readers come from the graph's own dependants, never recomputed from the track maps beside it.
  #readersOf(nodeId: string): readonly string[] {
    const readers: readonly string[] | undefined = this.#graph.graph.dependants[nodeId];
    return Object.freeze(readers === undefined ? [] : [...new Set(readers)]);
  }
  /** Every Motion id, in committed order; frozen, live-gated only, and inside a recipe it reads what that recipe staged. */
  motionIds(): readonly string[] {
    this.#admit(READ);
    return Object.freeze([...this.#readMotions().keys()]);
  }
  /** Track node ids no Motion owns; the unowned half of the same ownership filter `MotionHandle.trackIds` reads, so the two cannot disagree on order. */
  freeTrackIds(): readonly string[] {
    this.#admit(READ);
    return Object.freeze(this.#ownedBy(this.#readTracks(), undefined).map(([node]) => node));
  }
  /** Every node mounted right now; no staged pair carries it, only `mount`, `unmount` and commit settlement move it. */
  mountedNodeIds(): readonly string[] {
    this.#admit(READ);
    return Object.freeze([...this.#instances.keys()]);
  }
  #acceptTrack(track: TrackDefinition, path: string): TrackDefinition {
    return expectValid(
      validateTrackDefinition(
        track,
        path,
        this.#isPluginRegistered === undefined
          ? {}
          : { isPluginRegistered: this.#isPluginRegistered },
      ),
    );
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
    const accepted = this.#acceptTrack(track, `addTrack(${track.id})`);
    const token = this.#nextToken++;
    const tracks = this.#stageTracks();
    tracks.set(
      id,
      motionId === undefined
        ? { kind: "free", track: accepted, token, valueState: AUTHORED, contract: undefined }
        : {
            kind: "owned",
            track: accepted,
            motionId,
            token,
            valueState: AUTHORED,
            contract: undefined,
          },
    );
    this.#commit({ kind: "tracks", tracks });
    return this.#handle(id, token);
  }

  #ownedBy(
    tracks: ReadonlyMap<string, TrackEntry>,
    motionId: string | undefined,
  ): readonly (readonly [string, TrackEntry])[] {
    return [...tracks.entries()].filter(([, entry]) => trackMotionId(entry) === motionId);
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

  // Children come from #ownedBy, because the entry's own definition can carry an empty child list.
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
    this.#commit({ kind: "motions", motions });
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
      const complete = this.#ports.motion.replaceTrigger(
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
      const complete = this.#ports.motion.setStagger(motionId, stagger);
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

  #completeMotionEdit(complete: (() => void) | undefined, touched: readonly string[] = []): void {
    runSteps("settle", [() => complete?.(), () => this.#assertLive(), () => this.#flush(touched)]);
  }

  #motionHandle(id: string, token: number): MotionHandle {
    return new RuntimeMotionHandle(this.#handleHost.motion, id, token);
  }
  #handle(id: string, token: number): TrackHandle {
    return new RuntimeTrackHandle(this.#handleHost.track, id, token);
  }

  // The committed or staged view a structural plan reads, as plain data. `authoredIndex` is
  // recomputed from insertion order: removals and replacements move the positions after them.
  #planState(tracks: ReadonlyMap<string, TrackEntry>): PlanState {
    const nextIndex = new Map<string, number>();
    const planned = new Map<string, PlannedTrack>();
    for (const [nodeId, entry] of tracks) {
      const ownerId = trackMotionId(entry) ?? "~";
      const authoredIndex = nextIndex.get(ownerId) ?? 0;
      nextIndex.set(ownerId, authoredIndex + 1);
      planned.set(
        nodeId,
        Object.freeze({
          nodeId,
          track: entry.track,
          owner: entry.kind === "free" ? "free" : "motion",
          ownerId,
          authoredIndex,
          valueState: entry.valueState,
          contract: entry.contract,
        }),
      );
    }
    return { tracks: planned };
  }

  #planEnvironment(): PlanEnvironment {
    return Object.freeze({
      capabilities: this.#capabilities,
      ...(this.#isPluginRegistered === undefined
        ? {}
        : { isPluginRegistered: this.#isPluginRegistered }),
    });
  }

  // Sole internal entry for an edit list: classify once, take that path. Refusal throws
  // before adoption, publication or commit. Admission is the caller's.
  #apply(edits: readonly Edit[]): PatchBatch {
    const batch = classifyBatch(edits);
    switch (batch.kind) {
      case "empty":
        return batchFor(this.#graph.sequence, { kind: "empty" });
      case "values":
        return this.#applyValues(batch.edits);
      case "structural":
        return this.#applyStructuralList(batch.edits);
      case "mixed":
        throw new TypeError("An edit list cannot mix structural and value edits.");
      default:
        return unreachable(batch);
    }
  }

  /** Applies an edit list as one atomic batch and answers its one publication; no handle or package entry point reaches it. */
  apply(edits: readonly Edit[]): PatchBatch {
    this.#assertLive();
    for (const edit of edits) {
      if (isValueEdit(edit)) this.#admit(valueVerb(publicVerbOf(edit.kind), "resolved"));
    }
    return this.#apply(edits);
  }

  // Plans on the staged view and stages changes; only the plan builds a candidate graph or
  // contract. A no-op answers before `#stageTracks` copies -> changed nothing = commits nothing.
  #applyStructuralList(edits: readonly StructuralEdit[]): PatchBatch {
    const planned = applyEdits(this.#planState(this.#readTracks()), edits, this.#planEnvironment());
    if (planned.changes.length === 0) return batchFor(this.#graph.sequence, { kind: "empty" });
    const tracks = this.#stageTracks();
    const open = stagedIn(this.#phase);
    const noBuild = open?.noBuild ?? new Set<string>();
    const fullBuild = open?.fullBuild ?? new Set<string>();
    for (const change of planned.changes) this.#stageChange(change, tracks, noBuild, fullBuild);
    this.#commit({ kind: "tracks", tracks }, noBuild);
    // A structural commit publishes inside the commit and its batch is not carried out of it, so
    // the list answers the empty batch. The structural verbs discard the answer.
    return batchFor(this.#graph.sequence, { kind: "empty" });
  }

  #applyStructural(id: string, token: number, edit: StructuralEdit): void {
    this.#writableEntry(id, token);
    this.#apply([edit]);
  }

  // One node's retained view, built on demand. It reads the entry the id names and nothing else, so
  // planning a value edit costs the same in a project of ten tracks and of ten thousand.
  #valueLookup(): TrackLookup {
    return {
      get: (nodeId) => {
        const entry = this.#readTracks().get(nodeId);
        return entry === undefined
          ? undefined
          : { nodeId, track: entry.track, valueState: entry.valueState, contract: entry.contract };
      },
    };
  }

  // Applies only planned deltas to named entries. In-place is safe: value edits are refused
  // during a commit and inside a recipe, so no staged copy is open; keys keep insertion order.
  #applyValues(edits: readonly (CheapEdit | LiveEdit)[]): PatchBatch {
    const changes = applyValueEdits(this.#valueLookup(), edits, this.#planEnvironment());
    if (changes.length === 0) return batchFor(this.#graph.sequence, { kind: "empty" });
    for (const change of changes) this.#adoptValueChange(change);
    return this.#publishValues(changes.map((change) => change.track.nodeId));
  }

  #adoptValueChange(change: ValueChange): void {
    const id = change.track.nodeId;
    const entry = this.#tracks.get(id);
    if (entry === undefined) throw new TypeError(`Unknown graph node "${id}".`);
    switch (change.kind) {
      case "authored-values":
        this.#tracks.set(id, {
          ...entry,
          track: change.track.track,
          valueState: change.track.valueState,
          contract: change.track.contract,
        });
        this.#ports.value.rewrite(id, change.values);
        return;
      case "live-values":
        this.#tracks.set(id, { ...entry, valueState: change.track.valueState });
        this.#ports.value.overlay(id, change.overlay);
        return;
      default:
        return unreachable(change);
    }
  }

  // Plans one cheap edit; value-tier admission runs first, so a commit or edit recipe refuses it
  // like the value verbs, while a value batch still collects its seed.
  #applyCheap(id: string, token: number, edit: CheapEdit): PatchBatch {
    this.#admit(valueVerb(publicVerbOf(edit.kind), "resolved"));
    this.#writableEntry(id, token);
    return this.#apply([edit]);
  }

  // Plans one live edit: legal on an errored node and in a value batch, refused by a commit
  // or recipe. Authored definition never moves; only value state and the compiled overlay.
  #applyLive(id: string, token: number, edit: LiveEdit): PatchBatch {
    this.#admit(valueVerb(publicVerbOf(edit.kind), "resolved"));
    this.#writableEntry(id, token);
    return this.#apply([edit]);
  }

  // By-id half: admission runs before entry resolution, so a write aimed at a node a commit is
  // still compiling answers the in-flight refusal, not an absence the caller cannot act on.
  #applyLiveById(id: string, edit: LiveEdit): PatchBatch {
    this.#assertLive();
    this.#admit(valueVerb(publicVerbOf(edit.kind), "resolved"));
    this.#entryOf(id);
    return this.#apply([edit]);
  }

  // Carries one planned change into the staged map and records what its commit owes.
  #stageChange(
    change: PlannedChange,
    tracks: Map<string, TrackEntry>,
    noBuild: Set<string>,
    fullBuild: Set<string>,
  ): void {
    switch (change.kind) {
      case "update-track": {
        const nodeId = change.track.nodeId;
        const entry = tracks.get(nodeId);
        if (entry === undefined) throw new TypeError(`Unknown graph node "${nodeId}".`);
        tracks.set(nodeId, {
          ...entry,
          track: change.track.track,
          valueState: change.track.valueState,
          contract: change.track.contract,
        });
        if (!change.bindingOnly) {
          fullBuild.add(nodeId);
          noBuild.delete(nodeId);
        } else if (!fullBuild.has(nodeId)) {
          noBuild.add(nodeId);
        }
        return;
      }
      case "remove-track":
        tracks.delete(change.nodeId);
        noBuild.delete(change.nodeId);
        fullBuild.add(change.nodeId);
        return;
      case "authored-values":
        throw new TypeError("Structural edit planned an authored value change.");
      case "live-values":
        throw new TypeError("Structural edit planned a live value change.");
      default:
        return unreachable(change);
    }
  }

  #commit(plan: StagedPair, noBuild: ReadonlySet<string> = NO_BUILD): void {
    if (this.#admit(COMMIT) === "join") return;
    const { tracks, motions } = resolveStagedPair(plan, this.#tracks, this.#motions);
    this.#boundary(() => {
      this.#assertSameLifetimes(this.#motions, motions);
      this.#assertSameLifetimes(this.#tracks, tracks);
      const readers = new Map<string, readonly string[]>(),
        needsBuild = new Set<string>();
      for (const id of this.#tracks.keys())
        if (!tracks.has(id)) readers.set(id, this.#readersOf(id));
      for (const [id, entry] of tracks) {
        const old = this.#tracks.get(id);
        if (old !== undefined && old.track !== entry.track && !noBuild.has(id)) needsBuild.add(id);
      }
      const commit = planCommit(
        { tracks: this.#tracks, motions: this.#motions },
        { tracks, motions },
        { needsBuild, readers, noBuild },
      );
      this.#assertLive();
      runPlan(commit, {
        createMotion: (definition) => this.#ports.motion.create(definition),
        destroyMotion: (motionId) => this.#ports.motion.destroy(motionId),
        compileTrack: (track, nodeId) => this.#ports.track.compile(track, nodeId),
        stageTrack: (track, nodeId) => this.#ports.track.stage(track, nodeId),
        replaceMotionTrack: (motionId, nodeId, duration) =>
          this.#ports.motion.replaceTrack(motionId, nodeId, duration),
        commitStaged: (staged) => staged?.commit(),
        rollbackStaged: (staged) => staged?.rollback(),
        disposeTrack: (nodeId) => this.#ports.track.dispose(nodeId),
        evictNode: (nodeId) => {
          this.#instances.delete(nodeId);
          this.#graph.evictNode(nodeId);
        },
        mountNode: (nodeId) => this.#mountNode(nodeId),
        addMotionTrack: (motionId, nodeId, duration) =>
          this.#ports.motion.addTrack(motionId, nodeId, duration),
        removeMotionTrack: (motionId, nodeId) => this.#ports.motion.removeTrack(motionId, nodeId),
        assertLive: () => this.#assertLive(),
        accept: () => {
          this.#graph.replaceGraph(this.#snapshot(tracks, motions), this.#carriedContracts(tracks));
          // The accepted graph is the structural commit, so its contracts become the ones every
          // later rebuild carries. Read back rather than derived a second time here.
          for (const [id, entry] of tracks) {
            const contract = this.#graph.graph.nodeById[id]?.contract;
            if (contract !== undefined && contract !== entry.contract)
              tracks.set(id, { ...entry, contract });
          }
        },
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
    if (seeds.length === 0) return batchFor(this.#graph.sequence, { kind: "empty" });
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

  #invalidateOne(nodeId: string) {
    this.#assertLive();
    return this.#invalidateSeeds([nodeId]);
  }

  #publishValue(nodeId: string): PatchBatch {
    const seeded = seeding(this.#phase, nodeId);
    if (seeded === undefined) return this.#invalidateOne(nodeId);
    this.#assertLive();
    this.#phase = seeded;
    return batchFor(this.#graph.sequence, { kind: "deferred-in-batch", seeds: [nodeId] });
  }

  // One publication for the nodes a value list changed; one node delegates to #publishValue.
  // A longer list collects seeds into an open batch, else invalidates them together.
  #publishValues(nodeIds: readonly string[]): PatchBatch {
    const seeds = [...new Set(nodeIds)];
    const [only, ...others] = seeds;
    if (only === undefined) throw new TypeError("A value publication needs at least one node.");
    if (others.length === 0) return this.#publishValue(only);
    let phase = this.#phase;
    for (const nodeId of seeds) {
      const seeded = seeding(phase, nodeId);
      if (seeded === undefined) {
        this.#assertLive();
        return this.#invalidateSeeds(seeds);
      }
      phase = seeded;
    }
    this.#assertLive();
    this.#phase = phase;
    return batchFor(this.#graph.sequence, {
      kind: "deferred-in-batch",
      seeds: [only, ...others],
    });
  }

  #carriedContracts(
    tracks: ReadonlyMap<string, TrackEntry>,
  ): ReadonlyMap<string, CommittedContract> {
    const carried = new Map<string, CommittedContract>();
    for (const [id, entry] of tracks)
      if (entry.contract !== undefined) carried.set(id, entry.contract);
    return carried;
  }

  #snapshot(
    tracks: ReadonlyMap<string, TrackEntry>,
    motions: ReadonlyMap<string, MotionEntry>,
  ): ProjectDefinition {
    const owned = new Map<string, TrackDefinition[]>();
    const freeTracks: TrackDefinition[] = [];
    for (const entry of tracks.values()) {
      const motionId = trackMotionId(entry);
      if (motionId === undefined) {
        freeTracks.push(entry.track);
        continue;
      }
      const bucket = owned.get(motionId);
      if (bucket === undefined) owned.set(motionId, [entry.track]);
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
    this.#ports.value.seek(nodeId, progress);
    return this.#publishValue(nodeId);
  }
  /** Writes one node's whole evaluated local value by id, without a handle. */
  writeValues(nodeId: string, value: Value): PatchBatch {
    return this.#applyLiveById(nodeId, { kind: "write-live", nodeId, value });
  }

  /** The node-addressed spelling of `TrackHandle.releaseValues`. */
  releaseValues(nodeId: string): PatchBatch {
    return this.#applyLiveById(nodeId, { kind: "release-live", nodeId });
  }

  /** Runs `recipe` as one value batch: verbs write immediately, answer deferred batches; one publication at close; nothing staged = empty batch; disposed = `ProjectRuntime is disposed.` */
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
      writeValues: (nodeId: string, value: Value) => runtime.writeValues(nodeId, value),
      releaseValues: (nodeId: string) => runtime.releaseValues(nodeId),
      track: (nodeId: string) => runtime.track(nodeId),
      tryTrack: (nodeId: string) => runtime.tryTrack(nodeId),
    });
  }
  /** Publishes for `nodeIds` and answers that batch; an empty list answers a current-sequence batch rather than opening one, since invalidating nothing owes no notification. */
  invalidate(nodeIds: readonly string[]) {
    this.#admit(immediateVerb("invalidate", "asserted"));
    return this.#publishSeeds(nodeIds);
  }
  /** Tears down once, refuses everything from the call; reachable mid-call, so refusal and release are separate. Every release step runs; direct = report failures, deferred = diagnostics. */
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
      () => this.#ports.host.disposeComposition(),
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
        buildDiagnostic("project-release-failed", "dispose", describe(failure)),
      );
    }
    if (!deferred) report(failures, "Project release failed.");
  }
  #assertLive(): void {
    if (isRetiring(this.#phase)) refuse({ kind: "disposed" });
  }
}
