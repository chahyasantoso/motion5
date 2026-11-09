import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { PluginCatalog, type PluginDescription } from "@motion5/core";
import { Spec, defineModel, definePlugin } from "@motion5/core/plugin-api";
import { builtinModels } from "@motion5/plugins/models";
import { builtinCatalog } from "../../plugins/src/host/builtin-catalog";
import { listCatalog, loadBuiltinCatalog } from "../src/engine/catalog";

const Primary = defineModel({
  id: "CatalogFixturePrimary",
  spec: Spec.record({ x: Spec.number() }),
});
const Secondary = defineModel({
  id: "CatalogFixtureSecondary",
  spec: Spec.record({ x: Spec.number() }),
});

const fixture = definePlugin({
  id: "zeta",
  inputs: { param: Spec.record({ t: Spec.number({ min: 0, max: 5 }) }) },
  outputs: { values: Primary, extra: Secondary },
  transform: () => ({ values: { x: 1 }, extra: { x: 2 } }),
});

const other = definePlugin({
  id: "alpha",
  inputs: {},
  outputs: { values: Primary },
  transform: () => ({ values: { x: 1 } }),
});

function described(listing: ReturnType<typeof listCatalog>, id: string): PluginDescription {
  const found = listing.plugins.find((plugin) => plugin.id === id);
  if (found === undefined) throw new Error(`missing ${id}`);
  return found;
}

describe("motion catalog listing", () => {
  it("lists param limits and every named output", () => {
    const listing = listCatalog(new PluginCatalog({ plugins: [fixture] }));
    const entry = described(listing, "zeta");
    expect(entry.param).toMatchObject({
      kind: "record",
      fields: { t: { kind: "number", min: 0, max: 5 } },
    });
    expect(Object.keys(entry.outputs).sort()).toEqual(["extra", "values"]);
    expect(listing.models.map((model) => model.id)).toEqual([
      "CatalogFixturePrimary",
      "CatalogFixtureSecondary",
    ]);
  });

  it("sorts plugins and models by id", () => {
    const listing = listCatalog(new PluginCatalog({ plugins: [fixture, other] }));
    expect(listing.plugins.map((plugin) => plugin.id)).toEqual(["alpha", "zeta"]);
    const ids = listing.models.map((model) => model.id);
    expect(ids).toEqual([...ids].sort());
  });

  it("lists every builtin catalog key", async () => {
    const listing = listCatalog(await loadBuiltinCatalog());
    const listed = new Set(listing.plugins.map((plugin) => plugin.id));
    for (const key of builtinCatalog.keys()) expect(listed.has(key)).toBe(true);
  });

  it("lists every builtin model, including one no plugin names", async () => {
    const listed = new Set(listCatalog(await loadBuiltinCatalog()).models.map(({ id }) => id));
    for (const model of builtinModels) expect(listed.has(model.id)).toBe(true);
  });

  it("runs under real node and prints JSON naming bezier", () => {
    const out = execFileSync(process.execPath, ["packages/tools/bin/motion-catalog.mjs"], {
      cwd: process.cwd(),
      encoding: "utf8",
    });
    const parsed: { plugins: { id: string }[] } = JSON.parse(out);
    expect(parsed.plugins.map((plugin) => plugin.id)).toContain("bezier");
  });
});
