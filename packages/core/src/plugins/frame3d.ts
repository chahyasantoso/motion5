import { readNumber } from "./frame";

/**
 * The renderer-neutral three-dimensional frame owned by the 3D seam.
 *
 * `rotation` is CSS's Z rotation, followed by `rotationX` and `rotationY`; equivalently the
 * intrinsic Euler order is Z-X-Y. This module is the sole owner of that convention, including
 * matrix composition and the deterministic gimbal-lock representation.
 */
export type Euler3d = {
  readonly rotation: number;
  readonly rotationX: number;
  readonly rotationY: number;
};

export type WorldFrame3d = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation: number;
  readonly rotationX: number;
  readonly rotationY: number;
};

export type Vec3 = readonly [number, number, number];
export type Matrix3 = readonly [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

/** The identity orientation: what an unsolved member composes, and every exact degenerate arm. */
export const ZERO_EULER: Euler3d = Object.freeze({ rotation: 0, rotationX: 0, rotationY: 0 });

const ORIGIN: WorldFrame3d = Object.freeze({
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  rotationX: 0,
  rotationY: 0,
});

function finite(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/** CSS's Rz(rotation) * Rx(rotationX) * Ry(rotationY), with angles in degrees. */
export function matrixFromEuler3d(euler: Euler3d): Matrix3 {
  const z = (finite(euler.rotation) * Math.PI) / 180;
  const x = (finite(euler.rotationX) * Math.PI) / 180;
  const y = (finite(euler.rotationY) * Math.PI) / 180;
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  return [
    cz * cy - sz * sx * sy,
    -sz * cx,
    cz * sy + sz * sx * cy,
    sz * cy + cz * sx * sy,
    cz * cx,
    sz * sy - cz * sx * cy,
    -cx * sy,
    sx,
    cx * cy,
  ];
}

/** Multiplies two row-major 3x3 matrices. */
export function multiplyMatrix3(left: Matrix3, right: Matrix3): Matrix3 {
  return [
    left[0] * right[0] + left[1] * right[3] + left[2] * right[6],
    left[0] * right[1] + left[1] * right[4] + left[2] * right[7],
    left[0] * right[2] + left[1] * right[5] + left[2] * right[8],
    left[3] * right[0] + left[4] * right[3] + left[5] * right[6],
    left[3] * right[1] + left[4] * right[4] + left[5] * right[7],
    left[3] * right[2] + left[4] * right[5] + left[5] * right[8],
    left[6] * right[0] + left[7] * right[3] + left[8] * right[6],
    left[6] * right[1] + left[7] * right[4] + left[8] * right[7],
    left[6] * right[2] + left[7] * right[5] + left[8] * right[8],
  ];
}

/** Multiplies a matrix by a column vector. */
export function multiplyVector3(matrix: Matrix3, vector: Vec3): Vec3 {
  return [
    matrix[0] * vector[0] + matrix[1] * vector[1] + matrix[2] * vector[2],
    matrix[3] * vector[0] + matrix[4] * vector[1] + matrix[5] * vector[2],
    matrix[6] * vector[0] + matrix[7] * vector[1] + matrix[8] * vector[2],
  ];
}

/** The inverse of an orthonormal rotation matrix. */
export function transposeMatrix3(matrix: Matrix3): Matrix3 {
  return [
    matrix[0],
    matrix[3],
    matrix[6],
    matrix[1],
    matrix[4],
    matrix[7],
    matrix[2],
    matrix[5],
    matrix[8],
  ];
}

/** Radians to degrees, canonical in `(-180, 180]` with no negative zero. `atan2` never leaves
 * `[-π, π]`, so its `-180` is the only value to move. */
function canonicalDegrees(radians: number): number {
  const degrees = (radians * 180) / Math.PI;
  return degrees === -180 ? 180 : degrees + 0;
}

/**
 * Decomposes a CSS Z-X-Y matrix into its canonical Euler triple, each angle in `(-180, 180]`.
 *
 * `rotationX` is read as `atan2(m21, hypot(m20, m22))` rather than `asin(m21)`: near either gimbal
 * lock `asin` rounds a representable cosine away and moved a round trip by about `1e-8`, while the
 * `atan2` form keeps it at rounding (`TH-16`). At the lock itself (`cos X` at or below `1e-12`) the
 * Y angle is not determined by the matrix, so it is pinned to zero and the whole Z-and-Y turn is
 * read from the first column, which makes the answer deterministic rather than inheriting a hidden
 * Y angle from whatever rounding produced the matrix.
 */
export function eulerFromMatrix3d(matrix: Matrix3): Euler3d {
  const cosX = Math.hypot(matrix[6], matrix[8]);
  const rotationX = canonicalDegrees(Math.atan2(matrix[7], cosX));
  if (cosX > 1e-12) {
    return {
      rotation: canonicalDegrees(Math.atan2(-matrix[1], matrix[4])),
      rotationX,
      rotationY: canonicalDegrees(Math.atan2(-matrix[6], matrix[8])),
    };
  }
  return { rotation: canonicalDegrees(Math.atan2(matrix[3], matrix[0])), rotationX, rotationY: 0 };
}

function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}

/** Reads an Euler triple, defaulting a missing record and absent or non-finite angles to zero. */
export function readEuler3d(input: unknown): Euler3d {
  if (!isRecord(input)) return ZERO_EULER;
  return {
    rotation: readNumber(input.rotation),
    rotationX: readNumber(input.rotationX),
    rotationY: readNumber(input.rotationY),
  };
}

/** Reads authored 3D frame keys, defaulting absent and non-finite values to zero. */
export function readFrame3d(input: unknown): WorldFrame3d {
  if (!isRecord(input)) return ORIGIN;
  return {
    x: readNumber(input.x),
    y: readNumber(input.y),
    z: readNumber(input.z),
    ...readEuler3d(input),
  };
}

/** Composes a local frame in a parent frame using matrix multiplication, never Euler addition. */
export function composeWorld3d(parent: WorldFrame3d, local: WorldFrame3d): WorldFrame3d {
  const parentMatrix = matrixFromEuler3d(parent);
  const localMatrix = matrixFromEuler3d(local);
  const offset = multiplyVector3(parentMatrix, [local.x, local.y, local.z]);
  const euler = eulerFromMatrix3d(multiplyMatrix3(parentMatrix, localMatrix));
  return {
    x: parent.x + offset[0],
    y: parent.y + offset[1],
    z: parent.z + offset[2],
    ...euler,
  };
}
