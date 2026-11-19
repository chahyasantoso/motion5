import {
  combine,
  ease,
  elapsedOf,
  motion,
  reversed,
  sequence,
  span,
  toCubics,
  velocity,
  smear,
  type Anchor2d,
  type Cubic2d,
  type Pose2d,
  type Time,
  anticipation,
  NO_EVENTS,
} from "@gerak/core";
import { drop, fade, nod, pulse, rise, slide, squashed, wipe, wobble, smudge } from "@gerak/moves";
import {
  beat,
  bind,
  box,
  group,
  many,
  sceneBuilder,
  shape,
  stagger,
  text,
  type RestReader,
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
import { spread } from "./moves/spread";
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { streak } from "./moves/streak";
import { tint } from "./moves/tint";
import { partOf, withScene } from "./scene-motion";

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

const PAPER = "#f3efe6";
const INK = "#101114";
const MUTE = "#7d8290";
const between = (a: string, b: string, share: string) =>
  `color-mix(in srgb, ${b} calc(${share} * 100%), ${a})`;

/** The reel's look: ink stage, paper type in Arial Black, a coral dot, Georgia for the last line. */
const domCss = `
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
[data-cast="maker"], [data-cast="craft"], [data-cast="year"] { color: inherit; }
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
[data-cast="minutes"], [data-cast="colon"] { line-height: 1; }
[data-cast$="Box"] { display: block; height: 12px; overflow: hidden; }
[data-cast="secTens"], [data-cast="secOnes"], [data-cast="frameTens"], [data-cast="frameOnes"] { line-height: 1; }
`;

const BAR_IN = span(0, 1000);
/** The bar's sweep in: slow to start, fast through the middle, easing onto its mark. */
const BAR_SWEEP = (p: number) => 1 - Math.cbrt(1 - ease.cubicInOut(p ** 0.6));
const BAR_OUT = span(2550, 3300);
const OVERLAP = span(6150, 9450);
const WIPE_AT = 11550;
const COLLAPSE_AT = 12300;
const PERIOD_AT = 13900;
const LEAP = span(13250, 13900);

const burstAt = (i: number) => 10230 + (Math.abs(i - 2.5) - 0.5) * 55;
const collapseAt = (i: number) => COLLAPSE_AT + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;

/** The span a staggered run of `parts` lanes fills: each lane `length` ms, each starting `step` after the last. */
const lanesOf = (from: number, length: number, step: number, parts: number) =>
  span(from, from + length + (parts - 1) * step);

/** The bar's sideways travel on the overlap beat's own clock: in from the left, back, then whipped out. */
const barOf = (time: Time): number =>
  combine([
    slide({ distance: 1250, from: "left" })(BAR_IN.of(time, BAR_SWEEP)),
    anticipation({ share: 1 / 3, amount: 55 / 1450 })((t) =>
      slide({ distance: 1450, from: "right" })(reversed(t)),
    )(BAR_OUT.of(time), NO_EVENTS),
  ]).x ?? 0;

/** Where the full stop sits, measured from the slot after the last word. */
const stopOf = (rest: RestReader) => {
  const slot = rest.get("stop");
  return slot.width === 0 ? STOP_AT : { x: slot.x - slot.width / 2 + 7, y: slot.y - 13 };
};

const reel = {
  origin: beat("origin", 1000),
  anticipation: beat("anticipation", 2460, { at: 1000 }),
  weight: beat("weight", 2690, { at: 3460 }),
  overlap: beat("overlap", 3300, { at: 6150 }),
  settle: beat("settle", 5550, { at: 9450 }),
  appear: beat("appear", 450),
  launch: beat("launch", 400, { at: 850 }),
  antIn: beat("antIn", 700, { at: 1000 }),
  antLeap: beat("antLeap", 650, { at: 2900 }),
  floor: beat("floor", 2650, { at: 3350 }),
  weightFall: beat("weightFall", 1335, { at: 3460 }),
  weightExit: beat("weightExit", 710, { at: 5550 }),
  overlapIn: beat("overlapIn", 1000, { at: 6150 }),
  overlapWhip: beat("overlapWhip", 750, { at: 8700 }),
  dotReturn: beat("dotReturn", 780, { at: 9450 }),
  settleBurst: beat("settleBurst", 1220, { at: 10230 }),
  underline: beat("underline", 500, { at: 10800 }),
  wipe: beat("wipe", 400, { at: 11400 }),
  collapse: beat("collapse", 720, { at: 12200 }),
  matchCut: beat("matchCut", 350, { at: 12700 }),
  leap: beat("leap", 870, { at: 13050 }),
  period: beat("period", 500, { at: 13900 }),
  push: beat("push", 1950, { at: 13050 }),
  credit: beat("credit", 600, { at: 14250 }),
  hud: beat("hud", 13000),
};
const landAt = (i: number): number => LANDS[i] ?? 0;
const thud0 = beat("thud0", 700, { at: landAt(0) });
const thud1 = beat("thud1", 700, { at: landAt(1) });
const thud2 = beat("thud2", 700, { at: landAt(2) });
const thud3 = beat("thud3", 700, { at: landAt(3) });
const thud4 = beat("thud4", 700, { at: landAt(4) });
const thud5 = beat("thud5", 700, { at: landAt(5) });

const flood = box("flood");
const trailUp = shape("trailUp", TRAIL_UP);
const trailArc = shape("trailArc", ARC);
const underline = shape("underline", UNDERLINE);
const ants = text("ant", "ANTICIPATE", { split: "letters" });
const floor = shape("floor", FLOOR);
const weights = text("weight", "WEIGHT", { split: "letters" });
const dust0 = many("dust0", 3);
const dust1 = many("dust1", 3);
const dust2 = many("dust2", 3);
const dust3 = many("dust3", 3);
const dust4 = many("dust4", 3);
const dust5 = many("dust5", 3);
const bar = box("bar");
const hang = text("hang", "OVERLAP", { split: "letters" });
const rig = group("rig", [bar, hang]);
const settleWord = text("settleWord", "SETTLE", { split: "letters" });
const phrase = text("phrase", "Timing is everything", { split: "words" });
const stop = box("stop");
const line = group("line", [phrase, stop]);
const credit = group("credit", [
  text("maker", "CLAUDE "),
  text("dotA", "·"),
  text("craft", " MOTION DESIGN "),
  text("dotB", "·"),
  text("year", " REEL 2026"),
]);
const ringLaunch = box("ringLaunch");
const ringLand = box("ringLand");
const ringBurst = box("ringBurst");
const ringPeriod = box("ringPeriod");
const dot = box("dot");
const camera = group("camera", [
  flood,
  trailUp,
  trailArc,
  underline,
  ants,
  floor,
  weights,
  dust0,
  dust1,
  dust2,
  dust3,
  dust4,
  dust5,
  rig,
  settleWord,
  line,
  credit,
  ringLaunch,
  ringLand,
  ringBurst,
  ringPeriod,
  dot,
]);
const vignette = box("vignette");
const label0 = text("label0", "00 — ORIGIN");
const label1 = text("label1", "01 — ANTICIPATION");
const label2 = text("label2", "02 — WEIGHT");
const label3 = text("label3", "03 — OVERLAP");
const label4 = text("label4", "04 — SETTLE");
const secTens = text("secTens", "0\n1");
const secOnes = text("secOnes", "0\n1\n2\n3\n4\n5\n6\n7\n8\n9");
const frameTens = text("frameTens", "0\n1\n2");
const frameOnes = text("frameOnes", "0\n1\n2\n3\n4\n5\n6\n7\n8\n9");
const hud = group("hud", [
  group("chapter", [label0, label1, label2, label3, label4]),
  group("timecode", [
    text("minutes", "00:"),
    group("secTensBox", [secTens]),
    group("secOnesBox", [secOnes]),
    text("colon", ":"),
    group("frameTensBox", [frameTens]),
    group("frameOnesBox", [frameOnes]),
  ]),
]);

/** The timecode's clock: whole seconds and frames of 30 per second, stopping at 13 s. */
const clockOf = (time: Time) => {
  const ms = Math.min(13000, elapsedOf(time.clock) ?? 0);
  return { seconds: Math.floor(ms / 1000), frames: Math.floor(((ms % 1000) * 30) / 1000) };
};
/** Each digit strip scrolls up 12 px per value. */
const digit = (count: number, value: number): number =>
  -12 * Math.min(count - 1, Math.max(0, value));

const dotRun = withScene((time, { events, rest }) => {
  const stopAt = stopOf(rest);
  const toStop = { x: stopAt.x - DOT.x, y: stopAt.y - DOT.y };
  const leapPath = (t: Time): Pose2d =>
    combine([toStop, ballistic({ dx: -toStop.x, dy: -toStop.y, apex: 430 })(LEAP.of(t))]);
  const fallPath = (t: Time): Pose2d =>
    drop({ distance: 440 })(span(9450, 9450 + 400 / 0.75).of(t));
  return sequence(time, [
    [
      span(0, 1250),
      (t) =>
        combine([
          launch({ height: 620, squash: 0.42, bulge: 0.8, stretch: 0.9, crouch: 0.5 })(
            span(450, 1250).of(t),
          ),
          { y: LAUNCH_Y - DOT.y },
          springSettle({ scale: 0, rings: 1.9, damping: 4.8 })(span(60, 850).of(t)),
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
      (t) => combine([squish({ squash: 0.48, bulge: 0.8, wobbles: 0 })(t), bump({ dy: -42 })(t)]),
    ],
    [span(10150, 10230), (t) => crouch({ squash: 0.38, bulge: 0.8, curve: "out" })(t)],
    [
      span(10230, 13050),
      (t) =>
        combine([
          { anchor: "bottom" },
          springSettle({ squash: 0.38, rings: 2.8, damping: 5.2 })(span(0, 870).of(t)),
          pulse({ amount: 0.3 })(span(0, 300).of(t)),
          sequence(t, [
            [
              span(WIPE_AT - 150 - 10230, WIPE_AT - 10230),
              (u) => push({ to: 0.7, curve: "inOut" })(u),
            ],
            [
              span(WIPE_AT - 10230, WIPE_AT + 600 - 10230),
              (u) => springSettle({ scale: 0.7, rings: 1.8, damping: 4.2 })(u),
            ],
          ]),
          ...[0, 1, 2, 3, 4, 5].map((i) =>
            pulse({ amount: 0.2 })(
              span(collapseAt(i) + 520 - 10230, collapseAt(i) + 760 - 10230).of(t),
            ),
          ),
          tint({ name: "ink" })(span(WIPE_AT - 10230, WIPE_AT + 70 - 10230).of(t)),
        ]),
    ],
    [span(13050, 13250), (t) => crouch({ squash: 0.4, bulge: 0.75 })(t)],
    [
      LEAP,
      () =>
        combine([
          leapPath(time),
          smear(
            velocity((t) => leapPath(t), time, events),
            { stretch: 0.3, max: 1.5 },
          ).pose,
          push({ to: 0.64, curve: "inOut" })(LEAP.of(time)),
        ]),
    ],
    [
      span(PERIOD_AT, 15000),
      (t) =>
        combine([
          squish({ squash: 0.42, bulge: 0.7, wobbles: 0 })(span(0, 260).of(t)),
          { ...toStop, y: toStop.y - 18 * 0.36, scale: 0.64 },
          bump({ dy: -16 })(span(0, 240).of(t)),
          squish({ squash: 0.18, bulge: 0.7, wobbles: 0 })(span(240, 480).of(t)),
        ]),
    ],
  ]);
});

const weightRun = withScene((time, context) => {
  const i = partOf(context);
  const land = LANDS[i] ?? 0;
  const plunge = 5750 + Math.abs(i - 2.5) * 30;
  const fallen = 0.004 * (6260 - plunge) ** 2;
  return sequence(time, [
    [
      span(land - 420, land + 140),
      (t) =>
        combine([
          drop({ distance: 640 })(t),
          smudge({ amount: 3, build: 0.75 })(t),
          squashed({ squash: -0.12 })(Math.min(1, t.progress / 0.75)),
        ]),
    ],
    [
      span(land, 5550),
      (t) =>
        combine([
          squish({ squash: 0.24, bulge: 0.67, wobbles: 2.8 })(span(0, 700).of(t)),
          wobble({ angle: 1.6, count: 2 })(span(0, 800).of(t)),
        ]),
    ],
    [
      span(5550, 6260),
      (t) =>
        anticipation({ share: (plunge - 5550) / (6260 - 5550), amount: 14 / fallen })((u) =>
          combine([rise({ distance: fallen })(reversed(u)), smudge({ amount: 4, build: 0.6 })(u)]),
        )(t, NO_EVENTS),
    ],
  ]);
});

const dustRun = (li: number) =>
  withScene((time, context) => {
    const kk = partOf(context);
    const letter = context.rest.get(`weight.${li}`);
    const land = LANDS[li] ?? 0;
    const side = DUST_SIDE[kk] === 0 ? (li % 2 ? 1 : -1) : (DUST_SIDE[kk] ?? 1);
    return combine([
      {
        x: letter.x + side * letter.width * 0.42,
        y: 484,
        scale: (0.6 + 0.3 * kk) * (li === 5 ? 1.5 : 1),
        opacity: 0.75,
      },
      kick({
        dx: side * (40 + kk * 28),
        rise: 10 + 22 * kk,
        fall: kk === 2 ? 30 : 9,
        shrink: 0.75,
      })(span(land, land + 700).of(time)),
    ]);
  });

const settleRun = withScene((time, context) => {
  const i = partOf(context);
  const home = context.rest.get(`settleWord.${i}`);
  const away = { dx: DOT.x - home.x, dy: DOT.y - home.y };
  const turn = BURST_TURN[i] ?? 0;
  const out = collapseAt(i);
  return sequence(time, [
    [
      span(burstAt(i), out),
      (t) =>
        combine([
          springSettle({ ...away, lift: 70, rings: 2.4, damping: 5 })(span(0, 1400).of(t)),
          springSettle({ turn, rings: 2, damping: 3.7 })(span(0, 1400).of(t)),
          springSettle({ scale: 0.15, rings: 3.2, damping: 6.5 })(span(0, 1400).of(t)),
          smudge({ amount: 4 })(reversed(span(0, 220).of(t))),
        ]),
    ],
    [
      span(out, out + 520),
      (t) =>
        anticipation({ share: 0.3, amount: 0.2 })((u) =>
          combine([
            springSettle({ ...away, turn: turn * 0.5, scale: 0.05, rings: 0, damping: 3 })(
              reversed(u),
            ),
            smudge({ amount: 3, build: 1 })(u),
          ]),
        )(t, NO_EVENTS),
    ],
  ]);
});

/** A ring grown by a shockwave over `ms`, at the opacity the page's own box gives it. */
const ringGrow = (grow: number, alpha: number, from: number, ms: number) => [
  bind({ opacity: () => alpha }),
  shockwave({ grow }).in(span(from, from + ms)),
];

const spreadIn = (from: number, to: number, ms: number, curve: (p: number) => number) =>
  motion((t: Time) => spread({})(span(0, ms).of(t, curve))).in(span(from, to));

/** How the DOM renderer draws this piece. */
export const skin = { css: domCss };

export default sceneBuilder({
  frame: { width: 1280, height: 720 },
})
  .element(camera)
  .motion(
    motion((t: Time) => push({ to: 1.12, curve: "in" })(reversed(t))).in(span(500, 1400)),
    push({ to: 1.04, curve: "inOut" }).in(span(1400, 2900)).take(),
    motion((t: Time) => combine([{ scale: 1.04 }, push({ to: 1 / 1.04, curve: "out" })(t)]))
      .in(span(2900, 3500))
      .take(),
    push({ to: 1.045, curve: "out" }).in(span(13050, 15000)).take(),
    bump({ dy: 50 }).in(span(2900, 3700)),
    ...LANDS.map((land, i) =>
      jolt({ distance: (3 + i * i * 0.6) * 1.4, count: 6, sideways: 0.35 }).in(
        span(land, land + 560),
      ),
    ),
    bump({ dy: -40 }).in(span(5750, 6450)),
    bump({ turn: 0.9 }).in(span(6150, 7700)),
    jolt({ distance: 7, count: 6, sideways: 0 }).in(span(9850, 10450)),
    jolt({ distance: 3.5, count: 5, sideways: 0 }).in(span(PERIOD_AT, PERIOD_AT + 500)),
  )
  .element(flood)
  .show([reel.wipe, reel.matchCut])
  .motion(
    motion((t: Time) =>
      wipe({ radius: 800, x: DOT.x, y: DOT.y })(span(0, 400).of(t, ease.quadOut)),
    ).in(span(WIPE_AT, WIPE_AT + 400)),
    motion((t: Time) => wipe({ radius: 800, x: DOT.x, y: DOT.y })(reversed(t)))
      .in(span(12700, 13050))
      .take(),
  )
  .element(trailUp)
  .show([reel.launch, reel.antIn])
  .motion(streak({ arrive: 0.43, lag: 0.17 }).in(span(850, 1450)))
  .element(trailArc)
  .show([reel.leap, reel.period])
  .motion(
    withScene((_time, { rest }) => ({
      scaleX: (stopOf(rest).x - DOT.x) / (STOP_AT.x - DOT.x),
      anchor: "left",
    })),
    streak({ arrive: 0.65, lag: 0.21 }).in(span(13250, 14250)),
  )
  .element(underline)
  .show([reel.underline, reel.collapse])
  .motion(
    withScene((_time, { rest }) => {
      const first = rest.get("settleWord.0");
      const last = rest.get("settleWord.5");
      const half =
        Math.max(DOT.x - (first.x - first.width / 2), last.x + last.width / 2 - DOT.x) - 6;
      return { scaleX: half / UNDERLINE_HALF };
    }),
    spreadIn(10800, 11300, 500, ease.cubicOut),
    motion((t: Time) => spread({})(reversed(span(0, 300).of(t, ease.cubicIn))))
      .in(span(COLLAPSE_AT - 100, COLLAPSE_AT + 200))
      .take(),
    tint({ name: "ink" }).in(span(WIPE_AT + 150, WIPE_AT + 300)),
  )
  .element(ants)
  .show([reel.antIn, reel.antLeap])
  .motion(
    withScene((time, context) => {
      const i = partOf(context);
      const sink = 2250 + i * 35;
      const leap = 2900 + i * 38;
      const flight = 3550 - leap;
      return launch({
        height: 1.1 * flight + 0.0014 * flight * flight,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (leap - sink) / (leap - sink + flight),
        tremble: 1.6,
        flight: "accelerate",
      })(span(sink, leap + flight).of(time));
    }),
    stagger(springSettle({ dy: 120, turn: 9, rings: 1, damping: 5 }), { spread: 45 / 600 }).in(
      lanesOf(1000, 600, 45, 10),
    ),
    stagger(smudge({ amount: 5 }), { spread: 38 / 300 }).in(lanesOf(2900, 300, 38, 10)),
    stagger(tint({ name: "charge", curve: "inOut" }), { spread: 35 / 420 }).in(
      lanesOf(2250, 420, 35, 10),
    ),
  )
  .element(floor)
  .show(reel.floor)
  .motion(
    spreadIn(3350, 3800, 450, ease.cubicOut),
    motion((t: Time) => spread({})(reversed(span(0, 250).of(t, ease.cubicIn))))
      .in(span(5750, 6000))
      .take(),
    ...LANDS.map((land, i) => nod({ distance: 2 + i }).in(span(land, land + 170))),
    tint({ name: "cool" }).in(span(4795, 5495)),
  )
  .element(weights)
  .show([reel.weightFall, reel.weightExit])
  .motion(weightRun)
  .element(dust0)
  .show(thud0)
  .motion(dustRun(0))
  .element(dust1)
  .show(thud1)
  .motion(dustRun(1))
  .element(dust2)
  .show(thud2)
  .motion(dustRun(2))
  .element(dust3)
  .show(thud3)
  .motion(dustRun(3))
  .element(dust4)
  .show(thud4)
  .motion(dustRun(4))
  .element(dust5)
  .show(thud5)
  .motion(dustRun(5))
  .element(rig)
  .show([reel.overlapIn, reel.overlapWhip])
  .motion(motion((t: Time): Pose2d => ({ x: barOf(t) })).in(OVERLAP))
  .element(hang)
  .motion(
    withScene((time, context) => {
      const i = partOf(context);
      return dangle({
        length: HANG[i] ?? 0,
        damping: 0.18,
        gain: 0.36,
        lag: i * 28,
        limit: 63,
        carrier: barOf,
      })(time);
    }).in(OVERLAP),
  )
  .element(settleWord)
  .show([reel.settleBurst, reel.collapse])
  .motion(settleRun, tint({ name: "ink" }).in(span(WIPE_AT + 150, WIPE_AT + 300)))
  .element(line)
  .show([reel.leap, reel.push])
  .element(phrase)
  .motion(
    stagger(springSettle({ dy: 126, turn: 5, rings: 1, damping: 5 }), { spread: 110 / 650 }).in(
      lanesOf(13050, 650, 110, 3),
    ),
    stagger(jolt({ distance: 7, count: 2, sideways: 0 }), { spread: 45 / 700, from: "end" }).in(
      lanesOf(PERIOD_AT, 700, 45, 3),
    ),
  )
  .element(credit)
  .show([reel.credit, reel.push])
  .motion(
    rise({ distance: 14 }).in(span(14250, 14850)),
    motion((t: Time) => fade()(span(0, 600).of(t, ease.quadOut))).in(span(14250, 14850)),
  )
  .element(ringLaunch)
  .show([reel.launch, reel.antIn])
  .motion(...ringGrow(11, 0.9, 850, 600))
  .element(ringLand)
  .show([reel.dotReturn, reel.settleBurst])
  .motion(...ringGrow(8, 0.8, 9850, 550))
  .element(ringBurst)
  .show(reel.settleBurst)
  .motion(...ringGrow(21, 0.9, 10230, 700))
  .element(ringPeriod)
  .show([reel.period, reel.push])
  .motion(
    withScene((_time, { rest }) => {
      const stopAt = stopOf(rest);
      return { x: stopAt.x, y: stopAt.y + 6 };
    }),
    ...ringGrow(4, 0.7, PERIOD_AT, 500),
  )
  .element(dot)
  .show([reel.appear, reel.launch], [reel.dotReturn, reel.push])
  .motion(dotRun)
  .element(vignette)
  .element(hud)
  .show(reel.hud)
  .motion(
    bind({ opacity: () => 0.55 }),
    fade().in(span(200, 600)),
    motion((t: Time) => fade()(reversed(t))).in(span(12600, 13000)),
  )
  .element(label0)
  .show(reel.origin)
  .element(label1)
  .show(reel.anticipation)
  .element(label2)
  .show(reel.weight)
  .element(label3)
  .show(reel.overlap)
  .element(label4)
  .show(reel.settle)
  .element(secTens)
  .motion(bind({ y: (time) => digit(2, Math.floor(clockOf(time).seconds / 10)) }))
  .element(secOnes)
  .motion(bind({ y: (time) => digit(10, clockOf(time).seconds % 10) }))
  .element(frameTens)
  .motion(bind({ y: (time) => digit(3, Math.floor(clockOf(time).frames / 10)) }))
  .element(frameOnes)
  .motion(bind({ y: (time) => digit(10, clockOf(time).frames % 10) }));
