import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import { shaken } from "./shaken";

/** Wobbles `count` times, a shake that turns instead of moving. */
export const wobble = defineMove({
  id: "wobble",
  role: "emphasis",
  description: "Turns back and forth, starting hard and dying away.",
  options: {
    angle: { kind: "number", min: 0, description: "The widest turn, in degrees." },
    count: {
      kind: "number",
      default: 3,
      min: 1,
      max: 16,
      description: "Back-and-forth cycles; default 3.",
    },
  },
  example: { options: { angle: 8, count: 3 } },
  run({ angle, count }, { progress }): Pose2d {
    return { rotation: angle * shaken(count, progress) };
  },
  moments: () => ({}),
});
