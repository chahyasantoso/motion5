import { clockDriver } from "@gerak/dom";
import {
  combine,
  drop,
  fade,
  overshoot,
  pop,
  slide,
  span,
  type Pose2d,
  type Time,
} from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4000;

const nightIn = span(250, 1150);
const nightFade = span(250, 650);
const shiftIn = span(800, 1600);
const shiftFade = span(800, 1100);
const dialIn = span(1700, 2100);
const tickStart = 2300;
const tickEvery = 380;
const ticks = [0, 1, 2, 3].map((i) =>
  span(tickStart + i * tickEvery, tickStart + i * tickEvery + 240),
);

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => {
  const hand = ticks.reduce(
    (sum, tick) =>
      sum +
      (overshoot(
        { amount: 0.35, share: 0.5 },
        tick.of(time),
        (t): Pose2d => ({ rotation: 30 * t.progress }),
      ).rotation ?? 0),
    0,
  );
  return {
    night: combine([
      drop({ distance: 160, squash: 0.04 }, nightIn.of(time)),
      fade({}, nightFade.of(time)),
    ]),
    shift: combine([
      overshoot({ amount: 0.06, share: 0.35 }, shiftIn.of(time), (t) =>
        slide({ distance: 420, from: "right" }, t),
      ),
      fade({}, shiftFade.of(time)),
    ]),
    dial: pop({ overshoot: 0.15 }, dialIn.of(time)),
    hand: { rotation: hand } satisfies Pose2d,
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
