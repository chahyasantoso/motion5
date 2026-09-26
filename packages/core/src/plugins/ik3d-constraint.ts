import { unreachable } from "../lang/exhaustive";
import {
  AXIS_X_KEY,
  AXIS_Y_KEY,
  AXIS_Z_KEY,
  JOINT_KEY,
  jointConstrains,
  MAX_ROTATION_KEY,
  MAX_SWING_KEY,
  MAX_TWIST_KEY,
  MIN_ROTATION_KEY,
  MIN_TWIST_KEY,
  readAxisComponent,
  readJointKind,
  readSwingDegree,
  LIMIT_CEILING,
} from "../contract/solver-constraints";
import {
  axisX3,
  canonicalDegrees,
  cross3,
  dot3,
  LOCAL_X3,
  multiplyMatrix3,
  norm3,
  normalize3,
  rotationAboutAxis3d,
  swingTwist3d,
  twistAbout3d,
  type Matrix3,
  type Vec3,
} from "./frame3d";
import {
  atBound,
  FREE_JOINT,
  limitRotation,
  readAngleRange,
  type JointLimit,
} from "./ik-constraint";

/**
 * The one runtime owner of 3D joint limits: what a member's live values declare, and the legal local
 * orientation nearest to the one the solve proposes (issue #500 phase 6, ADR-123).
 *
 * The 3D counterpart of `ik-constraint.ts`, and a reader of it rather than a restatement: a hinge's
 * angle range and a swing-twist's twist range are that module's `JointLimit`, read by its
 * `readAngleRange` and limited by its `limitRotation`, so the nearer-bound-on-the-circle rule, the
 * tie to `min` and the unchanged in-range angle hold in both dimensions from one statement. The
 * rotation arithmetic is `frame3d.ts`'s (`rotationAboutAxis3d`, `swingTwist3d`, `twistAbout3d`),
 * and 3D FABRIK enforces a limit by calling `limitLocal3d` inside its outward pass and never
 * restates a bound, which is the ADR-108 split carried into 3D.
 *
 * Every limit is stated in the member's local orientation, its rotation relative to its parent's
 * solved frame, exactly as a 2D range bounds the local angle rather than a turn from rest. So a
 * hinge about the parent's +z over `[min, max]` is the 2D range itself, a cone is centred on the
 * direction a member with no local rotation continues its parent in, and the authored rest
 * orientation stays what `fk3d` composes with no solve, not a second centre for the limit.
 */
export type JointLimit3d =
  | { readonly kind: "free" }
  | { readonly kind: "hinge"; readonly axis: Vec3; readonly range: JointLimit }
  | { readonly kind: "cone"; readonly maxSwing: number }
  | {
      readonly kind: "swing-twist";
      readonly maxSwing: number;
      readonly twist: JointLimit;
    };

export const FREE_JOINT3D: JointLimit3d = Object.freeze({ kind: "free" });

/** The axis a hinge turns about when it authors none: the parent's +z, the 2D plane's normal. */
const DEFAULT_HINGE_AXIS: Vec3 = Object.freeze([0, 0, 1] as const);

/**
 * How little of a member's direction may lie off a hinge's axis before the direction is read as
 * naming no hinge angle, relative to the size of the swept circle. The same `1e-9` the pole rule
 * reads a line with (ADR-118): below it the angle is rounding, not geometry.
 */
const HINGE_DIRECTION_TOLERANCE = 1e-9;

function readHingeAxis(values: Readonly<Record<string, unknown>>): Vec3 {
  const axis: Vec3 = [
    readAxisComponent(values[AXIS_X_KEY]) ?? 0,
    readAxisComponent(values[AXIS_Y_KEY]) ?? 0,
    readAxisComponent(values[AXIS_Z_KEY]) ?? 0,
  ];
  return normalize3(axis, DEFAULT_HINGE_AXIS);
}

/**
 * The limit a member's live values declare, total over any value a live write can deliver.
 *
 * Load refuses every malformed, unused, incomplete or empty authored joint (`ik-joint-malformed`,
 * `ik-joint-key-unused`, `ik-limit-malformed`, `ik-limit-empty`), but a live value-tier write
 * bypasses load, so this reader answers everything rather than trusting it, by ADR-108's rules: a
 * `joint` that names no kind is free; a bound outside its domain is absent and an absent bound is
 * its domain edge, so a cone with no readable `maxSwing` bounds nothing; an axis with no direction
 * is the default +z; and a range is read by the 2D `readAngleRange`, `[min, min]` when inverted.
 */
export function readJointLimit3d(values: Readonly<Record<string, unknown>>): JointLimit3d {
  const kind = readJointKind(values[JOINT_KEY]);
  const maxSwing = (): number => readSwingDegree(values[MAX_SWING_KEY]) ?? LIMIT_CEILING;
  switch (kind) {
    case undefined:
    case "free":
      return FREE_JOINT3D;
    case "hinge":
      return {
        kind,
        axis: readHingeAxis(values),
        range: readAngleRange(values, MIN_ROTATION_KEY, MAX_ROTATION_KEY),
      };
    case "cone":
      return { kind, maxSwing: maxSwing() };
    case "swing-twist":
      return {
        kind,
        maxSwing: maxSwing(),
        twist: readAngleRange(values, MIN_TWIST_KEY, MAX_TWIST_KEY),
      };
    default:
      return unreachable(kind);
  }
}

