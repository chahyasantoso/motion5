import type { Pose2d, Time } from "@gerak/core";
import { shaken } from "../parts/oscillation/shaken";
import { numberOption } from "./options";

/** Options of `wobble`. */
export interface WobbleOptions {
  /** The widest turn, in degrees; at least 0, required. */
  readonly angle: number;
  /** Back-and-forth cycles, from 1 to 16; default 3. */
  readonly count?: number;
}

/** Turns back and forth, starting hard and dying away. */
export function wobble(options: WobbleOptions): (time: Time) => Pose2d {
  const angle = numberOption("wobble", "angle", options.angle, { min: 0 });
  const count = numberOption("wobble", "count", options.count, { default: 3, min: 1, max: 16 });
  const sway = shaken({ count });
  return ({ progress }) => ({ rotation: angle * sway(progress) });
}
