import type { Time } from "./time";

/** The time run backwards: at progress `p` it answers `1 - p`, keeping the rest of the time as given. */
export function reversed(time: Time): Time {
  return { ...time, progress: 1 - time.progress };
}
