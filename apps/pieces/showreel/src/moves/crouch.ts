import { type Pose2d, motion, type Motion } from "@gerak/core";

const CURVES = {
  out: (p: number) => 1 - (1 - p) ** 3,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
} as const;

/** Options of `crouch`. */
export interface CrouchOptions {
  /** Height lost at the deepest, as a share of its height. */
  readonly squash: number;
  /** Width gained for each share of height lost; default 0.8. */
  readonly bulge?: number;
  /** How it sinks: out drops fast and slows, inOut eases at both ends; default inOut. */
  readonly curve?: "out" | "inOut";
}

/** Sinks into a squash against the floor and holds it, gathering itself before a jump, a pop or a burst. */
export function crouch(options: CrouchOptions): Motion<Pose2d> {
  const { squash, bulge = 0.8, curve = "inOut" } = options;
  return motion(({ progress }): Pose2d => {
    const k = CURVES[curve](progress);
    return { scaleY: 1 - squash * k, scaleX: 1 + squash * bulge * k, anchor: "bottom" };
  });
}
