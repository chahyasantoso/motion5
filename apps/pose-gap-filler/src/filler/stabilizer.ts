import type { JointTrust, TrustedFrame } from "./frame";
import { JOINTS, type JointId } from "./landmarks";
import type { LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import { norm, scale, sub, type Vec } from "./vec";

/**
 * How trusted measurements are denoised before anything downstream reads them, a closed union read
 * by `createStabilizer`, the one exhaustive switch over it.
 *
 * `none` passes the detector's trusted frame through unchanged (the identity, not a copy).
 * `one-euro` is a variant of the 1€ filter (Casiez, Roussel and Vogel, CHI 2012) per joint on the
 * whole vector. It differs from the paper in one place, the speed estimate, which `oneEuroStep`
 * records with the measurement that chose it:
 * a first-order low-pass whose cutoff rises with the joint's own filtered speed,
 * `cutoff = minCutoffHz + beta * |velocity|`. A still joint is filtered at `minCutoffHz`, which
 * removes MediaPipe's frame-to-frame noise; a moving joint raises its cutoff and follows with
 * little lag. `beta` is per native unit (1/px in image space, 1/mm in world space), so a preset is
 * space-specific and chosen by `stabilizerFor`.
 */
export type StabilizerSpec =
  | { readonly kind: "none" }
  | {
      readonly kind: "one-euro";
      readonly minCutoffHz: number;
      readonly beta: number;
      readonly derivativeCutoffHz: number;
    };

export type StabilizerKind = StabilizerSpec["kind"];

export type OneEuroSpec = Extract<StabilizerSpec, { readonly kind: "one-euro" }>;

/** Every stabilizer the live page offers, in its picker's order. */
export const STABILIZER_KINDS: readonly StabilizerKind[] = ["one-euro", "none"];

export const NO_STABILIZER: StabilizerSpec = Object.freeze({ kind: "none" });

/**
 * The live presets, swept on the seeded synthetic still and exercise subjects against their
 * noiseless twin at one and three times the default noise: a still subject's frame-to-frame motion
 * drops five- to ninefold, and the exercise's error against the noiseless pose stays within a
 * pixel of unfiltered at the default noise and falls below it at three times. They are engineering
 * defaults, not fitted to a real recording; the world `beta` is the image one scaled by the roughly
 * 4 mm per stage pixel of a person at 2.6 m.
 */
export const IMAGE_ONE_EURO: OneEuroSpec = Object.freeze({
  kind: "one-euro",
  minCutoffHz: 0.5,
  beta: 0.02,
  derivativeCutoffHz: 1,
});
export const WORLD_ONE_EURO: OneEuroSpec = Object.freeze({
  kind: "one-euro",
  minCutoffHz: 0.5,
  beta: 0.005,
  derivativeCutoffHz: 1,
});

/** The stabilizer of `kind` tuned for `space`'s native unit. */
export function stabilizerFor(kind: StabilizerKind, space: LandmarkSpace): StabilizerSpec {
  switch (kind) {
    case "none":
      return NO_STABILIZER;
    case "one-euro":
      switch (space.kind) {
        case "image":
          return IMAGE_ONE_EURO;
        case "world":
          return WORLD_ONE_EURO;
        default:
          return unreachable(space, "stabilizer space");
      }
    default:
      return unreachable(kind, "stabilizer kind");
  }
}

/**
 * The one owner of "how noisy is a trusted position". It runs after the gap detector, so the
 * detector's gate, its calibration and every trust decision still read the raw measurement, and it
 * reads only trusted joints, so a gated teleport or a low-visibility guess never enters its state.
 * It changes positions, never trust: a gap stays the same gap and a trusted joint stays trusted
 * with its visibility. Observations are left as measured, so `raw` remains the unprocessed
 * reference and the replay reference stays MediaPipe's landmark.
 *
 * A joint's state survives its gaps: the next trusted sample is blended over the elapsed time, so a
 * short occlusion of a still joint does not reset it to one noisy sample, and a long one makes the
 * blend weight approach 1. Time is the frame's `tMs`, never a wall clock.
 */
export interface Stabilizer {
  stabilize(frame: TrustedFrame): TrustedFrame;
  reset(): void;
}

export function createStabilizer(spec: StabilizerSpec): Stabilizer {
  switch (spec.kind) {
    case "none":
      return { stabilize: (frame) => frame, reset() {} };
    case "one-euro":
      return createOneEuroStabilizer(validateOneEuro(spec));
    default:
      return unreachable(spec, "stabilizer spec");
  }
}

/** A frozen snapshot of a valid spec, so a caller mutating its own object later changes nothing. */
export function validateOneEuro(spec: OneEuroSpec): OneEuroSpec {
  const positive = (value: number, what: string) => {
    if (!(Number.isFinite(value) && value > 0))
      throw new Error(`One Euro ${what} must be finite and positive, got ${value}.`);
  };
  positive(spec.minCutoffHz, "minimum cutoff");
  positive(spec.derivativeCutoffHz, "derivative cutoff");
  if (!(Number.isFinite(spec.beta) && spec.beta >= 0))
    throw new Error(`One Euro beta must be finite and non-negative, got ${spec.beta}.`);
  return Object.freeze({
    kind: "one-euro",
    minCutoffHz: spec.minCutoffHz,
    beta: spec.beta,
    derivativeCutoffHz: spec.derivativeCutoffHz,
  });
}

/** The smoothing factor of a first-order low-pass at `cutoffHz` over `dtS` seconds. */
export function lowPassAlpha(cutoffHz: number, dtS: number): number {
  const tau = 1 / (2 * Math.PI * cutoffHz);
  return 1 / (1 + tau / dtS);
}

function lerp(from: Vec, to: Vec, alpha: number): Vec {
  return from.map((value, axis) => value + alpha * (to[axis]! - value));
}

export interface OneEuroState {
  readonly tMs: number;
  /** The filtered position, what the stabilizer presents. */
  readonly value: Vec;
  /** The low-passed velocity, per second. */
  readonly velocity: Vec;
}

/**
 * One joint's 1€ step in its filtered-derivative form: the velocity from the previous filtered
 * position to the new sample is low-passed at `derivativeCutoffHz`, its magnitude sets the position
 * cutoff, and the filtered position moves toward the sample by that cutoff's factor. Measuring the
 * speed against the filtered position rather than the previous raw sample (the paper's form) lets
 * the output's own lag open the cutoff: on the seeded synthetic sweep it presents 20 to 30% less
 * still motion at the same tracking error, so it is the form taken.
 *
 * The first sample is the state. A sample at or before the state's time carries no elapsed time to
 * filter over and is answered with the held state, unchanged. A non-finite time or sample, or one
 * of another dimension, is refused before any state advances, so a bad input cannot poison later
 * output.
 */
export function oneEuroStep(
  spec: OneEuroSpec,
  state: OneEuroState | undefined,
  tMs: number,
  sample: Vec,
): OneEuroState {
  if (!Number.isFinite(tMs)) throw new Error(`One Euro time must be finite, got ${tMs}.`);
  if (
    !sample.every(Number.isFinite) ||
    (state !== undefined && sample.length !== state.value.length)
  )
    throw new Error(`One Euro sample must be finite and of the state's dimension.`);
  if (state === undefined) return { tMs, value: sample, velocity: sample.map(() => 0) };
  const dtS = (tMs - state.tMs) / 1000;
  if (!(dtS > 0)) return state;
  const rawVelocity = scale(sub(sample, state.value), 1 / dtS);
  const velocity = lerp(state.velocity, rawVelocity, lowPassAlpha(spec.derivativeCutoffHz, dtS));
  const cutoffHz = spec.minCutoffHz + spec.beta * norm(velocity);
  return { tMs, value: lerp(state.value, sample, lowPassAlpha(cutoffHz, dtS)), velocity };
}

function createOneEuroStabilizer(spec: OneEuroSpec): Stabilizer {
  const states = new Map<JointId, OneEuroState>();
  return {
    stabilize(frame) {
      const trust = {} as Record<JointId, JointTrust>;
      for (const joint of JOINTS) {
        const now = frame.trust[joint];
        switch (now.kind) {
          case "trusted": {
            const next = oneEuroStep(spec, states.get(joint), frame.tMs, now.position);
            states.set(joint, next);
            trust[joint] = { kind: "trusted", position: next.value, visibility: now.visibility };
            break;
          }
          case "gap":
            trust[joint] = now;
            break;
          default:
            return unreachable(now, "joint trust");
        }
      }
      return { ...frame, trust };
    },
    reset() {
      states.clear();
    },
  };
}
