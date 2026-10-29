import { PluginCatalog } from "../../src/domain/plugin-catalog";
import type { PluginDefinition } from "../../src/contract/v5";
import { transformPlugin } from "@motion5/plugins/transform";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";

/**
 * The identified built-ins, admitted for graph tests that need capability answers.
 *
 * Explicit declarations rather than a production default: a graph test that silently depended on
 * the host's catalogue would pass while the app's own admission was missing a plugin.
 */
export function builtinRegistry(...additional: readonly PluginDefinition[]): PluginCatalog {
  const registry = new PluginCatalog();
  registry.registerAll([
    transformPlugin,
    fkPlugin,
    ikPlugin,
    transform3dPlugin,
    fk3dPlugin,
    ik3dPlugin,
    ...additional,
  ]);
  return registry;
}
