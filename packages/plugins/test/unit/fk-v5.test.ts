import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { fkPlugin } from "../../src/fk";

const BASE = { values: [{ id: "root", cells: { x: 5, y: 6, rotation: 30 } }] };
const MEMBER = {
  values: {
    memberId: "bone",
    parentId: "root",
    x: 2,
    y: 1,
    length: 10,
    rotation: 20,
    weight: 0.5,
  },
};
const SOLVER = { values: [{ id: "bone", cells: { rotation: 80 } }] };

function input(member: typeof MEMBER = MEMBER, solver: typeof SOLVER = SOLVER) {
  return {
    values: {},
    requires: {
      member,
      base: BASE,
      solver,
    },
  };
}

describe("identified 2D FK plugin", () => {
  it("selects the solver row by memberId and preserves frame math", () => {
    const catalog = new PluginCatalog();
    catalog.register(fkPlugin);

    expect(fkPlugin.inputs.requires?.member).toBeDefined();
    expect(fkPlugin.outputs.values).toBeDefined();

    const output = fkPlugin.transform(input(), { nodeId: "rig/bone", progress: 0 });
    expect(output).toEqual({
      values: [
        {
          id: "bone",
          cells: {
            x: 7.968532584238182,
            y: 17.714102933906517,
            rotation: 80,
          },
        },
      ],
    });

    const differentlyLabeledSource = fkPlugin.transform(input(MEMBER, SOLVER), {
      nodeId: "rig/bone",
      progress: 0,
    });
    expect(differentlyLabeledSource).toEqual(output);
  });

  it("refuses a missing solver row instead of selecting the first row", () => {
    expect(() =>
      fkPlugin.transform(input(MEMBER, { values: [{ id: "other", cells: { rotation: 10 } }] }), {
        nodeId: "rig/bone",
        progress: 0,
      }),
    ).toThrow('Solver row missing for member "bone".');
  });
});
