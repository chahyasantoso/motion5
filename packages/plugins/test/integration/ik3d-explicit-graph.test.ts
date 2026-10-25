import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { ik3dPlugin } from "../../src/ik3d";

const MEMBERS = {
  upperBinding: {
    values: {
      memberId: "upper",
      parentId: "root",
      length: 50,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    },
  },
  leftBinding: {
    values: {
      memberId: "left",
      parentId: "upper",
      length: 35,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
      orient: 0.5,
    },
  },
  rightBinding: {
    values: {
      memberId: "right",
      parentId: "upper",
      length: 30,
      rotation: 0,
      rotationX: 0,
      rotationY: 0,
    },
  },
};

const GOALS = {
  leftBinding: {
    values: {
      goalId: "goal-left",
      memberId: "left",
      x: 60,
      y: 20,
      z: 15,
      rotation: 20,
      rotationX: 10,
      rotationY: -5,
    },
  },
  rightBinding: {
    values: {
      goalId: "goal-right",
      memberId: "right",
      x: 20,
      y: 45,
      z: -10,
      rotation: -15,
      rotationX: 5,
      rotationY: 12,
    },
  },
};

type MemberBindings = Readonly<
  Record<string, { readonly values: Readonly<Record<string, number | string | boolean>> }>
>;
type GoalBindings = Readonly<
  Record<string, { readonly values: Readonly<Record<string, number | string | boolean>> }>
>;

function input(
  memberBindings: MemberBindings = MEMBERS,
  goalBindings: GoalBindings = GOALS,
  values: { readonly inspect?: boolean } = { inspect: true },
  pole: { readonly values: { readonly x: number; readonly y: number; readonly z: number } } = {
    values: { x: 0, y: 0, z: 100 },
  },
) {
  return {
    values,
    requires: {
      members: memberBindings,
      root: {
        values: {
          memberId: "root",
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          rotationX: 0,
          rotationY: 0,
        },
      },
      goals: goalBindings,
      pole,
    },
  };
}

describe("identified 3D IK graph", () => {
  it("preserves 3D solver golden values, row identity and explicit pole input", () => {
    const catalog = new PluginCatalog();
    catalog.register(ik3dPlugin);

    const requires = ik3dPlugin.inputs.requires!;
    expect(requires.members!.binding).toBe("map");
    expect(requires.goals!.binding).toBe("map");
    expect(requires.pole!.optional).toBe(true);

    const result = ik3dPlugin.transform(input(), { nodeId: "rig/solve", progress: 0 });
    expect(result.values).toEqual([
      {
        id: "upper",
        cells: {
          rotation: 47.94788147707375,
          rotationX: -9.188321161983323,
          rotationY: -20.485921095523413,
        },
      },
      {
        id: "left",
        cells: {
          rotation: -78.17064980808543,
          rotationX: -10.718483974408471,
          rotationY: 16.994835153116618,
          residual: 0.0007279889169279709,
        },
      },
      {
        id: "right",
        cells: {
          rotation: 44.659667843445554,
          rotationX: 37.67187209567497,
          rotationY: 79.42085541563047,
          residual: 0.0008097659902506232,
        },
      },
    ]);
    expect(result.inspect).toEqual({
      kind: "converged",
      residual: 0.0008097659902506232,
      iterations: 23,
      atBound: false,
    });

    const renamed = ik3dPlugin.transform(
      input(
        { alpha: MEMBERS.upperBinding, beta: MEMBERS.leftBinding, gamma: MEMBERS.rightBinding },
        { one: GOALS.leftBinding, two: GOALS.rightBinding },
      ),
      { nodeId: "rig/solve", progress: 0 },
    );
    expect(renamed).toEqual(result);

    const changedRest = ik3dPlugin.transform(
      input({
        ...MEMBERS,
        upperBinding: { values: { ...MEMBERS.upperBinding.values, rotation: 15 } },
      }),
      { nodeId: "rig/solve", progress: 0 },
    );
    expect(changedRest.values).not.toEqual(result.values);
  });

  it("accepts explicit joint fields and omits inspection without the local opt-in", () => {
    const constrained = ik3dPlugin.transform(
      input(
        {
          ...MEMBERS,
          upperBinding: {
            values: {
              ...MEMBERS.upperBinding.values,
              joint: "hinge",
              axisZ: 1,
              minRotation: -10,
              maxRotation: 10,
            },
          },
        },
        GOALS,
        {},
      ),
      { nodeId: "rig/solve", progress: 0 },
    );
    expect(constrained.values).toHaveLength(3);
    expect(constrained).not.toHaveProperty("inspect");
  });
});
