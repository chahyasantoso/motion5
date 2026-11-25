import { ease, easeTo, motion, span, state, type Pose2d, type Time } from "@gerak/core";
import { fade, rise, unfold } from "@gerak/moves";
import { beat, bindEach, box, scene, shot, stagger, text } from "@gerak/stage";
import captionCues from "./captions.cues.json" with { type: "json" };
import captionWords from "./captions.words.json" with { type: "json" };

const fadeIn = motion((t: Time): Pose2d => ({ opacity: ease.quadInOut(t.progress) }));
const fadeOut = motion((t: Time): Pose2d => ({ opacity: 1 - ease.quadInOut(t.progress) }));

const wordRise = motion(
  (t: Time): Pose2d => ({
    y: 36 * (1 - ease.cubicOut(t.progress)),
    opacity: ease.quadOut(t.progress),
  }),
);

// Shot 1: editorial title lockup (0..2200 ms).
const titleEyebrowIn = beat("eyebrowIn", 420, { at: 0 });
const titleHeadIn = beat("headIn", 820, { at: 80 });
const titleRuleIn = beat("ruleIn", 480, { at: 340 });
const titleSubIn = beat("subIn", 440, { at: 460 });
const titleFgOut = beat("fgOut", 170, { at: 1860 });
const titleBgOut = beat("bgOut", 340, { at: 1860 });

const titleShot = scene(
  { name: "title" },
  box("titleBg").moves(fadeOut.in(titleBgOut).take()),
  box("titleEyebrow").moves(
    rise({ distance: 24 }).in(titleEyebrowIn, ease.cubicOut),
    fade().in(span(0, 280)),
    fadeOut.in(titleFgOut).take(),
  ),
  text("titleHead", { split: "words" }).moves(
    stagger(wordRise, { spread: 0.45 }).in(titleHeadIn),
    fadeOut.in(titleFgOut).take(),
  ),
  box("titleRule").moves(
    unfold({ from: "left" }).in(titleRuleIn, ease.expoOut),
    fadeOut.in(titleFgOut).take(),
  ),
  box("titleSub").moves(
    rise({ distance: 24 }).in(titleSubIn, ease.cubicOut),
    fade().in(span(460, 740)),
    fadeOut.in(titleFgOut).take(),
  ),
);

// Shot 2: device-framed screen recording with cue-driven word captions (1860..7060 ms).
const demoBgIn = beat("bgIn", 340, { at: 0 });
const demoTagIn = beat("tagIn", 380, { at: 180 });
const demoDeviceIn = beat("deviceIn", 540, { at: 180 });
const demoCapLabelIn = beat("capLabelIn", 340, { at: 380 });
const demoFgOut = beat("fgOut", 170, { at: 4860 });

const wordCount = state(0, (cur, ev) =>
  ev.name === "word" && typeof ev.value === "number" ? ev.value : cur,
);
const lineEnds = captionCues.map((cue) => cue.value);
const wordLineOffsets = captionWords.map((_, index) => {
  let lineStart = 0;
  for (const end of lineEnds) {
    if (index < end) return index - lineStart;
    lineStart = end;
  }
  return 0;
});
const wordReveals = captionWords.map((_, index) =>
  easeTo(wordCount, (count) => (index < count ? 1 : 0), {
    ms: 180,
    delayMs: (wordLineOffsets[index] ?? 0) * 110,
    ease: ease.cubicOut,
  }),
);

const demoShot = scene(
  { name: "demo" },
  box("demoBg").moves(fadeIn.in(demoBgIn).take()),
  box("demoTag").moves(
    rise({ distance: 20 }).in(demoTagIn, ease.cubicOut),
    fade().in(span(180, 420)),
    fadeOut.in(demoFgOut).take(),
  ),
  box("deviceShell").moves(
    rise({ distance: 44 }).in(demoDeviceIn, ease.cubicOut),
    fade().in(span(180, 440)),
    fadeOut.in(demoFgOut).take(),
  ),
  box("screen", { media: true }),
  box("captionLabel").moves(
    rise({ distance: 18 }).in(demoCapLabelIn, ease.cubicOut),
    fade().in(span(380, 560)),
    fadeOut.in(demoFgOut).take(),
  ),
  text("caption", { split: "words" }).moves(
    bindEach({
      opacity: (i) => (t, ev) => {
        const reveal = wordReveals[i]?.(t, ev) ?? 1;
        const exit = 1 - span(4860, 5030).of(t, ease.quadInOut).progress;
        return reveal * exit;
      },
      y: (i) => (t, ev) => 18 * (1 - (wordReveals[i]?.(t, ev) ?? 1)),
    }),
  ),
);

// Shot 3: closing card holding still for > 1.5 s (6720..9220 ms).
const closingBgIn = beat("bgIn", 340, { at: 0 });
const closingKickerIn = beat("kickerIn", 380, { at: 180 });
const closingTitleIn = beat("titleIn", 620, { at: 240 });
const closingRuleIn = beat("ruleIn", 420, { at: 440 });
const closingSubIn = beat("subIn", 420, { at: 540 });

const closingShot = scene(
  { name: "closing" },
  box("closingBg").moves(fadeIn.in(closingBgIn).take()),
  box("closingKicker").moves(
    rise({ distance: 24 }).in(closingKickerIn, ease.cubicOut),
    fade().in(span(180, 420)),
  ),
  text("closingTitle", { split: "words" }).moves(
    stagger(wordRise, { spread: 0.35 }).in(closingTitleIn),
  ),
  box("closingRule").moves(unfold({ from: "left" }).in(closingRuleIn, ease.expoOut)),
  box("closingSub").moves(
    rise({ distance: 24 }).in(closingSubIn, ease.cubicOut),
    fade().in(span(540, 820)),
  ),
);

export default scene(
  { name: "explainer", cues: captionCues },
  shot(titleShot, { name: "title", length: 2200 }),
  shot(demoShot, { name: "demo", overlap: 340, length: 5200 }),
  shot(closingShot, { name: "closing", overlap: 340, length: 2500 }),
);
