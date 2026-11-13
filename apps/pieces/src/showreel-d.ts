import {
  anticipate,
  combine,
  drop,
  ease,
  elapsedOf,
  fade,
  nod,
  pulse,
  reversed,
  rise,
  sequence,
  slide,
  smear,
  span,
  squashed,
  toCubics,
  velocity,
  wipe,
  wobble,
  type Anchor2d,
  type Cubic2d,
  type Events,
  type Pose2d,
  type Time,
} from "@gerak/moves";
import {
  actor,
  frame as stageFrame,
  group,
  letters,
  many,
  restOf,
  story,
  words,
  type Rest,
} from "@gerak/stage";
import { ballistic } from "./moves/ballistic";
import { bump } from "./moves/bump";
import { crouch } from "./moves/crouch";
import { dangle } from "./moves/dangle";
import { jolt } from "./moves/jolt";
import { kick } from "./moves/kick";
import { launch } from "./moves/launch";
import { push } from "./moves/push";
import { shockwave } from "./moves/shockwave";
import { smudge } from "./moves/smudge";
import { spread } from "./moves/spread";
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { streak } from "./moves/streak";
import { tint } from "./moves/tint";

/** The reel's beats, one per line of its timeline, with the chapters the corner label names. */
export const beats = story(15000, {
  origin: [0, 1000],
  anticipation: [1000, 3460],
  weight: [3460, 6150],
  overlap: [6150, 9450],
  settle: [9450, 15000],
  appear: [0, 450],
  crouch: [450, 850],
  launch: [850, 1250],
  antIn: [1000, 1700],
  tension: [1400, 2900],
  antCrouch: [2250, 2900],
  antLeap: [2900, 3550],
  floor: [3350, 6000],
  weightFall: [3460, 4795],
  thud0: [3880, 4580],
  thud1: [4045, 4745],
  thud2: [4210, 4910],
  thud3: [4375, 5075],
  thud4: [4540, 5240],
  thud5: [4795, 5495],
  weightExit: [5550, 6260],
  overlapIn: [6150, 7150],
  overlapSettle: [7150, 8700],
  overlapWhip: [8700, 9450],
  dotReturn: [9450, 10230],
  settleBurst: [10230, 11450],
  underline: [10800, 11300],
  wipe: [11400, 11800],
  collapse: [12200, 12920],
  matchCut: [12700, 13050],
  leap: [13050, 13920],
  period: [13900, 14400],
  push: [13050, 15000],
  credit: [14250, 14850],
  hud: [0, 13000],
});

export const frame = stageFrame({ width: 1280, height: 720 });

const DOT = { x: 640, y: 380 };
const LAUNCH_Y = 400;
const CORAL = "#ff5b3a";

const LANDS = [3880, 4045, 4210, 4375, 4540, 4795];
const HANG = [140, 185, 160, 200, 170, 210, 180];
const BURST_TURN = [-48, 30, -16, 18, -30, 50];
const DUST_SIDE = [-1, 1, 0] as const;

/** Where the full stop lands and how wide SETTLE spreads on the machine this was laid out on; the
 * scene stretches both strokes from these to the measured ones. */
const STOP_AT = { x: 946.5, y: 351 };
const UNDERLINE_HALF = 290;

const point = (
  id: string,
  x: number,
  y: number,
  out = { x: 0, y: 0 },
  inn = { x: 0, y: 0 },
): Anchor2d => ({
  id,
  x,
  y,
  inX: inn.x,
  inY: inn.y,
  outX: out.x,
  outY: out.y,
});

const quad = (
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
): readonly Cubic2d[] =>
  toCubics([
    point("from", a.x, a.y, { x: (2 / 3) * (c.x - a.x), y: (2 / 3) * (c.y - a.y) }),
    point("to", b.x, b.y, undefined, { x: (2 / 3) * (c.x - b.x), y: (2 / 3) * (c.y - b.y) }),
  ]);

