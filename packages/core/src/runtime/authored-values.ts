import type {
  AuthoredKeyframe,
  AuthoredPluginGroup,
  AuthoredStaticValue,
  TrackDefinition,
} from "../contract/v5";
import { readAuthoredLeaf } from "../contract/authored-leaf";
import { readPluginBindings } from "../contract/keyframe-shape";
import type { AuthoredValues, LiveValues, RequireView } from "../contract/track-handle";
import { flattenAuthoredKeyframes } from "../domain/keyframe-groups";
import type { AuthoredKeyframes } from "../domain/authoring/keyframes";
/**
 * Pure functions over one retained definition, and the two frozen constants that stand in for none.
 *
 * Moved out of `project-runtime.ts` whole by slice 2 of issue #267, with each docblock travelling
 * with the function it constrains. Nothing here reads `this` or reaches a hook: every one of them
 * takes a definition, or a write, and answers with another one, which is why the file that owns the
 * transaction was never the file that owned them.
 *
 * They are not a second opinion about anything either. `readAuthoredLeaf` stays the one owner of
 * what shape a leaf has, `flattenAuthoredKeyframes` stays the one owner of which record an authored
 * key came from, and `readPluginBindings` stays the one reader of the authored group shape. Every
 * function below reads one of those answers rather than deriving its own.
 */
/** No animated write. One frozen value, so the common entry allocates nothing. */
export const NO_OVERLAY: Readonly<Record<string, unknown>> = Object.freeze({});
/**
 * No authored record. One frozen value, so a track that authors nothing allocates nothing.
 *
 * Stands in for an absent `keyframes` at the one place a group edit reads it, which is what lets
 * `setKeyframeGroup` originate on a track that authors nothing without a branch, and lets
 * `removeKeyframeGroup` answer by identity on one instead of committing an empty record on the way
 * to removing nothing from it.
 */
export const EMPTY_KEYFRAMES: AuthoredKeyframes = Object.freeze({});
/**
 * One derived require list per retained definition, and the residency rule that makes it safe.
 *
 * `handle.requires` derived and froze the whole list on every access, on a getter a devtool polls:
 * reading it n times over one unchanged definition read the authored record n times and allocated n
 * lists that are all the same answer. Keyed on the definition object rather than on the handle, so
 * two handles to one node share one list and no list outlives the definition it came from.
 *
 * Sound on identity because a retained definition never moves in place. `validateTrackDefinition`
 * answers with a deep-frozen clone, every authored edit commits a fresh frozen object, and
 * `IncrementalGraphBuilder` already treats a definition as immutable when it cache-hits on
 * `cached.track === track`, so a memo keyed on anything weaker would be a second opinion about
 * immutability rather than a use of the one this project already holds.
 *
 * Weak, so it retains nothing this runtime has dropped: a cache's residency belongs to the layer
 * that holds it rather than to callers staying in step. See `RA-96` and ADR-058.
 */
const REQUIRE_VIEWS = new WeakMap<TrackDefinition, readonly RequireView[]>();
/**
 * The bindings `track` authored, as a handle reports them.
 *
 * `readPluginBindings` is the one reader of the authored group shape and stays the one reader, so
 * this derives nothing: it drops the diagnostics path, which belongs to the layer that cites it, and
 * keeps everything that identifies the binding, `memberKey` included. Total by construction, because
 * that reader answers with an empty list for a record that authors no group. See ADR-044 and ADR-057.
 */
export function requireViews(track: TrackDefinition): readonly RequireView[] {
  const memo = REQUIRE_VIEWS.get(track);
  if (memo !== undefined) return memo;
  const views = Object.freeze(
    readPluginBindings(track.keyframes ?? {}).map(({ plugin, slot, source, memberKey }) =>
      Object.freeze({ plugin, slot, source, ...(memberKey === undefined ? {} : { memberKey }) }),
    ),
  );
  REQUIRE_VIEWS.set(track, views);
  return views;
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
export function authoredValues(track: TrackDefinition): Record<string, AuthoredStaticValue> {
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
export interface LiveWriteHalves {
  readonly statics: LiveValues;
  readonly animated: Readonly<Record<string, unknown>>;
}
export function splitAuthoredValues(values: AuthoredValues): LiveWriteHalves {
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
export function withAuthoredValues(
  track: TrackDefinition,
  values: AuthoredValues,
): TrackDefinition {
  const flattened = flattenAuthoredKeyframes(track.keyframes ?? {});
  // Indexed once rather than searched once per written key. The flatten answers with a list because
  // order is what makes a collision decidable one layer down, and this searched that list per key,
  // so a three-key write over a thirty-leaf group walked ninety entries to place three. Which record
  // a key came from is still the flatten's answer: this indexes it rather than re-deriving it. See
  // `RA-94`.
  const sources = new Map(
    flattened.entries.map((candidate) => [candidate.key, candidate] as const),
  );
  const keyframes: Record<string, AuthoredKeyframe> = { ...track.keyframes };
  for (const [key, value] of Object.entries(values)) {
    const entry = sources.get(key);
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
