import type { FilledJoint } from "../filler/frame";
import { cross, directionResidual, rotate } from "../filler/direction";
import { unreachable } from "../filler/unreachable";
import { add, dot, norm, scale, sub, unit, type Vec } from "../filler/vec";

export type BendReference =
  | { readonly kind: "observed"; readonly direction: Vec }
  | {
      readonly kind: "predicted";
      readonly direction: Vec;
      readonly basis: "coast" | "prior";
      readonly lastObservedTMs: number;
    }
  | {
      readonly kind: "held";
      readonly direction: Vec;
      readonly lastObservedTMs: number;
    }
  | { readonly kind: "unavailable" };

export type BendPolicy =
  | { readonly kind: "legacy" }
  | {
      readonly kind: "predict";
      readonly maxAgeMs: number;
      readonly maxAngularVarianceRad2: number;
      readonly maxRateRadPerSecond: number;
      readonly maxStepRad: number;
    };

export const LEGACY_BEND_POLICY: BendPolicy = Object.freeze({ kind: "legacy" });
export const PREDICTED_BEND_POLICY: BendPolicy = Object.freeze({
  kind: "predict",
  maxAgeMs: 500,
  maxAngularVarianceRad2: 0.25,
  maxRateRadPerSecond: 6,
  maxStepRad: 0.35,
});
export const MIN_BEND_SINE = 0.1;

export interface BendState {
  readonly observed?: { readonly direction: Vec; readonly tMs: number } | undefined;
  readonly applied?: { readonly direction: Vec; readonly tMs: number };
}
export interface BendDecision {
  readonly reference: BendReference;
  /** Proposed immutable state. The writer commits it only after publication succeeds. */
  readonly next: BendState;
}

export function validateBendPolicy(policy: BendPolicy): void {
  switch (policy.kind) {
    case "legacy":
      return;
    case "predict":
      if (
        ![
          policy.maxAgeMs,
          policy.maxAngularVarianceRad2,
          policy.maxRateRadPerSecond,
          policy.maxStepRad,
        ].every(Number.isFinite) ||
        policy.maxAgeMs < 0 ||
        policy.maxAngularVarianceRad2 < 0 ||
        policy.maxRateRadPerSecond <= 0 ||
        policy.maxStepRad <= 0 ||
        policy.maxStepRad > Math.PI
      )
        throw new Error("Invalid bend prediction policy.");
      return;
    default:
      return unreachable(policy, "bend policy");
  }
}

export function decidingMiddle(
  root: Vec,
  goal: Vec,
  middle: Vec | undefined,
  held: boolean,
): Vec | undefined {
  if (middle === undefined) return undefined;
  const reach = sub(goal, root);
  const bend = sub(middle, root);
  const lengths = norm(reach) * norm(bend);
  if (!(lengths > 1e-12)) return undefined;
  if (!held) return middle;
  const cosine = dot(reach, bend) / lengths;
  return Math.sqrt(Math.max(0, 1 - cosine * cosine)) >= MIN_BEND_SINE ? middle : undefined;
}

const finitePoint = (point: Vec) =>
  point.length === 3 && point.every(Number.isFinite) && Number.isFinite(norm(point));

/** Limit spherical motion, including a deterministic antipodal path. No linear blend collapse. */
function bounded(
  target: Vec,
  previous: BendState["applied"],
  tMs: number,
  policy: Extract<BendPolicy, { kind: "predict" }>,
  reach: Vec,
): Vec {
  if (previous === undefined) return target;
  const residual = directionResidual(previous.direction, target);
  const angle = norm(residual);
  const limit = Math.min(
    policy.maxStepRad,
    (policy.maxRateRadPerSecond * Math.max(0, tMs - previous.tMs)) / 1000,
  );
  const axis = unit(reach);
  if (axis !== undefined) {
    const before = unit(sub(previous.direction, scale(axis, dot(axis, previous.direction))));
    const after = unit(sub(target, scale(axis, dot(axis, target))));
    if (before !== undefined && after !== undefined) {
      // Bound the actual pole plane, not just the root-middle vector. Opposite bends must rotate
      // around the reach, not blend through a straight pole and instantly flip its side.
      const planeAngle = Math.atan2(dot(axis, cross(before, after)), dot(before, after));
      const beforeInclination = Math.acos(Math.max(-1, Math.min(1, dot(axis, previous.direction))));
      const afterInclination = Math.acos(Math.max(-1, Math.min(1, dot(axis, target))));
      const inclinationDelta = afterInclination - beforeInclination;
      const budget = Math.hypot(planeAngle, inclinationDelta);
      const fraction = budget === 0 ? 1 : Math.min(1, limit / budget);
      const plane = rotate(before, scale(axis, planeAngle * fraction));
      const inclination = beforeInclination + inclinationDelta * fraction;
      return unit(add(scale(axis, Math.cos(inclination)), scale(plane, Math.sin(inclination))))!;
    }
  }
  return angle <= limit
    ? target
    : unit(rotate(previous.direction, scale(residual, limit / angle)))!;
}