const TRAIL_UP = toCubics([point("ground", DOT.x, LAUNCH_Y), point("sky", DOT.x, -140)]);
const ARC = quad(DOT, { x: (DOT.x + STOP_AT.x) / 2, y: Math.min(DOT.y, STOP_AT.y) - 430 }, STOP_AT);
const FLOOR = toCubics([point("left", 300, 490.5), point("right", 980, 490.5)]);
const UNDERLINE = toCubics([
  point("left", DOT.x - UNDERLINE_HALF, DOT.y - 7, { x: (2 * UNDERLINE_HALF) / 3, y: 9.33 }),
  point("right", DOT.x + UNDERLINE_HALF, DOT.y - 7, undefined, {
    x: (-2 * UNDERLINE_HALF) / 3,
    y: 9.33,
  }),
]);

const boxCss = (name: string, cubics: readonly Cubic2d[]): string => {
  const xs = cubics.flatMap((c) => [c.x0, c.x1, c.x2, c.x3]);
  const ys = cubics.flatMap((c) => [c.y0, c.y1, c.y2, c.y3]);
  const low = (values: readonly number[]) => Math.min(...values);
  const thin = (values: readonly number[]) => Math.max(...values) - low(values) === 0;
  const left = low(xs) - (thin(xs) ? 0.5 : 0);
  const top = low(ys) - (thin(ys) ? 0.5 : 0);
  return `[data-cast="${name}"] { left: ${left}px; top: ${top}px; }`;
};

/** Who is on stage: a camera holding every word and the dot, a vignette, and the reel's corner readout. */
export const cast = {
  camera: group({
    flood: actor({ on: [["wipe", "matchCut"]] }),
    trailUp: actor({ path: TRAIL_UP, on: [["launch", "antIn"]] }),
    trailArc: actor({ path: ARC, on: [["leap", "push"]] }),
    underline: actor({ path: UNDERLINE, on: [["underline", "collapse"]] }),
    ant: letters("ANTICIPATE", { on: [["antIn", "antLeap"]] }),
    floor: actor({ path: FLOOR, on: [["floor", "floor"]] }),
    weight: letters("WEIGHT", { on: [["weightFall", "weightExit"]] }),
    dust0: many(3, { on: [["thud0", "thud0"]] }),
    dust1: many(3, { on: [["thud1", "thud1"]] }),
    dust2: many(3, { on: [["thud2", "thud2"]] }),
    dust3: many(3, { on: [["thud3", "thud3"]] }),
    dust4: many(3, { on: [["thud4", "thud4"]] }),
    dust5: many(3, { on: [["thud5", "thud5"]] }),
    rig: group(
      { bar: actor({ still: true }), hang: letters("OVERLAP") },
      { on: [["overlapIn", "overlapWhip"]] },
    ),
    settleWord: letters("SETTLE", { on: [["settleBurst", "collapse"]] }),
    line: group(
      { phrase: words("Timing is everything"), stop: actor({ still: true }) },
      { on: [["leap", "push"]] },
    ),
    credit: group(
      {
        maker: actor({ text: "CLAUDE ", still: true }),
        dotA: actor({ text: "·", still: true }),
        craft: actor({ text: " MOTION DESIGN ", still: true }),
        dotB: actor({ text: "·", still: true }),
        year: actor({ text: " REEL 2026", still: true }),
      },
      { on: [["credit", "push"]] },
    ),
    ringLaunch: actor({ on: [["launch", "antIn"]] }),
    ringLand: actor({ on: [["dotReturn", "settleBurst"]] }),
    ringBurst: actor({ on: [["settleBurst", "settleBurst"]] }),
    ringPeriod: actor({ on: [["period", "push"]] }),
    dot: actor({
      on: [
        ["appear", "launch"],
        ["dotReturn", "push"],
      ],
    }),
  }),
  vignette: actor({ still: true }),
  hud: group(
    {
      chapter: group({
        label0: actor({ text: "00 — ORIGIN", still: true, on: [["origin", "origin"]] }),
        label1: actor({
          text: "01 — ANTICIPATION",
          still: true,
          on: [["anticipation", "anticipation"]],
        }),
        label2: actor({ text: "02 — WEIGHT", still: true, on: [["weight", "weight"]] }),
        label3: actor({ text: "03 — OVERLAP", still: true, on: [["overlap", "overlap"]] }),
        label4: actor({ text: "04 — SETTLE", still: true, on: [["settle", "settle"]] }),
      }),
      timecode: group({
        minutes: actor({ text: "00:", still: true }),
        secTensBox: group({ secTens: actor({ text: "0\n1" }) }),
        secOnesBox: group({ secOnes: actor({ text: "0\n1\n2\n3\n4\n5\n6\n7\n8\n9" }) }),
        colon: actor({ text: ":", still: true }),
        frameTensBox: group({ frameTens: actor({ text: "0\n1\n2" }) }),
        frameOnesBox: group({ frameOnes: actor({ text: "0\n1\n2\n3\n4\n5\n6\n7\n8\n9" }) }),
      }),
    },
    { on: [["hud", "hud"]] },
  ),
};

