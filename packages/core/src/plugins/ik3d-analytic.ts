import { unreachable } from "../lang/exhaustive";
import { clamp, readNumber, segmentExtent } from "./frame";
import {
  eulerFromMatrix3d,
  matrixFromEuler3d,
  multiplyMatrix3,
  multiplyVector3,
  transposeMatrix3,
  ZERO_EULER,
  type Euler3d,
  type Matrix3,
  type Vec3,
  type WorldFrame3d,
} from "./frame3d";
import { bandQuality, cosineOpposite } from "./ik-analytic";
import type { ClosedFormQuality } from "./ik-result";
import type { SolveResult3d } from "./ik3d-result";

/** One member of the 3D two-bone chain, read by the plugin from its delivered values. */
export type SolveMember3d = {
  readonly id: string;
  readonly length: number;
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
function normalize(a: Vec3, fallback: Vec3): Vec3 {
  const size = norm(a);
  return size > 0 && Number.isFinite(size) ? scale(a, 1 / size) : fallback;
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
 * direction must switch, and without an authored pole the least surprising place is the pole
 * axis itself. There the normal falls back to `e1 × y` with root-local `y`, which puts the elbow
 * on the root's +y side. The threshold is relative, `1e-9` of the unit pole, rather than a
 * floating-point absolute. An authored pole is the fix, and it is withdrawn from phase 8 in
 * ADR-114 because it is a new graph input and vocabulary.
 */
function bendBasis(rootMatrix: Matrix3, offset: Vec3, distance: number) {
  const x = multiplyVector3(rootMatrix, [1, 0, 0]);
  const y = multiplyVector3(rootMatrix, [0, 1, 0]);
  const z = multiplyVector3(rootMatrix, [0, 0, 1]);
  const e1 = distance > 0 && Number.isFinite(distance) ? scale(offset, 1 / distance) : x;
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

/**
 * Which arm of the closed form answers, as a closed union read by one exhaustive switch. The order
 * is the 2D closed form's (`ik-analytic.ts`): a second segment with no extent aims the first at the
 * goal; a first segment with no extent keeps it at rest and aims the second; a goal clamped to zero
 * distance (on the base, `l1 === l2`) has no direction and answers with the rest pose; otherwise the
 * triangle. Degenerate arms publish an exact zero triple where 2D publishes an exact zero angle.
 */
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
 * The returned Euler triples are local member rotations in CSS Z-X-Y order, canonical in
 * `(-180, 180]`, and the quality is the 2D closed form's own vocabulary, classified by its own
 * `bandQuality` from the same reach band, with the law of cosines read through its own
 * `cosineOpposite`, so neither is stated twice. Direct callers must pass finite frames: the plugin
 * boundary guarantees it through `readFrame3d`, as the 2D reader does, and this function is not a
 * sanitizer. `quality` and `residuals` are solver-level evidence and are not published (ADR-114).
 */
export function solveTwoBone3d(
  root: WorldFrame3d,
  target: WorldFrame3d,
  first: SolveMember3d,
  second: SolveMember3d,
): SolveResult3d {
  const l1 = segmentExtent(readNumber(first.length));
  const l2 = segmentExtent(readNumber(second.length));
  const base: Vec3 = [root.x, root.y, root.z];
  const offset = subtract([target.x, target.y, target.z], base);
  const distance = norm(offset);
  const minReach = Math.abs(l1 - l2);
  const maxReach = l1 + l2;
  const clampedDistance = clamp(distance, minReach, maxReach);
  const rootMatrix = matrixFromEuler3d(root);
  const { e1, e2, normal } = bendBasis(rootMatrix, offset, distance);
  const band = bandQuality(distance, minReach, maxReach, Math.abs(distance - clampedDistance));

  let pose: readonly [Euler3d, Euler3d];
  let quality: ClosedFormQuality = band;
  const arm = armOf(l1, l2, clampedDistance);
  switch (arm.kind) {
    case "aim-first":
      pose = [localEuler(rootMatrix, orientation(e1, normal)), ZERO_EULER];
      break;
    case "aim-second":
      pose = [ZERO_EULER, localEuler(rootMatrix, orientation(e1, normal))];
      break;
    case "coincident":
      // The rest pose lays both segments along the root's +x from the base the goal sits on.
      pose = [ZERO_EULER, ZERO_EULER];
      quality = { kind: "coincident", residual: l1 + l2 };
      break;
    case "triangle": {
      const alpha = Math.acos(cosineOpposite(l1, clampedDistance, l2));
      const elbow = normalize(add(scale(e1, Math.cos(alpha)), scale(e2, Math.sin(alpha))), e1);
      const reach = subtract(scale(e1, clampedDistance), scale(elbow, l1));
      const firstWorld = orientation(elbow, normal);
      const secondWorld = orientation(normalize(reach, e1), normal);
      pose = [localEuler(rootMatrix, firstWorld), localEuler(firstWorld, secondWorld)];
      break;
    }
    default:
      return unreachable(arm);
  }

  return Object.freeze({
    rotations3d: Object.freeze({
      [first.id]: Object.freeze(pose[0]),
      [second.id]: Object.freeze(pose[1]),
    }),
    residuals: Object.freeze({ [second.id]: quality.residual }),
    quality: Object.freeze(quality),
  });
}
