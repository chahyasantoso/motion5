import type {
  Diagnostic,
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
  MotionDefinition,
} from "../contract/v5";
import { validateMotionTrigger, validateTrackDefinition } from "../contract/validate-v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import { observationEdgeKey } from "../graph/ir";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
import { Diagnostics, type DiagnosticsSnapshot } from "./diagnostics";
import { GraphRuntime, type ComposeResolver } from "./graph-runtime";
import type { GraphBuilder } from "../ports/graph-builder";

type TrackEntry = { track: TrackDefinition; owner: object; motionId?: string; token: number };
export interface TrackHandle {
  readonly id: string;
  readonly track: TrackDefinition;
  remove(): void;
  replace(next: TrackDefinition): void;
  addObserve(observation: ObservationDefinition): void;
  removeObserve(observation: ObservationDefinition): void;
}
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}
export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly compileTrack?: (track: TrackDefinition, nodeId?: string) => void;
  readonly disposeTrack?: (nodeId: string) => void;
  readonly stageTrack?: (track: TrackDefinition, nodeId: string) => StagedTrack;
  readonly addMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly replaceMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeMotionTrack?: (motionId: string, trackId: string) => void;
  readonly createMotion?: (definition: MotionDefinition) => void;
  readonly destroyMotion?: (motionId: string) => void;
  readonly onClockTick?: (event: ClockTick) => void;
  readonly disposeComposition?: () => void;
  readonly diagnosticsCapacity?: number;
  readonly graphBuilder?: GraphBuilder;
}
function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
function describeError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
function runRollbackSteps(steps: readonly (() => void)[]): void {
  const failures: unknown[] = [];
  for (const step of steps) {
    try {
      step();
    } catch (error) {
      failures.push(error);
    }
  }
  if (failures.length === 0) return;
  if (failures.length === 1) throw failures[0];
  throw new AggregateError(failures, "Track replacement rollback failed.");
}
/**
 * Rejects an operation whose rollback can fail on its own.
 *
 * Both mutating entry points below roll back through a hook that reaches application code: the
 * `destroyMotion` hook disposes a `CreatedTrigger` whose `dispose` closes over a host-owned
 * `ScrollSource` unsubscribe, and `disposeTrack` disposes a compiled `Track`. A host whose
 * teardown throws must not be able to replace the diagnosis with its own unrelated failure.
 *
 * Suppress and attach, never suppress and drop. When the rollback succeeds the rejection is
 * rethrown untouched, so every existing message and error type contract holds. When it fails, one
 * error carries both, which is the collect-then-report-once shape `Engine`'s clock consumer
 * fanout already uses, so no new failure shape is invented here. See ADR-035.
 */
