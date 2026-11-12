import {
  anticipate,
  combine,
  drop,
  ease,
  elapsedOf,
  fade,
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
  type Box,
  type Rest,
} from "@gerak/stage";
import { ballistic } from "./moves/ballistic";
import { bump } from "./moves/bump";
import { dash } from "./moves/dash";
import { jolt } from "./moves/jolt";
import { kick } from "./moves/kick";
import { launch } from "./moves/launch";
import { open } from "./moves/open";
import { push } from "./moves/push";
import { shockwave } from "./moves/shockwave";
import { smudge } from "./moves/smudge";
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { tint } from "./moves/tint";

/** The WEIGHT letters land one by one, the last one late. */
const LAND = [3880, 4045, 4210, 4375, 4540, 4795] as const;

/** The piece's beats by name, in ms: the reel's chapters, then each moment inside them. */
export const beats = story(15000, {
  origin: [0, 1000],
  anticipation: [1000, 3460],
  weight: [3460, 6150],
  overlap: [6150, 9450],
  settle: [9450, 13050],
  finale: [13050, 15000],
  appear: [0, 450],
  crouch: [450, 850],
  launch: [850, 1450],
  antRise: [1000, 1700],
  tension: [1400, 2900],
  antCrouch: [2250, 2900],
  antLeap: [2900, 3900],
  weightFall: [3460, 4795],
  land0: [LAND[0], LAND[0] + 700],
  land1: [LAND[1], LAND[1] + 700],
  land2: [LAND[2], LAND[2] + 700],
  land3: [LAND[3], LAND[3] + 700],
  land4: [LAND[4], LAND[4] + 700],
  land5: [LAND[5], LAND[5] + 700],
  weightExit: [5550, 6450],
  overlapIn: [6150, 7150],
  overlapSettle: [7150, 8700],
  overlapOut: [8700, 9550],
  dotReturn: [9450, 9850],
  land: [9850, 10400],
  burst: [10230, 11450],
  underline: [10800, 11300],
  flood: [11400, 11800],
  collapse: [12200, 12920],
  matchCut: [12700, 13050],
  finalLine: [13050, 13920],
  leap: [13250, 13900],
  landing: [13900, 14400],
  finalPush: [13050, 15000],
  credit: [14250, 14850],
});

/** Who is on stage; the camera carries everything but the vignette and the reel's label. */
export const cast = {
  camera: group({
    flood: actor({ on: [["flood", "matchCut"]] }),
    trailUp: actor({ on: ["launch"] }),
    ant: letters("ANTICIPATE", { on: [["antRise", "antLeap"]] }),
    floor: actor({ on: [["weightFall", "weightExit"]] }),
    wgt: letters("WEIGHT", { on: [["weightFall", "weightExit"]] }),
    dust: group({
      dust0: many(3, { on: ["land0"] }),
      dust1: many(3, { on: ["land1"] }),
      dust2: many(3, { on: ["land2"] }),
      dust3: many(3, { on: ["land3"] }),
      dust4: many(3, { on: ["land4"] }),
      dust5: many(3, { on: ["land5"] }),
    }),
    overlap: group(
      { bar: actor({ still: true }), hang: letters("OVERLAP") },
      { on: [["overlapIn", "overlapOut"]] },
    ),
    settleWord: group(
      { stl: letters("SETTLE"), underline: actor({ on: [["underline", "collapse"]] }) },
      { on: [["burst", "collapse"]] },
    ),
    line: group(
      { fin: words("Timing is everything"), stop: actor({ still: true }) },
      { on: [["finalLine", "finale"]] },
    ),
    credit: actor({ text: "CLAUDE · MOTION DESIGN · REEL 2026", on: [["credit", "finale"]] }),
    ringLaunch: actor({ on: ["launch"] }),
    ringLand: actor({ on: ["land"] }),
    ringBurst: actor({ on: ["burst"] }),
    ringPeriod: actor({ on: ["landing"] }),
    sparks: many(8, { on: [["leap", "landing"]] }),
    dot: actor(),
  }),
  vignette: actor({ still: true }),
  hud: group(
    {
      label0: actor({ text: "00 — ORIGIN", on: ["origin"], still: true }),
      label1: actor({
        text: "01 — ANTICIPATION",
        on: ["anticipation"],
        still: true,
      }),
      label2: actor({ text: "02 — WEIGHT", on: ["weight"], still: true }),
      label3: actor({ text: "03 — OVERLAP", on: ["overlap"], still: true }),
      label4: actor({ text: "04 — SETTLE", on: ["settle"], still: true }),
    },
    { on: [["origin", "settle"]] },
  ),
};

