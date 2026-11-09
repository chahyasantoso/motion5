import { PluginCatalog } from "@motion5/core";
import type { DescribedSlot, PluginDescription, ValueSpec } from "@motion5/core";
import { unreachable } from "@motion5/core/plugin-api";
import { builtinModels } from "@motion5/plugins/models";
import { builtinCatalog } from "../../../plugins/src/host/builtin-catalog";

export interface CatalogListing {
  readonly plugins: readonly PluginDescription[];
  readonly models: readonly { readonly id: string; readonly spec: ValueSpec }[];
}

export type CatalogArgs =
  | { readonly kind: "all" }
  | { readonly kind: "plugins"; readonly ids: readonly string[] }
  | { readonly kind: "usage"; readonly message: string };

const USAGE = "usage: motion:catalog [--plugins id,id]";

export function parseCatalogArgs(argv: readonly string[]): CatalogArgs {
  if (argv.length === 0) return { kind: "all" };
  const ids = argv[1]?.split(",").filter((id) => id !== "") ?? [];
  if (argv[0] !== "--plugins" || argv.length !== 2 || ids.length === 0)
    return { kind: "usage", message: USAGE };
  return { kind: "plugins", ids };
}

/** Every plugin and model, or only the named plugins and the models their slots require. */
export function listCatalog(catalog: PluginCatalog, ids?: readonly string[]): CatalogListing {
  const unknown = (ids ?? []).filter((id) => !catalog.pluginIds().includes(id));
  if (unknown.length > 0) throw new Error(`Unknown plugins: ${unknown.join(", ")}.`);
  const plugins = (ids === undefined ? catalog.pluginIds() : [...ids].sort()).map((id) => {
    const description = catalog.describe(id);
    if (description === undefined) throw new Error(`Plugin "${id}" has no description.`);
    return description;
  });
  const required = new Set(
    plugins.flatMap(({ requires }) => Object.values(requires).flatMap(requiredModel)),
  );
  const modelIds =
    ids === undefined ? catalog.modelIds() : catalog.modelIds().filter((id) => required.has(id));
  const models = modelIds.map((id) => {
    const model = catalog.model(id);
    if (model === undefined) throw new Error(`Model "${id}" is not admitted.`);
    return { id, spec: model.spec };
  });
  return { plugins, models };
}

function requiredModel(slot: DescribedSlot): readonly string[] {
  switch (slot.kind) {
    case "model":
      return [slot.modelId];
    case "shape":
      return [];
    default:
      return unreachable(slot);
  }
}

export async function loadBuiltinCatalog(): Promise<PluginCatalog> {
  const plugins = await Promise.all([...builtinCatalog.values()].map((entry) => entry.load()));
  const catalog = new PluginCatalog({ models: builtinModels });
  catalog.register({ plugins });
  return catalog;
}
