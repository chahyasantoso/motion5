import { defineMove } from "./declare";
import type { Pose2d } from "@gerak/core";
import { arch } from "@gerak/core";

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
    return { y: distance * arch(progress) ** 2 };
  },
  moments: () => ({ bottom: 0.5 }),
});
