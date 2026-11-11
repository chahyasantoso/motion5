import { defineMove } from "./declare";
import type { Pose2d } from "./pose";
import { unreachable } from "./unreachable";

/** Grows from nothing along one axis to full size, held at an edge. */
export const unfold = defineMove({
  id: "unfold",
  role: "enter",
  description: "Grows from nothing along one axis to full size, held at one edge.",
  options: {
    from: {
      kind: "string",
      enum: ["top", "bottom", "left", "right"],
      default: "top",
      description: "The edge that stays put; default top.",
    },
  },
  example: { options: { from: "top" } },
  run({ from }, { progress }): Pose2d {
    const grown = 1 - (1 - progress) ** 2;
    switch (from) {
      case "top":
      case "bottom":
        return { scaleY: grown, anchor: from };
      case "left":
      case "right":
        return { scaleX: grown, anchor: from };
      default:
        return unreachable(from);
    }
  },
  moments: () => ({}),
});
