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

/** The scale of a box `weight` of the way into its `squash`, with the floor staying where it is. */
export function squashed(squash: number, weight: number): Pose2d {
  return { scaleX: 1 + 0.9 * squash * weight, scaleY: 1 - squash * weight, anchor: "bottom" };
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
