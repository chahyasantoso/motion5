/** A named point in px. */
export type Point2d = { readonly id: string; readonly x: number; readonly y: number };

/** A named path point with the handles of a smooth cubic through it, relative to the point. */
export type Anchor2d = Point2d & {
  readonly inX: number;
  readonly inY: number;
  readonly outX: number;
  readonly outY: number;
};

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

/** A named 3D path point with the handles of a smooth cubic through it, relative to the point. */
export type Anchor3d = {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly inX: number;
  readonly inY: number;
  readonly inZ: number;
  readonly outX: number;
  readonly outY: number;
  readonly outZ: number;
};

/** One 3D cubic Bézier segment from `(x0, y0, z0)` to `(x3, y3, z3)`, named by the anchor it leaves. */
export type Cubic3d = {
  readonly id: string;
  readonly x0: number;
  readonly y0: number;
  readonly z0: number;
  readonly x1: number;
  readonly y1: number;
  readonly z1: number;
  readonly x2: number;
  readonly y2: number;
  readonly z2: number;
  readonly x3: number;
  readonly y3: number;
  readonly z3: number;
};
