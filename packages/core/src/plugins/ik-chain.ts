import { readFrame, readNumber, readPivotOffset, type WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";

/**
 * The chain as the publisher delivers it, and the one adapter that turns it into what a solve
 * reads.
 *
 * This module answers "which members and which goals is this solve over" and nothing else: no
 * geometry and no strategy selection. The `ik` plugin's slots arrive as opaque records, and every
 * strategy reads the `SolveMember` model `readSolveMembers` builds here instead of reaching into
 * those records itself. Topology and goal addressing are the parts of a solve that do not depend on
 * the dimension, which is why they sit apart from `ik-analytic.ts` and `fabrik.ts`. See ADR-106.
 */

export interface MemberState {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
  /**
   * The frame this member reaches toward, present only on a chain leaf the author gave a goal.
   *
   * Delivered per member rather than read out of the goals slot, because the join is the publisher's:
   * it holds the qualified member id `resolveSolvers` derived and this plugin holds no graph, so a
   * goal arriving under its authored key would have to be qualified a second time by whoever read
   * it. The slot still delivers its entries, keyed by the author's own keys, and nothing here reads
   * them for that reason. See issue #195 and ADR-057.
   */
  readonly goal?: Readonly<Record<string, unknown>>;
}

/**
 * The member states the publisher delivered, or a throw.
 *
 * Refused rather than defaulted. A solver with no members has nothing to solve, and returning an
 * empty list would publish an empty `rotations` record: every member would fall back to its own
 * authored rotation and the rig would hold a broken pose with no diagnostic. `resolveSolvers`
 * already refuses that shape at load time as `ik-solver-no-members`, so reaching here at all is a
 * publisher invariant violation and it is thrown, not absorbed.
 */
export function readMembers(membersInput: unknown): readonly MemberState[] {
  if (!Array.isArray(membersInput) || membersInput.length === 0) {
    throw new Error("ikPlugin requires non-empty members array in inputs.");
  }
  return membersInput as readonly MemberState[];
}

/**
 * The chain's leaves: the members no member of the same chain hangs from.
 *
 * Derived from the `base` fields the publisher joined on rather than from a second walk of the
 * graph. `resolveSolvers` derives the same set at load time and refuses the shapes that make a
 * goal unanswerable, so this read never disagrees with it; it exists because the bare `target`
 * slot names no member and something has to say which member it is a goal for.
 */
function chainLeaves(members: readonly MemberState[]): readonly string[] {
  const based = new Set(members.map((member) => member.base));
  return members.filter((member) => !based.has(member.id)).map((member) => member.id);
}

/**
 * Every goal this solve reaches toward, keyed by the member it belongs to.
 *
 * One normalised map, whichever way the author addressed their goals, so the dispatcher reads a
 * count rather than two spellings and the strategies read a frame rather than a keyframe. Both
 * spellings survive on purpose: `target` is exactly the degenerate case of the goal dict, so
 * retiring it would re-author every existing rig to buy one spelling, and `ik-goal-conflict`
 * already refuses a solver that authored both.
 *
 * A bare `target` names no member, so it is joined onto the chain's one leaf. That is a guarantee
 * while a chain has exactly one leaf and nothing more, which is why a branching chain binding the
 * bare slot is `ik-target-not-single-leaf` at load: the throw here is the invariant guard behind
 * that rule rather than a validation step, in the same spirit as `readMembers`. See issue #195.
 *
 * Every key of the returned map is a member id, under both spellings, which is what lets
 * `readSolveMembers` join it back onto the members without losing a goal.
 */
export function readGoals(
  target: unknown,
  members: readonly MemberState[],
): ReadonlyMap<string, WorldFrame> {
  const goals = new Map<string, WorldFrame>();
  for (const member of members) {
    if (member.goal !== undefined) goals.set(member.id, readFrame(member.goal));
  }
  if (target === undefined) return goals;
  const leaves = chainLeaves(members);
  if (leaves.length !== 1) {
    throw new Error(
      `ikPlugin cannot address the bare target slot over a chain with ${leaves.length} leaves.`,
    );
  }
  goals.set(leaves[0]!, readFrame(target));
  return goals;
}

/**
 * The member states as every strategy reads them, with each member's goal joined on.
 *
 * `readNumber` rather than a second guard, because `fk` reads the same authored `length` through the
 * same reader: a value one half of a composition refuses and the other accepts is one authored
 * number meaning two things inside one tick, which is how the two private copies of this reader
 * drifted before `plugins/frame.ts` existed.
 *
 * A member's authored `x` and `y` are read through that same shared reader and handed on as the
 * member's pivot offset. Reading them here rather than deriving anything from them is the whole of
 * this function's part in offset-aware solving: what the offset means geometrically belongs to the
 * strategy, and what it means as a composition belongs to `fk`. See ADR-054.
 *
 * `goal` is omitted rather than set to `undefined` on an unaddressed member, which is what
 * `exactOptionalPropertyTypes` requires and what the goal count in `ik-solve.ts` reads.
 */
export function readSolveMembers(
  members: readonly MemberState[],
  goals: ReadonlyMap<string, WorldFrame>,
): readonly SolveMember[] {
  return members.map((member) => {
    const length = readNumber(member.values.length);
    const pivot = readPivotOffset(member.values);
    const goal = goals.get(member.id);
    return goal === undefined
      ? { id: member.id, base: member.base, length, pivot }
      : { id: member.id, base: member.base, length, pivot, goal };
  });
}
