// Docs: ../../../docs/skeldata/CONTRACT.md

/** 2D world or parent frame with coordinates and rotation in degrees. */
export interface Frame2D {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
}

/** 2D local transform relative to parent frame: pivot offset, rotation, and segment extent. */
export interface LocalTransform2D {
  readonly pivotX: number;
  readonly pivotY: number;
  readonly rotation: number;
  readonly extent: number;
}

export const ORIGIN_FRAME: Frame2D = Object.freeze({ x: 0, y: 0, rotation: 0 });

/** Maximum finite magnitude supported before numeric overflow refusal. */
export const MAX_FINITE_MAGNITUDE = 1e300;

export function isFiniteDouble(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number; received ${String(value)}.`);
  }
  if (Math.abs(value) > MAX_FINITE_MAGNITUDE) {
    throw new RangeError(
      `${label} magnitude ${String(value)} exceeds maximum supported finite range ${MAX_FINITE_MAGNITUDE}.`,
    );
  }
}

/** Nonnegative segment extent: negative lengths clamped to 0 while preserving -0 sign on zero. */
export function segmentExtent(length: number): number {
  return length < 0 ? 0 : length;
}

/** Clamps blend weight to [0, 1], defaulting non-finite values to 1. */
export function clampWeight(weight: unknown): number {
  if (typeof weight !== "number" || !Number.isFinite(weight)) return 1;
  return Math.max(0, Math.min(1, weight));
}

/**
 * Converts degrees to radians.
 * Uses unwrapped (degrees * Math.PI) / 180 when finite, reducing modulo 360 only on overflow.
 */
export function toRadians(degrees: number): number {
  const radians = (degrees * Math.PI) / 180;
  return Number.isFinite(radians) || !Number.isFinite(degrees)
    ? radians
    : ((degrees % 360) * Math.PI) / 180;
}

/**
 * Blends from angle to target angle along the shortest circular arc in degrees.
 * Returns exact endpoints at weight 0 and 1 (preserving byte identity / signed zero).
 * Half-turn tie (delta of 180 deg) resolves deterministically in the positive direction via Math.ceil.
 */
export function lerpAngleDegrees(from: number, to: number, weight: number): number {
  if (weight <= 0) return from;
  if (weight >= 1) return to;
  const delta = to - from;
  const wrapped = delta - 360 * Math.ceil((delta - 180) / 360);
  return from + wrapped * weight;
}

/**
 * Composes a local transform onto a parent frame:
 * 1. Pivot offset is rotated by parent.rotation, then added to parent position.
 * 2. Extension along local +x is rotated by (parent.rotation + local.rotation) and added.
 */
export function composeFrame2D(parent: Frame2D, local: LocalTransform2D): Frame2D {
  const parentRad = toRadians(parent.rotation);
  const pCos = Math.cos(parentRad);
  const pSin = Math.sin(parentRad);

  const pivotX = parent.x + (local.pivotX * pCos - local.pivotY * pSin);
  const pivotY = parent.y + (local.pivotX * pSin + local.pivotY * pCos);
  const totalRotation = parent.rotation + local.rotation;

  const totalRad = toRadians(totalRotation);
  const tipX = pivotX + local.extent * Math.cos(totalRad);
  const tipY = pivotY + local.extent * Math.sin(totalRad);

  return Object.freeze({
    x: tipX,
    y: tipY,
    rotation: totalRotation,
  });
}

/**
 * Exact numeric equality via Object.is.
 * Distinguishes +0 from -0; rejects epsilons or lossy hashing.
 */
export function exactEquals(a: number, b: number): boolean {
  return Object.is(a, b);
}

/** Exact frame equality via Object.is on all three coordinates. */
export function exactFrameEquals(a: Frame2D, b: Frame2D): boolean {
  return Object.is(a.x, b.x) && Object.is(a.y, b.y) && Object.is(a.rotation, b.rotation);
}

/** Validates that all fields of a frame are finite and within supported magnitude. */
export function validateFiniteFrame(frame: Frame2D, label: string): Frame2D {
  assertFiniteNumber(frame.x, `${label}.x`);
  assertFiniteNumber(frame.y, `${label}.y`);
  assertFiniteNumber(frame.rotation, `${label}.rotation`);
  return frame;
}
