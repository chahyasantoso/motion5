import type { Time } from "./time";

/** The time with its progress running 0 to 1 `count` times (rounded down, at least 1), and 1 at the end. */
export function repeated(time: Time, count: number): Time {
  if (time.progress >= 1) return { ...time, progress: 1 };
  const scaled = time.progress * Math.max(1, Math.floor(count));
  return { ...time, progress: scaled - Math.floor(scaled) };
}
