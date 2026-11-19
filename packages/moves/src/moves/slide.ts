import { unreachable, type Pose2d, type Time } from "@gerak/core";
import { choiceOption, numberOption } from "./options";

const SIDES = ["left", "right", "top", "bottom"] as const;

/** Options of `slide`. */
export interface SlideOptions {
  /** Start this far from rest, in px; at least 0, required. */
  readonly distance: number;
  /** The side it comes from: left, right, top or bottom; default left. */
  readonly from?: (typeof SIDES)[number];
}

/** Slides in from one side, decelerating to rest. */
export function slide(options: SlideOptions): (time: Time) => Pose2d {
  const distance = numberOption("slide", "distance", options.distance, { min: 0 });
  const from = choiceOption("slide", "from", options.from, SIDES, "left");
  return ({ progress }) => {
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
  };
}
