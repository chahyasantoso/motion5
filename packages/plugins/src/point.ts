import type { DerivationContext, PluginDefinition } from "@motion5/core/plugin-api";
import { deriveChainLayout } from "./chain-layout";

export const pointPlugin: PluginDefinition = Object.freeze({
  name: "point",
  keys: Object.freeze(["length", "x", "y"]),
  collect: {
    output: "points",
    run: (entry: unknown) => {
      return typeof entry === "object" && entry !== null
        ? { ...(entry as Record<string, unknown>) }
        : {};
    },
  },
  capabilities: Object.freeze(["chain"]),
  derive: (context: DerivationContext) => deriveChainLayout(context.inventory, context),
});
