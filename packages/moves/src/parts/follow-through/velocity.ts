import type { Events } from "../events/events";
import type { Pose2d } from "../../fields/pose";
import { speedOf } from "./speed-of";
import type { Time } from "../time/time";

/** The `{ vx, vy }` px a second a signal moves at the scene's `time` (not an eased one), over `stepMs`;
 * zero with no clock. */
export function velocity(
  signal: (time: Time, events: Events) => Pose2d,
  time: Time,
  events: Events,
  stepMs = 16,
): { readonly vx: number; readonly vy: number } {
  const [vx = 0, vy = 0] = speedOf(signal, ["x", "y"], time, events, stepMs);
  return { vx, vy };
}