const INK = "#101114";
const PAPER = "#f3efe6";
const CORAL = "#ff5b3a";
const MUTE = "#7d8290";
const STRINGS = [140, 185, 160, 200, 170, 210, 180];

/** How the cast looks on the page, laid out as each member's resting frame. */
export const skins = {
  dom: {
    css: `
[data-stage="frame"] { display: block; background: ${INK}; color: ${PAPER};
  font-family: "Arial Black", "Arial Bold", Gadget, Arial, sans-serif; font-weight: 900; }
[data-cast="camera"], [data-cast="overlap"], [data-cast="dust"] {
  position: absolute; left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="flood"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; background: ${CORAL}; }
[data-cast="trailUp"] { position: absolute; left: 638.5px; top: -160px; width: 3px; height: 540px;
  border-radius: 2px; background: ${CORAL}; }
[data-cast="ant"], [data-cast="wgt"] { position: absolute; left: 0; width: 1280px; gap: 0;
  flex-wrap: nowrap; justify-content: center; line-height: 1; }
[data-cast="ant"] { top: 312px; height: 100px; font-size: 100px; letter-spacing: .01em;
  clip-path: inset(-900px -200px 0 -200px); }
[data-cast="ant"] > * { color: color-mix(in srgb, ${CORAL} calc(var(--charge, 0) * 100%), ${PAPER}); }
[data-cast="wgt"] { top: 326px; font-size: 180px; }
[data-cast="wgt"] > * { margin: 0 .01em; }
[data-cast="floor"] { position: absolute; left: 300px; top: 488px; width: 680px; height: 5px; border-radius: 3px;
  background: color-mix(in srgb, ${PAPER} calc(var(--paper, 0) * 100%), ${CORAL}); }
[data-cast^="dust"][data-kind="many"] { position: absolute; left: 0; top: 0; width: 0; height: 0; display: block; }
[data-cast^="dust"][data-kind="item"] { position: absolute; left: -5px; top: -5px; width: 10px; height: 10px;
  border-radius: 50%; background: ${PAPER}; }
[data-cast="bar"] { position: absolute; left: 250px; top: 150px; width: 780px; height: 6px; border-radius: 3px;
  background: ${CORAL}; }
[data-cast="hang"] { position: absolute; left: 0; top: 155px; width: 1280px; gap: 6px; flex-wrap: nowrap;
  justify-content: center; align-items: flex-start; }
[data-cast="hang"] > * { font-size: 110px; line-height: .92; padding-top: var(--len); }
[data-cast="hang"] > *::before { content: ""; position: absolute; left: 50%; top: 0; width: 2px; margin-left: -1px;
  height: var(--len); background: rgba(243, 239, 230, .45); }
${STRINGS.map((len, i) => `[data-cast="hang.${i}"] { --len: ${len}px; }`).join("\n")}
[data-cast="settleWord"], [data-cast="line"] { position: absolute; left: 0; right: 0; margin: 0 auto;
  width: fit-content; gap: 0; flex-wrap: nowrap; }
[data-cast="settleWord"] { top: 226px; display: block; }
[data-cast="stl"] { gap: 0; flex-wrap: nowrap; font-size: 140px; line-height: 1; }
[data-cast="stl"] > * { color: color-mix(in srgb, ${INK} calc(var(--ink, 0) * 100%), ${PAPER}); }
[data-cast="underline"] { position: absolute; left: 6px; right: 6px; top: 147px; height: 7px; border-radius: 4px;
  background: color-mix(in srgb, ${INK} calc(var(--ink, 0) * 100%), ${PAPER}); }
[data-cast="line"] { top: 286px; display: flex; align-items: baseline; }
[data-cast="fin"] { gap: 0; flex-wrap: nowrap; align-items: baseline;
  font: italic 700 84px/1.15 Georgia, "Times New Roman", serif; padding-bottom: .12em;
  clip-path: inset(-400px -400px 0 -400px); }
[data-cast="fin"] > * { margin: 0 .12em; }
[data-cast="stop"] { width: 23px; height: 23px; margin-left: -4px; }
[data-cast="credit"] { position: absolute; left: 0; top: 438px; width: 1280px; text-align: center;
  font: 700 14px/1 Arial, Helvetica, sans-serif; letter-spacing: .42em; color: ${MUTE}; }
[data-cast^="ring"] { position: absolute; left: 580px; top: 320px; width: 120px; height: 120px;
  box-sizing: border-box; border-radius: 50%; border: 3px solid ${CORAL}; }
[data-cast="sparks"] { position: absolute; left: 640px; top: 380px; width: 0; height: 0; display: block; }
[data-cast="sparks"] > * { position: absolute; left: -3px; top: -3px; width: 6px; height: 6px; border-radius: 50%;
  background: ${CORAL}; }
[data-cast="dot"] { position: absolute; left: 622px; top: 362px; width: 36px; height: 36px; border-radius: 50%;
  background: color-mix(in srgb, ${INK} calc(var(--ink, 0) * 100%), ${CORAL}); }
[data-cast="vignette"] { position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,.42) 100%); }
[data-cast="hud"] { position: absolute; left: 32px; bottom: 26px; display: block; }
[data-cast^="label"] { position: absolute; left: 0; bottom: 0; white-space: pre;
  font: 12px/1 Consolas, "Courier New", monospace; letter-spacing: .18em; color: ${MUTE}; }
`,
  },
};

