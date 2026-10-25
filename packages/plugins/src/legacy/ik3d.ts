import { INSPECTION_KEY, INSPECT_KEY, POLE_SLOT } from "@motion5/core/plugin-api";
import type { ImmutableRecord, PluginDefinition } from "@motion5/core/plugin-api";
import { readFrame3d } from "../frame3d";
import { inspectionOutput } from "../ik-result";
import { readPole3d } from "../ik3d-analytic";
import { readChainMembers3d } from "../ik3d-chain";
import { ROTATIONS3D_KEY } from "../ik3d-result";
import { solveChain3d } from "../ik3d-solve";

export const legacyIk3dPlugin: PluginDefinition = {
  name: "ik3d",
  solverChain: { kind: "tree", memberPlugin: "fk3d" },
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
