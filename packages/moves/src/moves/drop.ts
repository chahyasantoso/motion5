import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";
import { squashed } from "../parts/blends/squashed";

const FALL_SHARE = 0.75;

/** Falls from `distance` above its rest pose, accelerating, then lands and recovers from `squash`. */
export const drop = defineMove({
  id: "drop",
  role: "enter",
  description: "Falls from above, accelerating, then lands and recovers from its squash.",
  options: {
    distance: { kind: "number", min: 0, description: "Start this far above rest, in px." },
    squash: {
      kind: "number",
      default: 0,
      min: 0,
      max: 1,
      description: "Height lost on landing, as a share; default 0.",
    },
  },
  example: { options: { distance: 400, squash: 0.2 } },
  run({ distance, squash }, { progress }): Pose2d {
    const fall = Math.min(1, progress / FALL_SHARE);
    const settled = Math.max(0, (progress - FALL_SHARE) / (1 - FALL_SHARE));
    const weight = progress < FALL_SHARE ? 0 : (1 - settled) ** 2;
    return { y: 0 - distance * (1 - fall * fall), ...squashed(squash, weight) };
  },
  moments: () => ({ landing: FALL_SHARE }),
});
