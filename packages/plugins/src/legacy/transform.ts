import type { PluginDefinition } from "@motion5/core/plugin-api";

export const legacyTransformPlugin: PluginDefinition = {
  name: "transform",
  keys: ["x", "y", "rotation"],
  compose: (values) => values,
};
