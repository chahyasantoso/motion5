import { withProgress, type Time } from "./time";

/** The time run backwards: at progress `p` it answers `1 - p`, and a timed clock's elapsed runs back with it. */
export function reversed(time: Time): Time {
  return withProgress(time, 1 - time.progress);
}
