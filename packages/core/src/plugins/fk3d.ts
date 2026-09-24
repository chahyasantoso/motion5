import type { PluginDefinition } from "../domain/plugins";
import { composeWorld3d, readEuler3d, readFrame3d, ZERO_EULER, type Euler3d } from "./frame3d";
import { ROTATIONS3D_KEY } from "./ik3d-result";
import { readNumber, segmentExtent } from "./frame";

/** This member's local triple from the solver's `rotations3d`, identity when it has none. */
function readSolved(solver: unknown, nodeId: string): Euler3d {
  if (solver === null || typeof solver !== "object" || Array.isArray(solver)) return ZERO_EULER;
  const rotations = (solver as Readonly<Record<string, unknown>>)[ROTATIONS3D_KEY];
  if (rotations === null || typeof rotations !== "object" || Array.isArray(rotations))
    return ZERO_EULER;
  return readEuler3d((rotations as Readonly<Record<string, unknown>>)[nodeId]);
}

/**
 * 3D forward kinematics. `base` owns the world frame and `solver` owns the local Euler override;
 * this plugin owns only the member length and publishes the six scalar world-frame keys.
 */
export const fk3dPlugin: PluginDefinition = {
  name: "fk3d",
  keys: ["length"],
  requirements: {
    base: { description: "the parent 3D frame" },
    solver: { description: "the 3D solver pose" },
  },
  stage: "compose",
  outputs: ["x", "y", "z", "rotation", "rotationX", "rotationY"],
  compose: (values, _progress, inputs, nodeId) => {
    const base = readFrame3d(inputs.base);
    const local = readSolved(inputs.solver, nodeId);
    const world = composeWorld3d(base, {
      x: 0,
      y: 0,
      z: 0,
      ...local,
    });
    const tip = composeWorld3d(world, {
      ...ZERO_EULER,
      x: segmentExtent(readNumber(values.length)),
      y: 0,
      z: 0,
    });
    return tip;
  },
};
