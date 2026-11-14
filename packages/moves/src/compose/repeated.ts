import { withProgress, type Time } from "../parts/time/time";

/** A time with its progress running 0 to 1 `count` times (rounded down, at least 1); a function of time, not a move. */
export function repeated(time: Time, count: number): Time {
  if (time.progress >= 1) return withProgress(time, 1);
  const scaled = time.progress * Math.max(1, Math.floor(count));
  return withProgress(time, scaled - Math.floor(scaled));
}
