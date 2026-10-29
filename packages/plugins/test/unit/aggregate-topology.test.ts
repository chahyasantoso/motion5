import { describe, expect, it } from "vitest";
import type { ValueSpec } from "@motion5/core/plugin-api";
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
  readGoalTargets,
  slotSpec,
  BODY_2D_SLOT,
  BODY_3D_SLOT,
  GOALS_2D_SLOT,
  GOALS_3D_SLOT,
  EXTERNAL_BASE,
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

describe("aggregate goal targets", () => {
  const topology = () =>
    readAggregateTopology(
      body({ id: "a" }, { id: "b", parentId: "a" }, { id: "c", parentId: "a" }),
    );
  const goal = (id: string, memberId: string) => ({ id, cells: { memberId, x: 1, y: 2 } });

  it("GT-1 returns a member-id to row map preserving ids and cells", () => {
    const rows = readGoalTargets(topology(), [goal("g1", "b"), goal("g2", "c")]);
    expect([...rows.keys()]).toEqual(["b", "c"]);
    expect(rows.get("b")).toEqual({ id: "g1", cells: { memberId: "b", x: 1, y: 2 } });
  });
  it("GT-2 refuses a non-array", () => {
    expect(errorOf(() => readGoalTargets(topology(), {})).kind).toBe("goal-table-shape");
  });
  it("GT-3 refuses an empty table with the leaf ids", () => {
    const error = errorOf(() => readGoalTargets(topology(), []));
    expect(error.kind).toBe("goal-empty");
    expect(error.ids).toEqual(["b", "c"]);
  });
  it("GT-4 refuses a row without id/cells and an empty id", () => {
    expect(errorOf(() => readGoalTargets(topology(), [{ id: "g" }])).kind).toBe("goal-row-shape");
    expect(errorOf(() => readGoalTargets(topology(), [goal("", "b")])).kind).toBe("goal-row-id");
  });
  it("GT-5 refuses an unknown member", () => {
    const error = errorOf(() => readGoalTargets(topology(), [goal("g", "zzz")]));
    expect(error.kind).toBe("goal-member-unknown");
    expect(error.ids).toEqual(["g", "zzz"]);
  });
  it("GT-6 refuses a non-leaf member", () => {
    expect(errorOf(() => readGoalTargets(topology(), [goal("g", "a")])).kind).toBe(
      "goal-member-not-leaf",
    );
  });
  it("GT-7 refuses two goals on one member", () => {
    expect(
      errorOf(() => readGoalTargets(topology(), [goal("g1", "b"), goal("g2", "b")])).kind,
    ).toBe("goal-member-duplicate");
  });
  it("GT-8 refuses an unaddressed leaf, naming the first in canonical order", () => {
    const error = errorOf(() => readGoalTargets(topology(), [goal("g1", "c")]));
    expect(error.kind).toBe("goal-leaf-unaddressed");
    expect(error.ids).toEqual(["b"]);
  });
  it("GT-9 slotSpec removes only static and keeps every other field fact", () => {
    for (const [authored, slot] of [
      [BODY_2D_SPEC, BODY_2D_SLOT],
      [BODY_3D_SPEC, BODY_3D_SLOT],
      [GOALS_2D_SPEC, GOALS_2D_SLOT],
      [GOALS_3D_SPEC, GOALS_3D_SLOT],
    ] as const) {
      const a = authored.kind === "table" ? authored.schema.row.fields : authored.fields;
      const b = slot.kind === "table" ? slot.schema.row.fields : slot.fields;
      expect(Object.keys(b)).toEqual(Object.keys(a));
      for (const name of Object.keys(a)) {
        expect(b[name]).not.toHaveProperty("static");
        const { static: _s, ...rest } = a[name]!;
        expect(b[name]).toEqual(rest);
      }
    }
    expect(slotSpec(ROOT_2D_SPEC)).toEqual(ROOT_2D_SPEC);
    expect(slotSpec(ROOT_3D_SPEC)).toEqual(ROOT_3D_SPEC);
    expect(EXTERNAL_BASE).toBe("");
    expect(() => readAggregateTopology([{ id: EXTERNAL_BASE, cells: { length: 1 } }])).toThrow();
  });
});

describe("aggregate spec vocabulary", () => {
  it("GT-10 pins the exact field names every aggregate table accepts", () => {
    const keys = (spec: ValueSpec) =>
      spec.kind === "table" ? Object.keys(spec.schema.row.fields) : Object.keys(spec.fields);
    expect(keys(BODY_2D_SPEC)).toEqual([
      "parentId",
      "length",
      "rotation",
      "weight",
      "x",
      "y",
      "minRotation",
      "maxRotation",
    ]);
    expect(keys(BODY_3D_SPEC)).toEqual([
      "parentId",
      "length",
      "rotation",
      "rotationX",
      "rotationY",
      "weight",
      "x",
      "y",
      "z",
      "orient",
      "joint",
      "axisX",
      "axisY",
      "axisZ",
      "minRotation",
      "maxRotation",
      "minTwist",
      "maxTwist",
      "maxSwing",
    ]);
    expect(keys(GOALS_2D_SPEC)).toEqual(["memberId", "x", "y", "influence"]);
    expect(keys(GOALS_3D_SPEC)).toEqual([
      "memberId",
      "x",
      "y",
      "z",
      "rotation",
      "rotationX",
      "rotationY",
      "influence",
    ]);
  });
});
