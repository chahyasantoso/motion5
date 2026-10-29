import { PluginCatalog } from "../../src/domain/plugin-catalog";
import type { PluginDefinition } from "../../src/contract/v5";
import { transformPlugin } from "@motion5/plugins/transform";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";

/**
 * A dependency-only plugin for graph tests.
 *
 * Its one slot carries an empty record, so an undeclared source satisfies it: these cases are about
 * edge order, cycles and rollback, not about a solver's table contract. Registering the real
 * built-ins instead made every fixture bind a solver's full slot contract for no measured reason.
 */
export const GRAPH_EDGE_PLUGIN: PluginDefinition = {
  id: "graph-edge",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      chain: {
        optional: true,
        outputs: { values: { kind: "table", schema: { row: { fields: {} } } } },
      },
    },
  },
  outputs: { values: { kind: "table", schema: { row: { fields: {} } } } },
  transform() {
    return { values: [] };
  },
};

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
    GRAPH_EDGE_PLUGIN,
    ...additional,
  ]);
  return registry;
}