/** Whether `limit` constrains a solve at all, which is what sends a chain to the iterative solve. */
export function constrains(limit: JointLimit3d): boolean {
  return jointConstrains(limit.kind);
}

/**
 * A proposed local orientation, limited: the legal one nearest to it, or `unmoved` when the proposal
 * is already legal (never for a hinge, see `limitHinge`), and whether it rests on a bound. Unmoved carries no orientation, so a caller
 * keeps the frame and tip it already had and an in-range member publishes the bytes it would
 * unlimited, rather than a copy of the proposal that invites re-deriving it.
 */
export type LimitedLocal3d =
  | { readonly kind: "unmoved"; readonly atBound: boolean }
  | { readonly kind: "moved"; readonly local: Matrix3; readonly atBound: boolean };

const UNLIMITED: LimitedLocal3d = Object.freeze({ kind: "unmoved", atBound: false });

/**
 * The hinge angle a proposed local orientation asks for: the turn about `axis` that points the
 * member's +x nearest the proposed direction.
 *
 * Turning +x about a unit axis sweeps a circle; with `u` the part of +x off the axis and `v = axis ×
 * u`, the turned direction is `x·a a + cos θ u + sin θ v`, so the angle whose direction lies nearest
 * `d` is `atan2(v·d, u·d)`. On the planar hinge (+z) that is the 2D local angle, `atan2(dy, dx)`.
 * When the circle has no size (the axis is the member's own +x, so the bone only rolls) or the
 * direction has no part off the axis (it points along the hinge), the direction names no angle, and
 * the proposed orientation's own turn about the axis answers instead, which is where the solve's
 * reconstructed roll already puts it.
 */
function hingeAngle(axis: Vec3, local: Matrix3): number {
  const along = axis[0];
  const u: Vec3 = [1 - along * axis[0], -along * axis[1], -along * axis[2]];
  const size = norm3(u);
  const direction = axisX3(local);
  const c = dot3(u, direction);
  const s = dot3(cross3(axis, u), direction);
  if (size <= HINGE_DIRECTION_TOLERANCE || Math.hypot(c, s) <= HINGE_DIRECTION_TOLERANCE * size)
    return twistAbout3d(local, axis);
  return canonicalDegrees(Math.atan2(s, c));
}

/**
 * A hinge has one degree of freedom, so its legal orientation is always rebuilt from the limited
 * angle and answered `moved`, in range or not: a proposal is legal only when it is exactly a turn
 * about the axis, and a solve's floating-point orientation never is, so an `unmoved` arm here would
 * publish a tilt off the hinge whenever the angle happened to sit inside the range.
 */
function limitHinge(axis: Vec3, range: JointLimit, local: Matrix3): LimitedLocal3d {
  const angle = limitRotation(range, hingeAngle(axis, local));
  return { kind: "moved", local: rotationAboutAxis3d(axis, angle), atBound: atBound(range, angle) };
}

/**
 * A cone or swing-twist limit, through the swing-twist split about the member's own +x.
 *
 * The swing is capped at `maxSwing` about its own axis, which moves the direction the least, and
 * the twist is limited by the 2D rule, nearer bound on the circle. A cone's twist is `FREE_JOINT`,
 * which `limitRotation` returns unchanged, so a cone keeps the roll the solve reconstructed. An
 * orientation inside both is returned as it came.
 */
function limitSwingTwist(maxSwing: number, twist: JointLimit, local: Matrix3): LimitedLocal3d {
  const split = swingTwist3d(local);
  const twistDegrees = limitRotation(twist, split.twistDegrees);
  const swingOver = split.swingDegrees > maxSwing;
  const bound = split.swingDegrees >= maxSwing || atBound(twist, twistDegrees);
  if (!swingOver && twistDegrees === split.twistDegrees) return { kind: "unmoved", atBound: bound };
  const swing = swingOver ? rotationAboutAxis3d(split.swingAxis, maxSwing) : split.swing;
  return {
    kind: "moved",
    local: multiplyMatrix3(swing, rotationAboutAxis3d(LOCAL_X3, twistDegrees)),
    atBound: bound,
  };
}

/**
 * The legal local orientation nearest to `local` under `limit`: the one question 3D FABRIK asks this
 * module, once per member per outward pass (ADR-123).
 *
 * `proposed` is read only by a limit that needs it, because deriving a local orientation from the
 * solve's world frame costs a matrix product per member per pass that a free joint never reads. A
 * free joint answers unmoved and never at a bound without calling it, so an unconstrained member
 * takes exactly the path, the cost and the bytes it took before limits existed.
 */
export function limitLocal3d(limit: JointLimit3d, proposed: () => Matrix3): LimitedLocal3d {
  switch (limit.kind) {
    case "free":
      return UNLIMITED;
    case "hinge":
      return limitHinge(limit.axis, limit.range, proposed());
    case "cone":
      return limitSwingTwist(limit.maxSwing, FREE_JOINT, proposed());
    case "swing-twist":
      return limitSwingTwist(limit.maxSwing, limit.twist, proposed());
    default:
      return unreachable(limit);
  }
}
