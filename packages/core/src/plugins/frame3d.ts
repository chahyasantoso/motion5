import { readNumber } from "./frame";

/**
 * The renderer-neutral three-dimensional frame owned by the 3D seam.
 *
 * `rotation` is CSS's Z rotation, followed by `rotationX` and `rotationY`; equivalently the
 * intrinsic Euler order is Z-X-Y. This module is the sole owner of that convention, including
 * matrix composition, the deterministic gimbal-lock representation, and the one rotation blend
 * (`blendOrientation3d`, ADR-116), whose unit quaternions are arithmetic here and never a published
 * or authored shape.
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

/** A member's pivot offset, read in its parent's rotated frame. */
export type PivotOffset3d = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

/** The omitted offset, shared rather than allocated per read. */
export const ZERO_PIVOT_OFFSET3D: PivotOffset3d = Object.freeze({ x: 0, y: 0, z: 0 });

/** A rigid extension plus a child's offset, reduced to one link in member-local coordinates. */
export type EffectiveLink3d =
  | { readonly kind: "axis"; readonly length: number }
  | { readonly kind: "offset"; readonly length: number; readonly vector: Vec3 };

/**
 * A quaternion `w + xi + yj + zk`, unit wherever this module produces one.
 *
 * Exported for the evidence cases and for nothing else: a member authors and publishes Euler
 * triples, so ADR-114's withdrawal of a published or authored quaternion stands (ADR-116).
 */
export type Quaternion = {
  readonly w: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
};
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

/**
 * Degrees to radians, reduced by whole turns first and a non-finite angle read as zero.
 *
 * Whole turns are reduced before conversion, which leaves every angle inside a turn unchanged and
 * keeps a finite angle past about `5.7e307` degrees from overflowing to `Infinity` in the product
 * with `π`, where `sin` and `cos` would answer `NaN` for a rig that is finite (`TH-22`).
 */
function radiansOf(degrees: number): number {
  return Number.isFinite(degrees) ? ((degrees % 360) * Math.PI) / 180 : 0;
}

