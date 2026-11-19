import {
  combine,
  ease,
  elapsedOf,
  mix,
  motion,
  reversed,
  sequence,
  span,
  type Cubic2d,
  type Pose2d,
  type Time,
  anticipation,
  NO_EVENTS,
} from "@gerak/core";
import { fade, hop, hopLandings, pulse, rise, slide, wipe, smudge } from "@gerak/moves";
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
import { spread } from "./moves/spread";
import { springSettle } from "./moves/spring-settle";
import { squish } from "./moves/squish";
import { streak } from "./moves/streak";
import { tint } from "./moves/tint";
import { partOf, withScene } from "./scene-motion";

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
const LAND = mix(DROP, HOP_END, hopLandings(RETURN_HOP).landings[0] ?? 0.6);

const weightLands = (i: number) => WGT_LAND + i * 165 + (i === 5 ? 90 : 0);
const weightLeaves = (i: number) => WGT_DROP + Math.abs(i - 2.5) * 30;
const settleIn = (i: number) => BURST + (Math.abs(i - 2.5) - 0.5) * 55;
const settleOut = (i: number) => COLL + (2 - (Math.abs(i - 2.5) - 0.5)) * 50;
const SETTLE_TURN = [-48, 30, -16, 18, -30, 50];
const STRINGS = [140, 185, 160, 200, 170, 210, 180];
const WEIGHT = "WEIGHT";

