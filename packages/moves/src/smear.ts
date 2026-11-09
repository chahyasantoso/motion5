import type { Pose2d } from "./pose";

/**
 * A pose stretching a body along its travel by `stretch` per 1000 px/s, capped at `max`, area kept; `heading`
 * is the travel in degrees. A body whose content must not turn wraps it in an inner element posed `{ rotation: -heading }`.
 */
export function smear(
  velocity: { readonly vx: number; readonly vy: number },
  options: { readonly stretch: number; readonly max: number },
): { readonly pose: Pose2d; readonly heading: number } {
  if (!(options.stretch >= 0)) throw new RangeError("smear: stretch must be 0 or more.");
  if (!(options.max >= 1)) throw new RangeError("smear: max must be 1 or more.");
  const speed = Math.hypot(velocity.vx, velocity.vy);
  if (options.stretch === 0 || speed === 0) return { pose: {}, heading: 0 };
  const heading = (Math.atan2(velocity.vy, velocity.vx) * 180) / Math.PI;
  const s = Math.min(options.max, 1 + (options.stretch * speed) / 1000);
  return { pose: { rotation: heading, scaleX: s, scaleY: 1 / s }, heading };
}