export const frame = stageFrame({ width: 1280, height: 720 });

/** The offset that moves a member resting in `from` to the point `x`, `y` of the frame. */
const toward = (from: Box, x: number, y: number): Pose2d => ({ x: x - from.x, y: y - from.y });

/** The bar of OVERLAP: sweeps in from the left, pulls back, whips off right. */
const barPose = (time: Time): Pose2d =>
  combine([
    slide({ distance: 1250, from: "left" }, beats.overlapIn.of(time, ease.cubicInOut)),
    anticipate({ share: 0.33, amount: 0.04 }, span(8700, 9450).of(time), (t) =>
      slide({ distance: 1500, from: "right" }, reversed(t)),
    ),
  ]);
const barX = (time: Time): number => barPose(time).x ?? 0;

/** Each OVERLAP letter's bob, chasing the bar on a spring as stiff as its string is short. */
const bobs = STRINGS.map((len, i) => {
  const omega = 2 * Math.PI * 1.25 * Math.sqrt(160 / len);
  const lagged = (time: Time): number => barX(timeAt(time, (elapsedOf(time.clock) ?? 0) - i * 28));
  return trail(lagged, { stiffness: omega * omega, damping: 0.36 * omega, rest: 0.2 });
});

const STL_TURN = [-48, 30, -16, 18, -30, 50];
const fromCentre = (i: number, count: number): number => Math.abs(i - (count - 1) / 2) - 0.5;
const stlIn = (i: number): number => 10230 + fromCentre(i, 6) * 55;
const stlOut = (i: number): number => 12300 + (2 - fromCentre(i, 6)) * 50;

