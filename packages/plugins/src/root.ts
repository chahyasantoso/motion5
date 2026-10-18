import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { readFrame } from "./frame";

export const rootPlugin: PluginDefinition = Object.freeze({
  name: "root",
  requirements: Object.freeze({ frame: Object.freeze({}) }),
  fold: {
    outputs: Object.freeze(["root"]),
    run: (entry) => ({ root: readFrame(entry) }),
  },
} satisfies StatelessPluginDefinition);
