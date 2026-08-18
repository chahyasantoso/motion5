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

export const fkPlugin: PluginDefinition = {
  name: "fk",
  keys: ["boneLength", "boneRotation"],
  inputs: ["parentX", "parentY", "parentRotation"],
  stage: "compose",
  outputs: ["x", "y", "rotation"],
  compose: (values) => {
    const parentX = typeof values.parentX === "number" ? values.parentX : 0;
    const parentY = typeof values.parentY === "number" ? values.parentY : 0;
    const parentRotation = typeof values.parentRotation === "number" ? values.parentRotation : 0;
    const length = typeof values.boneLength === "number" ? values.boneLength : 0;
    const boneRot = typeof values.boneRotation === "number" ? values.boneRotation : 0;

    // Rotate-then-translate: boneRotation controls THIS bone's direction from parent.
    const worldRot = parentRotation + boneRot;
    const rad = (worldRot * Math.PI) / 180;

    return {
      x: parentX + length * Math.cos(rad),
      y: parentY + length * Math.sin(rad),
      rotation: worldRot,
    };
  },
};
