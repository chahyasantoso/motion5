import { readEuler3d, readFrame3d, readPivotOffset3d } from "./frame3d";
import type { Euler3d, PivotOffset3d, WorldFrame3d } from "./frame3d";
import { readNumber } from "./frame";
import { goalInputs, readMembers } from "./ik-chain";

/**
 * One member of a 3D solver chain as both 3D strategies read it (ADR-122).
 *
 * The 3D counterpart of `SolveMember`, built once per solve from what the publisher delivered, so
 * neither strategy reaches into an opaque record. `base` names the member it hangs from, or the
 * root when it names no member. `length` is the authored number through `readNumber`, clamped by
 * each strategy through `segmentExtent` exactly as 2D clamps it. `offset` is the pivot offset in
 * the parent's rotated frame (ADR-117). `rest` is the member's authored local rest orientation,
 * the one `fk3d` composes when nothing solves it (ADR-116): the tree solve reconstructs roll from
 * it, and the closed form, which owns its roll through the bend plane, does not read it. `goal` is
 * present only on a chain leaf the author addressed, under either goal spelling.
 *
 * There is no `limit` and no `influence` yet: 3D joint limits and 3D goal influence are issue
 * #500's sixth and seventh phases, and `fk3d` claims neither key, so the registry refuses both by
 * name at load rather than this model accepting a field nothing reads.
 */
export interface ChainMember3d {
  readonly id: string;
  readonly base: string;
  readonly length: number;
  readonly offset: PivotOffset3d;
  readonly rest: Euler3d;
  readonly goal?: WorldFrame3d;
}

/**
 * The delivered members as `ChainMember3d`s, each leaf's goal joined on and decoded as a 3D frame.
 *
 * Which member a goal belongs to is `goalInputs`'s answer, the 2D addressing owner, because that
 * question does not depend on the dimension the goal decodes to (ADR-114); `readMembers` refuses an
 * empty member list by name exactly as it does for 2D. `readFrame3d` sanitizes a non-finite goal
 * field to zero, as it does for the root.
 */
export function readChainMembers3d(membersInput: unknown, target: unknown): readonly ChainMember3d[] {
  const delivered = readMembers(membersInput);
  const goals = goalInputs(target, delivered);
  return delivered.map((member): ChainMember3d => {
    const goal = goals.get(member.id);
    return {
      id: member.id,
      base: member.base,
      length: readNumber(member.values.length),
      offset: readPivotOffset3d(member.values),
      rest: readEuler3d(member.values),
      ...(goal === undefined ? {} : { goal: readFrame3d(goal) }),
    };
  });
}
