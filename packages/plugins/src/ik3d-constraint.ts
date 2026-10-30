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
  unreachable,
} from "@motion5/core/plugin-api";
import {
  axisX3,
  canonicalDegrees,
  cross3,
  dot3,
  eulerFromMatrix3d,
  LOCAL_X3,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  norm3,
  normalize3,
  rotationAboutAxis3d,
  swingTwist3d,
  transposeMatrix3,
  twistAbout3d,
  type Matrix3,
  type Euler3d,
  type Vec3,
} from "./frame3d";
import {
  atBound,
  JOINT_BOUND_TOLERANCE,
  FREE_JOINT,
  legalRotation,
  limitRotation,
  readAngleRange,
  type JointLimit,
} from "./ik-constraint";

/** Sole owner of 3D joint limits: the legal local orientation, relative to the parent's solved frame, nearest the one the solve proposes. */
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

/** Hinge axis when none is authored: the parent's +z, the 2D plane's normal. */
const DEFAULT_HINGE_AXIS: Vec3 = Object.freeze([0, 0, 1] as const);

/** Share of the swept circle's size a direction may lie off a hinge axis by and still name an
 *  angle; below it the offset is rounding, not geometry. */
const HINGE_DIRECTION_TOLERANCE = 1e-9;

/** A hinge plane materially off the planar +/-z plane, on its own axis scale. */
export function nonPlanarHinge3d(limit: JointLimit3d): boolean {
  if (limit.kind !== "hinge") return false;
  const [x, y, z] = limit.axis;
  const largest = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
  return largest > 0 && Math.max(Math.abs(x), Math.abs(y)) > HINGE_DIRECTION_TOLERANCE * largest;
}

/** The unit hinge axis live values declare, divided by its largest magnitude first:
 *  `normalize3`'s length overflows near `Number.MAX_VALUE`, reading a legal axis as +z fallback. */
function readHingeAxis(values: Readonly<Record<string, unknown>>): Vec3 {
  const axis: Vec3 = [
    readAxisComponent(values[AXIS_X_KEY]) ?? 0,
    readAxisComponent(values[AXIS_Y_KEY]) ?? 0,
    readAxisComponent(values[AXIS_Z_KEY]) ?? 0,
  ];
  const largest = Math.max(...axis.map(Math.abs));
  if (largest === 0) return DEFAULT_HINGE_AXIS;
  return normalize3([axis[0] / largest, axis[1] / largest, axis[2] / largest], DEFAULT_HINGE_AXIS);
}

/** Live values bypass load, so this is total: no `joint` kind -> free; a bound outside its domain -> absent -> its domain edge; a directionless axis -> +z; inverted range -> `[min, min]`. */
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

/** Whether `limit` bounds a solve at all; decides whether a chain goes iterative. */
export function constrains(limit: JointLimit3d): boolean {
  return jointConstrains(limit.kind);
}

/** The nearest legal local to a proposal, or `unmoved` when already legal (never for a hinge, see `limitHinge`), plus whether it rests on a bound; `unmoved` carries no orientation. */
export type LimitedLocal3d =
  | { readonly kind: "unmoved"; readonly atBound: boolean }
  | { readonly kind: "moved"; readonly local: Matrix3; readonly atBound: boolean };

const UNLIMITED: LimitedLocal3d = Object.freeze({ kind: "unmoved", atBound: false });

/** `u` = +x off `axis`, `v = axis × u`: the hinge angle nearest direction `d` is atan2(v·d, u·d),
 *  the 2D local angle on +z. Zero-size circle, or `d` along the axis -> the proposal's own roll. */
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

/** 1 DOF: always rebuilt from the limited angle and answered `moved`, in range or not. A float
 *  proposal is never exactly a turn about the axis, so `unmoved` would publish its off-hinge tilt. */
function limitHinge(axis: Vec3, range: JointLimit, local: Matrix3): LimitedLocal3d {
  const angle = limitRotation(range, hingeAngle(axis, local));
  return { kind: "moved", local: rotationAboutAxis3d(axis, angle), atBound: atBound(range, angle) };
}

/** Swing capped at `maxSwing` about its own axis (least direction move); twist by the 2D
 *  nearer-bound rule. A cone's twist is `FREE_JOINT`, so a cone keeps the reconstructed roll. */
function limitSwingTwist(maxSwing: number, twist: JointLimit, local: Matrix3): LimitedLocal3d {
  const split = swingTwist3d(local);
  const twistDegrees = limitRotation(twist, split.twistDegrees);
  const swingOver = split.swingDegrees > maxSwing;
  const bound =
    split.swingDegrees >= maxSwing - JOINT_BOUND_TOLERANCE || atBound(twist, twistDegrees);
  if (!swingOver && twistDegrees === split.twistDegrees) return { kind: "unmoved", atBound: bound };
  const swing = swingOver ? rotationAboutAxis3d(split.swingAxis, maxSwing) : split.swing;
  return {
    kind: "moved",
    local: multiplyMatrix3(swing, rotationAboutAxis3d(LOCAL_X3, twistDegrees)),
    atBound: bound,
  };
}

