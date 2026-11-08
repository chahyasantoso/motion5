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
