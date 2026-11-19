import { type Pose2d, motion, type Motion } from "@gerak/core";

/** Options of `kick`. */
export interface KickOptions {
  /** How far sideways it flies, in px (negative: left). */
  readonly dx: number;
  /** How high it is thrown, in px; default 20. */
  readonly rise?: number;
  /** How far it sinks back by the end, in px; default 10. */
  readonly fall?: number;
  /** Share of its size lost by the end; default 0.75. */
  readonly shrink?: number;
}

/** A speck kicked up from a contact: flies out sideways and up, slowing, sinks again, and shrinks and fades away. */
export function kick(options: KickOptions): Motion<Pose2d> {
  const { dx, rise = 20, fall = 10, shrink = 0.75 } = options;
  return motion(({ progress: p }): Pose2d => {
    const out = 1 - (1 - p) ** 3;
    return { x: dx * out, y: -rise * out + fall * p * p, scale: 1 - shrink * p, opacity: 1 - p };
  });
}
