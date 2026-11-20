import { motion, reversed, type Motion, type Pose2d, type Time } from "@gerak/core";
import { fade, pop, slide } from "@gerak/moves";
import { beat, box, group, sceneBuilder, text } from "@gerak/stage";

const MARK = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='#2f9e6e'/><path d='M6.5 12.5l3.8 3.8 7.2-8' fill='none' stroke='#fff' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/></svg>`;

const markIn = beat("markIn", 260, { at: 0 });
const wordIn = beat("wordIn", 310, { at: 90 });
const markOut = beat("markOut", 320, { at: 1180 });
const wordOut = beat("wordOut", 280, { at: 1220 });

const mark = box("mark");
const word = text("word", "Saved");
const pill = group("pill", [mark, word]);

const css = `
      [data-stage="frame"] { background: #f6f5f1; font-family: system-ui, sans-serif; line-height: normal; }
      [data-cast="pill"] { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); gap: 10px; padding: 10px 18px 10px 12px; flex-wrap: nowrap; }
      [data-cast="mark"] { width: 28px; height: 28px; background: url("data:image/svg+xml,${encodeURIComponent(MARK)}") center / 100% 100% no-repeat; }
      [data-cast="word"] { font-size: 22px; font-weight: 600; color: #23302a; }
    `;

/** A motion playing `inner` backwards over its beat. */
const backwards = (inner: (time: Time) => Pose2d): Motion<Pose2d> =>
  motion((time) => inner(reversed(time)));

/** The mark pops in, the word slides in behind it, and both lift away to the top. */
/** How the DOM renderer draws this piece. */
export const skin = { css };

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
