import type { Pose2d, Time } from "@gerak/core";

/** Fades in from clear to opaque. */
export function fade(): (time: Time) => Pose2d {
  return ({ progress }) => ({ opacity: progress });
}
