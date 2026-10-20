import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { none, refused } from "@motion5/core/plugin-api";
import { readFrame } from "./frame";
import { readRootPolicy } from "./root-policy";

export const rootPlugin: PluginDefinition = Object.freeze({
  name: "root",
  requirements: Object.freeze({ frame: Object.freeze({}) }),
  derive: (context) => {
    const policy = readRootPolicy(context.inventory);
    return policy.status === "refused" ? refused(policy.diagnostics) : none;
  },
  fold: {
    outputs: Object.freeze(["root"]),
    run: (entry) => ({ root: readFrame(entry) }),
  },
} satisfies StatelessPluginDefinition);
