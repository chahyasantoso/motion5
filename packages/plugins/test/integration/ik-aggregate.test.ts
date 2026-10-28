import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { ikPlugin } from "../../src/ik";
import { AggregateTopologyError, BODY_2D_SPEC, GOALS_2D_SPEC } from "../../src/aggregate-topology";

const solver = vi.hoisted(() => ({ calls: 0 }));
vi.mock("../../src/ik-solve", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/ik-solve")>();
  return {
    ...original,
    solveChain: (...args: Parameters<typeof original.solveChain>) => {
      solver.calls += 1;
      return original.solveChain(...args);
    },
  };
});

const BODY = [
  { id: "upper", cells: { length: 50, rotation: 0 } },
  { id: "left", cells: { parentId: "upper", length: 35, rotation: 0 } },
  { id: "right", cells: { parentId: "upper", length: 30, rotation: 0 } },
];
const GOALS = [
  { id: "goal-left", cells: { memberId: "left", x: 60, y: 20 } },
  { id: "goal-right", cells: { memberId: "right", x: 20, y: 45 } },
];
const CTX = { nodeId: "rig/solve", progress: 0 };
const GOLDENS = JSON.parse(
  readFileSync(new URL("../fixtures/ik-aggregate-goldens.json", import.meta.url), "utf8"),
).ik as Record<string, { input: any; expected: unknown }>;

function input(
  values: { flip?: boolean; inspect?: boolean } = { inspect: true },
  chain: unknown = BODY,
  goals: unknown = GOALS,
) {
  return {
    values,
    requires: {
      chain: { values: chain },
      goals: { values: goals },
      base: { values: { x: 0, y: 0, rotation: 0 } },
    },
  } as never;
}

const GOLDEN = {
  values: [
    { id: "upper", cells: { rotation: 41.46385313134519 } },
    { id: "left", cells: { rotation: -71.65213085796591, residual: 8.933478708049105 } },
    { id: "right", cells: { rotation: 104.28922113217578, residual: 8.867337495171705 } },
  ],
  inspect: { kind: "conflicted", residual: 8.933478708049105, iterations: 15, atBound: false },
};

type Ids = { root: string; body: string; goals: string; solve: string };
const IDS: Ids = { root: "root", body: "body", goals: "goals", solve: "solve" };

function project(ids: Ids = IDS, goalX: unknown = 12, motion = "demo"): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "aggregate-ik",
    motions: [
      {
        id: motion,
        trigger: { type: "manual" },
        tracks: [
          { id: ids.root, input: { values: { x: 0, y: 0, rotation: 0 } } },
          {
            id: ids.body,
            input: {
              schema: BODY_2D_SPEC,
              values: [
                { id: "trunk", cells: { length: 20, rotation: 0 } },
                { id: "left-upper", cells: { parentId: "trunk", length: 10, rotation: 0 } },
                { id: "left-lower", cells: { parentId: "left-upper", length: 10, rotation: 0 } },
              ],
            },
          },
          {
            id: ids.goals,
            input: {
              schema: GOALS_2D_SPEC,
              values: [{ id: "left-hand", cells: { memberId: "left-lower", x: goalX, y: 8 } }],
            },
          },
          {
            id: ids.solve,
            plugin: "ik",
            input: {
              values: { flip: false },
              requires: { chain: ids.body, goals: ids.goals, base: ids.root },
            },
          },
        ],
      },
    ],
  } as unknown as ProjectDefinition;
}

function open(definition: ProjectDefinition) {
  const plugins = new PluginCatalog();
  plugins.registerAll([ikPlugin]);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(definition);
  const motion = definition.motions[0]!;
  for (const track of motion.tracks) handle.mount(`${motion.id}/${track.id}`);
  handle.seek(`${motion.id}/${IDS.solve}`, 0);
  return handle;
}

function solved(handle: ReturnType<typeof open>, node = "demo/solve") {
  const patch = handle.get(node);
  if (patch?.status !== "ready") throw new Error(`Expected ${node} to be ready.`);
  return patch.outputs.values as readonly { id: string; cells: Record<string, number> }[];
}