const PAPER = "#f3efe6";
const INK = "#101114";
const MUTE = "#7d8290";
const between = (a: string, b: string, share: string) =>
  `color-mix(in srgb, ${b} calc(${share} * 100%), ${a})`;

/** The reel's look: ink stage, paper type in Arial Black, a coral dot, Georgia for the last line. */
export const skins = {
  dom: {
    css: `
[data-stage="frame"] { display: block; background: ${INK}; color: ${PAPER};
  font-family: "Arial Black", "Arial Bold", Gadget, Arial, sans-serif; font-weight: 900; }
[data-cast="camera"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="camera"] > [data-cast] { position: absolute; }
[data-cast="flood"] { left: 0; top: 0; width: 1280px; height: 720px; background: ${CORAL}; }
[data-stroke] > svg { overflow: visible; }
[data-path] { fill: none; stroke-linecap: round; }
${boxCss("trailUp", TRAIL_UP)}
[data-path="trailUp"] { stroke: ${CORAL}; stroke-width: 3; }
${boxCss("trailArc", ARC)}
[data-path="trailArc"] { stroke: ${CORAL}; stroke-width: 2.5; opacity: 0.7; }
${boxCss("underline", UNDERLINE)}
[data-path="underline"] { stroke: ${between(PAPER, INK, "var(--ink, 0)")}; stroke-width: 7; }
[data-cast="underline"] { --ink: 0; }
${boxCss("floor", FLOOR)}
[data-cast="floor"] { color: ${between(CORAL, PAPER, "var(--cool, 0)")}; }
[data-path="floor"] { stroke: currentColor; stroke-width: 5; }
[data-cast="ant"], [data-cast="weight"], [data-cast="settleWord"] {
  left: 0; width: 1280px; display: flex; flex-wrap: nowrap; justify-content: center; gap: 0;
  align-items: flex-start; line-height: 1; }
[data-cast="ant"] { top: 312px; height: 100px; font-size: 100px; letter-spacing: 0.01em;
  clip-path: inset(-900px -200px 0 -200px); }
[data-cast^="ant."] { color: ${between(PAPER, CORAL, "var(--charge, 0)")}; }
[data-cast="weight"] { top: 326px; font-size: 180px; }
[data-cast^="weight."] { margin: 0 0.01em; }
[data-cast^="dust"] { left: 0; top: 0; width: 0; height: 0; }
[data-cast^="dust"] > [data-cast] { position: absolute; left: -5px; top: -5px; width: 10px; height: 10px;
  border-radius: 50%; background: ${PAPER}; }
[data-cast="rig"] { left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="bar"] { position: absolute; left: 250px; top: 150px; width: 780px; height: 6px; border-radius: 3px;
  background: ${CORAL}; }
[data-cast="hang"] { position: absolute; left: 0; top: 155px; width: 1280px; display: flex; flex-wrap: nowrap;
  justify-content: center; align-items: flex-start; gap: 6px; }
[data-cast^="hang."] { font-size: 110px; line-height: 0.92; display: flex; flex-direction: column;
  align-items: center; }
[data-cast^="hang."]::before { content: ""; display: block; width: 2px; background: rgba(243, 239, 230, 0.45); }
${HANG.map((length, i) => `[data-cast="hang.${i}"]::before { height: ${length}px; }`).join("\n")}
[data-cast="settleWord"] { top: 226px; font-size: 140px; }
[data-cast^="settleWord."] { color: ${between(PAPER, INK, "var(--ink, 0)")}; }
[data-cast="line"] { left: 0; top: 286px; width: 1280px; display: flex; flex-wrap: nowrap; justify-content: center;
  align-items: baseline; gap: 0; font-family: Georgia, "Times New Roman", serif; font-style: italic;
  font-weight: 700; font-size: 84px; }
[data-cast="phrase"] { display: flex; flex-wrap: nowrap; align-items: baseline; gap: 0;
  clip-path: inset(-300px -300px 0 -300px); }
[data-cast^="phrase."] { line-height: 1.15; padding: 0 0.08em 0.12em; margin: 0 0.04em; }
[data-cast="stop"] { width: 0.32em; height: 0; margin-left: -0.06em; }
[data-cast="credit"] { left: 0; top: 438px; width: 1280px; display: flex; flex-wrap: nowrap; justify-content: center;
  gap: 0; font: 700 14px/1 Arial, Helvetica, sans-serif; letter-spacing: 0.42em; color: ${MUTE}; }
[data-cast="dotA"], [data-cast="dotB"] { color: ${CORAL}; }
[data-cast^="ring"] { width: 24px; height: 24px; box-sizing: border-box; border-radius: 50%;
  border: 0.6px solid ${CORAL}; }
[data-cast="ringLaunch"] { left: ${DOT.x - 12}px; top: ${LAUNCH_Y + 18 - 12}px; }
[data-cast="ringLand"] { left: ${DOT.x - 12}px; top: ${DOT.y + 18 - 12}px; }
[data-cast="ringBurst"] { left: ${DOT.x - 12}px; top: ${DOT.y - 12}px; }
[data-cast="ringPeriod"] { left: -12px; top: -12px; }
[data-cast="dot"] { left: ${DOT.x - 18}px; top: ${DOT.y - 18}px; width: 36px; height: 36px; border-radius: 50%;
  background: ${between(CORAL, INK, "var(--ink, 0)")}; }
[data-cast="vignette"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 46%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.42) 100%); }
[data-cast="hud"] { position: absolute; left: 32px; top: ${720 - 26 - 12}px; width: ${1280 - 64}px; height: 12px;
  display: flex; flex-wrap: nowrap; justify-content: space-between; align-items: flex-start; gap: 0;
  font: 12px/1 Consolas, "Courier New", monospace; letter-spacing: 0.18em; color: ${MUTE}; }
[data-cast="chapter"] { display: block; width: 400px; height: 12px; }
[data-cast^="label"] { position: absolute; left: 0; top: 0; }
[data-cast="timecode"] { display: flex; flex-wrap: nowrap; gap: 0; align-items: flex-start; height: 12px; }
[data-cast$="Box"] { display: block; height: 12px; overflow: hidden; }
[data-cast="secTens"], [data-cast="secOnes"], [data-cast="frameTens"], [data-cast="frameOnes"] { line-height: 1; }
`,
  },
};

