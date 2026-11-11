import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import type { Time } from "./time";

/** Plays its input backwards: at progress `p` it answers the input at `1 - p`. */
export const reversed = defineMove({
  id: "reversed",
  role: "modifier",
  description: "Plays another move backwards, so an entrance becomes an exit.",
  options: {},
  example: {
    options: {},
    input: (time: Time): Pose2d => ({ x: -200 * (1 - time.progress) }),
  },
  run: (_options, time, input: (time: Time) => Pose2d): Pose2d =>
    input({ ...time, progress: 1 - time.progress }),
  moments: () => ({}),
});
