import { describe, expect, it } from "vitest";
import { shape } from "../../../src/contract/slot-spec";
import { defineModel, type PluginDefinition, type ValueSpec } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { testModels } from "../../support/test-models";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" } } } },
};

const PointModel = defineModel<unknown, { readonly ids: readonly string[] }>({
  id: "PointModel",
  spec: POINT,
  parse(value) {
    return {
      ok: true,
      value: { ids: Array.isArray(value) ? value.map((row) => row.id) : [] },
    };
  },
});

const PLUGIN: PluginDefinition = {
  id: "probe",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      body: PointModel,
      extra: shape({ outputs: { values: POINT }, optional: true }),
    },
  },
  outputs: { values: POINT },
  transform() {
    return { values: [] };
  },
};

describe("catalog describe", () => {
  it("reports declared model and shape slots without exposing the definition", () => {
    const catalog = new PluginCatalog({ models: testModels });
    catalog.register(PLUGIN);

    const description = catalog.describe("probe");
    expect(description?.id).toBe("probe");
    expect(description?.outputs).toEqual({ values: POINT });
    expect(description?.requires.body).toEqual({
      kind: "model",
      modelId: "PointModel",
      binding: "single",
    });
    expect(description?.requires.extra).toEqual({
      kind: "shape",
      outputs: { values: POINT },
      optional: true,
      binding: "single",
    });
    expect(catalog.describe("missing")).toBeUndefined();
  });
});