const LAUNCH = span(450, 1250);
const BAR_IN = span(0, 1000);
const BAR_OUT = span(2550, 3300);
const OVERLAP = span(6150, 9450);
const WIPE_AT = 11550;
const COLLAPSE_AT = 12300;
const PERIOD_AT = 13900;
const LEAP = span(13250, 13900);

const burstAt = (i: number) => 10230 + (Math.abs(i - 2.5) - 0.5) * 55;
const collapseAt = (i: number) => COLLAPSE_AT + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;

/** The bar's sideways travel on the overlap beat's own clock: in from the left, back, then whipped out. */
const barOf = (time: Time): number =>
  combine([
    slide({ distance: 1250, from: "left" }, BAR_IN.of(time, ease.sineIn)),
    anticipate({ share: 1 / 3, amount: 55 / 1450 }, BAR_OUT.of(time), (t) =>
      slide({ distance: 1450, from: "right" }, reversed(t)),
    ),
  ]).x ?? 0;

/** Where the full stop sits, measured from the slot after the last word. */
const stopOf = (rest: Rest) => {
  const slot = restOf(rest, "stop");
  return slot.width === 0 ? STOP_AT : { x: slot.x - slot.width / 2 + 7, y: slot.y - 13 };
};

const camera = (time: Time): Pose2d =>
  combine([
    sequence(time, [
      [span(500, 1400), (t) => push({ to: 1.12, curve: "in" }, reversed(t))],
      [span(1400, 2900), (t) => push({ to: 1.04, curve: "inOut" }, t)],
      [
        span(2900, 3500),
        (t) => combine([{ scale: 1.04 }, push({ to: 1 / 1.04, curve: "out" }, t)]),
      ],
      [span(13050, 15000), (t) => push({ to: 1.045, curve: "out" }, t)],
    ]),
    bump({ dy: 50 }, span(2900, 3700).of(time)),
    ...LANDS.map((land, i) =>
      jolt(
        { distance: (3 + i * i * 0.6) * 1.4, count: 6, sideways: 0.35 },
        span(land, land + 560).of(time),
      ),
    ),
    bump({ dy: -40 }, span(5750, 6450).of(time)),
    bump({ turn: 0.9 }, span(6150, 7700).of(time)),
    jolt({ distance: 7, count: 6, sideways: 0 }, span(9850, 10450).of(time)),
    jolt({ distance: 3.5, count: 5, sideways: 0 }, span(PERIOD_AT, PERIOD_AT + 500).of(time)),
  ]);

