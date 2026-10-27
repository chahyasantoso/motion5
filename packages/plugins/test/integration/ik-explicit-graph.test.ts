import { describe, expect, it } from "vitest";
import { PluginCatalog } from "@motion5/core/plugin-api";
import { ikPlugin } from "../../src/ik";

const MEMBERS = {
  firstBinding: {
    values: { memberId: "upper", parentId: "root", length: 50 },
  },
  secondBinding: {
    values: { memberId: "left", parentId: "upper", length: 35 },
  },
  thirdBinding: {
    values: { memberId: "right", parentId: "upper", length: 30 },
  },
};

const GOALS = {
  leftBinding: {
    values: { goalId: "goal-left", memberId: "left", x: 60, y: 20 },
  },
  rightBinding: {
    values: { goalId: "goal-right", memberId: "right", x: 20, y: 45 },
  },
};

type MemberBindings = Readonly<Record<string, (typeof MEMBERS)[keyof typeof MEMBERS]>>;
type GoalBindings = Readonly<Record<string, (typeof GOALS)[keyof typeof GOALS]>>;

function input(
  memberBindings: MemberBindings = MEMBERS,
  goalBindings: GoalBindings = GOALS,
  values: { readonly flip?: boolean; readonly inspect?: boolean } = { inspect: true },
) {
  return {
    values,
    requires: {
      members: memberBindings,
      root: { values: [{ id: "root", cells: { memberId: "root", x: 0, y: 0, rotation: 0 } }] },
      goals: goalBindings,
    },
  };
}

describe("identified 2D IK graph", () => {
  it("proves keyed rows, independent rest input and literal solver output", () => {
    const catalog = new PluginCatalog();
    catalog.register(ikPlugin);

    const requires = ikPlugin.inputs.requires!;
    expect(requires.members!.binding).toBe("map");
    expect(requires.goals!.binding).toBe("map");
    expect(requires.root!.binding).toBeUndefined();

    const result = ikPlugin.transform(input(), { nodeId: "rig/solve", progress: 0 });
    expect(result.values).toEqual([
      { id: "upper", cells: { rotation: 41.46385313134519 } },
      {
        id: "left",
        cells: { rotation: -71.65213085796591, residual: 8.933478708049105 },
      },
      {
        id: "right",
        cells: { rotation: 104.28922113217578, residual: 8.867337495171705 },
      },
    ]);
    expect(result.inspect).toEqual({
      kind: "conflicted",
      residual: 8.933478708049105,
      iterations: 15,
      atBound: false,
    });

    const renamed = ikPlugin.transform(
      input(
        { alpha: MEMBERS.firstBinding, beta: MEMBERS.secondBinding, gamma: MEMBERS.thirdBinding },
        { one: GOALS.leftBinding, two: GOALS.rightBinding },
      ),
      { nodeId: "rig/solve", progress: 0 },
    );
    expect(renamed).toEqual(result);

    const changedRest = ikPlugin.transform(
      input({
        ...MEMBERS,
        firstBinding: { values: { ...MEMBERS.firstBinding.values, length: 45 } },
      }),
      { nodeId: "rig/solve", progress: 0 },
    );
    expect(changedRest.values).not.toEqual(result.values);
  });

  it("omits inspection unless the local static opt-in is true", () => {
    const result = ikPlugin.transform(input(MEMBERS, GOALS, {}), {
      nodeId: "rig/solve",
      progress: 0,
    });
    expect(result).not.toHaveProperty("inspect");
  });
});
