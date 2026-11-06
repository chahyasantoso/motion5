import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { transform3dPlugin } from "../../../src/transform/transform3d";
import { Points3d } from "../../../src/models/index";
import { testModels } from "../../../../core/test/support/test-models";

describe("identified 3D transform plugin", () => {
  it("declares one dependency and preserves source row identity", () => {
    const catalog = new PluginCatalog({ models: testModels });
    catalog.register({ plugins: [transform3dPlugin] });

    expect(catalog.get("transform3d")).toBeDefined();
    expect(transform3dPlugin.inputs.requires?.data).toBeDefined();
    expect(transform3dPlugin.outputs).toEqual({ values: Points3d });

    const output = transform3dPlugin.transform(
      {
        values: { dx: 10, dy: 5, dz: -2 },
        requires: {
          data: [
            {
              id: "point-a",
              cells: { x: 50, y: 20, z: 4, rotation: 0.1, rotationX: 0.2, rotationY: 0.3 },
            },
            {
              id: "point-b",
              cells: { x: 200, y: 40, z: 8, rotation: 1.1, rotationX: 1.2, rotationY: 1.3 },
            },
          ],
        },
        structures: {
          data: {
            ids: ["point-a", "point-b"],
            indexById: new Map([
              ["point-a", 0],
              ["point-b", 1],
            ]),
          },
        },
        state: undefined,
      },
      { nodeId: "demo/shifted-points", progress: 0.5 },
    );

    expect(output).toEqual({
      values: [
        {
          id: "point-a",
          cells: { x: 60, y: 25, z: 2, rotation: 0.1, rotationX: 0.2, rotationY: 0.3 },
        },
        {
          id: "point-b",
          cells: { x: 210, y: 45, z: 6, rotation: 1.1, rotationX: 1.2, rotationY: 1.3 },
        },
      ],
    });
    expect(Object.keys(output)).toEqual(["values"]);
    expect(output).not.toHaveProperty("rotations3d");
  });
});
