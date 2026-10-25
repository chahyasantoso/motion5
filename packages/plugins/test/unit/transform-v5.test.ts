import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { transformPlugin } from "../../src/transform";

describe("identified 2D transform plugin", () => {
  it("declares one dependency and preserves source row identity", () => {
    const catalog = new PluginCatalog();
    catalog.register(transformPlugin);

    expect(catalog.get("transform")).toBeDefined();
    expect(transformPlugin.inputs.requires?.data).toBeDefined();
    expect(transformPlugin.outputs).toEqual({
      values: {
        kind: "table",
        schema: { row: { fields: { x: { kind: "number" }, y: { kind: "number" } } } },
      },
    });

    const output = transformPlugin.transform(
      {
        values: { dx: 10, dy: 5 },
        requires: {
          data: {
            values: [
              { id: "point-a", cells: { x: 50, y: 20 } },
              { id: "point-b", cells: { x: 200, y: 40 } },
            ],
          },
        },
      },
      { nodeId: "demo/shifted-points", progress: 0.5 },
    );

    expect(output).toEqual({
      values: [
        { id: "point-a", cells: { x: 60, y: 25 } },
        { id: "point-b", cells: { x: 210, y: 45 } },
      ],
    });
    expect(Object.keys(output)).toEqual(["values"]);
    expect(output).not.toHaveProperty("dx");
    expect(output).not.toHaveProperty("dy");
  });
});
