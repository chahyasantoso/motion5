import type { PluginCatalog } from "./loader";

/** First-party zero-configuration plugins in historical registration order. */
export const builtinCatalog: PluginCatalog = new Map([
  [
    "transform",
    { load: () => import("./legacy/transform").then((module) => module.legacyTransformPlugin) },
  ],
  ["fk", { load: () => import("./legacy/fk").then((module) => module.legacyFkPlugin) }],
  ["ik", { load: () => import("./legacy/ik").then((module) => module.legacyIkPlugin) }],
  [
    "transform3d",
    {
      load: () => import("./legacy/transform3d").then((module) => module.legacyTransform3dPlugin),
    },
  ],
  ["fk3d", { load: () => import("./legacy/fk3d").then((module) => module.legacyFk3dPlugin) }],
  ["ik3d", { load: () => import("./legacy/ik3d").then((module) => module.legacyIk3dPlugin) }],
]);
