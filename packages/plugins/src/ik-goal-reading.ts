import { unreachable } from "@motion5/core/plugin-api";

/**
 * One goal's coordinates, read as a point when finite and as a direction when any axis is infinite.
 */
export type GoalReading =
  | { readonly kind: "point"; readonly coordinates: readonly number[] }
  | { readonly kind: "direction"; readonly direction: readonly number[] };

/** One goal coordinate, beside the axis name a refusal cites for it. */
export type GoalAxis = readonly [axis: string, value: number];

/**
 * Turns coordinates into a point or a unit direction; the first `NaN` is refused by axis name as a thrown `Error`.
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
 * Where an iterative solve sends the tip: a point itself, a direction at twice `reach` along its ray.
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
 * How far a tip stands from one reading: `Math.hypot` over coordinate differences, `Infinity` for a direction.
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