const dot = (time: Time, events: Events, rest: Rest): Pose2d => {
  const stop = stopOf(rest);
  const toStop = { x: stop.x - DOT.x, y: stop.y - DOT.y };
  const leapPath = (t: Time): Pose2d =>
    combine([toStop, ballistic({ dx: -toStop.x, dy: -toStop.y, apex: 430 }, LEAP.of(t))]);
  const fallPath = (t: Time): Pose2d =>
    drop({ distance: 440 }, span(9450, 9450 + 400 / 0.75).of(t));
  return sequence(time, [
    [
      span(0, 1250),
      (t) =>
        combine([
          launch(
            { height: 620, squash: 0.42, bulge: 0.8, stretch: 0.9, crouch: 0.5 },
            span(450, 1250).of(t),
          ),
          { y: LAUNCH_Y - DOT.y },
          springSettle({ scale: 0, rings: 1.9, damping: 4.8 }, span(60, 850).of(t)),
        ]),
    ],
    [
      span(1250, 9850),
      () =>
        combine([
          fallPath(time),
          smear(
            velocity((t) => fallPath(t), time, events),
            { stretch: 0.25, max: 1.6 },
          ).pose,
        ]),
    ],
    [
      span(9850, 10150),
      (t) => combine([squish({ squash: 0.48, bulge: 0.8, wobbles: 0 }, t), bump({ dy: -42 }, t)]),
    ],
    [span(10150, 10230), (t) => crouch({ squash: 0.38, bulge: 0.8, curve: "out" }, t)],
    [
      span(10230, 13050),
      (t) =>
        combine([
          { anchor: "bottom" },
          springSettle({ squash: 0.38, rings: 2.8, damping: 5.2 }, span(0, 870).of(t)),
          pulse({ amount: 0.3 }, span(0, 300).of(t)),
          sequence(t, [
            [
              span(WIPE_AT - 150 - 10230, WIPE_AT - 10230),
              (u) => push({ to: 0.7, curve: "inOut" }, u),
            ],
            [
              span(WIPE_AT - 10230, WIPE_AT + 600 - 10230),
              (u) => springSettle({ scale: 0.7, rings: 1.8, damping: 4.2 }, u),
            ],
          ]),
          ...[0, 1, 2, 3, 4, 5].map((i) =>
            pulse(
              { amount: 0.2 },
              span(collapseAt(i) + 520 - 10230, collapseAt(i) + 760 - 10230).of(t),
            ),
          ),
          tint({ name: "ink" }, span(WIPE_AT - 10230, WIPE_AT + 70 - 10230).of(t)),
        ]),
    ],
    [span(13050, 13250), (t) => crouch({ squash: 0.4, bulge: 0.75 }, t)],
    [
      LEAP,
      () =>
        combine([
          leapPath(time),
          smear(
            velocity((t) => leapPath(t), time, events),
            { stretch: 0.3, max: 1.5 },
          ).pose,
          push({ to: 0.64, curve: "inOut" }, LEAP.of(time)),
        ]),
    ],
    [
      span(PERIOD_AT, 15000),
      (t) =>
        combine([
          squish({ squash: 0.42, bulge: 0.7, wobbles: 0 }, span(0, 260).of(t)),
          { ...toStop, y: toStop.y - 18 * 0.36, scale: 0.64 },
          bump({ dy: -16 }, span(0, 240).of(t)),
          squish({ squash: 0.18, bulge: 0.7, wobbles: 0 }, span(240, 480).of(t)),
        ]),
    ],
  ]);
};

