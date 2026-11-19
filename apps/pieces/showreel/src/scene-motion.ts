import { motion, type Motion, type Pose2d, type Time } from "@gerak/core";
import type { MotionContext } from "@gerak/stage";

/** A motion that reads the scene's context beside its own time: boxes, events, and the part it poses. */
export const withScene = (
  fn: (time: Time, context: MotionContext) => Pose2d,
): Motion<Pose2d, MotionContext> =>
  motion<Pose2d, MotionContext>((time, context) => {
    if (context === undefined) throw new TypeError("a scene motion needs the scene's context.");
    return fn(time, context);
  });

/** The index of the part a motion poses; 0 on an element with no parts. */
export const partOf = (context: MotionContext): number => context.index ?? 0;
