import { refuseAt } from "./refusal";
import { plan, type PlanEnvironment, type PlanState, type PlannedChange } from "./edit-plan";
import {
  planValueEdit,
  type CheapTrack,
  type TrackLookup,
  type ValueChange,
} from "./edit-plan-values";
import type { CheapEdit, Edit, LiveEdit } from "./edit-types";

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

/**
 * Plans a list of value edits against one lookup, each seeing what its predecessors changed.
 *
 * The staged view holds only the nodes the list has already changed, so the work is proportional to
 * the list, never to the project. A refusal throws at the index that produced it before anything
 * has been handed to a caller, which is what makes the list all-or-nothing here as well.
 */
export function applyValueEdits(
  base: TrackLookup,
  edits: readonly (CheapEdit | LiveEdit)[],
  environment: PlanEnvironment,
): readonly ValueChange[] {
  const staged = new Map<string, CheapTrack>();
  const view: TrackLookup = { get: (nodeId) => staged.get(nodeId) ?? base.get(nodeId) };
  const changes: ValueChange[] = [];
  for (const [index, edit] of edits.entries()) {
    const planned = planValueEdit(view, edit, environment);
    if (planned.kind === "refused")
      refuseAt({ kind: "invalid-definition", diagnostics: planned.diagnostics }, index);
    const { change } = planned.value;
    if (change === undefined) continue;
    staged.set(change.track.nodeId, change.track);
    changes.push(change);
  }
  return Object.freeze(changes);
}
