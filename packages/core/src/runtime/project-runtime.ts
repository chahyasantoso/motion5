import type {
  AuthoredKeyframe,
  AuthoredPluginGroup,
  AuthoredStaticValue,
  Diagnostic,
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
  MotionDefinition,
} from "../contract/v5";
import { readAuthoredLeaf } from "../contract/authored-leaf";
import {
  StaleTrackHandleError,
  type AuthoredValues,
  type LiveValues,
  type TrackHandle,
} from "../contract/track-handle";
import { validateMotionTrigger, validateTrackDefinition } from "../contract/validate-v5";
import type { Clock, ClockTick } from "../ports/clock";
import type { Scheduler } from "../ports/scheduler";
import type { LiveWriteResult } from "../domain/track";
import { flattenAuthoredKeyframes } from "../domain/keyframe-groups";
import { observationEdgeKey } from "../graph/ir";
import { qualifyFreeTrack, qualifyMotionTrack } from "../graph/ids";
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
   * The animated half of the last live write, and nothing else.
   *
   * Retained here rather than inside the compiled Track because the retained definition
   * deliberately does not move for an override, so this is what tells a later write that the
   * animated path still has to run: a revert names no key at all, and without this an
   * `overrideValues({})` would be indistinguishable from a static-only write and would leave a
   * patched timeline patched. A private map entry; no public surface carries it. See ADR-060.
   */
  overlay: Readonly<Record<string, unknown>>;
};
/** No animated write. One frozen value, so the common entry allocates nothing. */
const NO_OVERLAY: Readonly<Record<string, unknown>> = Object.freeze({});
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}
/**
 * The one seam by which a live value reaches the compiled Track this runtime does not own.
 *
 * One hook rather than one per entry point, and that is the ownership statement restored rather than
 * reversed: there is one mechanism, so there is one hook. What separates `setValues` from
 * `overrideValues` is the retained definition, which is this runtime's own, and at the compiled
 * Track it is one boolean. `undefined` for the overlay is a write no animated key is involved in,
 * which is what keeps a static-only write on the path it was already on. See ADR-059 and ADR-060.
 */
export type LiveValueWriter = (
  nodeId: string,
  values: LiveValues,
  overlay: Readonly<Record<string, unknown>> | undefined,
  rebase: boolean,
) => LiveWriteResult | undefined;
export interface ProjectRuntimeOptions {
  readonly clock: Clock;
  readonly scheduler?: Scheduler;
  readonly compose: ComposeResolver;
  readonly interpolated?: (node: GraphNode) => (() => MemberState) | undefined;
  readonly setProgress?: (nodeId: string, progress: number) => void;
  readonly writeValues?: LiveValueWriter;
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
 * The authored static values of `track`, flattened, and nothing else.
 *
 * The mask a live write applies is derived from the retained definition rather than accumulated
 * across calls, and that is what makes `handle.track` and the composition unable to disagree: every
 * static leaf is masked with exactly what the definition says it is, so the key a caller named is
 * the only one that differs, an override cannot outlive the authored value it masked, and an empty
 * record is a clear back to authored truth rather than a hole.
 *
 * An animated leaf is absent by construction, and that is unchanged by the animated key being
 * writable: the mask is still closed to static values, and an animated write travels as an overlay
 * to the interpolator instead.
 *
 * `flattenAuthoredKeyframes` and `readAuthoredLeaf` answer both halves, so nothing here re-derives
 * what a group is or what shape a leaf has. See ADR-049, ADR-050, ADR-059, and ADR-060.
 */
function authoredValues(track: TrackDefinition): Record<string, AuthoredStaticValue> {
  const flattened = flattenAuthoredKeyframes(track.keyframes ?? {});
  const values: Record<string, AuthoredStaticValue> = {};
  for (const [key, property] of Object.entries(flattened.keyframes)) {
    const leaf = readAuthoredLeaf(property);
    if (leaf.kind === "static") values[key] = leaf.value;
  }
  return values;
}
/**
 * One live write, split into the half a mask can carry and the half only the timeline can.
 *
 * Split by leaf shape, through the one function allowed to answer what shape a leaf has, so this
 * layer holds no second opinion about it. The static half is typed as `LiveValues` because that is
 * what a mask may hold; the animated half travels exactly as authored, because filtering it here
 * would make this a second owner of leaf shape and `contract/authored-leaf` is the only one.
 * See ADR-060.
 */
interface LiveWriteHalves {
  readonly statics: LiveValues;
  readonly animated: Readonly<Record<string, unknown>>;
}
function splitAuthoredValues(values: AuthoredValues): LiveWriteHalves {
  const statics: Record<string, AuthoredStaticValue> = {};
  const animated: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    const leaf = readAuthoredLeaf(value);
    if (leaf.kind === "static") statics[key] = leaf.value;
    else animated[key] = value;
  }
  return { statics, animated };
}
/**
 * `track` with `values` written back into the authored record each key came from.
 *
 * The flattened entry carries the group that claimed a leaf, so a grouped value is rewritten inside
 * that group's `values` section and a flat one at the top level. There is no second answer about
 * where an authored key lives: the function that flattened it says so.
 *
 * A key with no flattened entry is skipped rather than invented. It cannot be reached in practice,
 * because `Track` refuses a key that is absent from the resolved authored record before this runs,
 * and inventing a leaf here would make this layer the author.
 */
