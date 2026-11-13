import { squashed, type Pose2d } from "./pose";

/** Settings of `squashFromSpeed`: `amount` of squash per px/s, and the `most` it may reach, 0 to 0.9. */
export interface SquashFromSpeedOptions {
  readonly amount: number;
  readonly most: number;
}

/** A pose stretched along the heading of a px/s `speed` and squashed across it, `amount` per px/s up to
 * `most`; empty at zero speed. Rotation is the heading in (-90, 90]. */
export function squashFromSpeed(
  speed: { readonly vx: number; readonly vy: number },
  options: SquashFromSpeedOptions,
): Pose2d {
  if (!(options.amount >= 0)) throw new RangeError("squashFromSpeed: amount must be 0 or more.");
  if (!(options.most >= 0 && options.most <= 0.9))
    throw new RangeError("squashFromSpeed: most must be from 0 to 0.9.");
  const pace = Math.hypot(speed.vx, speed.vy);
  if (options.amount === 0 || options.most === 0 || pace === 0) return {};
  const travel = (Math.atan2(speed.vy, speed.vx) * 180) / Math.PI;
  const heading = travel > 90 ? travel - 180 : travel <= -90 ? travel + 180 : travel;
  const squash = squashed(Math.min(options.most, options.amount * pace), 1, "bottom");
  return { ...squash, rotation: heading, anchor: "center" };
}
