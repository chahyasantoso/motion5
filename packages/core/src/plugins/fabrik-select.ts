import type { WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";
import type { FabrikSolution } from "./fabrik";
import type { CompromiseRule } from "./ik-goal";

export type FabrikAttempt = (
  root: WorldFrame,
  members: readonly SolveMember[],
  flip: boolean,
  compromiseRule: CompromiseRule,
) => FabrikSolution;

/**
 * The four-candidate gate for a conflicted authored-seed solve.
 *
 * The baseline is deliberately attempted first and returned directly for every quality other than
 * `conflicted`; this keeps all existing rigs bit-identical. Only a conflict pays for the fixed
 * three alternatives, and the comparator is intentionally one rule: convergence first, then the
 * lower residual, with an earlier candidate retaining an exact tie.
 */
export function selectFabrik(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip: boolean,
  attempt: FabrikAttempt,
): FabrikSolution {
  const baseline = attempt(root, members, flip, "centroid");
  if (baseline.quality.kind !== "conflicted") return baseline;
  const candidates: readonly FabrikSolution[] = [
    baseline,
    attempt(root, members, !flip, "centroid"),
    attempt(root, members, flip, "reach-circle"),
    attempt(root, members, !flip, "reach-circle"),
  ];
  let selected = candidates[0]!;
  for (const candidate of candidates.slice(1)) {
    if (outranks(candidate, selected)) selected = candidate;
  }
  return selected;
}

function outranks(candidate: FabrikSolution, selected: FabrikSolution): boolean {
  const candidateConverged = candidate.quality.kind === "converged";
  const selectedConverged = selected.quality.kind === "converged";
  if (candidateConverged !== selectedConverged) return candidateConverged;
  return candidate.quality.residual < selected.quality.residual;
}
