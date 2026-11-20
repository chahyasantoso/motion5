import {
  eulerFromMatrix3d,
  matrixFromEuler3d,
  matrixFromQuaternion,
  multiplyMatrix3,
  multiplyVector3,
  canonicalDegrees,
  cross3,
  normalize3,
  axisX3,
  norm3,
  swingFrame3d,
  transposeMatrix3,
  slerpQuaternion,
  quaternionFromEuler3d,
  LOCAL_X3,
  ZERO_EULER,
  type Euler3d,
  type Matrix3,
  type Vec3,
} from "@gerak/core";
import { readNumber } from "./frame";

/** A 3D frame in world space: a position `x`, `y`, `z` and a turn `rotation`, `rotationX`, `rotationY`
 * in degrees on the CSS Z-X-Y order. */
export type WorldFrame3d = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly rotation: number;
  readonly rotationX: number;
  readonly rotationY: number;
};

/** A pivot offset, read in its parent's rotated frame. */
export type PivotOffset3d = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
};

/** The omitted offset, shared, not allocated per read. */
export const ZERO_PIVOT_OFFSET3D: PivotOffset3d = Object.freeze({ x: 0, y: 0, z: 0 });

/** Extension plus child offset, reduced to one member-local link. */
export type EffectiveLink3d =
  | { readonly kind: "axis"; readonly length: number }
  | { readonly kind: "offset"; readonly length: number; readonly vector: Vec3 };

// Ordinary, not frozen: alternating array maps deoptimize hot products.
const INTERNAL_IDENTITY_MATRIX3: Matrix3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];

// Local +z: the axis a half-turn swing takes, where `x × d` names none.
const LOCAL_Z3: Vec3 = Object.freeze([0, 0, 1] as const);

/** Local orientation as `swing * twist`; `twist` turns about local +x, applied first. */
export type SwingTwist3d = {
  readonly swing: Matrix3;
  readonly swingAxis: Vec3;
  readonly swingDegrees: number;
  readonly twistDegrees: number;
};

/** Splits `local` into swing and twist about local +x; a pure swing reads no twist. */
export function swingTwist3d(local: Matrix3): SwingTwist3d {
  const direction = normalize3(axisX3(local), LOCAL_X3);
  const swing = swingFrame3d(INTERNAL_IDENTITY_MATRIX3, direction);
  const twist = multiplyMatrix3(transposeMatrix3(swing), local);
  const across = cross3(LOCAL_X3, direction);
  return {
    // Aligned swing returns its input; copy it so the shared identity never escapes.
    swing:
      swing === INTERNAL_IDENTITY_MATRIX3 ? ([...INTERNAL_IDENTITY_MATRIX3] as Matrix3) : swing,
    swingAxis: normalize3(across, LOCAL_Z3),
    swingDegrees: canonicalDegrees(Math.atan2(norm3(across), direction[0])),
    twistDegrees: canonicalDegrees(Math.atan2(twist[7], twist[4])),
  };
}

/** Twist of `local` about a unit `axis` instead of local +x. */
export function twistAbout3d(local: Matrix3, axis: Vec3): number {
  const basis = swingFrame3d(INTERNAL_IDENTITY_MATRIX3, axis);
  return swingTwist3d(multiplyMatrix3(transposeMatrix3(basis), multiplyMatrix3(local, basis)))
    .twistDegrees;
}

// Structural guard for the pivot reader.
function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}

/** Reads a pivot offset, defaulting absent and non-finite components to zero. */
export function readPivotOffset3d(input: unknown): PivotOffset3d {
  if (!isRecord(input)) return ZERO_PIVOT_OFFSET3D;
  return { x: readNumber(input.x), y: readNumber(input.y), z: readNumber(input.z) };
}

/** Composes local into parent by matrix multiplication, never Euler addition. */
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

/** Member pivot position, byte-identical on the zero-offset path. */
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

/** Orientation `weight` from `rest` to `solved` along the short arc; blends as quaternions, never
 * as authored Euler coordinates; `weight` <= 0 or >= 1 returns that end. */
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
