import { clockDriver } from "@gerak/dom";
import {
  NO_EVENTS,
  anticipate,
  arc,
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
  pop,
  pulse,
  reversed,
  rise,
  sequence,
  slide,
  smear,
  span,
  squashed,
  timeAt,
  trail,
  velocity,
  wipe,
  wobble,
  type Events,
  type Pose2d,
  type Time,
  smudge,
} from "@gerak/moves";
import { ballistic } from "./moves/ballistic";
import { bump } from "./moves/bump";
import { jolt } from "./moves/jolt";
import { kick } from "./moves/kick";
import { launch } from "./moves/launch";
import { shockwave } from "./moves/shockwave";
import { spread } from "./moves/spread";
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { streak } from "./moves/streak";
import { tint } from "./moves/tint";

/** How long the scene runs, in ms; `motion:sample` and `motion:timeline` read it. */
export const durationMs = 15000;

const DX = 640;
const DY0 = 400;
const DY1 = 380;
const R = 18;
const END = durationMs;

/** Where the page put the full stop and the SETTLE letters; the component measures them after layout. */
export const layout: { px: number; py: number; settle: { x: number; y: number }[] } = {
  px: 930,
  py: 372,
  settle: [0, 1, 2, 3, 4, 5].map((i) => ({ x: 420 + i * 88, y: 296 })),
};

/** Shown from `ms` on, hidden before. */
const shownFrom = (time: Time, ms: number): Pose2d => fade({}, span(ms - 16, ms).of(time));
/** Hidden from `ms` on, shown before. */
const hiddenFrom = (time: Time, ms: number): Pose2d =>
  fade({}, reversed(span(ms, ms + 16).of(time)));

const BEATS = [
  { at: 0, label: "00 — ORIGIN" },
  { at: 1000, label: "01 — ANTICIPATION" },
  { at: 3460, label: "02 — WEIGHT" },
  { at: 6150, label: "03 — OVERLAP" },
  { at: 9450, label: "04 — SETTLE" },
] as const;
export const BEAT_LABELS = BEATS.map(({ label }) => label);

const WGT_LIFT = 5550;
const WGT_DROP = 5750;
const wgtLand = (i: number) => 3880 + i * 165 + (i === 5 ? 90 : 0);
const LANDINGS = [0, 1, 2, 3, 4, 5].map(wgtLand);
const LAST_LANDING = wgtLand(5);

const LAND = 9850;
const BURST = 10230;
const WIPE = 11550;
const COLLAPSE = 12300;
const MATCH = 13050;
const LEAP = 13250;
const PERIOD = 13900;
const stlIn = (i: number) => BURST + (Math.abs(i - 2.5) - 0.5) * 55;
const stlOut = (i: number) => COLLAPSE + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;
const STL_TURN = [-48, 30, -16, 18, -30, 50];

const cameraScale = keyframes(
  1.12,
  [
    { at: 500, to: 1.12 },
    { at: 1400, to: 1, ease: ease.cubicOut },
    { at: 2900, to: 1.04, ease: ease.cubicInOut },
    { at: 3500, to: 1, ease: ease.cubicOut },
    { at: MATCH, to: 1 },
    { at: END, to: 1.045, ease: ease.cubicOut },
  ],
  mix,
);

function camera(time: Time): Pose2d {
  return combine([
    { scale: cameraScale(time) },
    bump({ dy: 50 }, span(2900, 3700).of(time)),
    ...LANDINGS.map((land, i) =>
      jolt({ distance: 3 + i * i * 0.6, count: 6 }, span(land, land + 600).of(time)),
    ),
    bump({ dy: -40 }, span(WGT_DROP, 6450).of(time)),
    bump({ turn: 0.9 }, span(6150, 7700).of(time)),
    jolt({ distance: 6, count: 5, sideways: 0 }, span(LAND, LAND + 600).of(time)),
    jolt({ distance: 3, count: 5, sideways: 0 }, span(PERIOD, PERIOD + 500).of(time)),
  ]);
}

const LOW: Pose2d = { y: DY1 - DY0, anchor: "bottom" };

function flight(time: Time): Pose2d {
  const { px, py } = layout;
  return combine([
    { x: px - DX, y: py - DY0, anchor: "center" },
    ballistic({ dx: DX - px, dy: DY1 - py, apex: 430 }, span(LEAP, PERIOD).of(time)),
  ]);
}

