import { unreachable } from "../lang/exhaustive";

/**
 * What a solve reaches for when it reads one goal's world coordinates: a point, or a direction.
 *
 * One owner for the 2D closed form, FABRIK and the internal 3D closed form, so no two of them can
 * answer a non-finite goal differently. Finite coordinates are a point, byte for byte what was
 * delivered. Any infinite coordinate makes the goal a direction instead: the unit vector of the
 * signs of the infinite coordinates, to which a finite coordinate contributes zero, because it is
 * negligible beside an infinite one, and two infinities weigh alike, so `(Infinity, 5)` is `+x` and
 * `(Infinity, -Infinity)` is `-45` degrees. That is the direction `Math.atan2` already found for an
 * infinite goal on the closed form before this reader existed, stated once. A `NaN` coordinate names
 * neither, so it is refused by the member and the axis rather than read as a point that publishes
 * `NaN` or laundered into a plausible number. A goal's `rotation` is part of its frame and is not a
 * coordinate: no solve reads it. See ADR-106, ADR-111 and issue #489.
 */
export type GoalReading =
  | { readonly kind: "point"; readonly coordinates: readonly number[] }
  | { readonly kind: "direction"; readonly direction: readonly number[] };

/** One goal coordinate, beside the axis name a refusal cites for it. */
export type GoalAxis = readonly [axis: string, value: number];

/**
 * Reads one goal, refusing the first `NaN` coordinate in axis order by name.
 *
 * The refusal is a thrown `Error`, like every other solver refusal, so at runtime it would surface
 * through the publisher's composition failure. No delivered goal reaches it there today: a node's
 * published values must be finite, and `readFrame` reads a non-finite field as zero. The solve
 * functions are pure and callable with any frame, and this is what makes them total over one.
 */
export function readGoal(memberId: string, axes: readonly GoalAxis[]): GoalReading {
  const signs: number[] = [];
  let infinite = false;
  for (const [axis, value] of axes) {
    if (Number.isNaN(value)) {
      throw new Error(
        `Solver goal on member "${memberId}" has a NaN ${axis} coordinate, which names no point or direction to solve toward.`,
      );
    }
    const sign = Number.isFinite(value) ? 0 : Math.sign(value);
    if (sign !== 0) infinite = true;
    signs.push(sign);
  }
  if (!infinite) {
    return { kind: "point", coordinates: Object.freeze(axes.map(([, value]) => value)) };
  }
  const extent = Math.hypot(...signs);
  return { kind: "direction", direction: Object.freeze(signs.map((sign) => sign / extent)) };
}

/**
 * The finite point an iterative solve moves a tip toward for one reading.
 *
 * A point is itself. A direction cannot be iterated toward, so it stands in as the point on its
 * ray from `origin` at twice `reach`, the most the tip's path can extend: past every pose the path
 * can take, so the iteration straightens the path along the direction exactly as it does toward any
 * unreachable goal. A path with no extent aims one unit out, and a `reach` too large to double
 * saturates at a quarter of the largest double so the stand-in stays finite. `reach` is read only
 * for a direction, so a finite goal pays nothing for it.
 */
export function aimPoint(
  reading: GoalReading,
  origin: readonly number[],
  reach: () => number,
): readonly number[] {
  switch (reading.kind) {
    case "point":
      return reading.coordinates;
    case "direction": {
      const doubled = 2 * reach();
      const distance = Number.isFinite(doubled) ? Math.max(1, doubled) : Number.MAX_VALUE / 4;
      return Object.freeze(
        origin.map((coordinate, axis) => coordinate + reading.direction[axis]! * distance),
      );
    }
    default:
      return unreachable(reading);
  }
}

/**
 * The miss a tip leaves against one reading, which is what a solve publishes as that goal's residual.
 *
 * The Euclidean distance to a point, spelled `Math.hypot` over the coordinate differences so it is
 * byte for byte the miss every strategy measured before this owner existed. A direction is
 * infinitely far from every finite tip, so its miss is `Infinity` whatever pose the tip stands in.
 */
export function goalMiss(reading: GoalReading, tip: readonly number[]): number {
  switch (reading.kind) {
    case "point":
      return Math.hypot(...reading.coordinates.map((coordinate, axis) => tip[axis]! - coordinate));
    case "direction":
      return Number.POSITIVE_INFINITY;
    default:
      return unreachable(reading);
  }
}
