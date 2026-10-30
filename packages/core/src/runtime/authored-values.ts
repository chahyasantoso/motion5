import type { TrackDefinition, MotionDefinition } from "../contract/v5";
import type { RequireView } from "../contract/track-handle";

/** Pure functions over one retained definition: no `this`, no hook, no mutation of the input. */

/**
 * One list per definition, shared by every handle to it; keyed on identity because a retained
 * definition is deep-frozen and replaced by each edit; weak, so it dies with that definition. */
const REQUIRE_VIEWS = new WeakMap<TrackDefinition, readonly RequireView[]>();

/**
 * The bindings `track` authored, as a handle reports them: one view per scalar slot, one per member
 * key of a map slot in authored order; a track binding nothing answers an empty list. */
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

/** A retained definition made writable for the copy-then-freeze edit; the input is never written. */
type MutableMotion = { -readonly [K in keyof MotionDefinition]: MotionDefinition[K] };

/**
 * Whether two authored triggers are the same trigger.
 * Field-by-field `Object.is`; an equal rebuild is no change, a rebuilt extension object is a change → the edit runs. */
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
 * A copy of a Motion definition with `stagger` set, or the key absent when cleared.
 * Key deleted rather than `undefined`: no author can write that shape; every other field is kept. */
export function withStagger(
  definition: MotionDefinition,
  stagger: number | undefined,
): MotionDefinition {
  const next: MutableMotion = { ...definition };
  if (stagger === undefined) delete next.stagger;
  else next.stagger = stagger;
  return Object.freeze(next);
}
