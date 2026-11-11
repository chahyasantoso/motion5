import { clockDriver } from "@gerak/dom";
import { combine, drop, ease, fade, mix, span, swing, type Pose2d, type Time } from "@gerak/moves";

export const durationMs = 5000;

const fall = span(300, 1500, durationMs);
const hang = span(1750, 4400, durationMs);
const tagIn = span(1750, 2050, durationMs);
const caption = span(3300, 4400, durationMs);
const rule = span(1500, 2600, durationMs);

export const scene = (time: Time) => {
  const ruleProgress = rule.of(time, ease.sineInOut).progress;
  return {
    name: combine([
      drop({ distance: 560, squash: 0.05 }, fall.of(time)),
      fade({}, span(300, 700, durationMs).of(time)),
    ]),
    rule: {
      scaleX: mix(0, 1, ruleProgress),
      opacity: mix(0, 1, ruleProgress),
    } satisfies Pose2d,
    tag: combine([
      swing({ angle: 11, swings: 2, anchor: "top" }, hang.of(time)),
      fade({}, tagIn.of(time)),
    ]),
    caption: {
      opacity: mix(0, 1, caption.of(time, ease.sineInOut).progress),
    } satisfies Pose2d,
  };
};

export const clock = () => clockDriver({ duration: durationMs });
