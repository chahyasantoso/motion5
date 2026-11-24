import { motion, type Pose2d, type Time } from "@gerak/core";
import { beat, box, scene, text, type MotionContext } from "@gerak/stage";

const intro = beat("intro", 400);
const go = beat("go", 1000, { after: intro });
const out = beat("out", 600, { after: go });

const dot = box("dot");
const word = text("word", { split: "letters" });

/** The dot moves in `intro` and `out`, outside the `go` stretch it shows in. */
export default scene(
  { length: out.to },
  box("stage"),
  dot
    .shows(go)
    .moves(motion((time: Time): Pose2d => ({ x: 100 * time.progress })).in(intro))
    .moves(motion((time: Time): Pose2d => ({ x: 10 * Math.min(1, time.progress * 20) })).in(out)),
  word.moves(
    motion(
      (time: Time, context?: MotionContext): Pose2d => ({
        x: (context?.index ?? 0) * 20 + 50 * time.progress,
      }),
    ).in(intro),
  ),
);
