import type { SolveEvidence, SolveQuality } from "./ik-result";
import { restoreDistance } from "./ik-scale";
import type { Euler3d } from "./frame3d";

/**
 * The name of the solver's published pose channel, stated once for the solver that writes it and
 * the member that reads it. `rotations3d` rather than 2D's `rotations`, so a track registering both
 * solvers is refused as a duplicate output instead of one pose silently replacing the other.
 */
export const ROTATIONS3D_KEY = "rotations3d" as const;

/**
 * The internal 3D solver result. Its `quality` and `residuals` are the 2D result's own
 * `SolveEvidence`, so reachability has one vocabulary across dimensions and the one inspection
 * projection reads a 3D solve without a 3D copy (ADR-120). The closed form narrows `Q` to the
 * closed-form kinds and the tree solve to the iterative ones, exactly as the 2D strategies narrow
 * `SolveResult`, and the dispatcher answers the whole union (ADR-122). Only the pose is
 * dimensional: renderer-neutral Euler triples under `rotations3d`.
 */
export type SolveResult3d<Q extends SolveQuality = SolveQuality> = SolveEvidence<Q> & {
  readonly rotations3d: Readonly<Record<string, Euler3d>>;
};

/**
 * A result solved in the rig's power-of-two image, read back into the rig: the same pose, and
 * every residual restored through `restoreDistance`, the 2D owner's rule (ADR-111). Shared by both
 * 3D strategies, because what a rescale does to a result does not depend on who solved it. The
 * quality keeps its kind, its iteration count, its bound members and its key order, because the
 * spread replaces `residual` in place.
 */
export function restoreResult3d<Q extends SolveQuality>(
  result: SolveResult3d<Q>,
  exponent: number,
): SolveResult3d<Q> {
  const residuals: Record<string, number> = {};
  for (const [id, residual] of Object.entries(result.residuals))
    residuals[id] = restoreDistance(residual, exponent);
  const quality: Q = {
    ...result.quality,
    residual: restoreDistance(result.quality.residual, exponent),
  };
  return Object.freeze({
    rotations3d: result.rotations3d,
    residuals: Object.freeze(residuals),
    quality: Object.freeze(quality),
  });
}
