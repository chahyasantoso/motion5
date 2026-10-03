import { unreachable } from "./unreachable";

/** Units of the scalar state: a closed choice, not a boolean controlling angle arithmetic. */
export type ScalarDomain = { readonly kind: "angle" } | { readonly kind: "position" };

export interface ScalarNoise {
  /** Observation variance (rad² or px²) at visibility 1. */
  readonly measurementVariance: number;
  /** Continuous white acceleration spectral density (unit²/s³). */
  readonly accelerationVariance: number;
}

export interface ScalarMeasurement {
  readonly value: number;
  readonly visibility: number;
}

export interface CvState {
  readonly value: number;
  readonly velocity: number;
  readonly p00: number;
  readonly p01: number;
  readonly p11: number;
  readonly tMs: number;
  readonly measuredMs: number;
}

/** Canonical [-π, π), including negative/multi-turn input. */
export function wrapAngle(value: number): number {
  const turn = 2 * Math.PI;
  return ((((value + Math.PI) % turn) + turn) % turn) - Math.PI;
}

function canonical(value: number, domain: ScalarDomain): number {
  switch (domain.kind) {
    case "angle":
      return wrapAngle(value);
    case "position":
      return value;
    default:
      return unreachable(domain, "scalar domain");
  }
}

export function validateScalarNoise(noise: ScalarNoise): ScalarNoise {
  for (const value of [noise.measurementVariance, noise.accelerationVariance])
    if (!Number.isFinite(value) || value <= 0)
      throw new Error("Kalman variances must be finite and positive.");
  // Configuration is caller-owned. Capture it once so later mutation cannot bypass validation.
  return { ...noise };
}

/**
 * Two-state [value, velocity] constant-velocity Kalman filter. Prediction uses actual seconds.
 * Q is the integral of continuous white acceleration; correction uses Joseph covariance form.
 * Only supplied measurements update measuredMs. The caller owns trust and the coast limit.
 */
export function createCvFilter(domain: ScalarDomain, options: ScalarNoise) {
  const noise = validateScalarNoise(options);
  let state: CvState | undefined;
  let previousMs: number | undefined;
  return {
    get state(): CvState | undefined {
      return state;
    },
    /** Small app-level multi-filter transactions save state references, not a filter clone. */
    checkpoint(): () => void {
      const savedState = state,
        savedMs = previousMs;
      return () => {
        state = savedState;
        previousMs = savedMs;
      };
    },
    step(tMs: number, measurement?: ScalarMeasurement): CvState | undefined {
      if (!Number.isFinite(tMs) || (previousMs !== undefined && tMs < previousMs))
        throw new Error("Kalman timestamps must be finite and nondecreasing.");
      if (
        measurement !== undefined &&
        (!Number.isFinite(measurement.value) ||
          !Number.isFinite(measurement.visibility) ||
          measurement.visibility < 0 ||
          measurement.visibility > 1)
      )
        throw new Error("Kalman measurement must be finite with visibility in [0, 1].");
      const r = noise.measurementVariance / Math.max(measurement?.visibility ?? 1, 0.05);
      if (!Number.isFinite(r)) throw new Error("Kalman observation variance overflow.");
      if (state === undefined) {
        previousMs = tMs;
        if (measurement === undefined) return undefined;
        state = {
          value: canonical(measurement.value, domain),
          velocity: 0,
          p00: r,
          p01: 0,
          p11: noise.accelerationVariance,
          tMs,
          measuredMs: tMs,
        };
        return state;
      }
      const dt = (tMs - state.tMs) / 1000;
      const q = noise.accelerationVariance;
      const predicted = {
        value: canonical(state.value + dt * state.velocity, domain),
        velocity: state.velocity,
        p00: state.p00 + 2 * dt * state.p01 + dt * dt * state.p11 + (q * dt ** 3) / 3,
        p01: state.p01 + dt * state.p11 + (q * dt * dt) / 2,
        p11: state.p11 + q * dt,
        tMs,
        measuredMs: state.measuredMs,
      };
      let next: CvState = predicted;
      if (measurement !== undefined) {
        const residual = canonical(measurement.value - predicted.value, domain);
        const innovation = predicted.p00 + r;
        if (!Number.isFinite(innovation) || innovation <= 0)
          throw new Error("Kalman innovation variance overflow.");
        const k0 = predicted.p00 / innovation;
        const k1 = predicted.p01 / innovation;
        const a = 1 - k0;
        next = {
          value: canonical(predicted.value + k0 * residual, domain),
          velocity: predicted.velocity + k1 * residual,
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
      if (!Object.values(next).every(Number.isFinite)) throw new Error("Kalman state overflow.");
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

export type CvFilter = ReturnType<typeof createCvFilter>;