const antLetter = (time: Time, i: number): Pose2d => {
  const up = 1000 + i * 45;
  const sink = 2250 + i * 35;
  const leap = 2900 + i * 38;
  const flight = 3550 - leap;
  return combine([
    launch(
      {
        height: 1.1 * flight + 0.0014 * flight * flight,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (leap - sink) / (leap - sink + flight),
        tremble: 1.6,
        flight: "accelerate",
      },
      span(sink, leap + flight).of(time),
    ),
    springSettle({ dy: 120, turn: 9, rings: 1, damping: 5 }, span(up, up + 600).of(time)),
    smudge({ amount: 5 }, span(leap, leap + 300).of(time)),
    tint({ name: "charge", curve: "inOut" }, span(sink, sink + 420).of(time)),
  ]);
};

const weightLetter = (time: Time, i: number): Pose2d => {
  const land = LANDS[i] ?? 0;
  const plunge = 5750 + Math.abs(i - 2.5) * 30;
  const fallen = 0.004 * (6260 - plunge) ** 2;
  return sequence(time, [
    [
      span(land - 420, land + 140),
      (t) =>
        combine([
          drop({ distance: 640 }, t),
          smudge({ amount: 3, build: 0.75 }, t),
          squashed(-0.12, Math.min(1, t.progress / 0.75)),
        ]),
    ],
    [
      span(land, 5550),
      (t) =>
        combine([
          squish({ squash: 0.24, bulge: 0.67, wobbles: 2.8 }, span(0, 700).of(t)),
          wobble({ angle: 1.6, count: 2 }, span(0, 800).of(t)),
        ]),
    ],
    [
      span(5550, 6260),
      (t) =>
        anticipate({ share: (plunge - 5550) / (6260 - 5550), amount: 14 / fallen }, t, (u) =>
          combine([rise({ distance: fallen }, reversed(u)), smudge({ amount: 4, build: 0.6 }, u)]),
        ),
    ],
  ]);
};