const LABELS = [
  [span(0, 1250), "00 — ORIGIN"],
  [span(ANT_IN, 4000), "01 — ANTICIPATION"],
  [span(3350, 6350), "02 — WEIGHT"],
  [span(OVL_IN, OVL_GONE + 100), "03 — OVERLAP"],
  [span(DROP, MATCH), "04 — SETTLE"],
] as const;
const pad = (value: number) => String(value).padStart(2, "0");
const label = (time: Time) =>
  sequence(
    time,
    LABELS.map(([range, said]) => [range, () => said] as const),
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
const arcPath = (rest: RestReader): readonly Cubic2d[] => {
  const dot = rest.get("dot");
  const stop = rest.get("stop");
  const top = Math.min(dot.y, stop.y) - ARC_APEX;
  return [quad(dot, { x: (dot.x + stop.x) / 2, y: top }, stop, "arc")];
};

const launchPath = (rest: RestReader): readonly Cubic2d[] => {
  const dot = rest.get("dot");
  return [line({ x: dot.x, y: dot.y + 20 }, { x: dot.x, y: -140 }, "up")];
};

const underlinePath = (rest: RestReader): readonly Cubic2d[] => {
  const dot = rest.get("dot");
  const first = rest.get("sett.0");
  const last = rest.get("sett.5");
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

const STRING_CSS = STRINGS.map(
  (height, i) => `[data-cast="hang.${i}"]::before { height: ${height}px; }`,
).join("\n");

const domCss = `
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
`;

const offset = (to: { x: number; y: number }, from: { x: number; y: number }): Pose2d => ({
  x: to.x - from.x,
  y: to.y - from.y,
});

/** The span a staggered run of `parts` lanes fills: each lane `length` ms, each starting `step` after the last. */
const lanesOf = (from: number, length: number, step: number, parts: number) =>
  span(from, from + length + (parts - 1) * step);

const reel = {
  origin: beat("origin", 1250),
  launch: beat("launch", 600, { at: 850 }),
  anticipation: beat("anticipation", 3000, { at: ANT_IN }),
  weight: beat("weight", 3000, { at: 3350 }),
  overlap: beat("overlap", OVL_GONE + 100 - OVL_IN, { at: OVL_IN }),
  settle: beat("settle", MATCH - DROP, { at: DROP }),
  landing: beat("landing", 550, { at: LAND }),
  burst: beat("burst", 700, { at: BURST }),
  flood: beat("flood", MATCH - WIPE, { at: WIPE }),
  finale: beat("finale", LENGTH - MATCH, { at: MATCH }),
  fullStop: beat("fullStop", 500, { at: PERIOD }),
};
const thud0 = beat("thud0", 700, { at: weightLands(0) });
const thud5 = beat("thud5", 700, { at: weightLands(5) });

const field = box("field");
const trailUp = shape("trailUp", launchPath);
const trailArc = shape("trailArc", arcPath);
const underline = shape("underline", underlinePath);
const ants = text("ant", "ANTICIPATE", { split: "letters" });
const floor = box("floor");
const wgts = text("wgt", WEIGHT, { split: "letters" });
const dust = many("dust", 18);
const bar = box("bar");
const hang = text("hang", "OVERLAP", { split: "letters" });
const overlap = group("overlap", [bar, hang]);
const sett = text("sett", "SETTLE", { split: "letters" });
const fine = text("fine", "Timing is everything", { split: "words" });
const stop = box("stop");
const fin = group("fin", [fine, stop]);
const credit = text("credit", "CLAUDE · MOTION DESIGN · REEL 2026", { split: "words" });
const ringLaunch = box("ringLaunch");
const ringLand = box("ringLand");
const ringBurst = box("ringBurst");
const ringPeriod = box("ringPeriod");
const dot = box("dot");
const camera = group("camera", [
  field,
  trailUp,
  trailArc,
  underline,
  ants,
  floor,
  wgts,
  dust,
  overlap,
  sett,
  fin,
  credit,
  ringLaunch,
  ringLand,
  ringBurst,
  ringPeriod,
  dot,
]);
const vignette = box("vignette");
const labelEl = text("label", label);
const timecodeEl = text("timecode", timecode);
const hud = group("hud", [labelEl, timecodeEl]);

const bar0 = (time: Time): number =>
  sequence(time, [
    [span(OVL_IN, OVL_STOP), (t) => slide({ distance: 1250, from: "left" })(t)],
    [
      span(OVL_ANTIC, OVL_GONE),
      (t) =>
        anticipation({ share: 1 / 3, amount: 55 / 1450 })((u) =>
          slide({ distance: 1450, from: "right" })(reversed(u)),
        )(t, NO_EVENTS),
    ],
  ]).x ?? 0;

const fieldAt = (rest: RestReader) => {
  const centre = offset(rest.get("dot"), {
    x: rest.get("field").x - rest.get("field").width / 2,
    y: rest.get("field").y - rest.get("field").height / 2,
  });
  return { radius: 800, x: centre.x ?? 0, y: centre.y ?? 0 };
};

const spreadIn = (from: number, ms: number, curve: (p: number) => number) =>
  motion((t: Time) => spread({})(span(0, ms).of(t, curve))).in(span(from, from + ms));

const dotRun = withScene((time, { rest }) => {
  const home = rest.get("dot");
  const period = offset(rest.get("stop"), home);
  const px = period.x ?? 0;
  const py = period.y ?? 0;
  const arrivals = Array.from({ length: 6 }, (_, i) => settleOut(i) + 520 - WIPE);
  return sequence(time, [
    [
      span(0, 1250),
      (t) =>
        combine([
          launch({ height: 620, squash: 0.42, bulge: 0.81, stretch: 0.9, crouch: 0.5 })(
            span(450, 1250).of(t),
          ),
          springSettle({ scale: 0, rings: 2, damping: 4.8 })(span(60, 850).of(t)),
          { y: 20 },
        ]),
    ],
    [
      span(DROP, BURST),
      (t) =>
        combine([
          crouch({ squash: 0.38, bulge: 0.79, curve: "out" })(
            span(HOP_END - DROP, BURST - DROP).of(t),
          ),
          hop(RETURN_HOP)(span(0, HOP_END - DROP).of(t)),
        ]),
    ],
    [
      span(BURST, WIPE - 150),
      (t) =>
        combine([
          springSettle({ squash: 0.38, rings: 3.5, damping: 7 })(t),
          pulse({ amount: 0.45 })(span(0, 220).of(t)),
        ]),
    ],
    [span(WIPE - 150, WIPE), (t) => push({ to: 0.7 })(t)],
    [
      span(WIPE, MATCH),
      (t) =>
        combine([
          springSettle({ scale: 0.7, rings: 2, damping: 5 })(span(0, 650).of(t)),
          ...arrivals.map((at) => pulse({ amount: 0.2 })(span(at, at + 220).of(t))),
        ]),
    ],
    [span(MATCH, LEAP), (t) => crouch({ squash: 0.4, bulge: 0.75 })(t)],
    [
      span(LEAP, PERIOD),
      (t) =>
        combine([
          { x: px, y: py },
          lob({ dx: -px, dy: -py, apex: ARC_APEX, stretch: 0.4 })(t),
          push({ to: PERIOD_SIZE })(t),
        ]),
    ],
    [
      span(PERIOD, LENGTH),
      (t) =>
        combine([
          squish({ squash: 0.42, bulge: 0.7, wobbles: 1 })(span(0, 240).of(t)),
          { x: px, y: py - DOT_RADIUS * (1 - PERIOD_SIZE), scale: PERIOD_SIZE },
          bump({ dy: -16 })(span(0, 240).of(t)),
          squish({ squash: 0.18, bulge: 0.7, wobbles: 1 })(span(240, 520).of(t)),
        ]),
    ],
  ]);
});

const weightRun = withScene((time, context) => {
  const i = partOf(context);
  const land = weightLands(i);
  const fall = land - 420;
  const leave = weightLeaves(i);
  const plunge = span(WGT_LIFT, leave + 520);
  return combine([
    sequence(time, [
      [
        span(fall, land),
        (t) => lob({ dx: 0, dy: -640, apex: 0, stretch: 0.3, facing: "upright" })(t),
      ],
      [span(land, land + 900), (t) => squish({ squash: 0.24, bulge: 0.67, wobbles: 3.6 })(t)],
    ]),
    anticipation({ share: (leave - WGT_LIFT) / (leave + 520 - WGT_LIFT), amount: 14 / 1100 })((t) =>
      rise({ distance: 1100 })(reversed(t)),
    )(plunge.of(time), NO_EVENTS),
    sequence(time, [
      [span(fall, land), (t) => smudge({ amount: 3 })(t)],
      [span(land, leave), () => ({})],
      [span(leave, leave + 520), (t) => smudge({ amount: 4, build: 0.6 })(t)],
    ]),
  ]);
});

const dustRun = withScene((time, context) => {
  const j = partOf(context);
  const li = Math.floor(j / 3);
  const kind = j % 3;
  const side = kind === 0 ? -1 : kind === 1 ? 1 : li % 2 ? 1 : -1;
  const letter = context.rest.get(`wgt.${li}`);
  const ground = context.rest.get("floor");
  const own = context.rest.get(`dust.${j}`);
  const land = weightLands(li);
  return combine([
    {
      x: letter.x + side * letter.width * 0.42 - own.x,
      y: ground.y - ground.height / 2 - 4 - own.y,
      scale: (0.6 + 0.3 * kind) * (li === 5 ? 1.5 : 1),
      opacity: (elapsedOf(time.clock) ?? 0) < land ? 0 : 0.75,
    },
    kick({ dx: side * (40 + kind * 28), rise: 10 + 22 * kind, fall: kind === 2 ? 30 : 9 })(
      span(land, land + 700).of(time),
    ),
  ]);
});

const settleRun = withScene((time, context) => {
  const i = partOf(context);
  const home = context.rest.get(`sett.${i}`);
  const into = offset(context.rest.get("dot"), home);
  const dx = into.x ?? 0;
  const dy = into.y ?? 0;
  const turn = SETTLE_TURN[i] ?? 0;
  const out = settleIn(i);
  const back = settleOut(i);
  return sequence(time, [
    [
      span(out, out + 1300),
      (t) => springSettle({ dx, dy, lift: 70, turn, scale: 0.15, rings: 2.2, damping: 4.7 })(t),
    ],
    [
      span(back, back + 520),
      (t) => implode({ dx, dy, lean: 2.2, scale: 0.05, turn: turn * 0.5 })(t),
    ],
  ]);
});

/** A ring pinned to a point of the frame, small and faint, then grown by a shockwave. */
const ringAt = (
  name: string,
  at: (
    home: { x: number; y: number },
    stopAt: { x: number; y: number },
  ) => { x: number; y: number },
  from: number,
  ms: number,
  size: number,
  alpha: number,
) => [
  withScene((_time, { rest }) => offset(at(rest.get("dot"), rest.get("stop")), rest.get(name))),
  bind({ scale: () => 0.2, opacity: () => alpha }),
  shockwave({ grow: size / 0.2 }).in(span(from, from + ms)),
];

/** How the DOM renderer draws this piece. */
export const skin = { css: domCss };

export default sceneBuilder({
  frame: { width: 1280, height: 720 },
})
  .element(camera)
  .motion(
    motion((t: Time) => push({ to: 1.12, curve: "in" })(reversed(t))).in(span(500, 1400)),
    push({ to: 1.04 }).in(span(1400, ANT_LEAP)).take(),
    motion((t: Time) => push({ to: 1.04, curve: "in" })(reversed(t)))
      .in(span(ANT_LEAP, 3500))
      .take(),
    push({ to: 1.045, curve: "out" }).in(span(MATCH, LENGTH)).take(),
    bump({ dy: 50 }).in(span(ANT_LEAP, 3700)),
    ...Array.from({ length: 6 }, (_, i) =>
      jolt({ distance: 3 + i * i * 0.6, count: 6 }).in(span(weightLands(i), weightLands(i) + 550)),
    ),
    bump({ dy: -40 }).in(span(WGT_DROP, 6450)),
    bump({ turn: 0.9 }).in(span(OVL_IN, 7700)),
    jolt({ distance: 6, count: 6 }).in(span(LAND, LAND + 600)),
    jolt({ distance: 3, count: 5 }).in(span(PERIOD, PERIOD + 500)),
  )
  .element(field)
  .show(reel.flood)
  .motion(
    withScene((time, { rest }) => wipe(fieldAt(rest))(span(0, 600).of(time, ease.cubicOut))).in(
      span(WIPE, WIPE + 600),
    ),
    withScene((time, { rest }) =>
      wipe(fieldAt(rest))(reversed(span(0, MATCH - SHRINK).of(time, ease.cubicIn))),
    )
      .in(span(SHRINK, MATCH))
      .take(),
  )
  .element(trailUp)
  .motion(streak({ arrive: 0.43, lag: 0.34 }).in(span(850, 1450)))
  .element(trailArc)
  .motion(streak({ arrive: 0.65, lag: 0.21 }).in(span(LEAP, PERIOD + 350)))
  .element(underline)
  .motion(
    spreadIn(UNDERLINE, 500, ease.cubicOut),
    motion((t: Time) => spread({})(reversed(span(0, 300).of(t, ease.cubicIn))))
      .in(span(COLL - 100, COLL + 200))
      .take(),
    tint({ name: "inked" }).in(span(WIPE + 150, WIPE + 300)),
  )
  .element(ants)
  .show(reel.anticipation)
  .motion(
    withScene((time, context) => {
      const i = partOf(context);
      const down = ANT_CROUCH + i * 35;
      const leap = ANT_LEAP + i * 38;
      const gone = leap + 650;
      return launch({
        height: 1300,
        squash: 0.3,
        bulge: 0.33,
        stretch: 0.45,
        crouch: (leap - down) / (gone - down),
        tremble: 1.6,
        flight: "accelerate",
      })(span(down, gone).of(time));
    }),
    stagger(springSettle({ dy: 120, turn: 9, rings: 0.7, damping: 3 }), { spread: 45 / 520 }).in(
      lanesOf(ANT_IN, 520, 45, 10),
    ),
    stagger(tint({ name: "charge", curve: "inOut" }), { spread: 35 / 420 }).in(
      lanesOf(ANT_CROUCH, 420, 35, 10),
    ),
    stagger(smudge({ amount: 5, build: 0.46 }), { spread: 38 / 650 }).in(
      lanesOf(ANT_LEAP, 650, 38, 10),
    ),
  )
  .element(floor)
  .show(reel.weight)
  .motion(
    open({}).in(span(3350, 3800)),
    motion((t: Time) => open({})(reversed(t)))
      .in(span(WGT_DROP, 6000))
      .take(),
    bind({ y: (time) => -14 * span(WGT_LIFT, WGT_DROP).of(time, ease.cubicInOut).progress }),
    ...Array.from({ length: 6 }, (_, i) =>
      jolt({ distance: 2 + i, count: 4, sideways: 0 }).in(
        span(weightLands(i), weightLands(i) + 700),
      ),
    ),
    tint({ name: "cool" }).in(span(weightLands(5), weightLands(5) + 700)),
  )
  .element(wgts)
  .show(reel.weight)
  .motion(weightRun)
  .element(dust)
  .show([thud0, thud5])
  .motion(dustRun)
  .element(overlap)
  .show(reel.overlap)
  .motion(motion((t: Time): Pose2d => ({ x: bar0(t) })))
  .element(hang)
  .motion(
    withScene((time, context) => {
      const i = partOf(context);
      const length = STRINGS[i] ?? 0;
      return dangle({
        length: length + 50,
        pace: Math.sqrt((length + 50) / length),
        damping: 0.18,
        gain: 0.6,
        lag: i * 28,
        limit: 63,
        carrier: bar0,
      })(time);
    }),
  )
  .element(sett)
  .show([reel.burst, reel.flood])
  .motion(
    settleRun,
    stagger(
      motion((t: Time) => smudge({ amount: 4 })(reversed(t))),
      { spread: 55 / 220, from: "center" },
    ).in(lanesOf(BURST, 220, 55, 3)),
    stagger(smudge({ amount: 3 }), { spread: 50 / 520, from: "edges" }).in(
      lanesOf(COLL, 520, 50, 3),
    ),
    tint({ name: "inked" }).in(span(WIPE + 150, WIPE + 300)),
  )
  .element(fin)
  .show(reel.finale)
  .element(fine)
  .motion(
    stagger(springSettle({ dy: 130, turn: 5, rings: 0.7, damping: 3 }), { spread: 110 / 650 }).in(
      lanesOf(MATCH, 650, 110, 3),
    ),
    stagger(jolt({ distance: 6, count: 2, sideways: 0 }), { spread: 45 / 700, from: "end" }).in(
      lanesOf(PERIOD, 700, 45, 3),
    ),
  )
  .element(credit)
  .show(reel.finale)
  .motion(
    rise({ distance: 14 }).in(span(CREDIT, CREDIT + 600)),
    motion((t: Time) => fade()(span(0, 600).of(t, ease.quadOut))).in(span(CREDIT, CREDIT + 600)),
  )
  .element(ringLaunch)
  .show(reel.launch)
  .motion(...ringAt("ringLaunch", (home) => ({ x: home.x, y: home.y + 38 }), 850, 600, 2.2, 0.9))
  .element(ringLand)
  .show(reel.landing)
  .motion(...ringAt("ringLand", (home) => ({ x: home.x, y: home.y + 18 }), LAND, 550, 1.6, 0.8))
  .element(ringBurst)
  .show(reel.burst)
  .motion(...ringAt("ringBurst", (home) => home, BURST, 700, 4.2, 0.9))
  .element(ringPeriod)
  .show(reel.fullStop)
  .motion(
    ...ringAt(
      "ringPeriod",
      (_home, stopAt) => ({ x: stopAt.x, y: stopAt.y + 6 }),
      PERIOD,
      500,
      0.8,
      0.7,
    ),
  )
  .element(dot)
  .show(reel.origin, [reel.settle, reel.finale])
  .motion(
    dotRun,
    tint({ name: "inked" }).in(span(WIPE, WIPE + 70)),
    motion((t: Time) => tint({ name: "inked" })(reversed(t)))
      .in(span(MATCH, MATCH + 16))
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