/** The legal local nearest `local` under `limit`: 3D FABRIK's one question per member per outward pass. `proposed` is lazy, so a free joint never pays that matrix product. */
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

/** Most entrywise drift a rendered hinge local may show and still be the same pose. */
const RENDERED_HINGE_TOLERANCE = 1e-9;

/** Accept a sampled hinge pose only where the axis turn, its Euler round trip and `limitLocal3d` agree to `RENDERED_HINGE_TOLERANCE`; else undefined, so it is never published. */
export function renderedLegalHinge3d(
  limit: Extract<JointLimit3d, { kind: "hinge" }>,
  angle: number,
): { readonly euler: Euler3d; readonly matrix: Matrix3 } | undefined {
  const ideal = rotationAboutAxis3d(limit.axis, angle);
  const euler = eulerFromMatrix3d(ideal);
  const matrix = matrixFromEuler3d(euler);
  if (matrix.some((value, index) => Math.abs(value - ideal[index]!) > RENDERED_HINGE_TOLERANCE))
    return undefined;
  const projected = limitLocal3d(limit, () => matrix);
  if (
    projected.kind !== "moved" ||
    projected.local.some(
      (value, index) => Math.abs(value - matrix[index]!) > RENDERED_HINGE_TOLERANCE,
    )
  )
    return undefined;
  return { euler, matrix };
}

/** The legal local at the centre of `limit`, the pose the 3D legal seed holds a limited member in; a free member has no centre and keeps `rest`, what `fk3d` composes with no solve. */
export function centreLocal3d(limit: JointLimit3d, rest: Matrix3): Matrix3 {
  return legalLocal3d(limit, rest, 0.5);
}

/** A legal local at `fraction` of a member's angle range; cone swing stays at zero. */
export function legalLocal3d(limit: JointLimit3d, rest: Matrix3, fraction: number): Matrix3 {
  switch (limit.kind) {
    case "free":
      return rest;
    case "hinge":
      return rotationAboutAxis3d(limit.axis, legalRotation(limit.range, fraction));
    case "cone":
      return rotationAboutAxis3d(LOCAL_X3, 0);
    case "swing-twist":
      return rotationAboutAxis3d(LOCAL_X3, legalRotation(limit.twist, fraction));
    default:
      return unreachable(limit);
  }
}

/** True when +x lies off the circle the hinge axis sweeps, so no hinge angle holds it: a turn about a unit axis keeps +x's component `a[0]`, so on-circle means `d·a == a[0]` to tolerance. */
export function leavesHingeCircle(limit: JointLimit3d, local: Matrix3): boolean {
  switch (limit.kind) {
    case "hinge":
      return Math.abs(dot3(axisX3(local), limit.axis) - limit.axis[0]) > HINGE_DIRECTION_TOLERANCE;
    case "free":
    case "cone":
    case "swing-twist":
      return false;
    default:
      return unreachable(limit);
  }
}

/** True when the frame is not a pure turn about `axis`: rest roll can hold +x on the circle yet tilt the other axes. A rotation is such a turn exactly when it fixes `axis`. */
export function leavesHingePose(limit: JointLimit3d, local: Matrix3): boolean {
  if (leavesHingeCircle(limit, local)) return true;
  switch (limit.kind) {
    case "hinge": {
      const transformed = multiplyVector3(local, limit.axis);
      return transformed.some(
        (value, index) => Math.abs(value - limit.axis[index]!) > INWARD_FRAME_TOLERANCE,
      );
    }
    case "free":
    case "cone":
    case "swing-twist":
      return false;
    default:
      return unreachable(limit);
  }
}

/** How far a legal local, rebuilt from its proposal, may sit from it entrywise and still count as
 *  that proposal inward: reconstruction drifts ~1e-16, a real tilt or overrun far more. */
const INWARD_FRAME_TOLERANCE = 1e-12;

function sameFrame(a: Matrix3, b: Matrix3): boolean {
  for (let entry = 0; entry < 9; entry += 1)
    if (!(Math.abs(a[entry]! - b[entry]!) <= INWARD_FRAME_TOLERANCE)) return false;
  return true;
}

/** The base frame turned least so a held child's local `base^T child` is legal: `child · legal^T`. `unmoved` carries no frame, so the caller keeps its placement. */
export type BoundBase3d =
  | { readonly kind: "unmoved" }
  | { readonly kind: "moved"; readonly frame: Matrix3 };

const UNMOVED_BASE: BoundBase3d = Object.freeze({ kind: "unmoved" });

export function boundBaseFrame3d(limit: JointLimit3d, child: Matrix3, base: Matrix3): BoundBase3d {
  // Eager: the inward pass asks only about a limited child, and every limit reads its local.
  const local = multiplyMatrix3(transposeMatrix3(base), child);
  const limited = limitLocal3d(limit, () => local);
  switch (limited.kind) {
    case "unmoved":
      return UNMOVED_BASE;
    case "moved":
      if (sameFrame(limited.local, local)) return UNMOVED_BASE;
      return { kind: "moved", frame: multiplyMatrix3(child, transposeMatrix3(limited.local)) };
    default:
      return unreachable(limited);
  }
}
