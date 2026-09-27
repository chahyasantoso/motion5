import { unreachable } from "../lang/exhaustive";

/**
 * How many passes one FABRIK attempt may take: the iteration cap, and the only owner of it.
 *
 * A cap, not a promise. The loop in `fabrik.ts` also exits the moment a pass moves nothing, which
 * is what an unreachable goal does after its first pass, and the moment the residual is inside
 * `FABRIK_TOLERANCE`. So the cap is reached only by an attempt that is still moving, and the
 * quality it then reports, `iteration-cap`, says exactly that: more passes would have helped.
 *
 * The cap scales with the chain's serial depth, the number of members on its longest root-to-leaf
 * path, because that is the distance a correction travels and the passes a serial chain needs grow
 * with it. It does not scale with member count, which a wide shallow tree inflates without adding
 * any distance. Issue #491 measured it on the envelope's own chain generator with the cap lifted:
 * every rig at every depth from 4 to 128 converged, the worst needed 33 passes at depth 16, 90 at
 * depth 64 and 145 at depth 128, and a fixed 64 left 17 of 200 chain-64 rigs at the cap while they
 * were still converging. Four passes per member is 2.6 times the worst measured need above the
 * floor, and the floor is where four per member meets the old fixed cap, so every chain of depth 16
 * or less keeps its 64-pass bound and its bytes. See ADR-115.
 *
 * Module constants rather than authored values, for the reason ADR-052 gives the tolerance: an
 * interpolatable cap would make the operation count a function of the timeline.
 *
 * A limited chain may run past that cap to a measured multiple of it, because the projection onto its
 * ranges slows the contraction ADR-115 measured on free chains, but only while its own residual says
 * the extra passes will converge: `fabrikPassBudget` owns that decision for both dimensions (ADR-126).
 */

/** The fewest passes any attempt may take before the cap: a 16-deep chain's four per member. */
export const FABRIK_MIN_ITERATIONS = 64;

/** Passes allowed per member on the longest root-to-leaf path, above the floor. */
export const FABRIK_ITERATIONS_PER_DEPTH = 4;

/**
 * The multiple of the free cap a limited chain may take (ADR-126, issue #514).
 *
 * ADR-115 measured the free cap on free chains only. A limited chain converges more slowly, because
 * every pass projects its members onto their ranges and a correction then travels by the part the
 * projection leaves. On issue #514's corpus of 1,771 reachable-by-construction limited serial chains
 * (legal angles, then FK, then the goal, two to five members), with the opposite-side retry and
 * bidirectional enforcement in place, a factor of two converged 47 more rigs, four 100 more and
 * eight 109 more, while halving the near-miss `iteration-cap` count at four (103 to 52) and gaining
 * nine rigs for twice the passes at eight. Four is the knee. It is a ceiling, not an allowance:
 * past the free cap `fabrikPassBudget` spends it only on an attempt that projects convergence.
 */
export const FABRIK_LIMITED_CAP_FACTOR = 4;

/**
 * Whether any member of a chain constrains the solve: a closed union so the cap is read by an
 * exhaustive switch rather than a flag, and a new constraint kind has to say what it pays.
 */
export type FabrikConstraint = "free" | "limited";

/**
 * The cap for a chain whose longest root-to-leaf path has `depth` members, under `constraint`.
 *
 * `depth` is a non-negative integer derived by the solve from the canonical member order, so the
 * cap is a pure function of the rig and not of the order a caller listed its members in. A free
 * chain keeps ADR-115's cap and its bytes; a limited one takes `FABRIK_LIMITED_CAP_FACTOR` times it.
 */
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

/**
 * The passes over which a limited attempt past the free cap measures its own rate of progress, and
 * the interval at which it re-measures (ADR-126).
 *
 * Replayed over the per-pass residuals of every limited attempt in issue #514's corpora, windows of
 * 4, 8, 16 and 32 passes kept within two rigs of one another in converged count and pass total, so
 * the window is not a tuning knob; eight is short enough to stop a crawl early and long enough that
 * one noisy pass does not decide it.
 */
export const FABRIK_PROGRESS_WINDOW = 8;

/** How many passes one FABRIK attempt takes: asked once before every pass, in pass order. */
export interface FabrikPassBudget {
  /** Whether an attempt that has taken `iterations` passes and stands at `residual` takes another. */
  admits(iterations: number, residual: number): boolean;
}

/**
 * The pass budget of one attempt on a chain `depth` members deep under `constraint`, converging to
 * `tolerance` (ADR-115, ADR-126, issue #514).
 *
 * A free chain takes its cap, exactly the `iterations < cap` it always read, so its bytes hold. A
 * limited chain takes the same free cap unconditionally, then continues toward the limited ceiling
 * only while the residual's geometric rate over the last `FABRIK_PROGRESS_WINDOW` passes projects
 * `tolerance` inside the passes the ceiling has left, re-measured every window. The plain 4x
 * ceiling spent it on every limited miss that kept moving, twice when the opposite-side retry ran,
 * and cost TH-84's seeded constrained 3D corpus 4.7 times its pre-#514 solve time for 44 more
 * converged rigs; the projection keeps all but one of them at 1.02 times the pre-#514 passes. A
 * budget that stops a limited attempt this way reports what the cap reports, because the attempt
 * was still moving: `iteration-cap`, or `limited` when it ends on a bound.
 */
export function fabrikPassBudget(
  depth: number,
  constraint: FabrikConstraint,
  tolerance: number,
): FabrikPassBudget {
  const free = fabrikIterationCap(depth, "free");
  switch (constraint) {
    case "free":
      return { admits: (iterations) => iterations < free };
    case "limited":
      return limitedPassBudget(free, fabrikIterationCap(depth, "limited"), tolerance);
    default:
      return unreachable(constraint);
  }
}

function limitedPassBudget(free: number, ceiling: number, tolerance: number): FabrikPassBudget {
  // The residual each pass ended at, indexed by pass, so a window boundary reads its own start.
  const trail: number[] = [];
  return {
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

/**
 * Whether a residual that fell from `before` to `now` over one `FABRIK_PROGRESS_WINDOW`, carried on
 * at that geometric rate, reaches `tolerance` within `remaining` passes. A residual that did not fall
 * projects nothing, so a limited attempt that oscillates or holds stops at the next boundary.
 */
export function projectsConvergence(
  before: number,
  now: number,
  tolerance: number,
  remaining: number,
): boolean {
  if (!(now < before)) return false;
  const windows = Math.log(tolerance / now) / Math.log(now / before);
  return windows * FABRIK_PROGRESS_WINDOW <= remaining;
}
