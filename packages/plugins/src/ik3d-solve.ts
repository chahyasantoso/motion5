import { unreachable } from "@motion5/core/plugin-api";
import type { WorldFrame3d } from "./frame3d";
import { twoBonePair } from "./ik-topology";
import { solveTwoBone3d, UNBOUND_POLE3D, type Pole3d } from "./ik3d-analytic";
import type { ChainMember3d } from "./ik3d-chain";
import { constrains } from "./ik3d-constraint";
import { solveTree3d } from "./ik3d-fabrik";
import { orientLeaves3d } from "./ik3d-orient";
import type { SolveResult3d } from "./ik3d-result";
import { solveSerialRecovery3d } from "./ik3d-serial-recovery";

/** Strategy answering one 3D chain; derived at solve time, never authored.
 * `two-bone` carries pair + goal, `tree` members, `constrained` members with a limiting joint. */
export type ChainShape3d =
  | {
      readonly kind: "two-bone";
      readonly first: ChainMember3d;
      readonly second: ChainMember3d;
      readonly goal: WorldFrame3d;
    }
  | { readonly kind: "tree"; readonly members: readonly ChainMember3d[] }
  | { readonly kind: "constrained"; readonly members: readonly ChainMember3d[] };

/** Chain shape, or a throw when no member carries a goal.
 * Order: goal guard → `constrained` → `two-bone` pair → `tree`. */
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

/** Solves one 3D chain: position by shape, then each oriented leaf toward its goal.
 * Orientation turns leaves without moving the tip, so position keeps priority. */
export function solveChain3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  bend: Pole3d = UNBOUND_POLE3D,
): SolveResult3d {
  return orientLeaves3d(root, members, solvePosition3d(root, chainShape3d(members), bend));
}

/** Position solve by shape; `constrained` retries as serial recovery when the tree solve misses. */
function solvePosition3d(root: WorldFrame3d, shape: ChainShape3d, bend: Pole3d): SolveResult3d {
  switch (shape.kind) {
    case "two-bone":
      return solveTwoBone3d(root, shape.goal, shape.first, shape.second, bend);
    case "tree":
      return solveTree3d(root, shape.members, bend);
    case "constrained": {
      const result = solveTree3d(root, shape.members, bend);
      if (result.quality.kind === "converged") return result;
      // Recovery only when the tree solve misses; otherwise its result and published bytes stand.
      return solveSerialRecovery3d(root, shape.members, bend) ?? result;
    }
    default:
      return unreachable(shape);
  }
}
