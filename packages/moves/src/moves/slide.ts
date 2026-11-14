import { defineMove } from "./declare";
import type { Pose2d } from "../fields/pose";
import { unreachable } from "../unreachable";

/** Slides in from `distance` px away on one side, decelerating. */
export const slide = defineMove({
  id: "slide",
  role: "enter",
  description: "Slides in from one side, decelerating to rest.",
  options: {
    distance: { kind: "number", min: 0, description: "Start this far from rest, in px." },
    from: {
      kind: "string",
      enum: ["left", "right", "top", "bottom"],
      default: "left",
      description: "The side it comes from; default left.",
    },
  },
  example: { options: { distance: 200, from: "left" } },
  run({ distance, from }, { progress }): Pose2d {
    const away = distance * (1 - progress) ** 3;
    switch (from) {
      case "left":
        return { x: 0 - away };
      case "right":
        return { x: away };
      case "top":
        return { y: 0 - away };
      case "bottom":
        return { y: away };
      default:
        return unreachable(from);
    }
  },
  moments: () => ({}),
});
