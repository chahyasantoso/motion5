import { defineMove } from "./declare";
import type { Pose2d } from "./pose";

const PEAK_SHARE = 0.6;

/** Grows from nothing past full size and settles back to exactly 1. */
export const pop = defineMove({
  id: "pop",
  role: "enter",
  description: "Grows from nothing past full size, then settles to exactly full size.",
  options: {
    overshoot: {
      kind: "number",
      default: 0.2,
      min: 0,
      max: 1,
      description: "How far past full size it grows, as a share; default 0.2.",
    },
  },
  example: { options: { overshoot: 0.2 } },
  run({ overshoot }, { progress }): Pose2d {
    if (progress < PEAK_SHARE) {
      const grow = progress / PEAK_SHARE;
      return { scale: (1 + overshoot) * (1 - (1 - grow) ** 2) };
    }
    const settle = (progress - PEAK_SHARE) / (1 - PEAK_SHARE);
    return { scale: 1 + overshoot * (1 - settle) ** 2 };
  },
  moments: () => ({ peak: PEAK_SHARE }),
});