function withAuthoredValues(track: TrackDefinition, values: AuthoredValues): TrackDefinition {
  const flattened = flattenAuthoredKeyframes(track.keyframes ?? {});
  const keyframes: Record<string, AuthoredKeyframe> = { ...track.keyframes };
  for (const [key, value] of Object.entries(values)) {
    const entry = flattened.entries.find((candidate) => candidate.key === key);
    if (entry === undefined) continue;
    if (entry.group === undefined) {
      keyframes[key] = value;
      continue;
    }
    const group = keyframes[entry.group] as AuthoredPluginGroup;
    keyframes[entry.group] = Object.freeze({
      ...group,
      values: Object.freeze({ ...group.values, [key]: value }),
    });
  }
  return Object.freeze({ ...track, keyframes: Object.freeze(keyframes) });
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
  readonly #writeValuesHook: LiveValueWriter;
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
    const entry = this.#entryOf(nodeId);
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
    next.set(id, { track: accepted, owner, motionId, token, overlay: NO_OVERLAY });
    this.#compileTrack?.(accepted, id);
    try {
      this.#graph.replaceGraph(this.#snapshot(next, this.#motions));
    } catch (error) {
      // disposeTrack is application code too, and a compiled Track whose dispose throws must not
      // hide the rule that rejected the candidate. Same owner, same shape as addMotion, because a
      // rollback that can outrank its trigger is one defect rather than two. See ADR-035.
      rejectAfterRollback(error, () => this.#disposeTrack?.(id));
    }
    this.#tracks.set(id, { track: accepted, owner, motionId, token, overlay: NO_OVERLAY });
    // Must run after compileTrack: Motion resolves by id against the live compiled map, so an
    // earlier call would resolve nothing and reject the add. See ADR-031.
    if (motionId !== undefined) this.#addMotionTrack?.(motionId, id, accepted.duration);
    this.mount(id);
    return this.#handle(id, token);
  }
  /**
   * The entry for a node id, or the refusal for an id this project never had.
   *
   * Separate from `#liveEntry` below on purpose: this answers about an id, which is what the public
   * members that take one ask, and that one answers about a captured token. Both are one lookup
   * with one message rather than a copy per caller.
   */
  #entryOf(nodeId: string): TrackEntry {
    const entry = this.#tracks.get(nodeId);
    if (!entry) throw new TypeError(`Unknown graph node "${nodeId}".`);
    return entry;
  }
  /**
   * The one place that compares a captured token against the live one.
   *
   * `#liveEntry` below is the refusal and this is the probe, so `TrackHandle.live` and every
   * throwing member read the same answer and cannot disagree about the same handle. The `track`
   * getter and the three private mutators each carried their own copy of this comparison, which is
   * how one condition ended up with two public failure contracts; the copies are deleted rather
   * than joined by a fifth. See ADR-056.
   */
  #entryIfLive(id: string, token: number): TrackEntry | undefined {
    const entry = this.#tracks.get(id);
    return entry !== undefined && entry.token === token ? entry : undefined;
  }
  /**
   * The resolver every handle member and every private mutation path goes through.
   *
   * A stale mutator used to report success by doing nothing while the getter failed loudly. Both
   * now arrive here, so the contract is uniform by construction rather than by four call sites
   * agreeing. See ADR-056.
   */
  #liveEntry(id: string, token: number): TrackEntry {
    const entry = this.#entryIfLive(id, token);
    if (entry === undefined) throw new StaleTrackHandleError(id);
    return entry;
  }
  #handle(id: string, token: number): TrackHandle {
    const runtime = this;
    return Object.freeze({
      id,
      get live(): boolean {
        return runtime.#entryIfLive(id, token) !== undefined;
      },
      get track(): TrackDefinition {
        return runtime.#liveEntry(id, token).track;
      },
      remove: () => runtime.#removeTrack(id, token),
      replace: (next: TrackDefinition) => runtime.#replaceTrack(id, token, next),
      addObserve: (observation: ObservationDefinition) =>
        runtime.#replaceWithObservation(id, token, observation, true),
      removeObserve: (observation: ObservationDefinition) =>
        runtime.#replaceWithObservation(id, token, observation, false),
      overrideValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, runtime.#liveEntry(id, token), next, false),
      setValues: (next: AuthoredValues) =>
        runtime.#writeValues(id, runtime.#liveEntry(id, token), next, true),
    });
  }
  #removeTrack(id: string, token: number): void {
    this.#assertLive();
    const entry = this.#liveEntry(id, token);
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
    const entry = this.#liveEntry(id, token);
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
    replaced.set(id, { ...entry, track: accepted, overlay: NO_OVERLAY });

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
    this.#tracks.set(id, { ...entry, track: accepted, overlay: NO_OVERLAY });
    staged?.commit();
  }
  /**
   * The one live-value write path.
   *
   * `rebase` is the only difference between the two entry points: an override leaves the retained
   * definition alone and a `setValues` rewrites it, and the same boolean is what makes the animated
   * half sticky or revertible at the interpolator. Which keys are legal, what the live Track is
   * written with, when the graph is invalidated, and where the diagnostics go are all shared, so the
   * two cannot answer differently, invalidate twice, or record in two places.
   *
   * Order, and it is load-bearing. Validate the rewritten definition when an animated key is named,
   * because an authored stop list is definition-shaped input and `validateKeyframes` owns its shape.
   * Then write through the one hook, which is where every key is classified and refused, so a
   * refusal throws from the layer holding the resolved plugins with nothing written here. Then
   * rewrite the retained entry and its overlay, escalate if the hook declined, and end at one
   * `invalidate`. Nothing can observe the gap, because no flush happens until that invalidate.
   *
   * A static-only write validates nothing and builds nothing, which keeps its cost exactly what it
   * was. No `replaceGraph` on either path. See ADR-059 and ADR-060.
   */
  #writeValues(nodeId: string, entry: TrackEntry, values: AuthoredValues, rebase: boolean) {
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
    // from whether the handle is the live one at all: that was answered above.
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
   * The authored half: the retained `TrackDefinition` moves with the live values, so `handle.track`
   * and the composition cannot disagree, and it still costs one invalidate rather than a staged
   * Track and a graph rebuild. See ADR-059 and ADR-060.
   */
  setValues(nodeId: string, values: AuthoredValues) {
    this.#assertLive();
    return this.#writeValues(nodeId, this.#entryOf(nodeId), values, true);
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
