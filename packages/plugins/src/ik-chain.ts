import { readFrame, readNumber, readPivotOffset, type WorldFrame } from "./frame";
import type { SolveMember } from "./ik-member";
import { readJointLimit } from "./ik-constraint";
import { readInfluence } from "./ik-goal";

/** Chain as published and adapter to `SolveMember`: which members and goals one solve is over; no geometry or strategy. */

/** One chain member as the `members` slot delivers it, distinct from `MemberState` and `SolveMember`. */
export interface DeliveredMember {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
  /** Frame this leaf reaches toward, joined onto the member; the goals slot is not read here. */
  readonly goal?: Readonly<Record<string, unknown>>;
}

/** Delivered member states; non-array or empty input throws rather than yield an empty `rotations` record. */
export function readMembers(membersInput: unknown): readonly DeliveredMember[] {
  if (!Array.isArray(membersInput) || membersInput.length === 0) {
    throw new Error("ikPlugin requires non-empty members array in inputs.");
  }
  return membersInput as readonly DeliveredMember[];
}

/** Leaf ids: members no other member's `base` names. */
function chainLeaves(members: readonly DeliveredMember[]): readonly string[] {
  const based = new Set(members.map((member) => member.base));
  return members.filter((member) => !based.has(member.id)).map((member) => member.id);
}

/** Goal frames keyed by member id; a bare `target` joins the sole leaf, or throws on any other leaf count. */
export function readGoals(
  target: unknown,
  members: readonly DeliveredMember[],
): ReadonlyMap<string, WorldFrame> {
  const goals = new Map<string, WorldFrame>();
  for (const [id, goal] of goalInputs(target, members)) goals.set(id, readFrame(goal));
  return goals;
}

/** Undecoded goals keyed by member id: per-leaf goals first, then bare `target` onto the sole leaf. */
export function goalInputs(
  target: unknown,
  members: readonly DeliveredMember[],
): ReadonlyMap<string, unknown> {
  const goals = new Map<string, unknown>();
  for (const member of members) {
    if (member.goal !== undefined) goals.set(member.id, member.goal);
  }
  if (target === undefined) return goals;
  const leaves = chainLeaves(members);
  if (leaves.length !== 1) {
    throw new Error(
      `ikPlugin cannot address the bare target slot over a chain with ${leaves.length} leaves.`,
    );
  }
  goals.set(leaves[0]!, target);
  return goals;
}

/** Delivered members as `SolveMember`: `length` and `pivot` through shared readers, goal, limit and influence joined when present. */
export function readSolveMembers(
  members: readonly DeliveredMember[],
  goals: ReadonlyMap<string, WorldFrame>,
): readonly SolveMember[] {
  return members.map((member) => {
    const length = readNumber(member.values.length);
    const pivot = readPivotOffset(member.values);
    const goal = goals.get(member.id);
    const limit = readJointLimit(member.values);
    const influence = readInfluence(member.values);
    return {
      id: member.id,
      base: member.base,
      length,
      pivot,
      ...(goal === undefined ? {} : { goal }),
      ...(limit.kind === "range" ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
    };
  });
}
