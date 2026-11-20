/** 3D orientation convention, owned here: CSS Euler order Z-X-Y, degrees. */
export type Euler3d = {
  readonly rotation: number;
  readonly rotationX: number;
  readonly rotationY: number;
};

/** A 3D vector as `[x, y, z]`. */
export type Vec3 = readonly [number, number, number];

/** `w + xi + yj + zk`; unit where produced here; never authored or published. */
export type Quaternion = {
  readonly w: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
};
/** A row-major 3x3 rotation matrix, nine numbers. */
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

/** Identity orientation: what an unsolved member composes, and every exact degenerate arm. */
export const ZERO_EULER: Euler3d = Object.freeze({ rotation: 0, rotationX: 0, rotationY: 0 });

// Degrees to radians; non-finite reads 0; whole turns reduce, so the product cannot overflow.
function radiansOf(degrees: number): number {
  return Number.isFinite(degrees) ? ((degrees % 360) * Math.PI) / 180 : 0;
}

/** CSS `Rz(rotation) * Rx(rotationX) * Ry(rotationY)`, in degrees. */
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

/** Multiplies row-major 3x3 matrices. */
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

/** Radians to degrees, canonical in `(-180, 180]`, no negative zero. */
export function canonicalDegrees(radians: number): number {
  const degrees = (radians * 180) / Math.PI;
  return degrees === -180 ? 180 : degrees + 0;
}

/** Decomposes a CSS Z-X-Y matrix into angles canonical in `(-180, 180]`. */
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

/** Dot product of two vectors. */
export function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** Right-handed cross product `a × b`. */
export function cross3(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

/** `a` scaled by `amount`. */
export function scale3(a: Vec3, amount: number): Vec3 {
  return [a[0] * amount, a[1] * amount, a[2] * amount];
}

/** `a + b`. */
export function add3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

/** `a - b`. */
export function subtract3(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

/** Euclidean length of `a`. */
export function norm3(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}

/** `a` / `amount` componentwise; a quotient: `1 / amount` overflows a subnormal length. */
export function divide3(a: Vec3, amount: number): Vec3 {
  return [a[0] / amount, a[1] / amount, a[2] / amount];
}

/** `a` at unit length, or `fallback` when its length is not finite nonzero. */
export function normalize3(a: Vec3, fallback: Vec3): Vec3 {
  const size = norm3(a);
  return size > 0 && Number.isFinite(size) ? divide3(a, size) : fallback;
}

/** First column: world direction of the frame's local +x. */
export function axisX3(matrix: Matrix3): Vec3 {
  return [matrix[0], matrix[3], matrix[6]];
}

// Below this `1 + cos` a swing is a half turn: `x × d` names no axis.
const HALF_TURN_TOLERANCE = 1e-12;

// Below this `1 + cos` the swing factor uses `1 - cos` over `|v|²`.
const NEAR_HALF_TURN = 1e-3;

/** `frame` turned minimally to take local +x onto `direction`: a swing, no twist. */
export function swingFrame3d(frame: Matrix3, direction: Vec3): Matrix3 {
  const size = norm3(direction);
  if (!(size > 0 && Number.isFinite(size))) return frame;
  const to = divide3(direction, size);
  const from = axisX3(frame);
  const c = dot3(from, to);
  if (from[0] === to[0] && from[1] === to[1] && from[2] === to[2]) return frame;
  if (1 + c <= HALF_TURN_TOLERANCE) {
    const k: Vec3 = [frame[2], frame[5], frame[8]];
    const halfTurn: Matrix3 = [
      2 * k[0] * k[0] - 1,
      2 * k[0] * k[1],
      2 * k[0] * k[2],
      2 * k[1] * k[0],
      2 * k[1] * k[1] - 1,
      2 * k[1] * k[2],
      2 * k[2] * k[0],
      2 * k[2] * k[1],
      2 * k[2] * k[2] - 1,
    ];
    return multiplyMatrix3(halfTurn, frame);
  }
  const [vx, vy, vz] = cross3(from, to);
  // Equal forms; only `(1 - c) / |v|²` stays orthonormal near a half turn.
  const f = 1 + c < NEAR_HALF_TURN ? (1 - c) / (vx * vx + vy * vy + vz * vz) : 1 / (1 + c);
  const swing: Matrix3 = [
    1 - f * (vy * vy + vz * vz),
    -vz + f * vx * vy,
    vy + f * vx * vz,
    vz + f * vx * vy,
    1 - f * (vx * vx + vz * vz),
    -vx + f * vy * vz,
    -vy + f * vx * vz,
    vx + f * vy * vz,
    1 - f * (vx * vx + vy * vy),
  ];
  return multiplyMatrix3(swing, frame);
}

/** Identity rotation: the frame a swing or twist is measured from. */
export const IDENTITY_MATRIX3: Matrix3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1] as const);

/** A member's long axis, local +x: what a twist turns about. */
export const LOCAL_X3: Vec3 = Object.freeze([1, 0, 0] as const);

/** Right-handed rotation by `degrees` about the unit `axis`, row-major. */
export function rotationAboutAxis3d(axis: Vec3, degrees: number): Matrix3 {
  const angle = radiansOf(degrees);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const t = 1 - c;
  const [x, y, z] = axis;
  return [
    t * x * x + c,
    t * x * y - s * z,
    t * x * z + s * y,
    t * x * y + s * z,
    t * y * y + c,
    t * y * z - s * x,
    t * x * z - s * y,
    t * y * z + s * x,
    t * z * z + c,
  ];
}

/** Unit quaternion of a CSS Z-X-Y triple: `qz * qx * qy`, `matrixFromEuler3d`'s order. */
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
  const w = cz * cx;
  const i = cz * sx;
  const j = sz * sx;
  const k = sz * cx;
  return { w: w * cy - j * sy, x: i * cy - k * sy, y: w * sy + j * cy, z: k * cy + i * sy };
}

/** `q`'s row-major matrix; the `2 / |q|²` scale keeps a non-unit `q` a rotation. */
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

function normalizeQuaternion(q: Quaternion): Quaternion {
  const length = Math.hypot(q.w, q.x, q.y, q.z);
  return { w: q.w / length, x: q.x / length, y: q.y / length, z: q.z / length };
}

/** Short-arc blend `weight` from `from` to `to`; a negative dot negates `to` first. */
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
