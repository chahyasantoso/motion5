import { describe, expect, it } from "vitest";
import { Spec, PluginCatalog, type PluginDefinition } from "@motion5/core/plugin-api";
import { builtinCatalog } from "../../../src/host/builtin-catalog";
import { createPluginLoader } from "../../../src/host/loader";
import { builtinModels } from "../../../src/models/index";
import { testModels } from "../../../../core/test/support/test-models";
import { defineModel } from "@motion5/core/plugin-api";

const FIXTURE_OUT_1 = defineModel({
  id: "FixtureOut1",
  spec: Spec.record({ value: Spec.number() }),
});

const MINIMAL_PLUGIN: PluginDefinition = {
  id: "slice-a-test",
  inputs: {
    values: Spec.record({ value: Spec.number() }),
  },
  outputs: {
    values: FIXTURE_OUT_1,
  },
  transform({ values }) {
    return { values };
  },
};

describe("identified plugin boundary", () => {
  it("contains the migrated identified transform definitions", async () => {
    expect([...builtinCatalog.keys()]).toEqual([
      "transform",
      "transform3d",
      "ik",
      "ik3d",
      "fk",
      "fk3d",
      "anchorsToCubic",
      "bezier",
      "skinAnchors",
      "drop",
      "hop",
      "wipe",
    ]);
    const descriptor = builtinCatalog.get("transform");
    expect(descriptor).toBeDefined();
    const definition = await descriptor?.load();
    expect(definition?.id).toBe("transform");
    expect(definition).not.toHaveProperty("name");
  });

  it("admits one identified definition through the v5 catalog atomically", () => {
    const catalog = new PluginCatalog({ models: testModels });

    catalog.register({ plugins: [MINIMAL_PLUGIN] });

    expect(catalog.size).toBe(1);
    expect(catalog.get("slice-a-test")?.id).toBe("slice-a-test");
  });

  it("loads the path plugins a project names through the builtin catalog", async () => {
    const registry = new PluginCatalog({ models: [...builtinModels] });
    const result = await createPluginLoader(builtinCatalog).ensure(registry, {
      kind: "project",
      project: {
        schemaVersion: 5,
        motions: [
          {
            id: "m",
            trigger: { type: "manual" },
            tracks: [
              { id: "outline", output: { model: "Anchors2d" } },
              {
                id: "path",
                output: { plugin: "anchorsToCubic" },
                input: { requires: { anchors: "outline" } },
              },
              {
                id: "card",
                output: { plugin: "bezier" },
                input: { requires: { path: "path" } },
              },
            ],
          },
        ],
      },
    });
    expect(result).toEqual({ kind: "ensured", added: ["anchorsToCubic", "bezier"] });
    expect(registry.isPluginAdmitted("anchorsToCubic")).toBe(true);
    expect(registry.isPluginAdmitted("bezier")).toBe(true);
  });
});
