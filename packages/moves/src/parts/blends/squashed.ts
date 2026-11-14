import type { Anchor, Pose2d } from "../../fields/pose";
import type { Pose3d } from "../../fields/pose3d";
import { unreachable } from "../../unreachable";

/** A pose `weight` of the way into `squash` against the `anchor` side, `"bottom"` when absent; `"left"`
 * and `"right"` squash sideways. */
export function squashed(squash: number, weight: number, anchor: Anchor = "bottom"): Pose2d {
  const short = 1 - squash * weight;
  const wide = 1 + 0.9 * squash * weight;
  switch (anchor) {
    case "bottom":
    case "top":
    case "center":
      return { scaleX: wide, scaleY: short, anchor };
    case "left":
    case "right":
      return { scaleX: short, scaleY: wide, anchor };
    default:
      return unreachable(anchor);
  }
}

/** A body `weight` of the way into its `squash` along `axis`, widened on the other two so its volume stays. */
export function squashed3d(squash: number, weight: number, axis: "x" | "y" | "z" = "y"): Pose3d {
  const short = 1 - squash * weight;
  if (!(short > 0)) throw new RangeError("squashed3d: squash times weight must stay below 1.");
  if (weight === 0) return {};
  const wide = 1 / Math.sqrt(short);
  switch (axis) {
    case "x":
      return { scaleX: short, scaleY: wide, scaleZ: wide };
    case "y":
      return { scaleX: wide, scaleY: short, scaleZ: wide };
    case "z":
      return { scaleX: wide, scaleY: wide, scaleZ: short };
    default:
      return unreachable(axis);
  }
}
