import { describe, expect, it } from "vitest";
import { PluginCatalog, type PluginDefinition } from "@motion5/core/plugin-api";
import { builtinCatalog } from "../../src/builtin-catalog";
import { createPluginLoader } from "../../src/loader";
import { builtinModels } from "../../src/models";
import { testModels } from "../../../core/test/support/test-models";

const MINIMAL_PLUGIN: PluginDefinition = {
  id: "slice-a-test",
  inputs: {
    values: { kind: "record", fields: { value: { kind: "number" } } },
  },
  outputs: {
    values: { kind: "record", fields: { value: { kind: "number" } } },
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
    ]);
    const descriptor = builtinCatalog.get("transform");
    expect(descriptor).toBeDefined();
    const definition = await descriptor?.load();
    expect(definition?.id).toBe("transform");
    expect(definition).not.toHaveProperty("name");
  });

  it("admits one identified definition through the v5 catalog atomically", () => {
    const catalog = new PluginCatalog({ models: testModels });

    catalog.registerAll([MINIMAL_PLUGIN]);

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
