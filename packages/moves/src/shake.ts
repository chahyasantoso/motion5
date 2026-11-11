import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import { shaken } from "./shaken";

/** Shakes sideways `count` times, starting hard and dying away. */
export const shake = defineMove({
  id: "shake",
  role: "emphasis",
  description: "Shakes side to side, starting hard and dying away.",
  options: {
    distance: {
      kind: "number",
      min: 0,
      description: "The most it can reach to either side, in px.",
    },
    count: {
      kind: "number",
      default: 4,
      min: 1,
      max: 16,
      description: "Back-and-forth cycles; default 4.",
    },
  },
  example: { options: { distance: 12, count: 4 } },
  run({ distance, count }, { progress }): Pose2d {
    return { x: distance * shaken(count, progress) };
  },
  moments: () => ({}),
});
