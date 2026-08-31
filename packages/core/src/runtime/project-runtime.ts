import type {
  AuthoredKeyframe,
  AuthoredPluginGroup,
  AuthoredProperty,
  AuthoredStaticValue,
  Diagnostic,
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
  MotionDefinition,
} from "../contract/v5";
import { readAuthoredLeaf } from "../contract/authored-leaf";
import { readPluginBindings } from "../contract/keyframe-shape";
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
import { flattenAuthoredKeyframes } from "../domain/keyframe-groups";
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
/**
 * One retained Motion, and the token every handle to it captures.
 *
 * The token is drawn from the same `#nextToken` the track entries use, because the staleness
 * machinery here is per-entry rather than per-track-ness: `#liveOf` below answers for both maps, so a
 * motion handle needed a token and a noun rather than a second token policy. See ADR-056.
 *
 * `definition.tracks` is empty for a runtime add by construction and authoritative for a loaded one,
 * which is why no reader trusts it: `#ownedBy` is the one owner of which tracks a motion has.
 */
type MotionEntry = {
  definition: MotionDefinition;
  token: number;
};
/** No animated write. One frozen value, so the common entry allocates nothing. */
const NO_OVERLAY: Readonly<Record<string, unknown>> = Object.freeze({});
/**
 * No authored record. One frozen value, so a track that authors nothing allocates nothing.
 *
 * Stands in for an absent `keyframes` at the one place a group edit reads it, which is what lets
 * `setKeyframeGroup` originate on a track that authors nothing without a branch, and lets
 * `removeKeyframeGroup` answer by identity on one instead of committing an empty record on the way
 * to removing nothing from it.
 */
const EMPTY_KEYFRAMES: AuthoredKeyframes = Object.freeze({});
export interface StagedTrack {
  commit(): void;
  rollback(): void;
}
/**
 * One side effect a structural commit needs in place before the graph is asked to accept it.
 *
 * `revert` is the inverse, and it is optional because two of the categories have nothing to undo:
 * a removal and a motion destroy reach the candidate graph with no hook applied yet, and an empty
 * revert set is what keeps their failures byte-identical to the raw `replaceGraph` throw they used
 * to be.
 *
 * An effect counts as applied only once its `apply` returned. A hook that refused before it wrote
 * anything must not be restored, which is the behaviour `U-7` pins on `replaceMotionTrack` and
 * `RA-2` pins on `createMotion`.
 */
interface SchemaEffect {
  readonly apply: () => void;
  readonly revert?: () => void;
}
/**
 * One structural transaction, as data, and now only the pair the graph is asked to accept.
 *
 * `tracks` and `motions` are what the graph is asked to accept and, once it has, what the retained
 * maps become. They are adopted from the same pair that built the snapshot rather than rewritten
 * beside it, so the committed graph and the maps cannot drift: `RA-7` compares them by identity,
 * because a fresh definition object for an untouched entry is exactly what costs the incremental
 * builder its cache hit. See ADR-058.
 *
 * What a plan no longer carries is a hook list. A1 gave every entry point one transaction owner and
 * left each of them assembling its own effects, settle steps and seeds, and those lists compose only
 * while a commit carries exactly one change. A recipe that adds a track and then edits it would
 * accumulate an `addMotionTrack` in the settle steps, from the add, and a `replaceMotionTrack` in
 * the effects, from the edit; effects run before the graph is asked and settle steps run after it
 * accepted, so the Motion would be asked to replace a track it has not been told about yet. So a
 * commit's hooks are derived from what it commits, by `#derive` below, and every entry point is a
 * map builder that names no hook at all. `RA-65` is the first case that can tell the two apart.
 * See ADR-064.
 */
interface SchemaPlan {
  readonly tracks: ReadonlyMap<string, TrackEntry>;
  readonly motions: ReadonlyMap<string, MotionEntry>;
}
/**
 * What one accepted pair costs, and the only thing in this file that names a hook.
 *
 * `effects` are applied before the graph sees the candidate and reverted in **apply order** when it
 * refuses. Apply order rather than reverse, and that is load-bearing rather than incidental: a
 * replacement republishes the displaced compiled Track before restoring the Motion entry, because
 * the restore resolves and seeds by id. `settle` runs only after acceptance.
 * See ADR-031 and ADR-045.
 *
 * `touched` names the nodes this transaction changed, and it is seeded into one flush once the
 * commit settled. Empty is a real answer rather than a default: a motion add or destroy derives no
 * node and no edge at all, and a removal's node is gone with nothing left depending on it, because
 * `finalizeGraph` would have refused the candidate otherwise.
 */
