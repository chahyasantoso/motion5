import { unreachable } from "../lang/exhaustive";
import { clamp, readNumber, segmentExtent } from "./frame";
import {
  add3,
  cross3,
  divide3,
  dot3,
  norm3,
  normalize3,
  scale3,
  subtract3,
  eulerFromMatrix3d,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  transposeMatrix3,
  ZERO_EULER,
  effectiveLink3d,
  pivotFromBase3d,
  readFrame3d,
  readPivotOffset3d,
  type EffectiveLink3d,
  type Euler3d,
  type Matrix3,
  type PivotOffset3d,
  type Vec3,
  type WorldFrame3d,
} from "./frame3d";
import { bandQuality, cosineOpposite } from "./ik-analytic";
import type { ClosedFormQuality } from "./ik-result";
import { magnitudeOf } from "./ik-scale";
import { restoreResult3d, type SolveResult3d } from "./ik3d-result";
import { readGoal } from "./ik-goal-reading";

/** One member of the 3D two-bone chain, read by the plugin from its delivered values. */
export type SolveMember3d = {
  readonly id: string;
  readonly length: number;
  /**
   * The member's pivot offset in its parent's rotated frame, required so the solver has one member
   * shape. It is re-read through `readPivotOffset3d` as `length` is through `readNumber`, so a
   * direct caller's non-finite component is zero here exactly as an authored one is (ADR-117).
   */
  readonly offset: PivotOffset3d;
};

/**
 * The solve's authored bend control, a closed union read with exhaustive switches (ADR-092).
 *
 * `unbound` is a solver that bound no `pole` slot, and it keeps ADR-114's root-local +z rule byte
 * for byte. `point` is the world-space position the elbow bends toward, the convention of every DCC
 * tool: the bend plane is the plane through the effective root pivot, the goal and the pole, and
 * the elbow lies on the pole's side of the line from the pivot to the goal. The two are different
 * kinds of reference on purpose. The default rule names the plane's normal, which is what a
 * root-local axis can name without knowing the goal; an authored pole names a side, which is what
 * an author places in a scene. See ADR-118.
 */
export type Pole3d =
  | { readonly kind: "unbound" }
  | { readonly kind: "point"; readonly point: Vec3 };

/** The solve with no pole bound, shared rather than allocated per solve. */
export const UNBOUND_POLE3D: Pole3d = Object.freeze({ kind: "unbound" });

/**
 * Reads a delivered `pole` slot: absent is `unbound`, and anything else is the point its frame
 * names, through `readFrame3d`, so a non-finite coordinate reads as zero exactly as a goal's does.
 */
export function readPole3d(input: unknown): Pole3d {
  if (input === undefined) return UNBOUND_POLE3D;
  const frame = readFrame3d(input);
  return { kind: "point", point: [frame.x, frame.y, frame.z] };
}

/**
 * The pole again, component by component through `readNumber`, as `solveTwoBone3d` re-reads a
 * length and an offset: a direct caller's non-finite coordinate is zero here exactly as a
 * delivered one is, and the unbound pole is returned as itself.
 */
export function rereadPole3d(pole: Pole3d): Pole3d {
  switch (pole.kind) {
    case "unbound":
      return pole;
    case "point":
      return {
        kind: "point",
        point: [readNumber(pole.point[0]), readNumber(pole.point[1]), readNumber(pole.point[2])],
      };
    default:
      return unreachable(pole);
  }
}

/** The world-unit magnitudes a pole adds to the solve's magnitude policy: none when unbound. */
export function poleMagnitudes(pole: Pole3d): readonly number[] {
  switch (pole.kind) {
    case "unbound":
      return [];
    case "point":
      return pole.point;
    default:
      return unreachable(pole);
  }
}

/** A pole scaled with its rig, because it is a position; the unbound pole is itself. */
export function scalePole(pole: Pole3d, factor: number): Pole3d {
  switch (pole.kind) {
    case "unbound":
      return pole;
    case "point":
      return { kind: "point", point: scale3(pole.point, factor) };
    default:
      return unreachable(pole);
  }
}

/**
 * The relative size below which a bend reference is read as lying on the line toward the goal: of
 * the unit default pole for the root-local rule, and of the pivot-to-pole distance for an authored
 * pole. One number for both, because both ask the same question of the same line.
 */
const BEND_LINE_TOLERANCE = 1e-9;

