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

/** The scale of a box `weight` of the way into its `squash`, with the floor staying where it is. */
export function squashed(squash: number, weight: number): Pose2d {
  return { scaleX: 1 + 0.9 * squash * weight, scaleY: 1 - squash * weight, anchor: "bottom" };
}
