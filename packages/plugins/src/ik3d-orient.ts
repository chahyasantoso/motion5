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
 * The one owner of the 3D end-effector orientation goal: how far an addressed leaf turns toward its
 * goal's orientation once the chain's position is solved (issue #500 phase 7, ADR-124).
 *
 * **Position keeps priority, exactly.** The step runs after whichever strategy answered the chain,
 * on the leaf alone, and it turns the leaf only by rotations that leave the leaf's tip where the
 * position solve put it, so no residual, no quality kind and no other member's pose moves. What
 * those rotations are is a closed union read by one switch (`OrientFreedom`): a leaf with length
 * turns its tip about its pivot with every rotation except those about its own long axis, so only
 * its roll is free (`roll`); a leaf with no length has its tip on its pivot, so every rotation is
 * (`whole`). A leaf's pivot is fixed by its parent's frame and its own offset, and a leaf has no
 * children, so nothing else can move.
 *
 * **The turn is the nearest one, weighted.** Under `roll` the leaf takes the twist about its own +x
 * of the rotation that carries its solved world orientation onto the goal's, which is the rotation
 * about that axis nearest the goal (the twist of a swing-twist split is the projection onto it),
 * and `orient` of that twist: the one short arc about the bone. Under `whole` it takes the
 * short-arc blend from its solved world orientation to the goal's through `blendOrientation3d`, the
 * one 3D rotation blend (ADR-116), so an `orient` of `1` is the goal's orientation itself. An
 * `orient` of `0` returns the solve's pose byte for byte.
 *
 * **The joint still holds.** The turned local orientation is limited by `limitLocal3d`, the one
 * joint owner (ADR-123), so every orientation the solve publishes stays legal. A roll never changes
 * a swing, so a cone keeps every roll, a swing-twist caps it at its twist range, and a hinge, whose
 * one degree of freedom the direction already fixed, rebuilds the orientation the solve published
 * unless its axis is the bone's own. A roll a limit holds off is not reported: the quality
 * describes the position solve, and the orientation is a weighted preference applied after it, with
 * no residual (ADR-124, withdrawn alternatives).
 *
 * **What the goal's orientation is.** The goal frame's own `rotation`, `rotationX` and `rotationY`,
 * a world orientation in the CSS `Rz * Rx * Ry` convention `frame3d.ts` owns, which a `transform3d`
 * target authors. The position reading of the same goal (`ik-goal-reading.ts`) still reads only its
 * coordinates. The leaf's parent frame is composed from the root and the published local triples of
 * its ancestors, the orientations `fk3d` composes at a weight of `1`, so the leaf is turned toward
 * the goal in the frame it is rendered in rather than in a solver-internal one. A `weight` below
 * `1` on the leaf or an ancestor blends what `fk3d` renders back toward rest after the solve, for
 * the orientation exactly as for the position: both goals are met at a weight of `1` and faded by
 * it, which is what a weight is for (ADR-055, ADR-116), so the step never reads `rest` or `weight`.
 *
 * The step is a pure function of the root, the members and the position result, so a reverse scrub
 * and a random seek republish it byte for byte (ADR-111).
 */

/**
 * The orient weight a member's live values declare, or `undefined` for anything outside the domain.
 * Total over any live value, as `readInfluence` is: load refuses every malformed authored orient,
 * and a value-tier write that bypasses load and leaves the domain reads as absent, so as no
 * orientation.
 */
export function readOrient(values: Readonly<Record<string, unknown>>): number | undefined {
  return readOrientValue(values[ORIENT_KEY]);
}

/** Which rotations keep a leaf's tip where the position solve put it; see the module note. */
export type OrientFreedom = "roll" | "whole";

/**
 * A leaf with length is free to roll; one with none, which `fk3d` composes as a point, is whole.
 */
export function orientFreedom(length: number): OrientFreedom {
  return segmentExtent(readNumber(length)) > 0 ? "roll" : "whole";
}

/**
 * The leaf's local orientation turned `weight` of the way toward `goal` within `freedom`, before
 * any joint limit. `parent` is the leaf's parent world frame and `local` its solved local
 * orientation.
 *
 * `roll` composes the twist on the local side, `local · Rx(θ)`, which is `parent · local · Rx(θ)`
 * in the world with no round trip through the parent frame, so the leaf's direction is its solved
 * one to rounding. `whole` blends in the world and reads the result back through the parent's
 * transpose.
 */
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

/**
 * Whether a member is an addressed leaf authoring a positive orient, the only one the step turns.
 */
function orients({ goal, orient }: ChainMember3d): boolean {
  return goal !== undefined && orient !== undefined && orient > 0;
}

/**
 * The position result with every oriented leaf turned toward its goal's orientation: the step
 * `solveChain3d` runs after its strategy (ADR-124).
 *
 * A chain with no addressed leaf authoring a positive `orient` is returned as the very same object,
 * so every rig that loaded before orientation goals existed publishes its bytes unchanged.
 * Otherwise only the oriented leaves' triples are replaced, in place in the record's key order, and
 * `residuals` and `quality` are carried as they are, because no tip moved.
 */
export function orientLeaves3d(
  root: WorldFrame3d,
  members: readonly ChainMember3d[],
  result: SolveResult3d,
): SolveResult3d {
  // `some` before `filter`, so the common chain with no orientation goal allocates nothing.
  if (!members.some(orients)) return result;
  const oriented = members.filter(orients);
  const byId = new Map(members.map((member) => [member.id, member]));
  const worlds = new Map<string, Matrix3>();
  const rootMatrix = matrixFromEuler3d(root);
  const localOf = (id: string): Matrix3 => matrixFromEuler3d(result.rotations3d[id]!);
  // The world frame `fk3d` composes for `id` at a weight of 1, memoised; the root when `id` names
  // no member. `canonicalChain` refused a cycle before any strategy answered, so the walk
  // terminates.
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