/**
 * Which rule chose the bend plane's normal, a closed union read with an exhaustive switch.
 *
 * `authored-pole` carries the unit normal of the plane through the pivot, the goal and the pole.
 * `default-pole` is a solve with no pole bound. `pole-on-line` is an authored pole collinear with
 * the pivot and the goal, including one on the pivot itself, which names no plane: it takes the
 * default rule deterministically rather than a normal rounding would choose. The two default arms
 * compose identically and stay distinct so the reason is a value rather than a lost fact.
 */
type BendNormal3d =
  | { readonly kind: "authored-pole"; readonly normal: Vec3 }
  | { readonly kind: "default-pole" }
  | { readonly kind: "pole-on-line" };

const DEFAULT_POLE: BendNormal3d = Object.freeze({ kind: "default-pole" });
const POLE_ON_LINE: BendNormal3d = Object.freeze({ kind: "pole-on-line" });

/**
 * The one owner of which rule bends the elbow. `e1 × (pole - base)` is normal to the plane through
 * the pivot, the goal and the pole, and `normal × e1` is then the pole's own side of the line, so
 * the elbow the triangle arm builds from `e2` bends toward the pole. Its size is the pole's distance
 * from the line, so the collinear test is relative to the pole's distance from the pivot.
 */
function bendNormalOf(pole: Pole3d, base: Vec3, e1: Vec3): BendNormal3d {
  switch (pole.kind) {
    case "unbound":
      return DEFAULT_POLE;
    case "point": {
      const toPole = subtract3(pole.point, base);
      const normal = cross3(e1, toPole);
      const size = norm3(normal);
      return size > BEND_LINE_TOLERANCE * norm3(toPole)
        ? { kind: "authored-pole", normal: divide3(normal, size) }
        : POLE_ON_LINE;
    }
    default:
      return unreachable(pole);
  }
}

/**
 * The ADR-114 rule, unchanged: **the root's local +z is the pole.** The normal is root-local +z with
 * its component along `e1` removed. In the planar subset (root rotated about z only, goal in the
 * root's plane) that is +z exactly, so `e2` is the 2D solver's positive branch at every goal
 * azimuth, and it turns continuously with the goal everywhere off the root's local z axis.
 *
 * **One singular line, and why it cannot be removed.** A goal on the root's local ±z axis leaves
 * no component of the pole to keep. Choosing a unit perpendicular continuously for every goal
 * direction is impossible (there is no nowhere-vanishing tangent field on the sphere), so some
 * direction must switch, and without an authored pole the least surprising place is the pole axis
 * itself. There the normal falls back to `e1 × y` with root-local `y`, which puts the elbow on the
 * root's +y side. The threshold is `BEND_LINE_TOLERANCE` of the unit pole rather than a
 * floating-point absolute. An authored pole is the fix for a rig that needs to cross that line
 * smoothly, and ADR-118 adds it.
 */
function defaultNormal(rootMatrix: Matrix3, e1: Vec3): Vec3 {
  const y = multiplyVector3(rootMatrix, [0, 1, 0]);
  const z = multiplyVector3(rootMatrix, [0, 0, 1]);
  const pole = subtract3(z, scale3(e1, dot3(z, e1)));
  return norm3(pole) > BEND_LINE_TOLERANCE ? normalize3(pole, z) : normalize3(cross3(e1, y), z);
}

/**
 * The bend plane: `e1` points at the goal, `e2` is the side the elbow bends toward, and `normal`
 * is the plane's normal, a right-handed orthonormal triple with `e2 = normal × e1`. The normal is
 * `bendNormalOf`'s answer, read exhaustively; both default arms take `defaultNormal`. The tree
 * solve reads the same basis to bend its seed arc, so the pole rule has this one owner (ADR-122).
 */
export function bendBasis3d(
  rootMatrix: Matrix3,
  offset: Vec3,
  distance: number,
  base: Vec3,
  pole: Pole3d,
): { readonly e1: Vec3; readonly e2: Vec3; readonly normal: Vec3 } {
  const x = multiplyVector3(rootMatrix, [1, 0, 0]);
  const e1 = distance > 0 && Number.isFinite(distance) ? divide3(offset, distance) : x;
  const reading = bendNormalOf(pole, base, e1);
  let normal: Vec3;
  switch (reading.kind) {
    case "authored-pole":
      normal = reading.normal;
      break;
    case "default-pole":
    case "pole-on-line":
      normal = defaultNormal(rootMatrix, e1);
      break;
    default:
      return unreachable(reading);
  }
  return { e1, e2: cross3(normal, e1), normal } as const;
}

