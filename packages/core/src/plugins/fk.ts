import type { PluginDefinition } from "../domain/plugins";
import { readFrame, readNumber } from "./frame";

export function composeWorld(
  parent: { x: number; y: number; rotation: number },
  local: { x: number; y: number; rotation: number },
): { x: number; y: number; rotation: number } {
  const rad = (parent.rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: parent.x + (local.x * cos - local.y * sin),
    y: parent.y + (local.x * sin + local.y * cos),
    rotation: parent.rotation + local.rotation,
  };
}

/**
 * The rotation the bound solver solved for `nodeId`, or `undefined` when there is none.
 *
 * Named and hoisted rather than inlined. This is the plugin every bone in the rig composes through,
 * and four levels of narrowing read as part of the kinematics when they sit inside the arithmetic.
 * One answer covers an unbound slot, a source that publishes no `rotations`, a `rotations` record
 * that does not name this node, and a non-finite angle, so the caller owns the authored fallback in
 * exactly one place. See ADR-051.
 */
function readSolvedRotation(solver: unknown, nodeId: string): number | undefined {
  if (solver === null || typeof solver !== "object" || Array.isArray(solver)) return undefined;
  const rotations = (solver as Readonly<Record<string, unknown>>).rotations;
  if (rotations === null || typeof rotations !== "object" || Array.isArray(rotations))
    return undefined;
  const solved = (rotations as Readonly<Record<string, unknown>>)[nodeId];
  return typeof solved === "number" && Number.isFinite(solved) ? solved : undefined;
}

/**
 * Forward kinematics for one bone.
 *
 * The claimed keys are the natural `length` and `rotation`, not the `boneLength` and `boneRotation`
 * they replace. Those names existed only because `transformPlugin` already owned `rotation` in one
 * global key map and registration refused a second claimant. Ownership is per plugin now, and the
 * authored group names the owner, so a bone is authored `fk: { length, rotation }` and a root
 * `transform: { x, y, rotation }`. See ADR-043.
 *
 * The parent frame arrives through the plugin-owned `base` requirement rather than through three
 * flat `parentX`, `parentY`, and `parentRotation` inputs an author had to produce with a projection
 * map. The slot is scoped to this plugin, so the source keeps its natural `x`, `y`, and `rotation`
 * names and none of them can collide with this bone's own authored values. That is why `rotation`
 * can be both an authored local value and an observed parent value in one composition, without a
 * global input-collision guard and without either one being renamed. See ADR-044.
 *
 * `rotation` is claimed and produced. The authored value is this bone's rotation relative to its
 * parent, and the composed one is its rotation in world space, which is what a child observes and
 * what a renderer writes. Nothing downstream reads the local value, so it is replaced rather than
 * published beside its own result.
 *
 * An authored `x` and `y` offset this bone's pivot from its parent's frame. Both default to zero,
 * so a bone authored before slice A of issue #195 composes exactly the frame it always composed.
 * The offset is read in the parent's rotated space rather than in world space, because a pivot that
 * stopped following its parent when the parent turned would not be a pivot.
 *
 * Claiming them costs their flat spelling, which is stated rather than discovered: `transform`
 * claims `x` and `y` as well, so a flat `x` is `plugin-ambiguous-key` and an author names the owner
 * by authoring inside a group, exactly as a flat `rotation` already required. See ADR-043.
 *
 * A bound `solver` replaces the authored local `rotation` with the one the solver solved for this
 * node, and nothing else about the composition changes. An unbound slot, or a solver that does not
 * name this node, falls back to the authored value, so every existing FK bone is byte-identical.
 * See ADR-051.
 */
export const fkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["x", "y", "length", "rotation"],
  requirements: {
    base: { description: "the parent bone or root this bone hangs from" },
    solver: { description: "the IK solver providing solved rotation override" },
  },
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values, _progress, inputs, nodeId) => {
    const rotation = readSolvedRotation(inputs.solver, nodeId) ?? readNumber(values.rotation);
    // The pivot, then the extension. Two rotate-then-translates, and `composeWorld` owns both, so
    // the trigonometry lives in one place instead of being copied here beside an export nothing
    // called. The extension is purely along the bone's own direction, which is why its local frame
    // carries `length` on `x` and nothing on `y` or `rotation`.
    const pivot = composeWorld(readFrame(inputs.base), {
      x: readNumber(values.x),
      y: readNumber(values.y),
      rotation,
    });
    return composeWorld(pivot, { x: readNumber(values.length), y: 0, rotation: 0 });
  },
};
