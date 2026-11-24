import { clamp, ease, mix, motion, type Motion, type Pose2d, type Time } from "@gerak/core";
import { beat, box, sceneBuilder, type MotionContext, type SceneBuilder } from "@gerak/stage";
import { CAST, STAGE_SIZE } from "./contract.ts";

const craftStage = box(CAST.craftStage);
const craftHeading = box(CAST.craftHeading);
const craftProgressFill = box(CAST.craftProgressFill);
const craftViewport = box(CAST.craftViewport);
const craftTrack = box(CAST.craftTrack);
const craftCards = [
  box(CAST.craftCard0),
  box(CAST.craftCard1),
  box(CAST.craftCard2),
  box(CAST.craftCard3),
];

const craftEnter = beat("craftEnter", {
  scroll: [craftStage.top.minus(460), craftStage.top.minus(40)],
});

const craftScroll = beat("craftScroll", {
  scroll: [craftViewport.pinStart, craftViewport.pinEnd],
});

const craftHeadingMotion = motion((t: Time): Pose2d => {
  const p = ease.cubicOut(t.progress);
  return {
    y: mix(28, 0, p),
    opacity: p,
  };
});

const craftProgressMotion = motion(
  (t: Time): Pose2d => ({
    scaleX: mix(0.25, 1, t.progress),
  }),
);

const craftTrackMotion = motion((t: Time, context?: MotionContext): Pose2d => {
  const trackW = context?.rest.get(CAST.craftTrack)?.width ?? 1920;
  const viewportW = context?.rest.get(CAST.craftViewport)?.width ?? STAGE_SIZE.width;
  const travel = Math.max(0, trackW - viewportW);
  return {
    x: mix(0, -travel, t.progress),
  };
});

function craftCardMotion(index: number, count: number): Motion<Pose2d, MotionContext> {
  const center = count > 1 ? index / (count - 1) : 0;
  return motion((t: Time): Pose2d => {
    const dist = clamp(Math.abs(t.progress - center) / 0.55, 0, 1);
    const focus = ease.sineInOut(1 - dist);
    return {
      y: mix(14, 0, focus),
      scale: mix(0.965, 1, focus),
      rotation: clamp((center - t.progress) * 2.2, -1.6, 1.6),
    };
  });
}

let builder: SceneBuilder = sceneBuilder()
  .element(craftStage)
  .element(craftViewport)
  .element(craftHeading)
  .motion(craftHeadingMotion.in(craftEnter))
  .element(craftProgressFill)
  .motion(craftProgressMotion.in(craftScroll))
  .element(craftTrack)
  .motion(craftTrackMotion.in(craftScroll));

for (let i = 0; i < craftCards.length; i += 1) {
  const card = craftCards[i];
  if (!card) {
    continue;
  }
  builder = builder.element(card).motion(craftCardMotion(i, craftCards.length).in(craftScroll));
}

export const craftScene: SceneBuilder = builder;
