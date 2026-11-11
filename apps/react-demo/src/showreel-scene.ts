import { clockDriver } from "@gerak/dom";
import {
  anticipate,
  atProgress,
  combine,
  drop,
  ease,
  elapsedOf,
  fade,
  hop,
  keyframes,
  lane,
  lanes,
  mix,
  NO_EVENTS,
  nod,
  overshoot,
  pulse,
  reversed,
  rise,
  slide,
  smear,
  span,
  squashed,
  swing,
  trace,
  unfold,
  velocity,
  wipe,
  wobble,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/moves";
import { ballistic } from "./moves/ballistic";
import { bump } from "./moves/bump";
import { jolt } from "./moves/jolt";
import { kick } from "./moves/kick";
import { launch } from "./moves/launch";
import { shockwave } from "./moves/shockwave";
import { springSettle } from "./moves/spring-settle";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 15000;

const D = durationMs;
const DX = 640;
const DY0 = 400;
const DY1 = 380;
const R = 18;

const LAUNCH = 850;
const ANT_IN = 1000;
const ANT_CROUCH = 2250;
const ANT_LEAP = 2900;
const WGT_LAND0 = 3880;
const WGT_LIFT = 5550;
const WGT_DROP = 5750;
const OVL_IN = 6150;
/** Where the bar starts to brake, and the lagging letters swing ahead. */
const OVL_BRAKE = 6650;
const OVL_SETTLED = 8700;
const OVL_GONE = 9450;
const DROP = 9450;
const LAND = 9850;
const BURST = 10230;
const UNDERLINE = 10800;
const WIPE = 11550;
const COLL = 12300;
const SHRINK = 12700;
const MATCH = 13050;
const LEAP = 13250;
const PERIOD = 13900;
const CREDIT = 14250;

/** Layout the page measures once and writes here; the scene reads it each frame. */
export const geo = {
  stl: [0, 1, 2, 3, 4, 5].map((i) => ({ x: 440 + i * 80, y: 296, w: 80 })),
  wgt: [0, 1, 2, 3, 4, 5].map((i) => ({ x: 408 + i * 96, w: 96 })),
  px: 930,
  py: 372,
};

/** The beat labels the counter shows, in order. */
export const BEATS = [
  "00 — ORIGIN",
  "01 — ANTICIPATION",
  "02 — WEIGHT",
  "03 — OVERLAP",
  "04 — SETTLE",
];
const BEAT_STARTS = [0, ANT_IN, 3460, OVL_IN, DROP];

/** The string length each OVERLAP letter hangs from, in px. */
export const STRINGS = [140, 185, 160, 200, 170, 210, 180];

const share = (ms: number, from: number, to: number) =>
  Math.min(1, Math.max(0, (ms - from) / (to - from)));
const at = (x: number, y: number): Pose2d => ({ x, y });
const hidden: Pose2d = { opacity: 0 };
/** A pose that leaves opacity out keeps the last one written, so a target that was hidden says it is shown. */
const shown: Pose2d = { opacity: 1 };

const wgtLand = (i: number) => WGT_LAND0 + i * 165 + (i === 5 ? 90 : 0);
const stlIn = (i: number) => BURST + (Math.abs(i - 2.5) - 0.5) * 55;
const stlOut = (i: number) => COLL + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;
const STL_TURN = [-48, 30, -16, 18, -30, 50];

const camScale = keyframes(
  D,
  1.12,
  [
    { at: 500, to: 1.12 },
    { at: 1400, to: 1, ease: ease.cubicOut },
    { at: ANT_LEAP, to: 1.04, ease: ease.cubicInOut },
    { at: 3500, to: 1, ease: ease.cubicOut },
    { at: MATCH, to: 1 },
    { at: D, to: 1.045, ease: ease.cubicOut },
  ],
  mix,
);

const ANT_RISE = lanes(
  Array.from({ length: 10 }, () => 1),
  45 / 520,
);
const antRise = span(ANT_IN, ANT_IN + 520 + 9 * 45, D);
const FIN_LANES = lanes([1, 1, 1], 110 / 650);
const finIn = span(MATCH, MATCH + 650 + 2 * 110, D);

const DROP_OPTIONS = { distance: 640, squash: 0.24 };
const DROP_LANDING = drop.moments(DROP_OPTIONS).landing;

/** The dot's final leap, from the burst point to the full stop. */
const leap = span(LEAP, PERIOD, D);
const arcOptions = () => ({ dx: DX - geo.px, dy: DY1 - geo.py, apex: 430 });
const flight = (time: Time): Pose2d =>
  combine([at(geo.px, geo.py), ballistic(arcOptions(), leap.of(time))]);

/** Share of the arc's length reached at curve parameter `s`, for a stroke that follows the dot. */
const arcLength = (s: number): number => {
  const o = arcOptions();
  const steps = 48;
  let total = 0;
  let upTo = 0;
  let prev = ballistic(o, atProgress(0));
  for (let k = 1; k <= steps; k++) {
    const next = ballistic(o, atProgress(k / steps));
    const d = Math.hypot((next.x ?? 0) - (prev.x ?? 0), (next.y ?? 0) - (prev.y ?? 0));
    total += d;
    if (k / steps <= s) upTo += d;
    prev = next;
  }
  return total > 0 ? upTo / total : 0;
};

const shock = (
  ms: number,
  time: Time,
  x: number,
  y: number,
  from: number,
  length: number,
  grow: number,
) =>
  ms < from || ms > from + length
    ? hidden
    : combine([
        at(x, y),
        { scale: 0.2 },
        shockwave({ grow: grow / 0.2 }, span(from, from + length, D).of(time)),
      ]);

function dot(ms: number, time: Time, events: Events): Pose2d {
  if (ms < 1250) {
    return combine([
      launch(
        { height: 620, squash: 0.42, bulge: 0.8, stretch: 0.9, crouch: 0.5 },
        span(450, 1250, D).of(time),
      ),
      at(DX, DY0),
      springSettle({ scale: 0, rings: 2, damping: 5 }, span(60, 900, D).of(time)),
      { opacity: ms < 60 ? 0 : 1 },
    ]);
  }
  if (ms < DROP) return hidden;
  if (ms < BURST) {
    const fall = share(ms, DROP, LAND);
    const stretch = ms < LAND ? 1 + 0.55 * fall * fall : 1;
    return combine([
      ms < 9983
        ? drop({ distance: 440, squash: 0.48 }, span(DROP, 9983, D).of(time))
        : hop({ height: 42, bounces: 0, squash: 0.3 }, span(9983, 10200, D).of(time)),
      at(DX, DY1),
      { scaleY: stretch, scaleX: 1 / Math.sqrt(stretch) },
      squashed(0.38, ease.cubicOut(share(ms, 10150, BURST)), "bottom"),
      shown,
    ]);
  }
  if (ms < MATCH) {
    const arrivals = [0, 1, 2, 3, 4, 5].map((i) =>
      pulse({ amount: 0.2 }, span(stlOut(i) + 520, stlOut(i) + 720, D).of(time)),
    );
    const wipeBeat =
      ms < WIPE
        ? { scale: 1 - 0.3 * ease.cubicInOut(share(ms, WIPE - 150, WIPE)) }
        : springSettle({ scale: 0.7, rings: 2, damping: 4 }, span(WIPE, 12150, D).of(time));
    return combine([
      at(DX, DY1),
      springSettle({ squash: 0.38, rings: 2.5, damping: 3 }, span(BURST, 11100, D).of(time)),
      pulse({ amount: 0.45 }, span(BURST, 10450, D).of(time)),
      wipeBeat,
      ...arrivals,
      shown,
    ]);
  }
  if (ms < LEAP) {
    return combine([
      at(DX, DY1),
      squashed(0.4, ease.cubicInOut(share(ms, MATCH, LEAP)), "bottom"),
      shown,
    ]);
  }
  if (ms < PERIOD) {
    const { pose } = smear(velocity(flight, time, events), { stretch: 0.25, max: 1.5 });
    return combine([
      flight(time),
      pose,
      { scale: mix(1, 0.64, ease.cubicInOut(leap.of(time).progress)) },
      shown,
    ]);
  }
  const contact = 0.42 * Math.exp(-(ms - PERIOD) / 50);
  return combine([
    hop({ height: 16, bounces: 0, squash: 0.25 }, span(PERIOD, 14260, D).of(time)),
    at(geo.px, geo.py),
    { scale: 0.64 },
    squashed(contact, 1, "bottom"),
    shown,
  ]);
}

function camera(time: Time): Pose2d {
  const landings = [0, 1, 2, 3, 4, 5].map((i) =>
    jolt(
      { distance: 3 + i * i * 0.6, count: 5, sideways: 0.35 },
      span(wgtLand(i), wgtLand(i) + 450, D).of(time),
    ),
  );
  return combine([
    { scale: camScale(time) },
    bump({ dy: 50 }, span(ANT_LEAP, 3700, D).of(time)),
    ...landings,
    bump({ dy: -40 }, span(WGT_DROP, 6450, D).of(time)),
    bump({ turn: 0.9 }, span(OVL_IN, 7700, D).of(time)),
    jolt({ distance: 6, count: 3, sideways: 0.2 }, span(LAND, LAND + 450, D).of(time)),
    jolt({ distance: 3, count: 3, sideways: 0.2 }, span(PERIOD, PERIOD + 400, D).of(time)),
  ]);
}

function anticipateLetter(i: number, time: Time): Pose2d {
  const c0 = ANT_CROUCH + i * 35;
  const l0 = ANT_LEAP + i * 38;
  const rising = lane(antRise.of(time), i, ANT_RISE);
  return combine([
    launch(
      {
        height: 1300,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (l0 - c0) / (l0 + 650 - c0),
        tremble: 1.6,
        flight: "accelerate",
      },
      span(c0, l0 + 650, D).of(time),
    ),
    overshoot({ amount: 0.1 }, rising, (t) => rise({ distance: 120 }, t)),
    { rotation: mix(9, 0, ease.cubicOut(rising.progress)) },
  ]);
}

function weightLetter(i: number, time: Time): Pose2d {
  const land = wgtLand(i);
  const fallFrom = land - 420;
  const plungeAt = WGT_DROP + Math.abs(i - 2.5) * 30;
  return combine([
    drop(DROP_OPTIONS, span(fallFrom, fallFrom + 420 / DROP_LANDING, D).of(time)),
    wobble({ angle: 2.5, count: 2 }, span(land, land + 600, D).of(time)),
    anticipate(
      { share: (plungeAt - WGT_LIFT) / (plungeAt + 520 - WGT_LIFT), amount: 0.013 },
      span(WGT_LIFT, plungeAt + 520, D).of(time),
      (t) => rise({ distance: 1080 }, reversed(t)),
    ),
  ]);
}

function dust(j: number, ms: number, time: Time): Pose2d {
  const li = Math.floor(j / 3);
  const kk = j % 3;
  const side = kk === 0 ? -1 : kk === 1 ? 1 : li % 2 ? 1 : -1;
  const letter = geo.wgt[li] ?? { x: 640, w: 96 };
  const land = wgtLand(li);
  if (ms < land || ms > land + 700) return hidden;
  return combine([
    at(letter.x + side * letter.w * 0.42, 484),
    { scale: (0.6 + 0.3 * kk) * (li === 5 ? 1.5 : 1), opacity: 0.75 },
    kick(
      {
        dx: side * (40 + kk * 28),
        rise: 10 + 22 * kk,
        fall: 30 * (kk === 2 ? 1 : 0.3),
        shrink: 0.75,
      },
      span(land, land + 700, D).of(time),
    ),
  ]);
}

function floorHalf(from: "left" | "right", time: Time): Pose2d {
  return combine([
    unfold({ from }, span(3350, 3800, D).of(time, ease.cubicOut)),
    unfold({ from }, reversed(span(WGT_DROP, 6000, D).of(time, ease.cubicIn))),
  ]);
}

function hanger(i: number, time: Time): Pose2d {
  const length = STRINGS[i] ?? 180;
  const hz = 1.25 * Math.sqrt(160 / length);
  const from = OVL_BRAKE + i * 28;
  const to = 7700 + (length - 140) * 8;
  return combine([
    swing(
      { angle: 26 + (length - 140) * 0.12, swings: Math.min(8, (2 * hz * (to - from)) / 1000) },
      span(from, to, D).of(time),
    ),
    anticipate(
      { share: 0.33, amount: 0.25 },
      span(OVL_SETTLED + i * 28, OVL_GONE + i * 28, D).of(time),
      (t) => swing({ angle: 45, swings: 1 }, reversed(t)),
    ),
  ]);
}

function settleLetter(i: number, ms: number, time: Time): Pose2d {
  const box = geo.stl[i] ?? { x: DX, y: DY1, w: 80 };
  const dx = DX - box.x;
  const dy = DY1 - box.y;
  const b0 = stlIn(i);
  const out = stlOut(i);
  if (ms > out + 520) return hidden;
  return combine([
    springSettle(
      { dx, dy, lift: 70, turn: STL_TURN[i] ?? 0, scale: 0.15, rings: 2, damping: 4.5 },
      span(b0, b0 + 1250, D).of(time),
    ),
    fade({}, span(b0, b0 + 60, D).of(time)),
    anticipate({ share: 0.35, amount: 0.15 }, span(out, out + 520, D).of(time), (t) =>
      springSettle(
        { dx, dy, turn: (STL_TURN[i] ?? 0) * 0.5, scale: 0.05, rings: 0, damping: 3 },
        reversed(t),
      ),
    ),
  ]);
}

function underline(time: Time, ms: number) {
  return ms < COLL - 100
    ? trace({}, span(UNDERLINE, UNDERLINE + 500, D).of(time, ease.cubicOut))
    : erased(span(COLL - 100, COLL + 200, D).of(time, ease.cubicIn));
}

/** `time` run backwards, for a reveal or a stroke: `reversed` answers a pose, so it cannot take them back. */
const backwards = (time: Time): Time => ({ ...time, progress: 1 - time.progress });

function erased(time: Time) {
  return trace({}, backwards(time));
}

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time, events: Events = NO_EVENTS) => {
  const ms = elapsedOf(time.clock) ?? 0;
  const leapShare = leap.of(time).progress;
  const arcTail =
    ms < PERIOD
      ? arcLength(Math.max(0, leapShare - 0.32))
      : mix(arcLength(0.68), 1, ease.cubicOut(share(ms, PERIOD, PERIOD + 350)));
  const ul = underline(time, ms);
  const ink = share(ms, WIPE + 150, WIPE + 300);
  return {
    camera: camera(time),
    dot: dot(ms, time, events),
    ringLaunch: shock(ms, time, DX, DY0 + R, LAUNCH, 600, 2.2),
    ringLand: shock(ms, time, DX, DY1 + R, LAND, 550, 1.6),
    ringBurst: shock(ms, time, DX, DY1, BURST, 700, 4.2),
    ringPeriod: shock(ms, time, geo.px, geo.py + 6, PERIOD, 500, 0.8),
    trailUp: {
      drawn: trace(
        {},
        span(LAUNCH, 1250, D).of(time, (p) => Math.min(1, ((1 - (1 - p) ** 2) * 620) / 540)),
      ).drawn,
      tail: ease.cubicInOut(share(ms, 950, 1450)),
    },
    trailArc: { drawn: trace({}, leap.of(time, arcLength)).drawn, tail: ms < LEAP ? 0 : arcTail },
    ant: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => anticipateLetter(i, time)),
    wgt: [0, 1, 2, 3, 4, 5].map((i) => weightLetter(i, time)),
    floor: combine([
      ...[0, 1, 2, 3, 4, 5].map((i) =>
        nod({ distance: 2 + i }, span(wgtLand(i), wgtLand(i) + 170, D).of(time)),
      ),
      {
        y: -14 * ease.cubicInOut(share(ms, WGT_LIFT, WGT_DROP)),
        opacity: ms >= 3350 && ms < 6000 ? 1 : 0,
      },
    ]),
    floorLeft: floorHalf("right", time),
    floorRight: floorHalf("left", time),
    dust: Array.from({ length: 18 }, (_, j) => dust(j, ms, time)),
    overlap: combine([
      slide({ distance: 1250, from: "left" }, span(OVL_IN, 7150, D).of(time, ease.sineIn)),
      anticipate(
        { share: 250 / 750, amount: 55 / 1450 },
        span(OVL_SETTLED, OVL_GONE, D).of(time),
        (t) => slide({ distance: 1450, from: "right" }, reversed(t)),
      ),
      { opacity: ms >= OVL_IN && ms < OVL_GONE + 100 ? 1 : 0 },
    ]),
    hangers: [0, 1, 2, 3, 4, 5, 6].map((i) => hanger(i, time)),
    stl: [0, 1, 2, 3, 4, 5].map((i) => settleLetter(i, ms, time)),
    underline: ul,
    wipe:
      ms < SHRINK
        ? wipe({ radius: 800, x: 800, y: 800 }, span(WIPE, WIPE + 600, D).of(time, ease.quartOut))
        : wipe(
            { radius: 800, x: 800, y: 800 },
            backwards(span(SHRINK, MATCH, D).of(time, ease.cubicIn)),
          ),
    fin: [0, 1, 2].map((i) => {
      const t = lane(finIn.of(time), i, FIN_LANES);
      return combine([
        overshoot({ amount: 0.12 }, t, (u) => rise({ distance: 115 }, u)),
        { rotation: mix(5, 0, ease.cubicOut(t.progress)) },
        jolt(
          { distance: 6, count: 2, sideways: 0 },
          span(PERIOD + (2 - i) * 45, PERIOD + (2 - i) * 45 + 500, D).of(time),
        ),
      ]);
    }),
    credit: combine([
      rise({ distance: 14 }, span(CREDIT, CREDIT + 600, D).of(time)),
      fade({}, span(CREDIT, CREDIT + 600, D).of(time)),
    ]),
    paint: {
      antCharge: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) =>
        ease.cubicInOut(share(ms, ANT_CROUCH + i * 35, ANT_CROUCH + i * 35 + 420)),
      ),
      antBlur: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) =>
        Math.max(0, Math.min(5, (ms - ANT_LEAP - i * 38) / 60)),
      ),
      wgtBlur: [0, 1, 2, 3, 4, 5].map((i) => {
        const fallShare = share(ms, wgtLand(i) - 420, wgtLand(i));
        const plunge = ms - (WGT_DROP + Math.abs(i - 2.5) * 30);
        return plunge > 0 ? Math.min(4, plunge / 80) : fallShare < 1 ? 3 * fallShare : 0;
      }),
      stlBlur: [0, 1, 2, 3, 4, 5].map((i) => {
        const burst = ms - stlIn(i);
        const out = share(ms, stlOut(i), stlOut(i) + 520);
        return out > 0 ? 3 * out ** 3 : burst >= 0 ? 4 * (1 - share(burst, 0, 220)) : 0;
      }),
      floorCoral: 1 - share(ms, wgtLand(5), wgtLand(5) + 700),
      ink,
      dotInk: ms >= WIPE && ms < MATCH ? share(ms, WIPE, WIPE + 70) : 0,
      hudOpacity: 0.55 * share(ms, 200, 600) * (1 - share(ms, 12600, 13000)),
      beat: BEAT_STARTS.filter((start) => ms >= start).length - 1,
      ms,
    },
  };
};

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
