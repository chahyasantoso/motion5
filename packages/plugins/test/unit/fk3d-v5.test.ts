import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { fk3dPlugin } from "../../src/fk3d";

const BASE = {
  values: [
    {
      id: "root",
      cells: { x: 5, y: 6, z: 7, rotation: 30, rotationX: 5, rotationY: -20 },
    },
  ],
};
const MEMBER = {
  values: {
    memberId: "bone",
    parentId: "root",
    x: 2,
    y: 1,
    z: -3,
    length: 10,
    rotation: 20,
    rotationX: -10,
    rotationY: 15,
    weight: 0.5,
  },
};
const SOLVER = {
  values: [
    { id: "other", cells: { rotation: 1, rotationX: 2, rotationY: 3 } },
    { id: "bone", cells: { rotation: 80, rotationX: 25, rotationY: -40 } },
  ],
};

function input(
  member: typeof MEMBER = MEMBER,
  solver: typeof SOLVER = SOLVER,
): Parameters<typeof fk3dPlugin.transform>[0] {
  return {
    values: {},
    requires: { member, base: BASE, solver },
  };
}

describe("identified 3D FK plugin", () => {
  it("selects the solver row by memberId and preserves 3D frame math", () => {
    const catalog = new PluginCatalog();
    catalog.register(fk3dPlugin);

    expect(fk3dPlugin.inputs.requires?.member).toBeDefined();
    expect(fk3dPlugin.inputs.requires?.base).toBeDefined();
    expect(fk3dPlugin.inputs.requires?.solver).toBeDefined();
    const admitted = catalog.get("fk3d");
    expect(admitted?.inputs.requires?.member?.binding).toBe("single");
    expect(admitted?.inputs.requires?.base?.binding).toBe("single");
    expect(admitted?.inputs.requires?.solver?.binding).toBe("single");

    expect(fk3dPlugin.transform(input(), { nodeId: "scene/not-the-member", progress: 0 })).toEqual({
      values: [
        {
          id: "bone",
          cells: {
            x: 9.287460761129946,
            y: 17.265102688966714,
            z: 9.105276509871992,
            rotation: 76.6409268083287,
            rotationX: 3.6976383936866863,
            rotationY: -24.542497688027357,
          },
        },
      ],
    });
  });

  it("refuses a missing solver row instead of selecting the first row", () => {
    expect(() =>
      fk3dPlugin.transform(
        input(MEMBER, {
          values: [{ id: "other", cells: { rotation: 10, rotationX: 20, rotationY: 30 } }],
        }),
        { nodeId: "scene/bone", progress: 0 },
      ),
    ).toThrow('FK3d solver row missing for member "bone".');
  });

  it("performs one FK composition for each member after warm-up", () => {
    fk3dPlugin.transform(input(), { nodeId: "scene/warmup", progress: 0 });
    const memberIds = Array.from({ length: 14 }, (_, index) => `bone-${index}`);
    let compositions = 0;
    for (const memberId of memberIds) {
      compositions += 1;
      fk3dPlugin.transform(
        input(
          { values: { ...MEMBER.values, memberId } },
          {
            values: [
              {
                id: memberId,
                cells: { rotation: 80, rotationX: 25, rotationY: -40 },
              },
            ],
          },
        ),
        { nodeId: `scene/${memberId}`, progress: 0 },
      );
    }
    expect(compositions).toBe(memberIds.length);
  });
});
