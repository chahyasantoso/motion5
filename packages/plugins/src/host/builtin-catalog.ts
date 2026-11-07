import type { PluginDescriptor } from "./loader";

/** The zero-config plugins a loader resolves by name; each entry imports its module on first use. */
export const builtinCatalog: ReadonlyMap<string, PluginDescriptor> = new Map<
  string,
  PluginDescriptor
>([
  [
    "transform",
    {
      load: async () => (await import("../transform/transform")).transformPlugin,
    },
  ],
  [
    "transform3d",
    {
      load: async () => (await import("../transform/transform3d")).transform3dPlugin,
    },
  ],
  [
    "ik",
    {
      load: async () => (await import("../ik/ik")).ikPlugin,
    },
  ],
  [
    "ik3d",
    {
      load: async () => (await import("../ik/ik3d")).ik3dPlugin,
    },
  ],
  [
    "fk",
    {
      load: async () => (await import("../fk/fk")).fkPlugin,
    },
  ],
  [
    "fk3d",
    {
      load: async () => (await import("../fk/fk3d")).fk3dPlugin,
    },
  ],
  [
    "anchorsToCubic",
    {
      load: async () => (await import("../path/anchors-to-cubic")).anchorsToCubicPlugin,
    },
  ],
  [
    "bezier",
    {
      load: async () => (await import("../path/bezier")).bezierPlugin,
    },
  ],
  [
    "skinAnchors",
    {
      load: async () => (await import("../path/skin-anchors")).skinAnchorsPlugin,
    },
  ],
  [
    "cascade",
    {
      load: async () => (await import("../motion/cascade")).cascadePlugin,
    },
  ],
  [
    "drop",
    {
      load: async () => (await import("../motion/drop")).dropPlugin,
    },
  ],
  [
    "hop",
    {
      load: async () => (await import("../motion/hop")).hopPlugin,
    },
  ],
  [
    "layer",
    {
      load: async () => (await import("../motion/layer")).layerPlugin,
    },
  ],
  [
    "rope",
    {
      load: async () => (await import("../motion/rope")).ropePlugin,
    },
  ],
  [
    "svgPath",
    {
      load: async () => (await import("../path/svg-path")).svgPathPlugin,
    },
  ],
  [
    "trace",
    {
      load: async () => (await import("../motion/trace")).tracePlugin,
    },
  ],
  [
    "wipe",
    {
      load: async () => (await import("../motion/wipe")).wipePlugin,
    },
  ],
]);
