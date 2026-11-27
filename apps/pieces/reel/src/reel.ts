import {
  aim,
  ease,
  easeTo,
  isInputEntry,
  mergeInput,
  mix,
  motion,
  orbit,
  span,
  state,
  type Lens3d,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { fade, pop, react, rise, unfold } from "@gerak/moves";
import {
  beat,
  bindEach,
  box,
  object,
  scene,
  shot,
  stagger,
  text,
  type MotionContext,
} from "@gerak/stage";
import captionCues from "./captions.cues.json" with { type: "json" };
import captionWords from "./captions.words.json" with { type: "json" };
import musicCues from "./music.cues.json" with { type: "json" };

/** Reel frame size in px; the HTML root and Three.js renderer size from it. */
export const size = { width: 1080, height: 1920 } as const;

const DIAL_TARGET = { x: -0.08, y: 0.02, z: 0 } as const;
const START_EYE = orbit({ target: DIAL_TARGET, radius: 7.4, azimuth: -38, elevation: 54 });

/** Initial camera lens used when constructing the stage camera. */
export const lens: Lens3d = { ...START_EYE, ...aim(START_EYE, DIAL_TARGET), fov: 44 };

function beatAt(index: number): number {
  const cue = musicCues[index];
  if (cue === undefined) throw new Error(`Missing beat cue at index ${index}`);
  return cue.at;
}

const fadeOut = motion((t: Time): Pose2d => ({ opacity: 1 - ease.quadInOut(t.progress) }));
const fadeIn = motion((t: Time): Pose2d => ({ opacity: ease.quadInOut(t.progress) }));

const wordRise = motion(
  (t: Time): Pose2d => ({
    y: 44 * (1 - ease.cubicOut(t.progress)),
    opacity: ease.quadOut(t.progress),
  }),
);

// Shot 1: kinetic title hook (0..2500 ms).
const hookEnter = beat("enter", 520, { at: 0 });
const hookWords = beat("words", 900, { at: 60 });
const hookRuleIn = beat("ruleIn", 540, { at: 260 });
const hookRingIn = beat("ringIn", 480, { at: 320 });
const hookDissolve = beat("dissolve", 400, { at: 2100 });
const hookBeatScale = react({ on: ["beat"], kind: "recoil", amplitude: 0.14, decay: 10 });

const hookScene = scene(
  { name: "hook" },
  box("hookBg").moves(fadeOut.in(hookDissolve).take()),
  box("hookEyebrow").moves(
    rise({ distance: 26 }).in(hookEnter, ease.cubicOut),
    fade().in(span(0, 320)),
    fadeOut.in(hookDissolve).take(),
  ),
  text("hookTitle", { split: "words" }).moves(
    stagger(wordRise, { spread: 0.42 }).in(hookWords),
    fadeOut.in(hookDissolve).take(),
  ),
  box("hookRule").moves(
    unfold({ from: "left" }).in(hookRuleIn, ease.expoOut),
    fadeOut.in(hookDissolve).take(),
  ),
  box("hookRing").moves(
    pop({ overshoot: 0.14 }).in(hookRingIn),
    fade().in(span(320, 560)),
    (t: Time, ctx: MotionContext): Pose2d => {
      const p = span(2050, 2500).of(t, ease.cubicIn).progress;
      const pulse = hookBeatScale(ctx.time, ctx.events) * (1 - p);
      return { y: -110 * p, scale: 1 + pulse + 0.65 * p, opacity: 1 - p };
    },
  ),
);

// Shot 2: 3D product reveal (overlap 400 ms, ending on music beat 13 = 6500 ms).
const revealEnter = beat("enter", 1100, { at: 0 });
const revealCamera = beat("camera", 2400, { at: 0 });
const revealPips = beat("pips", 1400, { at: 500 });
const revealTagIn = beat("tagIn", 520, { at: 450 });
const revealOut = beat("out", 400, { at: 4000 });

const detentTurn = (time: Time): number => {
  const s1 = span(1500, 1840).of(time, ease.backOut).progress;
  const s2 = span(2000, 2340).of(time, ease.backOut).progress;
  const s3 = span(2500, 2860).of(time, ease.backOut).progress;
  return (s1 + s2 + s3) * 45;
};

const pipRise = motion(
  (t: Time): Pose3d => ({
    y: 0.34 * (1 - ease.cubicOut(t.progress)),
    scale: mix(0.05, 1, ease.backOut(t.progress)),
  }),
);

const revealScene = scene(
  { name: "reveal" },
  object("camera")
    .limits({ jump: 0.5, turn: 30 })
    .moves(
      motion((t: Time): Pose3d => {
        const p = ease.cubicInOut(t.progress);
        const eye = orbit({
          target: DIAL_TARGET,
          radius: mix(7.4, 6.0, p),
          azimuth: mix(-38, 26, p),
          elevation: mix(54, 24, p),
        });
        return { ...eye, ...aim(eye, DIAL_TARGET) };
      }).in(revealCamera),
    ),
  object("dial")
    .limits({ jump: 0.3, turn: 30 })
    .moves(
      motion(
        (t: Time): Pose3d => ({
          y: -0.65 * (1 - ease.cubicOut(t.progress)),
          rotationY: -24 * (1 - ease.cubicOut(t.progress)),
        }),
      ).in(revealEnter),
    ),
  object("knob")
    .limits({ jump: 0.3, turn: 30 })
    .moves(
      motion((t: Time): Pose3d => {
        const dropP = span(500, 1250).of(t, ease.cubicOut).progress;
        return { y: 0.42 * (1 - dropP), rotationY: detentTurn(t) };
      }),
    ),
  object("pips", { parts: true })
    .limits({ jump: 0.3, turn: 30 })
    .moves(stagger(pipRise, { spread: 0.55 }).in(revealPips)),
  box("specTag").moves(
    rise({ distance: 26 }).in(revealTagIn, ease.cubicOut),
    fade().in(span(450, 760)),
    fadeOut.in(revealOut).take(),
  ),
  box("specSub").moves(
    rise({ distance: 24 }).in(span(620, 1080), ease.cubicOut),
    fade().in(span(620, 920)),
    fadeOut.in(revealOut).take(),
  ),
);

// Shot 3: kinetic caption proof driven by captions.cues.json and captions.words.json.
const proofBgIn = beat("bgIn", 400, { at: 0 });
const proofLabelIn = beat("labelIn", 460, { at: 320 });
const proofFadeOut = beat("out", 400, { at: 3000 });
const wordCount = state(0, (cur, ev) =>
  ev.name === "word" && typeof ev.value === "number" ? ev.value : cur,
);
const wordReveals = captionWords.map((_, index) =>
  easeTo(wordCount, (count) => (index < count ? 1 : 0), {
    ms: 160,
    delayMs: (index % 3) * 85,
    ease: ease.cubicOut,
  }),
);
const barPulse = react({ on: ["beat"], kind: "recoil", amplitude: 0.55, decay: 11 });

const proofScene = scene(
  { name: "proof" },
  box("proofBg").moves(fadeIn.in(proofBgIn).take()),
  box("proofLabel").moves(
    rise({ distance: 24 }).in(proofLabelIn, ease.cubicOut),
    fade().in(span(320, 620)),
    fadeOut.in(proofFadeOut).take(),
  ),
  text("caption", { split: "words" }).moves(
    bindEach({
      opacity: (i) => (t, ev) => {
        const reveal = wordReveals[i]?.(t, ev) ?? 1;
        const exit = 1 - span(3000, 3400).of(t, ease.quadInOut).progress;
        return mix(0.06, 1, reveal) * exit;
      },
      y: (i) => (t, ev) => 20 * (1 - (wordReveals[i]?.(t, ev) ?? 1)),
    }),
  ),
  box("beatBar", { parts: true }).moves(
    fade().in(span(320, 560)),
    bindEach({
      scaleY: (i) => (t, ev) => {
        const active = span(320, 560).of(t, ease.quadOut).progress;
        const tail = 1 - span(2650, 3150).of(t, ease.quadOut).progress;
        const boost = barPulse(t, ev) * Math.max(0.4, 1 - i * 0.12) * active * tail;
        return 0.3 + boost;
      },
      opacity: () => (t) => 1 - span(2950, 3350).of(t, ease.quadInOut).progress,
    }),
  ),
);

// Shot 4: final CTA holding still for > 2s.
const ctaBgIn = beat("bgIn", 400, { at: 0 });
const ctaMarkIn = beat("markIn", 520, { at: 140 });
const ctaTitleIn = beat("titleIn", 540, { at: 220 });
const ctaSubIn = beat("subIn", 460, { at: 340 });
const ctaButtonIn = beat("buttonIn", 480, { at: 440 });

const ctaScene = scene(
  { name: "cta" },
  box("ctaBg").moves(fadeIn.in(ctaBgIn).take()),
  box("ctaMark").moves(pop({ overshoot: 0.14 }).in(ctaMarkIn), fade().in(span(140, 360))),
  text("ctaTitle", { split: "words" }).moves(stagger(wordRise, { spread: 0.3 }).in(ctaTitleIn)),
  box("ctaSub").moves(
    rise({ distance: 26 }).in(ctaSubIn, ease.cubicOut),
    fade().in(span(340, 620)),
  ),
  box("ctaButton").moves(
    rise({ distance: 28 }).in(ctaButtonIn, ease.cubicOut),
    pop({ overshoot: 0.08 }).in(ctaButtonIn),
    fade().in(span(440, 680)),
  ),
);

export default scene(
  {
    name: "reel",
    cues: mergeInput(musicCues.filter(isInputEntry), captionCues.filter(isInputEntry)),
  },
  shot(hookScene, { name: "hook", until: beatAt(5) }),
  shot(revealScene, { name: "reveal", overlap: 400, until: beatAt(13) }),
  shot(proofScene, { name: "proof", overlap: 400, until: beatAt(19) }),
  shot(ctaScene, { name: "cta", overlap: 400, length: 2900 }),
);
