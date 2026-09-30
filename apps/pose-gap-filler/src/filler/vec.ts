/**
 * A point or a direction in the space a frame was read in: two components in image space and three
 * in world space (`space.ts`). Every operation here is dimension-generic, so the filler core never
 * branches on the dimension; only `space.ts` answers which one a frame has.
 */
export type Vec = readonly number[];

export function add(a: Vec, b: Vec): Vec {
  return a.map((value, index) => value + b[index]!);
}

export function sub(a: Vec, b: Vec): Vec {
  return a.map((value, index) => value - b[index]!);
}

export function scale(a: Vec, factor: number): Vec {
  return a.map((value) => value * factor);
}

export function dot(a: Vec, b: Vec): number {
  let sum = 0;
  for (let index = 0; index < a.length; index += 1) sum += a[index]! * b[index]!;
  return sum;
}

export function norm(a: Vec): number {
  return Math.sqrt(dot(a, a));
}

export function distance(a: Vec, b: Vec): number {
  return norm(sub(a, b));
}

/** The unit vector along `a`, or `undefined` for a vector too short to have a direction. */
export function unit(a: Vec): Vec | undefined {
  const length = norm(a);
  return length > 1e-9 ? scale(a, 1 / length) : undefined;
}

export function isFiniteVec(a: Vec): boolean {
  return a.every((value) => Number.isFinite(value));
}