/** CSS's Rz(rotation) * Rx(rotationX) * Ry(rotationY), with angles in degrees. */
export function matrixFromEuler3d(euler: Euler3d): Matrix3 {
  const z = radiansOf(euler.rotation);
  const x = radiansOf(euler.rotationX);
  const y = radiansOf(euler.rotationY);
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

/** Reads a pivot offset, defaulting absent and non-finite components to zero. */
export function readPivotOffset3d(input: unknown): PivotOffset3d {
  if (!isRecord(input)) return ZERO_PIVOT_OFFSET3D;
  return { x: readNumber(input.x), y: readNumber(input.y), z: readNumber(input.z) };
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

/** The position of a member's pivot, with a byte-identical zero-offset path. */
export function pivotFromBase3d(base: WorldFrame3d, offset: PivotOffset3d): Vec3 {
  if (offset.x === 0 && offset.y === 0 && offset.z === 0) return [base.x, base.y, base.z];
  const composed = composeWorld3d(base, { ...offset, ...ZERO_EULER });
  return [composed.x, composed.y, composed.z];
}

/** The member extension and child offset as one rigid local-space link. */
export function effectiveLink3d(length: number, childOffset: PivotOffset3d): EffectiveLink3d {
  if (childOffset.x === 0 && childOffset.y === 0 && childOffset.z === 0)
    return { kind: "axis", length };
  const vector: Vec3 = [length + childOffset.x, childOffset.y, childOffset.z];
  return { kind: "offset", length: Math.hypot(vector[0], vector[1], vector[2]), vector };
}

/**
 * The unit quaternion of a CSS Z-X-Y triple: the product `qz * qx * qy` of the three axis
 * quaternions in the order `matrixFromEuler3d` multiplies their matrices, so
 * `matrixFromQuaternion(quaternionFromEuler3d(e))` is `matrixFromEuler3d(e)` to rounding (`TH-24`).
 * Angles are read through the same `radiansOf`, so a non-finite angle is zero here exactly as it is
 * in the matrix, and a whole turn reduces before the half angle is taken.
 */
export function quaternionFromEuler3d(euler: Euler3d): Quaternion {
  const z = radiansOf(euler.rotation) / 2;
  const x = radiansOf(euler.rotationX) / 2;
  const y = radiansOf(euler.rotationY) / 2;
  const cz = Math.cos(z);
  const sz = Math.sin(z);
  const cx = Math.cos(x);
  const sx = Math.sin(x);
  const cy = Math.cos(y);
  const sy = Math.sin(y);
  // qz * qx, then that product times qy, expanded.
  const w = cz * cx;
  const i = cz * sx;
  const j = sz * sx;
  const k = sz * cx;
  return { w: w * cy - j * sy, x: i * cy - k * sy, y: w * sy + j * cy, z: k * cy + i * sy };
}

/**
 * The row-major rotation matrix of a quaternion, for the column vectors `multiplyVector3` takes.
 *
 * Scaled by `2 / |q|^2` rather than by `2`, so a quaternion that rounding has moved off the unit
 * sphere still names a rotation instead of a rotation and a scale.
 */
export function matrixFromQuaternion(q: Quaternion): Matrix3 {
  const s = 2 / (q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
  const { w, x, y, z } = q;
  return [
    1 - s * (y * y + z * z),
    s * (x * y - w * z),
    s * (x * z + w * y),
    s * (x * y + w * z),
    1 - s * (x * x + z * z),
    s * (y * z - w * x),
    s * (x * z - w * y),
    s * (y * z + w * x),
    1 - s * (x * x + y * y),
  ];
}

/** `q` scaled onto the unit sphere. */
function normalizeQuaternion(q: Quaternion): Quaternion {
  const length = Math.hypot(q.w, q.x, q.y, q.z);
  return { w: q.w / length, x: q.x / length, y: q.y / length, z: q.z / length };
}

/**
 * The short-arc spherical blend from one rotation toward another, `weight` of the way.
 *
 * `q` and `-q` are one rotation, so a negative dot product negates the target before blending:
 * that is what makes the arc short on rotations rather than on coordinates, and what makes the
 * answer blind to either input's sign (`TH-25`). After the flip the two quaternions are at most a
 * quarter turn apart on the 4-sphere (half a turn as rotations), so the sine below never vanishes
 * away from zero. The angle is read as `2 * atan2(|a - b|, |a + b|)`, which keeps its digits near
 * zero where `acos` of the dot product does not; below `1e-12` of `1 - cos` the spherical weights
 * would still divide by a sine with few digits left, so the blend is the normalized linear one
 * there, which agrees to far below rounding. At exactly half a turn as rotations both arcs are
 * equally short and the sign of the rounded dot product picks one, which the inputs determine.
 *
 * The weight is not clamped: `blendOrientation3d` owns the endpoints and the reader owns what an
 * authored weight means.
 */
export function slerpQuaternion(from: Quaternion, to: Quaternion, weight: number): Quaternion {
  const dot = from.w * to.w + from.x * to.x + from.y * to.y + from.z * to.z;
  const b = dot < 0 ? { w: -to.w, x: -to.x, y: -to.y, z: -to.z } : to;
  const cos = dot < 0 ? -dot : dot;
  if (1 - cos < 1e-12) {
    const a = 1 - weight;
    return normalizeQuaternion({
      w: a * from.w + weight * b.w,
      x: a * from.x + weight * b.x,
      y: a * from.y + weight * b.y,
      z: a * from.z + weight * b.z,
    });
  }
  const angle =
    2 *
    Math.atan2(
      Math.hypot(from.w - b.w, from.x - b.x, from.y - b.y, from.z - b.z),
      Math.hypot(from.w + b.w, from.x + b.x, from.y + b.y, from.z + b.z),
    );
  const sin = Math.sin(angle);
  const a = Math.sin((1 - weight) * angle) / sin;
  const c = Math.sin(weight * angle) / sin;
  return normalizeQuaternion({
    w: a * from.w + c * b.w,
    x: a * from.x + c * b.x,
    y: a * from.y + c * b.y,
    z: a * from.z + c * b.z,
  });
}

/**
 * The orientation `weight` of the way along the one short arc from `rest` to `solved`: the 3D
 * counterpart of 2D's `lerpAngle`, and like it the only blend its dimension has (ADR-116).
 *
 * A weight at or below `0` returns `rest` itself and at or above `1` returns `solved` itself, not
 * a round trip through a quaternion that would move their last bits (`TH-27`). Between them the
 * blend is `slerpQuaternion` on both triples' quaternions, decomposed back through
 * `eulerFromMatrix3d`, so every angle it answers is canonical in `(-180, 180]` and the gimbal-lock
 * rule is the one that function already pins. Euler coordinates are never interpolated: three
 * linearly blended angles neither follow a great circle nor have a short arc, and two triples
 * naming one orientation would blend differently (`TH-25`, `TH-26`).
 */
export function blendOrientation3d(rest: Euler3d, solved: Euler3d, weight: number): Euler3d {
  if (weight <= 0) return rest;
  if (weight >= 1) return solved;
  const blended = slerpQuaternion(
    quaternionFromEuler3d(rest),
    quaternionFromEuler3d(solved),
    weight,
  );
  return eulerFromMatrix3d(matrixFromQuaternion(blended));
}
