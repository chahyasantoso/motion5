import type { JointSample } from "./gap-detector";
import { spaceDimension, type LandmarkSpace } from "./space";
import { unreachable } from "./unreachable";
import { add, distance, scale, sub, type Vec } from "./vec";

export interface InnovationOptions {
  /** Engineering noise floors in native units, not calibrated detector uncertainty. */
  readonly imageFloorPx: number;
  readonly worldFloorMm: number;
  readonly boneFraction: number;
  /** Accepted velocity is never extrapolated farther than this. */
  readonly predictMs: number;
  /** Consistent rejected samples can reacquire, but never across a long sample gap. */
  readonly candidateMs: number;
  readonly candidateCount: number;
}

export const DEFAULT_INNOVATION: InnovationOptions = Object.freeze({
  imageFloorPx: 30,
  worldFloorMm: 120,
  boneFraction: 0.3,
  predictMs: 100,
  candidateMs: 150,
  candidateCount: 3,
});

/** Generous numeric processing domain, one million native px/mm. Unsafe geometry is not clipped. */
export const MAX_NATIVE_COORDINATE = 1_000_000;

export function validProcessingPosition(position: Vec, space: LandmarkSpace): boolean {
  return (
    position.length === spaceDimension(space) &&
    position.every((value) => Number.isFinite(value) && Math.abs(value) <= MAX_NATIVE_COORDINATE)
  );
}

export type InnovationDecision =
  | { readonly kind: "accepted"; readonly reacquired: boolean }
  | {
      readonly kind: "rejected";
      readonly reason: "innovation" | "speed";
      readonly innovation: number;
      readonly limit: number;
      readonly candidates: number;
    };

interface Accepted extends JointSample {
  readonly velocity: Vec;
}
interface Candidate extends JointSample {
  readonly count: number;
}
export interface InnovationState {
  accepted?: Accepted;
  candidate?: Candidate;
}

export function validateInnovation(options: InnovationOptions): InnovationOptions {
  for (const value of [
    options.imageFloorPx,
    options.worldFloorMm,
    options.boneFraction,
    options.predictMs,
    options.candidateMs,
    options.candidateCount,
  ])
    if (!Number.isFinite(value) || value <= 0)
      throw new Error("Innovation limits must be finite and positive.");
  if (!Number.isInteger(options.candidateCount) || options.candidateCount < 3)
    throw new Error("Innovation candidateCount must be an integer of at least three.");
  return options;
}

function floor(space: LandmarkSpace, options: InnovationOptions): number {
  switch (space.kind) {
    case "image":
      return options.imageFloorPx;
    case "world":
      return options.worldFloorMm;
    default:
      return unreachable(space, "innovation space");
  }
}

/**
 * Purely detector-owned accepted history. Neither a smoothed sample, a solved pose nor filler
 * predictions enter it. A bounded constant-velocity innovation rejects one-frame teleports even
 * when their implied speed is below the legacy gate. Three consistent candidates recover genuine
 * abrupt relocation; this is temporal confirmation, not proof of detector accuracy.
 */
export function innovationStep(
  state: InnovationState,
  sample: JointSample,
  space: LandmarkSpace,
  boneLength: number | undefined,
  speedRejected: boolean,
  options: InnovationOptions,
): InnovationDecision {
  // Direct callers get the same no-mutation-on-invalid-time contract as the detector.
  if (
    !Number.isFinite(sample.tMs) ||
    sample.tMs <= Math.max(state.accepted?.tMs ?? -Infinity, state.candidate?.tMs ?? -Infinity) ||
    (state.accepted !== undefined && !Number.isFinite(sample.tMs - state.accepted.tMs))
  )
    throw new Error("Innovation sample time must be finite and increasing.");
  if (!validProcessingPosition(sample.position, space))
    throw new Error("Innovation sample must have safe finite coordinates in the selected space.");
  const previous = state.accepted;
  const validScale =
    boneLength !== undefined && Number.isFinite(boneLength) && boneLength > 0 ? boneLength : 0;
  const relativeLimit = validScale * options.boneFraction;
  const limit = Math.max(floor(space, options), Number.isFinite(relativeLimit) ? relativeLimit : 0);
  if (previous === undefined) {
    state.accepted = {
      ...sample,
      position: [...sample.position],
      velocity: sample.position.map(() => 0),
    };
    delete state.candidate;
    return { kind: "accepted", reacquired: false };
  }
  const dt = sample.tMs - previous.tMs;
  const predicted = add(
    previous.position,
    scale(previous.velocity, Math.min(dt, options.predictMs) / 1000),
  );
  const innovation = distance(sample.position, predicted);
  if (!speedRejected && Number.isFinite(innovation) && innovation <= limit) {
    const gain = dt / (dt + options.predictMs);
    // Long gaps do not teach an artificial high velocity. Short accepted steps alone update it.
    const velocity =
      dt > 0 && dt <= options.predictMs
        ? add(
            scale(previous.velocity, 1 - gain),
            scale(sub(sample.position, previous.position), (1000 * gain) / dt),
          )
        : sample.position.map(() => 0);
    state.accepted = { ...sample, position: [...sample.position], velocity };
    delete state.candidate;
    return { kind: "accepted", reacquired: false };
  }
  const candidate = state.candidate;
  const elapsed = candidate === undefined ? Infinity : sample.tMs - candidate.tMs;
  const candidateDistance =
    candidate === undefined ? Infinity : distance(candidate.position, sample.position);
  const consistent =
    candidate !== undefined &&
    elapsed > 0 &&
    elapsed <= options.candidateMs &&
    Number.isFinite(candidateDistance) &&
    candidateDistance <= floor(space, options);
  const count = consistent ? candidate!.count + 1 : 1;
  state.candidate = { ...sample, position: [...sample.position], count };
  if (!speedRejected && Number.isFinite(innovation) && count >= options.candidateCount) {
    state.accepted = {
      ...sample,
      position: [...sample.position],
      velocity: sample.position.map(() => 0),
    };
    delete state.candidate;
    return { kind: "accepted", reacquired: true };
  }
  return {
    kind: "rejected",
    reason: speedRejected ? "speed" : "innovation",
    innovation,
    limit,
    candidates: count,
  };
}
