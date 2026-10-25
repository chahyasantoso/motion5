import type { PluginDefinition } from "@motion5/core/plugin-api";

export const legacyTransform3dPlugin: PluginDefinition = {
  name: "transform3d",
  keys: ["x", "y", "z", "rotation", "rotationX", "rotationY"],
  compose: (values) => values,
};
