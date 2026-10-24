import { describe, expect, it } from "vitest";
import type { AuthoredValues, PluginDefinition, ValueSpec } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import {
  deriveCommittedContract,
  type CommittedContract,
} from "../../../src/graph/committed-contract";
import { buildGraphIR } from "../../../src/graph/ir";
import { project, record, row, table, track } from "../../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
const LAST_POINT: ValueSpec = {
  kind: "record",
  fields: { x: { kind: "number" }, y: { kind: "number" } },
};
const VALUES: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" } } } },
};
const PLUGIN_VALUES: ValueSpec = { kind: "record", fields: { dx: { kind: "number" } } };

function sourcePlugin(id: string, outputs: Readonly<Record<string, ValueSpec>>): PluginDefinition {
  return { id, inputs: { values: PLUGIN_VALUES }, outputs, transform: () => ({ values: [] }) };
}

function consumerPlugin(
  id: string,
  outputs: Readonly<Record<string, ValueSpec>>,
): PluginDefinition {
  return {
    id,
    inputs: { values: PLUGIN_VALUES, requires: { data: { outputs } } },
    outputs: { values: POINT },
    transform: () => ({ values: [] }),
  };
}

function catalog(...plugins: readonly PluginDefinition[]): PluginCatalog {
  const result = new PluginCatalog();
  result.registerAll(plugins);
  return result;
}

function source(id: string, values: AuthoredValues): ReturnType<typeof track> {
  return track({ id, values });
}

function consumer(
  id: string,
  pluginId: string,
  requires: Readonly<Record<string, string>> = { data: "points" },
): ReturnType<typeof track> {
  return track({ id, plugin: pluginId, values: record({ dx: 1 }), requires });
}

function carriedOf(built: ReturnType<typeof buildGraphIR>): Map<string, CommittedContract> {
  const carried = new Map<string, CommittedContract>();
  for (const node of built.graph?.nodes ?? [])
    if (node.contract !== undefined) carried.set(node.id, node.contract);
  return carried;
}

function rules(built: ReturnType<typeof buildGraphIR>): readonly string[] {
  return built.diagnostics.map(({ ruleId }) => ruleId);
}

describe("committed contract", () => {
  it("stores the contract inferred from a non-empty authored snapshot", () => {
    const built = buildGraphIR(
      {
        schemaVersion: 5,
        motions: [],
        freeTracks: [source("points", table(row("a", { x: 0, y: 1 })))],
      },
      catalog(),
    );

    expect(built.diagnostics).toEqual([]);
    const contract = built.graph?.nodeById["~/points"]?.contract;
    expect(contract?.input).toEqual({
      spec: {
        kind: "table",
        schema: {
          row: {
            fields: { x: { kind: "number" }, y: { kind: "number" } },
            additionalProperties: false,
          },
        },
      },
      proven: true,
    });
    expect(contract?.outputs.values).toBe(contract?.input);
    expect(contract?.slots).toEqual({});
  });

  it("stores a declared input.schema as declared, with authored-only flags removed", () => {
    const built = buildGraphIR(
      {
        schemaVersion: 5,
        motions: [],
        freeTracks: [
          track({
            id: "points",
            values: table(),
            schema: {
              kind: "table",
              schema: { row: { fields: { x: { kind: "number", static: true } } } },
            },
          }),
        ],
      },
      catalog(),
    );

    expect(built.diagnostics).toEqual([]);
    expect(built.graph?.nodeById["~/points"]?.contract?.input).toEqual({
      spec: { kind: "table", schema: { row: { fields: { x: { kind: "number" } } } } },
      proven: true,
    });
  });

  it("checks a typed consumer against the stored contract, not the current authored values", () => {
    const plugins = catalog(consumerPlugin("translate", { values: VALUES }));
    const full = project([
      source("points", table(row("a", { x: 0 }))),
      consumer("shifted", "translate"),
    ]);
    const accepted = buildGraphIR(full, plugins);
    expect(accepted.diagnostics).toEqual([]);
    const carried = carriedOf(accepted);

    const emptied = project([source("points", table()), consumer("shifted", "translate")]);
    expect(rules(buildGraphIR(emptied, plugins))).toContain("slot-unproven");

    const rebuilt = buildGraphIR(emptied, plugins, carried);
    expect(rebuilt.diagnostics).toEqual([]);
    expect(rebuilt.graph?.nodeById["demo/points"]?.contract).toBe(carried.get("demo/points"));
    expect(rebuilt.graph?.nodeById["demo/points"]?.track.input?.values).toEqual([]);
  });

  it("stores the plugin's local input, outputs and declared slots", () => {
    const built = buildGraphIR(
      project([track({ id: "points", plugin: "source-only", values: record({ dx: 1 }) })]),
      catalog(sourcePlugin("source-only", { values: POINT })),
    );

    expect(built.diagnostics).toEqual([]);
    const contract = built.graph?.nodeById["demo/points"]?.contract;
    expect(contract?.plugin).toBe("source-only");
    expect(contract?.input).toEqual({ spec: PLUGIN_VALUES, proven: true });
    expect(contract?.outputs).toEqual({ values: { spec: POINT, proven: true } });
    expect(contract?.slots).toEqual({});
    expect(contract?.requires).toEqual({});
  });

  it("reads committed requires for dependency admission", () => {
    const plugins = catalog(consumerPlugin("translate", { values: VALUES }));
    const bound = buildGraphIR(
      project([source("points", table(row("a", { x: 0 }))), consumer("shifted", "translate")]),
      plugins,
    );
    expect(bound.diagnostics).toEqual([]);

    const unbound = project([
      source("points", table(row("a", { x: 0 }))),
      consumer("shifted", "translate", {}),
    ]);
    expect(rules(buildGraphIR(unbound, plugins))).toContain("slot-required-missing");
    expect(buildGraphIR(unbound, plugins, carriedOf(bound)).diagnostics).toEqual([]);
  });

  it("ignores a carried contract that names a different plugin", () => {
    const first = buildGraphIR(
      project([track({ id: "points", plugin: "first", values: record({ dx: 1 }) })]),
      catalog(sourcePlugin("first", { values: POINT })),
    );
    const carried = carriedOf(first);

    const second = buildGraphIR(
      project([track({ id: "points", plugin: "second", values: record({ dx: 1 }) })]),
      catalog(sourcePlugin("second", { values: LAST_POINT })),
      carried,
    );

    expect(second.diagnostics).toEqual([]);
    expect(second.graph?.nodeById["demo/points"]?.contract?.plugin).toBe("second");
    expect(second.graph?.nodeById["demo/points"]?.contract?.outputs.values?.spec).toEqual(
      LAST_POINT,
    );
  });

  it("derives nothing for an unadmitted plugin", () => {
    const contract = deriveCommittedContract(
      track({ id: "points", plugin: "missing", values: record({ dx: 1 }) }),
      "demo/points",
      catalog(),
    );
    expect(contract).toBeUndefined();
  });
});
