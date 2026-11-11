import { clockDriver } from "@gerak/dom";
import { combine, fade, pulse, repeated, slide, span, type Time } from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4000;

const night = span(200, 1200, durationMs);
const shift = span(700, 1700, durationMs);
const lampOn = span(1900, 2400, durationMs);
const breathe = span(2400, 3600, durationMs);

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => ({
  night: slide({ distance: 1000, from: "left" }, night.of(time)),
  shift: slide({ distance: 1000, from: "right" }, shift.of(time)),
  lamp: combine([
    fade({}, lampOn.of(time)),
    repeated({ count: 3 }, breathe.of(time), (t) => pulse({ amount: 0.6 }, t)),
  ]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
