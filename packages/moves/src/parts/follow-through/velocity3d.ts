import type { Events } from "../events/events";
import type { Pose3d } from "../../fields/pose3d";
import { speedOf } from "./speed-of";
import type { Time } from "../time/time";

/** Units per second a signal's `x`, `y` and `z` move at the scene's `time`, never an eased one; zero with no clock. */
export function velocity3d(
  signal: (time: Time, events: Events) => Pose3d,
  time: Time,
  events: Events,
  stepMs = 16,
): { readonly vx: number; readonly vy: number; readonly vz: number } {
  const [vx = 0, vy = 0, vz = 0] = speedOf(signal, ["x", "y", "z"], time, events, stepMs);
  return { vx, vy, vz };
}
