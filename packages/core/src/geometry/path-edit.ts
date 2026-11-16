import type { Cubic2d } from "./shapes";

/** An affine matrix `[a, b, c, d, e, f]`, as SVG writes `matrix(a b c d e f)`. */
export type Matrix2d = readonly [number, number, number, number, number, number];

/** A path carried through a matrix: every point moved, every id kept. */
export function transformPath(cubics: readonly Cubic2d[], matrix: Matrix2d): readonly Cubic2d[] {
  const [a, b, c, d, e, f] = matrix;
  const x = (px: number, py: number): number => a * px + c * py + e;
  const y = (px: number, py: number): number => b * px + d * py + f;
  return cubics.map((cubic) => ({
    id: cubic.id,
    x0: x(cubic.x0, cubic.y0),
    y0: y(cubic.x0, cubic.y0),
    x1: x(cubic.x1, cubic.y1),
    y1: y(cubic.x1, cubic.y1),
    x2: x(cubic.x2, cubic.y2),
    y2: y(cubic.x2, cubic.y2),
    x3: x(cubic.x3, cubic.y3),
    y3: y(cubic.x3, cubic.y3),
  }));
}

/** A path run the other way round: its cubics in reverse order, each from its end to its start. */
export function reversePath(cubics: readonly Cubic2d[]): readonly Cubic2d[] {
  return cubics
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

function reach(c: Cubic2d): number {
  return (
    Math.hypot(c.x1 - c.x0, c.y1 - c.y0) +
    Math.hypot(c.x2 - c.x1, c.y2 - c.y1) +
    Math.hypot(c.x3 - c.x2, c.y3 - c.y2)
  );
}

/** A path split at its longest cubic, again and again, until it has `count` cubics; the halves are named `<id>.1` and `<id>.2`, and a path already that long is returned as it is. */
export function resamplePath(cubics: readonly Cubic2d[], count: number): readonly Cubic2d[] {
  const out = [...cubics];
  while (out.length < count) {
    const at = out.reduce((best, c, index) => (reach(c) > reach(out[best] ?? c) ? index : best), 0);
    const longest = out[at];
    if (longest === undefined) break;
    out.splice(at, 1, ...halved(longest));
  }
  return out;
}
