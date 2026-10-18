import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { deriveChainLayout } from "./chain-layout";

export const pointPlugin: PluginDefinition = Object.freeze({
  name: "point",
  keys: Object.freeze(["length", "x", "y"]),
  collect: (entry) => ({ ...entry.values }),
  derive: (context) => deriveChainLayout(context.inventory),
} satisfies StatelessPluginDefinition);
