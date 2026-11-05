import { describe, expect, it } from "vitest";
import { typed } from "../../../src/contract/slot-spec";
import type {
  DataType,
  DataTypeParsed,
  PluginDefinition,
  ProjectDefinition,
  Structure,
  Value,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { explain } from "../../../src/graph/explain";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" } } } },
};

const pointType: DataType<{ readonly ids: readonly string[] }, Value> = {
  id: "point2d",
  spec: POINT,
  parse(value: Value): DataTypeParsed<{ readonly ids: readonly string[] }> {
    return {
      kind: "parsed",
      structure: { ids: Array.isArray(value) ? value.map((row) => row.id) : [] },
      warnings: [],
    };
  },
  bind(structure: Structure<{ readonly ids: readonly string[] }>, value: Value): Value {
    void structure;
    return value;
  },
};

const CONSUMER: PluginDefinition = {
  id: "consume",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: { data: typed(pointType) },
  },
  outputs: { values: POINT },
  transform() {
    return { values: [] };
  },
};

function catalog(): PluginCatalog {
  const result = new PluginCatalog();
  result.register(CONSUMER);
  return result;
}

function project(sourceType?: string): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "points",
            ...(sourceType === undefined ? {} : { type: sourceType }),
            input: { values: [{ id: "a", cells: { x: 1 } }] },
          },
          {
            id: "consumer",
            plugin: "consume",
            input: { values: {}, requires: { data: "points" } },
          },
        ],
      },
    ],
  };
}

describe("explain", () => {
  it("reports a matching typed edge as compatible", () => {
    const report = explain(project("point2d"), catalog());
    expect(report.diagnostics).toEqual([]);
    const consumer = report.nodes.find((node) => node.nodeId === "demo/consumer");
    expect(consumer?.slots).toEqual([
      {
        slot: "data",
        kind: "typed",
        requires: ["point2d"],
        sources: ["demo/points"],
        outcome: "compatible",
      },
    ]);
    expect(report.lines).toContain("demo/consumer [typed:point2d] <- demo/points: compatible");
  });

  it("reports a generic source as a type mismatch", () => {
    const report = explain(project(), catalog());
    expect(report.diagnostics.map(({ ruleId }) => ruleId)).toContain("slot-type-mismatch");
    const consumer = report.nodes.find((node) => node.nodeId === "demo/consumer");
    expect(consumer?.slots[0]?.outcome).toBe("incompatible");
  });
});
