import type { JointTrust, TrustedFrame } from "./frame";
import { JOINTS, type JointId } from "./landmarks";
import type { LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import { norm, scale, sub, type Vec } from "./vec";

/**
 * How trusted measurements are denoised: closed union read by `createStabilizer`. `none` passes through; `one-euro` filters each joint at `minCutoffHz + beta * |velocity|`.
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
 * Live presets: engineering defaults, not fitted to a recording; world `beta` is image `beta` scaled by ~4 mm per stage pixel at 2.6 m.
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

/** Owns trusted-position noise, after the gap detector: it moves positions, never trust, and calibration reads raw.
 * Per-joint state spans gaps; time is the frame's `tMs`, never a wall clock. */
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

/** Frozen snapshot of a valid spec: later mutation of the caller's object changes nothing. */
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
  /** The filtered position presented to callers. */
  readonly value: Vec;
  /** The low-passed velocity, per second. */
  readonly velocity: Vec;
}

/** One joint's 1€ step: low-passed filtered-position velocity sets the cutoff. First sample is state; a
 * non-advancing time returns it; bad input is refused before state moves. */
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
