import type { Pose2d, Time } from "@gerak/core";
import { numberOption } from "./options";

/** Options of `rise`. */
export interface RiseOptions {
  /** Start this far below rest, in px; at least 0, required. */
  readonly distance: number;
}

/** Rises from below, decelerating to rest. */
export function rise(options: RiseOptions): (time: Time) => Pose2d {
  const distance = numberOption("rise", "distance", options.distance, { min: 0 });
  return ({ progress }) => ({ y: distance * (1 - progress) ** 3 });
}
