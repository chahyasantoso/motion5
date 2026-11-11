import { clockDriver } from "@gerak/dom";
import { combine, fade, rise, slide, span, swing, type Time } from "@gerak/moves";

/** How long the scene runs, in ms. */
export const durationMs = 4000;

const night = span(200, 1500, durationMs);
const shift = span(800, 1900, durationMs);
const moonIn = span(1500, 3600, durationMs);

export const scene = (time: Time) => ({
  night: combine([rise({ distance: 70 }, night.of(time)), fade({}, night.of(time))]),
  shift: combine([
    slide({ distance: 220, from: "right" }, shift.of(time)),
    fade({}, shift.of(time)),
  ]),
  moon: swing({ angle: 26, swings: 5, anchor: "top" }, moonIn.of(time)),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
