import { clockDriver } from "@gerak/dom";
import { combine, lanes, repeated, span, type Time } from "@gerak/core";
import { fade, pop, pulse, slide } from "@gerak/moves";

/** How long the scene runs, in ms; `gerak sample` and `gerak timeline` read it. */
export const durationMs = 4000;

const words = span(300, 1900);
const dotIn = span(1800, 2300);
const beat = span(2300, 3600);

/** Every target's value at `time`. */
export const scene = (time: Time) => {
  const night = lanes([1, 1], 0.45).of(words.of(time), 0);
  const shift = lanes([1, 1], 0.45).of(words.of(time), 1);
  return {
    night: combine([slide({ distance: 90, from: "left" })(night), fade()(night)]),
    shift: combine([slide({ distance: 90, from: "right" })(shift), fade()(shift)]),
    dot: combine([
      pop({ overshoot: 0.15 })(dotIn.of(time)),
      pulse({ amount: 0.45 })(repeated(beat.of(time), 2)),
    ]),
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
