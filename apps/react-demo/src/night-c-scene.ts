import { clockDriver } from "@gerak/dom";
import {
  combine,
  ease,
  fade,
  nod,
  pop,
  pulse,
  repeated,
  rise,
  span,
  type Time,
} from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4000;

const nightIn = span(200, 1200, durationMs);
const shiftIn = span(700, 1700, durationMs);
const moonIn = span(1500, 2100, durationMs);
const bob = span(2100, 3700, durationMs);

/** Every target's value at `time`. */
export const scene = (time: Time) => ({
  night: combine([
    rise({ distance: 50 }, nightIn.of(time, ease.sineInOut)),
    fade({}, nightIn.of(time, ease.sineInOut)),
  ]),
  shift: combine([
    rise({ distance: 50 }, shiftIn.of(time, ease.sineInOut)),
    fade({}, shiftIn.of(time, ease.sineInOut)),
  ]),
  moon: combine([
    pop({ overshoot: 0.1 }, moonIn.of(time, ease.sineInOut)),
    nod({ distance: 12 }, repeated(bob.of(time, ease.linear), 2)),
  ]),
  glow: combine([
    pop({ overshoot: 0 }, moonIn.of(time, ease.sineInOut)),
    pulse({ amount: 0.3 }, repeated(bob.of(time, ease.linear), 2)),
  ]),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
