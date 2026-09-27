import { unreachable } from "../lang/exhaustive";
import { readAuthoredLeaf } from "./authored-leaf";
import { PLUGIN_VALUES_SECTION, readPluginValues } from "./keyframe-shape";

/**
 * The authored vocabulary of a constrained 2D solve, and the one owner of what a well-formed value
 * of it is. See ADR-108, ADR-109 and ADR-110.
 *
 * `minRotation` and `maxRotation` are per-member local-angle bounds in degrees, `bend` is the
 * solver's branch hint and `flip` its older boolean spelling. `inspect` is the solver's static
 * opt-in to its `inspection` output, and `inspection` is the name of that output, kept beside the
 * switch so the authored name and the published one cannot drift apart. `influence` is a member's
 * static positive weight on the goal its leaf is addressed with, read inside the solve when branches
 * disagree about a shared member. The graph layer asks this module whether an authored value is well
 * formed, and the runtime asks it whether a live value is in the domain, so the limit domain
 * `[-180, 180]` and the influence domain (finite, greater than zero) are each stated once and read
 * by both.
 */
export const MIN_ROTATION_KEY = "minRotation" as const;
export const MAX_ROTATION_KEY = "maxRotation" as const;
export const BEND_KEY = "bend" as const;
export const FLIP_KEY = "flip" as const;
export const INSPECT_KEY = "inspect" as const;
export const INSPECTION_KEY = "inspection" as const;
export const INFLUENCE_KEY = "influence" as const;

export type LimitKey = typeof MIN_ROTATION_KEY | typeof MAX_ROTATION_KEY;
export const LIMIT_KEYS: readonly LimitKey[] = Object.freeze([MIN_ROTATION_KEY, MAX_ROTATION_KEY]);

/** A key the solver node authors itself, scoped to the group that bound its `root`. */
export type SolverKey = typeof BEND_KEY | typeof FLIP_KEY | typeof INSPECT_KEY;

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

/**
 * The authored vocabulary of a 3D joint limit (ADR-123), read by `ik3d` from its `fk3d` members.
 *
 * `joint` names the member's limit kind and is the union's discriminant, so which keys a limit reads
 * is decided by one authored word rather than inferred from whichever keys happen to be present:
 * `free` (the default, no limit), `hinge` (one degree of freedom, a turn about an axis in the parent
 * frame, `axisX`/`axisY`/`axisZ`, default the parent's +z, through the 2D `minRotation` and
 * `maxRotation` range), `cone` (the member's direction within `maxSwing` degrees of its parent's +x)
 * and `swing-twist` (a cone plus a `minTwist`/`maxTwist` range about the member's own +x). Every
 * angle bound is static degrees: `maxSwing` in `[0, 180]`, the others in the 2D limit domain.
 */
export const JOINT_KEY = "joint" as const;
export const AXIS_X_KEY = "axisX" as const;
export const AXIS_Y_KEY = "axisY" as const;
export const AXIS_Z_KEY = "axisZ" as const;
export const MAX_SWING_KEY = "maxSwing" as const;
export const MIN_TWIST_KEY = "minTwist" as const;
export const MAX_TWIST_KEY = "maxTwist" as const;

export type JointKind = "free" | "hinge" | "cone" | "swing-twist";
export const JOINT_KINDS: readonly JointKind[] = Object.freeze([
  "free",
  "hinge",
  "cone",
  "swing-twist",
]);

export type AxisKey = typeof AXIS_X_KEY | typeof AXIS_Y_KEY | typeof AXIS_Z_KEY;
export type TwistKey = typeof MIN_TWIST_KEY | typeof MAX_TWIST_KEY;
export const AXIS_KEYS: readonly AxisKey[] = Object.freeze([AXIS_X_KEY, AXIS_Y_KEY, AXIS_Z_KEY]);
export const TWIST_KEYS: readonly TwistKey[] = Object.freeze([MIN_TWIST_KEY, MAX_TWIST_KEY]);

