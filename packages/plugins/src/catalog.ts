import type { PluginCatalog } from "./loader";

/** First-party zero-configuration plugins in historical registration order. */
export const builtinCatalog: PluginCatalog = new Map([
  ["transform", { load: () => import("./transform").then((module) => module.transformPlugin) }],
  ["fk", { load: () => import("./fk").then((module) => module.fkPlugin) }],
  ["ik", { load: () => import("./ik").then((module) => module.ikPlugin) }],
  [
    "transform3d",
    { load: () => import("./transform3d").then((module) => module.transform3dPlugin) },
  ],
  ["fk3d", { load: () => import("./fk3d").then((module) => module.fk3dPlugin) }],
  ["ik3d", { load: () => import("./ik3d").then((module) => module.ik3dPlugin) }],
]);
