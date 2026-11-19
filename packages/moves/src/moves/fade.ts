import { motion, type Motion, type Pose2d } from "@gerak/core";

/** Fades in from clear to opaque. */
export function fade(): Motion<Pose2d> {
  return motion(({ progress }) => ({ opacity: progress }));
}