/** Every key a 3D joint limit reads besides `joint` itself, the 2D range keys among them. */
export type JointBoundKey = AxisKey | LimitKey | typeof MAX_SWING_KEY | TwistKey;
export type JointVocabularyKey = typeof JOINT_KEY | JointBoundKey;
export const JOINT_BOUND_KEYS: readonly JointBoundKey[] = Object.freeze([
  ...AXIS_KEYS,
  ...LIMIT_KEYS,
  MAX_SWING_KEY,
  ...TWIST_KEYS,
]);
/** The whole 3D joint vocabulary, `joint` first: what `fk3d` claims and the load rules read. */
export const JOINT_VOCABULARY_KEYS: readonly JointVocabularyKey[] = Object.freeze([
  JOINT_KEY,
  ...JOINT_BOUND_KEYS,
]);
/** The keys only a 3D joint reads: its vocabulary without the 2D range it shares with `fk`. */
export const JOINT_ONLY_KEYS: readonly JointVocabularyKey[] = Object.freeze([
  JOINT_KEY,
  ...AXIS_KEYS,
  MAX_SWING_KEY,
  ...TWIST_KEYS,
]);

/**
 * The member plugins whose authored values carry the 3D joint vocabulary, and the one owner of that
 * set (ADR-123). Under any other group `minRotation` and `maxRotation` keep ADR-108's 2D meaning,
 * so the graph reads this to decide which classifier a spelling belongs to; a test holds it equal to
 * the plugin definitions that claim `joint`.
 */
const JOINT_MEMBER_PLUGINS: readonly string[] = Object.freeze(["fk3d"]);

/** Whether `plugin`'s values are read as a 3D joint limit. */
export function declaresJoint(plugin: string): boolean {
  return JOINT_MEMBER_PLUGINS.includes(plugin);
}

/** The bound keys a joint of `kind` reads; any other bound key authored beside it is unused. */
export function jointBoundKeys(kind: JointKind): readonly JointBoundKey[] {
  switch (kind) {
    case "free":
      return [];
    case "hinge":
      return [...AXIS_KEYS, ...LIMIT_KEYS];
    case "cone":
      return [MAX_SWING_KEY];
    case "swing-twist":
      return [MAX_SWING_KEY, ...TWIST_KEYS];
    default:
      return unreachable(kind);
  }
}

/** Whether a joint of `kind` constrains the solve at all: every kind but `free`. */
export function jointConstrains(kind: JointKind): boolean {
  switch (kind) {
    case "free":
      return false;
    case "hinge":
    case "cone":
    case "swing-twist":
      return true;
    default:
      return unreachable(kind);
  }
}

/** A `joint` value naming one of the four kinds, or `undefined` for anything else. */
export function readJointKind(value: unknown): JointKind | undefined {
  return JOINT_KINDS.find((kind) => kind === value);
}

/** A swing bound in its domain `[0, 180]` degrees, or `undefined` for anything else. */
export function readSwingDegree(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= LIMIT_CEILING
    ? value
    : undefined;
}

