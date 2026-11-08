import { describe, expect, it } from "vitest";
import { PluginAdmissionError, PluginCatalog } from "@motion5/core";
import { Spec, defineModel, definePlugin } from "@motion5/core/plugin-api";
import { listCatalog, loadBuiltinCatalog, parseCatalogArgs } from "../src/engine/catalog";
import { parseSampleArgs, printableSample, type SampleResult } from "../src/engine/sample";

const Out = defineModel({ id: "OutputFixture", spec: Spec.record({ n: Spec.number() }) });

function described(description: unknown) {
  return {
    id: "described",
    inputs: {
      param: Spec.record({
        height: { kind: "number", min: 0, description } as never,
      }),
    },
    outputs: { values: Out },
    transform: () => ({ values: { n: 1 } }),
  };
}

describe("a param description", () => {
  it("is shown by the catalog", () => {
    const plugin = definePlugin({
      id: "described",
      inputs: {
        param: Spec.record({
          height: Spec.number({ min: 0, description: "Peak of the first flight, in px." }),
        }),
      },
      outputs: { values: Out },
      transform: () => ({ values: { n: 1 } }),
    });
    const listing = listCatalog(new PluginCatalog({ plugins: [plugin] }));
    expect(listing.plugins[0]?.param?.fields.height).toEqual({
      kind: "number",
      min: 0,
      description: "Peak of the first flight, in px.",
    });
  });

  it.each([[""], [3], ["x".repeat(121)]])("is refused at admission when it is %j", (text) => {
    expect(() => new PluginCatalog({ plugins: [described(text)] as never })).toThrow(
      PluginAdmissionError,
    );
  });

  it("is given for every param of every move", async () => {
    const listing = listCatalog(await loadBuiltinCatalog(), ["drop", "hop", "wipe"]);
    for (const plugin of listing.plugins)
      for (const [name, field] of Object.entries(plugin.param?.fields ?? {}))
        expect(field.description, `${plugin.id}.${name}`).toMatch(/\S/);
  });
});

describe("motion:catalog --plugins", () => {
  it("lists only the named plugins and the models they require", async () => {
    const catalog = await loadBuiltinCatalog();
    const listing = listCatalog(catalog, ["bezier", "hop"]);
    expect(listing.plugins.map(({ id }) => id)).toEqual(["bezier", "hop"]);
    expect(listing.models.map(({ id }) => id)).toEqual(["CubicPath2d"]);
  });

  it("reads its argument and refuses an unknown flag or an empty list", () => {
    expect(parseCatalogArgs([])).toEqual({ kind: "all" });
    expect(parseCatalogArgs(["--plugins", "hop,drop"])).toEqual({
      kind: "plugins",
      ids: ["hop", "drop"],
    });
    expect(parseCatalogArgs(["--plugins"]).kind).toBe("usage");
    expect(parseCatalogArgs(["--models"]).kind).toBe("usage");
  });

  it("refuses an id the catalog does not hold, by name", async () => {
    const catalog = await loadBuiltinCatalog();
    expect(() => listCatalog(catalog, ["hop", "nope"])).toThrow(/nope/);
  });
});

describe("motion:sample --fields", () => {
  const result: SampleResult = {
    kind: "accepted",
    diagnostics: [],
    samples: [
      {
        at: 0,
        nodes: {
          "m/dot": {
            status: "ready",
            progress: 0,
            outputs: { values: { x: 1, y: 2, scaleY: 1 }, contact: { hits: 0, justHit: 0 } },
            diagnostics: [],
          },
          "m/rows": {
            status: "ready",
            progress: 0,
            outputs: { values: [{ id: "a", cells: { y: 3, z: 4 } }] },
            diagnostics: [],
          },
        },
      },
    ],
  };

  it("keeps only the named fields, in records and table rows", () => {
    expect(printableSample(result, ["y"])).toEqual({
      kind: "accepted",
      samples: [
        {
          at: 0,
          nodes: {
            "m/dot": { status: "ready", progress: 0, outputs: { values: { y: 2 }, contact: {} } },
            "m/rows": {
              status: "ready",
              progress: 0,
              outputs: { values: [{ id: "a", cells: { y: 3 } }] },
            },
          },
        },
      ],
    });
  });

  it("drops empty diagnostics even with no field filter", () => {
    expect(JSON.stringify(printableSample(result))).not.toContain("diagnostics");
  });

  it("is read by the argument parser", () => {
    expect(parseSampleArgs(["p.json", "--at", "0", "--fields", "y,scaleY"])).toMatchObject({
      kind: "ok",
      fields: ["y", "scaleY"],
    });
    expect(parseSampleArgs(["p.json", "--at", "0", "--fields"]).kind).toBe("usage");
  });
});