describe("aggregate 2D IK", () => {
  it("AI-1 declares chain, goals and base single slots and the solved table", () => {
    const requires = ikPlugin.inputs.requires!;
    expect(Object.keys(requires)).toEqual(["chain", "goals", "base"]);
    for (const slot of Object.values(requires)) expect(slot.binding).toBeUndefined();
    expect(requires.members).toBeUndefined();
    expect(ikPlugin.outputs.inspect?.optional).toBe(true);
    expect(Object.keys(ikPlugin.outputs)).toEqual(["values", "inspect"]);
  });

  it("AI-2 publishes the frozen golden rows and inspection", () => {
    expect(ikPlugin.transform(input(), CTX)).toEqual(GOLDEN);
  });

  it("AI-3 is independent of authored body order", () => {
    expect(ikPlugin.transform(input(undefined, [...BODY].reverse()), CTX)).toEqual(GOLDEN);
  });

  it("AI-4 refuses malformed goal tables by kind through the transform", () => {
    const kindOf = (goals: unknown) => {
      try {
        ikPlugin.transform(input(undefined, BODY, goals), CTX);
      } catch (error) {
        if (error instanceof AggregateTopologyError) return error.kind;
        throw error;
      }
      return "accepted";
    };
    expect(kindOf({})).toBe("goal-table-shape");
    expect(kindOf([])).toBe("goal-empty");
    expect(kindOf([{ id: "g" }])).toBe("goal-row-shape");
    expect(kindOf([{ id: "", cells: { memberId: "left", x: 0, y: 0 } }])).toBe("goal-row-id");
    expect(kindOf([{ id: "g", cells: { memberId: "zzz", x: 0, y: 0 } }])).toBe(
      "goal-member-unknown",
    );
    expect(kindOf([{ id: "g", cells: { memberId: "upper", x: 0, y: 0 } }])).toBe(
      "goal-member-not-leaf",
    );
    expect(kindOf([GOALS[0], { id: "dup", cells: { memberId: "left", x: 1, y: 1 } }])).toBe(
      "goal-member-duplicate",
    );
    expect(kindOf([GOALS[0]])).toBe("goal-leaf-unaddressed");
  });

  it("AI-5 reads a rest edit", () => {
    const edited = BODY.map((row) =>
      row.id === "upper" ? { ...row, cells: { ...row.cells, length: 45 } } : row,
    );
    expect(ikPlugin.transform(input(undefined, edited), CTX).values).not.toEqual(GOLDEN.values);
  });

  it("AI-6 omits inspect unless opted in, and flip chooses the other elbow", () => {
    expect(ikPlugin.transform(input({}), CTX)).not.toHaveProperty("inspect");
    const two = [
      { id: "a", cells: { length: 50, rotation: 0 } },
      { id: "b", cells: { parentId: "a", length: 35, rotation: 0 } },
    ];
    const goals = [{ id: "g", cells: { memberId: "b", x: 60, y: 20 } }];
    const leaf = (flip: boolean) =>
      (
        ikPlugin.transform(input({ flip }, two, goals), CTX).values as {
          id: string;
          cells: { rotation: number };
        }[]
      )[1]!.cells.rotation;
    expect(Number.isFinite(leaf(false))).toBe(true);
    expect(Number.isFinite(leaf(true))).toBe(true);
    expect(leaf(true)).not.toBe(leaf(false));
  });

  it("AI-7 publishes a ready solved table through the engine", () => {
    const rows = solved(open(project()));
    expect(rows.map((row) => row.id)).toEqual(["trunk", "left-upper", "left-lower"]);
    for (const row of rows) expect(Number.isFinite(row.cells.rotation)).toBe(true);
  });

  it("AI-8 is independent of source track ids and motion id", () => {
    const renamed = open(
      project({ root: "origin", body: "skeleton", goals: "targets", solve: "solve" }, 12, "other"),
    );
    expect(solved(renamed, "other/solve")).toEqual(solved(open(project())));
  });

  it("AI-9 follows an animated goal and matches the static equivalent", () => {
    const handle = open(
      project(IDS, [
        { p: 0, v: 12 },
        { p: 1, v: 30 },
      ]),
    );
    handle.seek("demo/goals", 0);
    const start = JSON.stringify(solved(handle));
    handle.seek("demo/goals", 1);
    const end = solved(handle);
    expect(JSON.stringify(end)).not.toBe(start);
    expect(end).toEqual(solved(open(project(IDS, 30))));
  });

  it("AI-10 runs the solver once and publishes once per value batch", () => {
    const handle = open(project());
    const before = solved(handle);
    const revision = handle.get("demo/solve")!.revision;
    const calls = solver.calls;
    const seen: unknown[] = [];
    const off = handle.subscribeNode("demo/solve", (patch) => seen.push(patch));
    handle.values((tx) => {
      tx.track("demo/body").input.values.setField({ row: "trunk", field: "length" }, 25);
    });
    off();
    expect(solver.calls - calls).toBe(1);
    expect(seen).toHaveLength(1);
    expect(handle.get("demo/solve")!.revision).toBe(revision + 1);
    expect(solved(handle)).not.toEqual(before);
  });

  it("AI-12 reproduces every case captured from the grouped plugin bit for bit", () => {
    expect(Object.keys(GOLDENS).length).toBeGreaterThanOrEqual(12);
    for (const [name, { input: twin, expected }] of Object.entries(GOLDENS)) {
      const result = ikPlugin.transform(
        {
          values: twin.values ?? { inspect: true },
          requires: {
            chain: { values: twin.body },
            goals: { values: twin.goals },
            base: { values: twin.base },
          },
        } as never,
        CTX,
      );
      expect({ name, result }).toEqual({ name, result: expected });
    }
  });

  it("AI-13 treats a member named root or base as an ordinary row", () => {
    const named = [
      { id: "root", cells: { length: 50, rotation: 0 } },
      { id: "base", cells: { parentId: "root", length: 35, rotation: 0 } },
    ];
    const plain = [
      { id: "a", cells: { length: 50, rotation: 0 } },
      { id: "b", cells: { parentId: "a", length: 35, rotation: 0 } },
    ];
    const goalFor = (member: string) => [{ id: "g", cells: { memberId: member, x: 60, y: 20 } }];
    const rotations = (chain: typeof named, goal: string) => {
      const rows = ikPlugin.transform(input(undefined, chain, goalFor(goal)), CTX)
        .values as unknown as readonly { cells: unknown }[];
      return rows.map((row) => row.cells);
    };
    expect(rotations(named, "base")).toEqual(rotations(plain, "b"));
  });

  it("AI-11 refuses the retired grouped shape by name at load", () => {
    const load = (edit: (tracks: any[]) => void) => {
      const definition = structuredClone(project()) as any;
      edit(definition.motions[0].tracks);
      return () => open(definition as ProjectDefinition);
    };
    expect(
      load((t) => {
        t[3].input.requires = {
          members: { upper: "body" },
          root: "root",
          goals: { left: "goals" },
        };
      }),
    ).toThrow(/slot-unknown at demo\/solve/);
    expect(
      load((t) => {
        t[3].input.requires = { chain: "body", goals: { left: "goals" }, base: "root" };
      }),
    ).toThrow(/slot-binding-mode at demo\/solve/);
    expect(
      load((t) => {
        t[1].input.values[0].cells.memberId = "trunk";
      }),
    ).toThrow(/cell-form-invalid .*memberId/);
    expect(
      load((t) => {
        t[2].input.values[0].cells.goalId = "g";
      }),
    ).toThrow(/cell-form-invalid .*goalId/);
    expect(
      load((t) => {
        t[1].input.values[0].cells.minRotation = 500;
      }),
    ).toThrow(/cell-form-invalid .*minRotation/);
  });
});
