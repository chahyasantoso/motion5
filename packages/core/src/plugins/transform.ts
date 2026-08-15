import type { PluginDefinition } from "../domain/plugins";

export const transformPlugin: PluginDefinition = {
  name: "transform",
  keys: ["x", "y", "rotation"],
  compose: (values) => values,
};
