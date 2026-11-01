import type { WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";
import type { SolveQuality, SolveResult } from "./ik-result";

/** Magnitude a solve runs at: native or an exact power-of-two image.
 * Finite rigs can overflow sums into `NaN` rotations; rescale keeps solves total.
 * Rotations scale-free; residuals restored. */
export type SolveMagnitude =
  | { readonly kind: "native" }
  | { readonly kind: "rescaled"; readonly exponent: number };

/** Largest magnitude solved natively: `2 ** 500`.
 * Sums and squared sums stay finite at or below it; screen-unit rigs never approach it. */
export const SOLVE_MAGNITUDE_CEILING = 2 ** 500;

const CEILING_EXPONENT = 500;

const NATIVE: SolveMagnitude = Object.freeze({ kind: "native" });

/** Magnitude from root, lengths, pivots and goals.
 * Non-finite fields skipped → infinite goal keeps `too-far`; `NaN` passes unchanged.
 * Rotations ignored. */
export function solveMagnitude(root: WorldFrame, members: readonly SolveMember[]): SolveMagnitude {
  const magnitudes = [root.x, root.y];
  for (const member of members) {
    magnitudes.push(member.length);
    if (member.pivot !== undefined) magnitudes.push(member.pivot.x, member.pivot.y);
    if (member.goal !== undefined) magnitudes.push(member.goal.x, member.goal.y);
  }
  return magnitudeOf(magnitudes);
}

/** Shared magnitude policy over world-unit magnitudes for every solver dimension.
 * Exponent is binary orders above the ceiling, at least one.
 * `Math.log2` rounding costs headroom only. */
export function magnitudeOf(magnitudes: readonly number[]): SolveMagnitude {
  let largest = 0;
  for (const magnitude of magnitudes)
    if (Number.isFinite(magnitude)) largest = Math.max(largest, Math.abs(magnitude));
  if (!(largest > SOLVE_MAGNITUDE_CEILING)) return NATIVE;
  const exponent = Math.max(1, Math.ceil(Math.log2(largest)) - CEILING_EXPONENT);
  return Object.freeze({ kind: "rescaled", exponent });
}

function scaleFrame(frame: WorldFrame, factor: number): WorldFrame {
  return Object.freeze({ x: frame.x * factor, y: frame.y * factor, rotation: frame.rotation });
}

/** Rig's image under `2 ** -exponent`: world-unit fields scaled, rest carried.
 * Absent pivot or goal stays absent, so the image reads exactly like the rig. */
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

/** Image distance back in world units, saturating at `Number.MAX_VALUE`.
 * Only finite values saturate; infinite stays infinite, `NaN` surfaces unchanged. */
export function restoreDistance(distance: number, exponent: number): number {
  if (!Number.isFinite(distance)) return distance;
  const restored = distance * 2 ** exponent;
  return restored <= Number.MAX_VALUE ? restored : Number.MAX_VALUE;
}

/** Image result read back: same rotations, every residual restored.
 * Quality keeps kind, iterations, atBound.
 * Scale cannot move a miss across `FABRIK_TOLERANCE`. */
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
