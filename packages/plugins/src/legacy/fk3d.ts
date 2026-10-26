import { INFLUENCE_KEY, JOINT_VOCABULARY_KEYS, ORIENT_KEY } from "@motion5/core/plugin-api";
import type { PluginDefinition } from "@motion5/core/plugin-api";
import {
  blendOrientation3d,
  composeWorld3d,
  readEuler3d,
  readFrame3d,
  readPivotOffset3d,
  ZERO_EULER,
  type Euler3d,
} from "../frame3d";
import { ROTATIONS3D_KEY } from "../ik3d-result";
import { clamp, readNumber, segmentExtent } from "../frame";

function isRecord(input: unknown): input is Readonly<Record<string, unknown>> {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}

/**
 * The local triple the bound solver solved for `nodeId`, or `undefined` when there is none.
 *
 * One answer covers an unbound slot, a source that publishes no `rotations3d`, a `rotations3d`
 * that is not a record, a record that does not name this node, and an entry that is not a record,
 * so the caller owns the rest-pose fallback in exactly one place. The last case used to read as a
 * zero triple, a solve to identity; it is "no solve" now, which is what 2D's `readSolvedRotation`
 * answers for a non-number entry (ADR-051). `ik3d` publishes a triple for every member it solves,
 * so no correctly wired rig reaches it. A record's non-finite angles read as zero through
 * `readEuler3d`, exactly as they do in the matrix.
 *
 * The weight is deliberately not folded in: an unbound slot and a weight of `0` stay two different
 * things, and with no solve the weight is never read (ADR-055, ADR-116).
 */
function readSolved(solver: unknown, nodeId: string): Euler3d | undefined {
  if (!isRecord(solver)) return undefined;
  const rotations = solver[ROTATIONS3D_KEY];
  if (!isRecord(rotations)) return undefined;
  const solved = rotations[nodeId];
  return isRecord(solved) ? readEuler3d(solved) : undefined;
}

/**
 * The grouped FK3D implementation retained for the legacy registry until Phase 7.
 *
 * The public `fk3d` entrypoint is the identified-table implementation after Slice G; grouped
 * consumers must import this explicit internal path instead.
 */
export const legacyFk3dPlugin: PluginDefinition = {
  name: "fk3d",
  keys: [
    "length",
    "rotation",
    "rotationX",
    "rotationY",
    "weight",
    "x",
    "y",
    "z",
    ...JOINT_VOCABULARY_KEYS,
    INFLUENCE_KEY,
    ORIENT_KEY,
  ],
  requirements: {
    base: { description: "the parent 3D frame" },
    solver: { description: "the 3D solver pose" },
  },
  stage: "compose",
  outputs: ["x", "y", "z", "rotation", "rotationX", "rotationY"],
  compose: (values, _progress, inputs, nodeId) => {
    const rest = readEuler3d(values);
    const solved = readSolved(inputs.solver, nodeId);
    const local =
      solved === undefined
        ? rest
        : blendOrientation3d(rest, solved, clamp(readNumber(values.weight, 1), 0, 1));
    const world = composeWorld3d(readFrame3d(inputs.base), {
      ...readPivotOffset3d(values),
      ...local,
    });
    return composeWorld3d(world, {
      ...ZERO_EULER,
      x: segmentExtent(readNumber(values.length)),
      y: 0,
      z: 0,
    });
  },
};