/** A world orientation whose local +x is `direction`, rolled so its local +z leans on `normal`. */
function orientation(direction: Vec3, normal: Vec3): Matrix3 {
  const localY = normalize3(cross3(normal, direction), [0, 1, 0]);
  const localZ = cross3(direction, localY);
  return [
    direction[0],
    localY[0],
    localZ[0],
    direction[1],
    localY[1],
    localZ[1],
    direction[2],
    localY[2],
    localZ[2],
  ];
}

/** The Euler triple of `world` read in `parent`'s frame: `transpose(parent) · world`. */
function localEuler(parent: Matrix3, world: Matrix3): Euler3d {
  return eulerFromMatrix3d(multiplyMatrix3(transposeMatrix3(parent), world));
}

type TwoBoneArm3d =
  | { readonly kind: "aim-first" }
  | { readonly kind: "aim-second" }
  | { readonly kind: "coincident" }
  | { readonly kind: "triangle" };

function armOf(l1: number, l2: number, clampedDistance: number): TwoBoneArm3d {
  if (l2 <= 0) return { kind: "aim-first" };
  if (l1 <= 0) return { kind: "aim-second" };
  if (clampedDistance <= 0) return { kind: "coincident" };
  return { kind: "triangle" };
}

/**
 * Solves one two-bone chain in its bend plane with the closed form's positive branch.
 *
 * **The bend plane is the pole's when one is bound.** `bend` defaults to `UNBOUND_POLE3D`, the
 * ADR-114 root-local +z rule every caller before ADR-118 relied on, so a solve with no pole runs
 * exactly the arithmetic it always did and adds nothing to the magnitude list. A bound pole is
 * re-read, counted as a world-unit magnitude and scaled with the rig, because it is a position.
 *
 * **Total over finite rigs, at the 2D solve's magnitude policy.** `ik-scale.ts` decides whether the
 * rig solves natively or as its exact power-of-two image, from the same world-unit magnitudes the
 * 2D closed form would read plus `z`. A native rig runs the arithmetic below exactly as it always
 * did; a rig past the ceiling solves as its image, whose angles are the rig's because the solve is
 * scale-free, and its residuals are restored and saturate at `Number.MAX_VALUE` exactly as 2D's do.
 * One owner for the policy is what keeps the planar reduction (`TH-6`) true across the whole finite
 * range rather than only inside it (`TH-22`). A closed union, read with a `switch` that ends in
 * `unreachable` (ADR-092).
 */
