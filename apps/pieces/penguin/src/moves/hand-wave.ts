import { arch, motion, wave, type Motion, type Pose2d } from "@gerak/core";

const inOut = (u: number): number => arch(Math.min(1, Math.max(0, u)) / 2) ** 2;
const LIFT_SHARE = 0.28;
const LOWER_SHARE = 0.24;

/** Options of `handWave`. */
export interface HandWaveOptions {
  /** How far the limb turns up from where it hangs, in degrees (negative turns the other way). */
  readonly lift: number;
  /** Each wave's swing to either side, in degrees; default 15. */
  readonly swing?: number;
  /** Waves, each one out and back; default 2. */
  readonly count?: number;
  /** Its drawn length while raised, against its length at rest; under 1 tips it toward the viewer; default 1. */
  readonly reach?: number;
  /** How much shorter it looks halfway up, pointing most at the viewer, 0 to 0.8; default 0. */
  readonly fold?: number;
}

/** Lifts a limb about its joint, swings it back and forth to wave, and lowers it again. */
export function handWave(options: HandWaveOptions): Motion<Pose2d> {
  const { lift, swing = 15, count = 2, reach = 1, fold = 0 } = options;
  return motion(({ progress }): Pose2d => {
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
    const sway = wave({ count })(waving) * arch(waving) ** 0.5;
    const turned = arch(up);
    const along = 1 + (reach - 1) * up - fold * turned;
    return {
      rotation: lift * up + Math.sign(lift || 1) * swing * sway,
      scaleX: 1 - 0.5 * fold * turned,
      scaleY: along,
    };
  });
}
