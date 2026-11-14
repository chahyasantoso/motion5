import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

/** Grows to `1 + amount` times its size and returns. */
export const pulse = defineMove({
  id: "pulse",
  role: "emphasis",
  description: "Grows a little and returns to its size.",
  options: {
    amount: {
      kind: "number",
      default: 0.15,
      min: 0,
      max: 2,
      description: "How much it grows, as a share of its size; default 0.15.",
    },
  },
  example: { options: { amount: 0.15 } },
  run({ amount }, { progress }): Pose2d {
    return { scale: 1 + (amount * (1 - Math.cos(2 * Math.PI * progress))) / 2 };
  },
  moments: () => ({ peak: 0.5 }),
});
