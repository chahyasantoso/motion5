import {
  anticipate,
  combine,
  ease,
  fade,
  overshoot,
  pulse,
  reversed,
  rise,
  sequence,
  slide,
  span,
  toCubics,
  wipe,
  wobble,
  type Cubic2d,
  type Events,
  type Pose2d,
  type Time,
  smudge,
} from "@gerak/moves";
import {
  actor,
  frame as frameOf,
  group,
  letters,
  many,
  restOf,
  story,
  words,
  type Rest,
} from "@gerak/stage";
import { bump } from "./moves/bump";
import { crouch } from "./moves/crouch";
import { dangle } from "./moves/dangle";
import { jolt } from "./moves/jolt";
import { kick } from "./moves/kick";
import { launch } from "./moves/launch";
import { lob } from "./moves/lob";
import { push } from "./moves/push";
import { shockwave } from "./moves/shockwave";
import { springSettle } from "./moves/spring-settle";
import { spread } from "./moves/spread";
import { squish } from "./moves/squish";
import { streak } from "./moves/streak";
import { tint } from "./moves/tint";

export const brief = "showreel";

// Each WEIGHT letter's landing; the last lands late and hardest.
const LAND = [3880, 4045, 4210, 4375, 4540, 4795] as const;
const landOf = (i: number): number => LAND[i] ?? LAND[0];

export const beats = story(15000, {
  origin: [0, 850],
  launch: [850, 1450],
  anticipate: [1000, 3900],
  floor: [3350, 6000],
  weight: [3460, 6350],
  thud0: [3880, 4580],
  thud1: [4045, 4745],
  thud2: [4210, 4910],
  thud3: [4375, 5075],
  thud4: [4540, 5240],
  thud5: [4795, 5495],
  overlap: [6150, 9550],
  drop: [9450, 10230],
  landing: [9850, 10400],
  settle: [10230, 11550],
  burst: [10230, 10930],
  underline: [10800, 12500],
  wipe: [11550, 13050],
  collapse: [12200, 12920],
  finale: [13050, 15000],
  leap: [13250, 13900],
  period: [13900, 14400],
  credit: [14250, 15000],
  hudOrigin: [0, 1000],
  hudAnticipation: [1000, 3460],
  hudWeight: [3460, 6150],
  hudOverlap: [6150, 9450],
  hudSettle: [9450, 13000],
});

const THUDS = ["thud0", "thud1", "thud2", "thud3", "thud4", "thud5"] as const;
const thudOf = (i: number) => THUDS[i] ?? THUDS[0];

// One straight or curved stroke as cubics, from a start, two handles and an end, in frame px.
function stroke(
  from: { x: number; y: number },
  c1: { x: number; y: number },
  c2: { x: number; y: number },
  to: { x: number; y: number },
): readonly Cubic2d[] {
  return toCubics([
    { id: "a", x: from.x, y: from.y, inX: 0, inY: 0, outX: c1.x - from.x, outY: c1.y - from.y },
    { id: "b", x: to.x, y: to.y, inX: c2.x - to.x, inY: c2.y - to.y, outX: 0, outY: 0 },
  ]);
}

/** Where the full stop lands: on the final line's baseline, just after its last word. */
function periodPoint(rest: Rest): { x: number; y: number } {
  const slot = restOf(rest, "slot");
  return { x: slot.x - slot.width / 2 + 7, y: slot.y - 5 };
}

/** The WEIGHT floor's height: the word's baseline. */
function floorY(rest: Rest): number {
  const w = restOf(rest, "weight.0");
  return w.y + w.height / 2 - 16;
}

const ARC_APEX = 430;

const upPath = (rest: Rest) => {
  const dot = restOf(rest, "dot");
  const from = { x: dot.x, y: dot.y + 20 };
  const to = { x: dot.x, y: dot.y - 520 };
  return stroke(from, { x: dot.x, y: dot.y - 150 }, { x: dot.x, y: dot.y - 320 }, to);
};

const floorPath = (rest: Rest) => {
  const first = restOf(rest, "weight.0");
  const last = restOf(rest, "weight.5");
  const y = floorY(rest);
  const left = first.x;
  const right = last.x;
  const third = (right - left) / 3;
  return stroke({ x: left, y }, { x: left + third, y }, { x: right - third, y }, { x: right, y });
};

