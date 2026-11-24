import { motion, type Pose2d, type Time } from "@gerak/core";
import {
  beat,
  box,
  sceneBuilder,
  shape,
  text,
  type MotionContext,
  type Path,
  type SceneBuilder,
} from "@gerak/stage";

export const intro = beat("intro", 400);
export const go = beat("go", 1000, { after: intro });
export const out = beat("out", 600, { after: go });

/** The clean piece, with the options a test varies: a length and a stroke under the dot. */
export function stageClean(options: { length?: number; mark?: Path } = {}): SceneBuilder {
  const dot = box("dot");
  const word = text("word", { split: "letters" });
  const mark = options.mark === undefined ? box("mark") : shape("mark", options.mark);
  const stage = box("stage");
  const atGo = motion(
    (time: Time, context?: MotionContext): Pose2d => ({
      x: (context?.rest.get("dot").x ?? 0) + 100 * time.progress,
    }),
  ).in(go);
  const letters = motion(
    (time: Time, context?: MotionContext): Pose2d => ({
      x: (context?.index ?? 0) * 20 + 50 * time.progress,
    }),
  ).in(intro);
  return sceneBuilder({
    length: options.length ?? out.to,
  })
    .element(stage)
    .element(dot)
    .show(go)
    .motion(atGo)
    .element(word)
    .motion(letters)
    .element(mark);
}

export default stageClean();
