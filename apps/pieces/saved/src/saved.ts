import { motion, reversed, type Motion, type Pose2d, type Time } from "@gerak/core";
import { fade, pop, slide } from "@gerak/moves";
import { beat, box, group, sceneBuilder, text } from "@gerak/stage";

const markIn = beat("markIn", 260, { at: 0 });
const wordIn = beat("wordIn", 310, { at: 90 });
const markOut = beat("markOut", 320, { at: 1180 });
const wordOut = beat("wordOut", 280, { at: 1220 });

const mark = box("mark");
const word = text("word", "Saved");
const pill = group("pill", [mark, word]);

/** A motion playing `inner` backwards over its beat. */
const backwards = (inner: (time: Time) => Pose2d): Motion<Pose2d> =>
  motion((time) => inner(reversed(time)));

/** The mark pops in, the word slides in behind it, and both lift away to the top. */
export default sceneBuilder({ frame: { width: 400, height: 200 } })
  .element(pill)
  .element(mark)
  .motion(
    pop({ overshoot: 0.15 }).in(markIn),
    fade().in(markIn),
    backwards(slide({ distance: 8, from: "top" })).in(markOut),
    backwards(fade()).in(markOut),
  )
  .element(word)
  .motion(
    slide({ distance: 14, from: "left" }).in(wordIn),
    fade().in(wordIn),
    backwards(slide({ distance: 8, from: "top" })).in(wordOut),
    backwards(fade()).in(wordOut),
  );
