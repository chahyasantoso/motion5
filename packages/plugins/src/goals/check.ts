import { diagnostic, type Diagnostic } from "@motion5/core/plugin-api";
import type { BodyStructure } from "../body/domain";
import type { GoalsStructure } from "./domain";

/** Cross-source goal checks shared by 2D and 3D solvers. */
export function goalDiagnostics(
  chain: BodyStructure,
  goals: GoalsStructure,
): readonly Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  if (goals.rows.length === 0) {
    diagnostics.push(
      diagnostic("ik-solver-no-goal", "goals", "A solve requires at least one goal.", []),
    );
    return Object.freeze(diagnostics);
  }
  const leaves = new Set(chain.leaves);
  const ids = new Set(chain.ids);
  for (const [memberId, rowId] of goals.byMember) {
    if (!ids.has(memberId)) {
      diagnostics.push(
        diagnostic(
          "ik-goal-unknown-member",
          "goals",
          `Goal row '${rowId}' targets unknown member '${memberId}'.`,
          [rowId, memberId],
        ),
      );
      continue;
    }
    if (!leaves.has(memberId)) {
      diagnostics.push(
        diagnostic(
          "ik-goal-not-leaf",
          "goals",
          `Goal row '${rowId}' targets member '${memberId}', which is not a leaf.`,
          [rowId, memberId],
        ),
      );
    }
  }
  for (const leaf of chain.leaves)
    if (!goals.byMember.has(leaf)) {
      diagnostics.push(
        diagnostic("ik-leaf-without-goal", "goals", `Body leaf '${leaf}' has no goal.`, [leaf]),
      );
    }
  return Object.freeze(diagnostics);
}
