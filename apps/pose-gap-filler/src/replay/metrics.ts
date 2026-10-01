import { BONES, BONE_IDS, JOINTS, type JointId } from "../filler/landmarks";
import { distance, norm, scale, sub, type Vec } from "../filler/vec";
import type { Presented, ReplayFrame } from "./replay";

/** Count, mean, 95th percentile and maximum of one sample set; all `undefined` stats when empty. */
export interface Summary {
  readonly count: number;
  readonly mean: number | undefined;
  readonly p95: number | undefined;
  readonly max: number | undefined;
}

/** The nearest-rank `q` quantile of an ascending, nonempty array. */
export function quantile(sorted: readonly number[], q: number): number {
  const rank = Math.min(sorted.length - 1, Math.max(0, Math.ceil(q * sorted.length) - 1));
  return sorted[rank]!;
}

export function summarize(values: readonly number[]): Summary {
  if (values.length === 0) return { count: 0, mean: undefined, p95: undefined, max: undefined };
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((total, value) => total + value, 0);
  return {
    count: sorted.length,
    mean: sum / sorted.length,
    p95: quantile(sorted, 0.95),
    max: sorted.at(-1),
  };
}

export interface ReplayMetrics {
  /** Masked frames: distance from what was shown to the unmasked reference, in space units. */
  readonly positionError: Summary;
  /** Masked frames where the joint had a reference but nothing was shown. */
  readonly lostFrames: number;
  /**
   * Frames where a bone touching a masked joint was shown: |shown length - reference length|, in
   * space units. Only meaningful in world space, where a bone's true length is constant.
   */
  readonly boneLengthDeviation: Summary;
  /** Acceleration over three frames, units/s²: solved joints with a rig, all shown joints without. */
  readonly jitter: Summary;
  /**
   * Mean actual timestamp delay of the frame shift that best aligns shown and reference positions.
   * Zero follows the measurement; positive trails it. This is an alignment proxy, not causal latency.
   */
  readonly lagMs: number | undefined;
  /** At each gap's end, the jump from the last shown gap position to the first trusted one. */
  readonly recoverySnap: Summary;
}

/** The furthest frame shift `lagMs` searches. */
export const MAX_LAG_FRAMES = 15;

type Samples = Array<number>;

function positionErrors(frames: readonly ReplayFrame[]): { errors: Samples; lost: number } {
  const errors: Samples = [];
  let lost = 0;
  for (const frame of frames)
    for (const joint of frame.masked) {
      const reference = frame.reference[joint];
      if (reference === undefined) continue;
      const shown = frame.presented[joint];
      if (shown === undefined) lost += 1;
      else errors.push(distance(shown, reference));
    }
  return { errors, lost };
}

function boneLength(pose: Presented, from: JointId, to: JointId): number | undefined {
  const a = pose[from];
  const b = pose[to];
  return a === undefined || b === undefined ? undefined : distance(a, b);
}

function boneDeviations(frames: readonly ReplayFrame[]): Samples {
  const deviations: Samples = [];
  for (const frame of frames)
    for (const bone of BONE_IDS) {
      const { from, to } = BONES[bone];
      if (!frame.masked.has(from) && !frame.masked.has(to)) continue;
      const shown = boneLength(frame.presented, from, to);
      const reference = boneLength(frame.reference, from, to);
      if (shown !== undefined && reference !== undefined)
        deviations.push(Math.abs(shown - reference));
    }
  return deviations;
}

function accelerations(frames: readonly ReplayFrame[]): Samples {
  const values: Samples = [];
  for (let index = 2; index < frames.length; index += 1) {
    const [a, b, c] = [frames[index - 2]!, frames[index - 1]!, frames[index]!];
    const early = (b.tMs - a.tMs) / 1000;
    const late = (c.tMs - b.tMs) / 1000;
    // A window without elapsed time has no acceleration to measure.
    if (!(early > 0 && late > 0)) continue;
    for (const joint of JOINTS) {
      if ([a, b, c].some((frame) => frame.solved !== undefined && !frame.solved.has(joint)))
        continue;
      const [p0, p1, p2] = [a.presented[joint], b.presented[joint], c.presented[joint]];
      if (p0 === undefined || p1 === undefined || p2 === undefined) continue;
      const change = sub(scale(sub(p2, p1), 1 / late), scale(sub(p1, p0), 1 / early));
      values.push(norm(change) / ((early + late) / 2));
    }
  }
  return values;
}

function lagMs(frames: readonly ReplayFrame[]): number | undefined {
  if (frames.length < 2) return undefined;
  let best: { delay: number; error: number } | undefined;
  for (let shift = 0; shift <= Math.min(MAX_LAG_FRAMES, frames.length - 1); shift += 1) {
    let total = 0;
    let count = 0;
    let delay = 0;
    for (let index = shift; index < frames.length; index += 1)
      for (const joint of JOINTS) {
        const shown = frames[index]!.presented[joint];
        const reference = frames[index - shift]!.reference[joint];
        if (shown === undefined || reference === undefined) continue;
        total += distance(shown, reference);
        delay += frames[index]!.tMs - frames[index - shift]!.tMs;
        count += 1;
      }
    if (count === 0) continue;
    const error = total / count;
    if (best === undefined || error < best.error) best = { delay: delay / count, error };
  }
  if (best === undefined) return undefined;
  return best.delay;
}

function recoverySnaps(frames: readonly ReplayFrame[]): Samples {
  const snaps: Samples = [];
  for (let index = 1; index < frames.length; index += 1)
    for (const joint of JOINTS) {
      if (frames[index - 1]!.trust[joint].kind !== "gap") continue;
      if (frames[index]!.trust[joint].kind !== "trusted") continue;
      const before: Vec | undefined = frames[index - 1]!.presented[joint];
      const after = frames[index]!.presented[joint];
      if (before !== undefined && after !== undefined) snaps.push(distance(before, after));
    }
  return snaps;
}

/** Every phase 2 metric over one replay. */
export function measureReplay(frames: readonly ReplayFrame[]): ReplayMetrics {
  const { errors, lost } = positionErrors(frames);
  return {
    positionError: summarize(errors),
    lostFrames: lost,
    boneLengthDeviation: summarize(boneDeviations(frames)),
    jitter: summarize(accelerations(frames)),
    lagMs: lagMs(frames),
    recoverySnap: summarize(recoverySnaps(frames)),
  };
}
