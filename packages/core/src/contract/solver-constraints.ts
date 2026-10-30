import { unreachable } from "../lang/exhaustive";
import { readAuthoredLeaf } from "./authored-leaf";

/** Lower local-angle bound, in degrees. */
export const MIN_ROTATION_KEY = "minRotation" as const;
/** Upper local-angle bound, in degrees. */
export const MAX_ROTATION_KEY = "maxRotation" as const;
/** The solver's branch hint for a shared member. */
export const BEND_KEY = "bend" as const;
/** `bend`'s boolean spelling. */
export const FLIP_KEY = "flip" as const;
/** Static opt-in to the solve's `inspection` output. */
export const INSPECT_KEY = "inspect" as const;
/** Authored name of the `inspection` output, beside its switch. */
export const INSPECTION_KEY = "inspection" as const;
/** Member's static positive weight on its leaf's goal; read when branches disagree. */
export const INFLUENCE_KEY = "influence" as const;
/** 3D leaf's static `[0, 1]` weight on goal orientation; `ik3d` reads after position solve. */
export const ORIENT_KEY = "orient" as const;

/** Per-member local-angle bounds, in degrees. */
export type LimitKey = typeof MIN_ROTATION_KEY | typeof MAX_ROTATION_KEY;
export const LIMIT_KEYS: readonly LimitKey[] = Object.freeze([MIN_ROTATION_KEY, MAX_ROTATION_KEY]);

/** Solver-authored key, scoped to the group that bound its `root`. */
export type SolverKey = typeof BEND_KEY | typeof FLIP_KEY | typeof INSPECT_KEY;

/** Default for omitted `minRotation`; domain floor. */
export const LIMIT_FLOOR = -180;
/** Default for omitted `maxRotation`; domain ceiling. */
export const LIMIT_CEILING = 180;

/** Authored limit pair: free, range, empty (min > max), or malformed key. */
export type LimitAuthored =
  | { readonly kind: "free" }
  | { readonly kind: "range"; readonly min: number; readonly max: number }
  | { readonly kind: "malformed"; readonly key: LimitKey }
  | { readonly kind: "empty"; readonly min: number; readonly max: number };

/** The two branches a solve can take. */
export type Bend = "positive" | "negative";

/** Authored `bend`: absent, branch name, or malformed. */
export type BendAuthored =
  | { readonly kind: "absent" }
  | { readonly kind: "bend"; readonly bend: Bend }
  | { readonly kind: "malformed" };

/** Sole limit-domain predicate: a degree in `[-180, 180]`, else `undefined`. */
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

/** Authored limits: absent side → domain edge, present side static degree; first bad key malformed. */
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

/** Classify `bend`: absent, branch name, or malformed. */
export function classifyBend(value: unknown): BendAuthored {
  if (value === undefined) return { kind: "absent" };
  const leaf = readAuthoredLeaf(value);
  if (leaf.kind !== "static") return { kind: "malformed" };
  const bend = leaf.value;
  return bend === "positive" || bend === "negative"
    ? { kind: "bend", bend }
    : { kind: "malformed" };
}

/** 3D joint-limit discriminator, read by `ik3d` from `fk3d`; kind decides bound keys. */
export const JOINT_KEY = "joint" as const;
/** Hinge axis in parent frame; default `+z`; angle is `minRotation`/`maxRotation` range. */
export const AXIS_X_KEY = "axisX" as const;
/** Hinge axis component, as for `axisX`. */
export const AXIS_Y_KEY = "axisY" as const;
/** Hinge axis component, as for `axisX`. */
export const AXIS_Z_KEY = "axisZ" as const;
/** Cone opening `[0, 180]` static degrees from parent `+x`; `cone`/`swing-twist` require it. */
export const MAX_SWING_KEY = "maxSwing" as const;
/** Lower twist bound about member's `+x`, static limit-domain degrees. */
export const MIN_TWIST_KEY = "minTwist" as const;
/** Upper twist bound about member's `+x`. */
export const MAX_TWIST_KEY = "maxTwist" as const;

/** Four 3D joint kinds; omitted `joint` = `free`, constraining nothing. */
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

