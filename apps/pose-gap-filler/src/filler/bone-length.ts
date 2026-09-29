import { trustedPosition, type TrustedFrame } from "./frame";
import { BONES, BONE_IDS, type BoneId } from "./landmarks";
import { distance } from "./vec";

/** The read half: the one owner of "how long is this bone". */
export interface BoneLengths {
  /** The median trusted length in the window, or `undefined` before the first trusted sample. */
  length(bone: BoneId): number | undefined;
}

export interface BoneLengthEstimator extends BoneLengths {
  /** Adds one sample per bone whose two endpoints are both trusted in `frame`. */
  observe(frame: TrustedFrame): void;
  reset(): void;
}

/** Trusted samples per bone the median is taken over: three seconds at 30 fps. */
export const DEFAULT_LENGTH_WINDOW = 90;

/**
 * A bounded-window median per bone over trusted frames only. A median rather than a mean, because a
 * single mis-tracked frame the gate let through moves a mean by its whole error over the window and
 * moves a median not at all; bounded, because a person stepping toward the camera changes every
 * image length and the estimate has to follow.
 */
export function createBoneLengthEstimator(
  window: number = DEFAULT_LENGTH_WINDOW,
): BoneLengthEstimator {
  if (!Number.isInteger(window) || window < 1)
    throw new Error(`Bone length window must be a positive integer, got ${window}.`);
  const samples = new Map<BoneId, number[]>();
  const medians = new Map<BoneId, number>();
  return {
    length: (bone) => medians.get(bone),
    observe(frame) {
      for (const bone of BONE_IDS) {
        const from = trustedPosition(frame.trust[BONES[bone].from]);
        const to = trustedPosition(frame.trust[BONES[bone].to]);
        if (from === undefined || to === undefined) continue;
        const list = samples.get(bone) ?? [];
        list.push(distance(from, to));
        if (list.length > window) list.shift();
        samples.set(bone, list);
        medians.set(bone, median(list));
      }
    },
    reset() {
      samples.clear();
      medians.clear();
    },
  };
}

export function median(values: readonly number[]): number {
  if (values.length === 0) throw new Error("The median of no values is undefined.");
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2 === 1 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
}
