import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

/** Travels from an offset to rest along a path bowed by `lift` px. */
export const arc = defineMove({
  id: "arc",
  role: "travel",
  description: "Travels from an offset to rest along a curved path, decelerating.",
  options: {
    dx: { kind: "number", description: "Start this far right of rest, in px (negative: left)." },
    dy: { kind: "number", description: "Start this far below rest, in px (negative: above)." },
    lift: {
      kind: "number",
      default: 0,
      description:
        "How far the middle of the path bows off the straight line, in px, at right angles to it; default 0.",
    },
  },
  example: { options: { dx: -240, dy: 0, lift: 80 } },
  run({ dx, dy, lift }, { progress }): Pose2d {
    const left = (1 - progress) ** 3;
    const length = Math.hypot(dx, dy);
    const bow = length === 0 ? 0 : (lift * 4 * left * (1 - left)) / length;
    return { x: dx * left - dy * bow, y: dy * left + dx * bow };
  },
  moments: () => ({}),
});
