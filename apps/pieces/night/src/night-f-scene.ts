import { clockDriver } from "@gerak/dom";
import { combine, fade, pulse, repeated, slide, span, type Time } from "@gerak/moves";

/** How long the scene runs, in ms; `gerak sample` and `gerak timeline` read it. */
export const durationMs = 4000;

const night = span(200, 1200);
const shift = span(700, 1700);
const lampOn = span(1900, 2400);
const breathe = span(2400, 3600);

/** Every target's value at `time`; `gerak sample` and `gerak timeline` read it. */
export const scene = (time: Time) => ({
  night: slide({ distance: 1000, from: "left" }, night.of(time)),
  shift: slide({ distance: 1000, from: "right" }, shift.of(time)),
  lamp: combine([fade({}, lampOn.of(time)), pulse({ amount: 0.6 }, repeated(breathe.of(time), 3))]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
