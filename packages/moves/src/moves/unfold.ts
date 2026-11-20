import { motion, type Motion, unreachable, type Pose2d } from "@gerak/core";
import { choiceOption } from "./options";

const EDGES = ["top", "bottom", "left", "right"] as const;

/** Options of `unfold`. */
export interface UnfoldOptions {
  /** The edge that stays put: top, bottom, left or right; default top. */
  readonly from?: (typeof EDGES)[number];
}

/** Grows from nothing along one axis to full size, held at one edge. */
export function unfold(options: UnfoldOptions = {}): Motion<Pose2d> {
  const from = choiceOption("unfold", "from", options.from, EDGES, "top");
  return motion(({ progress }) => {
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
  });
}
