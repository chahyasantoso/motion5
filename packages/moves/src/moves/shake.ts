import type { Pose2d, Time } from "@gerak/core";
import { shaken } from "../parts/oscillation/shaken";
import { numberOption } from "./options";

/** Options of `shake`. */
export interface ShakeOptions {
  /** The most it can reach to either side, in px; at least 0, required. */
  readonly distance: number;
  /** Back-and-forth cycles, from 1 to 16; default 4. */
  readonly count?: number;
}

/** Shakes side to side, starting hard and dying away. */
export function shake(options: ShakeOptions): (time: Time) => Pose2d {
  const distance = numberOption("shake", "distance", options.distance, { min: 0 });
  const count = numberOption("shake", "count", options.count, { default: 4, min: 1, max: 16 });
  const sway = shaken({ count });
  return ({ progress }) => ({ x: distance * sway(progress) });
}
