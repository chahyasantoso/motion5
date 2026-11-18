import type { Curve } from "../time/shapes";

/** The throw's shape: start offset `dx` and `dy`, and how many px above the higher end it peaks. */
export type BallisticOptions = { dx: number; dy: number; apex: number };

/** A curve of where a thrown thing is at progress 0 to 1: from (dx, dy) to (0, 0) under constant gravity, peaking `apex` px above the higher end. */
export function ballistic(options: BallisticOptions): Curve<{ x: number; y: number }> {
  const { dx, dy, apex } = options;
  if (!(apex >= 0)) throw new RangeError(`ballistic: apex must be at least 0, got ${apex}`);
  const rise = dy - (Math.min(dy, 0) - apex);
  const gravity = (Math.sqrt(rise) + Math.sqrt(rise - dy)) ** 2;
  const slope = -dy - gravity;
  return (progress) => ({
    x: dx * (1 - progress),
    y: gravity * progress * progress + slope * progress + dy,
  });
}
