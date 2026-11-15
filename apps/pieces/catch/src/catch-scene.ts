import { clockDriver } from "@gerak/dom";
import {
  combine,
  drop,
  ease,
  hop,
  lane,
  lanes,
  mixPoint,
  react,
  span,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/moves";
import { buildChain, chainPoses, ik } from "@gerak/rig";

export const durationMs = 4800;

/** Where the page lays out every arm element: bones from their left end, joints by their centre. */
export const SHOULDER = { x: 250, y: 300 };
/** The ball's rest centre and radius, as the page lays it out. */
export const BALL = { x: 520, y: 440, radius: 30 };
export const WORD = "CATCH";

const BOUNCE = { height: 330, bounces: 2, decay: 0.35, squash: 0.35, dx: -1100 };
const flight = span(400, 2400);
/** The scene ms of the ball's last landing, where the hand meets it. */
export const LAND_MS = flight.at(hop.moments(BOUNCE).lastLanding);

/** The scene's own events: the catch, at the ball's last landing. */
export const cues: Events = [{ name: "catch", at: LAND_MS, target: "ball" }];
/** The hand gives under the ball's weight and springs back, starting from rest. */
const give = react({ on: ["catch"], kind: "wobble", amplitude: 26, decay: 7, frequency: 2.2 });

const raise = span(200, 1100);
const lunge = span(1450, LAND_MS);
const cradle = span(LAND_MS, LAND_MS + 600);
const word = span(2750, 3900);
const LETTERS = lanes(
  [...WORD].map(() => 1),
  0.3,
);

const arm = buildChain([
  { id: "upper", length: 170 },
  { id: "lower", parentId: "upper", length: 150 },
]);
const base = { ...SHOULDER, rotation: 0 };

const REST = { x: 340, y: 450 };
const READY = { x: 500, y: 260 };
/** Where the hand meets the ball: against its upper left. */
export const CATCH = { x: BALL.x - BALL.radius - 4, y: BALL.y - BALL.radius + 2 };
const CRADLE = { x: CATCH.x, y: CATCH.y - 70 };

function handGoal(time: Time, events: Events) {
  const raised = mixPoint(REST, READY, raise.of(time, ease.backOut).progress);
  const out = mixPoint(raised, CATCH, lunge.of(time, ease.cubicInOut).progress);
  const held = mixPoint(out, CRADLE, cradle.of(time, ease.sineInOut).progress);
  return { x: held.x, y: held.y + give(time, events) };
}

export const scene = (time: Time, events: Events) => {
  const { rotations } = ik(arm, { lower: handGoal(time, events) }, { base, flip: true });
  const { bones, tips } = chainPoses(arm, { rotations, base });
  const held = cradle.of(time).progress > 0;
  const carry: Pose2d = held
    ? { x: SHOULDER.x + tips.lower.x - CATCH.x, y: SHOULDER.y + tips.lower.y - CATCH.y }
    : {};
  return {
    upper: bones.upper,
    lower: bones.lower,
    elbow: tips.upper,
    hand: tips.lower,
    ball: combine([hop(BOUNCE, flight.of(time)), carry]),
    letters: [...WORD].map((_, index) => {
      const letter = lane(word.of(time), index, LETTERS);
      const fade: Pose2d = { opacity: ease.quadOut(Math.min(1, letter.progress * 3)) };
      return combine([drop({ distance: 80, squash: 0.2 }, letter), fade]);
    }),
  };
};

export const clock = () => clockDriver({ duration: durationMs });
