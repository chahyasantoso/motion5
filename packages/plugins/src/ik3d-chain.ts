import { readEuler3d, readFrame3d, readPivotOffset3d } from "./frame3d";
import type { Euler3d, PivotOffset3d, WorldFrame3d } from "./frame3d";
import { readNumber } from "./frame";
import { goalInputs, readMembers } from "./ik-chain";
import { readInfluence } from "./ik-goal";
import { readOrient } from "./ik3d-orient";
import { constrains, readJointLimit3d, type JointLimit3d } from "./ik3d-constraint";

/**
 * One member of a 3D solver chain, as both 3D strategies read it.
 * `base` names parent or root; `limit`, `influence`, `orient`, `goal` only where authored; absent = free or unpulled. */
export interface ChainMember3d {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly offset: PivotOffset3d;
  readonly rest: Euler3d;
  readonly limit?: JointLimit3d;
  readonly influence?: number;
  readonly orient?: number;
  readonly goal?: WorldFrame3d;
}

/**
 * Delivered members as `ChainMember3d`s, goals decoded as 3D frames.
 * `goalInputs` owns addressing; `readMembers` refuses an empty list; `readFrame3d` zeroes non-finite. */
export function readChainMembers3d(
  membersInput: unknown,
  target: unknown,
): readonly ChainMember3d[] {
  const delivered = readMembers(membersInput);
  const goals = goalInputs(target, delivered);
  return delivered.map((member): ChainMember3d => {
    const goal = goals.get(member.id);
    const limit = readJointLimit3d(member.values);
    const influence = readInfluence(member.values);
    const orient = readOrient(member.values);
    return {
      id: member.id,
      base: member.base,
      length: readNumber(member.values.length),
      offset: readPivotOffset3d(member.values),
      rest: readEuler3d(member.values),
      ...(constrains(limit) ? { limit } : {}),
      ...(influence === undefined ? {} : { influence }),
      ...(orient === undefined ? {} : { orient }),
      ...(goal === undefined ? {} : { goal: readFrame3d(goal) }),
    };
  });
}
