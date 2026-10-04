import type { PluginDefinition } from "@motion5/core/plugin-api";

/** The opt-in 3D root/goal reader; grouped authoring keeps it separate from the 2D transform. */
export const transform3dPlugin: PluginDefinition = {
  name: "transform3d",
  keys: ["x", "y", "z", "rotation", "rotationX", "rotationY"],
  compose: (values) => values,
};
