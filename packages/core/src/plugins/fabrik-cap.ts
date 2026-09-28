import { unreachable } from "../lang/exhaustive";

/**
 * How many passes one FABRIK attempt may take: the iteration cap, and the only owner of it.
 *
 * A cap, not a promise. The loop in `fabrik.ts` also exits the moment a pass moves nothing, which
 * is what an unreachable goal does after its first pass, and the moment the residual is inside
 * `FABRIK_TOLERANCE`. So the cap is reached only by an attempt that is still moving, and the
 * quality it then reports, `iteration-cap`, says exactly that: more passes would have helped. What
 * "moves nothing" means is this module's too, one rule for every constraint, through
 * `FabrikPassBudget.settles` (issue #519), so both dimensions stop an attempt on one rule.
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
 * A limited chain may run past that cap to a measured multiple of it, because the projection onto
 * its ranges slows the contraction ADR-115 measured on free chains, but only while its own residual
 * says the extra passes will converge: `fabrikPassBudget` owns that decision for both dimensions
 * (ADR-126).
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
 * projection leaves. On issue #514's corpus of 1,771 reachable-by-construction limited serial
 * chains (legal angles, then FK, then the goal, two to five members), with the opposite-side retry
 * and bidirectional enforcement in place, a factor of two converged 47 more rigs, four 100 more and
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
 * chain keeps ADR-115's cap and its bytes; a limited one takes `FABRIK_LIMITED_CAP_FACTOR` times
 * it.
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

/**
 * The relative movement, in units of `Number.EPSILON`, at or below which a pass moved only by
 * rounding (issue #519).
 *
 * The 2D and 3D solves reach the same planar fixed point by different arithmetic: 2D places a tip
 * through `atan2`, `cos` and `sin` or a plain quotient, 3D rebuilds every frame by matrix products.
 * At that fixed point one dimension often lands on an exact repeat while the other circles it by a
 * few ulps for ever, so an exact `moved === 0` called one `stalled` and the other `iteration-cap`:
 * 35 of 23,245 limited and 1 of 755 free planar rigs over eight 3,000-rig seeds of
 * tools/issue519/agreement.ts. Measured over 3,000-rig planar, +z-hinge and random-axis corpora
 * (tools/issue519/threshold-sweep.ts), the 2D rounding floor is about one unit and the 3D one
 * wanders up to about 600, while no attempt that once moved 2^16 units or less ever moved more than
 * 2^24 again (the first such revival appears at a cut of 2^20). 1,024 sits above the 3D floor and
 * 1,024 times below the first revival; on a 300-unit chain it is 7e-11 world units, seven orders
 * under `FABRIK_TOLERANCE`, so no pass it absorbs could have carried a residual to it.
 */
export const FABRIK_ROUNDING_ULPS = 1024;

/**
 * One tip's movement over a pass relative to `scale`, the largest coordinate magnitude on the path
 * it was computed along (the root's point, then every pivot and tip from the root's first member
 * down to it), because rounding is relative to that: a coordinate's error comes from the sums it
 * was computed through, not from its own magnitude, and a branch it was not computed through
 * contributes none. An unrelated branch a million times larger therefore cannot make this tip's
 * real motion read as rounding (independent pass QP-1).
 *
 * Exactly zero only for a tip that did not move, whatever the scale, so `still` means precisely no
 * movement: a nonzero quotient that would underflow is held at `Number.MIN_VALUE`, a movement with
 * no finite positive scale to judge it by is `Infinity`, and a `NaN` movement stays `NaN`, which no
 * band holds.
 */
export function fabrikRelativeMove(moved: number, scale: number): number {
  if (moved === 0) return 0;
  if (!(scale > 0 && scale < Infinity)) return Infinity;
  return Math.max(Number.MIN_VALUE, moved / scale);
}

/**
 * How far one pass moved the tips, as the loops measure it for the stall test: `relative`, the
 * largest `fabrikRelativeMove` over every tip, and `moved`, the largest coordinate any tip moved in
 * world units. Both are zero exactly when no tip moved.
 */
export interface FabrikPassMotion {
  readonly relative: number;
  readonly moved: number;
}