const dust = (time: Time, rest: Rest, li: number): readonly Pose2d[] => {
  const letter = restOf(rest, `weight.${li}`);
  const land = LANDS[li] ?? 0;
  return [0, 1, 2].map((kk) => {
    const side = DUST_SIDE[kk] === 0 ? (li % 2 ? 1 : -1) : (DUST_SIDE[kk] ?? 1);
    return combine([
      {
        x: letter.x + side * letter.width * 0.42,
        y: 484,
        scale: (0.6 + 0.3 * kk) * (li === 5 ? 1.5 : 1),
        opacity: 0.75,
      },
      kick(
        { dx: side * (40 + kk * 28), rise: 10 + 22 * kk, fall: kk === 2 ? 30 : 9, shrink: 0.75 },
        span(land, land + 700).of(time),
      ),
    ]);
  });
};

const settleLetter = (time: Time, rest: Rest, i: number): Pose2d => {
  const home = restOf(rest, `settleWord.${i}`);
  const away = { dx: DOT.x - home.x, dy: DOT.y - home.y };
  const turn = BURST_TURN[i] ?? 0;
  const out = collapseAt(i);
  return combine([
    sequence(time, [
      [
        span(burstAt(i), out),
        (t) =>
          combine([
            springSettle(
              { ...away, lift: 70, turn, scale: 0.15, rings: 2.4, damping: 5 },
              span(0, 1400).of(t),
            ),
            smudge({ amount: 4 }, reversed(span(0, 220).of(t))),
          ]),
      ],
      [
        span(out, out + 520),
        (t) =>
          anticipate({ share: 0.3, amount: 0.2 }, t, (u) =>
            combine([
              springSettle(
                { ...away, turn: turn * 0.5, scale: 0.05, rings: 0, damping: 3 },
                reversed(u),
              ),
              smudge({ amount: 3, build: 1 }, u),
            ]),
          ),
      ],
    ]),
    tint({ name: "ink" }, span(WIPE_AT + 150, WIPE_AT + 300).of(time)),
  ]);
};

const digit =
  (count: number) =>
  (value: number): Pose2d => ({ y: -12 * Math.min(count - 1, Math.max(0, value)) });

