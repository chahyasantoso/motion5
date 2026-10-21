import type { PluginDefinition, StatelessPluginDefinition } from "@motion5/core/plugin-api";
import { deriveJoinedLayout, validateJoinedRequirements } from "./joined-layout";
import { SKELETON_2D, type SkeletonSpaceSpec } from "./skeleton-space";

export function defineJoinPlugin(spec: SkeletonSpaceSpec = SKELETON_2D): PluginDefinition {
  return Object.freeze({
    name: spec.joinPlugin,
    requirements: Object.freeze({
      chain: Object.freeze({ capability: spec.chainCapability }),
      parent: Object.freeze({ capability: spec.chainCapability }),
    }),
    // C3 declares the collect seam; D2 fills dynamic link records once bindings are exposed.
    collect: (entry) => ({ ...entry.values }),
    validate: (context) => validateJoinedRequirements(context, spec),
    derive: (context) => deriveJoinedLayout(context, spec),
  } satisfies StatelessPluginDefinition);
}

export const joinPlugin: PluginDefinition = defineJoinPlugin(SKELETON_2D);
