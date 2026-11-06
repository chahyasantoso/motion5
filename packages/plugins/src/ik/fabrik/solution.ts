import type { WorldPoint } from "../../frame/frame";
import type { IterativeQuality, SolveResult } from "../shared/result";

/** A point in the solve's working state. */
export type FabrikPoint = WorldPoint;

/** Local rotations plus pivots and tips; length is a member's pivot-to-tip distance. */
export interface FabrikSolution extends SolveResult<IterativeQuality> {
  readonly pivots: Readonly<Record<string, FabrikPoint>>;
  readonly tips: Readonly<Record<string, FabrikPoint>>;
}
