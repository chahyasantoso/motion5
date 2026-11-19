import { backEase, type Pose2d, motion, type Motion } from "@gerak/core";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

/** Options of `implode`. */
export interface ImplodeOptions {
  /** The point it is sucked into, this far right of rest, in px. */
  readonly dx: number;
  /** The point it is sucked into, this far below rest, in px. */
  readonly dy: number;
  /** How far it leans back before it goes, as a back-ease amount; 0 goes at once; default 2. */
  readonly lean?: number;
  /** Its size on arrival; default 0.05, nearly a point. */
  readonly scale?: number;
  /** Degrees it turns by on the way in; default 0. */
  readonly turn?: number;
  /** Last share of the span over which it fades out as it arrives; default 0.15. */
  readonly vanish?: number;
}

/** Leans back away from a point, then is sucked into it, speeding up, shrinking and turning as it goes, and winks out on arrival. */
export function implode(options: ImplodeOptions): Motion<Pose2d> {
  const { dx, dy, lean = 2, scale = 0.05, turn = 0, vanish = 0.15 } = options;
  return motion(({ progress: p }): Pose2d => {
    const q = backEase({ amount: lean, direction: "in" })(p);
    const shrink = p * p * p;
    const fade = vanish > 0 ? clamp01((p - (1 - vanish)) / vanish) : 0;
    return {
      x: dx * q,
      y: dy * q,
      rotation: turn * q,
      scale: 1 + (scale - 1) * shrink,
      opacity: 1 - fade,
    };
  });
}
