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
 */

/** The fewest passes any attempt may take before the cap: a 16-deep chain's four per member. */
export const FABRIK_MIN_ITERATIONS = 64;

/** Passes allowed per member on the longest root-to-leaf path, above the floor. */
export const FABRIK_ITERATIONS_PER_DEPTH = 4;

/**
 * The cap for a chain whose longest root-to-leaf path has `depth` members.
 *
 * `depth` is a non-negative integer derived by the solve from the canonical member order, so the
 * cap is a pure function of the rig and not of the order a caller listed its members in.
 */
export function fabrikIterationCap(depth: number): number {
  return Math.max(FABRIK_MIN_ITERATIONS, FABRIK_ITERATIONS_PER_DEPTH * depth);
}
