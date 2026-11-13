import { defineMove, type Pose2d } from "@gerak/moves";

const inOut = (u: number): number => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, u)));
const LIFT_SHARE = 0.28;
const LOWER_SHARE = 0.24;

export const handWave = defineMove({
  id: "hand-wave",
  role: "emphasis",
  description:
    "Lifts a limb about its joint, swings it back and forth to wave, and lowers it again; it can shorten and narrow as it comes up, as if raised toward the viewer. Give the limb its joint as pivot.",
  options: {
    lift: {
      kind: "number",
      description:
        "How far the limb turns up from where it hangs, in degrees (negative turns the other way).",
    },
    swing: {
      kind: "number",
      min: 0,
      max: 90,
      default: 15,
      description: "Each wave's swing to either side, in degrees; default 15.",
    },
    count: {
      kind: "number",
      min: 1,
      max: 8,
      default: 2,
      description: "Waves, each one out and back; default 2.",
    },
    reach: {
      kind: "number",
      min: 0.2,
      max: 1.5,
      default: 1,
      description:
        "Its drawn length while raised, against its length at rest; under 1 tips it toward the viewer; default 1.",
    },
    fold: {
      kind: "number",
      min: 0,
      max: 0.8,
      default: 0,
      description:
        "How much shorter it looks halfway up, pointing most at the viewer, 0 to 0.8; default 0.",
    },
  },
  example: { options: { lift: -150, swing: 15, count: 2, reach: 0.8, fold: 0.3 } },
  moments: () => ({ raised: LIFT_SHARE, lowering: 1 - LOWER_SHARE }),
  run: ({ lift, swing, count, reach, fold }, { progress }): Pose2d => {
    const up =
      progress < LIFT_SHARE
        ? inOut(progress / LIFT_SHARE)
        : progress > 1 - LOWER_SHARE
          ? 1 - inOut((progress - (1 - LOWER_SHARE)) / LOWER_SHARE)
          : 1;
    const waving = Math.min(
      1,
      Math.max(0, (progress - LIFT_SHARE) / (1 - LIFT_SHARE - LOWER_SHARE)),
    );
    const sway = Math.sin(2 * Math.PI * count * waving) * Math.sin(Math.PI * waving) ** 0.5;
    const turned = Math.sin(Math.PI * up);
    const along = 1 + (reach - 1) * up - fold * turned;
    return {
      rotation: lift * up + Math.sign(lift || 1) * swing * sway,
      scaleX: 1 - 0.5 * fold * turned,
      scaleY: along,
    };
  },
});
