import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import type { Time } from "./time";

/** Plays its input `count` times inside one progress, and ends on the input's end. */
export const repeated = defineMove({
  id: "repeated",
  role: "modifier",
  description: "Plays another move several times in the span of one.",
  options: {
    count: {
      kind: "number",
      default: 2,
      min: 1,
      max: 32,
      description: "Times the input plays, rounded down; default 2.",
    },
  },
  example: {
    options: { count: 2 },
    input: (time: Time): Pose2d => ({ y: -100 * Math.sin(Math.PI * time.progress) }),
  },
  run({ count }, time, input: (time: Time) => Pose2d): Pose2d {
    if (time.progress >= 1) return input({ ...time, progress: 1 });
    const scaled = time.progress * Math.floor(count);
    return input({ ...time, progress: scaled - Math.floor(scaled) });
  },
  moments: () => ({}),
});