const underlinePath = (rest: Rest) => {
  const dot = restOf(rest, "dot");
  const first = restOf(rest, "settle.0");
  const last = restOf(rest, "settle.5");
  const half = Math.max(dot.x - (first.x - first.width / 2), last.x + last.width / 2 - dot.x) - 6;
  const left = dot.x - half;
  const right = dot.x + half;
  const ends = dot.y - 7;
  const middle = dot.y + 2.33;
  return stroke(
    { x: left, y: ends },
    { x: left + (2 * half) / 3, y: middle },
    { x: right - (2 * half) / 3, y: middle },
    { x: right, y: ends },
  );
};

// The leap's quadratic arc as a cubic: the same curve `lob` flies with this apex.
const arcPath = (rest: Rest) => {
  const a = restOf(rest, "dot");
  const b = periodPoint(rest);
  const c = { x: (a.x + b.x) / 2, y: Math.min(a.y, b.y) - ARC_APEX };
  return stroke(
    a,
    { x: a.x + (2 / 3) * (c.x - a.x), y: a.y + (2 / 3) * (c.y - a.y) },
    { x: b.x + (2 / 3) * (c.x - b.x), y: b.y + (2 / 3) * (c.y - b.y) },
    b,
  );
};

const DUST = 18;

export const cast = {
  camera: group({
    wipe: actor({ on: ["wipe"] }),
    trailUp: actor({ path: upPath, on: ["launch"] }),
    floor: actor({ path: floorPath, on: ["floor"] }),
    underline: actor({ path: underlinePath, on: ["underline"] }),
    trailArc: actor({ path: arcPath, on: [["leap", "period"]] }),
    ant: letters("ANTICIPATE", { on: ["anticipate"] }),
    weight: letters("WEIGHT", { on: ["weight"] }),
    dust: many(
      Array.from({ length: DUST }, (_, j) => j),
      (j) => actor({ on: [thudOf(Math.floor(j / 3))] }),
    ),
    overlap: group({ bar: actor({ still: true }), hang: letters("OVERLAP") }, { on: ["overlap"] }),
    settle: letters("SETTLE", { on: [["settle", "collapse"]] }),
    fin: group(
      { line: words("Timing is everything", { still: false }), slot: actor({ still: true }) },
      { on: ["finale"], still: true },
    ),
    credit: actor({ text: "CLAUDE · MOTION DESIGN · REEL 2026", on: ["credit"] }),
    ringLaunch: actor({ on: ["launch"] }),
    ringLand: actor({ on: ["landing"] }),
    ringBurst: actor({ on: ["burst"] }),
    ringPeriod: actor({ on: ["period"] }),
    dot: actor({
      on: [
        ["origin", "launch"],
        ["drop", "finale"],
      ],
    }),
  }),
  vignette: actor({ still: true }),
  hud: group(
    {
      hudOrigin: actor({ text: "00 — ORIGIN", on: ["hudOrigin"], still: false }),
      hudAnticipation: actor({ text: "01 — ANTICIPATION", on: ["hudAnticipation"], still: true }),
      hudWeight: actor({ text: "02 — WEIGHT", on: ["hudWeight"], still: true }),
      hudOverlap: actor({ text: "03 — OVERLAP", on: ["hudOverlap"], still: true }),
      hudSettle: actor({ text: "04 — SETTLE", on: ["hudSettle"], still: true }),
    },
    { still: true },
  ),
};

export const frame = frameOf({ width: 1280, height: 720 });

const HANG = [140, 185, 160, 200, 170, 210, 180] as const;
const hangLength = (i: number) => HANG[i] ?? HANG[0];

