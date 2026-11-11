import { clockDriver } from "@gerak/dom";
import {
  combine,
  fade,
  lane,
  lanes,
  pop,
  pulse,
  repeated,
  slide,
  span,
  type Time,
} from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4000;

const words = span(300, 1900, durationMs);
const dotIn = span(1800, 2300, durationMs);
const beat = span(2300, 3600, durationMs);

/** Every target's value at `time`. */
export const scene = (time: Time) => {
  const night = lane(words.of(time), 0, lanes([1, 1], 0.45));
  const shift = lane(words.of(time), 1, lanes([1, 1], 0.45));
  return {
    night: combine([slide({ distance: 90, from: "left" }, night), fade({}, night)]),
    shift: combine([slide({ distance: 90, from: "right" }, shift), fade({}, shift)]),
    dot: combine([
      pop({ overshoot: 0.15 }, dotIn.of(time)),
      repeated({ count: 2 }, beat.of(time), (t) => pulse({ amount: 0.45 }, t)),
    ]),
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
