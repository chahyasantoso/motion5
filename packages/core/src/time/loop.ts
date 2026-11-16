import { withProgress, type Time } from "./time";
import { nowOf } from "./span";
import type { Timing } from "./timing";

/** Settings of `loop`: `yoyo` runs every odd cycle backwards, so the motion turns instead of jumping. */
export interface LoopOptions {
  readonly yoyo?: boolean;
}

/** A cycle that repeats every `periodMs`: `.of(time)` is the time inside the current cycle, progress 0 to 1
 * each period, and 1 to 0 on odd cycles with `yoyo`. Throws `RangeError` on an untimed time. */
export function loop(periodMs: number, options: LoopOptions = {}): Timing {
  if (!Number.isFinite(periodMs) || periodMs <= 0)
    throw new RangeError(`loop: a period of ${periodMs} ms is not a stretch of time.`);
  const yoyo = options.yoyo === true;
  return Object.freeze({
    of(time: Time): Time {
      const now = Math.max(0, nowOf(time, "loop"));
      const cycle = Math.floor(now / periodMs);
      const share = (now - cycle * periodMs) / periodMs;
      const progress = yoyo && cycle % 2 === 1 ? 1 - share : share;
      const inside: Time = {
        progress: share,
        clock: { kind: "timed", elapsed: share * periodMs, length: periodMs },
      };
      return withProgress(inside, progress);
    },
  });
}
