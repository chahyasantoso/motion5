import type { PluginDescriptor } from "./loader";

/** The zero-config plugins a loader resolves by name; each entry imports its module on first use. */
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
  [
    "anchorsToCubic",
    {
      load: async () => (await import("./path/anchors-to-cubic")).anchorsToCubicPlugin,
    },
  ],
  [
    "bezier",
    {
      load: async () => (await import("./path/bezier")).bezierPlugin,
    },
  ],
  [
    "skinAnchors",
    {
      load: async () => (await import("./path/skin-anchors")).skinAnchorsPlugin,
    },
  ],
]);
