import { refuseAt } from "./refusal";
import { plan, type PlanEnvironment, type PlanState, type PlannedChange } from "./edit-plan";
import type { Edit } from "./edit-types";

/** What one apply answered: the view after every edit, and the changes that reach it. */
export interface AppliedEdits {
  readonly state: PlanState;
  readonly changes: readonly PlannedChange[];
}

/**
 * Plans every edit in order against the state its predecessors produced.
 *
 * The list is all-or-nothing: a refusal throws at the index that produced it, and because no caller
 * has been handed the staged state before this function returns, the edits before it are abandoned
 * with it. That is what a batch of a structural edit and a cheap one needs, and it is why the plan
 * runs over a value rather than over the runtime's live maps.
 */
export function applyEdits(
  state: PlanState,
  edits: readonly Edit[],
  environment: PlanEnvironment,
): AppliedEdits {
  let current = state;
  const changes: PlannedChange[] = [];
  for (const [index, edit] of edits.entries()) {
    const planned = plan(current, edit, environment);
    if (planned.kind === "refused")
      refuseAt({ kind: "invalid-definition", diagnostics: planned.diagnostics }, index);
    current = planned.value.state;
    if (planned.value.change !== undefined) changes.push(planned.value.change);
  }
  return { state: current, changes: Object.freeze(changes) };
}