/** Every member's value at `time`: the camera, the dot's whole run, and each word's beat. */
export const scene = (time: Time, events: Events, rest: Rest) => {
  const ms = Math.min(13000, elapsedOf(time.clock) ?? 0);
  const seconds = Math.floor(ms / 1000);
  const frames = Math.floor(((ms % 1000) * 30) / 1000);
  const overlap = OVERLAP.of(time);
  const stop = stopOf(rest);
  const settleHalf =
    Math.max(
      DOT.x - (restOf(rest, "settleWord.0").x - restOf(rest, "settleWord.0").width / 2),
      restOf(rest, "settleWord.5").x + restOf(rest, "settleWord.5").width / 2 - DOT.x,
    ) - 6;
  return {
    camera: camera(time),
    flood: sequence(time, [
      [
        span(WIPE_AT, WIPE_AT + 400),
        (t) => wipe({ radius: 800, x: DOT.x, y: DOT.y }, span(0, 400).of(t, ease.quadOut)),
      ],
      [span(12700, 13050), (t) => wipe({ radius: 800, x: DOT.x, y: DOT.y }, reversed(t))],
    ]),
    trailUp: streak({ arrive: 0.43, lag: 0.17 }, span(850, 1450).of(time)),
    trailArc: combine([
      { scaleX: (stop.x - DOT.x) / (STOP_AT.x - DOT.x), anchor: "left" },
      streak({ arrive: 0.65, lag: 0.21 }, span(13250, 14250).of(time)),
    ]),
    underline: combine([
      { scaleX: settleHalf / UNDERLINE_HALF },
      sequence(time, [
        [span(10800, 11300), (t) => spread({}, span(0, 500).of(t, ease.cubicOut))],
        [
          span(COLLAPSE_AT - 100, COLLAPSE_AT + 200),
          (t) => spread({}, reversed(span(0, 300).of(t, ease.cubicIn))),
        ],
      ]),
      tint({ name: "ink" }, span(WIPE_AT + 150, WIPE_AT + 300).of(time)),
    ]),
    ant: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => antLetter(time, i)),
    floor: combine([
      sequence(time, [
        [span(3350, 3800), (t) => spread({}, span(0, 450).of(t, ease.cubicOut))],
        [span(5750, 6000), (t) => spread({}, reversed(span(0, 250).of(t, ease.cubicIn)))],
      ]),
      ...LANDS.map((land, i) => nod({ distance: 2 + i }, span(land, land + 170).of(time))),
      tint({ name: "cool" }, span(4795, 5495).of(time)),
    ]),
    weight: [0, 1, 2, 3, 4, 5].map((i) => weightLetter(time, i)),
    dust0: dust(time, rest, 0),
    dust1: dust(time, rest, 1),
    dust2: dust(time, rest, 2),
    dust3: dust(time, rest, 3),
    dust4: dust(time, rest, 4),
    dust5: dust(time, rest, 5),
    rig: { x: barOf(overlap) },
    bar: {},
    hang: HANG.map((length, i) =>
      dangle({ length: length + 50, damping: 0.18, gain: 6, lag: i * 28, limit: 63 }, overlap, {
        carrier: barOf,
      }),
    ),
    settleWord: [0, 1, 2, 3, 4, 5].map((i) => settleLetter(time, rest, i)),
    line: {},
    phrase: [0, 1, 2].map((i) =>
      combine([
        springSettle(
          { dy: 126, turn: 5, rings: 1, damping: 5 },
          span(13050 + i * 110, 13050 + i * 110 + 650).of(time),
        ),
        jolt(
          { distance: 7, count: 2, sideways: 0 },
          span(PERIOD_AT + (2 - i) * 45, PERIOD_AT + (2 - i) * 45 + 700).of(time),
        ),
      ]),
    ),
    stop: {},
    credit: combine([
      rise({ distance: 14 }, span(14250, 14850).of(time)),
      fade({}, span(14250, 14850).of(time, ease.quadOut)),
    ]),
    maker: {},
    dotA: {},
    craft: {},
    dotB: {},
    year: {},
    ringLaunch: combine([{ opacity: 0.9 }, shockwave({ grow: 11 }, span(850, 1450).of(time))]),
    ringLand: combine([{ opacity: 0.8 }, shockwave({ grow: 8 }, span(9850, 10400).of(time))]),
    ringBurst: combine([{ opacity: 0.9 }, shockwave({ grow: 21 }, span(10230, 10930).of(time))]),
    ringPeriod: combine([
      { x: stop.x, y: stop.y + 6, opacity: 0.7 },
      shockwave({ grow: 4 }, span(PERIOD_AT, PERIOD_AT + 500).of(time)),
    ]),
    dot: dot(time, events, rest),
    vignette: {},
    hud: combine([
      { opacity: 0.55 },
      fade({}, span(200, 600).of(time)),
      fade({}, reversed(span(12600, 13000).of(time))),
    ]),
    chapter: {},
    label0: {},
    label1: {},
    label2: {},
    label3: {},
    label4: {},
    timecode: {},
    minutes: {},
    secTensBox: {},
    secTens: digit(2)(Math.floor(seconds / 10)),
    secOnesBox: {},
    secOnes: digit(10)(seconds % 10),
    colon: {},
    frameTensBox: {},
    frameTens: digit(3)(Math.floor(frames / 10)),
    frameOnesBox: {},
    frameOnes: digit(10)(frames % 10),
  };
};