function dot(time: Time, events: Events): Pose2d {
  const { px, py } = layout;
  return sequence(time, [
    [span(0, 450), (t) => springSettle({ scale: 0, rings: 1, damping: 2.5 }, t)],
    [
      span(450, 1250),
      (t) => launch({ height: 620, squash: 0.42, bulge: 0.8, stretch: 0.9, crouch: 0.5 }, t),
    ],
    [
      span(9450, BURST),
      (t) =>
        combine([
          LOW,
          drop({ distance: 440, squash: 0.4 }, span(0, 400 / 0.75).of(t)),
          hop({ height: 42, bounces: 0, squash: 0.2 }, span(400, 700).of(t)),
          squashed(0.38, span(700, 780).of(t, ease.cubicOut).progress),
        ]),
    ],
    [
      span(BURST, 11400),
      (t) =>
        combine([
          LOW,
          springSettle({ squash: 0.38, rings: 2.5, damping: 3.5 }, span(0, 900).of(t)),
          pulse({ amount: 0.45 }, span(0, 220).of(t)),
        ]),
    ],
    [span(11400, WIPE), (t) => combine([LOW, { scale: mix(1, 0.7, ease.cubicInOut(t.progress)) }])],
    [
      span(WIPE, MATCH),
      (t) =>
        combine([
          LOW,
          springSettle({ scale: 0.7, rings: 1.5, damping: 4 }, span(0, 600).of(t)),
          tint({ name: "inked" }, span(0, 70).of(t)),
          ...[0, 1, 2, 3, 4, 5].map((i) => {
            const arrive = stlOut(i) + 520 - WIPE;
            return pulse({ amount: 0.2 }, span(arrive, arrive + 260).of(t));
          }),
        ]),
    ],
    [span(MATCH, LEAP), (t) => combine([LOW, squashed(0.4, ease.cubicInOut(t.progress))])],
    [
      span(LEAP, PERIOD),
      () => {
        const p = span(LEAP, PERIOD).of(time).progress;
        return combine([
          flight(time),
          smear(velocity(flight, time, events), { stretch: 0.25, max: 1.6 }).pose,
          { scale: mix(1, 0.64, ease.cubicInOut(p)) },
        ]);
      },
    ],
    [
      span(PERIOD, END),
      (t) =>
        combine([
          { x: px - DX, y: py - DY0 - R * 0.36, scale: 0.64, anchor: "bottom" },
          squish({ squash: 0.42, wobbles: 1 }, span(0, 240).of(t)),
          hop({ height: 16, bounces: 0, squash: 0.3 }, span(0, 330).of(t)),
        ]),
    ],
  ]);
}

function ring(time: Time, x: number, y: number, fromMs: number, ms: number, grow: number) {
  return combine([
    { x, y, scale: 0.2 },
    shownFrom(time, fromMs),
    shockwave({ grow: grow / 0.2 }, span(fromMs, fromMs + ms).of(time)),
  ]);
}

