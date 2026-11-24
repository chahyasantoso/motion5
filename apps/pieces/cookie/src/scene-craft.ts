import { clamp, ease, mix, motion, type Pose2d, type Time } from "@gerak/core";
import { beat, box, sceneBuilder, type MotionContext } from "@gerak/stage";
import { STAGE_SIZE, type CastName } from "./contract.ts";

const craftStage = box<CastName>("craftStage");
const craftHeading = box<CastName>("craftHeading");
const craftProgressFill = box<CastName>("craftProgressFill");
const craftViewport = box<CastName>("craftViewport");
const craftTrack = box<CastName>("craftTrack");
const craftCards = box<CastName>("craftCards", { parts: true });

const craftTrackCast: CastName = "craftTrack";
const craftViewportCast: CastName = "craftViewport";

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
  const trackW = context?.rest.get(craftTrackCast)?.width ?? 1920;
  const viewportW = context?.rest.get(craftViewportCast)?.width ?? STAGE_SIZE.width;
  const travel = Math.max(0, trackW - viewportW);
  return {
    x: mix(0, -travel, t.progress),
  };
});

const craftCardMotion = motion((t: Time, context?: MotionContext): Pose2d => {
  const index = context?.index ?? 0;
  const count = context?.count ?? 4;
  const center = count > 1 ? index / (count - 1) : 0;
  const dist = clamp(Math.abs(t.progress - center) / 0.55, 0, 1);
  const focus = ease.sineInOut(1 - dist);
  return {
    y: mix(14, 0, focus),
    scale: mix(0.965, 1, focus),
    rotation: clamp((center - t.progress) * 2.2, -1.6, 1.6),
  };
});

export const craftScene = sceneBuilder()
  .element(craftStage)
  .element(craftViewport)
  .element(craftHeading)
  .motion(craftHeadingMotion.in(craftEnter))
  .element(craftProgressFill)
  .motion(craftProgressMotion.in(craftScroll))
  .element(craftTrack)
  .motion(craftTrackMotion.in(craftScroll))
  .element(craftCards)
  .motion(craftCardMotion.in(craftScroll));
