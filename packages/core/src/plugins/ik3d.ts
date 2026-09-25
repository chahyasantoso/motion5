import { POLE_SLOT } from "../contract/solver-shape";
import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableRecord } from "../domain/values";
import { readFrame3d, readPivotOffset3d, type WorldFrame3d } from "./frame3d";
import { readNumber } from "./frame";
import { goalInputs, readMembers, type DeliveredMember } from "./ik-chain";
import { readPole3d, solveTwoBone3d, type SolveMember3d } from "./ik3d-analytic";
import { ROTATIONS3D_KEY } from "./ik3d-result";

/**
 * The two delivered members as `[first, second]`, read from the chain's own `base` links rather than
 * from the order the publisher delivered them in: `second` is the member whose `base` is the other
 * member, and `first` is that other member. The graph refuses every other shape at load
 * (`ik-chain-unsupported`, ADR-114), so the throw is an invariant rather than a runtime answer, and
 * `DeliveredMember` is the 2D reader's model, because what a publisher delivers per member does not
 * change with the dimension of the arithmetic that consumes it.
 */
function readTwoBone(input: unknown): readonly [DeliveredMember, DeliveredMember] {
  const [a, b, ...rest] = readMembers(input);
  if (a !== undefined && b !== undefined && rest.length === 0) {
    if (b.base === a.id && a.base !== b.id) return [a, b];
    if (a.base === b.id && b.base !== a.id) return [b, a];
  }
  throw new Error("ik3d requires exactly two members on one path.");
}

/**
 * The leaf's goal, addressed exactly as the 2D solver addresses it (`goalInputs`) and decoded as a
 * 3D frame. The graph refuses a solver with no goal at load (`ik-solver-no-goal`), so the throw is
 * an invariant rather than a runtime answer.
 */
function readGoal(
  target: unknown,
  pair: readonly [DeliveredMember, DeliveredMember],
): WorldFrame3d {
  const goal = goalInputs(target, pair).get(pair[1].id);
  if (goal === undefined) throw new Error("ik3d requires a target goal.");
  return readFrame3d(goal);
}

function solveMember(member: DeliveredMember): SolveMember3d {
  return {
    id: member.id,
    length: readNumber(member.values.length),
    offset: readPivotOffset3d(member.values),
  };
}

/**
 * The opt-in 3D analytic solver, reached by generic root/target requirement bindings.
 *
 * `pole` is optional: unbound, the slot is absent from the delivered inputs and the solve keeps the
 * ADR-114 root-local +z bend rule byte for byte; bound, its source's world position is the point the
 * elbow bends toward (ADR-118). A pole bound on a node that bound no `root` under `ik3d` bends no
 * chain and is refused at load as `ik-pole-without-chain`.
 *
 * `SolveResult3d.quality` and `residuals` are solver-level evidence only. They are intentionally
 * not published: ADR-107 established computing quality before a publication contract, and the
 * inspection/result output contract is deferred until this prototype is promoted. The exact-two
 * chain shape is refused by the graph at load; the compose-time member guard is only an invariant.
 * `readFrame3d` sanitizes authored non-finite values before this function receives them.
 */
export const ik3dPlugin: PluginDefinition = {
  name: "ik3d",
  requirements: {
    root: { description: "base 3D frame of the solver chain" },
    target: { description: "target 3D position to reach" },
    targets: { description: "one goal per chain leaf", dict: true },
    [POLE_SLOT]: { description: "optional world-space 3D point the chain's elbow bends toward" },
  },
  stage: "compose",
  outputs: [ROTATIONS3D_KEY],
  compose: (values, _progress, inputs) => {
    const pair = readTwoBone(inputs.members);
    const result = solveTwoBone3d(
      readFrame3d(inputs.root),
      readGoal(inputs.target, pair),
      solveMember(pair[0]),
      solveMember(pair[1]),
      readPole3d(inputs[POLE_SLOT]),
    );
    return Object.freeze({
      ...values,
      [ROTATIONS3D_KEY]: result.rotations3d as unknown as ImmutableRecord,
    });
  },
};
