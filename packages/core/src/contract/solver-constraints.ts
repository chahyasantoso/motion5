import { unreachable } from "../lang/exhaustive";
import { readAuthoredLeaf } from "./authored-leaf";

/** Authored vocabulary of a constrained 2D solve and the one owner of well-formedness: the graph layer reads it for authored values, the runtime for live ones, so each domain is stated once. */
export const MIN_ROTATION_KEY = "minRotation" as const;
export const MAX_ROTATION_KEY = "maxRotation" as const;
/** The solver's branch hint for a shared member. */
export const BEND_KEY = "bend" as const;
/** `bend`'s boolean spelling. */
export const FLIP_KEY = "flip" as const;
/** Static opt-in to the solve's `inspection` output. */
export const INSPECT_KEY = "inspect" as const;
/** That output's authored name, kept beside the switch so the two cannot drift. */
export const INSPECTION_KEY = "inspection" as const;
/** A member's static positive weight on the goal its leaf addresses, read when branches disagree. */
export const INFLUENCE_KEY = "influence" as const;
/** A 3D leaf's static weight in `[0, 1]` on its goal's orientation, read by `ik3d` after the position solve. */
export const ORIENT_KEY = "orient" as const;

/** The per-member local-angle bounds, in degrees. */
export type LimitKey = typeof MIN_ROTATION_KEY | typeof MAX_ROTATION_KEY;
export const LIMIT_KEYS: readonly LimitKey[] = Object.freeze([MIN_ROTATION_KEY, MAX_ROTATION_KEY]);

/** A key the solver node authors itself, scoped to the group that bound its `root`. */
export type SolverKey = typeof BEND_KEY | typeof FLIP_KEY | typeof INSPECT_KEY;

/** The bound an omitted `minRotation` means; the limit domain's floor. */
export const LIMIT_FLOOR = -180;
/** The bound an omitted `maxRotation` means; the limit domain's ceiling. */
export const LIMIT_CEILING = 180;

/** One authored limit pair, classified: free, a range, empty when min > max, or malformed under one key. */
export type LimitAuthored =
  | { readonly kind: "free" }
  | { readonly kind: "range"; readonly min: number; readonly max: number }
  | { readonly kind: "malformed"; readonly key: LimitKey }
  | { readonly kind: "empty"; readonly min: number; readonly max: number };

/** The two branches a solve can take. */
export type Bend = "positive" | "negative";

/** One authored `bend`: absent, a branch name, or malformed. */
export type BendAuthored =
  | { readonly kind: "absent" }
  | { readonly kind: "bend"; readonly bend: Bend }
  | { readonly kind: "malformed" };

/** The one predicate for the limit domain `[-180, 180]`: a degree, else `undefined`. Live values read through it directly, authored leaves once `readAuthoredLeaf` has proved them static. */
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

/** Classifies a member's authored limits: an absent side takes the domain edge, a present one must be a static degree; the first bad key is the malformed one. */
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

/** Classifies one `bend` value: absent, a branch name, or malformed. */
export function classifyBend(value: unknown): BendAuthored {
  if (value === undefined) return { kind: "absent" };
  const leaf = readAuthoredLeaf(value);
  if (leaf.kind !== "static") return { kind: "malformed" };
  const bend = leaf.value;
  return bend === "positive" || bend === "negative"
    ? { kind: "bend", bend }
    : { kind: "malformed" };
}

/** Authored vocabulary of a 3D joint limit, read by `ik3d` from its `fk3d` members: `joint` names the kind, and the kind decides which bound keys are read. */
export const JOINT_KEY = "joint" as const;
/** Hinge axis, in the parent frame; default the parent's `+z`, a turn through `minRotation`/`maxRotation`. */
export const AXIS_X_KEY = "axisX" as const;
/** Hinge axis component, as for `axisX`. */
export const AXIS_Y_KEY = "axisY" as const;
/** Hinge axis component, as for `axisX`. */
export const AXIS_Z_KEY = "axisZ" as const;
/** Cone opening in `[0, 180]` static degrees: how near the parent's `+x` the member may point. Required by `cone` and `swing-twist`. */
export const MAX_SWING_KEY = "maxSwing" as const;
/** Lower twist bound, static limit-domain degrees about the member's own `+x`, for `swing-twist`. */
export const MIN_TWIST_KEY = "minTwist" as const;
/** Upper twist bound, about the member's own `+x`. */
export const MAX_TWIST_KEY = "maxTwist" as const;

/** The four kinds a 3D joint limit can be; an omitted `joint` is `free`, which constrains nothing. */
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

/** A `joint` naming one of the four kinds, else `undefined`. */
export function readJointKind(value: unknown): JointKind | undefined {
  return JOINT_KINDS.find((kind) => kind === value);
}

/** A swing bound in its domain `[0, 180]` degrees, else `undefined`. */
export function readSwingDegree(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= LIMIT_CEILING
    ? value
    : undefined;
}

/** A hinge axis component: any finite number, else `undefined`. */
export function readAxisComponent(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

/** One authored 3D joint limit, classified; refusals name what they cite, and `valid` carries the kind only - `ik3d` owns the numbers it solves with. */
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

/** Classifies a member's authored joint: kind first, then any bound the kind does not read in `JOINT_BOUND_KEYS` order, then each read bound. */
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

/** One authored `inspect` spelling, classified; no `absent` arm, because only a spelling the author wrote is classified. */
export type InspectAuthored =
  | { readonly kind: "valid"; readonly enabled: boolean }
  | { readonly kind: "malformed" };

/** `inspect` is a static boolean, never an animated value. */
export function classifyInspect(value: unknown): InspectAuthored {
  const leaf = readAuthoredLeaf(value);
  return leaf.kind === "static" && typeof leaf.value === "boolean"
    ? { kind: "valid", enabled: leaf.value }
    : { kind: "malformed" };
}

/** The one predicate for the influence domain: finite and greater than zero, else `undefined`. Read like `readLimitDegree`. */
export function readInfluenceValue(value: unknown): number | undefined {
  // Zero is outside on purpose: the weighted compromise divides by the sum of influences.
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/** One authored `influence` spelling, classified; no `absent` arm, as for `InspectAuthored`. */
export type InfluenceAuthored =
  | { readonly kind: "valid"; readonly influence: number }
  | { readonly kind: "malformed" };

/** Influence is a static weight, never an animated value. */
export function classifyInfluence(value: unknown): InfluenceAuthored {
  const leaf = readAuthoredLeaf(value);
  const influence = leaf.kind === "static" ? readInfluenceValue(leaf.value) : undefined;
  return influence === undefined ? { kind: "malformed" } : { kind: "valid", influence };
}

/** The one predicate for the orient domain: a finite weight in `[0, 1]`, else `undefined`. Read like `readLimitDegree`; past `1` the domain excludes rather than clamps. */
export function readOrientValue(value: unknown): number | undefined {
  // Zero is inside, unlike influence: it leaves the position solve's pose unchanged, the anchor a live write fades in from; a live value past `1` reads as absent.
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : undefined;
}

/** One authored `orient` spelling, classified; no `absent` arm, as for `InfluenceAuthored`. */
export type OrientAuthored =
  | { readonly kind: "valid"; readonly orient: number }
  | { readonly kind: "malformed" };

/** Orient is a static weight, as influence is, never an animated value. */
export function classifyOrient(value: unknown): OrientAuthored {
  const leaf = readAuthoredLeaf(value);
  const orient = leaf.kind === "static" ? readOrientValue(leaf.value) : undefined;
  return orient === undefined ? { kind: "malformed" } : { kind: "valid", orient };
}
