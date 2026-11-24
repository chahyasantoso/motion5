import { clamp, ease, mix, motion, type Pose2d, type Time } from "@gerak/core";
import { beat, scene, type MotionContext } from "@gerak/stage";
import { cast } from "../cookie.cast.ts";
import { STAGE_SIZE } from "./contract.ts";

const { craftStage, craftHeading, craftProgressFill, craftViewport, craftTrack, craftCards } = cast;

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
  const trackW = context?.rest.get(craftTrack.name)?.width ?? 1920;
  const viewportW = context?.rest.get(craftViewport.name)?.width ?? STAGE_SIZE.width;
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

export const craftScene = scene(
  craftStage,
  craftViewport,
  craftHeading.moves(craftHeadingMotion.in(craftEnter)),
  craftProgressFill.moves(craftProgressMotion.in(craftScroll)),
  craftTrack.moves(craftTrackMotion.in(craftScroll)),
  craftCards.moves(craftCardMotion.in(craftScroll)),
);
