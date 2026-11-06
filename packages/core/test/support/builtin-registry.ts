import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { shape } from "@motion5/core/plugin-api";
import type { PluginDefinition, ValueSpec } from "../../src/contract/v5";
import { Engine, type EngineOptions } from "../../src/engine";
import { IncrementalGraphBuilder } from "../../src/graph/builders/incremental";
import type { GraphBuilder } from "../../src/ports/graph-builder";
import { transformPlugin } from "@motion5/plugins/transform";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { testModels } from "./test-models";
import { defineModel } from "../../src/contract/v5";

const FIXTURE_OUT_1 = defineModel({
  id: "FixtureOut1",
  spec: { kind: "table", schema: { row: { fields: {} } } },
});

const OPEN_RECORD: ValueSpec = {
  kind: "record",
  fields: {},
  additionalProperties: true,
};
const OPEN_RECORD_MODEL = defineModel({ id: "OpenRecordOut", spec: OPEN_RECORD });

/** A permissive computed observer for runtime tests that are not about a solver contract. */
export function testObserver(id: string): PluginDefinition {
  return {
    id,
    inputs: {
      values: OPEN_RECORD,
      requires: {
        base: shape({ optional: true, outputs: { values: OPEN_RECORD } }),
        parent: shape({ optional: true, outputs: { values: OPEN_RECORD } }),
        chain: shape({ optional: true, outputs: { values: OPEN_RECORD } }),
        upstream: shape({ optional: true, outputs: { values: OPEN_RECORD } }),
        members: shape({
          optional: true,
          binding: "map",
          outputs: { values: OPEN_RECORD },
        }),
      },
    },
    outputs: { values: OPEN_RECORD_MODEL },
    transform() {
      return { values: {} };
    },
  };
}

/** The model catalog every test engine uses; no test runs without a catalog. */
export function testCatalog(...plugins: readonly PluginDefinition[]): PluginCatalog {
  const catalog = new PluginCatalog({ models: testModels });
  catalog.register({ plugins: plugins });
  return catalog;
}

/** The default builder for a test runtime; one catalog owns both the engine and its graph. */
export function testGraphBuilder(...plugins: readonly PluginDefinition[]): GraphBuilder {
  return new IncrementalGraphBuilder(testCatalog(...plugins));
}

/** An engine with the test catalog unless the caller supplies one. */
export function testEngine(
  options: Omit<EngineOptions, "plugins"> & { readonly plugins?: PluginCatalog },
): Engine {
  return new Engine({ ...options, plugins: options.plugins ?? testCatalog() });
}

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
      chain: shape({
        optional: true,
        outputs: { values: { kind: "table", schema: { row: { fields: {} } } } },
      }),
    },
  },
  outputs: { values: FIXTURE_OUT_1 },
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
  const registry = new PluginCatalog({ models: testModels });
  registry.register({
    plugins: [
      transformPlugin,
      fkPlugin,
      ikPlugin,
      transform3dPlugin,
      fk3dPlugin,
      ik3dPlugin,
      GRAPH_EDGE_PLUGIN,
      ...additional,
    ],
  });
  return registry;
}
