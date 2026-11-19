import {
  combine,
  ease,
  elapsedOf,
  motion,
  reversed,
  sequence,
  span,
  timeAt,
  velocity,
  smear,
  trail,
  type Pose2d,
  type Time,
  anticipation,
  NO_EVENTS,
} from "@gerak/core";
import { drop, fade, pop, pulse, rise, slide, squashed, wipe, wobble, smudge } from "@gerak/moves";
import {
  beat,
  bind,
  box,
  group,
  many,
  sceneBuilder,
  stagger,
  text,
  type RestReader,
  type SceneBuilder,
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
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { tint } from "./moves/tint";
import { partOf, withScene } from "./scene-motion";

/** The WEIGHT letters land one by one, the last one late. */
const LAND = [3880, 4045, 4210, 4375, 4540, 4795] as const;

const INK = "#101114";
const PAPER = "#f3efe6";
const CORAL = "#ff5b3a";
const MUTE = "#7d8290";
const STRINGS = [140, 185, 160, 200, 170, 210, 180];

const domCss = `
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
`;

/** The offset that moves a member resting in `from` to the point `x`, `y` of the frame. */
const toward = (
  from: { readonly x: number; readonly y: number },
  x: number,
  y: number,
): Pose2d => ({
  x: x - from.x,
  y: y - from.y,
});

const OVERLAP_IN = span(6150, 7150);

/** The bar of OVERLAP: sweeps in from the left, pulls back, whips off right. */
const barPose = (time: Time): Pose2d =>
  combine([
    slide({ distance: 1250, from: "left" })(OVERLAP_IN.of(time, ease.cubicInOut)),
    anticipation({ share: 0.33, amount: 0.04 })((t) =>
      slide({ distance: 1500, from: "right" })(reversed(t)),
    )(span(8700, 9450).of(time), NO_EVENTS),
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

/** The span a staggered run of `parts` lanes fills: each lane `length` ms, each starting `step` after the last. */
const lanesOf = (from: number, length: number, step: number, parts: number) =>
  span(from, from + length + (parts - 1) * step);

const reel = {
  origin: beat("origin", 1000),
  anticipation: beat("anticipation", 2460, { at: 1000 }),
  weight: beat("weight", 2690, { at: 3460 }),
  overlap: beat("overlap", 3300, { at: 6150 }),
  settle: beat("settle", 3600, { at: 9450 }),
  finale: beat("finale", 1950, { at: 13050 }),
  launch: beat("launch", 600, { at: 850 }),
  antRise: beat("antRise", 700, { at: 1000 }),
  antLeap: beat("antLeap", 1000, { at: 2900 }),
  weightFall: beat("weightFall", 1335, { at: 3460 }),
  weightExit: beat("weightExit", 900, { at: 5550 }),
  overlapIn: beat("overlapIn", 1000, { at: 6150 }),
  overlapOut: beat("overlapOut", 850, { at: 8700 }),
  land: beat("land", 550, { at: 9850 }),
  burst: beat("burst", 1220, { at: 10230 }),
  underline: beat("underline", 500, { at: 10800 }),
  flood: beat("flood", 400, { at: 11400 }),
  collapse: beat("collapse", 720, { at: 12200 }),
  matchCut: beat("matchCut", 350, { at: 12700 }),
  finalLine: beat("finalLine", 870, { at: 13050 }),
  leap: beat("leap", 650, { at: 13250 }),
  landing: beat("landing", 500, { at: 13900 }),
  finalPush: beat("finalPush", 1950, { at: 13050 }),
  credit: beat("credit", 600, { at: 14250 }),
};
const land0 = beat("land0", 700, { at: LAND[0] });
const land1 = beat("land1", 700, { at: LAND[1] });
const land2 = beat("land2", 700, { at: LAND[2] });
const land3 = beat("land3", 700, { at: LAND[3] });
const land4 = beat("land4", 700, { at: LAND[4] });
const land5 = beat("land5", 700, { at: LAND[5] });

const flood = box("flood");
const trailUp = box("trailUp");
const ants = text("ant", "ANTICIPATE", { split: "letters" });
const floor = box("floor");
const wgts = text("wgt", "WEIGHT", { split: "letters" });
const dust0 = many("dust0", 3);
const dust1 = many("dust1", 3);
const dust2 = many("dust2", 3);
const dust3 = many("dust3", 3);
const dust4 = many("dust4", 3);
const dust5 = many("dust5", 3);
const dust = group("dust", [dust0, dust1, dust2, dust3, dust4, dust5]);
const bar = box("bar");
const hang = text("hang", "OVERLAP", { split: "letters" });
const overlap = group("overlap", [bar, hang]);
const stl = text("stl", "SETTLE", { split: "letters" });
const underline = box("underline");
const settleWord = group("settleWord", [stl, underline]);
const fin = text("fin", "Timing is everything", { split: "words" });
const stop = box("stop");
const line = group("line", [fin, stop]);
const credit = text("credit", "CLAUDE · MOTION DESIGN · REEL 2026");
const ringLaunch = box("ringLaunch");
const ringLand = box("ringLand");
const ringBurst = box("ringBurst");
const ringPeriod = box("ringPeriod");
const sparks = many("sparks", 8);
const dot = box("dot");
const camera = group("camera", [
  flood,
  trailUp,
  ants,
  floor,
  wgts,
  dust,
  overlap,
  settleWord,
  line,
  credit,
  ringLaunch,
  ringLand,
  ringBurst,
  ringPeriod,
  sparks,
  dot,
]);
const vignette = box("vignette");
const labels = [
  text("label0", "00 — ORIGIN"),
  text("label1", "01 — ANTICIPATION"),
  text("label2", "02 — WEIGHT"),
  text("label3", "03 — OVERLAP"),
  text("label4", "04 — SETTLE"),
];
const hud = group("hud", labels);
const labelBeats = [reel.origin, reel.anticipation, reel.weight, reel.overlap, reel.settle];

/** The dot's flight to the full stop, from its resting box to the stop's. */
function leapFrom(rest: RestReader) {
  const dotRest = rest.get("dot");
  const there = rest.get("stop");
  const toStop = toward(dotRest, there.x, there.y);
  const path = (t: Time): Pose2d =>
    combine([toStop, ballistic({ dx: -(toStop.x ?? 0), dy: -(toStop.y ?? 0), apex: 430 })(t)]);
  return { dotRest, toStop, path };
}

const reachOf = (rest: RestReader) => {
  const dotRest = rest.get("dot");
  const floodRest = rest.get("flood");
  return {
    radius: 1500,
    x: dotRest.x - (floodRest.x - floodRest.width / 2),
    y: dotRest.y - (floodRest.y - floodRest.height / 2),
  };
};

const dotRun = withScene((time, { events, rest }) => {
  const { dotRest, toStop, path } = leapFrom(rest);
  const radius = dotRest.height / 2;
  const leapSignal = (tm: Time): Pose2d => path(reel.leap.of(tm));
  const stretch = smear(velocity(leapSignal, time, events), { stretch: 0.25, max: 1.6 }).pose;
  const landed: Pose2d = { ...toStop, y: (toStop.y ?? 0) - radius * 0.36, scale: 0.64 };
  const run = sequence<Pose2d>(time, [
    [span(0, 450), (t) => pop({ overshoot: 0.35 })(t)],
    [span(450, 1250), (t) => launch({ height: 620, squash: 0.42, stretch: 0.9, crouch: 0.5 })(t)],
    [span(9450, 9983), (t) => drop({ distance: 620 })(t)],
    [
      span(9850, 10150),
      (t) =>
        combine([
          squish({ squash: 0.48, bulge: 0.8, wobbles: 1 })(t),
          ballistic({ dx: 0, dy: 0, apex: 84 })(t),
        ]),
    ],
    [span(10150, 10230), (t) => squashed({ squash: 0.38 })(ease.cubicOut(t.progress))],
    [span(10230, 11400), (t) => springSettle({ squash: 0.38, scale: 1.25, rings: 2 })(t)],
    [span(11400, 11550), (t) => ({ scale: 1 - 0.3 * ease.cubicInOut(t.progress) })],
    [span(11550, 12300), (t) => springSettle({ scale: 0.7, rings: 2, damping: 5 })(t)],
    [span(13050, 13250), (t) => squashed({ squash: 0.4 })(ease.cubicInOut(t.progress))],
    [reel.leap, (t) => combine([path(t), { scale: 1 - 0.36 * ease.cubicInOut(t.progress) }])],
    [
      reel.landing,
      () =>
        combine([
          { anchor: "bottom" },
          landed,
          squish({ squash: 0.42, wobbles: 1 })(span(13900, 14140).of(time)),
          ballistic({ dx: 0, dy: 0, apex: 32 })(span(13900, 14140).of(time)),
          squish({ squash: 0.18, wobbles: 1 })(span(14140, 14400).of(time)),
        ]),
    ],
  ]);
  return combine([run, stretch]);
});

/** A ring pinned to a point of the frame, small and faint, then grown by a shockwave. */
const ringAt = (
  name: string,
  at: (dotX: number, dotY: number, radius: number, stopX: number, stopY: number) => Pose2d,
  grow: number,
  ms: number,
  from: number,
) => [
  withScene((_time, { rest }) => {
    const home = rest.get("dot");
    const there = rest.get("stop");
    const point = at(home.x, home.y, home.height / 2, there.x, there.y);
    return combine([toward(rest.get(name), point.x ?? 0, point.y ?? 0), { scale: 0.2 }]);
  }),
  shockwave({ grow }).in(span(from, from + ms)),
];

const dustMotion = (i: number, land: number) =>
  withScene((time, context) => {
    const { rest } = context;
    const k = partOf(context);
    const letter = rest.get(`wgt.${i}`);
    const floorRest = rest.get("floor");
    const floorTop = floorRest.y - floorRest.height / 2;
    const side = k === 0 ? -1 : k === 1 ? 1 : i % 2 === 1 ? 1 : -1;
    const size = (0.6 + 0.3 * k) * (i === 5 ? 1.5 : 1);
    return combine([
      toward(rest.get(`dust${i}.${k}`), letter.x + side * letter.width * 0.42, floorTop - 4),
      kick({ dx: side * (40 + k * 28), rise: 10 + 22 * k, fall: k === 2 ? 30 : 9 })(
        span(land, land + 700).of(time),
      ),
      { scale: size, opacity: 0.75 },
    ]);
  });

/** How the DOM renderer draws this piece. */
export const skin = { css: domCss };

export default sceneBuilder({
  frame: { width: 1280, height: 720 },
})
  .element(camera)
  .motion(
    motion((t: Time) => push({ to: 1.12, curve: "in" })(reversed(t))).in(span(500, 1400)),
    push({ to: 1.04, curve: "inOut" }).in(span(1400, 2900)).take(),
    motion((t: Time) => push({ to: 1.04, curve: "in" })(reversed(t)))
      .in(span(2900, 3500))
      .take(),
    push({ to: 1.045, curve: "out" }).in(reel.finalPush).take(),
    bump({ dy: 50 }).in(span(2900, 3700)),
    ...LAND.map((at, i) => jolt({ distance: 3 + i * i * 0.6, count: 6 }).in(span(at, at + 900))),
    bump({ dy: -40 }).in(span(5750, 6450)),
    bump({ turn: 0.9 }).in(span(6150, 7700)),
    jolt({ distance: 6, count: 6 }).in(span(9850, 10450)),
    jolt({ distance: 3, count: 5 }).in(reel.landing),
  )
  .element(flood)
  .show([reel.flood, reel.matchCut])
  .motion(
    withScene((time, { rest }) => wipe(reachOf(rest))(time)).in(span(11550, 12150)),
    withScene((time, { rest }) => wipe(reachOf(rest))(reversed(time)))
      .in(span(12700, 13050))
      .take(),
  )
  .element(trailUp)
  .show(reel.launch)
  .motion(dash({ length: 540, arrive: 0.5, lag: 0.17 }).in(reel.launch))
  .element(ants)
  .show([reel.antRise, reel.antLeap])
  .motion(
    stagger(springSettle({ dy: 120, turn: 9, rings: 1, damping: 6 }), { spread: 45 / 520 }).in(
      lanesOf(1000, 520, 45, 10),
    ),
    withScene((time, context) => {
      const i = partOf(context);
      const down = 2250 + i * 35;
      const off = 2900 + i * 38;
      return launch({
        height: 1300,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (off - down) / (off + 650 - down),
        tremble: 1.6,
        flight: "accelerate",
      })(span(down, off + 650).of(time));
    }),
    stagger(tint({ name: "charge", curve: "inOut" }), { spread: 35 / 420 }).in(
      lanesOf(2250, 420, 35, 10),
    ),
    stagger(smudge({ amount: 5 }), { spread: 38 / 300 }).in(lanesOf(2900, 300, 38, 10)),
  )
  .element(floor)
  .show([reel.weightFall, reel.weightExit])
  .motion(
    open({ axis: "x" }).in(span(3460, 3910)),
    motion((t: Time) => open({ axis: "x" })(reversed(t)))
      .in(span(5750, 6000))
      .take(),
    ...LAND.map((at, i) => jolt({ distance: 2 + i, count: 3, sideways: 0 }).in(span(at, at + 450))),
    bump({ dy: -14 }).in(span(5550, 5950)),
    tint({ name: "paper" }).in(span(LAND[5], LAND[5] + 700)),
  )
  .element(wgts)
  .show([reel.weightFall, reel.weightExit])
  .motion(
    withScene((time, context) => {
      const i = partOf(context);
      const at = LAND[i] ?? 0;
      const late = Math.abs(i - 2.5) * 30;
      return combine([
        drop({ distance: 640 })(span(at - 420, at + 140).of(time)),
        sequence<Pose2d>(time, [
          [span(at - 420, at), (t) => smudge({ amount: 3 })(t)],
          [span(at, at + 16), () => ({})],
        ]),
        squish({ squash: 0.24, bulge: 0.67, wobbles: 3 })(span(at, at + 600).of(time)),
        wobble({ angle: 2.5, count: 2 })(span(at, at + 700).of(time)),
        anticipation({ share: 0.28, amount: 0.013 })((t) => rise({ distance: 1100 })(reversed(t)))(
          span(5550 + late, 6270 + late).of(time),
          NO_EVENTS,
        ),
        smudge({ amount: 4 })(span(5750 + late, 6070 + late).of(time)),
      ]);
    }),
  )
  .element(dust0)
  .show(land0)
  .motion(dustMotion(0, LAND[0]))
  .element(dust1)
  .show(land1)
  .motion(dustMotion(1, LAND[1]))
  .element(dust2)
  .show(land2)
  .motion(dustMotion(2, LAND[2]))
  .element(dust3)
  .show(land3)
  .motion(dustMotion(3, LAND[3]))
  .element(dust4)
  .show(land4)
  .motion(dustMotion(4, LAND[4]))
  .element(dust5)
  .show(land5)
  .motion(dustMotion(5, LAND[5]))
  .element(overlap)
  .show([reel.overlapIn, reel.overlapOut])
  .motion(motion(barPose))
  .element(hang)
  .motion(
    withScene((time, context) => {
      const bob = bobs[partOf(context)];
      const length = STRINGS[partOf(context)] ?? 160;
      if (bob === undefined) return {};
      const swinging = (): Pose2d => {
        const lag = barX(time) - bob(time, context.events);
        const turn = ((lag / (length + 50)) * 180) / Math.PI;
        return { rotation: Math.max(-45, Math.min(45, turn * 0.22)), anchor: "top" };
      };
      return sequence<Pose2d>(time, [
        [span(0, 9536), swinging],
        [span(9536, 9552), () => ({ anchor: "top" })],
      ]);
    }),
  )
  .element(settleWord)
  .show([reel.burst, reel.collapse])
  .element(stl)
  .motion(
    withScene((time, context) => {
      const i = partOf(context);
      const { dotRest } = leapFrom(context.rest);
      const back = toward(context.rest.get(`stl.${i}`), dotRest.x, dotRest.y);
      const dx = back.x ?? 0;
      const dy = back.y ?? 0;
      const turn = STL_TURN[i] ?? 0;
      return combine([
        springSettle({ dx, dy, lift: 70, turn, scale: 0, rings: 2, damping: 4 })(
          span(stlIn(i), stlIn(i) + 1200).of(time),
        ),
        anticipation({ share: 0.3, amount: 0.15 })((t) =>
          springSettle({ dx, dy, turn: turn * 0.5, scale: 0.05, rings: 0 })(reversed(t)),
        )(span(stlOut(i), stlOut(i) + 520).of(time), NO_EVENTS),
      ]);
    }),
    stagger(
      motion((t: Time) => smudge({ amount: 4 })(reversed(t))),
      { spread: 55 / 220, from: "center" },
    ).in(lanesOf(10230, 220, 55, 3)),
    stagger(smudge({ amount: 3 }), { spread: 50 / 320, from: "edges" }).in(
      lanesOf(12500, 320, 50, 3),
    ),
    tint({ name: "ink" }).in(span(11700, 11850)),
  )
  .element(underline)
  .show([reel.underline, reel.collapse])
  .motion(
    open({ axis: "x" }).in(reel.underline),
    motion((t: Time) => open({ axis: "x" })(reversed(t)))
      .in(span(12100, 12400))
      .take(),
    tint({ name: "ink" }).in(span(11700, 11850)),
  )
  .element(line)
  .show([reel.finalLine, reel.finale])
  .element(fin)
  .motion(
    stagger(springSettle({ dy: 130, turn: 5, rings: 1, damping: 5 }), { spread: 110 / 650 }).in(
      lanesOf(13050, 650, 110, 3),
    ),
    stagger(jolt({ distance: 6, count: 2, sideways: 0 }), { spread: 45 / 600, from: "end" }).in(
      lanesOf(13900, 600, 45, 3),
    ),
  )
  .element(credit)
  .show([reel.credit, reel.finale])
  .motion(rise({ distance: 14 }).in(reel.credit), fade().in(reel.credit))
  .element(ringLaunch)
  .show(reel.launch)
  .motion(...ringAt("ringLaunch", (x, y, r) => ({ x, y: y + r }), 11, 600, 850))
  .element(ringLand)
  .show(reel.land)
  .motion(...ringAt("ringLand", (x, y, r) => ({ x, y: y + r }), 8, 550, 9850))
  .element(ringBurst)
  .show(reel.burst)
  .motion(...ringAt("ringBurst", (x, y) => ({ x, y }), 21, 700, 10230))
  .element(ringPeriod)
  .show(reel.landing)
  .motion(...ringAt("ringPeriod", (_x, _y, _r, sx, sy) => ({ x: sx, y: sy + 6 }), 4, 500, 13900))
  .element(sparks)
  .show([reel.leap, reel.landing])
  .motion(
    withScene((time, context) => {
      const k = partOf(context);
      const lag = (k + 1) * 35;
      const { dotRest, path } = leapFrom(context.rest);
      const own = context.rest.get(`sparks.${k}`);
      return combine([
        toward(own, dotRest.x, dotRest.y),
        path(span(reel.leap.from + lag, reel.leap.to + lag).of(time)),
        { opacity: 0.7 * (1 - k / 9), scale: 1 - k / 12 },
      ]);
    }),
  )
  .element(dot)
  .motion(
    dotRun,
    ...[0, 1, 2, 3, 4, 5].map((i) =>
      pulse({ amount: 0.2 }).in(span(stlOut(i) + 520, stlOut(i) + 700)),
    ),
    tint({ name: "ink" }).in(span(11550, 11620)),
    motion((t: Time) => tint({ name: "ink" })(reversed(t)))
      .in(span(13034, 13050))
      .take(),
  )
  .element(vignette)
  .element(hud)
  .show([reel.origin, reel.settle])
  .motion(
    bind({ opacity: () => 0.55 }),
    fade().in(span(200, 600)),
    motion((t: Time) => fade()(reversed(t))).in(span(12600, 13000)),
  );
