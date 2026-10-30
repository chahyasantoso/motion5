import { ORIENT_KEY, readOrientValue, unreachable } from "@motion5/core/plugin-api";
import { readNumber, segmentExtent } from "./frame";
import {
  blendOrientation3d,
  eulerFromMatrix3d,
  LOCAL_X3,
  matrixFromEuler3d,
  multiplyMatrix3,
  rotationAboutAxis3d,
  swingTwist3d,
  transposeMatrix3,
  type Euler3d,
  type Matrix3,
  type WorldFrame3d,
} from "./frame3d";
import type { ChainMember3d } from "./ik3d-chain";
import { FREE_JOINT3D, limitLocal3d } from "./ik3d-constraint";
import type { SolveResult3d } from "./ik3d-result";

/**
 * Sole owner of the 3D orientation goal: after the position solve, turn each oriented leaf toward its goal with its tip fixed; weight below 1 fades both goals toward rest.
 */

/** Orient weight a member's live values declare, or `undefined` outside the domain; total over live values, so a value-tier write bypassing load reads absent. */
export function readOrient(values: Readonly<Record<string, unknown>>): number | undefined {
  return readOrientValue(values[ORIENT_KEY]);
}

/** Which rotations keep a leaf's tip where the position solve put it. */
export type OrientFreedom = "roll" | "whole";

/** A leaf with length may roll only; one with no length, a point, takes any rotation. */
export function orientFreedom(length: number): OrientFreedom {
  return segmentExtent(readNumber(length)) > 0 ? "roll" : "whole";
}

/** `roll`: the bone's +x twist carrying solved onto goal, the nearest roll, scaled by `weight`; `whole`: short-arc world blend, read back through the parent transpose. */
function turnToward(
  parent: Matrix3,
  local: Matrix3,
  goal: Euler3d,
  weight: number,
  freedom: OrientFreedom,
): Matrix3 {
  const world = multiplyMatrix3(parent, local);
  switch (freedom) {
    case "roll": {
      const towardGoal = multiplyMatrix3(transposeMatrix3(world), matrixFromEuler3d(goal));
      const roll = weight * swingTwist3d(towardGoal).twistDegrees;
      return multiplyMatrix3(local, rotationAboutAxis3d(LOCAL_X3, roll));
    }
    case "whole": {
      const turned = blendOrientation3d(eulerFromMatrix3d(world), goal, weight);
      return multiplyMatrix3(transposeMatrix3(parent), matrixFromEuler3d(turned));
    }
    default:
      return unreachable(freedom);
  }
}

function orients({ goal, orient }: ChainMember3d): boolean {
  return goal !== undefined && orient !== undefined && orient > 0;
}

/** Position result with every oriented leaf turned toward its goal; with none, the same object, else only triples change, so `residuals` and `quality` stand. */
export function orientLeaves3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  result: SolveResult3d,
): SolveResult3d {
  // `some` before `filter`: a chain with no orientation goal allocates nothing.
  if (!members.some(orients)) return result;
  const oriented = members.filter(orients);
  const byId = new Map(members.map((member) => [member.id, member]));
  const worlds = new Map<string, Matrix3>();
  const rootMatrix = matrixFromEuler3d(root);
  const localOf = (id: string): Matrix3 => matrixFromEuler3d(result.rotations3d[id]!);
  // World frame `fk3d` composes for `id` at weight 1, memoised; the root when `id` names no member.
  // `canonicalChain` refused cycles, so the walk terminates.
  const worldOf = (id: string): Matrix3 => {
    const member = byId.get(id);
    if (member === undefined) return rootMatrix;
    const known = worlds.get(id);
    if (known !== undefined) return known;
    const world = multiplyMatrix3(worldOf(member.base), localOf(id));
    worlds.set(id, world);
    return world;
  };
  const rotations3d: Record<string, Euler3d> = { ...result.rotations3d };
  for (const leaf of oriented) {
    const parent = worldOf(leaf.base);
    const local = localOf(leaf.id);
    const turned = turnToward(parent, local, leaf.goal!, leaf.orient!, orientFreedom(leaf.length));
    // A roll is twist alone: a cone keeps it, a swing-twist caps it at its twist range.
    const limited = limitLocal3d(leaf.limit ?? FREE_JOINT3D, () => turned);
    let legal = turned;
    switch (limited.kind) {
      case "unmoved":
        break;
      case "moved":
        legal = limited.local;
        break;
      default:
        unreachable(limited);
    }
    rotations3d[leaf.id] = Object.freeze(eulerFromMatrix3d(legal));
  }
  return Object.freeze({ ...result, rotations3d: Object.freeze(rotations3d) });
}
