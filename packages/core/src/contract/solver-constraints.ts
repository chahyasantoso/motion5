import { readAuthoredLeaf } from "./authored-leaf";
import { isKeyframeGroup, PLUGIN_VALUES_SECTION, readPluginValues } from "./keyframe-shape";

/**
 * The authored vocabulary of a constrained 2D solve, and the one owner of what a well-formed value
 * of it is. See ADR-108.
 *
 * `minRotation` and `maxRotation` are per-member local-angle bounds in degrees, `bend` is the
 * solver's branch hint and `flip` its older boolean spelling. The graph layer asks this module
 * whether an authored value is well formed, and the runtime asks it whether a live value is in the
 * limit domain, so the domain `[-180, 180]` is stated once and read by both.
 */
export const MIN_ROTATION_KEY = "minRotation" as const;
export const MAX_ROTATION_KEY = "maxRotation" as const;
export const BEND_KEY = "bend" as const;
export const FLIP_KEY = "flip" as const;

export type LimitKey = typeof MIN_ROTATION_KEY | typeof MAX_ROTATION_KEY;
export const LIMIT_KEYS: readonly LimitKey[] = Object.freeze([MIN_ROTATION_KEY, MAX_ROTATION_KEY]);

/** A key the solver node authors itself, scoped to the group that bound its `root`. */
export type SolverKey = typeof BEND_KEY | typeof FLIP_KEY;

/** The bound an omitted `minRotation` means, and the floor of the limit domain. */
export const LIMIT_FLOOR = -180;
/** The bound an omitted `maxRotation` means, and the ceiling of the limit domain. */
export const LIMIT_CEILING = 180;

/** One authored limit pair, classified. `empty` keeps both bounds so its diagnostic can cite them. */
export type LimitAuthored =
  | { readonly kind: "free" }
  | { readonly kind: "range"; readonly min: number; readonly max: number }
  | { readonly kind: "malformed"; readonly key: LimitKey }
  | { readonly kind: "empty"; readonly min: number; readonly max: number };

export type Bend = "positive" | "negative";

export type BendAuthored =
  | { readonly kind: "absent" }
  | { readonly kind: "bend"; readonly bend: Bend }
  | { readonly kind: "malformed" };

/**
 * A degree in the limit domain, or `undefined` for anything else.
 *
 * The one predicate for the domain. A live value reaching the solve is read through it directly;
 * an authored leaf is read through it after `readAuthoredLeaf` has proved the leaf static, so a
 * keyframed bound is malformed at load rather than an animated constraint at runtime.
 */
export function readLimitDegree(value: unknown): number | undefined {
  return typeof value === "number" &&
    Number.isFinite(value) &&
    value >= LIMIT_FLOOR &&
    value <= LIMIT_CEILING
    ? value
    : undefined;
}

function readStaticLimit(value: unknown): number | undefined {
  const leaf = readAuthoredLeaf(value);
  return leaf.kind === "static" ? readLimitDegree(leaf.value) : undefined;
}

/**
 * Classifies the limit a member authored, from the bounds it authored under any spelling.
 *
 * `values` holds only the limit keys the member actually authored. An absent side defaults to the
 * domain edge; a present side that is not a static in-domain number is `malformed` and names its
 * key, minimum first.
 */
export function classifyLimit(values: Readonly<Partial<Record<LimitKey, unknown>>>): LimitAuthored {
  const bounds: Partial<Record<LimitKey, number>> = {};
  for (const key of LIMIT_KEYS) {
    if (!Object.hasOwn(values, key)) continue;
    const bound = readStaticLimit(values[key]);
    if (bound === undefined) return { kind: "malformed", key };
    bounds[key] = bound;
  }
  if (bounds.minRotation === undefined && bounds.maxRotation === undefined) return { kind: "free" };
  const min = bounds.minRotation ?? LIMIT_FLOOR;
  const max = bounds.maxRotation ?? LIMIT_CEILING;
  return min > max ? { kind: "empty", min, max } : { kind: "range", min, max };
}

/** Classifies one `bend` value: absent, one of the two branch names, or malformed. */
export function classifyBend(value: unknown): BendAuthored {
  if (value === undefined) return { kind: "absent" };
  const leaf = readAuthoredLeaf(value);
  if (leaf.kind !== "static") return { kind: "malformed" };
  const bend = leaf.value;
  return bend === "positive" || bend === "negative"
    ? { kind: "bend", bend }
    : { kind: "malformed" };
}

/** One authored spelling of a key on a track: grouped under a plugin, or flat (`group` undefined). */
export interface AuthoredSpelling {
  readonly group: string | undefined;
  readonly path: string;
  readonly value: unknown;
}

/**
 * Every spelling of `key` a track's keyframes author, flat and grouped, in canonical order.
 *
 * Both spellings reach the same flat value bag a composer reads (ADR-043), so a rule that inspects
 * only the grouped one lets the flat one past load unvalidated. Reads groups through
 * `readPluginValues` and `isKeyframeGroup`, which own what a group is, rather than restating either.
 */
export function authoredSpellings(keyframes: unknown, key: string): readonly AuthoredSpelling[] {
  if (keyframes === null || typeof keyframes !== "object" || Array.isArray(keyframes)) return [];
  const record = keyframes as Readonly<Record<string, unknown>>;
  const spellings: AuthoredSpelling[] = [];
  for (const name of Object.keys(record).sort()) {
    const property = record[name];
    if (isKeyframeGroup(property)) {
      const values = readPluginValues(property);
      if (Object.hasOwn(values, key))
        spellings.push({
          group: name,
          path: `${name}.${PLUGIN_VALUES_SECTION}.${key}`,
          value: values[key],
        });
    } else if (name === key) {
      spellings.push({ group: undefined, path: key, value: property });
    }
  }
  return spellings;
}
