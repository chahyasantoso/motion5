import type { PluginDefinition } from "../domain/plugins";

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
 * Forward kinematics for one bone.
 *
 * The claimed keys are the natural `length` and `rotation`, not the `boneLength` and `boneRotation`
 * they replace. Those names existed only because `transformPlugin` already owned `rotation` in one
 * global key map and registration refused a second claimant. Ownership is per plugin now, and the
 * authored group names the owner, so a bone is authored `fk: { length, rotation }` and a root
 * `transform: { x, y, rotation }`. See ADR-043.
 *
 * `rotation` is claimed and produced. The authored value is this bone's rotation relative to its
 * parent, and the composed one is its rotation in world space, which is what a child observes and
 * what a renderer writes. Nothing downstream reads the local value, so it is replaced rather than
 * published beside its own result.
 */
export const fkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["length", "rotation"],
  inputs: ["parentX", "parentY", "parentRotation"],
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values) => {
    const parentX = typeof values.parentX === "number" ? values.parentX : 0;
    const parentY = typeof values.parentY === "number" ? values.parentY : 0;
    const parentRotation = typeof values.parentRotation === "number" ? values.parentRotation : 0;
    const length = typeof values.length === "number" ? values.length : 0;
    const localRotation = typeof values.rotation === "number" ? values.rotation : 0;

    // Rotate-then-translate: the authored rotation controls THIS bone's direction from its parent.
    const worldRotation = parentRotation + localRotation;
    const rad = (worldRotation * Math.PI) / 180;

    return {
      x: parentX + length * Math.cos(rad),
      y: parentY + length * Math.sin(rad),
      rotation: worldRotation,
    };
  },
};
