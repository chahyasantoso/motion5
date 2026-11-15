import { withProgress, type Time } from "../parts/time/time";

/** A time run backwards (progress `p` answers `1 - p`); a function of time, not a move, so any move or
 * value plays through it. */
export function reversed(time: Time): Time {
  return withProgress(time, 1 - time.progress);
}
