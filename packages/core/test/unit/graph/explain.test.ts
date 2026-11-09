import { describe, expect, it } from "vitest";
import type { PluginDefinition, ProjectDefinition, ValueSpec } from "../../../src/contract/v5";
import { defineModel } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { explain } from "../../../src/graph/explain";
import { testModels } from "../../support/test-models";
import { Spec } from "../../../src/contract/spec-builder";

const POINT: ValueSpec = Spec.table({ x: Spec.number() });
const POINT_MODEL = defineModel({ id: "PointOut", spec: POINT });

const PointSource = defineModel<unknown, { readonly ids: readonly string[] }>({
  id: "PointSource",
  spec: POINT,
  parse(value) {
    return {
      ok: true,
      value: { ids: Array.isArray(value) ? value.map((row) => row.id) : [] },
    };
  },
});

const CONSUMER: PluginDefinition = {
  id: "consume",
  inputs: {
    values: Spec.record({}),
    requires: { data: PointSource },
  },
  outputs: { values: POINT_MODEL },
  transform() {
    return { values: [] };
  },
};

function catalog(): PluginCatalog {
  const result = new PluginCatalog({ models: [...testModels, PointSource] });
  result.register({ plugins: [CONSUMER] });
  return result;
}

function project(model = "PointSource"): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "demo",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "points",
            input: { values: [{ id: "a", cells: { x: 1 } }] },
            output: { model },
          },
          {
            id: "consumer",
            output: { plugin: "consume" },
            input: { values: {}, requires: { data: "points" } },
          },
        ],
      },
    ],
  };
}

describe("explain", () => {
  it("reports a matching model edge as compatible", () => {
    const report = explain(project(), catalog());
    expect(report.diagnostics).toEqual([]);
    expect(report.nodes.find((node) => node.nodeId === "demo/consumer")?.output).toEqual({
      plugin: "consume",
    });
    const consumer = report.nodes.find((node) => node.nodeId === "demo/consumer");
    expect(consumer?.slots).toEqual([
      {
        slot: "data",
        kind: "model",
        requires: ["PointSource"],
        sources: ["demo/points"],
        outcome: "compatible",
      },
    ]);
    expect(report.lines).toContain("demo/consumer [model:PointSource] <- demo/points: compatible");
  });

  it("reports a different model as incompatible", () => {
    const report = explain(project("TestTable"), catalog());
    expect(report.diagnostics.map(({ ruleId }) => ruleId)).toContain("slot-model-unsatisfied");
    const consumer = report.nodes.find((node) => node.nodeId === "demo/consumer");
    expect(consumer?.slots[0]?.outcome).toBe("incompatible");
  });

  it("reports a model slot edge as compatible or incompatible", () => {
    const bodyModel = defineModel({
      id: "Body2d",
      spec: POINT,
    });
    const modelConsumer: PluginDefinition = {
      id: "consume-model",
      inputs: {
        values: Spec.record({}),
        requires: { body: bodyModel },
      },
      outputs: { values: POINT_MODEL },
      transform() {
        return { values: [] };
      },
    };
    const cat = new PluginCatalog({ models: [bodyModel] });
    cat.register({ plugins: [modelConsumer] });

    const validProject: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "demo",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "source",
              output: { model: "Body2d" },
              input: { values: [{ id: "a", cells: { x: 1 } }] },
            },
            {
              id: "consumer",
              output: { plugin: "consume-model" },
              input: { values: {}, requires: { body: "source" } },
            },
          ],
        },
      ],
    };
    const report = explain(validProject, cat);
    expect(report.diagnostics).toEqual([]);
    expect(report.nodes.find((node) => node.nodeId === "demo/source")?.output).toEqual({
      model: "Body2d",
    });
    const consumer = report.nodes.find((node) => node.nodeId === "demo/consumer");
    expect(consumer?.slots).toEqual([
      {
        slot: "body",
        kind: "model",
        requires: ["Body2d"],
        sources: ["demo/source"],
        outcome: "compatible",
      },
    ]);
    expect(report.lines).toContain("demo/consumer [model:Body2d] <- demo/source: compatible");
  });
});
