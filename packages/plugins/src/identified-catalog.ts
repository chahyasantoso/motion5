import type { IdentifiedPluginDefinition, ResolvedInput } from "@motion5/core/plugin-api";

/** A source-controlled loader entry for the identified-table plugin catalog. */
export interface IdentifiedPluginDescriptor {
  readonly load: () => Promise<IdentifiedPluginDefinition<ResolvedInput>>;
}

/**
 * The v5 catalog starts empty and is filled one public plugin at a time by the Phase 5 slices.
 * Grouped definitions stay in the legacy catalog until their individual public cutover.
 */
export const identifiedCatalog: ReadonlyMap<string, IdentifiedPluginDescriptor> = new Map<
  string,
  IdentifiedPluginDescriptor
>([
  [
    "transform",
    {
      load: async () => (await import("./transform")).transformPlugin,
    },
  ],
  [
    "transform3d",
    {
      load: async () => (await import("./transform3d")).transform3dPlugin,
    },
  ],
]);
