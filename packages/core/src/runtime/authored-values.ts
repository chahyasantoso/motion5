import type { TrackDefinition, MotionDefinition } from "../contract/v5";
import type { RequireView } from "../contract/track-handle";

/**
 * Pure functions over one retained definition.
 *
 * Moved out of `project-runtime.ts` whole by slice 2 of issue #267, with each docblock travelling
 * with the function it constrains. Nothing here reads `this` or reaches a hook: every one of them
 * takes a definition, or a write, and answers with another one, which is why the file that owns the
 * transaction was never the file that owned them.
 *
 * The live-write helpers that used to live here were retired with the grouped-keyframe mask they
 * served: an identified-table write is one whole evaluated value, validated and placed by the edit
 * plan and the compiled evaluator rather than assembled from per-key static and animated halves.
 */

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
 * Projected from `input.requires`, which is the one authored binding record on an identified-table
 * track. A scalar slot answers one view and a map slot answers one per member key, in authored
 * order, because two entries of one slot are two edges and a view that merged them would report
 * them as one. Total by construction: a track that binds nothing answers an empty list.
 * See ADR-044, ADR-057 and ADR-062.
 */
export function requireViews(track: TrackDefinition): readonly RequireView[] {
  const memo = REQUIRE_VIEWS.get(track);
  if (memo !== undefined) return memo;
  const views: RequireView[] = [];
  for (const [slot, binding] of Object.entries(track.input?.requires ?? {})) {
    if (typeof binding === "string") {
      views.push(Object.freeze({ slot, source: binding }));
      continue;
    }
    for (const [memberKey, source] of Object.entries(binding))
      views.push(Object.freeze({ slot, source, memberKey }));
  }
  const frozen = Object.freeze(views);
  REQUIRE_VIEWS.set(track, frozen);
  return frozen;
}

/** One retained Motion definition, writable, for the two fields a tier 0 edit moves. */
type MutableMotion = { -readonly [K in keyof MotionDefinition]: MotionDefinition[K] };

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
export function sameTrigger(
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
export function withStagger(
  definition: MotionDefinition,
  stagger: number | undefined,
): MotionDefinition {
  const next: MutableMotion = { ...definition };
  if (stagger === undefined) delete next.stagger;
  else next.stagger = stagger;
  return Object.freeze(next);
}
