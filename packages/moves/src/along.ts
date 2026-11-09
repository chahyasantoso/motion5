import { arcLength } from "./arc-length";
import type { Pose2d } from "./pose";
import type { Cubic2d } from "./shapes";

function pointOf(c: Cubic2d, t: number): { readonly x: number; readonly y: number } {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return {
    x: a * c.x0 + b * c.x1 + d * c.x2 + e * c.x3,
    y: a * c.y0 + b * c.y1 + d * c.y2 + e * c.y3,
  };
}

function slopeOf(c: Cubic2d, t: number): { readonly dx: number; readonly dy: number } {
  const u = 1 - t;
  const a = 3 * u * u;
  const b = 6 * u * t;
  const d = 3 * t * t;
  return {
    dx: a * (c.x1 - c.x0) + b * (c.x2 - c.x1) + d * (c.x3 - c.x2),
    dy: a * (c.y1 - c.y0) + b * (c.y2 - c.y1) + d * (c.y3 - c.y2),
  };
}

/** The pose `share` of the way along a path by distance, from the target's rest; `turn` adds the heading, down 90. */
export function along(
  cubics: readonly Cubic2d[],
  share: number,
  options: { readonly turn?: boolean } = {},
): Pose2d {
  if (cubics.length === 0) throw new RangeError("along: the path has no segments.");
  const arc = arcLength(cubics.length, (index, t) => {
    const c = cubics[index];
    if (c === undefined) throw new RangeError("along: the path has no segments.");
    const p = pointOf(c, t);
    return [p.x, p.y];
  });
  const { segment, t } = arc.locate(Math.max(0, Math.min(1, share)) * arc.total);
  const cubic = cubics[segment];
  if (cubic === undefined) throw new RangeError("along: the path has no segments.");
  const point = pointOf(cubic, t);
  if (options.turn !== true) return { x: point.x, y: point.y };
  const slope = slopeOf(cubic, t);
  const heading =
    slope.dx === 0 && slope.dy === 0
      ? Math.atan2(cubic.y3 - cubic.y0, cubic.x3 - cubic.x0)
      : Math.atan2(slope.dy, slope.dx);
  return { x: point.x, y: point.y, rotation: (heading * 180) / Math.PI };
}
