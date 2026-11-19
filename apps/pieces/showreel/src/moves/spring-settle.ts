import { arch, decay, wave, type Pose2d, type Time } from "@gerak/core";

const clamp01 = (p: number) => Math.min(1, Math.max(0, p));

/** Options of `springSettle`. */
export interface SpringSettleOptions {
  /** Start this far right of rest, in px; default 0. */
  readonly dx?: number;
  /** Start this far below rest, in px; default 0. */
  readonly dy?: number;
  /** How far the path bows upward on the way, in px; default 0. */
  readonly lift?: number;
  /** Start turned this far, in degrees; default 0. */
  readonly turn?: number;
  /** Start at this size, 1 being full size; default 1. */
  readonly scale?: number;
  /** Start squashed by this share of its height and widened to match; negative stretches; default 0. */
  readonly squash?: number;
  /** Swings past rest and back over the span; 0 eases in with no overshoot; default 2. */
  readonly rings?: number;
  /** How fast the ringing dies away; low rings to the end, high settles early; default 4. */
  readonly damping?: number;
}

/** Springs in from an offset, a turn, a size and a squash to rest, overshooting and ringing a few times before it settles. */
export function springSettle(options: SpringSettleOptions = {}): (time: Time) => Pose2d {
  const {
    dx = 0,
    dy = 0,
    lift = 0,
    turn = 0,
    scale = 1,
    squash = 0,
    rings = 2,
    damping = 4,
  } = options;
  return ({ progress: p }): Pose2d => {
    const fall = decay({ rate: damping });
    const swing = wave({ count: rings, phase: 0.25 });
    const ring = (q: number) => fall(q) * swing(q);
    const r = 1 - (ring(p) - p * ring(1));
    const left = 1 - r;
    const s = scale + (1 - scale) * r;
    return {
      x: dx * left,
      y: dy * left - lift * arch(clamp01(r)),
      rotation: turn * left,
      scaleX: s * (1 + squash * 0.8 * left),
      scaleY: s * (1 - squash * left),
    };
  };
}
