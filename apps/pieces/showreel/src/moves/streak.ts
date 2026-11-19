import { type Pose2d, type Time } from "@gerak/core";

/** Options of `streak`. */
export interface StreakOptions {
  /** Share of the span at which the head reaches the stroke's end; default 0.65. */
  readonly arrive?: number;
  /** Share of the span before the tail starts to follow; default 0.35. */
  readonly lag?: number;
}

/** Runs a drawn window along a stroke: the head draws on, the tail follows behind and catches it at the end, leaving nothing. */
export function streak(options: StreakOptions = {}): (time: Time) => Pose2d {
  const { arrive = 0.65, lag = 0.35 } = options;
  return ({ progress }): Pose2d => ({
    drawn: Math.min(1, progress / arrive),
    drawnFrom: Math.max(0, (progress - lag) / (1 - lag)),
  });
}
