import {
  isClosedPath,
  meets,
  mix,
  pathArea,
  resamplePath,
  reversePath,
  type Cubic2d,
} from "@gerak/core";

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

/** A closed piece turned to run the way `like` does and start at the cubic start nearest its start. */
function turnedLike(piece: readonly Cubic2d[], like: readonly Cubic2d[]): readonly Cubic2d[] {
  const first = like[0];
  if (first === undefined || !isClosedPath(piece) || !isClosedPath(like)) return piece;
  const way = pathArea(piece) * pathArea(like) < 0 ? reversePath(piece) : piece;
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
    matched: turned.map((pieces) =>
      pieces.flatMap((piece, at) => resamplePath(piece, longest(at))),
    ),
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
  return here.map((c, index): Cubic2d => {
    const d = there[index] ?? c;
    return {
      id: c.id,
      x0: mix(c.x0, d.x0, share),
      y0: mix(c.y0, d.y0, share),
      x1: mix(c.x1, d.x1, share),
      y1: mix(c.y1, d.y1, share),
      x2: mix(c.x2, d.x2, share),
      y2: mix(c.y2, d.y2, share),
      x3: mix(c.x3, d.x3, share),
      y3: mix(c.y3, d.y3, share),
    };
  });
}
