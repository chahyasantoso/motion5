import type { WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";
import type { SolveQuality, SolveResult } from "./ik-result";

/**
 * The magnitude a solve runs at, decided once per solve and read exhaustively by `solveChain`.
 *
 * Every solve strategy sums lengths, squares distances and multiplies them into denominators, and
 * a finite rig can overflow any of those: `Number.MAX_VALUE` is finite, and three members of that
 * length sum to `Infinity` in FABRIK's seed, where the arithmetic that follows turns it into `NaN`.
 * A `NaN` rotation fails the publisher's renderer-neutrality check, so a rig that merely grew large
 * would error its node and block every child of it. Load cannot refuse the magnitude, because a
 * length or a goal is live and animates past any bound load could check, so the solve is made total
 * instead. See ADR-111.
 *
 * `native` is every rig whose largest magnitude is at most `SOLVE_MAGNITUDE_CEILING`, and it is
 * solved exactly as it always was, so its output is byte-identical by construction rather than by
 * measurement. `rescaled` is a rig past the ceiling, solved as its image under an exact
 * power-of-two scale that lands its largest magnitude at the ceiling. Rotations are scale-free and
 * scaling by a power of two is exact on every normal double, so the image publishes the angles the
 * rig would have if the arithmetic had the range; the residuals are world distances and are scaled
 * back.
 *
 * A closed union rather than a boolean with a number beside it, so the exponent exists only on the
 * arm that has one and `solveChain` reads the two with a `switch` that ends in `unreachable`. See
 * ADR-092.
 */
export type SolveMagnitude =
  | { readonly kind: "native" }
  | { readonly kind: "rescaled"; readonly exponent: number };

/**
 * The largest magnitude solved natively: `2 ** 500`.
 *
 * Chosen for headroom on both sides rather than tuned. A sum of every member and the root at this
 * magnitude stays finite for any chain shorter than `2 ** 500` members, and the square of a sum of
 * sixteen of them is under `2 ** 1016`, so no strategy's intermediate overflows at or below it. And
 * it is far past anything a rig in screen units authors, so no ordinary rig takes the other arm.
 */
export const SOLVE_MAGNITUDE_CEILING = 2 ** 500;

const CEILING_EXPONENT = 500;

const NATIVE: SolveMagnitude = Object.freeze({ kind: "native" });

/**
 * Whether a solve runs natively or as its power-of-two image, from every world-unit magnitude it
 * reads: the root position, each member's length and pivot offset, and each goal position.
 *
 * Rotations are not read: they are angles, and a scale leaves them alone. The exponent is the
 * whole number of binary orders the largest magnitude sits above the ceiling, rounded up, so the
 * image's largest magnitude is at most the ceiling. `Math.log2` may round an exact power of two by
 * one order either way, which costs one binary order of headroom and no exactness, because any
 * power-of-two scale is exact; a result below one order is raised to one.
 */
export function solveMagnitude(root: WorldFrame, members: readonly SolveMember[]): SolveMagnitude {
  let largest = Math.max(Math.abs(root.x), Math.abs(root.y));
  for (const member of members) {
    largest = Math.max(largest, Math.abs(member.length));
    if (member.pivot !== undefined)
      largest = Math.max(largest, Math.abs(member.pivot.x), Math.abs(member.pivot.y));
    if (member.goal !== undefined)
      largest = Math.max(largest, Math.abs(member.goal.x), Math.abs(member.goal.y));
  }
  if (!(largest > SOLVE_MAGNITUDE_CEILING)) return NATIVE;
  const exponent = Math.max(1, Math.ceil(Math.log2(largest)) - CEILING_EXPONENT);
  return Object.freeze({ kind: "rescaled", exponent });
}

/** A frame's position scaled by `factor`, its rotation untouched. */
function scaleFrame(frame: WorldFrame, factor: number): WorldFrame {
  return Object.freeze({ x: frame.x * factor, y: frame.y * factor, rotation: frame.rotation });
}

/**
 * The rig's image under `2 ** -exponent`: the root and every member, each world-unit field scaled
 * and every other field carried as it is.
 *
 * An absent pivot or goal stays absent rather than being written as a scaled default, so the image
 * reads through `solveOffset` and `chainShape` exactly as the rig does.
 */
export function scaleRig(
  root: WorldFrame,
  members: readonly SolveMember[],
  exponent: number,
): { readonly root: WorldFrame; readonly members: readonly SolveMember[] } {
  const factor = 2 ** -exponent;
  const scaled = members.map((member): SolveMember => {
    const { pivot, goal } = member;
    return Object.freeze({
      ...member,
      length: member.length * factor,
      ...(pivot === undefined
        ? {}
        : { pivot: Object.freeze({ x: pivot.x * factor, y: pivot.y * factor }) }),
      ...(goal === undefined ? {} : { goal: scaleFrame(goal, factor) }),
    });
  });
  return Object.freeze({ root: scaleFrame(root, factor), members: Object.freeze(scaled) });
}

/**
 * A distance solved in the image, back in the rig's world units, saturating at `Number.MAX_VALUE`.
 *
 * Saturating rather than overflowing, because the one promise this module makes is a finite
 * answer, and a miss larger than the largest double is a miss no caller can act on differently from
 * one that is merely the largest double.
 */
function restoreDistance(distance: number, exponent: number): number {
  const restored = distance * 2 ** exponent;
  return restored <= Number.MAX_VALUE ? restored : Number.MAX_VALUE;
}

/**
 * The image's result read back into the rig: the same rotations, and every residual restored.
 *
 * The quality record keeps its kind, its iteration count and its bound members, and its key order,
 * because the spread replaces `residual` in place. The kind is the image's, and it is the rig's
 * too: the ceiling is far below where a scale could move a miss across `FABRIK_TOLERANCE` at any
 * representable precision, since one ulp at the ceiling is `2 ** 448` world units.
 */
export function restoreResult(result: SolveResult, exponent: number): SolveResult {
  const residuals: Record<string, number> = {};
  for (const [id, residual] of Object.entries(result.residuals))
    residuals[id] = restoreDistance(residual, exponent);
  const quality: SolveQuality = {
    ...result.quality,
    residual: restoreDistance(result.quality.residual, exponent),
  };
  return Object.freeze({
    rotations: result.rotations,
    residuals: Object.freeze(residuals),
    quality: Object.freeze(quality),
  });
}
