import { unreachable } from "../lang/exhaustive";
import type { WorldFrame3d } from "./frame3d";
import { twoBonePair } from "./ik-topology";
import { solveTwoBone3d, UNBOUND_POLE3D, type Pole3d } from "./ik3d-analytic";
import type { ChainMember3d } from "./ik3d-chain";
import { solveTree3d } from "./ik3d-fabrik";
import type { SolveResult3d } from "./ik3d-result";

/**
 * Which 3D strategy answers a chain, decided once and read exhaustively (ADR-092, ADR-122).
 *
 * The 3D counterpart of `ik-solve.ts`'s `ChainShape`, and deliberately its own union rather than a
 * dimension flag on that one: the 2D union has a `constrained` arm that 3D does not have until 3D
 * joint limits exist (issue #500 phase 6), and a variant the dispatcher cannot reach is a variant
 * nobody can test. `two-bone` carries the proven pair and its one goal as values, `tree` the whole
 * member list. Derived, never authored: no rig chooses its own strategy (ADR-051).
 */
export type ChainShape3d =
  | {
      readonly kind: "two-bone";
      readonly first: ChainMember3d;
      readonly second: ChainMember3d;
      readonly goal: WorldFrame3d;
    }
  | { readonly kind: "tree"; readonly members: readonly ChainMember3d[] };

/**
 * The shape of one 3D chain, or a throw when it has no goal at all.
 *
 * A parent and its one addressed child take the closed form, proven from the `base` relation by
 * the same `twoBonePair` the 2D dispatcher reads, so every two-bone rig that loaded under ADR-114
 * keeps the closed form and its bytes. Everything else, a single member, a longer path, or any
 * branching, takes the tree solve. The goal refusal is the 2D one: load refuses every shape that
 * reaches it (`ik-solver-no-goal`, `ik-leaf-without-goal`), so it is an invariant guard.
 */
export function chainShape3d(members: readonly ChainMember3d[]): ChainShape3d {
  if (!members.some((member) => member.goal !== undefined)) {
    throw new Error(`ik3d requires at least one goal; ${members.length} members received none.`);
  }
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
 */
export function solveChain3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d {
  const shape = chainShape3d(members);
  switch (shape.kind) {
    case "two-bone":
      return solveTwoBone3d(root, shape.goal, shape.first, shape.second, bend);
    case "tree":
      return solveTree3d(root, shape.members, bend);
    default:
      return unreachable(shape);
  }
}
