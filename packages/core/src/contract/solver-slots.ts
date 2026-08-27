/**
 * The goal-addressing grammar a solver plugin and the authored form share.
 *
 * A solver reaches for one goal per chain leaf, and the author names the leaf rather than counting
 * to it: `targets` maps a member id to the node whose frame that member pulls toward. An index can
 * never be wrong, so it silently means whatever the rig currently makes it mean; insert a bone or
 * reorder two tracks and a positional pairing keeps loading and now pulls the wrong limb. A member
 * id can be wrong, so it can be checked. That is the argument that retired `reach` in favour of a
 * named `root`, and it applies here without modification. See issue #195.
 *
 * The authored dict is one section, but every goal inside it is still one dependency, so
 * `readPluginBindings` expands it into one binding per member and each binding derives exactly one
 * input edge. `targets[<memberId>]` is that binding's derived slot identity: never authored, never
 * spelled by hand, and unique per member. Unique matters twice over. The publisher delivers a
 * source's values as `collected[plugin][slot]`, so two goals sharing one slot name would overwrite
 * each other and the last one authored would be the only one that arrived, with no diagnostic. And
 * an edge per goal is what lets `firstPendingEdge`, the failed/blocked/pending classification and
 * `orderGraph` see a goal at all, none of which needed a line changed for the first one.
 *
 * One owner, in `contract/`, for the reason `keyframe-shape.ts` lives here: `graph/ir.ts` must read
 * the grammar with no plugin registry in reach, and a solver plugin must read it identically. Both
 * already depend on this layer, and neither gains a dependency on the other. Two private copies of
 * one syntax rule is how `readNumber` drifted between `fk` and `ik` until an authored `length: NaN`
 * meant two things in one tick.
 */

/** The reserved `requires` slot whose value is the authored goal dict rather than a source id. */
export const PLUGIN_GOALS_SLOT = "targets";

/**
 * Built from the constant, so the section name has exactly one spelling in the codebase.
 *
 * The member group excludes both brackets, so `targets[a][b]` is not a goal slot rather than a goal
 * for a member whose id contains a bracket. `validateKeyframes` refuses a bracket in an authored
 * member id for the same reason, so the two readings cannot disagree about one authored document.
 */
const GOAL_SLOT = new RegExp(`^${PLUGIN_GOALS_SLOT}\\[([^[\\]]+)\\]$`);

/** The derived slot identity carrying the goal of `memberId`. */
export function goalSlot(memberId: string): string {
  return `${PLUGIN_GOALS_SLOT}[${memberId}]`;
}

/** The member a goal slot addresses, or `undefined` when the slot is not a goal slot. */
export function readGoalSlot(slot: string): string | undefined {
  return GOAL_SLOT.exec(slot)?.[1];
}
