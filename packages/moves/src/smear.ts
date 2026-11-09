import type { Pose2d } from "./pose";

/** Stretches along travel by `stretch` per 1000 px/s up to `max`, area kept; `heading` in (-90, 90], so reversing never flips it. */
export function smear(
  velocity: { readonly vx: number; readonly vy: number },
  options: { readonly stretch: number; readonly max: number },
): { readonly pose: Pose2d; readonly heading: number } {
  if (!(options.stretch >= 0)) throw new RangeError("smear: stretch must be 0 or more.");
  if (!(options.max >= 1)) throw new RangeError("smear: max must be 1 or more.");
  const speed = Math.hypot(velocity.vx, velocity.vy);
  if (options.stretch === 0 || speed === 0) return { pose: {}, heading: 0 };
  const travel = (Math.atan2(velocity.vy, velocity.vx) * 180) / Math.PI;
  const heading = travel > 90 ? travel - 180 : travel <= -90 ? travel + 180 : travel;
  const s = Math.min(options.max, 1 + (options.stretch * speed) / 1000);
  return { pose: { rotation: heading, scaleX: s, scaleY: 1 / s }, heading };
}
