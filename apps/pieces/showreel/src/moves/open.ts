import { type Pose2d, motion, type Motion } from "@gerak/core";

/** Options of `open`. */
export interface OpenOptions {
  /** The axis it grows along; default x, a line drawn out sideways. */
  readonly axis?: "x" | "y";
}

/** Grows from nothing along one axis out of its own middle to full size, both ends at once. */
export function open(options: OpenOptions = {}): Motion<Pose2d> {
  const { axis = "x" } = options;
  return motion(({ progress }): Pose2d => {
    const grown = 1 - (1 - progress) ** 3;
    switch (axis) {
      case "x":
        return { scaleX: grown };
      case "y":
        return { scaleY: grown };
      default: {
        const none: never = axis;
        return none;
      }
    }
  });
}
