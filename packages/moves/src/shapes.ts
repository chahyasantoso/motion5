/** A named point in px. */
export type Point2d = { readonly id: string; readonly x: number; readonly y: number };

/** A named path point with the handles of a smooth cubic through it, relative to the point. */
export type Anchor2d = Point2d & {
  readonly inX: number;
  readonly inY: number;
  readonly outX: number;
  readonly outY: number;
};

/** A circle that shows what lies inside it. */
export type Reveal = { readonly x: number; readonly y: number; readonly radius: number };

/** The share of a path drawn from its start, from 0 to 1. */
export type Drawn = { readonly drawn: number };

/** One cubic Bézier segment from `(x0, y0)` to `(x3, y3)`, named by the anchor it leaves. */
export type Cubic2d = {
  readonly id: string;
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
  readonly x3: number;
  readonly y3: number;
};