export function solveTwoBone3d(
  root: WorldFrame3d,
  target: WorldFrame3d,
  first: SolveMember3d,
  second: SolveMember3d,
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d<ClosedFormQuality> {
  const l1 = segmentExtent(readNumber(first.length));
  const l2 = segmentExtent(readNumber(second.length));
  const firstOffset = readPivotOffset3d(first.offset);
  const secondOffset = readPivotOffset3d(second.offset);
  const pole = rereadPole3d(bend);
  const magnitude = magnitudeOf([
    root.x,
    root.y,
    root.z,
    target.x,
    target.y,
    target.z,
    l1,
    l2,
    firstOffset.x,
    firstOffset.y,
    firstOffset.z,
    secondOffset.x,
    secondOffset.y,
    secondOffset.z,
    ...poleMagnitudes(pole),
  ]);
  switch (magnitude.kind) {
    case "native":
      return solveAtMagnitude(
        root,
        target,
        first.id,
        l1,
        firstOffset,
        second.id,
        l2,
        secondOffset,
        pole,
      );
    case "rescaled": {
      const factor = 2 ** -magnitude.exponent;
      const image = solveAtMagnitude(
        scaleFrame3d(root, factor),
        scaleFrame3d(target, factor),
        first.id,
        l1 * factor,
        scaleOffset3d(firstOffset, factor),
        second.id,
        l2 * factor,
        scaleOffset3d(secondOffset, factor),
        scalePole(pole, factor),
      );
      return restoreResult3d(image, magnitude.exponent);
    }
    default:
      return unreachable(magnitude);
  }
}

/** A frame's position scaled by `factor`, its orientation untouched. */
export function scaleFrame3d(frame: WorldFrame3d, factor: number): WorldFrame3d {
  return { ...frame, x: frame.x * factor, y: frame.y * factor, z: frame.z * factor };
}

/** A pivot offset scaled by `factor`. */
export function scaleOffset3d(offset: PivotOffset3d, factor: number): PivotOffset3d {
  return { x: offset.x * factor, y: offset.y * factor, z: offset.z * factor };
}

/** Maps the effective link's local direction into the solved first-member world direction. */
function firstWorldOf(link: EffectiveLink3d, direction: Vec3, normal: Vec3): Matrix3 {
  switch (link.kind) {
    case "axis":
      return orientation(direction, normal);
    case "offset": {
      const linkFrame = orientation(normalize3(link.vector, [1, 0, 0]), [0, 0, 1]);
      return multiplyMatrix3(orientation(direction, normal), transposeMatrix3(linkFrame));
    }
    default:
      return unreachable(link);
  }
}

function restMiss3d(link: EffectiveLink3d, secondLength: number): number {
  switch (link.kind) {
    case "axis":
      return link.length + secondLength;
    case "offset":
      return norm3(add3(link.vector, [secondLength, 0, 0]));
    default:
      return unreachable(link);
  }
}

/** One solve at a magnitude the arithmetic can hold: the bend plane, the arm, then the pose. */
function solveAtMagnitude(
  root: WorldFrame3d,
  target: WorldFrame3d,
  firstId: string,
  l1: number,
  firstOffset: PivotOffset3d,
  secondId: string,
  l2: number,
  secondOffset: PivotOffset3d,
  pole: Pole3d,
): SolveResult3d<ClosedFormQuality> {
  const reading = readGoal(secondId, [
    ["x", target.x],
    ["y", target.y],
    ["z", target.z],
  ]);
  const base = pivotFromBase3d(root, firstOffset);
  const link = effectiveLink3d(l1, secondOffset);
  const firstLength = link.length;
  const minReach = Math.abs(firstLength - l2);
  const maxReach = firstLength + l2;
  let distance: number;
  let offset: Vec3;
  let clampedDistance: number;
  let band: ClosedFormQuality;
  switch (reading.kind) {
    case "point":
      offset = subtract3(
        [reading.coordinates[0]!, reading.coordinates[1]!, reading.coordinates[2]!],
        base,
      );
      distance = norm3(offset);
      clampedDistance = clamp(distance, minReach, maxReach);
      band = bandQuality(distance, minReach, maxReach, Math.abs(distance - clampedDistance));
      break;
    case "direction": {
      offset = [reading.direction[0]!, reading.direction[1]!, reading.direction[2]!];
      distance = 1;
      clampedDistance = maxReach;
      band = { kind: "too-far", residual: Number.POSITIVE_INFINITY };
      break;
    }
    default:
      return unreachable(reading);
  }
  const rootMatrix = matrixFromEuler3d(root);
  const { e1, e2, normal } = bendBasis3d(rootMatrix, offset, distance, base, pole);

  let pose: readonly [Euler3d, Euler3d];
  let quality: ClosedFormQuality = band;
  const arm = armOf(firstLength, l2, clampedDistance);
  switch (arm.kind) {
    case "aim-first":
      pose = [localEuler(rootMatrix, firstWorldOf(link, e1, normal)), ZERO_EULER];
      break;
    case "aim-second":
      pose = [ZERO_EULER, localEuler(rootMatrix, orientation(e1, normal))];
      break;
    case "coincident":
      // The rest pose lays the effective link and second segment in member-local +x.
      pose = [ZERO_EULER, ZERO_EULER];
      quality = {
        kind: "coincident",
        residual: restMiss3d(link, l2),
      };
      break;
    case "triangle": {
      const alpha = Math.acos(cosineOpposite(firstLength, clampedDistance, l2));
      const elbow = normalize3(add3(scale3(e1, Math.cos(alpha)), scale3(e2, Math.sin(alpha))), e1);
      const reach = subtract3(scale3(e1, clampedDistance), scale3(elbow, firstLength));
      const firstWorld = firstWorldOf(link, elbow, normal);
      const secondWorld = orientation(normalize3(reach, e1), normal);
      pose = [localEuler(rootMatrix, firstWorld), localEuler(firstWorld, secondWorld)];
      break;
    }
    default:
      return unreachable(arm);
  }

  return Object.freeze({
    rotations3d: Object.freeze({
      [firstId]: Object.freeze(pose[0]),
      [secondId]: Object.freeze(pose[1]),
    }),
    residuals: Object.freeze({ [secondId]: quality.residual }),
    quality: Object.freeze(quality),
  });
}
