import type { Cubic2d } from "./shapes";

/** How near two ends must be to meet, in px: rounding apart, not a gap anyone draws. */
export const SEAM = 1e-6;

/** Whether the point `(x, y)` is within a seam of `(toX, toY)`. */
export function meets(x: number, y: number, toX: number, toY: number): boolean {
  return Math.abs(x - toX) <= SEAM && Math.abs(y - toY) <= SEAM;
}

/** Whether a path ends where it began; an empty path is not closed. */
export function isClosedPath(cubics: readonly Cubic2d[]): boolean {
  const first = cubics[0];
  const last = cubics[cubics.length - 1];
  return first !== undefined && last !== undefined && meets(last.x3, last.y3, first.x0, first.y0);
}

function pointAt(c: Cubic2d, t: number): { readonly x: number; readonly y: number } {
  const u = 1 - t;
  return {
    x: u * u * u * c.x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x3,
    y: u * u * u * c.y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y3,
  };
}

/** The signed area a path encloses, from each cubic sampled at four points (not exact for a curve); its sign is the way round it runs. */
export function pathArea(cubics: readonly Cubic2d[]): number {
  const points = cubics.flatMap((c) => [0, 0.25, 0.5, 0.75].map((t) => pointAt(c, t)));
  return points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length] ?? point;
    return sum + (point.x * next.y - next.x * point.y) / 2;
  }, 0);
}

/** The box a path spans from its top-left: by default its control points' extent, or with `"curve"` the extent of 33 points along every cubic. An empty path spans nothing. */
export function pathBounds(
  cubics: readonly Cubic2d[],
  extent: "hull" | "curve" = "hull",
): { readonly x: number; readonly y: number; readonly width: number; readonly height: number } {
  const points =
    extent === "hull"
      ? cubics.flatMap((c) => [
          { x: c.x0, y: c.y0 },
          { x: c.x1, y: c.y1 },
          { x: c.x2, y: c.y2 },
          { x: c.x3, y: c.y3 },
        ])
      : cubics.flatMap((c) => Array.from({ length: 33 }, (_, step) => pointAt(c, step / 32)));
  if (points.length === 0) return { x: 0, y: 0, width: 0, height: 0 };
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const x = xs.reduce((least, value) => Math.min(least, value), Infinity);
  const y = ys.reduce((least, value) => Math.min(least, value), Infinity);
  const right = xs.reduce((most, value) => Math.max(most, value), -Infinity);
  const bottom = ys.reduce((most, value) => Math.max(most, value), -Infinity);
  return { x, y, width: right - x, height: bottom - y };
}
