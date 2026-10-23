import { describe, expect, it } from "vitest";
import type {
  AuthoredValues,
  PluginDefinition,
  ProjectDefinition,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { buildGraphIR } from "../../../src/graph/ir";
import { record, row, table, track } from "../../support/v5-builders";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};
const VALUES: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" } } } },
};

function plugin(
  id: string,
  outputs: Readonly<Record<string, ValueSpec>>,
  binding: "single" | "map" = "single",
): PluginDefinition {
  return {
    id,
    inputs: {
      values: { kind: "record", fields: { dx: { kind: "number" } } },
      requires: { data: { outputs, binding } },
    },
    outputs: { values: POINT },
    transform() {
      return { values: [] };
    },
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
  binding: string | Readonly<Record<string, string>>,
): ReturnType<typeof track> {
  return track({
    id,
    plugin: pluginId,
    values: record({ dx: 1 }),
    requires: { data: binding },
  });
}

function project(...tracks: readonly ReturnType<typeof track>[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "demo", trigger: { type: "manual" }, tracks }],
  };
}

function rules(built: ReturnType<typeof buildGraphIR>): readonly string[] {
  return built.diagnostics.map(({ ruleId }) => ruleId);
}

describe("load-time slot compatibility", () => {
  it("accepts an inferred numeric source against a matching values slot", () => {
    const built = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0, y: 1 }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(built.diagnostics).toEqual([]);
  });

  it("refuses a string column where the slot requires a number", () => {
    const built = buildGraphIR(
      project(
        source("points", table(row("a", { x: "zero" }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(rules(built)).toContain("slot-incompatible");
    expect(built.diagnostics.find(({ ruleId }) => ruleId === "slot-incompatible")?.path).toBe(
      "demo/shifted.input.requires.data.outputs.values",
    );
  });

  it("refuses an optional producer column where the slot requires it", () => {
    const built = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0 }), row("b", {}))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(rules(built)).toContain("slot-incompatible");
  });

  it("accepts a producer that does not publish an optional slot output", () => {
    const built = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0 }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(
        plugin("translate", {
          values: VALUES,
          inspect: { kind: "record", fields: {}, optional: true },
        }),
      ),
    );

    expect(built.diagnostics).toEqual([]);
  });

  it("refuses a producer that does not publish a required slot output", () => {
    const built = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0 }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(plugin("translate", { pose: VALUES })),
    );

    expect(rules(built)).toContain("slot-incompatible");
    expect(built.diagnostics[0]?.message).toContain("does not publish");
  });

  it("refuses a record producer where the slot requires a table", () => {
    const built = buildGraphIR(
      project(
        source("parameters", record({ x: 0, y: 1 })),
        consumer("shifted", "translate", "parameters"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(rules(built)).toContain("slot-incompatible");
    expect(built.diagnostics[0]?.message).toContain("table");
  });
  it("checks map members independently and names the failing member", () => {
    const built = buildGraphIR(
      project(
        source("upper", table(row("a", { x: 0 }))),
        source("lower", table(row("a", { x: "zero" }))),
        consumer("rig", "bones", { upperArm: "upper", forearm: "lower" }),
      ),
      catalog(plugin("bones", { values: VALUES }, "map")),
    );

    expect(rules(built)).toEqual(["slot-incompatible"]);
    expect(built.diagnostics[0]?.path).toBe("demo/rig.input.requires.data.forearm.outputs.values");
  });

  it("refuses an unproven required field from an empty undeclared source", () => {
    const built = buildGraphIR(
      project(source("empty", table()), consumer("shifted", "translate", "empty")),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(rules(built)).toContain("slot-unproven");
    expect(rules(built)).not.toContain("slot-incompatible");
  });

  it("accepts a declared empty source, whose fields are proven by the declaration", () => {
    const built = buildGraphIR(
      project(
        track({
          id: "empty",
          values: table(),
          schema: {
            kind: "table",
            schema: { row: { fields: { x: { kind: "number" } } } },
          },
        }),
        consumer("shifted", "translate", "empty"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(built.diagnostics).toEqual([]);
  });

  it("rechecks when a source contract changes", () => {
    const accepted = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0 }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );
    expect(accepted.diagnostics).toEqual([]);

    const refused = buildGraphIR(
      project(
        source("points", table(row("a", { x: "zero" }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );
    expect(rules(refused)).toContain("slot-incompatible");
  });

  it("treats an optional producer output as unproven for a required slot output", () => {
    const plugins = catalog(
      {
        ...plugin("optional-source", { values: VALUES }),
        outputs: { values: { ...VALUES, optional: true } },
        inputs: { values: { kind: "record", fields: { dx: { kind: "number" } } } },
      },
      plugin("translate", { values: VALUES }),
    );
    const built = buildGraphIR(
      project(
        track({
          id: "source",
          plugin: "optional-source",
          values: record({ dx: 1 }),
        }),
        consumer("shifted", "translate", "source"),
      ),
      plugins,
    );

    expect(rules(built)).toContain("slot-unproven");
  });
});

