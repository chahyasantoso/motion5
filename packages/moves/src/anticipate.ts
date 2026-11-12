import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import { withProgress, type Time } from "./time";
import { carried, pushed, whole } from "./whole";

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
    const at = (progress: number) => input(withProgress(time, progress));
    const first = at(0);
    const last = at(1);
    if (time.progress >= share) {
      const played = at((time.progress - share) / (1 - share));
      return whole(played, carried(first, last, played));
    }
    const wind = amount * Math.sin(Math.PI * (time.progress / share));
    return pushed(first, last, wind, carried(first, last));
  },
  moments: ({ share }) => ({ windUp: share / 2 }),
});
