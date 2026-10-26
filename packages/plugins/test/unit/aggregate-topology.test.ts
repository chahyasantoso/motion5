import { describe, expect, it } from "vitest";
import {
  AggregateTopologyError,
  BODY_2D_SPEC,
  BODY_3D_SPEC,
  GOALS_2D_SPEC,
  GOALS_3D_SPEC,
  POSE_2D_SPEC,
  POSE_3D_SPEC,
  ROOT_2D_SPEC,
  ROOT_3D_SPEC,
  SOLVED_2D_SPEC,
  SOLVED_3D_SPEC,
  readAggregateTopology,
} from "../../src/aggregate-topology";

function body(...rows: readonly { readonly id: string; readonly parentId?: string }[]) {
  return rows.map(({ id, parentId }) => ({
    id,
    cells: parentId === undefined ? { length: 10 } : { parentId, length: 10 },
  }));
}

function errorOf(action: () => unknown): AggregateTopologyError {
  try {
    action();
  } catch (error) {
    if (error instanceof AggregateTopologyError) return error;
    throw error;
  }
  throw new Error("Expected aggregate topology to be refused.");
}

describe("aggregate kinematics contracts", () => {
  it("declares table contracts for 2D and 3D body, goal, solved and pose data", () => {
    for (const spec of [
      BODY_2D_SPEC,
      BODY_3D_SPEC,
      GOALS_2D_SPEC,
      GOALS_3D_SPEC,
      SOLVED_2D_SPEC,
      SOLVED_3D_SPEC,
      POSE_2D_SPEC,
      POSE_3D_SPEC,
    ])
      expect(spec.kind).toBe("table");

    expect(ROOT_2D_SPEC).toEqual({
      kind: "record",
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        rotation: { kind: "number" },
      },
    });
    expect(ROOT_3D_SPEC).toEqual({
      kind: "record",
      fields: {
        x: { kind: "number" },
        y: { kind: "number" },
        z: { kind: "number" },
        rotation: { kind: "number" },
        rotationX: { kind: "number" },
        rotationY: { kind: "number" },
      },
    });
    expect(BODY_2D_SPEC).toMatchObject({
      schema: { row: { fields: { parentId: { static: true }, length: { kind: "number" } } } },
    });
    expect(BODY_3D_SPEC).toMatchObject({
      schema: { row: { fields: { z: { kind: "number" }, joint: { static: true } } } },
    });
    expect(GOALS_2D_SPEC).toMatchObject({
      schema: { row: { fields: { memberId: { static: true }, x: { kind: "number" } } } },
    });
    expect(GOALS_3D_SPEC).toMatchObject({
      schema: { row: { fields: { z: { kind: "number" }, rotationY: { kind: "number" } } } },
    });
    expect(SOLVED_2D_SPEC).toMatchObject({
      schema: { row: { fields: { rotation: { kind: "number" }, atBound: { kind: "boolean" } } } },
    });
    expect(SOLVED_3D_SPEC).toMatchObject({
      schema: { row: { fields: { rotationX: { kind: "number" } } } },
    });
    expect(POSE_2D_SPEC).toMatchObject({
      schema: { row: { fields: { x: { kind: "number" }, rotation: { kind: "number" } } } },
    });
    expect(POSE_3D_SPEC).toMatchObject({
      schema: { row: { fields: { z: { kind: "number" }, rotationY: { kind: "number" } } } },
    });
  });

  it("canonicalizes root-first order, preserves row ids, and allows multiple base children", () => {
    const topology = readAggregateTopology(
      body(
        { id: "z-child", parentId: "z-root" },
        { id: "a-deep", parentId: "a-leaf" },
        { id: "z-root" },
        { id: "a-root" },
        { id: "a-leaf", parentId: "a-root" },
      ),
    );

    expect(topology.ids).toEqual(["a-root", "z-root", "a-leaf", "z-child", "a-deep"]);
    expect(topology.roots).toEqual(["a-root", "z-root"]);
    expect(topology.leaves).toEqual(["z-child", "a-deep"]);
    expect(topology.childrenById.get("a-root")).toEqual(["a-leaf"]);
    expect(topology.childrenById.get("z-root")).toEqual(["z-child"]);
    expect(topology.rows.map(({ id }) => id)).toEqual(topology.ids);
    expect(topology.rows.map(({ cells }) => cells.length)).toEqual([10, 10, 10, 10, 10]);
  });

  it("refuses duplicate row ids", () => {
    const error = errorOf(() =>
      readAggregateTopology([
        { id: "root", cells: { length: 10 } },
        { id: "root", cells: { length: 20 } },
      ]),
    );
    expect(error.kind).toBe("row-id-duplicate");
    expect(error.ids).toEqual(["root"]);
  });

  it("refuses unknown and self parents", () => {
    expect(
      errorOf(() => readAggregateTopology(body({ id: "arm", parentId: "missing" }))).kind,
    ).toBe("parent-unknown");
    expect(errorOf(() => readAggregateTopology(body({ id: "arm", parentId: "arm" }))).kind).toBe(
      "parent-self",
    );
  });

  it("refuses parent cycles rather than sorting them by authored order", () => {
    const error = errorOf(() =>
      readAggregateTopology(
        body({ id: "left", parentId: "right" }, { id: "right", parentId: "left" }),
      ),
    );
    expect(error.kind).toBe("parent-cycle");
    expect(error.ids).toEqual(["left"]);
  });

  it("refuses rows outside an explicitly supplied external-base root set", () => {
    const error = errorOf(() =>
      readAggregateTopology(body({ id: "root" }, { id: "orphan" }), { roots: ["root"] }),
    );
    expect(error.kind).toBe("row-unreachable");
    expect(error.ids).toEqual(["orphan"]);
  });
});
