import type { Pose2d } from "./pose";
import type { Cubic2d } from "./shapes";

const SAMPLES = 32;

type Sample = { readonly length: number; readonly segment: number; readonly t: number };

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

function tableOf(cubics: readonly Cubic2d[]): readonly Sample[] {
  const table: Sample[] = [{ length: 0, segment: 0, t: 0 }];
  let length = 0;
  cubics.forEach((cubic, segment) => {
    let last = pointOf(cubic, 0);
    for (let i = 1; i <= SAMPLES; i += 1) {
      const t = i / SAMPLES;
      const next = pointOf(cubic, t);
      length += Math.hypot(next.x - last.x, next.y - last.y);
      table.push({ length, segment, t });
      last = next;
    }
  });
  return table;
}

/** The pose `share` of the way along a path by distance, from the target's rest; `turn` adds the heading, down 90. */
export function along(
  cubics: readonly Cubic2d[],
  share: number,
  options: { readonly turn?: boolean } = {},
): Pose2d {
  if (cubics.length === 0) throw new RangeError("along: the path has no segments.");
  const table = tableOf(cubics);
  const total = table[table.length - 1]?.length ?? 0;
  const goal = Math.max(0, Math.min(1, share)) * total;
  let low = 0;
  let high = table.length - 1;
  while (high - low > 1) {
    const mid = (low + high) >> 1;
    if ((table[mid]?.length ?? 0) <= goal) low = mid;
    else high = mid;
  }
  const from = table[low];
  const to = table[high];
  if (from === undefined || to === undefined)
    throw new RangeError("along: the path has no length.");
  const span = to.length - from.length;
  const fraction = span > 0 ? (goal - from.length) / span : 0;
  const segment = to.segment;
  const cubic = cubics[segment];
  if (cubic === undefined) throw new RangeError("along: the path has no segments.");
  const fromT = from.segment === segment ? from.t : 0;
  const t = fromT + (to.t - fromT) * fraction;
  const point = pointOf(cubic, t);
  if (options.turn !== true) return { x: point.x, y: point.y };
  const slope = slopeOf(cubic, t);
  const heading =
    slope.dx === 0 && slope.dy === 0
      ? Math.atan2(cubic.y3 - cubic.y0, cubic.x3 - cubic.x0)
      : Math.atan2(slope.dy, slope.dx);
  return { x: point.x, y: point.y, rotation: (heading * 180) / Math.PI };
}
