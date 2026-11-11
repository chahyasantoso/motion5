import type { Pose2d } from "./pose";

/** A pose field's value, 0 when the pose leaves it out. */
export const num = (value: number | undefined): number => value ?? 0;

/** A pose with its position and turn written out, so every sample of a modifier carries the same fields. */
export const whole = (pose: Pose2d): Pose2d => ({
  ...pose,
  x: num(pose.x),
  y: num(pose.y),
  rotation: num(pose.rotation),
});