/** Pure decision owner: no filter, solver, observation cache or clock is advanced here. */
export function decideBend(
  policy: Extract<BendPolicy, { kind: "predict" }>,
  state: BendState,
  input: {
    readonly tMs: number;
    readonly root: Vec;
    readonly goal: Vec;
    readonly measuredRoot: Vec | undefined;
    readonly measuredMiddle: Vec | undefined;
    readonly filledMiddle: FilledJoint;
  },
): BendDecision {
  const { tMs, root, goal, measuredRoot, measuredMiddle, filledMiddle } = input;
  if (
    !Number.isFinite(tMs) ||
    !finitePoint(root) ||
    !finitePoint(goal) ||
    (measuredRoot !== undefined && !finitePoint(measuredRoot)) ||
    (measuredMiddle !== undefined && !finitePoint(measuredMiddle)) ||
    (state.applied !== undefined && tMs < state.applied.tMs)
  )
    throw new Error("Invalid world bend input or timestamp.");

  const freshHistory =
    state.observed !== undefined &&
    tMs >= state.observed.tMs &&
    tMs - state.observed.tMs <= policy.maxAgeMs;
  const deciding =
    measuredRoot === undefined
      ? undefined
      : decidingMiddle(measuredRoot, goal, measuredMiddle, state.observed !== undefined);
  const measured = deciding === undefined ? undefined : unit(sub(deciding, measuredRoot!));
  let observed = state.observed;
  let reference: BendReference;
  if (measured !== undefined) {
    // History stores only the actual measured direction, never the bounded publication.
    observed = { direction: measured, tMs };
    reference = { kind: "observed", direction: measured };
  } else {
    reference = freshHistory
      ? { kind: "held", direction: observed!.direction, lastObservedTMs: observed!.tMs }
      : { kind: "unavailable" };
    // A raw/hold fill has no prediction evidence and cannot impersonate a coast.
    if (freshHistory && filledMiddle.kind === "inferred" && filledMiddle.prediction !== undefined) {
      const evidence = filledMiddle.prediction;
      let calibrated: boolean;
      switch (evidence.kind) {
        case "coast":
          calibrated = true;
          break;
        case "prior":
          calibrated = evidence.uncertaintyCalibrated;
          break;
        default:
          return unreachable(evidence, "joint prediction");
      }
      if (
        calibrated &&
        [
          evidence.lastObservedTMs,
          evidence.expiresTMs,
          evidence.angularVarianceRad2,
          filledMiddle.sinceMs,
        ].every(Number.isFinite) &&
        evidence.lastObservedTMs <= filledMiddle.sinceMs &&
        filledMiddle.sinceMs <= tMs &&
        evidence.lastObservedTMs <= tMs &&
        tMs - evidence.lastObservedTMs <= policy.maxAgeMs &&
        tMs <= evidence.expiresTMs &&
        evidence.angularVarianceRad2 >= 0 &&
        evidence.angularVarianceRad2 <= policy.maxAngularVarianceRad2 &&
        finitePoint(filledMiddle.position)
      ) {
        const middle = decidingMiddle(root, goal, filledMiddle.position, true);
        const predicted = middle === undefined ? undefined : unit(sub(middle, root));
        if (predicted !== undefined)
          reference = {
            kind: "predicted",
            direction: predicted,
            basis: evidence.kind,
            lastObservedTMs: evidence.lastObservedTMs,
          };
      }
    }
  }
  switch (reference.kind) {
    case "unavailable":
      return { reference, next: { observed } };
    case "observed":
    case "predicted":
    case "held": {
      const direction = bounded(reference.direction, state.applied, tMs, policy, sub(goal, root));
      return {
        reference: { ...reference, direction },
        next: { observed, applied: { direction, tMs } },
      };
    }
    default:
      return unreachable(reference, "bend reference");
  }
}
