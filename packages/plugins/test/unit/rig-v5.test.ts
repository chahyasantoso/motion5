import { describe, expect, it, vi } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { validatePluginOutputs } from "../../../core/src/runtime/plugin-output";
import { rigPlugin } from "../../src/rig";

const FRAME = (id: string, x: number) => ({
  id,
  cells: { x, y: x + 1, z: x + 2, rotation: 10, rotationX: 20, rotationY: 30 },
});
const POINT = (id: string, x: number) => ({ id, cells: { x, y: x + 1, z: x + 2 } });

function input(
  bones: Readonly<Record<string, { readonly values: readonly ReturnType<typeof FRAME>[] }>> = {
    upperBinding: { values: [FRAME("upper", 1)] },
    foreBinding: { values: [FRAME("fore", 4)] },
  },
  controls: Readonly<Record<string, { readonly values: readonly ReturnType<typeof POINT>[] }>> = {
    goalBinding: { values: [POINT("goal", 7)] },
  },
): Parameters<typeof rigPlugin.transform>[0] {
  return { values: {}, requires: { bones, controls } };
}

describe("identified rig plugin", () => {
  it("aggregates dependency rows by source row id rather than binding labels", () => {
    const catalog = new PluginCatalog();
    catalog.register(rigPlugin);

    expect(rigPlugin.inputs.requires?.bones?.binding).toBe("map");
    expect(rigPlugin.inputs.requires?.controls?.binding).toBe("map");
    expect(rigPlugin.transform(input(), { nodeId: "scene/rig", progress: 0 })).toEqual({
      pose: [FRAME("upper", 1), FRAME("fore", 4)],
      controls: [POINT("goal", 7)],
    });

    expect(
      rigPlugin.transform(
        input(
          {
            first: { values: [FRAME("upper", 1)] },
            second: { values: [FRAME("fore", 4)] },
          },
          { renamed: { values: [POINT("goal", 7)] } },
        ),
        { nodeId: "scene/rig", progress: 0 },
      ),
    ).toEqual(rigPlugin.transform(input(), { nodeId: "scene/rig", progress: 0 }));
  });

  it("lets output validation refuse duplicate source row ids", () => {
    const output = rigPlugin.transform(
      input({ first: { values: [FRAME("upper", 1)] }, second: { values: [FRAME("upper", 4)] } }),
      { nodeId: "scene/rig", progress: 0 },
    );

    expect(() => validatePluginOutputs(output, rigPlugin.outputs, "scene/rig")).toThrow(
      "output-row-id-duplicate",
    );
  });

  it("performs one aggregation call for N rows after warm-up", () => {
    const aggregate = vi.fn((value: Parameters<typeof rigPlugin.transform>[0]) =>
      rigPlugin.transform(value, { nodeId: "scene/rig", progress: 0 }),
    );
    aggregate(input());
    aggregate.mockClear();

    const rows = Array.from({ length: 14 }, (_, index) => FRAME(`bone-${index}`, index));
    const output = aggregate(input({ source: { values: rows } }, {}));

    expect(aggregate).toHaveBeenCalledTimes(1);
    expect(output.pose).toEqual(rows);
  });
});