export const skins = {
  dom: {
    css: `
[data-stage="frame"] {
  --ink: #101114; --paper: #f3efe6; --coral: #ff5b3a; --mute: #7d8290;
  background: var(--ink); color: var(--paper);
  font-family: "Arial Black", "Arial Bold", Gadget, Arial, sans-serif; font-weight: 900;
}
[data-cast="camera"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="wipe"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; background: var(--coral); }
[data-path="trailUp"] { stroke: var(--coral); stroke-width: 3; stroke-linecap: round; }
[data-path="trailArc"] { stroke: var(--coral); stroke-width: 2.5; stroke-linecap: round; opacity: 0.7; }
[data-path="floor"] {
  stroke: color-mix(in srgb, var(--paper) calc(var(--cool, 0) * 100%), var(--coral));
  stroke-width: 5; stroke-linecap: round;
}
[data-path="underline"] {
  stroke: color-mix(in srgb, var(--ink) calc(var(--flip, 0) * 100%), var(--paper));
  stroke-width: 7; stroke-linecap: round;
}
[data-cast="ant"] {
  position: absolute; left: 0; top: 312px; width: 1280px; height: 100px; gap: 0; flex-wrap: nowrap;
  align-items: flex-start; font-size: 100px; line-height: 1; letter-spacing: 0.01em;
  clip-path: inset(-900px -200px 0 -200px);
}
[data-cast^="ant."] { color: color-mix(in srgb, var(--coral) calc(var(--charge, 0) * 100%), var(--paper)); }
[data-cast="weight"] {
  position: absolute; left: 0; top: 326px; width: 1280px; gap: 0; flex-wrap: nowrap;
  align-items: flex-start; font-size: 180px; line-height: 1;
}
[data-cast^="weight."] { margin: 0 0.01em; }
[data-cast="dust"] { position: absolute; left: 0; top: 0; width: 0; height: 0; display: block; }
[data-cast^="dust."] {
  position: absolute; left: -5px; top: -5px; width: 10px; height: 10px; border-radius: 50%;
  background: var(--paper);
}
[data-cast="overlap"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="bar"] {
  position: absolute; left: 250px; top: 150px; width: 780px; height: 6px; border-radius: 3px;
  background: var(--coral);
}
[data-cast="hang"] {
  position: absolute; left: 0; top: 155px; width: 1280px; gap: 6px; flex-wrap: nowrap;
  align-items: flex-start;
}
[data-cast^="hang."] {
  display: flex; flex-direction: column; align-items: center; font-size: 110px; line-height: 0.92;
}
[data-cast^="hang."]::before {
  content: ""; display: block; width: 2px; height: var(--string); background: rgba(243, 239, 230, 0.45);
}
${HANG.map((h, i) => `[data-cast="hang.${i}"] { --string: ${h}px; }`).join("\n")}
[data-cast="settle"] {
  position: absolute; left: 0; top: 226px; width: 1280px; gap: 0; flex-wrap: nowrap;
  align-items: flex-start; font-size: 140px; line-height: 1;
}
[data-cast^="settle."] { color: color-mix(in srgb, var(--ink) calc(var(--flip, 0) * 100%), var(--paper)); }
[data-cast="fin"] {
  position: absolute; left: 0; top: 286px; width: 1280px; gap: 0; flex-wrap: nowrap;
  align-items: baseline; padding-bottom: 10px;
  font: italic 700 84px/1.15 Georgia, "Times New Roman", serif;
  clip-path: inset(-400px -100px 0 -100px);
}
[data-cast="line"] { gap: 20px; flex-wrap: nowrap; align-items: baseline; padding-left: 10px; }
[data-cast="slot"] { width: 27px; height: 0; margin-left: 5px; margin-right: 3px; }
[data-cast="credit"] {
  position: absolute; left: 0; top: 438px; width: 1280px; text-align: center;
  font: 700 14px/1 Arial, Helvetica, sans-serif; letter-spacing: 0.42em; color: var(--mute);
}
[data-cast^="ring"] {
  position: absolute; left: -60px; top: -60px; width: 120px; height: 120px; box-sizing: border-box;
  border-radius: 50%; border: 3px solid var(--coral);
}
[data-cast="dot"] {
  position: absolute; left: 622px; top: 362px; width: 36px; height: 36px; border-radius: 50%;
  background: color-mix(in srgb, var(--ink) calc(var(--dotflip, 0) * 100%), var(--coral));
}
[data-cast="vignette"] {
  position: absolute; left: 0; top: 0; width: 1280px; height: 720px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 46%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.42) 100%);
}
[data-cast="hud"] {
  position: absolute; left: 32px; bottom: 26px; width: 600px; height: 12px; display: block; opacity: 0.55;
}
[data-cast^="hud"] { font: 12px/1 Consolas, "Courier New", monospace; letter-spacing: 0.18em; color: var(--mute); }
[data-cast="hudOrigin"], [data-cast="hudAnticipation"], [data-cast="hudWeight"],
[data-cast="hudOverlap"], [data-cast="hudSettle"] { position: absolute; left: 0; top: 0; }
`,
  },
};

const at = (from: number, to: number, time: Time): Time => span(from, to).of(time);

