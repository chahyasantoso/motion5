import type { Anchor2d, Cubic2d } from "./shapes";

/** One segment per pair of neighbouring anchors, leaving through one's out handle and arriving through the next's in handle. */
export function toCubics(anchors: readonly Anchor2d[]): readonly Cubic2d[] {
  const cubics: Cubic2d[] = [];
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const p = anchors[index]!;
    const q = anchors[index + 1]!;
    cubics.push({
      id: p.id,
      x0: p.x,
      y0: p.y,
      x1: p.x + p.outX,
      y1: p.y + p.outY,
      x2: q.x + q.inX,
      y2: q.y + q.inY,
      x3: q.x,
      y3: q.y,
    });
  }
  return cubics;
}
