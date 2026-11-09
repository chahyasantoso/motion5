import type { Time } from "./time";
import { unreachable } from "./unreachable";

/** `time` moved to `ms` on its own clock. */
export function timeAt(time: Time, ms: number): Time {
  const clock = time.clock;
  switch (clock.kind) {
    case "timed":
      return {
        progress: clock.length > 0 ? ms / clock.length : 1,
        clock: { kind: "timed", elapsed: ms, length: clock.length },
      };
    case "live":
      return { progress: time.progress, clock: { kind: "live", elapsed: ms } };
    case "untimed":
      return time;
    default:
      return unreachable(clock);
  }
}