/** A hinge axis component: any finite number, or `undefined` for anything else. */
export function readAxisComponent(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/**
 * One authored 3D joint limit, classified, each refusal arm naming what its diagnostic cites.
 *
 * `valid` carries the kind only: the runtime reader in `plugins/ik3d-constraint.ts` owns the numbers
 * it solves with, and the load rules need nothing else from an accepted limit. `malformed-kind` is a
 * `joint` that is not one static kind name; `malformed` a bound outside its domain or not static;
 * `missing` a `maxSwing` a cone or swing-twist cannot do without; `zero-axis` an authored hinge axis
 * with no direction; `unused` a bound key the declared kind does not read, including every bound on
 * a member that declared no joint or `free`; `empty` an inverted range.
 */
export type JointAuthored =
  | { readonly kind: "valid"; readonly joint: JointKind }
  | { readonly kind: "malformed-kind" }
  | { readonly kind: "malformed"; readonly key: JointBoundKey }
  | { readonly kind: "missing"; readonly joint: JointKind; readonly key: JointBoundKey }
  | { readonly kind: "zero-axis" }
  | { readonly kind: "unused"; readonly joint: JointKind; readonly key: JointBoundKey }
  | {
      readonly kind: "empty";
      readonly key: LimitKey | TwistKey;
      readonly min: number;
      readonly max: number;
    };

function readStatic<T>(value: unknown, read: (inner: unknown) => T | undefined): T | undefined {
  const leaf = readAuthoredLeaf(value);
  return leaf.kind === "static" ? read(leaf.value) : undefined;
}

/** An authored range pair: each present side a static degree in the limit domain, min <= max. */
function classifyPair(
  values: Readonly<Partial<Record<JointVocabularyKey, unknown>>>,
  minKey: LimitKey | TwistKey,
  maxKey: LimitKey | TwistKey,
): JointAuthored | undefined {
  let min = LIMIT_FLOOR;
  let max = LIMIT_CEILING;
  for (const key of [minKey, maxKey]) {
    if (!Object.hasOwn(values, key)) continue;
    const bound = readStatic(values[key], readLimitDegree);
    if (bound === undefined) return { kind: "malformed", key };
    if (key === minKey) min = bound;
    else max = bound;
  }
  return min > max ? { kind: "empty", key: minKey, min, max } : undefined;
}

/** A hinge's authored axis: each present component static and finite, not all of them zero. */
function classifyAxis(
  values: Readonly<Partial<Record<JointVocabularyKey, unknown>>>,
): JointAuthored | undefined {
  let authored = false;
  let direction = false;
  for (const key of AXIS_KEYS) {
    if (!Object.hasOwn(values, key)) continue;
    const component = readStatic(values[key], readAxisComponent);
    if (component === undefined) return { kind: "malformed", key };
    authored = true;
    direction ||= component !== 0;
  }
  return authored && !direction ? { kind: "zero-axis" } : undefined;
}

/** The `maxSwing` a cone or swing-twist cannot do without: present, static and in `[0, 180]`. */
function classifySwing(
  values: Readonly<Partial<Record<JointVocabularyKey, unknown>>>,
  joint: JointKind,
): JointAuthored | undefined {
  if (!Object.hasOwn(values, MAX_SWING_KEY)) return { kind: "missing", joint, key: MAX_SWING_KEY };
  return readStatic(values[MAX_SWING_KEY], readSwingDegree) === undefined
    ? { kind: "malformed", key: MAX_SWING_KEY }
    : undefined;
}

/**
 * Classifies the 3D joint a member authored, from the joint keys it authored under the spellings
 * that reach the solve.
 *
 * Read in the order a reader fixes them: the kind first, because every other answer depends on it;
 * then any bound the kind does not read, in `JOINT_BOUND_KEYS` order, because a value nothing reads
 * is refused for being there before it is judged; then each read bound. An absent `joint` is
 * `free`, so a member that authored nothing is valid and one that authored only bounds is told
 * those bounds are unused rather than having a kind guessed for it.
 */
export function classifyJoint(
  values: Readonly<Partial<Record<JointVocabularyKey, unknown>>>,
): JointAuthored {
  const joint = Object.hasOwn(values, JOINT_KEY)
    ? readStatic(values[JOINT_KEY], readJointKind)
    : "free";
  if (joint === undefined) return { kind: "malformed-kind" };
  const read = jointBoundKeys(joint);
  for (const key of JOINT_BOUND_KEYS)
    if (Object.hasOwn(values, key) && !read.includes(key)) return { kind: "unused", joint, key };
  switch (joint) {
    case "free":
      return { kind: "valid", joint };
    case "hinge":
      return (
        classifyAxis(values) ??
        classifyPair(values, MIN_ROTATION_KEY, MAX_ROTATION_KEY) ?? { kind: "valid", joint }
      );
    case "cone":
      return classifySwing(values, joint) ?? { kind: "valid", joint };
    case "swing-twist":
      return (
        classifySwing(values, joint) ??
        classifyPair(values, MIN_TWIST_KEY, MAX_TWIST_KEY) ?? { kind: "valid", joint }
      );
    default:
      return unreachable(joint);
  }
}

/**
 * Whether a member whose solver groups are `groups` authored a joint that constrains its solve: a
 * static `joint` naming a kind other than `free` under one of them. The graph reads it to derive the
 * strategy at load, restating what `ik3d-constraint.ts`'s `constrains` answers at runtime; a test
 * holds the two equal. A malformed `joint` constrains nothing here, because `ik-joint-malformed`
 * already refuses the load.
 */
export function authorsConstrainingJoint(keyframes: unknown, groups: readonly string[]): boolean {
  return authoredSpellings(keyframes, JOINT_KEY).some((spelling) => {
    if (!groups.includes(spelling.group)) return false;
    const kind = readStatic(spelling.value, readJointKind);
    return kind !== undefined && jointConstrains(kind);
  });
}

/**
 * One authored `inspect` spelling, classified. There is no `absent` arm, unlike `BendAuthored`,
 * because the rule reads only spellings `authoredSpellings` found, so every value here was written.
 */
export type InspectAuthored =
  | { readonly kind: "valid"; readonly enabled: boolean }
  | { readonly kind: "malformed" };

/**
 * Inspection is a static boolean opt-in, never an animated value, so a keyframed switch is refused.
 */
export function classifyInspect(value: unknown): InspectAuthored {
  const leaf = readAuthoredLeaf(value);
  return leaf.kind === "static" && typeof leaf.value === "boolean"
    ? { kind: "valid", enabled: leaf.value }
    : { kind: "malformed" };
}

/** One authored spelling of a key on a track: the leaf of that name under one plugin's group. */
export interface AuthoredSpelling {
  readonly group: string;
  readonly path: string;
  readonly value: unknown;
}

/**
 * Every spelling of `key` a track's keyframes author, one per group whose values name it, in
 * canonical order.
 *
 * Every group's leaves reach the same flattened value bag a composer reads (ADR-043), so a rule that
 * inspects only one group lets another group's spelling past load unvalidated. There is no flat
 * spelling to read: an ungrouped entry is `keyframes-ungrouped-key` (ADR-121). Reads groups through
 * `readPluginValues`, which owns the layout, rather than restating it.
 */
export function authoredSpellings(keyframes: unknown, key: string): readonly AuthoredSpelling[] {
  if (keyframes === null || typeof keyframes !== "object" || Array.isArray(keyframes)) return [];
  const record = keyframes as Readonly<Record<string, unknown>>;
  const spellings: AuthoredSpelling[] = [];
  for (const group of Object.keys(record).sort()) {
    const values = readPluginValues(record[group]);
    if (!Object.hasOwn(values, key)) continue;
    spellings.push({ group, path: `${group}.${PLUGIN_VALUES_SECTION}.${key}`, value: values[key] });
  }
  return spellings;
}

/**
 * An influence in its domain, a finite number greater than zero, or `undefined` for anything else.
 *
 * The one predicate for the domain, read like `readLimitDegree`: a live value reaching the solve is
 * read through it directly, and an authored leaf through it after `readAuthoredLeaf` has proved the
 * leaf static. Zero is outside it on purpose, because a goal that pulls with nothing is a goal the
 * author did not want, and the weighted compromise divides by a sum of influences.
 */
export function readInfluenceValue(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/**
 * One authored `influence` spelling, classified. No `absent` arm, as for `InspectAuthored`, because
 * the rule reads only spellings `authoredSpellings` found.
 */
export type InfluenceAuthored =
  | { readonly kind: "valid"; readonly influence: number }
  | { readonly kind: "malformed" };

/** Influence is a static weight, never an animated value, so a keyframed influence is refused. */
export function classifyInfluence(value: unknown): InfluenceAuthored {
  const leaf = readAuthoredLeaf(value);
  const influence = leaf.kind === "static" ? readInfluenceValue(leaf.value) : undefined;
  return influence === undefined ? { kind: "malformed" } : { kind: "valid", influence };
}
