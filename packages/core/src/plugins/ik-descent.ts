import { unreachable } from "../plugin-api";

/**
 * Bounded legal descent: a damped least-squares walk in joint space from a legal pose toward the
 * addressed aims, the last legal start a constrained FABRIK miss pays for (issue #524, ADR-132).
 *
 * Why joint space. A limited FABRIK attempt settles where its inward pull and the outward pass's
 * projection onto a bound cancel. On the #514 corpus every mixed-sign miss the seed portfolio
 * leaves is such a fixed point and none is a local minimum of the residual: the projected gradient
 * over the legal joint box is far from zero at each published pose (`issue524/classify.ts`), so a
 * legal direction that lowers the miss always exists and FABRIK's position-space projection cannot
 * see it. Another FABRIK seed is a guess about which basin to start in; a descent follows the
 * gradient the fixed point ignores. Its end pose seeds one ordinary FABRIK attempt, so FABRIK
 * stays the only publisher and every quality, bound and legality rule it owns is unchanged.
 *
 * Dimension-free. The 2D seed (`fabrik-seed.ts`) and the 3D seed (`ik3d-seed.ts`) each own their
 * pose, their degrees of freedom and their limit rules, and describe them through `LegalDescent`;
 * this module owns only the walk. A degree of freedom is an angle in degrees: a 2D local angle, a
 * 3D hinge angle, or one of the two turns that tilt a 3D member's direction. The Jacobian is read
 * by one-sided differences through the owner's own composition, so it is exact for whatever
 * reconstruction the owner applies (a swing from rest, a cone projection) and needs no second copy
 * of that geometry. A probe on a bound steps into the range, never out of it.
 *
 * The step is Levenberg-Marquardt in its dual form, `-Jᵀ (J Jᵀ + λ I)⁻¹ m`, over two or three rows
 * per addressed leaf, with `λ` in units of `(reach · π/180)²`, the squared tip motion per degree of
 * the longest addressed lever, so the walk is scale-free. That unit is read from the rig rather
 * than from `J Jᵀ` on purpose: a planar rig's 3D image carries an out-of-plane row the 2D rig does
 * not, and a trace-relative damping would walk the two dimensions down different paths. A degree
 * of freedom resting on a bound whose gradient points out of its range is pinned for that step: the
 * box's active set. Only a step that strictly lowers the summed squared miss is taken, so the walk
 * is monotone and every pose it visits is legal, because the owner's `turn` enforces every limit.
 * It ends inside `LEGAL_DESCENT_TOLERANCE`, at `LEGAL_DESCENT_STEPS` accepted steps, or when damping passes its
 * ceiling, and is a fixed sequence of floating-point operations, so it is reproducible (ADR-111).
 */

/** Where one degree of freedom sits against its range. A free angle is always `interior`. */
export type DofBound = "interior" | "lower" | "upper";

/** A pose a legal descent can walk, described by the dimension that owns it. */
export interface LegalDescent<S> {
  /** How many angles the walk may turn; zero ends it at the start. */
  readonly dofs: number;
  /** Coordinates per addressed aim, 2 or 3: `misses` groups by it to read the worst miss. */
  readonly width: number;
  /** The longest addressed path's extent, lengths plus offsets, in world units: the damping unit. */
  readonly reach: number;
  /** Tip minus aim for every addressed leaf in canonical leaf order, stacked, in world units. */
  misses(state: S): readonly number[];
  /** The pose after turning each degree of freedom by `degrees[dof]`, every limit enforced. */
  turn(state: S, degrees: readonly number[]): S;
  /** Where one degree of freedom of `state` sits against its range. */
  bound(state: S, dof: number): DofBound;
}

/**
 * Accepted steps a descent may take. On the #514 corpus every mixed-sign miss the descent meets
 * from the legal centre does so in 44 accepted steps or fewer, most in under ten; the cap bounds
 * the walk on the rare pose that keeps improving slowly without reaching the aim.
 */
export const LEGAL_DESCENT_STEPS = 64;

/**
 * The worst miss, in world units, at which the walk stops: a tenth of `FABRIK_TOLERANCE`, so the
 * attempt it seeds recomposes the pose on its first outward pass and reports `converged` without an
 * iteration, with a margin for that recomposition's rounding. A literal rather than an import,
 * because `fabrik.ts` imports this module through its seed; a case pins the ratio.
 */
export const LEGAL_DESCENT_TOLERANCE = 1e-4;

/** The one-sided probe, in degrees: small against any range, large against rounding. */
const PROBE_DEGREES = 1e-5;
const RADIANS = Math.PI / 180;
/** Damping in units of `(reach · π/180)²`: its first value, floor, ceiling and adjustments. */
const INITIAL_DAMPING = 1e-3;
const DAMPING_FLOOR = 1e-9;
const DAMPING_CEILING = 1e8;
const DAMPING_RELIEF = 3;
const DAMPING_PENALTY = 4;

/** The legal pose a descent from `start` ends at; `start` itself when no step lowers the miss. */
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

/**
 * One column per degree of freedom: how the stacked misses move per degree of turn, probed into
 * the range. A column is zero when its degree of freedom is pinned, resting on a bound with the
 * gradient of the squared miss pointing out of the range, so the step leaves it where it is.
 */
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

/** Whether a bound holds a degree of freedom whose descent direction, `-slope`, leaves the range. */
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

/** The largest per-aim distance: the residual FABRIK reports, the worst leaf rather than a mean. */
function worstMiss(misses: readonly number[], width: number): number {
  let worst = 0;
  for (let start = 0; start < misses.length; start += width) {
    let sum = 0;
    for (let axis = 0; axis < width; axis += 1) sum += misses[start + axis]! ** 2;
    worst = Math.max(worst, Math.sqrt(sum));
  }
  return worst;
}

/**
 * `matrix · x = rhs` by Gaussian elimination with partial pivoting. The matrix is `J Jᵀ` plus a
 * positive multiple of the identity, symmetric positive definite, so every pivot is nonzero.
 */
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