function camera(time: Time): Pose2d {
  return combine([
    push({ to: 1.12, curve: "in" }, reversed(at(500, 1400, time))),
    push({ to: 1.04, curve: "inOut" }, at(1400, 2900, time)),
    push({ to: 1 / 1.04, curve: "out" }, at(2900, 3500, time)),
    push({ to: 1.045, curve: "out" }, at(13050, 15000, time)),
    bump({ dy: 50 }, at(2900, 3700, time)),
    ...LAND.map((land, i) =>
      jolt({ distance: 3 + i * i * 0.6, count: 5.5, sideways: 0.35 }, at(land, land + 500, time)),
    ),
    bump({ dy: -40 }, at(5750, 6450, time)),
    bump({ turn: 0.9 }, at(6150, 7700, time)),
    jolt({ distance: 6, count: 6 }, at(9850, 10450, time)),
    jolt({ distance: 3, count: 5 }, at(13900, 14400, time)),
    tint({ name: "flip" }, at(11700, 11850, time)),
    tint({ name: "flip", amount: -1 }, at(13040, 13050, time)),
  ]);
}

// The SETTLE letters arrive centre pair first and leave outer pair first.
const burstAt = (i: number) => 10230 + (Math.abs(i - 2.5) - 0.5) * 55;
const collapseAt = (i: number) => 12300 + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;
const SUCKED = 520;

function dot(time: Time, rest: Rest): Pose2d {
  const home = restOf(rest, "dot");
  const stop = periodPoint(rest);
  const ex = stop.x - home.x;
  const ey = stop.y - home.y;
  const small = 0.64;
  const sink = (home.height / 2) * (1 - small);
  const arrivals = [0, 1, 2, 3, 4, 5].map((i) => collapseAt(i) + SUCKED - 10230);
  return sequence(time, [
    [
      span(0, 1450),
      (t) =>
        combine([
          launch(
            { height: 620, squash: 0.42, bulge: 0.8, stretch: 0.9, crouch: 0.5 },
            at(450, 1250, t),
          ),
          springSettle({ scale: 0, rings: 1.5, damping: 5 }, at(60, 850, t)),
          { y: 20 },
        ]),
    ],
    [
      span(9450, 10230),
      (t) =>
        sequence(t, [
          [
            span(0, 400),
            (f) => lob({ dx: 0, dy: -440, apex: 0, stretch: 0.5, facing: "upright" }, f),
          ],
          [
            span(400, 700),
            (h) =>
              combine([
                squish({ squash: 0.48, bulge: 0.8, wobbles: 1 }, h),
                lob({ dx: 0, dy: 0, apex: 84, stretch: 0, facing: "upright" }, h),
              ]),
          ],
          [span(700, 780), (c) => crouch({ squash: 0.38, bulge: 0.79, curve: "out" }, c)],
        ]),
    ],
    [
      span(10230, 13050),
      (t) =>
        combine([
          springSettle({ squash: 0.38, rings: 2.5, damping: 4.8 }, at(0, 800, t)),
          pulse({ amount: 0.45 }, at(0, 260, t)),
          push({ to: 0.7, curve: "inOut" }, at(1170, 1320, t)),
          overshoot({ amount: 0.15, share: 0.4 }, at(1320, 1800, t), (o) =>
            push({ to: 1 / 0.7, curve: "out" }, o),
          ),
          ...arrivals.map((a) => pulse({ amount: 0.2 }, at(a - 40, a + 160, t))),
          tint({ name: "dotflip" }, at(1320, 1390, t)),
        ]),
    ],
    [
      span(13050, 15000),
      (t) =>
        sequence(t, [
          [span(0, 200), (c) => crouch({ squash: 0.4, bulge: 0.75 }, c)],
          [
            span(200, 850),
            (f) =>
              combine([
                lob({ dx: -ex, dy: -ey, apex: ARC_APEX, stretch: 0.35, facing: "heading" }, f),
                push({ to: small }, f),
                { x: ex, y: ey },
              ]),
          ],
          [
            span(850, 1950),
            (l) =>
              combine([
                squish({ squash: 0.42, bulge: 0.7, wobbles: 0.5 }, at(0, 240, l)),
                squish({ squash: 0.18, bulge: 0.7, wobbles: 0.5 }, at(240, 480, l)),
                lob({ dx: 0, dy: 0, apex: 32, stretch: 0, facing: "upright" }, at(0, 240, l)),
                { x: ex, y: ey - sink, scale: small },
              ]),
          ],
        ]),
    ],
  ]);
}

