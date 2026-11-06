import { describe, expect, it } from "vitest";
import type {
  AuthoredValues,
  Model,
  PluginDefinition,
  PluginOutputs,
  ProjectDefinition,
  ValueSpec,
} from "../../../src/contract/v5";
import { defineModel } from "../../../src/contract/v5";
import { shape } from "../../../src/contract/slot-spec";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { buildGraphIR } from "../../../src/graph/ir";
import { record, row, table, track } from "../../support/v5-builders";
import { testModels } from "../../support/test-models";
import { Spec } from "../../../src/contract/spec-builder";

const POINT: ValueSpec = Spec.table({ x: Spec.number(), y: Spec.number() });
const POINT_MODEL = defineModel({ id: "PointOut", spec: POINT });
const RECORD: ValueSpec = Spec.record({ x: Spec.number(), y: Spec.number() });
const VALUES: ValueSpec = Spec.table({ x: Spec.number() });
const PointTable = defineModel({
  id: "PointTable",
  spec: POINT,
});
const OtherTable = defineModel({
  id: "OtherTable",
  spec: Spec.table({ z: Spec.number() }),
});

const specModels = new Map<ValueSpec, Model>();
const FILLER: ValueSpec = Spec.record({});

function modelOf(spec: ValueSpec): Model {
  const known = specModels.get(spec);
  if (known !== undefined) return known;
  const made = defineModel({ id: `Spec${specModels.size + 1}`, spec });
  specModels.set(spec, made);
  return made;
}

function mainModelOutputs(outputs: Readonly<Record<string, ValueSpec>>): PluginOutputs {
  return { ...outputs, values: modelOf(outputs.values ?? FILLER) };
}

function producer(id: string, outputs: Readonly<Record<string, ValueSpec>>): PluginDefinition {
  return {
    id,
    inputs: { values: Spec.record({}) },
    outputs: mainModelOutputs(outputs),
    transform: () => ({ values: [] }),
  };
}

function plugin(
  id: string,
  outputs: Readonly<Record<string, ValueSpec>>,
  binding: "single" | "map" = "single",
): PluginDefinition {
  return {
    id,
    inputs: {
      values: Spec.record({ dx: Spec.number() }),
      requires: { data: shape({ outputs, binding }) },
    },
    outputs: { values: POINT_MODEL },
    transform() {
      return { values: [] };
    },
  };
}

function catalog(...plugins: readonly PluginDefinition[]): PluginCatalog {
  const result = new PluginCatalog({ models: [...testModels, PointTable, OtherTable] });
  result.register({ plugins: plugins });
  return result;
}

