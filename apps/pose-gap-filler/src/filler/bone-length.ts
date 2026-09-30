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
  const medians = new Map<BoneId, RollingMedian>();
  return {
    length: (bone) => medians.get(bone)?.value(),
    observe(frame) {
      for (const bone of BONE_IDS) {
        const from = trustedPosition(frame.trust[BONES[bone].from]);
        if (from === undefined) continue;
        const to = trustedPosition(frame.trust[BONES[bone].to]);
        if (to === undefined) continue;
        let rolling = medians.get(bone);
        if (rolling === undefined) medians.set(bone, (rolling = new RollingMedian(window)));
        rolling.push(distance(from, to));
      }
    },
    reset() {
      medians.clear();
    },
  };
}

/**
 * The median of the last `capacity` samples, kept per push without a copy or a sort: a ring buffer
 * remembers arrival order for eviction and a sorted array answers the median, each push costing
 * one binary search and one splice per side.
 */
export class RollingMedian {
  readonly capacity: number;
  readonly #ring: number[] = [];
  readonly #sorted: number[] = [];
  #next = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  push(sample: number): void {
    if (this.#ring.length < this.capacity) this.#ring.push(sample);
    else {
      const evicted = this.#ring[this.#next]!;
      this.#ring[this.#next] = sample;
      this.#next = (this.#next + 1) % this.capacity;
      this.#sorted.splice(lowerBound(this.#sorted, evicted), 1);
    }
    this.#sorted.splice(lowerBound(this.#sorted, sample), 0, sample);
  }

  /** The median of the window, or `undefined` before the first sample. */
  value(): number | undefined {
    const sorted = this.#sorted;
    if (sorted.length === 0) return undefined;
    const middle = sorted.length >> 1;
    return sorted.length % 2 === 1 ? sorted[middle]! : (sorted[middle - 1]! + sorted[middle]!) / 2;
  }
}

/** The first index whose value is not below `value`, in an ascending array. */
function lowerBound(sorted: readonly number[], value: number): number {
  let low = 0;
  let high = sorted.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (sorted[mid]! < value) low = mid + 1;
    else high = mid;
  }
  return low;
}
