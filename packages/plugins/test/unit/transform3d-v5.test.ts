import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { transform3dPlugin } from "../../src/transform3d";

describe("identified 3D transform plugin", () => {
  it("declares one dependency and preserves source row identity", () => {
    const catalog = new PluginCatalog();
    catalog.register(transform3dPlugin);

    expect(catalog.get("transform3d")).toBeDefined();
    expect(transform3dPlugin.inputs.requires?.data).toBeDefined();
    expect(transform3dPlugin.outputs).toEqual({
      values: {
        kind: "table",
        schema: {
          row: {
            fields: {
              x: { kind: "number" },
              y: { kind: "number" },
              z: { kind: "number" },
            },
          },
        },
      },
    });

    const output = transform3dPlugin.transform(
      {
        values: { dx: 10, dy: 5, dz: -2 },
        requires: {
          data: {
            values: [
              { id: "point-a", cells: { x: 50, y: 20, z: 4 } },
              { id: "point-b", cells: { x: 200, y: 40, z: 8 } },
            ],
          },
        },
      },
      { nodeId: "demo/shifted-points", progress: 0.5 },
    );

    expect(output).toEqual({
      values: [
        { id: "point-a", cells: { x: 60, y: 25, z: 2 } },
        { id: "point-b", cells: { x: 210, y: 45, z: 6 } },
      ],
    });
    expect(Object.keys(output)).toEqual(["values"]);
    expect(output).not.toHaveProperty("rotations3d");
  });
});
