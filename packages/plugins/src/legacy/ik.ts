import { BEND_KEY, FLIP_KEY, INSPECTION_KEY, INSPECT_KEY } from "@motion5/core/plugin-api";
import type { ImmutableRecord, PluginDefinition } from "@motion5/core/plugin-api";
import { readFrame } from "../frame";
import { readGoals, readMembers, readSolveMembers } from "../ik-chain";
import { readBend } from "../ik-constraint";
import { inspectionOutput } from "../ik-result";
import { solveChain } from "../ik-solve";

export const legacyIkPlugin: PluginDefinition = {
  name: "ik",
  keys: [FLIP_KEY, BEND_KEY, INSPECT_KEY],
  requirements: {
    root: { description: "base frame of the solver chain" },
    target: { description: "target position to reach" },
    targets: { description: "one goal per chain leaf, keyed by member id", dict: true },
  },
  stage: "compose",
  outputs: ["rotations", INSPECTION_KEY],
  compose: (values, _progress, inputs) => {
    const root = readFrame(inputs.root);
    const members = readMembers(inputs.members);
    const goals = readGoals(inputs.target, members);
    const result = solveChain(root, readSolveMembers(members, goals), readBend(values));
    return Object.freeze({
      ...values,
      rotations: Object.freeze(result.rotations as unknown as ImmutableRecord),
      ...inspectionOutput(values, result),
    });
  },
};
