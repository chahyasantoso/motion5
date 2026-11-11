import { clockDriver } from "@gerak/dom";
import { combine, ease, fade, pop, pulse, repeated, rise, span, type Time } from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4000;

const nightIn = span(200, 1100, durationMs);
const shiftIn = span(550, 1450, durationMs);
const dotIn = span(1700, 2100, durationMs);
const breathe = span(2200, 3400, durationMs);

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => ({
  night: combine([
    rise({ distance: 40 }, nightIn.of(time, ease.sineOut)),
    fade({}, nightIn.of(time, ease.sineOut)),
  ]),
  shift: combine([
    rise({ distance: 40 }, shiftIn.of(time, ease.sineOut)),
    fade({}, shiftIn.of(time, ease.sineOut)),
  ]),
  dot: combine([
    pop({ overshoot: 0.15 }, dotIn.of(time)),
    pulse({ amount: 0.6 }, repeated(breathe.of(time), 1)),
  ]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
