import { isKeyframeGroup, PLUGIN_REQUIRES_SECTION } from "../../contract/keyframe-shape";
import type {
  AuthoredKeyframe,
  AuthoredPluginGroup,
  AuthoredPluginRequires,
  AuthoredRequirementDict,
} from "../../contract/v5";

/**
 * Pure editors over one authored keyframes record.
 *
 * No runtime, no graph, no registry, and nothing here decides whether an edit is allowed to happen.
 * Each function answers one question -- what does the record look like after this edit -- and the
 * owners that already judge a whole authored record judge the result: `PluginRegistry` for whether
 * the named plugin declares the slot, `finalizeGraph` for whether the source resolves to a node and
 * the topology stays acyclic. That is what makes a structural primitive produce a record the loader
 * would accept by construction rather than by a per-primitive check that can disagree with it.
 * See ADR-044 and ADR-062.
 *
 * Every section is spelled through the reserved constant in `contract/keyframe-shape`, which stays
 * the one owner of the group layout, and group detection is that module's `isKeyframeGroup` rather
 * than a shape test written here.
 *
 * Idempotence is stated once, here, rather than once per primitive: an edit that changes nothing
 * returns the record it was given, by identity. The caller's no-op check is therefore a `===` and
 * cannot drift from what the editor actually did, which is the same relationship
 * `#replaceWithObservation` has to `observationEdgeKey`.
 */
export type AuthoredKeyframes = Readonly<Record<string, AuthoredKeyframe>>;

/**
 * One plugin group that is known to exist on a record, with the name it was found under.
 *
 * The name and the group travel as one value from one reader, so no editor can be handed a group
 * belonging to a different plugin than the one it is asked to edit. It is also the precondition made
 * unrepresentable-otherwise: an editor below cannot be called at all without having proved, through
 * `readBoundGroup`, that the plugin authors a group here. Whether an absent group is a refusal or a
 * creation is the caller's question, and `setKeyframeGroup` is the primitive that answers it the
 * other way.
 */
export interface BoundGroup {
  readonly plugin: string;
  readonly group: AuthoredPluginGroup;
}

/** One retained group, writable, for the one section a binding edit moves. */
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
 * `keyframes` with the bindings section of `bound` replaced, or removed when `requires` is absent.
 *
 * Absent rather than empty, and that is forced rather than tidy: omitting the section is already how
 * a group binds nothing, so `validateKeyframes` refuses an empty one as `keyframes-requires-empty`,
 * and an edit that left one behind would reject the very candidate it commits.
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
