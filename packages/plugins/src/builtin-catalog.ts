import type { PluginDefinition, ResolvedInput } from "@motion5/core/plugin-api";

/** A source-controlled loader entry for the identified-table plugin catalog. */
export interface PluginDescriptor {
  readonly load: () => Promise<PluginDefinition<ResolvedInput>>;
}

/**
 * The v5 catalog starts empty and is filled one public plugin at a time by the Phase 5 slices.
 * Grouped definitions stay in the legacy catalog until their individual public cutover.
 */
export const builtinCatalog: ReadonlyMap<string, PluginDescriptor> = new Map<
  string,
  PluginDescriptor
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
  [
    "ik",
    {
      load: async () => (await import("./ik")).ikPlugin,
    },
  ],
  [
    "ik3d",
    {
      load: async () => (await import("./ik3d")).ik3dPlugin,
    },
  ],
  [
    "fk",
    {
      load: async () => (await import("./fk")).fkPlugin,
    },
  ],
  [
    "fk3d",
    {
      load: async () => (await import("./fk3d")).fk3dPlugin,
    },
  ],
]);
