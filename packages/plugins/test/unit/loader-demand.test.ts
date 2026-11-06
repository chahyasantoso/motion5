import { describe, expect, it } from "vitest";
import { PluginCatalog, type ProjectDefinition } from "@motion5/core";
import type { PluginDefinition } from "@motion5/core/plugin-api";
import { createPluginLoader } from "../../src/loader";

const PLUGIN: PluginDefinition<never> = {
  id: "demo",
  inputs: { values: { kind: "record", fields: {} } },
  outputs: { values: { kind: "record", fields: {} } },
  transform() {
    return { values: {} };
  },
};

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "m",
      trigger: { type: "manual" },
      tracks: [
        { id: "source", output: { model: "TestRecord" } },
        { id: "computed", output: { plugin: "demo" }, input: { values: {} } },
      ],
    },
  ],
};

function loader() {
  return createPluginLoader(new Map([["demo", { load: async () => PLUGIN }]]));
}

describe("plugin loader demand collection", () => {
  it("collects a project's plugin ids before any plugin is admitted", async () => {
    const registry = new PluginCatalog();
    const result = await loader().ensure(registry, { kind: "project", project: PROJECT });
    expect(result).toEqual({ kind: "ensured", added: ["demo"] });
    expect(registry.isPluginAdmitted("demo")).toBe(true);
  });

  it("collects plugin ids from a track list", async () => {
    const registry = new PluginCatalog();
    const result = await loader().ensure(registry, {
      kind: "tracks",
      tracks: PROJECT.motions[0]!.tracks,
    });
    expect(result).toEqual({ kind: "ensured", added: ["demo"] });
  });
});
