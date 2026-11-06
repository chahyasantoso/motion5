import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { transformPlugin } from "../../../src/transform/transform";
import { Points2d } from "../../../src/models/index";
import { testModels } from "../../../../core/test/support/test-models";

describe("identified 2D transform plugin", () => {
  it("declares one dependency and preserves source row identity", () => {
    const catalog = new PluginCatalog({ models: testModels });
    catalog.register({ plugins: [transformPlugin] });

    expect(catalog.get("transform")).toBeDefined();
    expect(transformPlugin.inputs.requires?.data).toBeDefined();
    expect(transformPlugin.outputs).toEqual({ values: Points2d });

    const output = transformPlugin.transform(
      {
        values: { dx: 10, dy: 5 },
        requires: {
          data: [
            { id: "point-a", cells: { x: 50, y: 20, rotation: 0.5 } },
            { id: "point-b", cells: { x: 200, y: 40, rotation: 1.5 } },
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
        { id: "point-a", cells: { x: 60, y: 25, rotation: 0.5 } },
        { id: "point-b", cells: { x: 210, y: 45, rotation: 1.5 } },
      ],
    });
    expect(Object.keys(output)).toEqual(["values"]);
    expect(output).not.toHaveProperty("dx");
    expect(output).not.toHaveProperty("dy");
  });
});
