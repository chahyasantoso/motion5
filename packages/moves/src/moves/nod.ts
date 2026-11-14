import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

/** Dips `distance` px down and comes back up, once. */
export const nod = defineMove({
  id: "nod",
  role: "emphasis",
  description: "Dips down and comes back up, once.",
  options: {
    distance: { kind: "number", min: 0, description: "How far down it dips, in px." },
  },
  example: { options: { distance: 16 } },
  run({ distance }, { progress }): Pose2d {
    return { y: (distance * (1 - Math.cos(2 * Math.PI * progress))) / 2 };
  },
  moments: () => ({ bottom: 0.5 }),
});
