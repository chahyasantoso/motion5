import { type Pose2d, type Time } from "@gerak/core";

/** Options of `shockwave`. */
export interface ShockwaveOptions {
  /** Its size at the end, as a multiple of its size at rest. */
  readonly grow: number;
}

/** A ring that bursts outward from an impact, fast then slowing, and fades as it grows. */
export function shockwave(options: ShockwaveOptions): (time: Time) => Pose2d {
  const { grow } = options;
  return ({ progress: p }): Pose2d => ({
    scale: 1 + (grow - 1) * (1 - (1 - p) ** 3),
    opacity: 1 - p,
  });
}
