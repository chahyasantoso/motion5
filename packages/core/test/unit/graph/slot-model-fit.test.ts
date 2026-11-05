import { describe, expect, it } from "vitest";
import { defineModel } from "../../../src/contract/v5";
import { optional, shape } from "../../../src/contract/slot-spec";
import type { PluginDefinition, ProjectDefinition, ValueSpec } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { buildGraphIR } from "../../../src/graph/ir";
import { explain } from "../../../src/graph/explain";

const SPEC_A: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
};

const Body2d = defineModel({
  id: "Body2d",
  spec: SPEC_A,
  legacyTypeId: "body2d",
});

const Mocap2d = defineModel({
  id: "Mocap2d",
  spec: SPEC_A,
});

const Solved2d = defineModel({
  id: "Solved2d",
  spec: SPEC_A,
});

describe("slot model fit", () => {
  it("accepts a producer implementing the required model", () => {
    const producer = {
      id: "producer-body",
      inputs: { values: { kind: "record", fields: {} } },
      outputs: { values: Body2d },
      transform: () => ({ values: [] }),
    };
    const consumer = {
      id: "consumer-body",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { chain: Body2d },
      },
      outputs: { values: SPEC_A },
      transform: () => ({ values: [] }),
    };
    const catalog = new PluginCatalog();
    catalog.register(producer);
    catalog.register(consumer);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            { id: "p", output: { plugin: "producer-body" }, input: { values: {} } },
            {
              id: "c",
              output: { plugin: "consumer-body" },
              input: { values: {}, requires: { chain: "p" } },
            },
          ],
        },
      ],
    };

    const built = buildGraphIR(project, catalog);
    expect(built.diagnostics).toEqual([]);
  });

  it("refuses a track whose plugin implements a different model with an identical shape", () => {
    const producer = {
      id: "producer-mocap",
      inputs: { values: { kind: "record", fields: {} } },
      outputs: { values: Mocap2d },
      transform: () => ({ values: [] }),
    };
    const consumer = {
      id: "consumer-body",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { chain: Body2d },
      },
      outputs: { values: SPEC_A },
      transform: () => ({ values: [] }),
    };
    const catalog = new PluginCatalog();
    catalog.register(producer);
    catalog.register(consumer);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            { id: "p", output: { plugin: "producer-mocap" }, input: { values: {} } },
            {
              id: "c",
              output: { plugin: "consumer-body" },
              input: { values: {}, requires: { chain: "p" } },
            },
          ],
        },
      ],
    };

    const built = buildGraphIR(project, catalog);
    const ruleIds = built.diagnostics.map((d) => d.ruleId);
    expect(ruleIds).toContain("slot-model-unsatisfied");
  });

  it("handles bare model slot and optional model", () => {
    const producerSolved = {
      id: "producer-solved",
      inputs: { values: { kind: "record", fields: {} } },
      outputs: { values: Solved2d },
      transform: () => ({ values: [] }),
    };
    const producerBody = {
      id: "producer-body",
      inputs: { values: { kind: "record", fields: {} } },
      outputs: { values: Body2d },
      transform: () => ({ values: [] }),
    };
    const consumerOptional = {
      id: "consumer-optional",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { solved: optional(Solved2d) },
      },
      outputs: { values: SPEC_A },
      transform: () => ({ values: [] }),
    };
    const catalog = new PluginCatalog();
    catalog.register(producerSolved);
    catalog.register(producerBody);
    catalog.register(consumerOptional);

    const projectUnbound: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [{ id: "c", output: { plugin: "consumer-optional" }, input: { values: {} } }],
        },
      ],
    };
    expect(buildGraphIR(projectUnbound, catalog).diagnostics).toEqual([]);

    const projectBoundCompatible: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            { id: "p", output: { plugin: "producer-solved" }, input: { values: {} } },
            {
              id: "c",
              output: { plugin: "consumer-optional" },
              input: { values: {}, requires: { solved: "p" } },
            },
          ],
        },
      ],
    };
    expect(buildGraphIR(projectBoundCompatible, catalog).diagnostics).toEqual([]);

    const projectBoundMismatched: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            { id: "p", output: { plugin: "producer-body" }, input: { values: {} } },
            {
              id: "c",
              output: { plugin: "consumer-optional" },
              input: { values: {}, requires: { solved: "p" } },
            },
          ],
        },
      ],
    };
    const builtMismatch = buildGraphIR(projectBoundMismatched, catalog);
    expect(builtMismatch.diagnostics.map((d) => d.ruleId)).toContain("slot-model-unsatisfied");
  });

  it("still compares shape slots by spec", () => {
    const producerShape = {
      id: "producer-shape",
      inputs: { values: { kind: "record", fields: {} } },
      outputs: { values: SPEC_A },
      transform: () => ({ values: [] }),
    };
    const consumerShape = {
      id: "consumer-shape",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { data: shape({ outputs: { values: SPEC_A } }) },
      },
      outputs: { values: SPEC_A },
      transform: () => ({ values: [] }),
    };
    const catalog = new PluginCatalog();
    catalog.register(producerShape);
    catalog.register(consumerShape);

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            { id: "p", output: { plugin: "producer-shape" }, input: { values: {} } },
            {
              id: "c",
              output: { plugin: "consumer-shape" },
              input: { values: {}, requires: { data: "p" } },
            },
          ],
        },
      ],
    };

    const built = buildGraphIR(project, catalog);
    expect(built.diagnostics).toEqual([]);
  });

  it("satisfies a model slot by model id", () => {
    const consumer = {
      id: "consumer-bridge",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { chain: Body2d },
      },
      outputs: { values: SPEC_A },
      transform: () => ({ values: [] }),
    };
    const catalog = new PluginCatalog({ models: [Mocap2d] });
    catalog.register(consumer);

    const projectMatching: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "data-track",
              output: { model: "Body2d" },
              input: { values: [{ id: "row1", cells: { x: 1, y: 2 } }] },
            },
            {
              id: "c",
              output: { plugin: "consumer-bridge" },
              input: { values: {}, requires: { chain: "data-track" } },
            },
          ],
        },
      ],
    };
    expect(buildGraphIR(projectMatching, catalog).diagnostics).toEqual([]);

    const projectMismatched: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "data-track",
              output: { model: "Mocap2d" },
              input: { values: [{ id: "row1", cells: { x: 1, y: 2 } }] },
            },
            {
              id: "c",
              output: { plugin: "consumer-bridge" },
              input: { values: {}, requires: { chain: "data-track" } },
            },
          ],
        },
      ],
    };
    const builtMismatch = buildGraphIR(projectMismatched, catalog);
    expect(builtMismatch.diagnostics.map((d) => d.ruleId)).toContain("slot-model-unsatisfied");
  });

  it("reports model contracts in describe and explain", () => {
    const consumer = {
      id: "consumer-describe",
      inputs: {
        values: { kind: "record", fields: {} },
        requires: { chain: Body2d },
      },
      outputs: { values: Body2d },
      transform: () => ({ values: [] }),
    };
    const catalog = new PluginCatalog();
    catalog.register(consumer);

    const desc = catalog.describe("consumer-describe");
    expect(desc?.requires.chain).toEqual({
      kind: "model",
      modelId: "Body2d",
      binding: "single",
    });

    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "m",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "source-track",
              output: { model: "Body2d" },
              input: { values: [{ id: "r1", cells: { x: 1, y: 2 } }] },
            },
            {
              id: "c",
              output: { plugin: "consumer-describe" },
              input: { values: {}, requires: { chain: "source-track" } },
            },
          ],
        },
      ],
    };

    const report = explain(project, catalog);
    const consumerNode = report.nodes.find((n) => n.nodeId === "m/c");
    expect(consumerNode?.slots).toEqual([
      {
        slot: "chain",
        kind: "model",
        requires: ["Body2d"],
        sources: ["m/source-track"],
        outcome: "compatible",
      },
    ]);
  });
});
