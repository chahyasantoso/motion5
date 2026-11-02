import { describe, expect, it } from "vitest";
import { shape, typed } from "../../../src/contract/slot-spec";
import type {
  DataType,
  Parsed,
  PluginDefinition,
  Structure,
  Value,
  ValueSpec,
} from "../../../src/contract/v5";
import { PluginCatalog } from "../../../src/domain/plugin-catalog";

const POINT: ValueSpec = {
  kind: "table",
  schema: { row: { fields: { x: { kind: "number" } } } },
};

const pointType: DataType<{ readonly ids: readonly string[] }, Value> = {
  id: "point2d",
  spec: POINT,
  parse(value: Value): Parsed<{ readonly ids: readonly string[] }> {
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

const PLUGIN: PluginDefinition = {
  id: "probe",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: {
      body: typed(pointType),
      extra: shape({ outputs: { values: POINT }, optional: true }),
    },
  },
  outputs: { values: POINT },
  transform() {
    return { values: [] };
  },
};

describe("catalog describe", () => {
  it("reports declared typed and shape slots without exposing the definition", () => {
    const catalog = new PluginCatalog();
    catalog.register(PLUGIN);

    const description = catalog.describe("probe");
    expect(description?.id).toBe("probe");
    expect(description?.outputs).toEqual({ values: POINT });
    expect(description?.requires.body).toEqual({
      kind: "typed",
      typeId: "point2d",
      spec: POINT,
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
