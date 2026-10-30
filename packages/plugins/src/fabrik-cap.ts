import { unreachable } from "@motion5/core/plugin-api";

/** The FABRIK iteration cap and its only owner; it scales with serial depth, not member count. */

/** The fewest passes any attempt may take: four per member at depth 16. */
export const FABRIK_MIN_ITERATIONS = 64;

/** Passes per member on the longest root-to-leaf path, above the floor. */
export const FABRIK_ITERATIONS_PER_DEPTH = 4;

/** The multiple of the free cap a limited chain may reach: a ceiling, not an allowance. */
export const FABRIK_LIMITED_CAP_FACTOR = 4;

/** Whether any member of a chain constrains the solve. */
export type FabrikConstraint = "free" | "limited";

/** The pass cap for a chain `depth` members deep under `constraint`. */
export function fabrikIterationCap(depth: number, constraint: FabrikConstraint): number {
  const free = Math.max(FABRIK_MIN_ITERATIONS, FABRIK_ITERATIONS_PER_DEPTH * depth);
  switch (constraint) {
    case "free":
      return free;
    case "limited":
      return FABRIK_LIMITED_CAP_FACTOR * free;
    default:
      return unreachable(constraint);
  }
}

/** Passes per progress measurement past the free cap. */
export const FABRIK_PROGRESS_WINDOW = 8;

/** Relative movement, in units of `Number.EPSILON`, at or below which a pass moved only by rounding. */
export const FABRIK_ROUNDING_ULPS = 1024;

/** One tip's movement over `scale`, the largest coordinate magnitude along its own path; `Infinity` unless `scale` is finite positive, `NaN` kept. */
export function fabrikRelativeMove(moved: number, scale: number): number {
  if (moved === 0) return 0;
  if (!(scale > 0 && scale < Infinity)) return Infinity;
  return Math.max(Number.MIN_VALUE, moved / scale);
}

/** Whether a candidate residual beats a held one: `NaN` ranks last, an exact tie keeps the held value. */
export function fabrikResidualOutranks(candidate: number, held: number): boolean {
  if (Number.isNaN(candidate)) return false;
  if (Number.isNaN(held)) return true;
  return candidate < held;
}

/** An attempt's incumbent: nothing before its first pass, then the best residual held. */
type FabrikIncumbentState =
  | { readonly kind: "empty" }
  | { readonly kind: "held"; readonly residual: number };

/** Publishes the best completed pass, earliest on a tie, so 2D and 3D agree; the caller holds its pose by reference, never a seed. */
export class FabrikIncumbent {
  #state: FabrikIncumbentState = { kind: "empty" };

  /** Offers a just-completed pass; `true` means it is the incumbent and the caller holds it. */
  offer(residual: number): boolean {
    switch (this.#state.kind) {
      case "empty":
        break;
      case "held":
        if (!fabrikResidualOutranks(residual, this.#state.residual)) return false;
        break;
      default:
        return unreachable(this.#state);
    }
    this.#state = { kind: "held", residual };
    return true;
  }

  /** The held pass's residual, or `undefined` when no pass completed. */
  get residual(): number | undefined {
    switch (this.#state.kind) {
      case "empty":
        return undefined;
      case "held":
        return this.#state.residual;
      default:
        return unreachable(this.#state);
    }
  }
}

/** One pass's tip movement: `relative` (largest `fabrikRelativeMove`) and `moved` in world units; both zero exactly when no tip moved. */
export interface FabrikPassMotion {
  readonly relative: number;
  readonly moved: number;
}

/** What one pass did: `still` moved no tip, `rounding` within the band and `bound`, `moving` more or non-finitely. */
export type FabrikPassMovement = "still" | "rounding" | "moving";

/** Names a pass that moved as `motion` says: rounding needs both the relative band and `bound`. */
export function fabrikPassMovement(motion: FabrikPassMotion, bound: number): FabrikPassMovement {
  if (motion.relative === 0) return "still";
  return motion.relative <= FABRIK_ROUNDING_ULPS * Number.EPSILON && motion.moved <= bound
    ? "rounding"
    : "moving";
}

/** The most world units a rounding pass may move: `tolerance` shared over the `passes` an attempt may take. */
export function fabrikRoundingBound(tolerance: number, passes: number): number {
  return tolerance / passes;
}

/** How many passes an attempt takes, and when a pass leaves it at a fixed point. */
export interface FabrikPassBudget {
  /** Whether an attempt at `iterations` passes and `residual` takes another, asked before every pass. */
  admits(iterations: number, residual: number): boolean;
  /** Whether the pass that moved as `motion` says ends the attempt at a fixed point, asked after every pass. */
  settles(motion: FabrikPassMotion): boolean;
}

/** The pass budget of one attempt on a `depth`-deep chain under `constraint`; a limited chain passes the free cap only on projected convergence. */
export function fabrikPassBudget(
  depth: number,
  constraint: FabrikConstraint,
  tolerance: number,
): FabrikPassBudget {
  const free = fabrikIterationCap(depth, "free");
  switch (constraint) {
    case "free":
      return {
        admits: (iterations) => iterations < free,
        settles: settlesAfter(fabrikRoundingBound(tolerance, free)),
      };
    case "limited":
      return limitedPassBudget(free, fabrikIterationCap(depth, "limited"), tolerance);
    default:
      return unreachable(constraint);
  }
}

/** Fixed-point test: no movement settles at once, a second consecutive `rounding` pass settles, `moving` restarts. */
function settlesAfter(bound: number): (motion: FabrikPassMotion) => boolean {
  let rounding = false;
  return (motion) => {
    const movement = fabrikPassMovement(motion, bound);
    const previous = rounding;
    rounding = movement === "rounding";
    switch (movement) {
      case "still":
        return true;
      case "rounding":
        return previous;
      case "moving":
        return false;
      default:
        return unreachable(movement);
    }
  };
}

function limitedPassBudget(free: number, ceiling: number, tolerance: number): FabrikPassBudget {
  // The residual at each pass count, so a window reads its own start.
  const trail: number[] = [];
  return {
    settles: settlesAfter(fabrikRoundingBound(tolerance, ceiling)),
    admits(iterations, residual) {
      trail[iterations] = residual;
      if (iterations < free) return true;
      if (iterations >= ceiling) return false;
      if ((iterations - free) % FABRIK_PROGRESS_WINDOW !== 0) return true;
      const before = trail[iterations - FABRIK_PROGRESS_WINDOW]!;
      return projectsConvergence(before, residual, tolerance, ceiling - iterations);
    },
  };
}

/** Whether a residual falling from `before` to `now` over one window reaches `tolerance` within `remaining` passes at that geometric rate. */
export function projectsConvergence(
  before: number,
  now: number,
  tolerance: number,
  remaining: number,
): boolean {
  if (now <= tolerance) return true;
  if (!(now < before) || !Number.isFinite(before)) return false;
  const windows = Math.log(tolerance / now) / Math.log(now / before);
  return windows * FABRIK_PROGRESS_WINDOW <= remaining;
}
