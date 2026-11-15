import type { Anchor3d, Cubic3d } from "./shapes";

/** One segment per pair of neighbouring anchors, leaving through one's out handle and arriving through the next's in handle. */
export function toCubics3d(anchors: readonly Anchor3d[]): readonly Cubic3d[] {
  const cubics: Cubic3d[] = [];
  anchors.slice(1).forEach((q, index) => {
    const p = anchors[index];
    if (p === undefined) return;
    cubics.push({
      id: p.id,
      x0: p.x,
      y0: p.y,
      z0: p.z,
      x1: p.x + p.outX,
      y1: p.y + p.outY,
      z1: p.z + p.outZ,
      x2: q.x + q.inX,
      y2: q.y + q.inY,
      z2: q.z + q.inZ,
      x3: q.x,
      y3: q.y,
      z3: q.z,
    });
  });
  return cubics;
}
