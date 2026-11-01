import { unreachable } from "@motion5/core/plugin-api";
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

/** One member of the 3D two-bone chain, read from delivered values. */
export type SolveMember3d = {
  readonly id: string;
  readonly length: number;
  /** Pivot offset in the parent's rotated frame; `readPivotOffset3d` zeroes a non-finite component. */
  readonly offset: PivotOffset3d;
};

/**
 * Authored bend control: `unbound` keeps the root-local +z rule; `point` is the world position the
 * elbow bends toward, with the bend plane through pivot, goal and pole. */
export type Pole3d =
  | { readonly kind: "unbound" }
  | { readonly kind: "point"; readonly point: Vec3 };

/** Solve with no pole bound; shared, not allocated per solve. */
export const UNBOUND_POLE3D: Pole3d = Object.freeze({ kind: "unbound" });

/** Delivered `pole` slot: absent is `unbound`, else the point its frame names; non-finite reads as zero. */
export function readPole3d(input: unknown): Pole3d {
  if (input === undefined) return UNBOUND_POLE3D;
  const frame = readFrame3d(input);
  return { kind: "point", point: [frame.x, frame.y, frame.z] };
}

/** Pole re-read componentwise through `readNumber`: non-finite reads as zero; `unbound` returns itself. */
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

/** World-unit magnitudes a pole adds to the solve's magnitude policy: none when unbound. */
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

/** Pole scaled with its rig because it is a position; `unbound` is itself. */
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

/** Relative size below which a bend reference reads as on the line toward the goal. */
const BEND_LINE_TOLERANCE = 1e-9;

/**
 * Bend-normal choice: `authored-pole` carries the unit normal; both other arms take the default,
 * `pole-on-line` because a collinear pole names no plane. */
type BendNormal3d =
  | { readonly kind: "authored-pole"; readonly normal: Vec3 }
  | { readonly kind: "default-pole" }
  | { readonly kind: "pole-on-line" };

const DEFAULT_POLE: BendNormal3d = Object.freeze({ kind: "default-pole" });
const POLE_ON_LINE: BendNormal3d = Object.freeze({ kind: "pole-on-line" });

/**
 * Bend normal from the pole: `e1 × (pole - base)` normalized; default when the pole lies on the line. */
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
 * Root-local +z projected off `e1`; on the singular ±z line, where that vanishes, falls back to `e1 × y`. */
function defaultNormal(rootMatrix: Matrix3, e1: Vec3): Vec3 {
  const y = multiplyVector3(rootMatrix, [0, 1, 0]);
  const z = multiplyVector3(rootMatrix, [0, 0, 1]);
  const pole = subtract3(z, scale3(e1, dot3(z, e1)));
  return norm3(pole) > BEND_LINE_TOLERANCE ? normalize3(pole, z) : normalize3(cross3(e1, y), z);
}

/**
 * Bend basis: `e1` at the goal, `normal` from the pole rule, `e2 = normal × e1` the side the elbow
 * bends toward; the tree solve shares it, so the pole rule keeps one owner. */
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

/** World orientation with local +x at `direction` and local +z leaning on `normal`. */
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

/** `world` Euler in `parent`'s frame: `transpose(parent) · world`. */
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
 * Solves one two-bone chain in its bend plane, positive branch; `bend` is re-read and scaled, and a
 * rig past the ceiling solves as its exact power-of-two image. */
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

/** Frame position scaled by `factor`, orientation untouched. */
export function scaleFrame3d(frame: WorldFrame3d, factor: number): WorldFrame3d {
  return { ...frame, x: frame.x * factor, y: frame.y * factor, z: frame.z * factor };
}

/** Pivot offset scaled by `factor`. */
export function scaleOffset3d(offset: PivotOffset3d, factor: number): PivotOffset3d {
  return { x: offset.x * factor, y: offset.y * factor, z: offset.z * factor };
}

/** Maps effective link's local direction to the solved first-member world direction. */
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

/** One solve at a magnitude the arithmetic can hold: bend plane, arm, then pose. */
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
      // Rest pose: effective link and second segment along member-local +x.
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
