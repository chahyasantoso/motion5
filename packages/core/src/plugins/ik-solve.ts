import { unreachable } from "../lang/exhaustive";
import { solveFabrik } from "./fabrik";
import type { WorldFrame } from "./frame";
import { solveTwoBone } from "./ik-analytic";
import type { SolveMember } from "./ik-member";

/**
 * Which solve answers for a chain, decided once and read exhaustively.
 *
 * A closed union of the shapes the dispatcher recognises, each variant carrying exactly what its
 * strategy needs and nothing it would have to re-derive: the closed form gets the proven pair and
 * its one goal as values rather than an array it indexes on trust, and FABRIK gets the whole member
 * list. `solveChain` reads it with a `switch` that ends in `unreachable`, so a third shape added
 * here (constrained solving is the next one issue #349 plans) fails to compile at the one site that
 * has to answer it instead of falling through a predicate chain to whichever branch was last.
 *
 * Closed rather than an open registry of `accepts` predicates. A registry would let a strategy be
 * added without touching this file, but the order its predicates are tried in would then be a
 * second, implicit dispatch rule, and the question "which strategy answers this chain" would have
 * as many owners as there are registrations. Nothing outside `plugins/` registers a strategy, so the
 * extension point would buy nothing a new variant does not. See ADR-106 and ADR-092.
 *
 * Derived, never authored. Nothing new is authorable and no rig chooses its own solver, which is
 * ADR-051's rule and is kept rather than weakened.
 */
export type ChainShape =
  | {
      readonly kind: "two-bone";
      readonly first: SolveMember;
      readonly second: SolveMember;
      readonly goal: WorldFrame;
    }
  | { readonly kind: "tree"; readonly members: readonly SolveMember[] };

/**
 * The shape of one chain, or a throw when it has no goal at all.
 *
 * Two members and one goal take the closed form, and everything else takes FABRIK. The goal count
 * is read off the members because `readSolveMembers` joined every goal onto the member it belongs
 * to; every key `readGoals` produces is a member id, so the count is the map's size by
 * construction.
 *
 * A solve with no goal at all is thrown rather than answered with the seed pose. Every load-time
 * shape that could produce one is refused (`ik-solver-no-members`, `ik-solver-no-goal`,
 * `ik-leaf-without-goal`), so reaching here is a publisher invariant violation, and returning a
 * pose would publish a rig that reaches for nothing with status `ready`. See issue #195 and
 * ADR-053.
 */
export function chainShape(members: readonly SolveMember[]): ChainShape {
  const goals = members.flatMap((member) => (member.goal === undefined ? [] : [member.goal]));
  const [goal] = goals;
  if (goal === undefined) {
    throw new Error(
      `ikPlugin requires at least one goal; ${members.length} members received none.`,
    );
  }
  const [first, second] = members;
  if (members.length === 2 && goals.length === 1 && first !== undefined && second !== undefined) {
    return { kind: "two-bone", first, second, goal };
  }
  return { kind: "tree", members };
}

/**
 * The dispatcher: one local rotation per member, from whichever strategy the chain's shape names.
 *
 * FABRIK cannot simply replace the analytic path. `IK-1` and `IK-3` pin `40.168` and `-51.318` for
 * the worked rig, an iterative solve reaches a goal within a tolerance rather than exactly, and
 * `flip` at arity two selects an exact branch rather than a basin, so replacing it would move
 * published values for every rig that already solves. The two paths therefore publish one
 * convention by assertion rather than by construction: `FB-2` holds FABRIK to the closed form's own
 * numbers on ADR-051's worked rig, for both elbow branches, and `PV-7` holds it to them again on a
 * rig where both members carry an offset, which is the assertion that says the two paths share one
 * offset convention rather than one each.
 *
 * Both paths account for a member's pivot offset, and they share the convention rather than holding
 * one each. `fk` places a bone's pivot at `x`, `y` in its base's rotated space and then extends by
 * `length`; the closed form folds the same two offsets into a fixed base point and a rigid link
 * with a twist, and the iterative one carries pivots beside tips and composes each from its base's
 * tip exactly as `fk` does. Both read length and offset through `ik-member.ts`, so the convention
 * has one reader as well as one statement. See ADR-053, ADR-054, and issue #214.
 *
 * Nothing here knows about a member's blend `weight`, and that is the ownership split rather than an
 * omission. The solve publishes the exact angle that puts the tip on the goal, at every arity, and
 * how much of that angle a bone actually composes with is the bone's question. See ADR-055.
 */
export function solveChain(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
): Readonly<Record<string, number>> {
  const shape = chainShape(members);
  switch (shape.kind) {
    case "two-bone":
      return solveTwoBone(root, shape.goal, shape.first, shape.second, flip);
    case "tree":
      // `pivots`, `tips` and `convergence` are deliberately dropped rather than published. The
      // analytic path carries none of them, so publishing them here would make a solver's patch
      // shape a function of its arity and would move every existing solver's published keys, which
      // `FB-9` pins as unchanged. Roughly four percent of ordinary reachable rigs do not reach
      // tolerance before the cap, so a per-tick report would be noise on rigs nobody would call
      // broken. `FB-13` pins the shape and `docs/ADR-051-derived-solver-membership.md` records the
      // decision. Issue #349's second phase gives both strategies one result type that carries the
      // quality record without publishing it.
      return solveFabrik(root, shape.members, flip).rotations;
    default:
      return unreachable(shape);
  }
}
