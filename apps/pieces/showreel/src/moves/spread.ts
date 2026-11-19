import { type Pose2d, type Time } from "@gerak/core";

/** Options of `spread`. */
export interface SpreadOptions {
  /** Where on the stroke it opens from, as a share of its length; default 0.5, the middle. */
  readonly from?: number;
}

/** Draws a stroke outward from a point on it both ways at once, for a floor or an underline that opens from where something touched it. */
export function spread(options: SpreadOptions = {}): (time: Time) => Pose2d {
  const { from = 0.5 } = options;
  return ({ progress }): Pose2d => ({
    drawnFrom: from * (1 - progress),
    drawn: from + (1 - from) * progress,
  });
}
