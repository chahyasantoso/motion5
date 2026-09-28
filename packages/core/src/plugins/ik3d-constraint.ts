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
  multiplyVector3,
  norm3,
  normalize3,
  rotationAboutAxis3d,
  swingTwist3d,
  transposeMatrix3,
  twistAbout3d,
  type Matrix3,
  type Vec3,
} from "./frame3d";
import {
  atBound,
  JOINT_BOUND_TOLERANCE,
  FREE_JOINT,
  limitRotation,
  rangeCentre,
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

/**
 * The unit hinge axis the live values declare. Every finite component is a direction load accepts,
 * so the vector is first divided by its largest magnitude: `normalize3`'s length would overflow to
 * infinity for components near `Number.MAX_VALUE` and read a legal axis as the +z fallback.
 */
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

/**
 * The legal local orientation at the centre of `limit`, the pose the 3D legal seed holds a limited
 * member in (issue #523, ADR-129): a hinge turned to its range's centre about its axis, a cone with
 * no swing, a swing-twist with no swing and its twist range's centre, each legal by construction.
 * A free member has no centre and keeps `rest`, what `fk3d` composes for it with no solve.
 */
export function centreLocal3d(limit: JointLimit3d, rest: Matrix3): Matrix3 {
  return legalLocal3d(limit, rest, 0.5);
}

/** A legal interpolation within a member's angle range; cone swing stays at zero. */
export function legalLocal3d(limit: JointLimit3d, rest: Matrix3, fraction: number): Matrix3 {
  const angle = (range: JointLimit): number => {
    switch (range.kind) {
      case "free":
        return 0;
      case "range":
        return range.min + fraction * (range.max - range.min);
      default:
        return unreachable(range);
    }
  };
  switch (limit.kind) {
    case "free":
      return rest;
    case "hinge":
      return rotationAboutAxis3d(
        limit.axis,
        fraction === 0.5 ? rangeCentre(limit.range) : angle(limit.range),
      );
    case "cone":
      return rotationAboutAxis3d(LOCAL_X3, 0);
    case "swing-twist":
      return rotationAboutAxis3d(
        LOCAL_X3,
        fraction === 0.5 ? rangeCentre(limit.twist) : angle(limit.twist),
      );
    default:
      return unreachable(limit);
  }
}

/**
 * Whether a local orientation points its member off the circle a hinge's axis sweeps, so that no
 * hinge angle holds it: the member's +x turned about a unit axis keeps its component along the axis,
 * `x·a = a[0]`, so a direction is on the circle exactly when its own component `d·a` equals that, to
 * `HINGE_DIRECTION_TOLERANCE`. Only a hinge names a plane; a free joint, a cone and a swing-twist
 * answer `false`, because a direction they bound is projected onto a bound without leaving the
 * plane it was proposed in. `leavesHingePose` adds the full-frame condition for seed selection
 * (issue #523, ADR-129).
 */
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

/**
 * Whether a proposed frame requires projection onto a pure hinge pose. A direction on
 * the swept circle is not enough: authored rest roll can keep +x on the circle while tilting the
 * other axes. A proper rotation is a turn about `axis` exactly when it fixes that axis. Compare
 * that invariant to the frame tolerance used by inward enforcement; range clipping is deliberately
 * not part of seed selection, because planar arcs may be clipped without leaving their plane.
 */
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

/**
 * How far, entry by entry, a legal local orientation may sit from the proposal it was rebuilt from
 * and still count as that proposal for the inward pass.
 *
 * A hinge rebuilds its local from the limited angle even when the angle is in range (`limitHinge`
 * says why the outward pass must), so a legal child always came back `moved`, and every limited
 * hinge re-derived its base's frame and re-placed its pivot for a turn of a few ulps. The 2D rule
 * returns the base it was given for a legal child, so a planar +z hinge answered differently from
 * the same 2D rig. A rotation matrix's entries are at most one, so a reconstruction of a legal pose
 * differs from it by rounding, around `1e-16`, while a real tilt or overrun is many orders larger.
 */
const INWARD_FRAME_TOLERANCE = 1e-12;

function sameFrame(a: Matrix3, b: Matrix3): boolean {
  for (let entry = 0; entry < 9; entry += 1)
    if (!(Math.abs(a[entry]! - b[entry]!) <= INWARD_FRAME_TOLERANCE)) return false;
  return true;
}

/**
 * A base member's world frame, turned the least that makes a limited child's local orientation
 * legal with the child's frame held: the inward half of bidirectional enforcement (ADR-126, issue
 * #514), and the 3D statement of `boundBaseDirection`.
 *
 * The child's local orientation is `base^T child`, the one `limitLocal3d` bounds in the outward
 * pass. Holding `child` and replacing that local by the legal one nearest it gives `base' = child
 * legal^T`, which is exactly the outward rule solved for the other end. On a planar +z hinge the
 * local is a turn by `dir(child) - dir(base)` and the answer is the base turned to `dir(child) -
 * limitRotation(range, dir(child) - dir(base))`, the 2D formula, so the planar agreement between the
 * dimensions holds. An `unmoved` answer carries no frame, so a caller keeps the placement it
 * already had and a legal pose costs no re-derivation. A legal child is `unmoved` here even for a
 * hinge, whose outward answer is always `moved`: a rebuilt local within `INWARD_FRAME_TOLERANCE` of
 * the proposal is the proposal, which is what `boundBaseDirection` answers for the same planar rig.
 */
export type BoundBase3d =
  | { readonly kind: "unmoved" }
  | { readonly kind: "moved"; readonly frame: Matrix3 };

const UNMOVED_BASE: BoundBase3d = Object.freeze({ kind: "unmoved" });

export function boundBaseFrame3d(limit: JointLimit3d, child: Matrix3, base: Matrix3): BoundBase3d {
  // Read eagerly: the inward pass asks only about a limited child, and every limit reads it.
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