function ant(time: Time, i: number): Pose2d {
  const rise0 = 1000 + i * 45;
  const crouch0 = 2250 + i * 35;
  const leap0 = 2900 + i * 38;
  const gone = leap0 + 650;
  return combine([
    launch(
      {
        height: 1300,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (leap0 - crouch0) / (gone - crouch0),
        tremble: 1.6,
        flight: "accelerate",
      },
      at(crouch0, gone, time),
    ),
    springSettle({ dy: 120, turn: 9, rings: 0.75, damping: 4 }, at(rise0, rise0 + 520, time)),
    tint({ name: "charge", curve: "inOut" }, at(crouch0, crouch0 + 420, time)),
    smudge({ amount: 5, build: 0.46 }, at(leap0, gone, time)),
  ]);
}

function weight(time: Time, i: number): Pose2d {
  const land = landOf(i);
  const fall = land - 420;
  const plunge = 5750 + Math.abs(i - 2.5) * 30;
  return combine([
    squish({ squash: 0.24, bulge: 0.67, wobbles: 2.8 }, at(land, land + 700, time)),
    lob({ dx: 0, dy: -640, apex: 0, stretch: 0.2, facing: "upright" }, at(fall, land, time)),
    wobble({ angle: 2.5, count: 2 }, at(land, land + 700, time)),
    anticipate(
      { share: (plunge - 5550) / (plunge + SUCKED - 5550), amount: 14 / 1100 },
      at(5550, plunge + SUCKED, time),
      (p) => slide({ distance: 1100, from: "bottom" }, reversed(p)),
    ),
    sequence(time, [
      [span(fall, land), (f) => smudge({ amount: 3 }, f)],
      [span(land, plunge), () => ({})],
      [span(plunge, plunge + SUCKED), (f) => smudge({ amount: 4, build: 0.6 }, f)],
    ]),
  ]);
}

function floor(time: Time): Pose2d {
  const last = landOf(5);
  return combine([
    sequence(time, [
      [span(3350, 3800), () => spread({}, span(3350, 3800).of(time, ease.cubicOut))],
      [span(5750, 6000), () => spread({}, reversed(span(5750, 6000).of(time, ease.cubicIn)))],
    ]),
    ...LAND.map((land, i) =>
      jolt({ distance: 2 + i, count: 3, sideways: 0 }, at(land, land + 350, time)),
    ),
    slide({ distance: 14, from: "top" }, reversed(at(5550, 5750, time))),
    tint({ name: "cool" }, at(last, last + 700, time)),
  ]);
}

function dust(time: Time, j: number, rest: Rest): Pose2d {
  const li = Math.floor(j / 3);
  const kind = j % 3;
  const side = kind === 0 ? -1 : kind === 1 ? 1 : li % 2 ? 1 : -1;
  const letter = restOf(rest, `weight.${li}`);
  const me = restOf(rest, `dust.${j}`);
  const size = (0.6 + 0.3 * kind) * (li === 5 ? 1.5 : 1);
  const land = landOf(li);
  return combine([
    {
      x: letter.x + side * letter.width * 0.42 - me.x,
      y: floorY(rest) - 6 - me.y,
      scale: size,
      opacity: 0.75,
    },
    kick(
      { dx: side * (40 + kind * 28), rise: 10 + 22 * kind, fall: 30 * (kind === 2 ? 1 : 0.3) },
      at(land, land + 700, time),
    ),
  ]);
}

// The OVERLAP beat, written from its own 0: the bar sweeps in, holds, pulls back and whips out.
const OVERLAP = span(6150, 9550);

// Bends slide's own ease-out into a sweep that starts gently, speeds through the middle and lands soft.
const sweep = (u: number): number => 1 - Math.cbrt(1 - ease.cubicInOut(u ** 0.6));

function bar(time: Time): Pose2d {
  return combine([
    slide({ distance: 1250, from: "left" }, span(0, 1000).of(time, sweep)),
    anticipate({ share: 0.33, amount: 55 / 1450 }, at(2550, 3300, time), (t) =>
      slide({ distance: 1450, from: "right" }, reversed(t)),
    ),
  ]);
}

function hang(time: Time, i: number): Pose2d {
  const length = hangLength(i) + 50;
  return dangle(
    {
      length,
      pace: Math.sqrt(length / hangLength(i)),
      damping: 0.18,
      gain: 0.45,
      lag: i * 28,
      limit: 65,
    },
    time,
    { carrier: (t: Time) => bar(t).x ?? 0 },
  );
}

const TURNS = [-48, 30, -16, 18, -30, 50] as const;

