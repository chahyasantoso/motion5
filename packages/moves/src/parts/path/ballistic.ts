import { definePart } from "../contract";

/** The throw's shape: start offset `dx` and `dy`, and how many px above the higher end it peaks. */
export type BallisticOptions = { dx: number; dy: number; apex: number };

/** Where a thrown thing is at progress 0 to 1: from (dx, dy) to (0, 0) under constant gravity, peaking `apex` px above the higher end. */
export function ballistic(progress: number, options: BallisticOptions): { x: number; y: number } {
  const { dx, dy, apex } = options;
  if (!(apex >= 0)) throw new RangeError(`ballistic: apex must be at least 0, got ${apex}`);
  const rise = dy - (Math.min(dy, 0) - apex);
  const gravity = (Math.sqrt(rise) + Math.sqrt(rise - dy)) ** 2;
  const slope = -dy - gravity;
  return {
    x: dx * (1 - progress),
    y: gravity * progress * progress + slope * progress + dy,
  };
}
definePart(
  {
    kind: "path",
    samples: [
      { dx: 120, dy: 0, apex: 80 },
      { dx: -60, dy: 40, apex: 30 },
      { dx: 0, dy: -50, apex: 0 },
    ].map((options) => ({
      run: (progress: number) => ballistic(progress, options),
      from: { x: options.dx, y: options.dy },
      to: { x: 0, y: 0 },
    })),
  },
  ballistic,
);
