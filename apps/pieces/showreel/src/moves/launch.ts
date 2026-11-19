import { wave, type Pose2d, type Time } from "@gerak/core";

const cubicInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2);
const cubicOut = (p: number) => 1 - (1 - p) ** 3;
const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

/** Options of `launch`. */
export interface LaunchOptions {
  /** How far up it travels by the end, in px. */
  readonly height: number;
  /** Height lost at the deepest crouch, as a share; default 0.3. */
  readonly squash?: number;
  /** How much the crouch widens, as a share of the squash; default 0.8. */
  readonly bulge?: number;
  /** Extra height at the snap off the floor, as a share; default 0.6. */
  readonly stretch?: number;
  /** Share of the span spent crouching and holding before lift-off; default 0.5. */
  readonly crouch?: number;
  /** Side-to-side shiver at full crouch, in px; default 0. */
  readonly tremble?: number;
  /** Whether the leap slows as it rises, like a throw, or speeds up, like a rocket; default decelerate. */
  readonly flight?: "decelerate" | "accelerate";
}

/** Crouches against the floor, shivering if asked, then snaps from squash to stretch and shoots straight up out of sight. */
export function launch(options: LaunchOptions): (time: Time) => Pose2d {
  const {
    height,
    squash = 0.3,
    bulge = 0.8,
    stretch = 0.6,
    crouch = 0.5,
    tremble = 0,
    flight = "decelerate",
  } = options;
  return ({ progress }): Pose2d => {
    if (progress < crouch) {
      const q = progress / crouch;
      const k = cubicInOut(clamp01(q / 0.65));
      return {
        x: tremble * k * k * wave({ count: 6 * crouch })(q),
        scaleY: 1 - squash * k,
        scaleX: 1 + squash * bulge * k,
        anchor: "bottom",
      };
    }
    const f = (progress - crouch) / (1 - crouch);
    const snap = clamp01(f / 0.12);
    const scaleY =
      f < 0.12
        ? 1 - squash + (squash + stretch) * cubicOut(snap)
        : 1 + stretch - stretch * 0.6 * ((f - 0.12) / 0.88);
    const travel = flight === "accelerate" ? 0.55 * f + 0.45 * f * f : 1 - (1 - f) ** 2;
    return { y: -height * travel, scaleY, scaleX: 1 / Math.sqrt(scaleY), anchor: "bottom" };
  };
}
