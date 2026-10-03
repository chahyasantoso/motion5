import { validateScalarNoise, type ScalarMeasurement, type ScalarNoise } from "./kalman";
import { add, dot, norm, scale, sub, unit, type Vec } from "./vec";

export function cross(a: Vec, b: Vec): Vec {
  return [
    a[1]! * b[2]! - a[2]! * b[1]!,
    a[2]! * b[0]! - a[0]! * b[2]!,
    a[0]! * b[1]! - a[1]! * b[0]!,
  ];
}

/** Rodrigues exponential: angular velocity is a rotation vector, not Euler rates. */
export function rotate(vector: Vec, rotation: Vec): Vec {
  const angle = norm(rotation);
  if (angle < 1e-12) return vector;
  const axis = scale(rotation, 1 / angle);
  return add(
    add(scale(vector, Math.cos(angle)), scale(cross(axis, vector), Math.sin(angle))),
    scale(axis, dot(axis, vector) * (1 - Math.cos(angle))),
  );
}

function perpendicular(direction: Vec): Vec {
  const axes: readonly Vec[] = [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const axis = axes.reduce((a, b) =>
    Math.abs(dot(a, direction)) < Math.abs(dot(b, direction)) ? a : b,
  );
  return unit(cross(direction, axis))!;
}

/** Shortest rotation taking one unit direction to another, including the antipodal limit. */
export function directionResidual(from: Vec, to: Vec): Vec {
  const axis = cross(from, to);
  const sine = norm(axis);
  const cosine = Math.min(1, Math.max(-1, dot(from, to)));
  if (sine < 1e-10) return cosine < 0 ? scale(perpendicular(from), Math.PI) : [0, 0, 0];
  return scale(axis, Math.atan2(sine, cosine) / sine);
}

export interface DirectionState {
  readonly direction: Vec;
  /** Tangent angular velocity in the parent's coordinates, in radians/second. */
  readonly velocity: Vec;
  readonly p00: number;
  readonly p01: number;
  readonly p11: number;
  readonly tMs: number;
  readonly measuredMs: number;
}

export interface DirectionMeasurement extends Omit<ScalarMeasurement, "value"> {
  readonly direction: Vec;
}

/**
 * Intrinsic direction/ angular-velocity CV filter. The innovation is the sphere's shortest
 * rotation, integrated with Rodrigues, so there is no longitude pole or Euler wrap singularity.
 * Covariance is the isotropic local tangent approximation, not a full attitude/roll estimator.
 * Joseph correction and continuous white acceleration use the same two-state model as image CV.
 */
export function createDirectionFilter(options: ScalarNoise) {
  const noise = validateScalarNoise(options);
  let state: DirectionState | undefined;
  let previousMs: number | undefined;
  return {
    get state() {
      return state;
    },
    /** Roll back this filter when a later member of an app-level frame transaction fails. */
    checkpoint(): () => void {
      const savedState = state,
        savedMs = previousMs;
      return () => {
        state = savedState;
        previousMs = savedMs;
      };
    },
    step(tMs: number, measurement?: DirectionMeasurement): DirectionState | undefined {
      if (!Number.isFinite(tMs) || (previousMs !== undefined && tMs < previousMs))
        throw new Error("Direction timestamps must be finite and nondecreasing.");
      if (
        measurement !== undefined &&
        (measurement.direction.length !== 3 ||
          !measurement.direction.every(Number.isFinite) ||
          unit(measurement.direction) === undefined ||
          !Number.isFinite(measurement.visibility) ||
          measurement.visibility < 0 ||
          measurement.visibility > 1)
      )
        throw new Error("Direction measurement must be finite, nonzero and visible in [0, 1].");
      const r = noise.measurementVariance / Math.max(measurement?.visibility ?? 1, 0.05);
      if (!Number.isFinite(r)) throw new Error("Direction observation variance overflow.");
      if (state === undefined) {
        if (measurement === undefined) {
          previousMs = tMs;
          return undefined;
        }
        state = {
          direction: unit(measurement.direction)!,
          velocity: [0, 0, 0],
          p00: r,
          p01: 0,
          p11: noise.accelerationVariance,
          tMs,
          measuredMs: tMs,
        };
        previousMs = tMs;
        return state;
      }
      const dt = (tMs - state.tMs) / 1000;
      const q = noise.accelerationVariance;
      const predicted = {
        direction: unit(rotate(state.direction, scale(state.velocity, dt)))!,
        velocity: state.velocity,
        p00: state.p00 + 2 * dt * state.p01 + dt * dt * state.p11 + (q * dt ** 3) / 3,
        p01: state.p01 + dt * state.p11 + (q * dt * dt) / 2,
        p11: state.p11 + q * dt,
        tMs,
        measuredMs: state.measuredMs,
      };
      let next: DirectionState = predicted;
      if (measurement !== undefined) {
        const innovation = predicted.p00 + r;
        if (!Number.isFinite(innovation) || innovation <= 0)
          throw new Error("Direction innovation variance overflow.");
        const residual = directionResidual(predicted.direction, unit(measurement.direction)!);
        const k0 = predicted.p00 / innovation;
        const k1 = predicted.p01 / innovation;
        const a = 1 - k0;
        const correction = scale(residual, k0);
        const direction = unit(rotate(predicted.direction, correction))!;
        const velocity = rotate(add(predicted.velocity, scale(residual, k1)), correction);
        next = {
          direction,
          velocity: sub(velocity, scale(direction, dot(velocity, direction))),
          p00: Math.max(0, a * a * predicted.p00 + k0 * k0 * r),
          p01: a * (predicted.p01 - k1 * predicted.p00) + k0 * k1 * r,
          p11: Math.max(
            0,
            predicted.p11 - 2 * k1 * predicted.p01 + k1 * k1 * predicted.p00 + k1 * k1 * r,
          ),
          tMs,
          measuredMs: tMs,
        };
      }
      if (
        ![...next.direction, ...next.velocity, next.p00, next.p01, next.p11].every(Number.isFinite)
      )
        throw new Error("Direction state overflow.");
      state = next;
      previousMs = tMs;
      return state;
    },
    reset() {
      state = undefined;
      previousMs = undefined;
    },
  };
}

export type DirectionFilter = ReturnType<typeof createDirectionFilter>;

/** Right-handed orthonormal parent frame; y follows the parent segment. */
export interface Basis {
  readonly x: Vec;
  readonly y: Vec;
  readonly z: Vec;
}

export function basis(x: Vec, y: Vec): Basis | undefined {
  const axisX = unit(x);
  if (axisX === undefined) return undefined;
  const axisY = unit(sub(y, scale(axisX, dot(y, axisX))));
  if (axisY === undefined) return undefined;
  const axisZ = unit(cross(axisX, axisY));
  return axisZ === undefined ? undefined : { x: axisX, y: axisY, z: axisZ };
}

export function toLocal(frame: Basis, vector: Vec): Vec {
  return [dot(vector, frame.x), dot(vector, frame.y), dot(vector, frame.z)];
}

export function toWorld(frame: Basis, vector: Vec): Vec {
  return add(
    add(scale(frame.x, vector[0]!), scale(frame.y, vector[1]!)),
    scale(frame.z, vector[2]!),
  );
}

/** Minimum rotation carries the torso frame to the current upper segment, without inventing roll. */
export function segmentBasis(frame: Basis, direction: Vec): Basis {
  const rotation = directionResidual(frame.y, direction);
  return { x: rotate(frame.x, rotation), y: direction, z: rotate(frame.z, rotation) };
}

/**
 * Continuous parent gauge, carried in torso-local coordinates by the last trusted upper segment.
 * A direction does not observe roll. Preserve that unobserved roll instead of choosing a new
 * shortest-rotation chart at every sample (which flips at an antipodal upper segment).
 */
export function continuedSegmentBasis(frame: Basis, direction: Vec, previous?: Basis): Basis {
  if (previous === undefined) return segmentBasis(frame, direction);
  const preferred = toWorld(frame, previous.x);
  const alternative = toWorld(frame, previous.z);
  const x =
    unit(sub(preferred, scale(direction, dot(preferred, direction)))) ??
    unit(sub(alternative, scale(direction, dot(alternative, direction))))!;
  return { x, y: direction, z: unit(cross(x, direction))! };
}
