import { defineMove } from "./declare";
import type { Pose2d } from "@gerak/core";
import { NO_EVENTS, anticipation, type Time } from "@gerak/core";

/** Winds up the other way from its input's travel, then plays the input and ends where it ends. */
export const anticipate = defineMove({
  id: "anticipate",
  role: "modifier",
  description: "Goes a little the other way before another move, then plays it.",
  options: {
    share: {
      kind: "number",
      default: 0.2,
      min: 0,
      max: 0.9,
      description: "Share of the progress spent winding up; default 0.2.",
    },
    amount: {
      kind: "number",
      default: 0.15,
      min: 0,
      max: 1,
      description: "How far back it goes, as a share of the input's whole travel; default 0.15.",
    },
  },
  example: {
    options: { share: 0.2, amount: 0.15 },
    input: (time: Time): Pose2d => ({ x: -200 * (1 - time.progress) }),
  },
  run({ share, amount }, time, input: (time: Time) => Pose2d): Pose2d {
    return anticipation({ share, amount })(input)(time, NO_EVENTS);
  },
  moments: ({ share }) => ({ windUp: share / 2 }),
});
