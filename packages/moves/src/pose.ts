import { unreachable } from "./unreachable";

/** The point of a box that stays put while it scales and turns. */
export type Anchor = "center" | "bottom" | "top" | "left" | "right";

/** A 2D pose; each renderer writes it in its own format. */
export type Pose2d = {
  readonly x?: number;
  readonly y?: number;
  readonly rotation?: number;
  readonly scale?: number;
  readonly scaleX?: number;
  readonly scaleY?: number;
  readonly opacity?: number;
  readonly anchor?: Anchor;
};

/** Pose fields that offsets and turns: two poses on one target add them, and their rest is 0. */
export const ADDED_FIELDS = Object.freeze(["x", "y", "rotation"] as const);
/** Pose fields that scale: two poses on one target multiply them, and their rest is 1. */
export const MULTIPLIED_FIELDS = Object.freeze(["scale", "scaleX", "scaleY", "opacity"] as const);

/** A box `weight` of the way into its `squash` against the `anchor` side, which stays put; widens the other way. */
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

const FIELDS: Record<keyof Pose2d, true> = {
  x: true,
  y: true,
  rotation: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  opacity: true,
  anchor: true,
};

/** Every field a pose can carry; TypeScript refuses this list when `Pose2d` gains a field it lacks. */
export const POSE_2D_FIELDS: readonly (keyof Pose2d)[] = Object.freeze(
  Object.keys(FIELDS).filter((key): key is keyof Pose2d => key in FIELDS),
);
