import {
  isKeyframeGroup,
  PLUGIN_GROUP_SECTIONS,
  PLUGIN_REQUIRES_SECTION,
  PLUGIN_VALUES_SECTION,
  readPluginValues,
} from "../../contract/keyframe-shape";
import type {
  AuthoredKeyframe,
  AuthoredPluginGroup,
  AuthoredPluginRequires,
  AuthoredProperty,
  AuthoredRequirementDict,
} from "../../contract/v5";

/**
 * Pure editors over one authored keyframes record.
 *
 * No runtime, no graph, no registry, and nothing here decides whether an edit is allowed to happen.
 * Each function answers one question -- what does the record look like after this edit -- and the
 * owners that already judge a whole authored record judge the result: `PluginRegistry` for whether
 * the named plugin declares the slot and claims the leaf, `finalizeGraph` for whether the source
 * resolves to a node and the topology stays acyclic. That is what makes an authoring primitive
 * produce a record the loader would accept by construction rather than by a per-primitive check that
 * can disagree with it. See ADR-044 and ADR-062.
 *
 * Three levels of edit live here and they are deliberately separate. A property edit moves one leaf
 * of a group's values section; a binding edit moves one slot of a group the record already holds; a
 * group edit originates, replaces or drops the whole entry. Keeping them apart is what keeps
 * `setRequire` and `setKeyframe` from silently creating a group that holds only half its data, which
 * is the boundary `keyframe-group-unbound` defends one layer up. See ADR-063.
 *
 * Every section is spelled through the reserved constant in `contract/keyframe-shape`, which stays
 * the one owner of the group layout, and group detection is that module's `isKeyframeGroup` rather
 * than a shape test written here. The values section is read through that module's
 * `readPluginValues`, on the same rule: a layout written through one constant and read through two
 * expressions has two readers, and the runtime's `#setKeyframe` was the second one. See issue #255
 * and `RA-106`.
 *
 * Idempotence is stated once, here, rather than once per primitive: an edit that changes nothing
 * returns the record it was given, by identity. The caller's no-op check is therefore a `===` and
 * cannot drift from what the editor actually did, which is the same relationship
 * `#replaceWithObservation` has to `observationEdgeKey`.
 *
 * So is emptiness. A dict that loses its last entry loses its slot, a section that loses its last
 * member is removed rather than left empty, and a group that ends up naming no section at all loses
 * its entry. One rule at three levels, with one owner each, because a shape that is legal only
 * because nothing refuses it is a field accepted and then ignored.
 */
export type AuthoredKeyframes = Readonly<Record<string, AuthoredKeyframe>>;

/**
 * One plugin group that is known to exist on a record, with the name it was found under.
 *
 * The name and the group travel as one value from one reader, so no editor can be handed a group
 * belonging to a different plugin than the one it is asked to edit. It is also the precondition made
 * unrepresentable-otherwise: a binding or property editor below cannot be called at all without
 * having proved, through `readBoundGroup`, that the plugin authors a group here. Whether an absent
 * group is a refusal or a creation is the caller's question, and `setGroup` is the primitive that
 * answers it the other way.
 */
export interface BoundGroup {
  readonly plugin: string;
  readonly group: AuthoredPluginGroup;
}

/** One retained group, writable, for the one section an edit moves. */
type MutableGroup = { -readonly [K in keyof AuthoredPluginGroup]: AuthoredPluginGroup[K] };

/**
 * The group `plugin` authors on this record, or `undefined` when it authors none.
 *
 * `isKeyframeGroup` is the detector, unchanged: a group is an object naming at least one reserved
 * section, which is exact rather than a guess about the shape of the leaves. A record that spells
 * `plugin` as an ordinary property therefore answers `undefined` here, which is correct: an authored
 * property is not a binding surface.
 */
export function readBoundGroup(
  keyframes: AuthoredKeyframes,
  plugin: string,
): BoundGroup | undefined {
  const group = keyframes[plugin];
  return isKeyframeGroup(group) ? Object.freeze({ plugin, group }) : undefined;
}

/**
 * Whether this record holds an entry under `plugin` that is not a plugin group.
 *
 * The one question a group edit has that `readBoundGroup` cannot answer, because that reader folds
 * "no entry" and "an entry that is a property" into the same `undefined`. The two are opposite
 * answers here: the first is what `setGroup` exists to fill and the second is a shape no group verb
 * may cross, so the caller needs to tell them apart before it decides anything. Not a second opinion
 * about what a group is -- `isKeyframeGroup` still answers that -- just the complement of it.
 */
