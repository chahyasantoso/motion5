import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { deriveChainLayout } from "./chain-layout";
import { SKELETON_2D, type SkeletonSpaceSpec } from "./skeleton-space";

export function definePointPlugin(spec: SkeletonSpaceSpec = SKELETON_2D): PluginDefinition {
  return Object.freeze({
    name: spec.pointPlugin,
    keys: Object.freeze([...spec.pointKeys]),
    collect: (entry) => ({ ...entry.values }),
    derive: (context) => deriveChainLayout(context.inventory, spec),
  } satisfies StatelessPluginDefinition);
}

export const pointPlugin: PluginDefinition = definePointPlugin(SKELETON_2D);
