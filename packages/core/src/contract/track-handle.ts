import { StaleHandleError, type Handle } from "./handle";
import type {
  AuthoredPluginGroup,
  AuthoredProperty,
  AuthoredStaticValue,
  ObservationDefinition,
  PatchBatch,
  TrackDefinition,
} from "./v5";

/**
 * The one failure a stale `TrackHandle` reports, from every member it has.
 *
 * The parent is the abstract `StaleHandleError`, which owns the sentence and the `TypeError`
 * relationship this class used to declare itself. Both arguments for that parent are unchanged and
 * are recorded there; what stays here is the noun, the rule id, and the id this handle refused.
 *
 * `nodeId` rather than the base's `id`, and that is not two names for one fact: a qualified graph
 * node id and a motion id are different things, each named by the refusal that carries it, while
 * `Handle.id` is the generic read a caller uses when it does not care which kind it holds.
 */
export class StaleTrackHandleError extends StaleHandleError {
  /** Stable identity, in the kebab shape every diagnostic rule id in this project uses. */
  static readonly ruleId = "stale-track-handle";
  readonly ruleId: string = StaleTrackHandleError.ruleId;
  /** The qualified node id the refused handle was captured against. */
  readonly nodeId: string;
  constructor(nodeId: string) {
    super("Track", nodeId);
    this.name = "StaleTrackHandleError";
    this.nodeId = nodeId;
  }
}

/**
 * One plugin binding a track authored, as a handle reports it.
 *
 * A projection of `readPluginBindings`, which stays the one reader of the authored group shape, so
 * nothing derives a second opinion about what an author wrote or about the order two bindings come
 * in. `memberKey` travels with it because a dict-valued slot binds one source per key, and a view
 * that dropped it would report two entries of one slot as one indistinguishable pair. See ADR-057.
 *
 * The authored diagnostics path is deliberately absent. It exists so a refusal can cite the path the
 * author actually wrote, and that belongs to the layer doing the refusing; carried here it would be
 * a second owner of where something was written.
 */
export interface RequireView {
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  /** The key this binding was authored under inside a dict-valued slot, absent for a scalar one. */
  readonly memberKey?: string;
}

/**
 * The values a mask may carry: one authored static value per key.
 *
 * Closed to `AuthoredStaticValue` rather than open to any renderer-neutral value, and it stays
 * closed. A mask is rebuilt from the retained definition on every write and shadows the timeline at
 * every progress, so a stop list here would be a permanently frozen animation rather than a live
 * one. That refusal is now a type rather than a check: this is the type of `Track`'s mask and of the
 * static half of a live write, and nothing that reaches it can carry stops.
 *
 * Declared beside the handle that takes it rather than in three places. `Track` and `ProjectRuntime`
 * name this type instead of respelling the record, for the same reason `TrackHandle` itself is
 * declared once here. See ADR-059 and ADR-060.
 */
export type LiveValues = Readonly<Record<string, AuthoredStaticValue>>;

/**
 * The values a live write may carry: one authored leaf per key, static or animated.
 *
 * `LiveValues` widened per key to the animated form, and only the boundary widens. `AuthoredProperty`
 * is named rather than respelled, because what an authored leaf may be is the authored schema's
 * question and it already has exactly one answer.
 *
 * Both entry points take this, because both lift the same refusal. Which of them a key is legal on
 * is not a property of the type: an animated key is legal on both, and a key whose incoming leaf is
 * a different kind from the authored one is legal on neither. See ADR-060.
 */
export type AuthoredValues = Readonly<Record<string, AuthoredProperty>>;

/**
 * A capability handle for one graph node, valid while the token it captured is current.
 *
 * Declared once, here, and named by both `ProjectRuntime` and `engine.ts` rather than declared in
 * each. Two structurally identical interfaces drift the first time one of them gains a member,
 * which is exactly what happened to the two private `readNumber` copies that `plugins/frame.ts`
 * was created to close.
 *
 * `id`, `live` and `definition` come from `Handle`, which owns the contract every member below reads:
 * `live` never throws and everything else refuses once stale. `definition` is what this interface
 * used to spell `track`; there is no alias, which is the one break in that change.
 */