/** Every member's value at `time`, placed by the measured `rest` of each. */
export const scene = (time: Time, events: Events, rest: Rest) => {
  const dotRest = restOf(rest, "dot");
  const stop = restOf(rest, "stop");
  const radius = dotRest.height / 2;
  const toStop = toward(dotRest, stop.x, stop.y);

  const camera = combine([
    sequence<Pose2d>(time, [
      [span(500, 1400), (t) => push({ to: 1.12, curve: "in" }, reversed(t))],
      [span(1400, 2900), (t) => push({ to: 1.04, curve: "inOut" }, t)],
      [span(2900, 3500), (t) => push({ to: 1.04, curve: "in" }, reversed(t))],
      [beats.finalPush, (t) => push({ to: 1.045, curve: "out" }, t)],
    ]),
    bump({ dy: 50 }, span(2900, 3700).of(time)),
    ...LAND.map((at, i) =>
      jolt({ distance: 3 + i * i * 0.6, count: 6 }, span(at, at + 900).of(time)),
    ),
    bump({ dy: -40 }, span(5750, 6450).of(time)),
    bump({ turn: 0.9 }, span(6150, 7700).of(time)),
    jolt({ distance: 6, count: 6 }, span(9850, 10450).of(time)),
    jolt({ distance: 3, count: 5 }, beats.landing.of(time)),
  ]);

  const leapPath = (t: Time): Pose2d =>
    combine([toStop, ballistic({ dx: -(toStop.x ?? 0), dy: -(toStop.y ?? 0), apex: 430 }, t)]);
  const leapSignal = (tm: Time): Pose2d => leapPath(beats.leap.of(tm));
  const stretch = smear(velocity(leapSignal, time, events), { stretch: 0.25, max: 1.6 }).pose;
  const landed: Pose2d = { ...toStop, y: (toStop.y ?? 0) - radius * 0.36, scale: 0.64 };

  const dotMotion = sequence<Pose2d>(time, [
    [beats.appear, (t) => pop({ overshoot: 0.35 }, t)],
    [span(450, 1250), (t) => launch({ height: 620, squash: 0.42, stretch: 0.9, crouch: 0.5 }, t)],
    [span(9450, 9983), (t) => drop({ distance: 620 }, t)],
    [
      span(9850, 10150),
      (t) =>
        combine([
          squish({ squash: 0.48, bulge: 0.8, wobbles: 1 }, t),
          ballistic({ dx: 0, dy: 0, apex: 84 }, t),
        ]),
    ],
    [span(10150, 10230), (t) => squashed(0.38, ease.cubicOut(t.progress))],
    [span(10230, 11400), (t) => springSettle({ squash: 0.38, scale: 1.25, rings: 2 }, t)],
    [span(11400, 11550), (t) => ({ scale: 1 - 0.3 * ease.cubicInOut(t.progress) })],
    [span(11550, 12300), (t) => springSettle({ scale: 0.7, rings: 2, damping: 5 }, t)],
    [span(13050, 13250), (t) => squashed(0.4, ease.cubicInOut(t.progress))],
    [beats.leap, (t) => combine([leapPath(t), { scale: 1 - 0.36 * ease.cubicInOut(t.progress) }])],
    [
      beats.landing,
      () =>
        combine([
          { anchor: "bottom" },
          landed,
          squish({ squash: 0.42, wobbles: 1 }, span(13900, 14140).of(time)),
          ballistic({ dx: 0, dy: 0, apex: 32 }, span(13900, 14140).of(time)),
          squish({ squash: 0.18, wobbles: 1 }, span(14140, 14400).of(time)),
        ]),
    ],
  ]);
  const dot = combine([
    dotMotion,
    stretch,
    ...[0, 1, 2, 3, 4, 5].map((i) =>
      pulse({ amount: 0.2 }, span(stlOut(i) + 520, stlOut(i) + 700).of(time)),
    ),
    sequence<Pose2d>(time, [
      [span(11550, 11620), (t) => tint({ name: "ink" }, t)],
      [span(13034, 13050), (t) => tint({ name: "ink" }, reversed(t))],
    ]),
  ]);

  const ringAt = (
    name: string,
    x: number,
    y: number,
    grow: number,
    ms: number,
    from: number,
  ): Pose2d =>
    combine([
      toward(restOf(rest, name), x, y),
      { scale: 0.2 },
      shockwave({ grow }, span(from, from + ms).of(time)),
    ]);

  const sparks = Array.from({ length: 8 }, (_, k): Pose2d => {
    const lag = (k + 1) * 35;
    const own = restOf(rest, `sparks.${k}`);
    return combine([
      toward(own, dotRest.x, dotRest.y),
      leapPath(span(beats.leap.from + lag, beats.leap.to + lag).of(time)),
      { opacity: 0.7 * (1 - k / 9), scale: 1 - k / 12 },
    ]);
  });

  const ant = Array.from({ length: 10 }, (_, i): Pose2d => {
    const up = 1000 + i * 45;
    const down = 2250 + i * 35;
    const off = 2900 + i * 38;
    return combine([
      springSettle({ dy: 120, turn: 9, rings: 1, damping: 6 }, span(up, up + 520).of(time)),
      launch(
        {
          height: 1300,
          squash: 0.3,
          bulge: 0.33,
          stretch: 0.45,
          crouch: (off - down) / (off + 650 - down),
          tremble: 1.6,
          flight: "accelerate",
        },
        span(down, off + 650).of(time),
      ),
      tint({ name: "charge", curve: "inOut" }, span(down, down + 420).of(time)),
      smudge({ amount: 5 }, span(off, off + 300).of(time)),
    ]);
  });

  const wgt = LAND.map((at, i): Pose2d => {
    const late = Math.abs(i - 2.5) * 30;
    return combine([
      drop({ distance: 640 }, span(at - 420, at + 140).of(time)),
      sequence<Pose2d>(time, [
        [span(at - 420, at), (t) => smudge({ amount: 3 }, t)],
        [span(at, at + 16), () => ({})],
      ]),
      squish({ squash: 0.24, bulge: 0.67, wobbles: 3 }, span(at, at + 600).of(time)),
      wobble({ angle: 2.5, count: 2 }, span(at, at + 700).of(time)),
      anticipate({ share: 0.28, amount: 0.013 }, span(5550 + late, 6270 + late).of(time), (t) =>
        rise({ distance: 1100 }, reversed(t)),
      ),
      smudge({ amount: 4 }, span(5750 + late, 6070 + late).of(time)),
    ]);
  });

  const floorRest = restOf(rest, "floor");
  const floorTop = floorRest.y - floorRest.height / 2;
  const floor = combine([
    sequence<Pose2d>(time, [
      [span(3460, 3910), (t) => open({ axis: "x" }, t)],
      [span(5750, 6000), (t) => open({ axis: "x" }, reversed(t))],
    ]),
    ...LAND.map((at, i) =>
      jolt({ distance: 2 + i, count: 3, sideways: 0 }, span(at, at + 450).of(time)),
    ),
    bump({ dy: -14 }, span(5550, 5950).of(time)),
    tint({ name: "paper" }, span(LAND[5], LAND[5] + 700).of(time)),
  ]);

  const dustOf = (i: number, at: number): Pose2d[] => {
    const letter = restOf(rest, `wgt.${i}`);
    return [0, 1, 2].map((k): Pose2d => {
      const side = k === 0 ? -1 : k === 1 ? 1 : i % 2 === 1 ? 1 : -1;
      const size = (0.6 + 0.3 * k) * (i === 5 ? 1.5 : 1);
      return combine([
        toward(restOf(rest, `dust${i}.${k}`), letter.x + side * letter.width * 0.42, floorTop - 4),
        kick(
          { dx: side * (40 + k * 28), rise: 10 + 22 * k, fall: k === 2 ? 30 : 9 },
          span(at, at + 700).of(time),
        ),
        { scale: size, opacity: 0.75 },
      ]);
    });
  };

  const hang = bobs.map((bob, i): Pose2d => {
    const swinging = (): Pose2d => {
      const lag = barX(time) - bob(time, events);
      const turn = ((lag / ((STRINGS[i] ?? 160) + 50)) * 180) / Math.PI;
      return { rotation: Math.max(-45, Math.min(45, turn * 0.22)), anchor: "top" };
    };
    return sequence<Pose2d>(time, [
      [span(0, 9536), swinging],
      [span(9536, 9552), () => ({ anchor: "top" })],
    ]);
  });

  const stl = STL_TURN.map((turn, i): Pose2d => {
    const own = restOf(rest, `stl.${i}`);
    const back = toward(own, dotRest.x, dotRest.y);
    const dx = back.x ?? 0;
    const dy = back.y ?? 0;
    return combine([
      springSettle(
        { dx, dy, lift: 70, turn, scale: 0, rings: 2, damping: 4 },
        span(stlIn(i), stlIn(i) + 1200).of(time),
      ),
      smudge({ amount: 4 }, reversed(span(stlIn(i), stlIn(i) + 220).of(time))),
      anticipate({ share: 0.3, amount: 0.15 }, span(stlOut(i), stlOut(i) + 520).of(time), (t) =>
        springSettle({ dx, dy, turn: turn * 0.5, scale: 0.05, rings: 0 }, reversed(t)),
      ),
      smudge({ amount: 3 }, span(stlOut(i) + 200, stlOut(i) + 520).of(time)),
      tint({ name: "ink" }, span(11700, 11850).of(time)),
    ]);
  });

  const underline = combine([
    sequence<Pose2d>(time, [
      [beats.underline, (t) => open({ axis: "x" }, t)],
      [span(12100, 12400), (t) => open({ axis: "x" }, reversed(t))],
    ]),
    tint({ name: "ink" }, span(11700, 11850).of(time)),
  ]);

  const floodRest = restOf(rest, "flood");
  const reach = {
    radius: 1500,
    x: dotRest.x - (floodRest.x - floodRest.width / 2),
    y: dotRest.y - (floodRest.y - floodRest.height / 2),
  };
  const flood = sequence<Pose2d>(time, [
    [span(11550, 12150), (t) => wipe(reach, t)],
    [span(12700, 13050), (t) => wipe(reach, reversed(t))],
  ]);

  const fin = [0, 1, 2].map((i): Pose2d => {
    const from = 13050 + i * 110;
    const ripple = 13900 + (2 - i) * 45;
    return combine([
      springSettle({ dy: 130, turn: 5, rings: 1, damping: 5 }, span(from, from + 650).of(time)),
      jolt({ distance: 6, count: 2, sideways: 0 }, span(ripple, ripple + 600).of(time)),
    ]);
  });

  return {
    camera,
    flood,
    trailUp: dash({ length: 540, arrive: 0.5, lag: 0.17 }, beats.launch.of(time)),
    ant,
    floor,
    wgt,
    dust: {},
    dust0: dustOf(0, LAND[0]),
    dust1: dustOf(1, LAND[1]),
    dust2: dustOf(2, LAND[2]),
    dust3: dustOf(3, LAND[3]),
    dust4: dustOf(4, LAND[4]),
    dust5: dustOf(5, LAND[5]),
    overlap: barPose(time),
    hang,
    settleWord: {},
    stl,
    underline,
    line: {},
    fin,
    credit: combine([
      rise({ distance: 14 }, beats.credit.of(time)),
      fade({}, beats.credit.of(time)),
    ]),
    ringLaunch: ringAt("ringLaunch", dotRest.x, dotRest.y + radius, 11, 600, 850),
    ringLand: ringAt("ringLand", dotRest.x, dotRest.y + radius, 8, 550, 9850),
    ringBurst: ringAt("ringBurst", dotRest.x, dotRest.y, 21, 700, 10230),
    ringPeriod: ringAt("ringPeriod", stop.x, stop.y + 6, 4, 500, 13900),
    sparks,
    dot,
    hud: combine([
      { opacity: 0.55 },
      fade({}, span(200, 600).of(time)),
      fade({}, reversed(span(12600, 13000).of(time))),
    ]),
  };
};
