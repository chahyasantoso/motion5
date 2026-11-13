import {
  combine,
  ease,
  elapsedOf,
  fade,
  hop,
  mix,
  pulse,
  reversed,
  rise,
  sequence,
  slide,
  span,
  anticipate,
  wipe,
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
import { bump } from "./moves/bump";
import { crouch } from "./moves/crouch";
import { dangle } from "./moves/dangle";
import { implode } from "./moves/implode";
import { jolt } from "./moves/jolt";
import { kick } from "./moves/kick";
import { launch } from "./moves/launch";
import { lob } from "./moves/lob";
import { open } from "./moves/open";
import { push } from "./moves/push";
import { shockwave } from "./moves/shockwave";
import { smudge } from "./moves/smudge";
import { spread } from "./moves/spread";
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { streak } from "./moves/streak";
import { tint } from "./moves/tint";

const LENGTH = 15000;
const ANT_IN = 1000;
const ANT_CROUCH = 2250;
const ANT_LEAP = 2900;
const WGT_LAND = 3880;
const WGT_LIFT = 5550;
const WGT_DROP = 5750;
const OVL_IN = 6150;
const OVL_STOP = 7150;
const OVL_ANTIC = 8700;
const OVL_GONE = 9450;
const DROP = 9450;
const HOP_END = 10150;
const BURST = 10230;
const UNDERLINE = 10800;
const WIPE = 11550;
const COLL = 12300;
const SHRINK = 12700;
const MATCH = 13050;
const LEAP = 13250;
const PERIOD = 13900;
const CREDIT = 14250;
const DOT_RADIUS = 18;
const PERIOD_SIZE = 0.64;

const RETURN_HOP = { height: 440, bounces: 1, decay: 0.1, squash: 0.48 } as const;
const LAND = mix(DROP, HOP_END, hop.moments(RETURN_HOP).landings[0] ?? 0.6);

const weightLands = (i: number) => WGT_LAND + i * 165 + (i === 5 ? 90 : 0);
const weightLeaves = (i: number) => WGT_DROP + Math.abs(i - 2.5) * 30;
const settleIn = (i: number) => BURST + (Math.abs(i - 2.5) - 0.5) * 55;
const settleOut = (i: number) => COLL + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;
const SETTLE_TURN = [-48, 30, -16, 18, -30, 50];
const STRINGS = [140, 185, 160, 200, 170, 210, 180];
const WEIGHT = "WEIGHT";

/** The reel's beats, as the original's timeline names them. */
export const beats = story(LENGTH, {
  origin: [0, 1250],
  launch: [850, 1450],
  anticipation: [ANT_IN, 4000],
  weight: [3350, 6350],
  thud0: [weightLands(0), weightLands(0) + 700],
  thud1: [weightLands(1), weightLands(1) + 700],
  thud2: [weightLands(2), weightLands(2) + 700],
  thud3: [weightLands(3), weightLands(3) + 700],
  thud4: [weightLands(4), weightLands(4) + 700],
  thud5: [weightLands(5), weightLands(5) + 700],
  overlap: [OVL_IN, OVL_GONE + 100],
  settle: [DROP, MATCH],
  landing: [LAND, LAND + 550],
  burst: [BURST, BURST + 700],
  flood: [WIPE, MATCH],
  finale: [MATCH, LENGTH],
  fullStop: [PERIOD, PERIOD + 500],
});

const THUDS = ["thud0", "thud1", "thud2", "thud3", "thud4", "thud5"] as const;

const LABELS = [
  [beats.origin, "00 — ORIGIN"],
  [beats.anticipation, "01 — ANTICIPATION"],
  [beats.weight, "02 — WEIGHT"],
  [beats.overlap, "03 — OVERLAP"],
  [beats.settle, "04 — SETTLE"],
] as const;
const pad = (value: number) => String(value).padStart(2, "0");
const label = (time: Time) =>
  sequence(
    time,
    LABELS.map(([beat, said]) => [beat, () => said] as const),
  );
const timecode = (time: Time) => {
  const ms = Math.min(LENGTH, elapsedOf(time.clock) ?? 0);
  return `00:${pad(Math.floor(ms / 1000))}:${pad(Math.floor(((ms % 1000) * 30) / 1000))}`;
};

const line = (from: { x: number; y: number }, to: { x: number; y: number }, id: string) =>
  ({
    id,
    x0: from.x,
    y0: from.y,
    x1: mix(from.x, to.x, 1 / 3),
    y1: mix(from.y, to.y, 1 / 3),
    x2: mix(from.x, to.x, 2 / 3),
    y2: mix(from.y, to.y, 2 / 3),
    x3: to.x,
    y3: to.y,
  }) satisfies Cubic2d;

/** A quadratic curve from `a` through control `c` to `b`, as one cubic. */
const quad = (
  a: { x: number; y: number },
  c: { x: number; y: number },
  b: { x: number; y: number },
  id: string,
): Cubic2d => ({
  id,
  x0: a.x,
  y0: a.y,
  x1: a.x + (2 / 3) * (c.x - a.x),
  y1: a.y + (2 / 3) * (c.y - a.y),
  x2: b.x + (2 / 3) * (c.x - b.x),
  y2: b.y + (2 / 3) * (c.y - b.y),
  x3: b.x,
  y3: b.y,
});

const ARC_APEX = 430;
const arcPath = (rest: Rest): readonly Cubic2d[] => {
  const dot = restOf(rest, "dot");
  const stop = restOf(rest, "stop");
  const top = Math.min(dot.y, stop.y) - ARC_APEX;
  return [quad(dot, { x: (dot.x + stop.x) / 2, y: top }, stop, "arc")];
};

const launchPath = (rest: Rest): readonly Cubic2d[] => {
  const dot = restOf(rest, "dot");
  return [line({ x: dot.x, y: dot.y + 20 }, { x: dot.x, y: -140 }, "up")];
};

const underlinePath = (rest: Rest): readonly Cubic2d[] => {
  const dot = restOf(rest, "dot");
  const first = restOf(rest, "sett.0");
  const last = restOf(rest, "sett.5");
  const half = Math.max(dot.x - (first.x - first.width / 2), last.x + last.width / 2 - dot.x) - 6;
  const y = dot.y - 7;
  return [
    {
      id: "under",
      x0: dot.x - half,
      y0: y,
      x1: dot.x - half / 3,
      y1: y + 9.33,
      x2: dot.x + half / 3,
      y2: y + 9.33,
      x3: dot.x + half,
      y3: y,
    },
  ];
};

/** Who is on stage: a camera holding the reel, the vignette over it, and the HUD over that. */
export const cast = {
  camera: group({
    field: actor({ on: ["flood"] }),
    trailUp: actor({ path: launchPath }),
    trailArc: actor({ path: arcPath }),
    underline: actor({ path: underlinePath }),
    ant: letters("ANTICIPATE", { on: ["anticipation"] }),
    floor: actor({ on: ["weight"] }),
    wgt: letters(WEIGHT, { on: ["weight"] }),
    dust: many(
      Array.from({ length: 18 }, (_, j) => j),
      (j) => actor({ on: [THUDS[Math.floor(j / 3)] ?? "thud0"] }),
    ),
    overlap: group({ bar: actor({ still: true }), hang: letters("OVERLAP") }, { on: ["overlap"] }),
    sett: letters("SETTLE", { on: [["burst", "flood"]] }),
    fin: group(
      { fine: words("Timing is everything"), stop: actor({ still: true }) },
      { on: ["finale"] },
    ),
    credit: words("CLAUDE · MOTION DESIGN · REEL 2026", { on: ["finale"] }),
    ringLaunch: actor({ on: ["launch"] }),
    ringLand: actor({ on: ["landing"] }),
    ringBurst: actor({ on: ["burst"] }),
    ringPeriod: actor({ on: ["fullStop"] }),
    dot: actor({ on: ["origin", ["settle", "finale"]] }),
  }),
  vignette: actor({ still: true }),
  hud: group(
    {
      label: actor({ text: label, still: true }),
      timecode: actor({ text: timecode, still: true }),
    },
    { on: [["origin", "settle"]] },
  ),
};

const STRING_CSS = STRINGS.map(
  (height, i) => `[data-cast="hang.${i}"]::before { height: ${height}px; }`,
).join("\n");

export const skins = {
  dom: {
    css: `
[data-stage="frame"] {
  --paper: #f3efe6; --coral: #ff5b3a; --night: #101114; --mute: #7d8290;
  background: var(--night); color: var(--paper);
  font-family: "Arial Black", "Arial Bold", Gadget, Arial, sans-serif; font-weight: 900;
}
[data-cast="camera"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="field"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; background: var(--coral); }
[data-path="trailUp"] { stroke: var(--coral); stroke-width: 3; stroke-linecap: round; }
[data-path="trailArc"] { stroke: var(--coral); stroke-width: 2.5; stroke-linecap: round; opacity: 0.7; }
[data-path="underline"] {
  stroke: color-mix(in srgb, var(--night) calc(var(--inked, 0) * 100%), var(--paper));
  stroke-width: 7; stroke-linecap: round;
}
[data-cast="ant"], [data-cast="wgt"], [data-cast="sett"] {
  position: absolute; left: 0; width: 1280px; display: flex; justify-content: center; gap: 0;
  line-height: 1; flex-wrap: nowrap;
}
[data-cast="ant"] { top: 312px; height: 100px; font-size: 100px; letter-spacing: .01em;
  clip-path: inset(-900px -200px 0 -200px); }
[data-cast^="ant."] { color: color-mix(in srgb, var(--coral) calc(var(--charge, 0) * 100%), var(--paper)); }
[data-cast="wgt"] { top: 326px; font-size: 180px; }
[data-cast^="wgt."] { margin: 0 .01em; }
[data-cast="floor"] { position: absolute; left: 300px; top: 488px; width: 680px; height: 5px; border-radius: 3px;
  background: color-mix(in srgb, var(--paper) calc(var(--cool, 0) * 100%), var(--coral)); }
[data-cast="dust"] { position: absolute; left: 0; top: 0; width: 10px; height: 10px; display: block; }
[data-cast^="dust."] { position: absolute; left: 0; top: 0; width: 10px; height: 10px; border-radius: 50%;
  background: var(--paper); }
[data-cast="overlap"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; display: block; }
[data-cast="bar"] { position: absolute; left: 250px; top: 150px; width: 780px; height: 6px; border-radius: 3px;
  background: var(--coral); }
[data-cast="hang"] { position: absolute; left: 0; top: 155px; width: 1280px; display: flex; justify-content: center;
  align-items: flex-start; gap: 6px; }
[data-cast^="hang."] { display: flex; flex-direction: column; align-items: center; font-size: 110px; line-height: .92; }
[data-cast^="hang."]::before { content: ""; display: block; width: 2px; background: rgba(243, 239, 230, .45); }
${STRING_CSS}
[data-cast="sett"] { top: 226px; font-size: 140px; }
[data-cast^="sett."] { color: color-mix(in srgb, var(--night) calc(var(--inked, 0) * 100%), var(--paper)); }
[data-cast="fin"] { position: absolute; left: 0; top: 286px; width: 1280px; display: flex; justify-content: center;
  align-items: flex-end; gap: 0; clip-path: inset(-900px -200px 0 -200px);
  font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: 700; font-size: 84px; }
[data-cast="fine"] { display: flex; align-items: flex-end; gap: 0; flex-wrap: nowrap; }
[data-cast^="fine."] { line-height: 1.15; padding: 0 .08em .12em; margin: 0 .04em; }
[data-cast="stop"] { width: 23px; height: 26px; margin: 0 0 calc(.12em + 15px) -5px; }
[data-cast="credit"] { position: absolute; left: 0; top: 438px; width: 1280px; display: flex; justify-content: center;
  gap: .42em; font: 700 14px/1 Arial, Helvetica, sans-serif; letter-spacing: .42em; color: var(--mute); }
[data-cast="credit.1"], [data-cast="credit.4"] { color: var(--coral); }
[data-cast^="ring"] { position: absolute; left: 580px; top: 320px; width: 120px; height: 120px;
  border-radius: 50%; border: 3px solid var(--coral); }
[data-cast="dot"] { position: absolute; left: 622px; top: 362px; width: 36px; height: 36px; border-radius: 50%;
  background: color-mix(in srgb, var(--night) calc(var(--inked, 0) * 100%), var(--coral)); }
[data-cast="vignette"] { position: absolute; left: 0; top: 0; width: 1280px; height: 720px; pointer-events: none;
  background: radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 52%, rgba(0,0,0,.42) 100%); }
[data-cast="hud"] { position: absolute; left: 32px; top: 682px; width: 1216px; display: flex;
  justify-content: space-between; font: 12px/1 Consolas, "Courier New", monospace; letter-spacing: .18em;
  color: var(--mute); }
`,
  },
};

export const frame = stageFrame({ width: 1280, height: 720 });

const offset = (to: { x: number; y: number }, from: { x: number; y: number }): Pose2d => ({
  x: to.x - from.x,
  y: to.y - from.y,
});

const camera = (time: Time): Pose2d =>
  combine([
    sequence(time, [
      [span(500, 1400), (t) => push({ to: 1.12, curve: "in" }, reversed(t))],
      [span(1400, ANT_LEAP), (t) => push({ to: 1.04 }, t)],
      [span(ANT_LEAP, 3500), (t) => push({ to: 1.04, curve: "in" }, reversed(t))],
      [span(MATCH, LENGTH), (t) => push({ to: 1.045, curve: "out" }, t)],
    ]),
    bump({ dy: 50 }, span(ANT_LEAP, 3700).of(time)),
    ...Array.from({ length: 6 }, (_, i) =>
      jolt(
        { distance: 3 + i * i * 0.6, count: 6 },
        span(weightLands(i), weightLands(i) + 550).of(time),
      ),
    ),
    bump({ dy: -40 }, span(WGT_DROP, 6450).of(time)),
    bump({ turn: 0.9 }, span(OVL_IN, 7700).of(time)),
    jolt({ distance: 6, count: 6 }, span(LAND, LAND + 600).of(time)),
    jolt({ distance: 3, count: 5 }, span(PERIOD, PERIOD + 500).of(time)),
  ]);

const dot = (time: Time, rest: Rest): Pose2d => {
  const home = restOf(rest, "dot");
  const period = offset(restOf(rest, "stop"), home);
  const px = period.x ?? 0;
  const py = period.y ?? 0;
  const arrivals = Array.from({ length: 6 }, (_, i) => settleOut(i) + 520 - WIPE);
  return combine([
    sequence(time, [
      [
        span(0, 1250),
        (t) =>
          combine([
            launch(
              { height: 620, squash: 0.42, bulge: 0.81, stretch: 0.9, crouch: 0.5 },
              span(450, 1250).of(t),
            ),
            springSettle({ scale: 0, rings: 2, damping: 4.8 }, span(60, 850).of(t)),
            { y: 20 },
          ]),
      ],
      [
        span(DROP, BURST),
        (t) =>
          combine([
            crouch(
              { squash: 0.38, bulge: 0.79, curve: "out" },
              span(HOP_END - DROP, BURST - DROP).of(t),
            ),
            hop(RETURN_HOP, span(0, HOP_END - DROP).of(t)),
          ]),
      ],
      [
        span(BURST, WIPE - 150),
        (t) =>
          combine([
            springSettle({ squash: 0.38, rings: 3.5, damping: 7 }, t),
            pulse({ amount: 0.45 }, span(0, 220).of(t)),
          ]),
      ],
      [span(WIPE - 150, WIPE), (t) => push({ to: 0.7 }, t)],
      [
        span(WIPE, MATCH),
        (t) =>
          combine([
            springSettle({ scale: 0.7, rings: 2, damping: 5 }, span(0, 650).of(t)),
            ...arrivals.map((at) => pulse({ amount: 0.2 }, span(at, at + 220).of(t))),
          ]),
      ],
      [span(MATCH, LEAP), (t) => crouch({ squash: 0.4, bulge: 0.75 }, t)],
      [
        span(LEAP, PERIOD),
        (t) =>
          combine([
            { x: px, y: py },
            lob({ dx: -px, dy: -py, apex: ARC_APEX, stretch: 0.4 }, t),
            push({ to: PERIOD_SIZE }, t),
          ]),
      ],
      [
        span(PERIOD, LENGTH),
        (t) =>
          combine([
            squish({ squash: 0.42, bulge: 0.7, wobbles: 1 }, span(0, 240).of(t)),
            { x: px, y: py - DOT_RADIUS * (1 - PERIOD_SIZE), scale: PERIOD_SIZE },
            bump({ dy: -16 }, span(0, 240).of(t)),
            squish({ squash: 0.18, bulge: 0.7, wobbles: 1 }, span(240, 520).of(t)),
          ]),
      ],
    ]),
    sequence(time, [
      [span(WIPE, WIPE + 70), (t) => tint({ name: "inked" }, t)],
      [span(MATCH, MATCH + 16), (t) => tint({ name: "inked" }, reversed(t))],
    ]),
  ]);
};

const ring = (
  time: Time,
  rest: Rest,
  name: string,
  at: { x: number; y: number },
  fromMs: number,
  lengthMs: number,
  size: number,
  alpha: number,
): Pose2d =>
  combine([
    { ...offset(at, restOf(rest, name)), scale: 0.2, opacity: alpha },
    shockwave({ grow: size / 0.2 }, span(fromMs, fromMs + lengthMs).of(time)),
  ]);

const anticipateLetter = (time: Time, i: number): Pose2d => {
  const up = ANT_IN + i * 45;
  const down = ANT_CROUCH + i * 35;
  const leap = ANT_LEAP + i * 38;
  const gone = leap + 650;
  return combine([
    launch(
      {
        height: 1300,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (leap - down) / (gone - down),
        tremble: 1.6,
        flight: "accelerate",
      },
      span(down, gone).of(time),
    ),
    springSettle({ dy: 120, turn: 9, rings: 0.7, damping: 3 }, span(up, up + 520).of(time)),
    tint({ name: "charge", curve: "inOut" }, span(down, down + 420).of(time)),
    smudge({ amount: 5, build: 0.46 }, span(leap, gone).of(time)),
  ]);
};

const weightLetter = (time: Time, i: number): Pose2d => {
  const land = weightLands(i);
  const fall = land - 420;
  const leave = weightLeaves(i);
  const plunge = span(WGT_LIFT, leave + 520);
  return combine([
    sequence(time, [
      [
        span(fall, land),
        (t) => lob({ dx: 0, dy: -640, apex: 0, stretch: 0.3, facing: "upright" }, t),
      ],
      [span(land, land + 900), (t) => squish({ squash: 0.24, bulge: 0.67, wobbles: 3.6 }, t)],
    ]),
    anticipate(
      { share: (leave - WGT_LIFT) / (leave + 520 - WGT_LIFT), amount: 14 / 1100 },
      plunge.of(time),
      (t) => rise({ distance: 1100 }, reversed(t)),
    ),
    sequence(time, [
      [span(fall, land), (t) => smudge({ amount: 3 }, t)],
      [span(land, leave), () => ({})],
      [span(leave, leave + 520), (t) => smudge({ amount: 4, build: 0.6 }, t)],
    ]),
  ]);
};

const floor = (time: Time): Pose2d =>
  combine([
    sequence(time, [
      [span(3350, 3800), (t) => open({}, t)],
      [span(WGT_DROP, 6000), (t) => open({}, reversed(t))],
    ]),
    { y: -14 * span(WGT_LIFT, WGT_DROP).of(time, ease.cubicInOut).progress },
    ...Array.from({ length: 6 }, (_, i) =>
      jolt(
        { distance: 2 + i, count: 4, sideways: 0 },
        span(weightLands(i), weightLands(i) + 700).of(time),
      ),
    ),
    tint({ name: "cool" }, span(weightLands(5), weightLands(5) + 700).of(time)),
  ]);

const dust = (time: Time, rest: Rest, j: number): Pose2d => {
  const li = Math.floor(j / 3);
  const kind = j % 3;
  const side = kind === 0 ? -1 : kind === 1 ? 1 : li % 2 ? 1 : -1;
  const letter = restOf(rest, `wgt.${li}`);
  const ground = restOf(rest, "floor");
  const own = restOf(rest, `dust.${j}`);
  const land = weightLands(li);
  return combine([
    {
      x: letter.x + side * letter.width * 0.42 - own.x,
      y: ground.y - ground.height / 2 - 4 - own.y,
      scale: (0.6 + 0.3 * kind) * (li === 5 ? 1.5 : 1),
      opacity: 0.75,
    },
    kick(
      { dx: side * (40 + kind * 28), rise: 10 + 22 * kind, fall: kind === 2 ? 30 : 9 },
      span(land, land + 700).of(time),
    ),
  ]);
};

const bar = (time: Time): number =>
  sequence(time, [
    [span(OVL_IN, OVL_STOP), (t) => slide({ distance: 1250, from: "left" }, t)],
    [
      span(OVL_ANTIC, OVL_GONE),
      (t) =>
        anticipate({ share: 1 / 3, amount: 55 / 1450 }, t, (u) =>
          slide({ distance: 1450, from: "right" }, reversed(u)),
        ),
    ],
  ]).x ?? 0;

const settleLetter = (time: Time, rest: Rest, i: number): Pose2d => {
  const home = restOf(rest, `sett.${i}`);
  const into = offset(restOf(rest, "dot"), home);
  const dx = into.x ?? 0;
  const dy = into.y ?? 0;
  const turn = SETTLE_TURN[i] ?? 0;
  const out = settleIn(i);
  const back = settleOut(i);
  return combine([
    sequence(time, [
      [
        span(out, out + 1300),
        (t) => springSettle({ dx, dy, lift: 70, turn, scale: 0.15, rings: 2.2, damping: 4.7 }, t),
      ],
      [
        span(back, back + 520),
        (t) => implode({ dx, dy, lean: 2.2, scale: 0.05, turn: turn * 0.5 }, t),
      ],
    ]),
    sequence(time, [
      [span(out, out + 220), (t) => smudge({ amount: 4 }, reversed(t))],
      [span(back, back + 520), (t) => smudge({ amount: 3 }, t)],
    ]),
    tint({ name: "inked" }, span(WIPE + 150, WIPE + 300).of(time)),
  ]);
};

const underline = (time: Time): Pose2d =>
  combine([
    sequence(time, [
      [span(UNDERLINE, UNDERLINE + 500), (t) => spread({}, span(0, 500).of(t, ease.cubicOut))],
      [span(COLL - 100, COLL + 200), (t) => spread({}, reversed(span(0, 300).of(t, ease.cubicIn)))],
    ]),
    tint({ name: "inked" }, span(WIPE + 150, WIPE + 300).of(time)),
  ]);

const field = (time: Time, rest: Rest): Pose2d => {
  const centre = offset(restOf(rest, "dot"), {
    x: restOf(rest, "field").x - restOf(rest, "field").width / 2,
    y: restOf(rest, "field").y - restOf(rest, "field").height / 2,
  });
  const at = { radius: 800, x: centre.x ?? 0, y: centre.y ?? 0 };
  return sequence(time, [
    [span(WIPE, WIPE + 600), (t) => wipe(at, span(0, 600).of(t, ease.cubicOut))],
    [span(SHRINK, MATCH), (t) => wipe(at, reversed(span(0, MATCH - SHRINK).of(t, ease.cubicIn)))],
  ]);
};

const finWord = (time: Time, i: number): Pose2d => {
  const up = MATCH + i * 110;
  const ripple = PERIOD + (2 - i) * 45;
  return combine([
    springSettle({ dy: 130, turn: 5, rings: 0.7, damping: 3 }, span(up, up + 650).of(time)),
    jolt({ distance: 6, count: 2, sideways: 0 }, span(ripple, ripple + 700).of(time)),
  ]);
};

const credit = (time: Time): Pose2d => {
  const t = span(CREDIT, CREDIT + 600).of(time);
  return combine([
    rise({ distance: 14 }, t),
    fade({}, span(CREDIT, CREDIT + 600).of(time, ease.quadOut)),
  ]);
};

/** Every member's value at `time`. */
export const scene = (time: Time, _events: Events, rest: Rest) => {
  const home = restOf(rest, "dot");
  const stop = restOf(rest, "stop");
  return {
    camera: camera(time),
    field: field(time, rest),
    trailUp: streak({ arrive: 0.43, lag: 0.17 }, span(850, 1450).of(time)),
    trailArc: streak({ arrive: 0.65, lag: 0.21 }, span(LEAP, PERIOD + 350).of(time)),
    underline: underline(time),
    ant: Array.from({ length: 10 }, (_, i) => anticipateLetter(time, i)),
    floor: floor(time),
    wgt: Array.from({ length: WEIGHT.length }, (_, i) => weightLetter(time, i)),
    dust: Array.from({ length: 18 }, (_, j) => dust(time, rest, j)),
    overlap: { x: bar(time) },
    bar: {},
    hang: STRINGS.map((length, i) =>
      dangle({ length: length + 50, damping: 0.18, gain: 1, lag: i * 28, limit: 63 }, time, {
        carrier: bar,
      }),
    ),
    sett: Array.from({ length: 6 }, (_, i) => settleLetter(time, rest, i)),
    fin: {},
    fine: Array.from({ length: 3 }, (_, i) => finWord(time, i)),
    stop: {},
    credit: Array.from({ length: 7 }, () => credit(time)),
    ringLaunch: ring(time, rest, "ringLaunch", { x: home.x, y: home.y + 38 }, 850, 600, 2.2, 0.9),
    ringLand: ring(time, rest, "ringLand", { x: home.x, y: home.y + 18 }, LAND, 550, 1.6, 0.8),
    ringBurst: ring(time, rest, "ringBurst", home, BURST, 700, 4.2, 0.9),
    ringPeriod: ring(time, rest, "ringPeriod", { x: stop.x, y: stop.y + 6 }, PERIOD, 500, 0.8, 0.7),
    dot: dot(time, rest),
    vignette: {},
    hud: combine([
      { opacity: 0.55 },
      fade({}, span(200, 600).of(time)),
      fade({}, reversed(span(12600, 13000).of(time))),
    ]),
    label: {},
    timecode: {},
  };
};
