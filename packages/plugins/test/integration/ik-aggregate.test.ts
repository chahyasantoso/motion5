import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { ikPlugin } from "../../src/ik/ik";
import { Body2d, Goals2d, Point2d, Solved2d } from "../../src/models/index";
import { goalDiagnostics } from "../../src/ik/shared/goal-check";
import { bodyStructure, goalsStructure, rigStructures } from "../support/rig-input";
import { isValue } from "../../../core/src/runtime/value-validation";
import { testModels } from "../../../core/test/support/test-models";

const solver = vi.hoisted(() => ({ calls: 0 }));
vi.mock("../../src/ik/solve2d/solve", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/ik/solve2d/solve")>();
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
    values: {},
    param: values,
    requires: {
      chain,
      goals,
      base: { x: 0, y: 0, rotation: 0 },
    },
    structures: rigStructures(chain, goals),
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
          {
            id: ids.root,
            output: { model: "Point2d" },
            input: { values: { x: 0, y: 0, rotation: 0 } },
          },
          {
            id: ids.body,
            output: { model: "Body2d" },
            input: {
              values: [
                { id: "trunk", cells: { length: 20, rotation: 0 } },
                { id: "left-upper", cells: { parentId: "trunk", length: 10, rotation: 0 } },
                { id: "left-lower", cells: { parentId: "left-upper", length: 10, rotation: 0 } },
              ],
            },
          },
          {
            id: ids.goals,
            output: { model: "Goals2d" },
            input: {
              values: [{ id: "left-hand", cells: { memberId: "left-lower", x: goalX, y: 8 } }],
            },
          },
          {
            id: ids.solve,
            output: { plugin: "ik" },
            input: {
              param: { flip: false },
              requires: { chain: ids.body, goals: ids.goals, base: ids.root },
            },
          },
        ],
      },
    ],
  } as unknown as ProjectDefinition;
}

function open(definition: ProjectDefinition) {
  const plugins = new PluginCatalog({ models: testModels });
  plugins.register({ plugins: [ikPlugin] });
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
  it("AI-1 declares chain, goals and base model slots and the solved model", () => {
    const requires = ikPlugin.inputs.requires!;
    expect(Object.keys(requires)).toEqual(["chain", "goals", "base"]);
    expect(requires.chain).toBe(Body2d);
    expect(requires.goals).toBe(Goals2d);
    expect(requires.base).toBe(Point2d);
    expect(requires.members).toBeUndefined();
    expect(ikPlugin.outputs.values).toBe(Solved2d);
    const inspect = ikPlugin.outputs.inspect;
    expect(inspect !== undefined && !("id" in inspect) && inspect.optional).toBe(true);
    expect(Object.keys(ikPlugin.outputs)).toEqual(["values", "inspect"]);
  });

  it("AI-2 publishes the frozen golden rows and inspection", () => {
    expect(ikPlugin.transform(input(), CTX)).toEqual(GOLDEN);
  });

  it("AI-3 is independent of authored body order", () => {
    expect(ikPlugin.transform(input(undefined, [...BODY].reverse()), CTX)).toEqual(GOLDEN);
  });

  it("AI-4 refuses malformed goal tables at the model and cross-source boundary", () => {
    const refusal = (goals: unknown): string => {
      if (!isValue(goals)) return "invalid-value";
      const parsed = Goals2d.parse?.(goals);
      if (parsed === undefined) return "no-parse";
      if (!parsed.ok) return parsed.issues[0]?.message ?? "refused";
      return goalDiagnostics(bodyStructure(BODY), parsed.value)[0]?.ruleId ?? "accepted";
    };
    expect(refusal({})).toContain("table");
    expect(refusal([])).toBe("ik-solver-no-goal");
    expect(refusal([{ id: "g" }])).toContain("id and a cells");
    expect(refusal([{ id: "", cells: { memberId: "left", x: 0, y: 0 } }])).toContain("non-empty");
    expect(refusal([{ id: "g", cells: { memberId: "zzz", x: 0, y: 0 } }])).toBe(
      "ik-goal-unknown-member",
    );
    expect(refusal([{ id: "g", cells: { memberId: "upper", x: 0, y: 0 } }])).toBe(
      "ik-goal-not-leaf",
    );
    expect(refusal([GOALS[0], { id: "dup", cells: { memberId: "left", x: 1, y: 1 } }])).toContain(
      "Two goal rows",
    );
    expect(refusal([GOALS[0]])).toBe("ik-leaf-without-goal");
  });

  it("AI-4b keeps the goal refusal in the plugin hooks", () => {
    const structures = {
      chain: bodyStructure(BODY),
      goals: goalsStructure([{ id: "g", cells: { memberId: "zzz", x: 0, y: 0 } }]),
    };
    const prepared = ikPlugin.prepare?.({ values: {}, param: {}, structures });
    expect(prepared?.ok).toBe(false);
    if (prepared?.ok === false)
      expect(prepared.diagnostics[0]?.ruleId).toBe("ik-goal-unknown-member");
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
          values: {},
          param: twin.values ?? { inspect: true },
          requires: {
            chain: twin.body,
            goals: twin.goals,
            base: twin.base,
          },
          structures: rigStructures(twin.body, twin.goals),
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
    expect(
      load((t) => {
        t[1].input.values[0].cells.minRotation = [
          { p: 0, v: -30 },
          { p: 1, v: 0 },
        ];
      }),
    ).toThrow(/static-field-stops .*minRotation/);
    expect(
      load((t) => {
        t[1].input.values[0].cells.maxRotation = [
          { p: 0, v: 0 },
          { p: 1, v: 30 },
        ];
      }),
    ).toThrow(/static-field-stops .*maxRotation/);
  });
});
