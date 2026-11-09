import { describe, expect, it } from "vitest";
import {
  defineModel,
  ok,
  PluginAdmissionError,
  PluginCatalog,
  type Model,
  type PluginDefinition,
} from "../../../src/plugin-api";
import type { PluginCatalogOptions } from "../../../src/domain/plugin-catalog";
import { Spec } from "../../../src/contract/spec-builder";

describe("model admission", () => {
  it("refuses a main output that is a plain spec or absent, and admits a plain secondary", () => {
    const spec = Spec.record({ x: Spec.number() });
    const main = defineModel({ id: "MainOutput", spec });
    const transform = () => ({});
    const refusal = (outputs: unknown): string | undefined => {
      const batch: unknown = { plugins: [{ id: "p", inputs: {}, outputs, transform }] };
      try {
        new PluginCatalog(batch as PluginCatalogOptions);
        return undefined;
      } catch (error) {
        return error instanceof PluginAdmissionError ? error.ruleId : "other";
      }
    };
    expect(refusal({ values: spec })).toBe("plugin-values-model-required");
    expect(refusal({ other: main })).toBe("plugin-values-model-required");
    expect(refusal({ values: main, inspect: spec })).toBeUndefined();
  });

  it("refuses two distinct model objects under one id atomically", () => {
    const modelA = defineModel({
      id: "Body2d",
      spec: Spec.record({ x: Spec.number() }),
    });
    const modelB = defineModel({
      id: "Body2d",
      spec: Spec.record({ y: Spec.number() }),
    });
    const catalog = new PluginCatalog();
    expect(() => catalog.register({ models: [modelA, modelB] })).toThrow(PluginAdmissionError);
    expect(catalog.model("Body2d")).toBeUndefined();
    expect(catalog.hasModel("Body2d")).toBe(false);
  });

  it("refuses a plugin implementing one model on two outputs", () => {
    const solved = defineModel({
      id: "Solved2d",
      spec: Spec.record({ x: Spec.number() }),
    });
    const plugin: PluginDefinition = {
      id: "ik",
      inputs: {
        values: Spec.record({ flip: Spec.boolean() }),
      },
      outputs: {
        values: solved,
        secondary: solved,
      },
      transform: () => ({ values: { x: 1 }, secondary: { x: 2 } }),
    };
    const catalog = new PluginCatalog();
    expect(() => catalog.register({ plugins: [plugin] })).toThrow(PluginAdmissionError);
    expect(catalog.has("ik")).toBe(false);
    expect(catalog.hasModel("Solved2d")).toBe(false);
  });

  it("resolves prototype property names to undefined and refuses them as invalid ids", () => {
    const catalog = new PluginCatalog();
    expect(catalog.model("__proto__")).toBeUndefined();
    expect(catalog.model("constructor")).toBeUndefined();
    expect(catalog.hasModel("__proto__")).toBe(false);
    expect(catalog.hasModel("constructor")).toBe(false);

    const protoModel: Model<unknown, unknown> = {
      id: "__proto__",
      spec: Spec.record({ x: Spec.number() }),
    };
    try {
      catalog.register({ models: [protoModel] });
      expect.unreachable();
    } catch (err) {
      expect(err).toBeInstanceOf(PluginAdmissionError);
      if (err instanceof PluginAdmissionError) {
        expect(err.ruleId).toBe("model-id-invalid");
      }
    }
  });

  it("admits models with and without parse", () => {
    const withParse = defineModel({
      id: "Body2d",
      spec: Spec.record({ count: Spec.number() }),
      parse: (value) => ok(value),
    });
    const withoutParse = defineModel({
      id: "Point2d",
      spec: Spec.record({ x: Spec.number() }),
    });
    const catalog = new PluginCatalog({ models: [withParse, withoutParse] });
    expect(catalog.model("Body2d")).toBe(withParse);
    expect(catalog.model("Point2d")).toBe(withoutParse);
    expect(catalog.hasModel("Body2d")).toBe(true);
    expect(catalog.hasModel("Point2d")).toBe(true);
  });

  it("admits a model named by no plugin from the explicit models list", () => {
    const camera = defineModel({
      id: "Camera",
      spec: Spec.record({ zoom: Spec.number() }),
    });
    const catalog = new PluginCatalog({ models: [camera] });
    expect(catalog.model("Camera")).toBe(camera);
    expect(catalog.modelIds()).toContain("Camera");
    expect(catalog.models()).toContain(camera);
  });

  it("refuses model ids that are not PascalCase as model-id-invalid", () => {
    const invalidIds = ["body2d", "2dBody", "my_model", "Body-2d"];
    for (const id of invalidIds) {
      const catalog = new PluginCatalog();
      const model: Model<unknown, unknown> = {
        id,
        spec: Spec.record({ x: Spec.number() }),
      };
      try {
        catalog.register({ models: [model] });
        expect.unreachable();
      } catch (err) {
        expect(err).toBeInstanceOf(PluginAdmissionError);
        if (err instanceof PluginAdmissionError) {
          expect(err.ruleId).toBe("model-id-invalid");
        }
      }
    }
  });

  it("resolves lowercase model lookups to undefined", () => {
    const body = defineModel({
      id: "Body2d",
      spec: Spec.record({ x: Spec.number() }),
    });
    const catalog = new PluginCatalog({ models: [body] });
    expect(catalog.model("body2d")).toBeUndefined();
    expect(catalog.hasModel("body2d")).toBe(false);
  });
});
