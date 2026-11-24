import {
  clamp,
  ease,
  mix,
  motion,
  scroll,
  toCubics,
  type Pose2d,
  type Pose3d,
  type Time,
} from "@gerak/core";
import { beat, sceneBuilder, shape, stagger, text, type MotionContext } from "@gerak/stage";
import { cast } from "../cookie.cast.ts";
import { pointerDeltaX, pointerDeltaY } from "./inputs.ts";
import { closingSlotWorld } from "./space3d.ts";

const CLOSING_FLOURISH_PATH = toCubics([
  { id: "start", x: 4, y: 14, inX: 0, inY: 0, outX: 44, outY: -9 },
  { id: "crest", x: 126, y: 6, inX: -42, inY: -4, outX: 46, outY: 5 },
  { id: "end", x: 254, y: 11, inX: -42, inY: 4, outX: 0, outY: 0 },
]);

const { closingStage, slotClosingJar, closingCopy, closingActions, closingJarRoot } = cast;
const closingHeadline = text(cast.closingHeadline.name, { split: "words" });
const closingFlourish = shape(cast.closingFlourish.name, CLOSING_FLOURISH_PATH);
const closingWordmark = text(cast.closingWordmark.name, { split: "letters" });

const closingReveal = beat("closingReveal", 720, {
  when: closingStage.top.minus(480).reached,
  back: "reverse",
});

const closingWordmarkBeat = beat("closingWordmarkBeat", 820, {
  when: closingStage.top.minus(320).reached,
  back: "reverse",
});

const wordRise = motion(
  (t: Time): Pose2d => ({
    y: mix(20, 0, t.progress),
    opacity: t.progress,
  }),
);

const letterRise = motion(
  (t: Time): Pose2d => ({
    y: mix(56, 0, t.progress),
    opacity: t.progress,
  }),
);

function delayedFadeRise(delay: number, offsetY: number) {
  return motion((t: Time): Pose2d => {
    const p = clamp((t.progress - delay) / Math.max(0.01, 1 - delay), 0, 1);
    return {
      y: mix(offsetY, 0, p),
      opacity: p,
    };
  });
}

const flourishDraw = motion((t: Time): Pose2d => {
  const p = ease.cubicOut(t.progress);
  return {
    drawn: p,
    opacity: clamp(t.progress * 5, 0, 1),
  };
});

const closingJarRootMotion = motion((_t: Time, context?: MotionContext): Pose3d => {
  const scrollY = context ? scroll.y(context.time, context.events) : 0;
  const slot = closingSlotWorld(context?.rest, scrollY);
  const enterP = ease.cubicOut(
    clamp((scrollY - (slot.stageTop - slot.visibleH * 0.9)) / (slot.visibleH * 0.55), 0, 1),
  );
  const dx = context ? pointerDeltaX(context.time, context.events) : 0;
  const dy = context ? pointerDeltaY(context.time, context.events) : 0;
  return {
    x: slot.center.x + dx * 0.1 * enterP,
    y: mix(-0.18 * slot.fitScale, 0, enterP) + slot.center.y - dy * 0.05 * enterP,
    z: slot.center.z,
    rotation: 0,
    rotationX: dy * 6 * enterP,
    rotationY: mix(14, -8, enterP) + dx * 14 * enterP,
    scale: slot.fitScale * mix(0.92, 1, enterP),
  };
});

export const closingScene = sceneBuilder()
  .element(closingStage)
  .element(slotClosingJar)
  .element(closingHeadline)
  .motion(stagger(wordRise, { spread: 0.24 }).in(closingReveal, ease.cubicOut))
  .element(closingFlourish)
  .motion(flourishDraw.in(closingReveal))
  .element(closingCopy)
  .motion(delayedFadeRise(0.16, 18).in(closingReveal, ease.cubicOut))
  .element(closingActions)
  .motion(delayedFadeRise(0.28, 20).in(closingReveal, ease.cubicOut))
  .element(closingWordmark)
  .motion(
    stagger(letterRise, { spread: 0.22, from: "center" }).in(closingWordmarkBeat, ease.cubicOut),
  )
  .element(closingJarRoot)
  .motion(closingJarRootMotion)
  .show({ from: closingStage.top.minus(1100) })
  .limits({ jump: 1.8, turn: 180 });
