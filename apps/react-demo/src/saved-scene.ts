import { clockDriver } from "@gerak/dom";
import { combine, fade, pop, reversed, slide, span, type Time } from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 1500;

const markIn = span(0, 260, durationMs);
const wordIn = span(90, 400, durationMs);
const markOut = span(1180, 1500, durationMs);
const wordOut = span(1220, 1500, durationMs);

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => ({
  mark: combine([
    pop({ overshoot: 0.15 }, markIn.of(time)),
    fade({}, markIn.of(time)),
    reversed({}, markOut.of(time), (t) => slide({ distance: 8, from: "top" }, t)),
    reversed({}, markOut.of(time), (t) => fade({}, t)),
  ]),
  word: combine([
    slide({ distance: 14, from: "left" }, wordIn.of(time)),
    fade({}, wordIn.of(time)),
    reversed({}, wordOut.of(time), (t) => slide({ distance: 8, from: "top" }, t)),
    reversed({}, wordOut.of(time), (t) => fade({}, t)),
  ]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
