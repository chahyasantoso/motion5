import { unreachable } from "../plugin-api";
import type { WorldFrame3d } from "./frame3d";
import { twoBonePair } from "./ik-topology";
import { solveTwoBone3d, UNBOUND_POLE3D, type Pole3d } from "./ik3d-analytic";
import type { ChainMember3d } from "./ik3d-chain";
import { constrains } from "./ik3d-constraint";
import { solveTree3d } from "./ik3d-fabrik";
import { orientLeaves3d } from "./ik3d-orient";
import type { SolveResult3d } from "./ik3d-result";
import { solveSerialRecovery3d } from "./ik3d-serial-recovery";

/**
 * Which 3D strategy answers a chain, decided once and read exhaustively (ADR-092, ADR-122).
 *
 * The 3D counterpart of `ik-solve.ts`'s `ChainShape`, and deliberately its own union rather than a
 * dimension flag on that one, because the members and poses each arm carries are dimensional.
 * `two-bone` carries the proven pair and its one goal as values, `tree` the whole member list, and
 * `constrained` the whole member list of a chain with any member whose joint constrains it, which
 * the 3D FABRIK solves with the limit enforced in every outward pass (issue #500 phase 6, ADR-123).
 * Derived, never authored: no rig chooses its own strategy (ADR-051).
 */
export type ChainShape3d =
  | {
      readonly kind: "two-bone";
      readonly first: ChainMember3d;
      readonly second: ChainMember3d;
      readonly goal: WorldFrame3d;
    }
  | { readonly kind: "tree"; readonly members: readonly ChainMember3d[] }
  | { readonly kind: "constrained"; readonly members: readonly ChainMember3d[] };

/**
 * The shape of one 3D chain, or a throw when it has no goal at all.
 *
 * A parent and its one addressed child take the closed form, proven from the `base` relation by
 * the same `twoBonePair` the 2D dispatcher reads, so every two-bone rig that loaded under ADR-114
 * keeps the closed form and its bytes. Everything else, a single member, a longer path, or any
 * branching, takes the tree solve. The goal refusal is the 2D one: load refuses every shape that
 * reaches it (`ik-solver-no-goal`, `ik-leaf-without-goal`), so it is an invariant guard.
 *
 * A chain with any constrained member is `constrained` first, after the goal guard, and takes 3D
 * FABRIK even at two members. Only when that solve misses may a short zero-offset serial chain of
 * free members and non-planar hinges take the legal serial recovery (`ik3d-serial-recovery.ts`),
 * which solves inside every authored hinge range rather than clamping an unconstrained answer
 * afterwards. `contract/solver-shape.ts` remains conservative at load: its `derivedStrategy` sees
 * the authored joint, not this live-value recovery, and both name the iterative strategy first.
 */
export function chainShape3d(members: readonly ChainMember3d[]): ChainShape3d {
  if (!members.some((member) => member.goal !== undefined)) {
    throw new Error(`ik3d requires at least one goal; ${members.length} members received none.`);
  }
  if (members.some(({ limit }) => limit !== undefined && constrains(limit)))
    return { kind: "constrained", members };
  const pair = twoBonePair<WorldFrame3d, ChainMember3d>(members);
  if (pair !== undefined) return { kind: "two-bone", ...pair };
  return { kind: "tree", members };
}

/**
 * The 3D dispatcher: one local Euler triple per member from whichever strategy the chain's shape
 * names, and the evidence of how well it answered, in the one `SolveResult3d` shape.
 *
 * Each strategy owns its own magnitude decision through the shared `magnitudeOf`, because the
 * closed form's decision is part of the bytes a two-bone rig already publishes and must not move.
 * `bend` is the chain's pole, read by both strategies through the one pole rule (ADR-118).
 *
 * Every strategy answers position only. The end-effector orientation step then turns each addressed
 * leaf authoring `orient` toward its goal's orientation, through `ik3d-orient.ts` for both strategies
 * alike, by rotations that leave its tip where the strategy put it, so position keeps priority and
 * neither strategy owns a second copy of the step (ADR-124).
 */
export function solveChain3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d {
  return orientLeaves3d(root, members, solvePosition3d(root, chainShape3d(members), bend));
}

/** The position solve alone: the strategy the chain's shape names, read exhaustively. */
function solvePosition3d(root: WorldFrame3d, shape: ChainShape3d, bend: Pole3d): SolveResult3d {
  switch (shape.kind) {
    case "two-bone":
      return solveTwoBone3d(root, shape.goal, shape.first, shape.second, bend);
    case "tree":
      return solveTree3d(root, shape.members, bend);
    case "constrained": {
      const result = solveTree3d(root, shape.members, bend);
      if (result.quality.kind === "converged") return result;
      // A legal pose is published only when its rendered FK tip meets the goal; otherwise the tree
      // result is kept with its quality and every published byte unchanged.
      return solveSerialRecovery3d(root, shape.members, bend) ?? result;
    }
    default:
      return unreachable(shape);
  }
}
