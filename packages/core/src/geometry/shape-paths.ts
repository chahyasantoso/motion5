import { pathFrom } from "./path-data";
import type { Cubic2d } from "./shapes";

function cubicsOf(data: string): readonly Cubic2d[] {
  return pathFrom(data).outlines.flat();
}

/** The closed outline of a rectangle, its corners rounded by `rx` and `ry` (each defaulting to the other); nothing when it has no size. */
export function rectPath(options: {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly rx?: number;
  readonly ry?: number;
}): readonly Cubic2d[] {
  const { x, y, width, height } = options;
  if (!(width > 0 && height > 0)) return [];
  const rx = Math.min(options.rx ?? options.ry ?? 0, width / 2);
  const ry = Math.min(options.ry ?? options.rx ?? 0, height / 2);
  if (rx <= 0 || ry <= 0) return cubicsOf(`M ${x} ${y} H ${x + width} V ${y + height} H ${x} Z`);
  const right = x + width;
  const bottom = y + height;
  return cubicsOf(
    [
      `M ${x + rx} ${y}`,
      `H ${right - rx}`,
      `A ${rx} ${ry} 0 0 1 ${right} ${y + ry}`,
      `V ${bottom - ry}`,
      `A ${rx} ${ry} 0 0 1 ${right - rx} ${bottom}`,
      `H ${x + rx}`,
      `A ${rx} ${ry} 0 0 1 ${x} ${bottom - ry}`,
      `V ${y + ry}`,
      `A ${rx} ${ry} 0 0 1 ${x + rx} ${y}`,
      "Z",
    ].join(" "),
  );
}

/** The closed outline of an ellipse, four quarter arcs from its right-hand point; nothing when a radius is not above zero. */
export function ellipsePath(options: {
  readonly cx: number;
  readonly cy: number;
  readonly rx: number;
  readonly ry: number;
}): readonly Cubic2d[] {
  const { cx, cy, rx, ry } = options;
  if (!(rx > 0 && ry > 0)) return [];
  return cubicsOf(
    `M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx} ${cy + ry} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx} ${cy - ry} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy} Z`,
  );
}

/** The closed outline of a circle of radius `r` about `(cx, cy)`; nothing when `r` is not above zero. */
export function circlePath(options: {
  readonly cx: number;
  readonly cy: number;
  readonly r: number;
}): readonly Cubic2d[] {
  return ellipsePath({ cx: options.cx, cy: options.cy, rx: options.r, ry: options.r });
}

/** The straight sides through `points` as `x, y, x, y, …`, closed back to the first point when `closed`; nothing when there is no pair. */
export function polygonPath(options: {
  readonly points: readonly number[];
  readonly closed: boolean;
}): readonly Cubic2d[] {
  const { points } = options;
  const pairs: string[] = [];
  for (let at = 0; at + 1 < points.length; at += 2) pairs.push(`${points[at]} ${points[at + 1]}`);
  return pairs.length === 0 ? [] : cubicsOf(`M ${pairs.join(" L ")}${options.closed ? " Z" : ""}`);
}

/** The one straight cubic from `(x1, y1)` to `(x2, y2)`. */
export function linePath(options: {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}): readonly Cubic2d[] {
  return cubicsOf(`M ${options.x1} ${options.y1} L ${options.x2} ${options.y2}`);
}
