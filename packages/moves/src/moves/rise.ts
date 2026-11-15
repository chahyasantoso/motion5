import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";

/** Rises from `distance` px below its rest pose, decelerating. */
export const rise = defineMove({
  id: "rise",
  role: "enter",
  description: "Rises from below, decelerating to rest.",
  options: {
    distance: { kind: "number", min: 0, description: "Start this far below rest, in px." },
  },
  example: { options: { distance: 80 } },
  run({ distance }, { progress }): Pose2d {
    return { y: distance * (1 - progress) ** 3 };
  },
  moments: () => ({}),
});