function rejectAfterRollback(rejection: unknown, rollback: () => void): never {
  try {
    rollback();
  } catch (rollbackFailure) {
    // The rejection's message comes first, verbatim, so a caller that anchored on it before a
    // rollback could fail still matches it. Both facts stay first-class in `errors`, in the order
    // they happened, and the rejection itself is not mutated: it is thrown from the graph layer,
    // which does not own this failure and should not look like it does.
    const errors = [rejection, rollbackFailure];
    const detail = describeError(rollbackFailure);
    throw new AggregateError(errors, `${describeError(rejection)} Rollback failed: ${detail}`);
  }
  throw rejection;
}
export class ProjectRuntime {
  readonly #project: ProjectDefinition;
  readonly #graph: GraphRuntime;
  readonly #instances = new Map<string, object>();
  readonly #tracks = new Map<string, TrackEntry>();
  readonly #motions = new Map<string, MotionDefinition>();
  readonly #schemaOwner = {};
  #nextToken = 1;
  readonly #diagnostics: Diagnostics;
  readonly #setProgress: (nodeId: string, progress: number) => void;
  readonly #compileTrack: ((track: TrackDefinition, nodeId?: string) => void) | undefined;
  readonly #disposeTrack: ((nodeId: string) => void) | undefined;
  readonly #stageTrack: ((track: TrackDefinition, nodeId: string) => StagedTrack) | undefined;
  readonly #addMotionTrack:
    | ((motionId: string, trackId: string, duration?: number) => void)
    | undefined;
  readonly #replaceMotionTrack:
    | ((motionId: string, trackId: string, duration?: number) => void)
    | undefined;
  readonly #removeMotionTrack: ((motionId: string, trackId: string) => void) | undefined;
  readonly #createMotion: ((definition: MotionDefinition) => void) | undefined;
  readonly #destroyMotion: ((motionId: string) => void) | undefined;
  readonly #disposeComposition: () => void;
  #disposed = false;
  constructor(project: ProjectDefinition, options: ProjectRuntimeOptions) {
    this.#project = project;
    for (const motion of project.motions) {
      this.#motions.set(motion.id, motion);
      for (const track of motion.tracks)
        this.#tracks.set(qualifyMotionTrack(motion.id, track.id).value, {
          track,
          owner: this.#schemaOwner,
          motionId: motion.id,
          token: this.#nextToken++,
        });
    }
    for (const track of project.freeTracks ?? [])
      this.#tracks.set(qualifyFreeTrack(track.id).value, {
        track,
        owner: this.#schemaOwner,
        token: this.#nextToken++,
      });
    this.#setProgress = options.setProgress ?? (() => undefined);
    this.#compileTrack = options.compileTrack;
    this.#disposeTrack = options.disposeTrack;
    this.#stageTrack = options.stageTrack;
    this.#addMotionTrack = options.addMotionTrack;
    this.#replaceMotionTrack = options.replaceMotionTrack;
    this.#removeMotionTrack = options.removeMotionTrack;
    this.#createMotion = options.createMotion;
    this.#destroyMotion = options.destroyMotion;
    this.#disposeComposition = options.disposeComposition ?? (() => undefined);
    this.#diagnostics = new Diagnostics(options.diagnosticsCapacity);
    try {
      this.#graph = new GraphRuntime(project, options.clock, options.compose, {
        scheduler: options.scheduler,
        onClockTick: options.onClockTick,
        graphBuilder: options.graphBuilder,
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
  mount(nodeId: string, instance: object = {}): object {
    this.#assertLive();
    if (this.#instances.has(nodeId)) throw new TypeError(`Node "${nodeId}" is already mounted.`);
    this.#graph.attach(nodeId);
    this.#instances.set(nodeId, instance);
    return instance;
  }
  unmount(nodeId: string): void {
    this.#assertLive();
    if (!this.#instances.has(nodeId)) return;
    this.#instances.delete(nodeId);
    this.#graph.detach(nodeId);
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
    if (this.#motions.has(definition.id))
      throw new TypeError(`Motion "${definition.id}" already exists.`);
    const accepted = { ...definition, tracks: [] };
    const next = new Map(this.#motions);
    next.set(accepted.id, accepted);
    // Build the Motion before committing anything. A driver that cannot be created, such as a
    // scroll trigger with no registered source, must not leave a definition or a graph node
    // behind: addTrack would accept the id, compile a Track, replace the graph, and only then
    // fail from a hook, one layer too late to name the real cause. Mirrors #addTrack, which
    // compiles first and disposes on graph rejection. See ADR-032.
    this.#createMotion?.(accepted);
    try {
      this.#graph.replaceGraph(this.#snapshot(this.#tracks, next));
    } catch (error) {
      // The destroyMotion hook is already the exact rollback set -- it releases the clock
      // consumer, disposes the created trigger, disposes the Motion, and drops the map entry --
      // and it is a no-op for an absent id, so no second rollback owner is introduced. It is also
      // application code, which is why it runs inside the rejection owner. See ADR-035.
      rejectAfterRollback(error, () => this.#destroyMotion?.(accepted.id));
    }
    this.#motions.set(accepted.id, accepted);
    return Object.freeze({ id: accepted.id });
  }
  destroyMotion(motionId: string): void {
    this.#assertLive();
    if (!this.#motions.has(motionId)) throw new TypeError(`Unknown motion "${motionId}".`);
    const owned = [...this.#tracks.entries()].filter(([, entry]) => entry.motionId === motionId);
    if (owned.length)
      throw new TypeError(
        `Motion "${motionId}" still has ${owned.length} track(s). Remove them before destroying it.`,
      );
    const next = new Map(this.#motions);
    next.delete(motionId);
    this.#graph.replaceGraph(this.#snapshot(this.#tracks, next));
    this.#motions.delete(motionId);
    this.#destroyMotion?.(motionId);
  }
  addTrack(track: TrackDefinition, options?: { motionId?: string }): TrackHandle {
    return this.#addTrack(track, this.#schemaOwner, options);
  }
  track(nodeId: string): TrackHandle {
    this.#assertLive();
    const entry = this.#tracks.get(nodeId);
    if (!entry) throw new TypeError(`Unknown graph node "${nodeId}".`);
    return this.#handle(nodeId, entry.token);
  }
  adopt(
    track: TrackDefinition,
    owner: object,
    options?: { motionId?: string },
  ): { readonly id: string; readonly track: TrackDefinition } {
    const handle = this.#addTrack(track, owner, options);
    return Object.freeze({ id: handle.id, track: handle.track });
  }
  destroyAdopted(nodeId: string, owner: object): void {
    this.#assertLive();
    const entry = this.#tracks.get(nodeId);
    if (!entry || entry.owner !== owner)
      throw new TypeError(
        !entry
          ? `Node "${nodeId}" is not adopted.`
          : `Only the adopting owner can destroy "${nodeId}".`,
      );
    this.#removeTrack(nodeId, entry.token);
  }
  dependantsOf(nodeId: string): readonly string[] {
    this.#assertLive();
    return Object.freeze(
      this.#graph.graph.nodes
        .filter((node) => node.edges.some((edge) => edge.sourceId === nodeId))
        .map((node) => node.id),
    );
  }
  #addTrack(track: TrackDefinition, owner: object, options?: { motionId?: string }): TrackHandle {
    this.#assertLive();
    const motionId = options?.motionId;
    if (motionId !== undefined && !this.#motions.has(motionId))
      throw new TypeError(`Unknown motion "${motionId}".`);
    const id =
      motionId !== undefined
        ? qualifyMotionTrack(motionId, track.id).value
        : qualifyFreeTrack(track.id).value;
    if (this.#tracks.has(id)) throw new TypeError(`Track "${id}" already exists.`);
    const validation = validateTrackDefinition(track, `addTrack(${track.id})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const accepted = validation.value;
    const token = this.#nextToken++;
    const next = new Map(this.#tracks);
    next.set(id, { track: accepted, owner, motionId, token });
    this.#compileTrack?.(accepted, id);
    try {
      this.#graph.replaceGraph(this.#snapshot(next, this.#motions));
    } catch (error) {
      // disposeTrack is application code too, and a compiled Track whose dispose throws must not
      // hide the rule that rejected the candidate. Same owner, same shape as addMotion, because a
      // rollback that can outrank its trigger is one defect rather than two. See ADR-035.
      rejectAfterRollback(error, () => this.#disposeTrack?.(id));
    }
    this.#tracks.set(id, { track: accepted, owner, motionId, token });
    // Must run after compileTrack: Motion resolves by id against the live compiled map, so an
    // earlier call would resolve nothing and reject the add. See ADR-031.
    if (motionId !== undefined) this.#addMotionTrack?.(motionId, id, accepted.duration);
    this.mount(id);
    return this.#handle(id, token);
  }
  #handle(id: string, token: number): TrackHandle {
    const runtime = this;
    const active = () => runtime.#tracks.get(id)?.token === token;
    return Object.freeze({
      id,
      get track(): TrackDefinition {
        const entry = runtime.#tracks.get(id);
        if (!entry || entry.token !== token)
          throw new TypeError(`Track "${id}" is no longer live.`);
        return entry.track;
      },
      remove: () => {
        if (active()) runtime.#removeTrack(id, token);
      },
      replace: (next: TrackDefinition) => {
        if (active()) runtime.#replaceTrack(id, token, next);
      },
      addObserve: (observation: ObservationDefinition) => {
        if (active()) runtime.#replaceWithObservation(id, token, observation, true);
      },
      removeObserve: (observation: ObservationDefinition) => {
        if (active()) runtime.#replaceWithObservation(id, token, observation, false);
      },
    });
  }
  #removeTrack(id: string, token: number): void {
    this.#assertLive();
    const entry = this.#tracks.get(id);
    if (!entry || entry.token !== token) return;
    const next = new Map(this.#tracks);
    next.delete(id);
    this.#graph.replaceGraph(this.#snapshot(next, this.#motions));
    this.#tracks.delete(id);
    this.#instances.delete(id);
    this.#graph.evictNode(id);
    this.#disposeTrack?.(id);
    if (entry.motionId !== undefined) this.#removeMotionTrack?.(entry.motionId, id);
  }
  #replaceTrack(id: string, token: number, next: TrackDefinition): void {
    const entry = this.#tracks.get(id);
    if (!entry || entry.token !== token) return;
    const expected =
      entry.motionId !== undefined
        ? qualifyMotionTrack(entry.motionId, next.id).value
        : qualifyFreeTrack(next.id).value;
    if (expected !== id) throw new TypeError(`Replacement must preserve node id "${id}".`);
    const validation = validateTrackDefinition(next, `replaceTrack(${id})`);
    if (!validation.valid || !validation.value)
      throw new TypeError(describeDiagnostics(validation.diagnostics));
    const accepted = validation.value;
    const replaced = new Map(this.#tracks);
    replaced.set(id, { ...entry, track: accepted });

    // The compiled-map owner publishes a prepared replacement while retaining the displaced Track.
    // Motion must see that staged instance because it resolves and seeds by id. The graph is the
    // final acceptance step; only after it accepts can the old compiled Track be released.
    const staged = this.#stageTrack?.(accepted, id);
    const motionId = entry.motionId;
    let motionReplaced = false;
    try {
      if (motionId !== undefined) {
        this.#replaceMotionTrack?.(motionId, id, accepted.duration);
        motionReplaced = true;
      }
      this.#graph.replaceGraph(this.#snapshot(replaced, this.#motions));
    } catch (error) {
      const rollbackSteps: (() => void)[] = [];
      if (staged !== undefined) rollbackSteps.push(() => staged.rollback());
      // Republish the displaced compiled Track before restoring Motion: its restore call resolves
      // and seeds by id, so the old instance must already be live. See ADR-031 and ADR-045.
      if (motionReplaced && motionId !== undefined)
        rollbackSteps.push(() => this.#replaceMotionTrack?.(motionId, id, entry.track.duration));
      rejectAfterRollback(error, () => runRollbackSteps(rollbackSteps));
    }
    this.#tracks.set(id, { ...entry, track: accepted });
    staged?.commit();
  }
  #replaceWithObservation(
    id: string,
    token: number,
    observation: ObservationDefinition,
    add: boolean,
  ): void {
    const entry = this.#tracks.get(id);
    if (!entry || entry.token !== token) return;
    const observations = [...(entry.track.observes ?? [])];
    const key = observationEdgeKey(observation, id, entry.motionId ?? "~");
    const index = observations.findIndex(
      (candidate) => observationEdgeKey(candidate, id, entry.motionId ?? "~") === key,
    );
    if (add) {
      if (index >= 0) return;
      observations.push(observation);
    } else {
      if (index < 0) return;
      observations.splice(index, 1);
    }
    this.#replaceTrack(id, token, { ...entry.track, observes: observations });
  }
  #snapshot(
    tracks: ReadonlyMap<string, TrackEntry>,
    motions: ReadonlyMap<string, MotionDefinition>,
  ): ProjectDefinition {
    return {
      ...this.#project,
      motions: [...motions.values()].map((motion) => ({
        ...motion,
        tracks: [...tracks.values()]
          .filter((entry) => entry.motionId === motion.id)
          .map((entry) => entry.track),
      })),
      freeTracks: [...tracks.values()]
        .filter((entry) => entry.motionId === undefined)
        .map((entry) => entry.track),
    };
  }
  seek(nodeId: string, progress: number) {
    this.#assertLive();
    this.#setProgress(nodeId, progress);
    const batch = this.#graph.invalidate([nodeId]);
    this.#diagnostics.recordAll(batch.diagnostics);
    return batch;
  }
  invalidate(nodeIds: readonly string[]) {
    this.#assertLive();
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
    this.#graph.dispose();
    this.#disposeComposition();
  }
  #assertLive(): void {
    if (this.#disposed) throw new Error("ProjectRuntime is disposed.");
  }
}
