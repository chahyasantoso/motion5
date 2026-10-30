import { readNumber } from "./frame";

/** The 3D orientation convention, owned here: CSS Euler order Z-X-Y, in degrees. */
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

/** An extension plus a child offset, reduced to one member-local link. */
export type EffectiveLink3d =
  | { readonly kind: "axis"; readonly length: number }
  | { readonly kind: "offset"; readonly length: number; readonly vector: Vec3 };

/** `w + xi + yj + zk`, unit wherever this module produces one; never authored or published. */
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

// Degrees to radians; non-finite reads zero, whole turns reduce so the product cannot overflow.
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

/** Radians to degrees, canonical in `(-180, 180]` with no negative zero. */
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

/** The shared structural guard for frame and rig readers. */
export function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}

/** The dot product of two vectors. */
export function dot3(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/** The right-handed cross product `a × b`. */
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

/** The Euclidean length of `a`. */
export function norm3(a: Vec3): number {
  return Math.hypot(a[0], a[1], a[2]);
}

/** `a` / `amount` componentwise; a quotient, since `1 / amount` overflows a subnormal length. */
export function divide3(a: Vec3, amount: number): Vec3 {
  return [a[0] / amount, a[1] / amount, a[2] / amount];
}

/** `a` scaled to unit length, or `fallback` when it has no finite nonzero length. */
export function normalize3(a: Vec3, fallback: Vec3): Vec3 {
  const size = norm3(a);
  return size > 0 && Number.isFinite(size) ? divide3(a, size) : fallback;
}

/** A matrix's first column: the world direction of the frame's local +x. */
export function axisX3(matrix: Matrix3): Vec3 {
  return [matrix[0], matrix[3], matrix[6]];
}

// Below this `1 + cos` a swing is a half turn: `x × d` names no axis.
const HALF_TURN_TOLERANCE = 1e-12;

// Below this `1 + cos` the swing factor uses `1 - cos` over `|v|²`.
const NEAR_HALF_TURN = 1e-3;

/** `frame` turned by the minimal rotation taking its local +x onto `direction`: a swing, no twist. */
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
  // Equal forms; only `(1 - c) / |v|²` keeps the swing orthonormal near a half turn.
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

/** The identity rotation: the frame a swing or a twist is measured from. */
export const IDENTITY_MATRIX3: Matrix3 = Object.freeze([1, 0, 0, 0, 1, 0, 0, 0, 1] as const);

// Ordinary, not the frozen public one: alternating array maps deoptimize hot products.
const INTERNAL_IDENTITY_MATRIX3: Matrix3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

/** A member's long axis, local +x: what a twist turns about. */
export const LOCAL_X3: Vec3 = Object.freeze([1, 0, 0] as const);

// Local +z: the axis a half-turn swing takes, where `x × d` names none.
const LOCAL_Z3: Vec3 = Object.freeze([0, 0, 1] as const);

/** The right-handed rotation by `degrees` about the unit `axis`, as a row-major matrix. */
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

/** A local orientation as `swing * twist`, `twist` the turn about local +x applied first. */
export type SwingTwist3d = {
  readonly swing: Matrix3;
  readonly swingAxis: Vec3;
  readonly swingDegrees: number;
  readonly twistDegrees: number;
};

/** Splits `local` into swing and twist about local +x; a pure swing reads back with no twist. */
export function swingTwist3d(local: Matrix3): SwingTwist3d {
  const direction = normalize3(axisX3(local), LOCAL_X3);
  const swing = swingFrame3d(INTERNAL_IDENTITY_MATRIX3, direction);
  const twist = multiplyMatrix3(transposeMatrix3(swing), local);
  const across = cross3(LOCAL_X3, direction);
  return {
    // The aligned swing returns its input: copy it, so the shared identity never escapes.
    swing:
      swing === INTERNAL_IDENTITY_MATRIX3 ? ([...INTERNAL_IDENTITY_MATRIX3] as Matrix3) : swing,
    swingAxis: normalize3(across, LOCAL_Z3),
    swingDegrees: canonicalDegrees(Math.atan2(norm3(across), direction[0])),
    twistDegrees: canonicalDegrees(Math.atan2(twist[7], twist[4])),
  };
}

/** The twist of `local` about a unit `axis` instead of about local +x. */
export function twistAbout3d(local: Matrix3, axis: Vec3): number {
  const basis = swingFrame3d(INTERNAL_IDENTITY_MATRIX3, axis);
  return swingTwist3d(multiplyMatrix3(transposeMatrix3(basis), multiplyMatrix3(local, basis)))
    .twistDegrees;
}

/** Reads a pivot offset, defaulting absent and non-finite components to zero. */
export function readPivotOffset3d(input: unknown): PivotOffset3d {
  if (!isRecord(input)) return ZERO_PIVOT_OFFSET3D;
  return { x: readNumber(input.x), y: readNumber(input.y), z: readNumber(input.z) };
}

/** Reads an Euler triple, defaulting absent and non-finite angles to zero. */
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

/** Composes a local frame into its parent by matrix multiplication, never Euler addition. */
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

/** The unit quaternion of a CSS Z-X-Y triple, `qz * qx * qy` in `matrixFromEuler3d`'s order. */
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

/** `q`'s row-major rotation matrix; the `2 / |q|²` scale keeps a non-unit `q` a rotation. */
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

/** Short-arc blend `weight` of the way from `from` to `to`; a negative dot negates `to` first. */
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

/** The orientation `weight` of the way from `rest` to `solved` along the short arc, blended as
 * quaternions, never as the authored Euler coordinates; `weight` <= 0 or >= 1 returns that end. */
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
