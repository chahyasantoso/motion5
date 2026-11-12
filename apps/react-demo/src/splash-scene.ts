import { clockDriver } from "@gerak/dom";
import {
  combine,
  drop,
  ease,
  keyframes,
  lane,
  lanes,
  mix,
  span,
  type Pose2d,
  type Time,
} from "@gerak/moves";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 4800;

export const WORD = "SPLASH";

/** Layout of the shared rings: how wide each ends, how bright it starts, and when it leaves the centre. */
export const RINGS = [
  { delay: 0, ms: 1900, size: 1, alpha: 1 },
  { delay: 230, ms: 1800, size: 0.82, alpha: 0.85 },
  { delay: 470, ms: 1700, size: 0.66, alpha: 0.7 },
  { delay: 720, ms: 1500, size: 0.5, alpha: 0.55 },
] as const;

/** Each droplet: where it lands (px from the impact, px of depth), how high it jumps, and its timing. */
export const DROPLETS = [
  { dx: -300, depth: 14, height: 190, launch: 0, flight: 1000, size: 17 },
  { dx: -170, depth: -8, height: 310, launch: 20, flight: 1250, size: 22 },
  { dx: -60, depth: 22, height: 240, launch: 60, flight: 1100, size: 14 },
  { dx: 90, depth: 4, height: 350, launch: 0, flight: 1350, size: 26 },
  { dx: 210, depth: -12, height: 260, launch: 40, flight: 1150, size: 18 },
  { dx: 330, depth: 18, height: 180, launch: 20, flight: 950, size: 15 },
] as const;

const FALL = { distance: 660, squash: 0.32 };
const fall = span(250, 1000);
/** The ms the falling drop touches the water. */
export const IMPACT_MS = fall.at(drop.moments(FALL).landing);
const swallow = span(IMPACT_MS, IMPACT_MS + 180);

const ringSpans = RINGS.map((ring) =>
  span(IMPACT_MS + ring.delay, IMPACT_MS + ring.delay + ring.ms),
);

const flights = DROPLETS.map((d) => {
  const launchMs = IMPACT_MS + d.launch;
  const landMs = launchMs + d.flight;
  const apexMs = launchMs + d.flight * 0.45;
  return {
    flight: span(launchMs, landMs),
    pop: span(launchMs, launchMs + 30),
    sink: span(landMs, landMs + 200),
    ripple: span(landMs - 20, landMs + 900),
    height: keyframes(
      durationMs,
      -d.depth,
      [
        { at: launchMs, to: -d.depth },
        { at: apexMs, to: -d.depth - d.height, ease: ease.quadOut },
        { at: landMs, to: 0, ease: ease.quadIn },
      ],
      mix,
    ),
    landMs,
  };
});

const LETTERS = lanes(
  [...WORD].map(() => 1),
  0.35,
);
const firstLanding = Math.min(...flights.map((f) => f.landMs));
const word = span(firstLanding + 150, firstLanding + 150 + 1450);

/** A ring's pose: it widens eased out and fades as it goes. */
function ringPose(ring: (typeof RINGS)[number], index: number, time: Time): Pose2d {
  const share = ringSpans[index]?.of(time, ease.cubicOut).progress ?? 0;
  const fade = ringSpans[index]?.of(time, ease.quadOut).progress ?? 0;
  const born = Math.min(1, share * 30);
  return {
    scale: mix(0.02, ring.size, share),
    opacity: ring.alpha * born * (1 - fade) ** 1.4,
  };
}

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time) => ({
  drop: combine([
    drop(FALL, fall.of(time)),
    {
      scale: mix(1, 0.5, swallow.of(time).progress),
      opacity: 1 - swallow.of(time).progress,
      anchor: "bottom",
    },
  ]),
  rings: RINGS.map((ring, index) => ringPose(ring, index, time)),
  droplets: DROPLETS.map((d, index): Pose2d => {
    const f = flights[index];
    if (f === undefined) return {};
    const sunk = f.sink.of(time, ease.quadOut).progress;
    return {
      x: mix(-d.dx, 0, f.flight.of(time).progress),
      y: f.height(time),
      scaleX: mix(1, 1.5, sunk),
      scaleY: mix(1, 0.2, sunk),
      opacity: f.pop.of(time).progress * (1 - sunk),
      anchor: "bottom",
    };
  }),
  ripples: DROPLETS.map((_, index): Pose2d => {
    const f = flights[index];
    if (f === undefined) return {};
    const share = f.ripple.of(time, ease.cubicOut).progress;
    const born = Math.min(1, share * 30);
    return { scale: mix(0.05, 1, share), opacity: 0.7 * born * (1 - share) ** 1.5 };
  }),
  foam: [...WORD].map((_, index): Pose2d => {
    const share = lane(word.of(time), index, LETTERS).progress;
    const spread = ease.cubicOut(share);
    return {
      scale: mix(0.3, 1, spread),
      opacity: 0.85 * Math.min(1, share * 12) * (1 - spread) ** 1.2,
    };
  }),
  letters: [...WORD].map((_, index): Pose2d => {
    const share = lane(word.of(time), index, LETTERS).progress;
    const rise = ease.backOut(share);
    return {
      y: mix(230, 0, rise),
      rotation: mix(index % 2 === 0 ? -9 : 9, 0, rise),
      anchor: "bottom",
    };
  }),
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
