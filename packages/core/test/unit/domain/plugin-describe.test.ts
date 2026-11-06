import { describe, expect, it } from "vitest";
import { shape } from "../../../src/contract/slot-spec";
import { defineModel, type PluginDefinition, type ValueSpec } from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";
import { testModels } from "../../support/test-models";
import { Spec } from "../../../src/contract/spec-builder";

const POINT: ValueSpec = Spec.table({ x: Spec.number() });
const POINT_MODEL = defineModel({ id: "PointOut", spec: POINT });

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
    values: Spec.record({}),
    requires: {
      body: PointModel,
      extra: shape({ outputs: { values: POINT }, optional: true }),
    },
  },
  outputs: { values: POINT_MODEL },
  transform() {
    return { values: [] };
  },
};

const PARAM_ONLY: PluginDefinition = {
  id: "param-only",
  inputs: {
    param: Spec.record({ flip: Spec.boolean() }),
    requires: { body: PointModel },
  },
  outputs: { values: POINT_MODEL },
  transform() {
    return { values: [] };
  },
};

describe("catalog describe", () => {
  it("reports declared model and shape slots without exposing the definition", () => {
    const catalog = new PluginCatalog({ models: testModels });
    catalog.register({ plugins: [PLUGIN] });

    const description = catalog.describe("probe");
    expect(description?.id).toBe("probe");
    expect(description?.values).toEqual(Spec.record({}));
    expect(description?.param).toBeUndefined();
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

  it("omits values a plugin does not declare and reports its param", () => {
    const catalog = new PluginCatalog({ models: testModels });
    catalog.register({ plugins: [PARAM_ONLY] });

    const description = catalog.describe("param-only");
    expect(description?.values).toBeUndefined();
    expect(description?.param).toEqual(Spec.record({ flip: Spec.boolean() }));
  });
});
