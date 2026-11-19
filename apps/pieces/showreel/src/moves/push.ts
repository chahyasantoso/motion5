import { type Pose2d, motion, type Motion } from "@gerak/core";

const CURVES = {
  out: (p: number) => 1 - (1 - p) ** 3,
  in: (p: number) => p * p * p,
  inOut: (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2),
} as const;

/** Options of `push`. */
export interface PushOptions {
  /** The size it ends at, 1 being rest; above 1 pushes in, below pulls out. */
  readonly to: number;
  /** How the change is spread over the span; default inOut, a slow push. */
  readonly curve?: "out" | "in" | "inOut";
}

/** Scales from full size to a given size about its centre, as a camera pushing in or pulling out. */
export function push(options: PushOptions): Motion<Pose2d> {
  const { to, curve = "inOut" } = options;
  return motion(
    ({ progress }): Pose2d => ({
      scale: 1 + (to - 1) * CURVES[curve](progress),
    }),
  );
}
