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

/** Default for omitted `minRotation`; domain floor. */
export const LIMIT_FLOOR = -180;
/** Default for omitted `maxRotation`; domain ceiling. */
export const LIMIT_CEILING = 180;

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

/** Sole influence predicate: finite and > 0, else `undefined`. */
export function readInfluenceValue(value: unknown): number | undefined {
  // Zero excluded: weighted compromise divides by influence sum.
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/** Sole orient predicate: finite weight in `[0, 1]`, else `undefined`; past `1` excludes, never clamps. */
export function readOrientValue(value: unknown): number | undefined {
  // Zero inside, unlike influence: leaves position solve unchanged, fade-in anchor; live >1 reads absent.
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
    ? value
    : undefined;
}