interface SchemaCommit {
  readonly effects: readonly SchemaEffect[];
  readonly settle: readonly (() => void)[];
  readonly touched: readonly string[];
}
/**
 * The pending pair one open recipe is staging, and the whole of the transaction owner's state.
 *
 * Mutable in exactly its two fields, because `#commit` merges into it rather than queueing an op:
 * every entry point builds its candidate pair from whatever is open, so the pair that is open is
 * always the answer the recipe has produced so far, and there is no op log to replay. See ADR-064.
 */
interface OpenTransaction {
  tracks: ReadonlyMap<string, TrackEntry>;
  motions: ReadonlyMap<string, MotionEntry>;
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
/**
 * How this layer asks what an authored record resolves to.
 *
 * One hook, one implementation. `PluginRegistry.resolveForKeyframes` is the only thing that answers
 * it, and it stays the only owner of key ownership, slot declaration and the plugin chain; this
 * runtime depends on a function so that it can read that answer without holding a registry it has no
 * other reason to hold. See ADR-062.
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
   * Total, for the reason the option it forwards to gives: the supplier may not answer "this node
   * has none", because the publisher's report for a member with no such function names the seam
   * rather than the node. The function it returns resolves the compiled Track per call.
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
   * present: a supplier allowed to answer "I have nothing for this record" would make the predicate
   * that reads it depend on which of two absences it was handed. With no seam every replacement
   * builds, exactly as it did before the predicate existed, which is what keeps every prior
   * registry-free rig byte-identical.
   *
   * The second parameter is a diagnostics path rather than a node id, and that is the one thing
   * about this signature worth stating: `engine.ts` already asks the registry with
   * `<node>.keyframes` there, so an option declared to take an id would either mis-cite every
   * diagnostic it produced or force a second normalization at the wiring site. See ADR-062.
   */
  readonly resolveKeyframes?: KeyframeResolver;
  readonly addMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly replaceMotionTrack?: (motionId: string, trackId: string, duration?: number) => void;
  readonly removeMotionTrack?: (motionId: string, trackId: string) => void;
  /**
   * The two tier 0 seams: a Motion's trigger and its stagger, neither of which any node carries.
   *
   * Two hooks rather than one, because which one an edit asks is half of what the edit claims. A
   * stagger routed through the trigger hook would dispose a live driver and resubscribe a host
   * source for a field no driver reads, and one hook taking both fields could not tell that from a
   * correct edit. Named beside the `addMotionTrack` family, and named for what they do: a trigger
   * carries a disposable resource behind it, a stagger is a bare field.
   */
  readonly replaceMotionTrigger?: (motionId: string, definition: MotionDefinition) => void;
  readonly setMotionStagger?: (motionId: string, stagger?: number) => void;
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
 * Refuses a recipe opened inside a recipe.
 *
 * Joining the open one silently would mean the inner `edit` returns before anything it asked for has
 * committed, so a helper's cost and its guarantees would depend on whether something above it had
 * opened a transaction. That is the invisible-context shape that cut `setMotion`, cut `setTrack` and
 * kept `setKeyframe` separate from `setKeyframeGroup`. See ADR-064.
 */
function nestedTransaction(): never {
  const use = "Finish it before opening another.";
  throw new TypeError(`schema-transaction-nested: A recipe is already open. ${use}`);
}
/**
 * Refuses an edit that applies immediately from inside a recipe.
 *
 * Neither tier this reaches is a structural commit: tier 0 reaches the layer that owns the created
 * trigger and the clock consumer, and tier 2 ends at its own `invalidate`. Both therefore apply
 * immediately and would survive an abort. Deferring them into the settle steps was read and refused,
 * because a settle step cannot refuse: it would move `setTrigger`'s failure to after the graph
 * committed and after the retained definition moved, which is the opposite of the contract `RA-35`
 * pins. One condition has one failure contract, so the verb is refused by name inside a recipe
 * rather than given a second, weaker one outside it. See ADR-064.
 */
function immediateInTransaction(verb: string): never {
  const detail = `"${verb}" applies immediately and cannot travel with a recipe.`;
  throw new TypeError(`schema-transaction-immediate: ${detail} Call it outside edit().`);
}
/**
 * Refuses a binding edit addressed at a plugin this node authors no group for.
 *
 * The boundary between this tier's two levels, and it is a refusal rather than a creation on
 * purpose. Originating a binding is `setKeyframeGroup`'s job, because a plugin group holding only
 * half its data may be transiently invalid, and one verb whose cost and refusal set depend on
 * whether the group already existed is the shape this project has declined to build three times.
 *
 * Answered from the retained record on this node, so it stays a different question from anything
 * `PluginRegistry` answers about a candidate: whether the plugin exists at all, and whether it
 * declares the slot, belong to the registry and arrive from it at the recompile. See ADR-062.
 */
function unboundGroup(nodeId: string, plugin: string): never {
  const use = "Use setKeyframeGroup to originate one.";
  throw new TypeError(`keyframe-group-unbound: "${nodeId}" authors no "${plugin}" group. ${use}`);
}
/**
 * Refuses a binding edit addressed at a solver's goals slot by name.
 *
 * That slot holds one source per chain leaf, and both spellings a caller could reach it with through
 * `setRequire` are wrong in a way this layer can see. Without a member key the verb can only write a
 * scalar there, which `keyframes-targets-shape` refuses at load, so the candidate would be a record
 * the loader rejects. With one it writes the right shape through the wrong verb, and then one
 * question has two mechanisms: `setGoal` is the owner, so the weaker spelling is deleted rather than
 * documented as discouraged.
 *
 * Scoped to the slot rather than to the plugin that happens to own it, because the reservation is
 * about what the slot holds. Every other slot of that same group stays reachable through
 * `setRequire`. See ADR-057 and ADR-063.
 */
function reservedGoalSlot(plugin: string, slot: string): never {
  const use = "Use setGoal to bind one entry of it, or removeGoal to drop one.";
  throw new TypeError(
    `keyframe-goal-slot-reserved: Slot "${slot}" of "${plugin}" holds a solver's goals. ${use}`,
  );
}
/**
 * Refuses a group edit addressed at a name this node authors as an ordinary property.
 *
 * The entry-level twin of `keyframe-require-shape`, and the primitive's own for the same reason: a
 * plugin name and a keyframe name share one namespace, both shapes are legal there, and nothing
 * below this layer can catch either direction. Writing a group over a property drops every stop the
 * author wrote; removing one deletes a property the caller never named. Crossing an entry's shape is
 * a `replace()`, where a whole definition is validated. See ADR-063.
 */
function propertyEntry(nodeId: string, plugin: string): never {
  const use = "Use replace() to change an entry's shape.";
  throw new TypeError(
    `keyframe-entry-shape: "${nodeId}" authors "${plugin}" as a property, not a group. ${use}`,
  );
}
/**
 * The bindings `track` authored, as a handle reports them.
 *
 * `readPluginBindings` is the one reader of the authored group shape and stays the one reader, so
 * this derives nothing: it drops the diagnostics path, which belongs to the layer that cites it, and
 * keeps everything that identifies the binding, `memberKey` included. Total by construction, because
 * that reader answers with an empty list for a record that authors no group. See ADR-044 and ADR-057.
 */
function requireViews(track: TrackDefinition): readonly RequireView[] {
  return Object.freeze(
    readPluginBindings(track.keyframes ?? {}).map(({ plugin, slot, source, memberKey }) =>
      Object.freeze({ plugin, slot, source, ...(memberKey === undefined ? {} : { memberKey }) }),
    ),
  );
}
/**
 * The authored static values of `track`, flattened, and nothing else.
 *
 * The mask a live write applies is derived from the retained definition rather than accumulated
 * across calls, and that is what makes `handle.definition` and the composition unable to disagree:
 * every static leaf is masked with exactly what the definition says it is, so the key a caller named
 * is the only one that differs, an override cannot outlive the authored value it masked, and an empty
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
/** One retained Motion definition, writable, for the two fields a tier 0 edit moves. */
type MutableMotion = { -readonly [K in keyof MotionDefinition]: MotionDefinition[K] };
/** One retained track definition, writable, for the one field an authored edit moves. */
type MutableTrack = { -readonly [K in keyof TrackDefinition]: TrackDefinition[K] };
/** Builds a track with an edited authored keyframe record, omitting an empty record. */
function withKeyframes(track: TrackDefinition, keyframes: AuthoredKeyframes): TrackDefinition {
  const next: MutableTrack = { ...track };
  if (Object.keys(keyframes).length === 0) delete next.keyframes;
  else next.keyframes = keyframes;
  return Object.freeze(next);
}
/**
 * Whether two authored triggers are the same trigger.
 *
 * Field by field with `Object.is`, because `MotionDefinition.trigger` is structurally open by design
 * and a caller that rebuilt the record it already had is asking for nothing. Reference equality
 * alone would make a redundant edit depend on whether the caller kept its object, and a deep walk
 * would be a second opinion about a shape whose fields are the primitives `validateMotionTrigger`
 * has just accepted. An extension key holding an object therefore reads as a change, which is the
 * safe direction: the edit runs rather than being skipped.
 */
function sameTrigger(
  current: MotionDefinition["trigger"],
  next: MotionDefinition["trigger"],
): boolean {
  const fields = new Map<string, unknown>(Object.entries(next));
  const entries = Object.entries(current);
  if (entries.length !== fields.size) return false;
  return entries.every(([key, value]) => fields.has(key) && Object.is(fields.get(key), value));
}
/**
 * `definition` with its stagger at `stagger`, and with the field absent when that is undefined.
 *
 * A cleared stagger leaves no key behind, because the authored field is optional and a Motion
 * reporting `stagger: undefined` would answer a shape no author can write. Copied and deleted from
 * rather than rebuilt out of named fields, so a definition carrying anything else keeps it.
 */
function withStagger(definition: MotionDefinition, stagger: number | undefined): MotionDefinition {
  const next: MutableMotion = { ...definition };
  if (stagger === undefined) delete next.stagger;
  else next.stagger = stagger;
  return Object.freeze(next);
}
/**
 * Rejects an operation whose rollback can fail on its own.
 *
 * Every structural commit rolls back through hooks that reach application code: the `destroyMotion`
 * hook disposes a `CreatedTrigger` whose `dispose` closes over a host-owned `ScrollSource`
 * unsubscribe, and `disposeTrack` disposes a compiled `Track`. A host whose teardown throws must
 * not be able to replace the diagnosis with its own unrelated failure.
 *
 * Suppress and attach, never suppress and drop. When the rollback succeeds the rejection is
 * rethrown untouched, so every existing message and error type contract holds, including the two
 * categories that have nothing to revert at all. When it fails, one error carries both, which is
 * the collect-then-report-once shape `Engine`'s clock consumer fanout already uses, so no new
 * failure shape is invented here. See ADR-035.
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
  readonly #motions = new Map<string, MotionEntry>();
  readonly #schemaOwner = {};
  #nextToken = 1;
  /**
   * The open transaction, and the one piece of state `edit` adds to this class.
   *
   * Present exactly while a recipe is running. Nothing else about the runtime is duplicated for it:
   * the pending pair is the same shape the retained maps are, so every entry point reads it through
   * the two accessors below and no verb learns that it is inside a recipe. See ADR-064.
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
   * which is what makes a two-step edit possible at all: the second step resolves against what the
   * first staged, and a handle issued inside the recipe answers `live` truthfully on both sides of
   * an abort, because its entry is in the pending pair and never in the retained one. The two
   * in-place tiers keep reading the retained maps, and they are refused by name inside a recipe
   * rather than allowed to write through the open one. See ADR-064.
   */
  #readTracks(): ReadonlyMap<string, TrackEntry> {
    return this.#open?.tracks ?? this.#tracks;
  }
  /** The same question about the other map, and the same reason. */
  #readMotions(): ReadonlyMap<string, MotionEntry> {
    return this.#open?.motions ?? this.#motions;
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
  /**
   * Runs `recipe` as one transaction and commits what it staged exactly once.
   *
   * The verb issue #223 says has no vocabulary: build a project's structure up incrementally from
   * nothing, driven by runtime code, with each step individually correct and the whole thing
   * committed once. `n` authored ops across `m` tracks cost one candidate build, one
   * `GraphBinding.replace`, one `ObservationState.commit`, one side-effect ordering with one
   * rollback, and one flush, where the same sequence spelled one op at a time costs `n` of each.
   *
   * Abort semantics come free from A1 rather than from a compensation path: only `#commit` registers
   * a token and only a commit applies an effect, so a throw inside the recipe commits nothing,
   * reaches no hook, and issues no live handle. The throw travels verbatim, because the recipe's own
   * failure is the reason the caller can act on.
   *
   * A recipe that staged nothing commits nothing, answered by identity on the pair rather than by a
   * dirty flag: an op that was a no-op hands the map it was given straight back, so the pair a
   * recipe ends on is the pair it opened with and there is nothing to spend a candidate build on.
   * See `RA-66` and ADR-064.
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
   * Every member forwards to the member this class already has, deliberately: a second `addTrack`
   * would be a second owner of what an add costs, and the whole point of this slice is that there is
   * one. What the object buys is the narrowing -- `mount`, `seek`, `subscribe` and `dispose` are not
   * reachable through it, because none of them is a structural change and none of them can be undone
   * by a recipe that throws. `addMotion` resolves the handle it returns through `motion` for the
   * same reason: the id is what the entry point answers and the handle is what one lookup makes of
   * it. See ADR-064.
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
    const motions = new Map(this.#readMotions());
    motions.set(accepted.id, { definition: accepted, token: this.#nextToken++ });
    // A map builder and nothing else. Which hooks a created Motion costs, and that the driver is
    // built before the graph is asked so a trigger that cannot be created leaves no definition and
    // no node behind, are `#derive`'s answer now. See ADR-032 and ADR-064.
    this.#commit({ tracks: this.#readTracks(), motions });
    return Object.freeze({ id: accepted.id });
  }
  destroyMotion(motionId: string): void {
    this.#assertLive();
    if (!this.#readMotions().has(motionId)) throw new TypeError(`Unknown motion "${motionId}".`);
    this.#removeMotion(motionId);
  }
  /**
   * The resolver for one Motion, refusing an id this project never had.
   *
   * Separate from `tryMotion` below for the reason `#entryOf` is separate from `#entryIfLive`: this
   * one refuses and that one answers, so a caller whose miss is expected rather than mistaken guards
   * instead of catching, and neither grows a copy of the other's lookup.
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
   * The same resolution as `track` above without the refusal.
   *
   * The probe an upsert is written with: a caller branches on the answer at its own call site, which
   * is what keeps a single `setTrack` verb -- whose cost and refusal set would depend on whether the
   * node already exists -- out of this surface.
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
    const tracks = new Map(this.#readTracks());
    tracks.set(id, { track: accepted, owner, motionId, token, overlay: NO_OVERLAY });
    // A map builder and nothing else. That the compile runs before the graph is asked, that the
    // Motion entry is written after it because Motion resolves by id against the live compiled map,
    // and that the mount settles last are all `#derive`'s answer now, derived from the fact that
    // this id is absent from the retained pair. That is also what makes an add-then-remove inside
    // one recipe cost nothing at all rather than mounting a node the committed graph lacks.
    // See ADR-031 and ADR-064.
    this.#commit({ tracks, motions: this.#readMotions() });
    return this.#handle(id, token);
  }
  /**
   * Every readable track a motion owns, in commit order, and the one owner of that question.
   *
   * Four readers ask it: the committed snapshot, the count in the destroy refusal, and both
   * `MotionHandle.definition` and `MotionHandle.trackIds`. Each carried its own filter before, which
   * is how a motion could report `tracks: []` while owning three, or a refusal could name a count no
   * handle agreed with. It takes the map explicitly because a plan builder asks about the tracks it
   * is about to commit while a handle asks about the readable ones, and reading `#tracks` here would
   * make that difference invisible at the call site.
   */
  #ownedBy(
    tracks: ReadonlyMap<string, TrackEntry>,
    motionId: string,
  ): readonly (readonly [string, TrackEntry])[] {
    return [...tracks.entries()].filter(([, entry]) => entry.motionId === motionId);
  }
  /**
   * The entry for a node id, or the refusal for an id this project never had.
   *
   * Separate from `#liveEntry` below on purpose: this answers about an id, which is what the public
   * members that take one ask, and that one answers about a captured token. Both are one lookup
   * with one message rather than a copy per caller.
   */
  #entryOf(nodeId: string): TrackEntry {
    const entry = this.#readTracks().get(nodeId);
    if (!entry) throw new TypeError(`Unknown graph node "${nodeId}".`);
    return entry;
  }
  /**
   * The one place in this file that compares a captured token against the live one.
   *
   * Generic over the entry rather than over the map it came from, because both retained kinds carry a
   * token and the comparison is the same question about either. The track probe and the motion probe
   * below are two names for two maps, not two copies of the rule: `SH-7` measures the number of
   * comparisons in this module, and a second one here is what it exists to fail on. See ADR-056.
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
   * The `definition` getter and the three private mutators each carried their own comparison, which
   * is how one condition ended up with two public failure contracts; the copies are deleted rather
   * than joined by a fifth. Asked of the pending pair while a recipe is open, which is what makes a
   * handle issued inside one live for the rest of the recipe and never live after an abort.
   * See ADR-056 and ADR-064.
   */
  #entryIfLive(id: string, token: number): TrackEntry | undefined {
    return this.#liveOf(this.#readTracks(), id, token);
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
  #motionIfLive(id: string, token: number): MotionEntry | undefined {
    return this.#liveOf(this.#readMotions(), id, token);
  }
  #liveMotion(id: string, token: number): MotionEntry {
    const entry = this.#motionIfLive(id, token);
    if (entry === undefined) throw new StaleMotionHandleError(id);
    return entry;
  }
  /**
   * This handle's motion id, once the handle is known to be live.
   *
   * One owner, because four members of the handle need exactly this and each spelling of it is also
   * the staleness check: reading the id and refusing a stale handle are the same call, so there is no
   * order for a member to get wrong and no member that can forget.
   */
  #liveId(motionId: string, token: number): string {
    return this.#liveMotion(motionId, token).definition.id;
  }
  /**
   * The Motion definition as it currently stands, tracks included.
   *
   * Projected through `#ownedBy` rather than answered from the entry, because the entry a runtime add
   * accepted carries an empty list by construction: a handle answering with it would report no tracks
   * for a motion that owns three. Same owner the committed snapshot reads, so the two cannot
   * disagree.
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
   * The refusal counts through `#ownedBy`, so the number it names is the list `MotionHandle.trackIds`
   * shows, and inside a recipe it counts the tracks that recipe has staged rather than the retained
   * ones: a Motion whose last track the same recipe removed is destroyable in it.
   */
  #removeMotion(motionId: string): void {
    const owned = this.#ownedBy(this.#readTracks(), motionId);
    if (owned.length)
      throw new TypeError(
        `Motion "${motionId}" still has ${owned.length} track(s). Remove them before destroying it.`,
      );
    const motions = new Map(this.#readMotions());
    motions.delete(motionId);
    this.#commit({ tracks: this.#readTracks(), motions });
  }
  /**
   * Refuses `verb` while a recipe is open.
   *
   * One guard for both in-place tiers, because both are refused for one reason rather than two: the
   * edit applies immediately and would survive an abort. Named at the verb rather than at the tier,
   * so the message tells a caller which call to move out of the recipe. See ADR-064.
   */
  #refuseInsideRecipe(verb: string): void {
    if (this.#open !== undefined) immediateInTransaction(verb);
  }
  /**
   * Installs a Motion's trigger, and reaches no node and no edge doing it.
   *
   * Tier 0, which is a claim about the mechanism rather than about the cost: `trigger` appears in no
   * `GraphNode`, so there is no candidate graph for a commit to accept and `#commit` is the wrong
   * path rather than an expensive one. `RA-33` measures that as a `replaceGraph` call count. It is
   * also why the verb is refused inside a recipe: an edit that reaches the driver layer immediately
   * cannot be undone by a recipe that throws. See `RA-68`.
   *
   * The order is the whole contract. The recipe refusal first, because it is about whether the verb
   * is reachable at all. Then staleness, through the one resolver every member of the handle reads.
   * Then the trigger's own validity, asked of `validateMotionTrigger`, which is the owner `addMotion`
   * already asks rather than a copy of it, so a refusal costs no teardown at all: a verb that
   * released the live driver and then refused the replacement would leave the Motion with none and
   * no way back. Then the redundant edit, which asks the seam nothing, because installing the trigger
   * the Motion already has means disposing a live driver and resubscribing a host source the caller
   * cannot see and did not ask for. Then the seam itself, whose failure is reported verbatim rather
   * than wrapped. The retained definition moves last, once nothing that can refuse is left.
   * See ADR-035 and ADR-061.
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
   * rule to ask. `validateV5` has never had one for `stagger`, and `Motion` refuses a value that is
   * not finite and non-negative at construction, so the seam is where that refusal already lives and
   * a copy here would be a second owner of it. The seam is therefore asked before the retained
   * definition moves, which is what keeps a refused edit from being recorded as one.
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
   * Every member resolves the entry before it reads an argument, which is what makes staleness the
   * first answer rather than a second one.
   *
   * `tryTrack` refuses here as well, and that is deliberate. The probe never throws about an id it
   * cannot find, but whether this handle is the live one at all is a different question, and it is
   * answered before any id is looked at.
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
   * Drops one node from the pair, and names no hook.
   *
   * The eviction, the dispose and the Motion deregistration are one settle step derived from the id
   * being absent from the committed pair, because the order inside that step is not a sequence of
   * independent commitments: the entry is already gone by the time any of them runs. See ADR-064.
   */
  #removeTrack(id: string, token: number): void {
    this.#assertLive();
    this.#liveEntry(id, token);
    const tracks = new Map(this.#readTracks());
    tracks.delete(id);
    this.#commit({ tracks, motions: this.#readMotions() });
  }
  /**
   * The registry's answer about one authored record, or nothing when no registry was injected.
   *
   * The diagnostics path is spelled exactly as `compileTrack` spells it, because the seam's second
   * parameter is a path rather than a node id: a refusal citing a bare node id where the compile
   * path cites `<node>.keyframes` would be two spellings of one location, and an author cannot look
   * up the second one.
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
   * The resolve is validation and is never skipped. `compileTrack` reuses a live entry and returns
   * early, so the staging seam is the only path on which a `PluginRegistry` ever sees an
   * already-compiled node's candidate record, and a predicate that skipped the resolve would delete
   * a validator rather than a cost: an undeclared slot would ship a real `GraphEdge` into a consumer
   * that does not exist, refused by name only when someone reloaded the document that same record
   * now fails to load, which is the symptomless misconfiguration this project refuses at load time.
   * So the candidate is resolved here, refused here, and only then read as data. See ADR-062.
   *
   * Asked from `#derive` now rather than from `#replaceTrack`, which moves it from once per op to
   * once per committed replacement and leaves it exactly where it was for every caller outside a
   * recipe: before any effect is applied and before anything retained has moved, so a candidate the
   * registry refuses still costs no teardown and reads the same message.
   *
   * The retained record is resolved beside it rather than kept anywhere. A kept plugin chain would
   * be a cache whose key is the registry's own contents, held by a layer that owns neither, and a
   * resolve is the pure and cheap half of the compile this declines to pay.
   *
   * What the answer is compared with is `sameCompiledTrackInput`'s question rather than this one's:
   * a plugin list is one of the things a compiled Track is built from rather than all of them, and
   * that module is the one owner of which.
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
   * A map builder. The staging effect, its rollback, the Motion republish and its restore, and the
   * staging commit are `#derive`'s answer, derived from the retained definition and the committed
   * one, which is what lets an add followed by a replacement in one recipe cost what one add costs.
   * See `RA-65` and ADR-064.
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
    const tracks = new Map(this.#readTracks());
    tracks.set(id, { ...entry, track: validation.value, overlay: NO_OVERLAY });
    this.#commit({ tracks, motions: this.#readMotions() });
  }
  /**
   * The one path by which a structural change reaches the graph, or the open transaction.
   *
   * While a recipe is open the accepted pair is merged into it and nothing else happens: every entry
   * point built its candidate pair from that pair, so merging is adopting, and there is no op log to
   * replay and no compensation to record. With none open the pair is applied immediately, which is
   * what every caller outside a recipe has always done. See ADR-064.
   */
  #commit(plan: SchemaPlan): void {
    const open = this.#open;
    if (open !== undefined) {
      open.tracks = plan.tracks;
      open.motions = plan.motions;
      return;
    }
    this.#apply(plan);
  }
  /**
   * Applies one accepted pair: derive, apply the effects, ask the graph, settle, and flush once.
   *
   * Five transactions used to carry their own copy of this, each with its own hook ordering and its
   * own rollback ordering, and the ordering comments explained that the sequence was load-bearing
   * in three different ways: ADR-031 for the compiled map, ADR-035 for rollback precedence, and
   * ADR-045 for republish-before-restore. `replaceGraph` and `rejectAfterRollback` have had one call
   * site each since A1, and every hook has one now too.
   *
   * The derivation runs before the try, so a candidate the registry refuses inside it costs no
   * teardown at all: nothing has been applied and nothing retained has moved when it throws.
   *
   * The effects are applied inside the try, so a hook that throws is rolled back exactly as a
   * refused candidate is. Each one is recorded only after its `apply` returned, because a hook that
   * refused before writing anything must not be restored.
   *
   * One flush ends it, seeded with `touched`, and it runs after the settle steps rather than before
   * them: a new node is mounted by one of those steps, and seeding earlier would flush a node the
   * members do not contain yet. `replaceGraph` seeds nothing itself, which is why `addObserve` on a
   * manual clock with no tick used to be invisible forever. See `RA-8`.
   *
   * An empty `touched` returns without calling `invalidate`, because an empty seed set is not a
   * cheap flush: it still opens a batch, notifies every batch subscriber, moves the sequence, and
   * drains whatever seeds a deferred flush had carried. A commit that derives no node has nothing
   * to publish and must not spend a frame's worth of machinery saying so. See `RA-10`.
   */
  #apply(plan: SchemaPlan): void {
    const commit = this.#derive(plan);
    const applied: SchemaEffect[] = [];
    try {
      for (const effect of commit.effects) {
        effect.apply();
        applied.push(effect);
      }
      this.#graph.replaceGraph(this.#snapshot(plan.tracks, plan.motions));
    } catch (error) {
      const steps: (() => void)[] = [];
      for (const effect of applied) {
        if (effect.revert !== undefined) steps.push(effect.revert);
      }
      rejectAfterRollback(error, () => runRollbackSteps(steps));
    }
    this.#adoptMaps(plan);
    for (const step of commit.settle) step();
    if (commit.touched.length === 0) return;
    const batch = this.#graph.invalidate(commit.touched);
    this.#diagnostics.recordAll(batch.diagnostics);
  }
  /**
   * What one accepted pair costs, read against the retained pair, and the correction this slice
   * found.
   *
   * A hook list assembled by the entry point is correct for one change and cannot compose two. An
   * add contributes an `addMotionTrack` to the settle steps and an edit contributes a
   * `replaceMotionTrack` to the effects; effects run before the graph is asked and settle steps run
   * after it accepted, so a track added and then edited in one recipe would have the Motion asked to
   * replace a track it has not been told about yet. Add-then-remove is the same shape one level
   * worse: a mount settles for a node the committed graph does not contain, and here it derives
   * nothing at all, because the node is absent from both pairs.
   *
   * Four categories, each of them the hook set its own entry point used to name, unchanged. A
   * created Motion is built before the graph is asked and destroyed if it refuses, so a driver that
   * cannot be created leaves no definition and no node behind (ADR-032). A removed track settles its
   * eviction, its dispose and its deregistration as one step, because its entry is already gone by
   * the time any of them runs. A destroyed Motion settles after that, with nothing to revert, so a
   * Motion whose last track the same commit removed is destroyed after that track deregistered from
   * it. An added track compiles before the graph is asked, then registers with its Motion and mounts
   * after it accepted, in that order because Motion resolves by id against the live compiled map
   * (ADR-031). A replaced one stages, republishes its Motion entry, and commits the staging on
   * acceptance, with the staging build skipped when the whole compiled input provably did not move
   * (ADR-062).
   *
   * Motions are created before any track compiles, because one commit may add a Motion and a track
   * to it. Effects are reverted in apply order, so a replacement's staging rollback still runs
   * before its Motion entry is restored. See ADR-045 and ADR-064.
   */
  #derive(plan: SchemaPlan): SchemaCommit {
    const effects: SchemaEffect[] = [];
    const settle: (() => void)[] = [];
    const touched: string[] = [];
    for (const [motionId, entry] of plan.motions) {
      if (this.#motions.has(motionId)) continue;
      const definition = entry.definition;
      effects.push({
        apply: () => this.#createMotion?.(definition),
        revert: () => this.#destroyMotion?.(motionId),
      });
    }
    for (const [nodeId, entry] of this.#tracks) {
      if (plan.tracks.has(nodeId)) continue;
      const motionId = entry.motionId;
      settle.push(() => {
        this.#instances.delete(nodeId);
        this.#graph.evictNode(nodeId);
        this.#disposeTrack?.(nodeId);
        if (motionId !== undefined) this.#removeMotionTrack?.(motionId, nodeId);
      });
    }
    for (const motionId of this.#motions.keys())
      if (!plan.motions.has(motionId)) settle.push(() => this.#destroyMotion?.(motionId));
    for (const [nodeId, entry] of plan.tracks) {
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
        settle.push(() => this.mount(nodeId));
        // The new node publishes, which it never did before. A node whose sources have not published
        // yet lands on blocked with a pending diagnostic rather than on nothing at all, and that is
        // the whole of what building a structure up incrementally requires. See `RA-9`.
        touched.push(nodeId);
        continue;
      }
      if (retained.track === entry.track) continue;
      const previous = retained.track;
      const next = entry.track;
      let staged: StagedTrack | undefined;
      // Conditional, and that is C3's slice rather than this one's. Nothing else about the
      // transaction moves: the graph is still asked to accept a candidate, the edge delta is still
      // paid and the flush is still seeded, because an edge changed and there is no fast lane for
      // that. A skipped build leaves `staged` undefined, so the settle step below is the no-op it
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
   * Adopts the accepted maps wholesale, from the same pair that built the accepted snapshot.
   *
   * The pair is read out before anything is cleared, because a plan builder hands its own live map
   * straight through for the half of the schema that did not move, and clearing the source
   * mid-iteration would empty it.
   */
  #adoptMaps(plan: SchemaPlan): void {
    const tracks = [...plan.tracks];
    const motions = [...plan.motions];
    this.#tracks.clear();
    for (const [id, entry] of tracks) this.#tracks.set(id, entry);
    this.#motions.clear();
    for (const [id, motion] of motions) this.#motions.set(id, motion);
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
  #snapshot(
    tracks: ReadonlyMap<string, TrackEntry>,
    motions: ReadonlyMap<string, MotionEntry>,
  ): ProjectDefinition {
    return {
      ...this.#project,
      motions: [...motions.values()].map((entry) => ({
        ...entry.definition,
        tracks: this.#ownedBy(tracks, entry.definition.id).map(([, owned]) => owned.track),
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
