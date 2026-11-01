import { segmentExtent, ZERO_PIVOT_OFFSET, type PivotOffset, type WorldFrame } from "./frame";
import type { JointRange } from "./ik-constraint";

/**
 * One member every solve reads: id, base, authored length, pivot, leaf goal, limit, influence.
 * `pivot` absent → zero; `base` outside → chain root; `length` unclamped, `solveLength` clamps. */
export interface SolveMember {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly pivot?: PivotOffset;
  readonly goal?: WorldFrame;
  readonly limit?: JointRange;
  readonly influence?: number;
}

/** The extent a solve uses: authored length clamped at zero by `segmentExtent`, the one owner. */
export function solveLength(member: SolveMember): number {
  return segmentExtent(member.length);
}

/** The pivot a solve uses: absence reads as the shared frozen `ZERO_PIVOT_OFFSET`, not a fresh object. */
export function solveOffset(member: SolveMember): PivotOffset {
  return member.pivot ?? ZERO_PIVOT_OFFSET;
}