/** Every bound key a 3D joint reads besides `joint`, 2D range keys included. */
export type JointBoundKey = AxisKey | LimitKey | typeof MAX_SWING_KEY | TwistKey;
export type JointVocabularyKey = typeof JOINT_KEY | JointBoundKey;
export const JOINT_BOUND_KEYS: readonly JointBoundKey[] = Object.freeze([
  ...AXIS_KEYS,
  ...LIMIT_KEYS,
  MAX_SWING_KEY,
  ...TWIST_KEYS,
]);
/** Whole 3D joint vocabulary, `joint` first: what `fk3d` claims, what load rules read. */
export const JOINT_VOCABULARY_KEYS: readonly JointVocabularyKey[] = Object.freeze([
  JOINT_KEY,
  ...JOINT_BOUND_KEYS,
]);
/** Keys only a 3D joint reads: vocabulary minus 2D range shared with `fk`. */
export const JOINT_ONLY_KEYS: readonly JointVocabularyKey[] = Object.freeze([
  JOINT_KEY,
  ...AXIS_KEYS,
  MAX_SWING_KEY,
  ...TWIST_KEYS,
]);

/** Bound keys `kind` reads; other authored bound keys unused. */
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

/** Whether `kind` constrains the solve: all but `free`. */
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

/** Classified 3D joint limit: `valid` carries kind only; `ik3d` owns the numbers it solves with. */
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

/** Authored range pair: present sides static limit-domain degrees, min <= max. */
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

/** Hinge axis: present components static, finite, not all zero. */
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

/** `maxSwing` required by `cone`/`swing-twist`: present, static, `[0, 180]`. */
function classifySwing(
  values: Readonly<Partial<Record<JointVocabularyKey, unknown>>>,
  joint: JointKind,
): JointAuthored | undefined {
  if (!Object.hasOwn(values, MAX_SWING_KEY)) return { kind: "missing", joint, key: MAX_SWING_KEY };
  return readStatic(values[MAX_SWING_KEY], readSwingDegree) === undefined
    ? { kind: "malformed", key: MAX_SWING_KEY }
    : undefined;
}

/** Classify joint: kind, then unread bound keys in `JOINT_BOUND_KEYS` order, then read bounds. */
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

/** Classified `inspect` spelling; no `absent` arm. */
export type InspectAuthored =
  | { readonly kind: "valid"; readonly enabled: boolean }
  | { readonly kind: "malformed" };

/** `inspect` is a static boolean, never animated. */
export function classifyInspect(value: unknown): InspectAuthored {
  const leaf = readAuthoredLeaf(value);
  return leaf.kind === "static" && typeof leaf.value === "boolean"
    ? { kind: "valid", enabled: leaf.value }
    : { kind: "malformed" };
}

/** Sole influence predicate: finite and > 0, else `undefined`. */
export function readInfluenceValue(value: unknown): number | undefined {
  // Zero excluded: weighted compromise divides by influence sum.
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/** Classified `influence` spelling; no `absent` arm. */
export type InfluenceAuthored =
  | { readonly kind: "valid"; readonly influence: number }
  | { readonly kind: "malformed" };

/** `influence` is a static weight, never animated. */
export function classifyInfluence(value: unknown): InfluenceAuthored {
  const leaf = readAuthoredLeaf(value);
  const influence = leaf.kind === "static" ? readInfluenceValue(leaf.value) : undefined;
  return influence === undefined ? { kind: "malformed" } : { kind: "valid", influence };
}

/** Sole orient predicate: finite weight in `[0, 1]`, else `undefined`; past `1` excludes, never clamps. */
export function readOrientValue(value: unknown): number | undefined {
  // Zero inside, unlike influence: leaves position solve unchanged, fade-in anchor; live >1 reads absent.
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : undefined;
}

/** Classified `orient` spelling; no `absent` arm. */
export type OrientAuthored =
  | { readonly kind: "valid"; readonly orient: number }
  | { readonly kind: "malformed" };

/** `orient` is a static weight, never animated. */
export function classifyOrient(value: unknown): OrientAuthored {
  const leaf = readAuthoredLeaf(value);
  const orient = leaf.kind === "static" ? readOrientValue(leaf.value) : undefined;
  return orient === undefined ? { kind: "malformed" } : { kind: "valid", orient };
}
