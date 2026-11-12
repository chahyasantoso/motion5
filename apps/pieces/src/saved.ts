import { combine, fade, pop, reversed, slide, type Time } from "@gerak/moves";
import { actor, group, story } from "@gerak/stage";

/** The mark pops in, the word slides in behind it, and both lift away to the top. */
export const beats = story(1500, {
  markIn: [0, 260],
  wordIn: [90, 400],
  markOut: [1180, 1500],
  wordOut: [1220, 1500],
});

/** The stage is 400 by 200. */
export const frame = { width: 400, height: 200 };

/** A check mark beside the word it confirms, held in a pill that does not move. */
export const cast = {
  pill: group({ mark: actor(), word: actor({ text: "Saved" }) }, { still: true }),
};

const MARK = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><circle cx='12' cy='12' r='12' fill='#2f9e6e'/><path d='M6.5 12.5l3.8 3.8 7.2-8' fill='none' stroke='#fff' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/></svg>`;

export const skins = {
  dom: {
    css: `
      [data-stage="frame"] { background: #f6f5f1; font-family: system-ui, sans-serif; line-height: normal; }
      [data-cast="pill"] { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); gap: 10px; padding: 10px 18px 10px 12px; flex-wrap: nowrap; }
      [data-cast="mark"] { width: 28px; height: 28px; background: url("data:image/svg+xml,${encodeURIComponent(MARK)}") center / 100% 100% no-repeat; }
      [data-cast="word"] { font-size: 22px; font-weight: 600; color: #23302a; }
    `,
  },
};

export const scene = (time: Time) => ({
  mark: combine([
    pop({ overshoot: 0.15 }, beats.markIn.of(time)),
    fade({}, beats.markIn.of(time)),
    slide({ distance: 8, from: "top" }, reversed(beats.markOut.of(time))),
    fade({}, reversed(beats.markOut.of(time))),
  ]),
  word: combine([
    slide({ distance: 14, from: "left" }, beats.wordIn.of(time)),
    fade({}, beats.wordIn.of(time)),
    slide({ distance: 8, from: "top" }, reversed(beats.wordOut.of(time))),
    fade({}, reversed(beats.wordOut.of(time))),
  ]),
});