/**
 * What one pass did to the pose, as the stall test reads it: a closed union read by one exhaustive
 * switch in `settlesAfter`, so a new kind of pass has to say whether it ends an attempt.
 *
 * `still` moved no tip at all; `rounding` moved some, none by more than `FABRIK_ROUNDING_ULPS`
 * ulps of its path's scale and none by more than `bound` world units; `moving` moved one by more,
 * or measured something non-finite.
 */
export type FabrikPassMovement = "still" | "rounding" | "moving";

/**
 * Names a pass that moved as `motion` says, where `bound` is the most world units a rounding pass
 * may move a tip (`fabrikRoundingBound`).
 *
 * The relative band alone is not enough, because it grows with the path: on a 1e15-unit chain
 * 1,024 ulps is 227 world units, and a free chain decaying geometrically toward its goal moved 52
 * and then 20 units in two passes inside it and stalled at a residual of 19.7 where 34 more passes
 * reached 0.037 (independent pass QP-4). A pass is rounding only when it is both.
 */
export function fabrikPassMovement(motion: FabrikPassMotion, bound: number): FabrikPassMovement {
  if (motion.relative === 0) return "still";
  return motion.relative <= FABRIK_ROUNDING_ULPS * Number.EPSILON && motion.moved <= bound
    ? "rounding"
    : "moving";
}

/**
 * The most world units a rounding pass may move a tip, for an attempt that converges to
 * `tolerance` and may take at most `passes` passes: small enough that every pass the attempt could
 * still take, each moving that little, would not together move a tip by `tolerance`, so settling on
 * one cannot cost a residual a tolerance's worth of progress. On every ordinary rig the relative
 * band is the tighter one (7e-11 units on a 300-unit chain against 1.6e-5 at the free cap of 64);
 * this bound decides only past about 1e7 units of path, where rounding is itself that coarse.
 */
export function fabrikRoundingBound(tolerance: number, passes: number): number {
  return tolerance / passes;
}

/** How many passes one FABRIK attempt takes, and when a pass leaves it at a fixed point. */
export interface FabrikPassBudget {
  /**
   * Whether an attempt that has taken `iterations` passes and stands at `residual` takes another.
   * Asked once before every pass, in pass order.
   */
  admits(iterations: number, residual: number): boolean;
  /**
   * Whether the pass just taken, which moved the tips as `motion` says, leaves the attempt at a
   * fixed point, so it ends `stalled` rather than running on to the cap. Asked once after every
   * pass, in pass order.
   */
  settles(motion: FabrikPassMotion): boolean;
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
 *
 * The fixed point is one rule for every constraint (issue #519): `settlesAfter`. How many passes an
 * attempt may take depends on its constraint; whether a pass left it at a fixed point does not,
 * because an attempt circling its fixed point by rounding is stalled whatever its members are, and
 * calling it `iteration-cap` claims more passes would have helped when none can.
 */
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

/**
 * The fixed-point test of one attempt, asked once after every pass in pass order, with `bound` its
 * `fabrikRoundingBound`: a pass that moved no tip settles it at once, and so does the second
 * consecutive `rounding` pass, because two passes in the rounding band are an attempt circling its
 * fixed point, where one alone may be the last step of a decay that ends on an exact repeat anyway.
 * A `moving` pass starts the count again.
 */
function settlesAfter(bound: number): (motion: FabrikPassMotion) => boolean {
  // Whether the previous pass moved by rounding only.
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
  // The residual each pass ended at, indexed by pass, so a window boundary reads its own start.
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

/**
 * Whether a residual that fell from `before` to `now` over one `FABRIK_PROGRESS_WINDOW`, carried on
 * at that geometric rate, reaches `tolerance` within `remaining` passes. A residual that did not
 * fall projects nothing, so a limited attempt that oscillates or holds stops at the next boundary.
 *
 * Total over every double: a residual already inside `tolerance` (zero included) has reached it,
 * and a fall from a non-finite `before`, or any `NaN`, measures no rate and projects nothing, where
 * the bare logarithms would read `Infinity -> 1` as instant convergence and `1 -> 0` as `NaN`. The
 * loop asks only while the residual is above tolerance and finite, so neither arm moves a solve.
 */
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
