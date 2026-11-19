import { ballistic as thrown, type Pose2d, motion, type Motion } from "@gerak/core";

/** The parabola's true peak above the higher end, for a curve whose control point sits `apex` above it. */
function peakAbove(dy: number, apex: number): number {
  const higher = Math.min(dy, 0);
  const control = higher - apex;
  const span = dy - 2 * control;
  return span > 0 ? Math.max(0, higher - (dy - (control - dy) ** 2 / span)) : 0;
}

/** Options of `ballistic`. */
export interface BallisticOptions {
  /** Start this far right of rest, in px (negative: left). */
  readonly dx: number;
  /** Start this far below rest, in px (negative: above). */
  readonly dy: number;
  /** How far the control point sits above the higher end, in px; default 200. */
  readonly apex?: number;
}

/** Thrown from an offset to rest along a parabola at even time steps, rising, hanging at the top and falling like a ball. */
export function ballistic(options: BallisticOptions): Motion<Pose2d> {
  const { dx, dy, apex = 200 } = options;
  return motion(({ progress }): Pose2d => thrown({ dx, dy, apex: peakAbove(dy, apex) })(progress));
}
