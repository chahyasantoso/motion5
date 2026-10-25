import { describe, expect, it } from "vitest";
import { PluginCatalog, type IdentifiedPluginDefinition } from "@motion5/core/plugin-api";
import { identifiedCatalog } from "../../src/identified-catalog";

const MINIMAL_PLUGIN: IdentifiedPluginDefinition = {
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
  it("starts with no grouped definitions", () => {
    expect([...identifiedCatalog]).toEqual([]);
  });

  it("admits one identified definition through the v5 catalog atomically", () => {
    const catalog = new PluginCatalog();

    catalog.registerAll([MINIMAL_PLUGIN]);

    expect(catalog.size).toBe(1);
    expect(catalog.get("slice-a-test")?.id).toBe("slice-a-test");
  });
});
