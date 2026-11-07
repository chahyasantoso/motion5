import { PluginCatalog } from "@motion5/core";
import type { PluginDescription, ValueSpec } from "@motion5/core";
import { builtinCatalog } from "../../packages/plugins/src/host/builtin-catalog";

export interface CatalogListing {
  readonly plugins: readonly PluginDescription[];
  readonly models: readonly { readonly id: string; readonly spec: ValueSpec }[];
}

export function listCatalog(catalog: PluginCatalog): CatalogListing {
  const plugins = catalog.pluginIds().map((id) => {
    const description = catalog.describe(id);
    if (description === undefined) throw new Error(`Plugin "${id}" has no description.`);
    return description;
  });
  const models = catalog.modelIds().map((id) => {
    const model = catalog.model(id);
    if (model === undefined) throw new Error(`Model "${id}" is not admitted.`);
    return { id, spec: model.spec };
  });
  return { plugins, models };
}

export async function loadBuiltinCatalog(): Promise<PluginCatalog> {
  const plugins = await Promise.all([...builtinCatalog.values()].map((entry) => entry.load()));
  const catalog = new PluginCatalog();
  catalog.register({ plugins });
  return catalog;
}