export interface TrackHandle extends Handle<TrackDefinition> {
  /**
   * Every plugin binding this track authored, ordered by plugin, then slot, then member key.
   *
   * A read, not an edit. Binding a slot is a topology change and belongs to the structural verbs;
   * this is what an editor or a devtool asks before it decides to make one. Total: a track that
   * authors no group answers with an empty list rather than with nothing, so a caller never spells
   * `?? []` and never makes the shape depend on the input.
   */
  readonly requires: readonly RequireView[];
  remove(): void;
  replace(next: TrackDefinition): void;
  addObserve(observation: ObservationDefinition): void;
  removeObserve(observation: ObservationDefinition): void;
  /**
   * Binds one requirement slot of an already-bound plugin to `source`, without naming that plugin's
   * other slots or any of its values.
   *
   * Structural, and the return type says so: `void`, because the graph was replaced, where the value
   * tier returns the `PatchBatch` of its one invalidate. There is no fast lane and none is missing:
   * a binding adds, removes or redirects a `GraphEdge`, which is the boundary `overrideValues` and
   * `setValues` are forbidden to cross, so this costs one candidate build, one edge delta and one
   * recompile. The recompile is also where the plugin registry sees the candidate, so it is the
   * validation rather than an expense. See ADR-062.
   *
   * `memberKey` names the key inside a dict-valued slot, and is omitted for a slot that takes one
   * source. Two entries of one slot are two edges, so an entry is addressed by the key it was
   * authored under rather than by a formatted slot name. See ADR-057.
   *
   * Refusals, all of them before anything is written, and none of them leaving a partial edit
   * behind. `keyframe-group-unbound` when this node authors no group for `plugin` at all, which is
   * `setKeyframeGroup`'s job: a group holding only half its data may be transiently invalid, so
   * originating one is a different primitive with a different refusal set rather than a branch
   * inside this one. `keyframe-goal-slot-reserved` when the slot named is a solver's goals slot,
   * which `setGoal` owns: without a member key this verb can only write a scalar there, which the
   * loader refuses, and with one it writes the right shape through the wrong verb, so the weaker
   * spelling is deleted rather than documented as discouraged. `keyframe-require-shape` when the
   * edit would cross a bound slot's authored shape, in either direction, because both directions
   * silently drop an edge the caller never named. Whatever the registry answers about the candidate,
   * cited at the path the author wrote. Whatever the graph answers about the candidate, rolled back
   * transactionally.
   *
   * Binding a slot to the source it already reads is a no-op: no rebuild, no recompile, no flush.
   */
  setRequire(plugin: string, slot: string, source: string, memberKey?: string): void;
  /**
   * Unbinds one requirement slot of an already-bound plugin, or one entry of a dict-valued slot.
   *
   * The inverse of `setRequire` and the same tier, the same order, and the same refusal set. A slot
   * that is not bound and an entry that is not there are both no-ops, on the idempotence rule every
   * primitive in this tier follows. Removing the last binding leaves the section absent rather than
   * empty, because omitting it is already how a group binds nothing.
   */
  removeRequire(plugin: string, slot: string, memberKey?: string): void;
  /**
   * Writes `group` as this node's whole plugin binding for `plugin`, whether or not one was there.
   *
   * The primitive `setRequire` refuses to be. A plugin binding holding only half its data may be
   * transiently invalid, so values and `requires` arrive together, which is what makes this a
   * separate verb rather than a branch inside the binding one.
   *
   * An upsert, and the one honest `set` verb on this surface. `setMotion` and `setTrack` were cut
   * because each was a single name over two operations with two refusal sets: `addTrack` assigns a
   * node id and mounts while `replace` refuses a definition whose id would move the node. A group
   * carries no id, no token and no mount, so originating one and replacing one are the same edit at
   * the same price with the same refusals, and nothing about the result depends on what was there
   * before. Wholesale rather than merged, for exactly that reason. See ADR-063.
   *
   * Structural, so `void`: every edge the group's `requires` section names is derived in one commit,
   * at the price the tier costs.
   *
   * Refusals, before anything is written. `keyframe-entry-shape` when this node authors `plugin` as
   * an ordinary property, because a plugin name and a keyframe name share one namespace and writing
   * a group over a property would drop every stop the author wrote. `keyframe-group-shape` when
   * `group` names neither reserved section, because such an object is the accepted no-op property it
   * looks like rather than a group, and authoring nothing for a plugin is spelled by removing the
   * entry. Whatever the registry answers about the candidate's keys and slots, and whatever the
   * graph answers about its edges, rolled back transactionally.
   *
   * Handing back the group this node already authors, by identity, is a no-op.
   */
  setKeyframeGroup(plugin: string, group: AuthoredPluginGroup): void;
  /**
   * Drops this node's whole plugin binding for `plugin`, and every edge its `requires` derived.
   *
   * Not the inverse of `removeRequire`: the values go with the bindings, because what is removed is
   * the group rather than a section of it. One commit however many edges that section named.
   *
   * An absent group is a no-op, on this tier's idempotence rule, and `keyframe-entry-shape` refuses a
   * name this node authors as an ordinary property rather than deleting a property the caller never
   * named. A record that ends up holding nothing loses its `keyframes` key entirely, on the same rule
   * that leaves an emptied `requires` section absent.
   */
  removeKeyframeGroup(plugin: string): void;
  /**
   * Binds one entry of a solver's goals slot, addressed by the member id it is authored under.
   *
   * `setRequire` with the slot fixed rather than named, and that is the whole of what it buys: the
   * caller cannot reach the scalar spelling of that slot, which the loader refuses as
   * `keyframes-targets-shape`, and one slot has one verb instead of two that would have to stay in
   * agreement. Same tier, same order, same refusal set otherwise, and two entries of one slot stay
   * two edges. See ADR-057 and ADR-063.
   *
   * Whether the member id names a leaf of this solver's chain is `resolveSolvers`' question, and it
   * arrives from the candidate graph rather than from a check here: a goal naming no member, a goal
   * on a non-leaf, and both goal spellings on one solver are all refused by the owner that knows the
   * member set, and the commit rolls back.
   */
  setGoal(plugin: string, memberId: string, source: string): void;
  /**
   * Drops one entry of a solver's goals slot.
   *
   * The inverse of `setGoal`, the same tier and the same refusal set. A member that carries no goal
   * is a no-op. The slot goes when its last entry does, the section goes with its last slot, and the
   * group goes when it names no section at all, which is one rule at three levels rather than three.
   */
  removeGoal(plugin: string, memberId: string): void;
  /**
   * Writes one property of a plugin group this node already authors, whether or not that group
   * authors the key yet.
   *
   * The value tier, so it returns the `PatchBatch` of its one invalidate and never replaces the
   * graph. A leaf carries no edge, and the plugin it belongs to is in the chain already by the
   * precondition below, so this can neither add a composer nor move one.
   *
   * Two paths, and which one a call takes is visible at the call site rather than hidden in the name.
   * A key the group already authors is `setValues({ [key]: value })` with the group named: the key is
   * in the compiled record, so the write is a mask or, for an animated key, a per-key rebuild of the
   * still-live timeline, and the retained definition moves with it. A key the group does not author
   * yet cannot be masked at all, because nothing compiled it, so the authored record is edited, the
   * candidate is validated and resolved, and this node is recompiled in place at the same progress.
   * See ADR-059, ADR-060 and ADR-062.
   *
   * Refusals, all of them before anything is written. `keyframe-group-unbound` when this node authors
   * no group for `plugin`, which is `setKeyframeGroup`'s job and is also what buys the cheap tier: a
   * bound group's plugin is already resolved, so adding a leaf to it cannot change the chain.
   * `live-value-key` with reason `kind` when the incoming leaf is a different kind from the authored
   * one, which stays refused even though this verb rewrites the authored record: which kind of leaf a
   * key is authored as is a whole-definition question, and `replace()` is where a whole definition is
   * validated. Whatever `validateKeyframes` answers about a stop list, and whatever the registry
   * answers about a leaf the named group claims nothing about, cited at the path the author wrote.
   *
   * There is no refusal for an animated key. Issue #231 deleted that one: an interpolator with no
   * per-key write escalates to a recompile that publishes the same values at the same progress.
   */
  setKeyframe(plugin: string, key: string, value: AuthoredProperty): PatchBatch;
  /**
   * Drops one property of a plugin group this node authors.
   *
   * The inverse of `setKeyframe` and the same tier, so it also answers with the batch of one
   * invalidate and never replaces the graph. Always a recompile rather than a mask, because a key the
   * compiled record no longer holds is not something a mask can express.
   *
   * A key the group does not author is a no-op. The values section goes when its last leaf does, the
   * group goes when it names no section at all, and the record loses its `keyframes` key when it
   * holds nothing, which is the same rule at the same levels every authored edit follows. So removing
   * the only leaf of a group that binds nothing removes the group, and the plugin leaves the chain
   * with it: what the record says afterwards is what an author writing the same document would have
   * written. See ADR-063.
   */
  removeKeyframe(plugin: string, key: string): PatchBatch;
  /**
   * Writes this node's values until the next live write or a real `replace()`, without moving the
   * retained definition.
   *
   * Cheap by construction: no Track is staged and the graph is not rebuilt. A static key is masked
   * over the interpolated state; an animated key has its tweens replaced on the still-live
   * timeline, against a base the interpolator retained, so the write is revertible wholesale. The
   * write is replaced wholesale rather than accumulated, so an empty record is the clear for both
   * kinds, and `replace()` drops it by construction because that compiles a fresh Track. Returns
   * the `PatchBatch` of the one invalidate it causes, exactly as `seek()` does.
   *
   * Refuses an unknown key, a key another plugin owns, a namespaced key, an interpolator scratch
   * key, a key whose incoming leaf is a different kind from the authored one, and a key a plugin
   * prepared, with `LiveValueKeyError` and no mutation. An animated key is no longer refused: an
   * interpolator with no per-key write escalates to a recompile that publishes the same values at
   * the same progress. See ADR-060.
   */
  overrideValues(next: AuthoredValues): PatchBatch;
  /**
   * Rewrites authored values, leaving topology, progress, and observations alone.
   *
   * `definition` above answers from the retained definition, and this is the member that moves it,
   * so the definition and the live composition cannot disagree. It is the sticky half: a following
   * `overrideValues({})` reverts to what this wrote rather than to what was authored. Omitted keys
   * keep their values. Same refusal set as `overrideValues`, same single invalidate, and no
   * `replaceGraph`. See ADR-059 and ADR-060.
   */
  setValues(next: AuthoredValues): PatchBatch;
}
