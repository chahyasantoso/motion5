import { unreachable } from "../lang/exhaustive";
import { solveFabrik } from "./fabrik";
import type { WorldFrame } from "./frame";
import { solveTwoBone } from "./ik-analytic";
import type { SolveMember } from "./ik-member";
import type { SolveResult } from "./ik-result";

/**
 * Which solve answers for a chain, decided once and read exhaustively.
 *
 * A closed union of the shapes the dispatcher recognises, each variant carrying exactly what its
 * strategy needs and nothing it would have to re-derive: the closed form gets the proven pair and
 * its one goal as values rather than an array it indexes on trust, and FABRIK gets the whole member
 * list. `solveChain` reads it with a `switch` that ends in `unreachable`, so a third shape added
 * here (as `constrained` was, in issue #349's third phase) fails to compile at the one site that
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
  | { readonly kind: "tree"; readonly members: readonly SolveMember[] }
  | { readonly kind: "constrained"; readonly members: readonly SolveMember[] };

/**
 * The shape of one chain, or a throw when it has no goal at all.
 *
 * A chain with any limited member is `constrained` and takes FABRIK even at arity two, because the
 * closed form solves without the limit and clamping its answer afterwards would constrain a pose
 * that was never solved under it. The goal refusal is read first, so a limited chain with no goal
 * throws the same message an unlimited one does. See ADR-108.
 *
 * Otherwise two members and one goal take the closed form, and everything else takes FABRIK. The goal count
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
  if (members.some((member) => member.limit !== undefined)) return { kind: "constrained", members };
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
 * Both arms return the one `SolveResult`, so what the chain's solve achieved has one shape
 * whichever strategy answered it: the closed form's geometric kinds or FABRIK's iterative ones,
 * read from one discriminant. `ik.ts` publishes `rotations`, and adds the fixed-shape `inspection`
 * projection of `quality` and `residuals` only when its author opted in. See `ik-result.ts`,
 * ADR-107, ADR-109 and ADR-110.
 *
 * Nothing here knows about a member's blend `weight`, and that is the ownership split rather than an
 * omission. The solve publishes the exact angle that puts the tip on the goal, at every arity, and
 * how much of that angle a bone actually composes with is the bone's question. See ADR-055.
 */
export function solveChain(
  root: WorldFrame,
  members: readonly SolveMember[],
  flip = false,
): SolveResult {
  const shape = chainShape(members);
  switch (shape.kind) {
    case "two-bone":
      return solveTwoBone(root, shape.goal, shape.first, shape.second, flip);
    case "tree":
    case "constrained": {
      // The constrained arm shares the tree's body because FABRIK reads each member's limit itself;
      // the variant exists so the dispatch decision is visible and the closed form is never picked.
      // `pivots` and `tips` are FABRIK's own and stay behind: the analytic path carries neither,
      // so returning them here would make the result's shape a function of arity. The quality
      // record and the per-leaf `residuals` travel, because both strategies state them, and they
      // are published only as the opt-in `inspection` projection. Roughly four percent of ordinary reachable rigs do not reach
      // tolerance before the cap, so an unrequested per-tick report would be noise on rigs nobody
      // would call broken. `FB-13` pins the unopted shape and ADR-109 records the opt-in.
      const { rotations, residuals, quality } = solveFabrik(root, shape.members, flip);
      return Object.freeze({ rotations, residuals, quality });
    }
    default:
      return unreachable(shape);
  }
}
