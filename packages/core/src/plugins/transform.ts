import type { PluginDefinition } from "../plugin-api";

export const transformPlugin: PluginDefinition = {
  name: "transform",
  keys: ["x", "y", "rotation"],
  compose: (values) => values,
};
