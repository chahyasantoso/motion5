import type { BoneLengths } from "../filler/bone-length";
import type { PipelineStep } from "../filler/pipeline";
import type { LimbId } from "../filler/landmarks";
import type { SolvedLimb } from "../rig/rig";
import type { PoseSolver } from "../rig/solver";

export type FramePublication =
  | { readonly kind: "published"; readonly solved: ReadonlyMap<LimbId, SolvedLimb> }
  | {
      readonly kind: "unavailable";
      readonly solved: ReadonlyMap<LimbId, SolvedLimb>;
      readonly error: unknown;
    };

/** Live presentation boundary only. Replay/metrics still fail on actual solver errors. */
export function publishFrame(
  solver: PoseSolver,
  step: PipelineStep,
  lengths: BoneLengths,
): FramePublication {
  try {
    return { kind: "published", solved: solver.solve(step, lengths) };
  } catch (error) {
    // No project-retained or presentation-held geometry is returned as a current solve.
    return { kind: "unavailable", solved: new Map(), error };
  }
}