function settle(time: Time, i: number, rest: Rest): Pose2d {
  const home = restOf(rest, "dot");
  const me = restOf(rest, `settle.${i}`);
  const dx = home.x - me.x;
  const dy = home.y - me.y;
  const turn = TURNS[i] ?? 0;
  const b0 = burstAt(i);
  const out = collapseAt(i);
  return combine([
    springSettle(
      { dx, dy, lift: 70, turn, scale: 0.15, rings: 2, damping: 4.4 },
      at(b0, b0 + 1200, time),
    ),
    fade({}, at(b0, b0 + 60, time)),
    smudge({ amount: 4 }, reversed(at(b0, b0 + 220, time))),
    anticipate({ share: 0.45, amount: 0.15 }, at(out, out + SUCKED, time), (t) =>
      springSettle({ dx, dy, turn: turn * 0.5, scale: 0.05, rings: 0 }, reversed(t)),
    ),
  ]);
}

function underline(time: Time): Pose2d {
  return sequence(time, [
    [span(10800, 11300), () => spread({}, span(10800, 11300).of(time, ease.cubicOut))],
    [span(12200, 12500), () => spread({}, reversed(span(12200, 12500).of(time, ease.cubicIn)))],
  ]);
}

function flood(time: Time, rest: Rest): Pose2d {
  const home = restOf(rest, "dot");
  const me = restOf(rest, "wipe");
  const x = home.x - (me.x - me.width / 2);
  const y = home.y - (me.y - me.height / 2);
  return sequence(time, [
    [
      span(11550, 12150),
      () => wipe({ radius: 780, x, y }, span(11550, 12150).of(time, ease.quartOut)),
    ],
    [
      span(12700, 13050),
      () => wipe({ radius: 780, x, y }, reversed(span(12700, 13050).of(time, ease.cubicIn))),
    ],
  ]);
}

function ring(
  time: Time,
  rest: Rest,
  name: string,
  point: { x: number; y: number },
  from: number,
  ms: number,
  grow: number,
  alpha: number,
): Pose2d {
  const me = restOf(rest, name);
  return combine([
    { x: point.x - me.x, y: point.y - me.y, scale: 0.2, opacity: alpha },
    shockwave({ grow }, at(from, from + ms, time)),
  ]);
}

function word(time: Time, i: number): Pose2d {
  const from = 13050 + i * 110;
  const ripple = 13900 + (2 - i) * 45;
  return combine([
    springSettle({ dy: 126, turn: 5, rings: 0.75, damping: 4 }, at(from, from + 650, time)),
    jolt({ distance: 6, count: 2, sideways: 0 }, at(ripple, ripple + 600, time)),
  ]);
}

const indices = (count: number): readonly number[] => Array.from({ length: count }, (_, i) => i);

export const scene = (time: Time, _events: Events, rest: Rest) => {
  const home = restOf(rest, "dot");
  const stop = periodPoint(rest);
  const credit = at(14250, 14850, time);
  return {
    camera: camera(time),
    wipe: flood(time, rest),
    trailUp: streak({ arrive: 0.43, lag: 0.33 }, at(850, 1450, time)),
    floor: floor(time),
    underline: underline(time),
    trailArc: streak({ arrive: 0.65, lag: 0.12 }, at(13250, 14250, time)),
    ant: indices(10).map((i) => ant(time, i)),
    weight: indices(6).map((i) => weight(time, i)),
    dust: indices(DUST).map((j) => dust(time, j, rest)),
    overlap: sequence(time, [[OVERLAP, bar]]),
    bar: {},
    hang: indices(7).map((i) => sequence(time, [[OVERLAP, (t) => hang(t, i)]])),
    settle: indices(6).map((i) => settle(time, i, rest)),
    fin: {},
    line: indices(3).map((i) => word(time, i)),
    slot: {},
    credit: combine([rise({ distance: 14 }, credit), fade({}, credit)]),
    ringLaunch: ring(time, rest, "ringLaunch", { x: home.x, y: home.y + 38 }, 850, 600, 11, 0.9),
    ringLand: ring(time, rest, "ringLand", { x: home.x, y: home.y + 18 }, 9850, 550, 8, 0.8),
    ringBurst: ring(time, rest, "ringBurst", home, 10230, 700, 21, 0.9),
    ringPeriod: ring(time, rest, "ringPeriod", { x: stop.x, y: stop.y + 6 }, 13900, 500, 4, 0.7),
    dot: dot(time, rest),
    vignette: {},
    hud: {},
    hudOrigin: fade({}, at(200, 600, time)),
    hudAnticipation: {},
    hudWeight: {},
    hudOverlap: {},
    hudSettle: {},
  };
};
