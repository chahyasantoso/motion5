import { clockDriver } from "@gerak/dom";
import {
  along,
  backEase,
  combine,
  ease,
  keyframes,
  lane,
  lanes,
  mix,
  smear,
  span,
  springEase,
  squashed,
  toCubics,
  trail,
  velocity,
  type Anchor2d,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4000;

export const WORD = "LANDED";

/** The body starts to crouch, starts to travel, and touches the ground again, in ms. */
export const CROUCH_MS = 300;
export const LEAP_MS = 950;
export const LAND_MS = 1850;
/** The word's letters start arriving, in ms. */
export const WORD_MS = 1900;

/** Where the body starts, px left of its landing spot, and how far a unit of pull-back moves it. */
export const START_X = -540;
const PULLBACK_PX = 700;

const anchor = (
  id: string,
  x: number,
  y: number,
  inX: number,
  inY: number,
  outX: number,
  outY: number,
): Anchor2d => ({ id, x, y, inX, inY, outX, outY });

const PATH = toCubics([
  anchor("start", START_X, 0, 0, 0, 160, -430),
  anchor("land", 0, 0, -170, -430, 0, 0),
]);

const crouch = keyframes(
  durationMs,
  0,
  [
    { at: CROUCH_MS, to: 0 },
    { at: LEAP_MS, to: 1, ease: ease.quadOut },
    { at: LEAP_MS + 260, to: 0, ease: ease.cubicOut },
    { at: LAND_MS, to: 0 },
    { at: LAND_MS + 90, to: 0.8, ease: ease.quadOut },
    { at: LAND_MS + 420, to: 0, ease: ease.cubicOut },
  ],
  mix,
);

const leap = span(LEAP_MS, LAND_MS, durationMs);
const pull = backEase({ amount: 1.6, direction: "in" });

/** The body's offset from its landing spot: a short pull back, then along the arc. */
function flight(time: Time): Pose2d {
  const share = leap.of(time, pull).progress;
  const point = along(PATH, share);
  return { x: (point.x ?? 0) + mix(0, PULLBACK_PX, Math.min(0, share)), y: point.y ?? 0 };
}

/** The sideways swing the antenna is pushed to by the body's speed, in degrees. */
export function drag(time: Time, events: Events): number {
  return -0.02 * velocity(flight, time, events).vx;
}

const tail = trail(drag, { stiffness: 140, damping: 14 });

const LETTERS = lanes(
  [...WORD].map(() => 1),
  0.45,
  { from: "center" },
);
const word = span(WORD_MS, WORD_MS + 900, durationMs);
const settle = span(LAND_MS, LAND_MS + 1300, durationMs);
const pop = springEase({ stiffness: 170, damping: 9 });

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time, events: Events) => {
  const travel = smear(velocity(flight, time, events), { stretch: 0.22, max: 1.8 });
  return {
    body: combine([squashed(0.45, crouch(time), "bottom"), flight(time)]),
    stretch: travel.pose,
    face: { rotation: -travel.heading } satisfies Pose2d,
    antenna: { rotation: tail(time, events), anchor: "bottom" } satisfies Pose2d,
    pad: { scale: mix(0, 1, settle.of(time, pop).progress) } satisfies Pose2d,
    letters: [...WORD].map((_, index): Pose2d => {
      const share = lane(word.of(time), index, LETTERS).progress;
      const rise = ease.cubicOut(share);
      return {
        y: mix(70, 0, rise),
        scale: mix(0.4, 1, ease.backOut(share)),
        opacity: Math.min(1, share * 6),
      };
    }),
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
