import { unreachable } from "@motion5/core/plugin-api";

/** Damped least-squares walk in joint space from a legal pose toward the aims; only a
 * strictly lowering step is taken; the end pose seeds one FABRIK attempt; FABRIK stays the only publisher. */

/** Where one degree of freedom sits against its range; a free angle is `interior`. */
export type DofBound = "interior" | "lower" | "upper";

/** A pose a legal descent can walk, described by the dimension that owns it. */
export interface LegalDescent<S> {
  /** Angles the walk may turn; zero ends it at the start. */
  readonly dofs: number;
  /** Coordinates per addressed aim, 2 or 3: the stride of `misses`. */
  readonly width: number;
  /** Extent of the longest addressed path, lengths plus offsets, world units: the damping unit. */
  readonly reach: number;
  /** Tip minus aim per addressed leaf, canonical leaf order, stacked, world units. */
  misses(state: S): readonly number[];
  /** Pose after turning each degree of freedom by `degrees[dof]`, every limit enforced. */
  turn(state: S, degrees: readonly number[]): S;
  /** Where one degree of freedom of `state` sits against its range. */
  bound(state: S, dof: number): DofBound;
}

/** Accepted steps one descent may take; caps a slow-improving walk short of the aim. */
export const LEGAL_DESCENT_STEPS = 64;

/** Worst miss, world units, that stops the walk: a tenth of `FABRIK_TOLERANCE`, so the seeded attempt reports `converged` at once. Literal: `fabrik.ts` imports it via its seed. */
export const LEGAL_DESCENT_TOLERANCE = 1e-4;

/** One-sided probe, degrees: small against any range, large against rounding. */
const PROBE_DEGREES = 1e-5;
const RADIANS = Math.PI / 180;
/** Damping in `(reach · π/180)²` units: first value, floor, ceiling, adjustments. */
const INITIAL_DAMPING = 1e-3;
const DAMPING_FLOOR = 1e-9;
const DAMPING_CEILING = 1e8;
const DAMPING_RELIEF = 3;
const DAMPING_PENALTY = 4;

/** Legal pose a descent from `start` ends at; `start` itself when no step lowers the miss. */
export function descendLegally<S>(problem: LegalDescent<S>, start: S): S {
  let state = start;
  let misses = problem.misses(state);
  let cost = squaredNorm(misses);
  let damping = INITIAL_DAMPING;
  const scale = (problem.reach * RADIANS) ** 2;
  for (let step = 0; step < LEGAL_DESCENT_STEPS; step += 1) {
    if (problem.dofs === 0 || worstMiss(misses, problem.width) <= LEGAL_DESCENT_TOLERANCE)
      return state;
    const columns = jacobian(problem, state, misses);
    const rows = misses.length;
    const gram = Array.from({ length: rows }, () => new Array<number>(rows).fill(0));
    for (const column of columns)
      for (let row = 0; row < rows; row += 1)
        for (let other = 0; other < rows; other += 1)
          gram[row]![other]! += column[row]! * column[other]!;
    if (!(scale > 0) || columns.every((column) => column.every((value) => value === 0)))
      return state;
    for (;;) {
      const damped = gram.map((line, row) =>
        line.map((value, other) => (row === other ? value + damping * scale : value)),
      );
      const weights = solveLinear(damped, misses);
      const degrees = columns.map((column) => {
        let sum = 0;
        for (let row = 0; row < rows; row += 1) sum -= column[row]! * weights[row]!;
        return sum;
      });
      const candidate = problem.turn(state, degrees);
      const candidateMisses = problem.misses(candidate);
      const candidateCost = squaredNorm(candidateMisses);
      if (candidateCost < cost) {
        state = candidate;
        misses = candidateMisses;
        cost = candidateCost;
        damping = Math.max(DAMPING_FLOOR, damping / DAMPING_RELIEF);
        break;
      }
      damping *= DAMPING_PENALTY;
      if (damping > DAMPING_CEILING) return state;
    }
  }
  return state;
}

/** One column per dof: one-sided miss change per degree, probed into range; pinned dof zeroed. */
function jacobian<S>(
  problem: LegalDescent<S>,
  state: S,
  misses: readonly number[],
): readonly number[][] {
  const columns: number[][] = [];
  const probe = new Array<number>(problem.dofs).fill(0);
  for (let dof = 0; dof < problem.dofs; dof += 1) {
    const bound = problem.bound(state, dof);
    const delta = bound === "upper" ? -PROBE_DEGREES : PROBE_DEGREES;
    probe[dof] = delta;
    const moved = problem.misses(problem.turn(state, probe));
    probe[dof] = 0;
    const column = misses.map((miss, row) => (moved[row]! - miss) / delta);
    let slope = 0;
    for (let row = 0; row < misses.length; row += 1) slope += column[row]! * misses[row]!;
    columns.push(pinned(bound, slope) ? column.map(() => 0) : column);
  }
  return columns;
}

/** Whether a bound pins a degree of freedom: its descent direction, `-slope`, leaves the range. */
function pinned(bound: DofBound, slope: number): boolean {
  switch (bound) {
    case "interior":
      return false;
    case "lower":
      return slope > 0;
    case "upper":
      return slope < 0;
    default:
      return unreachable(bound);
  }
}

function squaredNorm(values: readonly number[]): number {
  let sum = 0;
  for (const value of values) sum += value * value;
  return sum;
}

function worstMiss(misses: readonly number[], width: number): number {
  let worst = 0;
  for (let start = 0; start < misses.length; start += width) {
    let sum = 0;
    for (let axis = 0; axis < width; axis += 1) sum += misses[start + axis]! ** 2;
    worst = Math.max(worst, Math.sqrt(sum));
  }
  return worst;
}

/** `matrix · x = rhs` by Gaussian elimination with partial pivoting; symmetric positive definite, so every pivot is nonzero. */
function solveLinear(matrix: readonly (readonly number[])[], rhs: readonly number[]): number[] {
  const size = rhs.length;
  const rows = matrix.map((line, index) => [...line, rhs[index]!]);
  for (let column = 0; column < size; column += 1) {
    let pivot = column;
    for (let row = column + 1; row < size; row += 1)
      if (Math.abs(rows[row]![column]!) > Math.abs(rows[pivot]![column]!)) pivot = row;
    [rows[column], rows[pivot]] = [rows[pivot]!, rows[column]!];
    const lead = rows[column]!;
    for (let row = column + 1; row < size; row += 1) {
      const line = rows[row]!;
      const factor = line[column]! / lead[column]!;
      for (let at = column; at <= size; at += 1) line[at]! -= factor * lead[at]!;
    }
  }
  const solution = new Array<number>(size).fill(0);
  for (let row = size - 1; row >= 0; row -= 1) {
    const line = rows[row]!;
    let sum = line[size]!;
    for (let at = row + 1; at < size; at += 1) sum -= line[at]! * solution[at]!;
    solution[row] = sum / line[row]!;
  }
  return solution;
}
