import { readAuthoredPlugins } from "../contract/keyframe-shape";
import type { PluginCapabilities } from "../ports/plugin-capabilities";
import type { EdgeRequirement, GraphNode } from "./ir";

/**
 * The one legacy gate: kinematic classification applies only to a plugin on the compose channel.
 * F2 deletes this module with that channel.
 */
export function isLegacyComposeGroup(capabilities: PluginCapabilities, plugin: string): boolean {
  return !capabilities.isNewPath(plugin);
}

/** Whether a node authored any plugin on the legacy compose channel. F2 deletes it. */
export function isLegacyComposeNode(node: GraphNode, capabilities: PluginCapabilities): boolean {
  return readAuthoredPlugins(node.track.keyframes).some((plugin) =>
    isLegacyComposeGroup(capabilities, plugin),
  );
}

/** Whether an edge's slot belongs to a plugin on the legacy compose channel. F2 deletes it. */
export function isLegacyComposeRequirement(
  capabilities: PluginCapabilities,
  requirement: EdgeRequirement | undefined,
): requirement is EdgeRequirement {
  return requirement !== undefined && isLegacyComposeGroup(capabilities, requirement.plugin);
}
