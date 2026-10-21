import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { none, refused } from "@motion5/core/plugin-api";
import { readFrame } from "./frame";
import { readRootPolicy } from "./root-policy";
import { SKELETON_2D, type SkeletonSpaceSpec } from "./skeleton-space";

export function defineRootPlugin(
  spec: SkeletonSpaceSpec = SKELETON_2D,
  readRootFrame: (input: unknown) => unknown = readFrame,
): PluginDefinition {
  return Object.freeze({
    name: spec.rootPlugin,
    requirements: Object.freeze({ frame: Object.freeze({}) }),
    derive: (context) => {
      const policy = readRootPolicy(context.inventory, spec.rootPlugin);
      return policy.status === "refused" ? refused(policy.diagnostics) : none;
    },
    fold: {
      outputs: Object.freeze(["root"]),
      run: (entry) => ({ root: readRootFrame(entry) }),
    },
  } satisfies StatelessPluginDefinition);
}

export const rootPlugin: PluginDefinition = defineRootPlugin(SKELETON_2D);
