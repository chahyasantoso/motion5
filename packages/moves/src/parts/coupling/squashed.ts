import { unreachable, type Anchor, type Pose2d, type Pose3d } from "@gerak/core";

/** Settings of `squashed`. */
export interface SquashedOptions {
  /** Height lost at full weight, as a share; required. */
  readonly squash: number;
  /** The side it squashes against: bottom, top, center, left or right; default bottom. */
  readonly anchor?: Anchor;
}

/** A pose `weight` of the way into `squash` against the `anchor` side, `"bottom"` when absent; `"left"`
 * and `"right"` squash sideways. */
export function squashed(options: SquashedOptions): (weight: number) => Pose2d {
  const { squash, anchor = "bottom" } = options;
  return (weight) => {
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
  };
}

/** Settings of `squashed3d`. */
export interface Squashed3dOptions {
  /** Height lost at full weight, as a share below 1; required. */
  readonly squash: number;
  /** The axis it shortens along: x, y or z; default y. */
  readonly axis?: "x" | "y" | "z";
}

/** A body `weight` of the way into its `squash` along `axis`, widened on the other two so its volume stays. */
export function squashed3d(options: Squashed3dOptions): (weight: number) => Pose3d {
  const { squash, axis = "y" } = options;
  return (weight) => {
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
  };
}
