import type { PluginDefinition } from "../domain/plugins";
import {
  blendOrientation3d,
  composeWorld3d,
  readEuler3d,
  readFrame3d,
  readPivotOffset3d,
  ZERO_EULER,
  type Euler3d,
} from "./frame3d";
import { ROTATIONS3D_KEY } from "./ik3d-result";
import { clamp, readNumber, segmentExtent } from "./frame";

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
 * 3D forward kinematics. `base` owns the parent world frame and `solver` owns the solved local
 * orientation; this plugin owns the member's length, its authored local rest orientation, and the
 * per-member weight that blends one toward the other, and publishes the six scalar world keys.
 *
 * `rotation`, `rotationX` and `rotationY` are claimed and produced, as 2D `fk` claims and produces
 * `rotation`: authored, they are this bone's rest orientation relative to its parent in the CSS
 * `Rz * Rx * Ry` convention `frame3d.ts` owns, each defaulting to zero; composed, they are its world
 * orientation, which is what a child observes and a renderer writes.
 *
 * With no solve the rest orientation composes and `weight` is never read. With one, the local
 * orientation is `blendOrientation3d(rest, solved, weight)`, the one short-arc rotation blend, so
 * a weight of `1` is the solved triple itself and every rig authored before either key existed
 * composes the ADR-114 prototype's bytes (`TH-29`). `weight` is per member so a chain can stagger
 * its reach, defaults to `1`, is clamped into `[0, 1]` because a blend past its two anchors is
 * undefined rather than designed, and reads a non-finite value as `1` through `readNumber`, the
 * same as omitting it: the 2D semantics of ADR-055 key for key. The clamp stays here although the
 * blend short-circuits outside `(0, 1)`, because the reader owns what an authored weight means.
 *
 * `x`, `y` and `z` are the member pivot offset in the parent's rotated frame. They are claimed and
 * composed before the member's local orientation, so the member's own rotation cannot move its pivot.
 * The zero offset uses the same object shape as the phase-1 call for byte identity (ADR-117).
 */
export const fk3dPlugin: PluginDefinition = {
  name: "fk3d",
  keys: ["length", "rotation", "rotationX", "rotationY", "weight", "x", "y", "z"],
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
