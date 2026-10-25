import type { PluginDefinition } from "@motion5/core/plugin-api";
import {
  clamp,
  composeWorld,
  lerpAngle,
  readFrame,
  readNumber,
  readPivotOffset,
  segmentExtent,
} from "../frame";

export const legacyFkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["x", "y", "length", "rotation", "weight", "minRotation", "maxRotation", "influence"],
  requirements: {
    base: { description: "the parent bone or root this bone hangs from" },
    solver: { description: "the IK solver providing solved rotation override" },
  },
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values, _progress, inputs, nodeId) => {
    const solver = inputs.solver;
    const rotations =
      solver !== null && typeof solver === "object" && !Array.isArray(solver)
        ? (solver as Readonly<Record<string, unknown>>).rotations
        : undefined;
    const solved =
      rotations !== null && typeof rotations === "object" && !Array.isArray(rotations)
        ? (rotations as Readonly<Record<string, unknown>>)[nodeId]
        : undefined;
    const rotation =
      typeof solved === "number" && Number.isFinite(solved)
        ? lerpAngle(readNumber(values.rotation), solved, clamp(readNumber(values.weight, 1), 0, 1))
        : readNumber(values.rotation);
    const pivot = composeWorld(readFrame(inputs.base), { ...readPivotOffset(values), rotation });
    return composeWorld(pivot, { x: segmentExtent(readNumber(values.length)), y: 0, rotation: 0 });
  },
};