const RISE = lanes([1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 45 / 520);

function anticipateLetter(time: Time, i: number): Pose2d {
  const crouch = 2250 + i * 35;
  const leap = 2900 + i * 38;
  return combine([
    springSettle(
      { dy: 120, turn: 9, rings: 0.7, damping: 3 },
      lane(span(1000, 1925).of(time), i, RISE),
    ),
    launch(
      {
        height: 1300,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (leap - crouch) / (leap + 650 - crouch),
        tremble: 1.6,
        flight: "accelerate",
      },
      span(crouch, leap + 650).of(time),
    ),
    tint({ name: "charge", curve: "inOut" }, span(crouch, crouch + 420).of(time)),
    smudge({ amount: 5, build: 0.46 }, span(leap, leap + 650).of(time)),
  ]);
}

const PLUNGE = 0.004 * 520 * 520;

function weightLetter(time: Time, i: number): Pose2d {
  const land = wgtLand(i);
  const plunge = WGT_DROP + Math.abs(i - 2.5) * 30;
  return combine([
    drop({ distance: 640 }, span(land - 420, land - 420 + 560).of(time)),
    squish({ squash: 0.24, bulge: 0.66, wobbles: 2.5 }, span(land, land + 700).of(time)),
    wobble({ angle: 2.5, count: 2 }, span(land, land + 800).of(time)),
    sequence(time, [
      [span(land - 420, land), (t) => smudge({ amount: 3 }, t)],
      [span(land, END), (): Pose2d => ({})],
    ]),
    anticipate(
      { share: (plunge - WGT_LIFT) / (plunge + 520 - WGT_LIFT), amount: 14 / PLUNGE },
      span(WGT_LIFT, plunge + 520).of(time),
      (t) => rise({ distance: PLUNGE }, reversed(t)),
    ),
    smudge({ amount: 4, build: 0.6 }, span(plunge, plunge + 520).of(time)),
    hiddenFrom(time, plunge + 520),
  ]);
}

function floor(time: Time): Pose2d {
  return combine([
    sequence(time, [
      [span(3350, 3800), (t) => spread({}, span(0, 450).of(t, ease.cubicOut))],
      [span(WGT_DROP, 6000), (t) => spread({}, reversed(span(0, 250).of(t, ease.cubicIn)))],
    ]),
    shownFrom(time, 3350),
    hiddenFrom(time, 6000),
    ...LANDINGS.map((land, i) =>
      jolt({ distance: 2 + i, count: 3, sideways: 0 }, span(land, land + 450).of(time)),
    ),
    { y: -14 * span(WGT_LIFT, WGT_DROP).of(time, ease.cubicInOut).progress },
    tint({ name: "cool" }, span(LAST_LANDING, LAST_LANDING + 700).of(time)),
  ]);
}

/** Which side of its letter each dust speck sits on and flies to. */
export const DUST_SIDES = Array.from({ length: 18 }, (_, j) => {
  const kind = j % 3;
  const letter = Math.floor(j / 3);
  return kind === 0 || (kind === 2 && letter % 2 === 0) ? "left" : "right";
});

function dust(time: Time, j: number): Pose2d {
  const letter = Math.floor(j / 3);
  const kind = j % 3;
  const side = DUST_SIDES[j] === "left" ? -1 : 1;
  const land = wgtLand(letter);
  return combine([
    shownFrom(time, land),
    { scale: (0.6 + 0.3 * kind) * (letter === 5 ? 1.5 : 1) },
    kick(
      { dx: side * (40 + kind * 28), rise: 10 + 22 * kind, fall: kind === 2 ? 30 : 9 },
      span(land, land + 700).of(time),
    ),
  ]);
}

const OVL_LENGTHS = [140, 185, 160, 200, 170, 210, 180];
export const STRING_LENGTHS = OVL_LENGTHS;

function bar(time: Time): Pose2d {
  return sequence(time, [
    [
      span(6150, 7150),
      (t) => slide({ distance: 1250, from: "left" }, span(0, 1000).of(t, ease.quadIn)),
    ],
    [
      span(8700, 9450),
      (t) =>
        anticipate({ share: 1 / 3, amount: 55 / 1450 }, t, (u) =>
          slide({ distance: 1450, from: "right" }, reversed(u)),
        ),
    ],
  ]);
}

const barAt = (time: Time, lagMs: number) =>
  bar(timeAt(time, (elapsedOf(time.clock) ?? 0) - lagMs)).x ?? 0;

const BOBS = OVL_LENGTHS.map((length, i) => {
  const w = 2 * Math.PI * 1.25 * Math.sqrt(160 / length);
  return trail((t) => barAt(t, i * 28), { stiffness: w * w, damping: 2 * 0.18 * w, rest: 0.1 });
});

function hanging(time: Time, events: Events, i: number): Pose2d {
  const length = (OVL_LENGTHS[i] ?? 160) + 50;
  const bob = BOBS[i]?.(time, events) ?? 0;
  const swing = Math.atan2(barAt(time, i * 28) - bob, length);
  return { rotation: (swing * 180) / Math.PI, anchor: "top" };
}

function settleLetter(time: Time, i: number): Pose2d {
  const at = layout.settle[i] ?? { x: DX, y: DY1 };
  const dx = DX - at.x;
  const dy = DY1 - at.y;
  const turn = STL_TURN[i] ?? 0;
  const out = stlOut(i);
  return combine([
    sequence(time, [
      [
        span(stlIn(i), stlIn(i) + 1600),
        (t) =>
          combine([
            springSettle({ dx, dy, lift: 70, turn, scale: 0.15, rings: 2, damping: 3.5 }, t),
            fade({}, span(0, 60).of(t)),
            smudge({ amount: 4 }, reversed(span(0, 220).of(t))),
          ]),
      ],
      [
        span(out, out + 520),
        (t) =>
          combine([
            anticipate({ share: 0.3, amount: 0.12 }, t, (u) =>
              combine([arc({ dx, dy }, reversed(u)), pop({ overshoot: 0.05 }, reversed(u))]),
            ),
            { rotation: turn * 0.5 * ease.cubicIn(t.progress) },
            smudge({ amount: 3 }, span(160, 520).of(t)),
            fade({}, reversed(span(440, 520).of(t))),
          ]),
      ],
    ]),
    tint({ name: "inked" }, span(WIPE + 150, WIPE + 300).of(time)),
  ]);
}

function underline(time: Time): Pose2d {
  return combine([
    sequence(time, [
      [span(10800, 11300), (t) => spread({}, span(0, 500).of(t, ease.cubicOut))],
      [
        span(COLLAPSE - 100, COLLAPSE + 200),
        (t) => spread({}, reversed(span(0, 300).of(t, ease.cubicIn))),
      ],
    ]),
    shownFrom(time, 10800),
    hiddenFrom(time, COLLAPSE + 200),
    tint({ name: "inked" }, span(WIPE + 150, WIPE + 300).of(time)),
  ]);
}

const COVER = { radius: 1500, x: DX, y: DY1 };

function cover(time: Time): Pose2d {
  return sequence(time, [
    [span(WIPE, WIPE + 600), (t) => wipe(COVER, span(0, 600).of(t, ease.cubicOut))],
    [span(12700, MATCH), (t) => wipe(COVER, reversed(t))],
  ]);
}

function finaleWord(time: Time, i: number): Pose2d {
  const start = MATCH + i * 110;
  const ripple = PERIOD + (2 - i) * 45;
  return combine([
    shownFrom(time, start),
    springSettle({ dy: 120, turn: 5, rings: 0.7, damping: 3 }, span(start, start + 650).of(time)),
    jolt({ distance: 6, count: 2, sideways: 0 }, span(ripple, ripple + 600).of(time)),
  ]);
}

/** Every target's value at `time`; `motion:sample` and `motion:timeline` read it. */
export const scene = (time: Time, events: Events = NO_EVENTS) => ({
  camera: camera(time),
  dot: dot(time, events),
  cover: cover(time),
  ringLaunch: ring(time, DX, DY0 + R, 850, 600, 2.2),
  ringLand: ring(time, DX, DY1 + R, LAND, 550, 1.6),
  ringBurst: ring(time, DX, DY1, BURST, 700, 4.2),
  ringPeriod: ring(time, layout.px, layout.py + 6, PERIOD, 500, 0.8),
  trailUp: combine([
    shownFrom(time, 850),
    hiddenFrom(time, 1450),
    streak({ arrive: 0.675, lag: 0.31 }, span(850, 1450).of(time, ease.quadOut)),
  ]),
  trailArc: combine([
    shownFrom(time, LEAP),
    hiddenFrom(time, PERIOD + 350),
    streak({ arrive: 0.65, lag: 0.21 }, span(LEAP, PERIOD + 350).of(time)),
  ]),
  anticipate: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => anticipateLetter(time, i)),
  weight: [0, 1, 2, 3, 4, 5].map((i) => weightLetter(time, i)),
  floor: floor(time),
  dust: Array.from({ length: 18 }, (_, j) => dust(time, j)),
  bar: bar(time),
  hanging: OVL_LENGTHS.map((_, i) => hanging(time, events, i)),
  settle: [0, 1, 2, 3, 4, 5].map((i) => settleLetter(time, i)),
  underline: underline(time),
  finale: [0, 1, 2].map((i) => finaleWord(time, i)),
  credit: combine([
    rise({ distance: 14 }, span(14250, 14850).of(time)),
    fade({}, span(14250, 14850).of(time)),
  ]),
  hud: combine([
    { opacity: 0.55 },
    fade({}, span(200, 600).of(time)),
    fade({}, reversed(span(12600, 13000).of(time))),
  ]),
  labels: BEATS.map(({ at }, k) => {
    const next = BEATS[k + 1]?.at ?? END + 1;
    return combine([k === 0 ? {} : shownFrom(time, at), hiddenFrom(time, next)]);
  }),
  timecode: { custom: { ms: elapsedOf(time.clock) ?? 0 } } satisfies Pose2d,
});

/** The scene's clock on the page's frames. */
export const clock = () => clockDriver({ duration: durationMs });