function source(id: string, values: AuthoredValues): ReturnType<typeof track> {
  return track({ id, values, model: Array.isArray(values) ? "PointTable" : "TestRecord" });
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
    model: "TestRecord",
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

  it("accepts a producer that does not publish an optional slot output", () => {
    const built = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0 }))),
        consumer("shifted", "translate", "points"),
      ),
      catalog(
        plugin("translate", {
          values: VALUES,
          inspect: Spec.record({}, { optional: true }),
        }),
      ),
    );

    expect(built.diagnostics).toEqual([]);
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
  it("accepts a declared empty source, whose fields are proven by the declaration", () => {
    const built = buildGraphIR(
      project(
        track({
          id: "empty",
          values: table(),
          model: "PointTable",
        }),
        consumer("shifted", "translate", "empty"),
      ),
      catalog(plugin("translate", { values: VALUES })),
    );

    expect(built.diagnostics).toEqual([]);
  });

  it("treats an optional producer output as unproven for a required slot output", () => {
    const plugins = catalog(
      {
        ...plugin("optional-source", { values: VALUES }),
        outputs: { values: modelOf({ ...VALUES, optional: true }) },
        inputs: { values: Spec.record({ dx: Spec.number() }) },
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

  it("refuses a producer field of the wrong kind", () => {
    const built = buildGraphIR(
      project(
        track({ id: "source", plugin: "producer", values: record({}) }),
        consumer("shifted", "translate", "source"),
      ),
      catalog(
        producer("producer", {
          values: Spec.table({ x: Spec.string() }),
        }),
        plugin("translate", { values: VALUES }),
      ),
    );

    expect(rules(built)).toContain("slot-incompatible");
    expect(built.diagnostics[0]?.message).toContain("string");
  });

  it("refuses an optional producer field where the slot requires it", () => {
    const built = buildGraphIR(
      project(
        track({ id: "source", plugin: "producer", values: record({}) }),
        consumer("shifted", "translate", "source"),
      ),
      catalog(
        producer("producer", {
          values: Spec.table({ x: Spec.number({ optional: true }) }),
        }),
        plugin("translate", { values: VALUES }),
      ),
    );

    expect(rules(built)).toContain("slot-incompatible");
  });

  it("refuses a producer that does not publish a required output", () => {
    const built = buildGraphIR(
      project(
        track({ id: "source", plugin: "producer", values: record({}) }),
        consumer("shifted", "translate", "source"),
      ),
      catalog(producer("producer", { values: VALUES }), plugin("translate", { pose: VALUES })),
    );

    expect(rules(built)).toContain("slot-incompatible");
    expect(built.diagnostics[0]?.message).toContain("does not publish");
  });

  it("checks map members independently and names the failing member", () => {
    const built = buildGraphIR(
      project(
        track({ id: "good", plugin: "good", values: record({}) }),
        track({ id: "bad", plugin: "bad", values: record({}) }),
        consumer("shifted", "translate", { good: "good", bad: "bad" }),
      ),
      catalog(
        producer("good", { values: VALUES }),
        producer("bad", {
          values: Spec.table({ x: Spec.string() }),
        }),
        {
          ...plugin("translate", { values: VALUES }),
          inputs: {
            values: Spec.record({ dx: Spec.number() }),
            requires: { data: shape({ outputs: { values: VALUES }, binding: "map" }) },
          },
        },
      ),
    );

    const mismatch = built.diagnostics.find(({ ruleId }) => ruleId === "slot-incompatible");
    expect(mismatch?.path).toContain(".data.bad.outputs.values");
  });

  it("refuses an unknown source model instead of treating it as unproven", () => {
    const plugins = new PluginCatalog();
    plugins.register({ plugins: [plugin("translate", { values: VALUES })] });
    const built = buildGraphIR(
      project(
        track({ id: "empty", values: table(), model: "UnknownModel" }),
        consumer("shifted", "translate", "empty"),
      ),
      plugins,
    );

    expect(built.graph?.nodeById["demo/empty"]?.contract).toBeUndefined();
  });

  it("rechecks when a source contract changes", () => {
    const plugins = catalog(plugin("translate", { values: VALUES }));
    const accepted = buildGraphIR(
      project(
        source("points", table(row("a", { x: 0, y: 1 }))),
        consumer("shifted", "translate", "points"),
      ),
      plugins,
    );
    expect(accepted.diagnostics).toEqual([]);

    const replaced = buildGraphIR(
      project(
        track({ id: "points", values: table(row("a", { z: 0 })), model: "OtherTable" }),
        consumer("shifted", "translate", "points"),
      ),
      plugins,
    );
    expect(rules(replaced)).toContain("slot-incompatible");
  });

  it("rechecks when a plugin output contract changes", () => {
    const accepted = buildGraphIR(
      project(
        track({ id: "source", plugin: "producer", values: record({}) }),
        consumer("shifted", "translate", "source"),
      ),
      catalog(producer("producer", { values: VALUES }), plugin("translate", { values: VALUES })),
    );
    expect(accepted.diagnostics).toEqual([]);

    const replaced = buildGraphIR(
      project(
        track({ id: "source", plugin: "producer", values: record({}) }),
        consumer("shifted", "translate", "source"),
      ),
      catalog(producer("producer", { values: RECORD }), plugin("translate", { values: VALUES })),
    );
    expect(rules(replaced)).toContain("slot-incompatible");
  });
});
