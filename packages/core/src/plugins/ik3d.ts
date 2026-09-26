import { INSPECTION_KEY, INSPECT_KEY } from "../contract/solver-constraints";
import { POLE_SLOT } from "../contract/solver-shape";
import type { PluginDefinition } from "../domain/plugins";
import type { ImmutableRecord } from "../domain/values";
import { readFrame3d } from "./frame3d";
import { inspectionOutput } from "./ik-result";
import { readPole3d } from "./ik3d-analytic";
import { readChainMembers3d } from "./ik3d-chain";
import { ROTATIONS3D_KEY } from "./ik3d-result";
import { solveChain3d } from "./ik3d-solve";

/**
 * The opt-in 3D solver, reached by generic root/target requirement bindings.
 *
 * The plugin only wires slots to a solve: `ik3d-chain.ts` reads the delivered members and their
 * goals into `ChainMember3d`s, and `ik3d-solve.ts` decides which strategy answers the chain, the
 * closed form for a parent and its addressed child and 3D FABRIK for every longer or branching
 * chain of `fk3d` members (ADR-122). Goals are addressed exactly as 2D addresses them, by the bare
 * `target` on a single-leaf chain or per leaf under `targets`.
 *
 * `pole` is optional: unbound, the slot is absent from the delivered inputs and the solve keeps the
 * ADR-114 root-local +z bend rule byte for byte; bound, its source's world position is the point the
 * elbow bends toward (ADR-118). A pole bound on a node that bound no `root` under `ik3d` bends no
 * chain and is refused at load as `ik-pole-without-chain`.
 *
 * `inspect` is the solver's static opt-in to the same fixed-shape `inspection` record the 2D `ik`
 * publishes, projected from `SolveResult3d`'s `quality` and `residuals` by `inspectionOutput`, the
 * one owner of both the opt-in and the projection (ADR-109, ADR-120). An unopted solver publishes
 * exactly the values and `rotations3d` it did before. The load rules are the 2D ones unchanged:
 * `ik-inspect-malformed` refuses a switch that is not one static boolean, and
 * `ik-solver-key-misgrouped` one authored under a group that did not bind `root`. A chain with any
 * member that is not `fk3d` is refused by the graph at load (`ik-chain-unsupported`), so every chain
 * reaching here is one the dispatcher answers. `readFrame3d` sanitizes authored non-finite values
 * before this function receives them.
 */
export const ik3dPlugin: PluginDefinition = {
  name: "ik3d",
  keys: [INSPECT_KEY],
  requirements: {
    root: { description: "base 3D frame of the solver chain" },
    target: { description: "target 3D position to reach" },
    targets: { description: "one goal per chain leaf", dict: true },
    [POLE_SLOT]: { description: "optional world-space 3D point the chain's elbow bends toward" },
  },
  stage: "compose",
  outputs: [ROTATIONS3D_KEY, INSPECTION_KEY],
  compose: (values, _progress, inputs) => {
    const result = solveChain3d(
      readFrame3d(inputs.root),
      readChainMembers3d(inputs.members, inputs.target),
      readPole3d(inputs[POLE_SLOT]),
    );
    return Object.freeze({
      ...values,
      [ROTATIONS3D_KEY]: result.rotations3d as unknown as ImmutableRecord,
      ...inspectionOutput(values, result),
    });
  },
};
