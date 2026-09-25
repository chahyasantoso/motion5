import { unreachable } from "../lang/exhaustive";
import { clamp, readNumber, segmentExtent } from "./frame";
import {
  eulerFromMatrix3d,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  transposeMatrix3,
  ZERO_EULER,
  effectiveLink3d,
  pivotFromBase3d,
  type EffectiveLink3d,
  type Euler3d,
  type Matrix3,
  type PivotOffset3d,
  type Vec3,
  type WorldFrame3d,
} from "./frame3d";
import { bandQuality, cosineOpposite } from "./ik-analytic";
import type { ClosedFormQuality } from "./ik-result";
import { magnitudeOf, restoreDistance } from "./ik-scale";
import type { SolveResult3d } from "./ik3d-result";
import { readGoal } from "./ik-goal-reading";

/** One member of the 3D two-bone chain, read by the plugin from its delivered values. */
export type SolveMember3d = {
  readonly id: string;
  readonly length: number;
  /** Optional for direct callers predating the plugin's delivered member shape. */
  readonly offset?: PivotOffset3d;
};

function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function scale(a: Vec3, amount: number): Vec3 {
  return [a[0] * amount, a[1] * amount, a[2] * amount];
}
function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}
function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function norm(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}
/**
 * `a` divided by `amount`, component by component.
 *
 * A quotient rather than a product with `1 / amount`, because a reciprocal of a subnormal length is
 * `Infinity` and `0 * Infinity` is `NaN`: a goal `Number.MIN_VALUE` from its root must still point
 * somewhere. A quotient of a vector by its own norm stays inside `[-1, 1]` at every magnitude.
 */
function divide(a: Vec3, amount: number): Vec3 {
  return [a[0] / amount, a[1] / amount, a[2] / amount];
}
function normalize(a: Vec3, fallback: Vec3): Vec3 {
  const size = norm(a);
  return size > 0 && Number.isFinite(size) ? divide(a, size) : fallback;
}

/**
 * The bend plane: `e1` points at the goal, `e2` is the side the elbow bends toward, and `normal`
 * is the plane's normal, a right-handed orthonormal triple with `e2 = normal × e1`.
 *
 * **The root's local +z is the pole.** The normal is root-local +z with its component along `e1`
 * removed. In the planar subset (root rotated about z only, goal in the root's plane) that is +z
 * exactly, so `e2` is the 2D solver's positive branch at every goal azimuth, and it turns
 * continuously with the goal everywhere off the root's local z axis.
 *
 * **One singular line, and why it cannot be removed.** A goal on the root's local ±z axis leaves
 * no component of the pole to keep. Choosing a unit perpendicular continuously for every goal
 * direction is impossible (there is no nowhere-vanishing tangent field on the sphere), so some
 * direction must switch, and without an authored pole the least surprising place is the pole axis
 * itself. There the normal falls back to `e1 × y` with root-local `y`, which puts the elbow on the
 * root's +y side. The threshold is relative, `1e-9` of the unit pole, rather than a floating-point absolute. An authored pole is the fix, and it is withdrawn from phase 8 in ADR-114 because it is a new graph input and vocabulary.
 */
function bendBasis(rootMatrix: Matrix3, offset: Vec3, distance: number) {
  const x = multiplyVector3(rootMatrix, [1, 0, 0]);
  const y = multiplyVector3(rootMatrix, [0, 1, 0]);
  const z = multiplyVector3(rootMatrix, [0, 0, 1]);
  const e1 = distance > 0 && Number.isFinite(distance) ? divide(offset, distance) : x;
  const pole = subtract(z, scale(e1, dot(z, e1)));
  const normal = norm(pole) > 1e-9 ? normalize(pole, z) : normalize(cross(e1, y), z);
  return { e1, e2: cross(normal, e1), normal } as const;
}

/** A world orientation whose local +x is `direction`, rolled so its local +z leans on `normal`. */
function orientation(direction: Vec3, normal: Vec3): Matrix3 {
  const localY = normalize(cross(normal, direction), [0, 1, 0]);
  const localZ = cross(direction, localY);
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
 * Solves one two-bone chain in the root's bend plane with the closed form's positive branch.
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
): SolveResult3d {
  const l1 = segmentExtent(readNumber(first.length));
  const l2 = segmentExtent(readNumber(second.length));
  const firstOffset = first.offset ?? { x: 0, y: 0, z: 0 };
  const secondOffset = second.offset ?? { x: 0, y: 0, z: 0 };
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
  ]);
  switch (magnitude.kind) {
    case "native":
      return solveAtMagnitude(root, target, first.id, l1, firstOffset, second.id, l2, secondOffset);
    case "rescaled": {
      const factor = 2 ** -magnitude.exponent;
      const image = solveAtMagnitude(
        scaleFrame(root, factor),
        scaleFrame(target, factor),
        first.id,
        l1 * factor,
        scaleOffset(firstOffset, factor),
        second.id,
        l2 * factor,
        scaleOffset(secondOffset, factor),
      );
      return restoreResult3d(image, magnitude.exponent);
    }
    default:
      return unreachable(magnitude);
  }
}

/** A frame's position scaled by `factor`, its orientation untouched. */
function scaleFrame(frame: WorldFrame3d, factor: number): WorldFrame3d {
  return { ...frame, x: frame.x * factor, y: frame.y * factor, z: frame.z * factor };
}

function scaleOffset(offset: PivotOffset3d, factor: number): PivotOffset3d {
  return { x: offset.x * factor, y: offset.y * factor, z: offset.z * factor };
}

/** The image's result read back into the rig: the same pose, every residual restored. */
function restoreResult3d(result: SolveResult3d, exponent: number): SolveResult3d {
  const residuals: Record<string, number> = {};
  for (const [id, residual] of Object.entries(result.residuals))
    residuals[id] = restoreDistance(residual, exponent);
  const quality: ClosedFormQuality = {
    ...result.quality,
    residual: restoreDistance(result.quality.residual, exponent),
  };
  return Object.freeze({
    rotations3d: result.rotations3d,
    residuals: Object.freeze(residuals),
    quality: Object.freeze(quality),
  });
}

/** Maps the effective link's local direction into the solved first-member world direction. */
function firstWorldOf(link: EffectiveLink3d, direction: Vec3, normal: Vec3): Matrix3 {
  switch (link.kind) {
    case "axis":
      return orientation(direction, normal);
    case "offset": {
      const linkFrame = orientation(normalize(link.vector, [1, 0, 0]), [0, 0, 1]);
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
      return norm(add(link.vector, [secondLength, 0, 0]));
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
): SolveResult3d {
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
      offset = subtract(
        [reading.coordinates[0]!, reading.coordinates[1]!, reading.coordinates[2]!],
        base,
      );
      distance = norm(offset);
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
  const { e1, e2, normal } = bendBasis(rootMatrix, offset, distance);

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
      const elbow = normalize(add(scale(e1, Math.cos(alpha)), scale(e2, Math.sin(alpha))), e1);
      const reach = subtract(scale(e1, clampedDistance), scale(elbow, firstLength));
      const firstWorld = firstWorldOf(link, elbow, normal);
      const secondWorld = orientation(normalize(reach, e1), normal);
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
