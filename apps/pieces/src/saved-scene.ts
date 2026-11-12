import { clockDriver } from "@gerak/dom";
import { combine, fade, pop, reversed, slide, span, type Time } from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 1500;

const markIn = span(0, 260);
const wordIn = span(90, 400);
const markOut = span(1180, 1500);
const wordOut = span(1220, 1500);

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => ({
  mark: combine([
    pop({ overshoot: 0.15 }, markIn.of(time)),
    fade({}, markIn.of(time)),
    slide({ distance: 8, from: "top" }, reversed(markOut.of(time))),
    fade({}, reversed(markOut.of(time))),
  ]),
  word: combine([
    slide({ distance: 14, from: "left" }, wordIn.of(time)),
    fade({}, wordIn.of(time)),
    slide({ distance: 8, from: "top" }, reversed(wordOut.of(time))),
    fade({}, reversed(wordOut.of(time))),
  ]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
