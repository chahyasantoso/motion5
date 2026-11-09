import { clockDriver } from "@motion5/dom";
import {
  aim,
  along3d,
  backEase,
  combine3d,
  ease,
  keyframes,
  lane,
  lanes,
  mix,
  mixPoint3d,
  orbit,
  smear3d,
  span,
  springEase,
  squashed3d,
  toCubics3d,
  trailTurn,
  velocity3d,
  type Anchor3d,
  type Events,
  type Pose3d,
  type Time,
} from "@motion5/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4200;

/** The body starts to crouch, starts to travel, and touches the ground again, in ms. */
export const CROUCH_MS = 300;
export const LEAP_MS = 1000;
export const LAND_MS = 1900;
/** The small objects start arriving, in ms. */
export const BITS_MS = 1950;
/** The camera's orbit ends, in ms. */
export const CAMERA_END_MS = 3000;

/** Where the body starts, in world units, and where the small objects stand. */
export const START = { x: -3.6, y: 0, z: -1.8 };
export const BIT_COUNT = 5;
export const BIT_ROW = { z: 1.8, gap: 1.2 };
/** The body's height; the camera keeps its middle in view. */
export const BODY_HEIGHT = 1.2;
const PULLBACK = 5;

const anchor = (
  id: string,
  x: number,
  y: number,
  z: number,
  inX: number,
  inY: number,
  inZ: number,
  outX: number,
  outY: number,
  outZ: number,
): Anchor3d => ({ id, x, y, z, inX, inY, inZ, outX, outY, outZ });

const PATH = toCubics3d([
  anchor("start", START.x, START.y, START.z, 0, 0, 0, 1.6, 4, 2.5),
  anchor("land", 0, 0, 0, -1.7, 4, 2.5, 0, 0, 0),
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

/** The body's place: a short pull back, then along an arc that leaves the xy plane. */
export function flight(time: Time): Pose3d {
  const share = leap.of(time, pull).progress;
  const point = along3d(PATH, share);
  return {
    x: (point.x ?? 0) + mix(0, PULLBACK, Math.min(0, share)),
    y: point.y ?? 0,
    z: point.z ?? 0,
  };
}

/** The body's world point the camera keeps in view, on its middle. */
export function subject(time: Time): { x: number; y: number; z: number } {
  const place = flight(time);
  return { x: place.x ?? 0, y: (place.y ?? 0) + BODY_HEIGHT / 2, z: place.z ?? 0 };
}

/** The turn the antenna is pushed to by the body's speed, in degrees. */
export function drag(time: Time, events: Events): Pose3d {
  const speed = velocity3d(flight, time, events);
  return { rotation: -4 * speed.vx, rotationX: 4 * speed.vz };
}

const tail = trailTurn(drag, { stiffness: 140, damping: 14 });

const BITS = lanes(
  Array.from({ length: BIT_COUNT }, () => 1),
  0.45,
  { from: "center" },
);
const arrival = span(BITS_MS, BITS_MS + 900, durationMs);
const settle = span(LAND_MS, LAND_MS + 1300, durationMs);
const pop = springEase({ stiffness: 170, damping: 9 });
const pan = span(0, CAMERA_END_MS, durationMs);
const gaze = span(LAND_MS - 300, CAMERA_END_MS, durationMs);
const STAGE_CENTER = { x: -0.5, y: 1.2, z: 0 };

/** One small object's place, rising and growing in its turn. */
export function bit(time: Time, index: number): Pose3d {
  const share = lane(arrival.of(time), index, BITS).progress;
  return {
    x: (index - (BIT_COUNT - 1) / 2) * BIT_ROW.gap,
    y: mix(1.6, 0, ease.cubicOut(share)),
    z: BIT_ROW.z,
    scale: mix(0.4, 1, ease.backOut(share)),
    opacity: Math.min(1, share * 6),
  };
}

/** The camera's place on its orbit; its gaze leans on the subject, and rests on it. */
export function camera(time: Time): Pose3d {
  const eye = orbit({
    target: STAGE_CENTER,
    radius: 10,
    azimuth: mix(-22, 24, pan.of(time, ease.sineInOut).progress),
    elevation: 20,
  });
  const lean = mix(0.35, 1, gaze.of(time, ease.sineInOut).progress);
  return { ...eye, ...aim(eye, mixPoint3d(STAGE_CENTER, subject(time), lean)) };
}

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time, events: Events) => {
  const travel = smear3d(velocity3d(flight, time, events), { stretch: 75, max: 1.8 });
  return {
    body: combine3d([squashed3d(0.45, crouch(time)), flight(time)]),
    stretch: travel.pose,
    face: travel.turn,
    antenna: tail(time, events),
    pad: { scale: mix(0, 1, settle.of(time, pop).progress) } satisfies Pose3d,
    bit0: bit(time, 0),
    bit1: bit(time, 1),
    bit2: bit(time, 2),
    bit3: bit(time, 3),
    bit4: bit(time, 4),
    camera: camera(time),
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
