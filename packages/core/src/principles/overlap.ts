import { elapsedOf } from "../time/time";
import type { Signal } from "../time/shapes";
import { timeAt } from "../time/time-at";

/** `lagMs`: how many ms later the signal plays, 0 or more. */
export interface OverlapOptions {
  readonly lagMs: number;
}

/** The signal `lagMs` later, holding its value at time 0 until then; any pose type. */
export function overlap(options: OverlapOptions): <T>(signal: Signal<T>) => Signal<T> {
  const { lagMs } = options;
  if (!(lagMs >= 0 && Number.isFinite(lagMs)))
    throw new RangeError("overlap: lagMs must be 0 or more.");
  return (signal) => (time, events) => {
    const now = elapsedOf(time.clock);
    return now === undefined
      ? signal(time, events)
      : signal(timeAt(time, Math.max(0, now - lagMs)), events);
  };
}