export function readsAsProperty(keyframes: AuthoredKeyframes, plugin: string): boolean {
  const entry = keyframes[plugin];
  return entry !== undefined && !isKeyframeGroup(entry);
}

function isDict(value: unknown): value is AuthoredRequirementDict {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Refuses an edit that would cross a bound slot's authored shape.
 *
 * A scalar written over a dict-valued slot drops every entry the author wrote, and a member key
 * named at a scalar slot names an entry that slot cannot hold. Both are silent in exactly the way
 * ADR-057 refused in both directions when it made `PluginRequirement.dict` data: nothing below this
 * layer can catch it, because the parser holds no registry and both shapes are legal at any slot
 * name. Crossing a slot's shape is a `replace()`, where a whole definition is validated.
 */
function crossing(plugin: string, slot: string, detail: string): never {
  const use = "Use replace() to change a slot's shape.";
  throw new TypeError(`keyframe-require-shape: Slot "${slot}" of "${plugin}" ${detail}. ${use}`);
}

/**
 * Refuses a group that names no reserved section, which is not a group at all.
 *
 * `{}` under a plugin name is the accepted no-op property it has always been: `isKeyframeGroup`
 * answers `false` for it, `readPluginBindings` derives nothing from it, and `validateKeyframes`
 * reads it as an empty leaf. Committing one would author a husk that every reader agrees is not a
 * binding surface, which is a field accepted and then ignored. Authoring nothing for a plugin is
 * spelled by removing the entry, and `removeGroup` is the verb for that.
 */
function notAGroup(plugin: string): never {
  const sections = PLUGIN_GROUP_SECTIONS.map((name) => `'${name}'`).join(" or ");
  const use = "A group naming neither is an ordinary property; remove the entry instead.";
  throw new TypeError(`keyframe-group-shape: Group "${plugin}" must name ${sections}. ${use}`);
}

/**
 * `keyframes` with the bindings section of `bound` replaced, or removed when `requires` is absent.
 *
 * Absent rather than empty, and that is forced rather than tidy: omitting the section is already how
 * a group binds nothing, so `validateKeyframes` refuses an empty one as `keyframes-requires-empty`,
 * and an edit that left one behind would reject the very candidate it commits.
 *
 * A group that is left naming no section at all loses its entry, through the one owner of that, for
 * the same reason one level up: on a group that authors no `values`, removing its last binding used
 * to produce `{ plugin: {} }`, which no reader reads as a group and which the validator accepts as
 * the empty property it looks like. That was a husk committed by an edit rather than authored by
 * anyone, and it is the shape `notAGroup` refuses to accept from a caller. See ADR-063.
 *
 * Every untouched entry of the record is carried by identity, which is what keeps the incremental
 * builder's cache hit for every track a plan did not edit. See ADR-058.
 */
function withRequires(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  requires: AuthoredPluginRequires | undefined,
): AuthoredKeyframes {
  const group: MutableGroup = { ...bound.group };
  if (requires === undefined) delete group[PLUGIN_REQUIRES_SECTION];
  else group[PLUGIN_REQUIRES_SECTION] = Object.freeze(requires);
  if (!isKeyframeGroup(group)) return removeGroup(keyframes, bound.plugin);
  return Object.freeze({ ...keyframes, [bound.plugin]: Object.freeze(group) });
}

/**
 * `keyframes` with the values section of `bound` replaced, or removed when `values` is absent.
 *
 * The values-section twin of `withRequires`, and it is a twin rather than a shared helper because
 * the two sections are reserved by name: one function taking the section name would be a parser for
 * a constant that exists so nothing has to parse it. What they do share is the cascade, and they
 * share it by reaching the same owner of it: a group left naming no section loses its entry, so
 * removing a group's last leaf when it binds nothing removes the group rather than leaving
 * `{ plugin: {} }` behind, which is not a group to any reader.
 *
 * Absent rather than empty, on the same rule and for the same reason: omitting the section is how a
 * group authors no property, so an emptied one is a shape no author can write and therefore not one
 * an edit may leave behind.
 *
 * Every untouched entry of the record is carried by identity, which is what keeps the incremental
 * builder's cache hit for every track an edit did not touch. See ADR-058 and ADR-063.
 */
function withValues(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  values: AuthoredPluginGroup["values"] | undefined,
): AuthoredKeyframes {
  const group: MutableGroup = { ...bound.group };
  if (values === undefined) delete group[PLUGIN_VALUES_SECTION];
  else group[PLUGIN_VALUES_SECTION] = Object.freeze(values);
  if (!isKeyframeGroup(group)) return removeGroup(keyframes, bound.plugin);
  return Object.freeze({ ...keyframes, [bound.plugin]: Object.freeze(group) });
}

/** The same record without `slot`, and without the section at all once it holds nothing. */
function withoutSlot(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  requires: AuthoredPluginRequires,
  slot: string,
): AuthoredKeyframes {
  const next: Record<string, string | AuthoredRequirementDict> = { ...requires };
  delete next[slot];
  return withRequires(keyframes, bound, Object.keys(next).length === 0 ? undefined : next);
}

/**
 * Binds one slot of `bound` to `source`, or one entry of a dict-valued slot when `memberKey` names
 * the key it is authored under.
 *
 * Redirects rather than appends. A slot holds one source and a dict entry holds one source, so an
 * edit that appended would leave the node reading two, which no authored record can express and no
 * slot can hold.
 *
 * `memberKey` is a parameter rather than a spelling inside `slot`, which is what ADR-057 decided when
 * it deleted the goal-addressing grammar: the slot stays exactly as the author wrote it, and the one
 * thing distinguishing two entries of it is data with no parser and no builder.
 *
 * Which slots a caller may name is not this layer's question. A solver's goals slot is reserved to
 * `setGoal` at the verb surface, and this editor is what that verb calls, so the reservation lives
 * where the caller named a slot rather than here. See ADR-063.
 */
export function setRequire(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  slot: string,
  source: string,
  memberKey?: string,
): AuthoredKeyframes {
  const requires = bound.group[PLUGIN_REQUIRES_SECTION] ?? {};
  const current = requires[slot];
  if (memberKey === undefined) {
    if (isDict(current))
      crossing(bound.plugin, slot, "is a dict of keys, so it takes no single source");
    if (current === source) return keyframes;
    return withRequires(keyframes, bound, { ...requires, [slot]: source });
  }
  if (current !== undefined && !isDict(current))
    crossing(bound.plugin, slot, "is one source, so it holds no keyed entry");
  const entries = current ?? {};
  if (entries[memberKey] === source) return keyframes;
  const next = Object.freeze({ ...entries, [memberKey]: source });
  return withRequires(keyframes, bound, { ...requires, [slot]: next });
}

/**
 * Unbinds one slot of `bound`, or one entry of a dict-valued slot when `memberKey` names it.
 *
 * A slot that is not bound and an entry that is not there are both no-ops, returning the record by
 * identity. A dict that empties loses its slot rather than staying as a section with no entries, for
 * the same reason a section that empties is removed: a bound-to-nothing shape is not what an author
 * can write, so it is not what an edit may leave behind.
 *
 * A one-entry dict does not collapse to the scalar shape. The two are different authored things and
 * only one of them is what the author wrote.
 */
export function removeRequire(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  slot: string,
  memberKey?: string,
): AuthoredKeyframes {
  const requires = bound.group[PLUGIN_REQUIRES_SECTION];
  if (requires === undefined) return keyframes;
  const current = requires[slot];
  if (current === undefined) return keyframes;
  if (memberKey === undefined) {
    if (isDict(current))
      crossing(bound.plugin, slot, "is a dict of keys, so removing one names the key");
    return withoutSlot(keyframes, bound, requires, slot);
  }
  if (!isDict(current)) crossing(bound.plugin, slot, "is one source, so it holds no keyed entry");
  if (!(memberKey in current)) return keyframes;
  const entries: Record<string, string> = { ...current };
  delete entries[memberKey];
  if (Object.keys(entries).length === 0) return withoutSlot(keyframes, bound, requires, slot);
  return withRequires(keyframes, bound, { ...requires, [slot]: Object.freeze(entries) });
}

/**
 * Writes one leaf of `bound`'s values section, whether or not that leaf was there.
 *
 * The property-level twin of `setRequire`, and the same shape of edit: it replaces one member of one
 * section, carries every other entry of the record by identity, and answers by identity when the
 * leaf already holds exactly this value. A caller that rebuilt the stop list it already had is
 * asking for the edit to run, which is the safe direction and the reading `sameTrigger` already
 * takes of an object it cannot compare cheaply.
 *
 * Whether the named plugin claims this leaf is `PluginRegistry`'s question, asked of the candidate
 * rather than here, which is what lets this introduce a key the group does not author yet at all.
 * That is the one capability the mask cannot express: `withAuthoredValues` skips a key with no
 * flattened entry rather than inventing one, deliberately, because inventing a leaf there would make
 * the runtime the author. See ADR-062.
 *
 * Which kind of leaf a key may become is not this layer's question either, and it is not open: the
 * verb refuses a kind crossing one layer up, where the compiled Track owns what a key was authored
 * as. This editor writes what it is given.
 */
export function setKeyframe(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  key: string,
  value: AuthoredProperty,
): AuthoredKeyframes {
  const values = readPluginValues(bound.group);
  if (values[key] === value) return keyframes;
  return withValues(keyframes, bound, { ...values, [key]: value });
}

/**
 * Drops one leaf of `bound`'s values section.
 *
 * The inverse of `setKeyframe` and the same shape of edit. A leaf that is not authored is a no-op,
 * returning the record by identity, on the idempotence rule every editor here follows.
 *
 * Membership is `Object.hasOwn` rather than `in`, which is the spelling the runtime path already
 * used and the only one that keeps that rule: `in` answers true for an inherited name, so removing
 * `toString` read a leaf no author wrote, rewrote the section and answered with a new record.
 * `RA-108`.
 *
 * The section goes when its last leaf does, and the group goes when it names no section at all,
 * which is the cascade `withValues` reaches rather than a rule restated here. So removing the only
 * leaf of a group that binds nothing removes the group, and the plugin leaves the chain with it,
 * which is correct: what the record says afterwards is what an author writing the same document
 * would have written.
 */
export function removeKeyframe(
  keyframes: AuthoredKeyframes,
  bound: BoundGroup,
  key: string,
): AuthoredKeyframes {
  const values = readPluginValues(bound.group);
  if (!Object.hasOwn(values, key)) return keyframes;
  const next: Record<string, AuthoredProperty> = { ...values };
  delete next[key];
  return withValues(keyframes, bound, Object.keys(next).length === 0 ? undefined : next);
}

/**
 * Writes `group` as the whole entry for `plugin`, whether or not one was there.
 *
 * Wholesale rather than merged, and that is what makes an upsert honest here where it was refused for
 * a Motion and for a Track. Those two were single names over two operations: `addTrack` assigns a
 * node id and mounts, `replace` refuses a definition whose id would move the node, so one verb would
 * have had a cost and a refusal set depending on which branch it landed in. A group carries no id, no
 * token and no mount, so originating one and replacing one are the same edit at the same price with
 * the same refusals, and nothing about the result depends on what was there before. A merge is what
 * would reintroduce the invisible context. See ADR-063.
 *
 * Both sections travel together because a plugin binding holding only half its data may be
 * transiently invalid, which is the whole reason this is a separate primitive from `setRequire`.
 *
 * Whether the plugin claims each leaf of `values` and declares each slot of `requires` is
 * `PluginRegistry`'s question and is asked of the candidate, not here.
 */
export function setGroup(
  keyframes: AuthoredKeyframes,
  plugin: string,
  group: AuthoredPluginGroup,
): AuthoredKeyframes {
  if (!isKeyframeGroup(group)) notAGroup(plugin);
  if (keyframes[plugin] === group) return keyframes;
  return Object.freeze({ ...keyframes, [plugin]: Object.freeze({ ...group }) });
}

/**
 * The same record without the entry for `plugin`.
 *
 * The whole entry, so every edge that group's `requires` derived goes in one edit. It is not the
 * inverse of `removeRequire`: the values go with the bindings, because what is removed is the group
 * rather than a section of it, and a group whose values were kept beside no bindings would be a
 * different authored thing from what the caller asked to drop.
 *
 * An absent entry is a no-op, returning the record by identity, on the idempotence rule every editor
 * here follows. It is also the one owner of removing an entry, which is what `withRequires` and
 * `withValues` reach for when an edit leaves a group naming no section at all.
 */
export function removeGroup(keyframes: AuthoredKeyframes, plugin: string): AuthoredKeyframes {
  if (!(plugin in keyframes)) return keyframes;
  const next: Record<string, AuthoredKeyframe> = { ...keyframes };
  delete next[plugin];
  return Object.freeze(next);
}
