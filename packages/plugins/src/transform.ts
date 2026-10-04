import type { PluginDefinition } from "@motion5/core/plugin-api";

export const transformPlugin: PluginDefinition = {
  name: "transform",
  keys: ["x", "y", "rotation"],
  compose: (values) => values,
};
