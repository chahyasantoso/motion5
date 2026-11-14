import type { Cubic2d } from "@gerak/moves";

/** How near two ends must be to meet, in px: rounding apart, not a gap anyone draws. */
export const SEAM = 1e-6;

/** Whether the point `(x, y)` is within a seam of `(toX, toY)`. */
export function meets(x: number, y: number, toX: number, toY: number): boolean {
  return Math.abs(x - toX) <= SEAM && Math.abs(y - toY) <= SEAM;
}

/** Whether a piece ends where it began. */
function isClosed(piece: readonly Cubic2d[]): boolean {
  const first = piece[0];
  const last = piece[piece.length - 1];
  return first !== undefined && last !== undefined && meets(last.x3, last.y3, first.x0, first.y0);
}

/** An outline split into its pieces: a cubic that does not start where the last ended starts another. */
export function piecesOf(cubics: readonly Cubic2d[]): readonly (readonly Cubic2d[])[] {
  const pieces: Cubic2d[][] = [];
  let last: Cubic2d | undefined;
  for (const cubic of cubics) {
    const open = pieces[pieces.length - 1];
    if (open === undefined || last === undefined || !meets(last.x3, last.y3, cubic.x0, cubic.y0))
      pieces.push([cubic]);
    else open.push(cubic);
    last = cubic;
  }
  return pieces;
}

/** The signed area a piece encloses, from its cubics sampled; its sign is the way round it runs. */
function areaOf(piece: readonly Cubic2d[]): number {
  const points = piece.flatMap((c) =>
    [0, 0.25, 0.5, 0.75].map((t) => {
      const u = 1 - t;
      return {
        x: u * u * u * c.x0 + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x3,
        y: u * u * u * c.y0 + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y3,
      };
    }),
  );
  return points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length] ?? point;
    return sum + (point.x * next.y - next.x * point.y) / 2;
  }, 0);
}

/** A piece run the other way round: its cubics in reverse order, each from its end to its start. */
function reversed(piece: readonly Cubic2d[]): readonly Cubic2d[] {
  return piece
    .map(
      (c): Cubic2d => ({
        id: c.id,
        x0: c.x3,
        y0: c.y3,
        x1: c.x2,
        y1: c.y2,
        x2: c.x1,
        y2: c.y1,
        x3: c.x0,
        y3: c.y0,
      }),
    )
    .reverse();
}

/** The two halves of a cubic at t = 0.5, exactly, named `<id>.1` and `<id>.2`. */
function halved(c: Cubic2d): readonly [Cubic2d, Cubic2d] {
  const mid = (a: number, b: number): number => (a + b) / 2;
  const x01 = mid(c.x0, c.x1);
  const y01 = mid(c.y0, c.y1);
  const x12 = mid(c.x1, c.x2);
  const y12 = mid(c.y1, c.y2);
  const x23 = mid(c.x2, c.x3);
  const y23 = mid(c.y2, c.y3);
  const xa = mid(x01, x12);
  const ya = mid(y01, y12);
  const xb = mid(x12, x23);
  const yb = mid(y12, y23);
  const xm = mid(xa, xb);
  const ym = mid(ya, yb);
  return [
    { id: `${c.id}.1`, x0: c.x0, y0: c.y0, x1: x01, y1: y01, x2: xa, y2: ya, x3: xm, y3: ym },
    { id: `${c.id}.2`, x0: xm, y0: ym, x1: xb, y1: yb, x2: x23, y2: y23, x3: c.x3, y3: c.y3 },
  ];
}

/** The length of a cubic's control polygon, which orders cubics by size well enough to split the longest. */
function reach(c: Cubic2d): number {
  return (
    Math.hypot(c.x1 - c.x0, c.y1 - c.y0) +
    Math.hypot(c.x2 - c.x1, c.y2 - c.y1) +
    Math.hypot(c.x3 - c.x2, c.y3 - c.y2)
  );
}

/** A piece split at its longest cubic, again and again, until it has `count` cubics. */
function splitTo(piece: readonly Cubic2d[], count: number): readonly Cubic2d[] {
  const cubics = [...piece];
  while (cubics.length < count) {
    const at = cubics.reduce(
      (best, c, index) => (reach(c) > reach(cubics[best] ?? c) ? index : best),
      0,
    );
    const longest = cubics[at];
    if (longest === undefined) break;
    cubics.splice(at, 1, ...halved(longest));
  }
  return cubics;
}

/** A closed piece turned to run the way `like` does and start at the cubic start nearest its start. */
function turnedLike(piece: readonly Cubic2d[], like: readonly Cubic2d[]): readonly Cubic2d[] {
  const first = like[0];
  if (first === undefined || !isClosed(piece) || !isClosed(like)) return piece;
  const way = areaOf(piece) * areaOf(like) < 0 ? reversed(piece) : piece;
  const near = way.reduce(
    (best, c, index) => {
      const gap = Math.hypot(c.x0 - first.x0, c.y0 - first.y0);
      return gap < best.gap ? { index, gap } : best;
    },
    { index: 0, gap: Infinity },
  ).index;
  return [...way.slice(near), ...way.slice(0, near)];
}

/** Outlines made to blend, the first being the path: the same pieces in the same order, each with as
 * many cubics in every outline; or why they cannot. */
export function matchOutlines(
  outlines: readonly (readonly Cubic2d[])[],
): { readonly matched: readonly (readonly Cubic2d[])[] } | { readonly reason: string } {
  const split = outlines.map(piecesOf);
  const counts = split.map((pieces) => pieces.length);
  const count = counts[0] ?? 0;
  if (counts.some((each) => each !== count)) {
    const named = counts.map(
      (each, index) => `${index === 0 ? "path" : `shapes[${index - 1}]`} has ${each}`,
    );
    return {
      reason: `its outlines have different numbers of pieces (${named.join(", ")}); a piece starts where a cubic does not meet the last.`,
    };
  }
  const first = split[0] ?? [];
  const turned = split.map((pieces, index) =>
    pieces.map((piece, at) => (index === 0 ? piece : turnedLike(piece, first[at] ?? piece))),
  );
  const longest = (at: number): number =>
    turned.reduce((most, pieces) => Math.max(most, pieces[at]?.length ?? 0), 0);
  return {
    matched: turned.map((pieces) => pieces.flatMap((piece, at) => splitTo(piece, longest(at)))),
  };
}

/** The cubics `shape` asks of matched outlines: 0 is the first, 1 the second, between them each
 * control point is blended; clamped to the first and the last. */
export function blendShapes(
  matched: readonly (readonly Cubic2d[])[],
  shape: number,
): readonly Cubic2d[] {
  const last = matched.length - 1;
  const at = Math.min(Math.max(Number.isFinite(shape) ? shape : 0, 0), last);
  const from = Math.min(Math.floor(at), Math.max(last - 1, 0));
  const here = matched[from] ?? [];
  const there = matched[from + 1];
  const share = at - from;
  if (there === undefined || share === 0) return here;
  const lerp = (a: number, b: number): number => a + (b - a) * share;
  return here.map((c, index): Cubic2d => {
    const d = there[index] ?? c;
    return {
      id: c.id,
      x0: lerp(c.x0, d.x0),
      y0: lerp(c.y0, d.y0),
      x1: lerp(c.x1, d.x1),
      y1: lerp(c.y1, d.y1),
      x2: lerp(c.x2, d.x2),
      y2: lerp(c.y2, d.y2),
      x3: lerp(c.x3, d.x3),
      y3: lerp(c.y3, d.y3),
    };
  });
}
