import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { Spec, defineModel } from "@motion5/core/plugin-api";
import { ik3dPlugin } from "../../src/ik3d";
import { Body3d, Goals3d, Point3d, Solved3d } from "../../src/models";
import { goalDiagnostics } from "../../src/goals/check";
import { BODY_3D_SPEC } from "../../src/body3d/fields";
import { GOALS_3D_SPEC } from "../../src/goals3d/fields";
import { bodyStructure, goalsStructure, rigStructures } from "../support/rig-input";
import { isValue } from "../../../core/src/runtime/value-validation";
import { testModels } from "../../../core/test/support/test-models";

const Pole3d = defineModel({
  id: "Pole3d",
  spec: Spec.record({ x: Spec.number(), y: Spec.number(), z: Spec.number() }),
});

const solver = vi.hoisted(() => ({ calls: 0 }));
vi.mock("../../src/ik3d-solve", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/ik3d-solve")>();
  return {
    ...original,
    solveChain3d: (...args: Parameters<typeof original.solveChain3d>) => {
      solver.calls += 1;
      return original.solveChain3d(...args);
    },
  };
});

const BODY = [
  { id: "upper", cells: { length: 50 } },
  { id: "left", cells: { parentId: "upper", length: 35, orient: 0.5 } },
  { id: "right", cells: { parentId: "upper", length: 30 } },
];
const GOALS = [
  {
    id: "goal-left",
    cells: { memberId: "left", x: 60, y: 20, z: 15, rotation: 20, rotationX: 10, rotationY: -5 },
  },
  {
    id: "goal-right",
    cells: { memberId: "right", x: 20, y: 45, z: -10, rotation: -15, rotationX: 5, rotationY: 12 },
  },
];
const ROOT = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };
const POLE = { x: 0, y: 0, z: 100, rotation: 0, rotationX: 0, rotationY: 0 };
const CTX = { nodeId: "rig/solve", progress: 0 };
const GOLDENS = JSON.parse(
  readFileSync(new URL("../fixtures/ik-aggregate-goldens.json", import.meta.url), "utf8"),
).ik3d as Record<string, { input: any; expected: unknown }>;

type Row = { id: string; cells: Record<string, number | boolean> };

function input(
  options: { inspect?: boolean; chain?: unknown; goals?: unknown; pole?: object | null } = {},
) {
  const { inspect = true, chain = BODY, goals = GOALS, pole = POLE } = options;
  return {
    values: {},
    param: { inspect },
    requires: {
      chain,
      goals,
      base: ROOT,
      ...(pole === null ? {} : { pole: { values: pole } }),
    },
    structures: rigStructures(chain, goals, true),
  } as never;
}
const run = (options: Parameters<typeof input>[0] = {}) =>
  ik3dPlugin.transform(input(options), CTX);
const rowsOf = (result: ReturnType<typeof run>) => result.values as Row[];

const GOLDEN_ROWS = [
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
];

const TWO = [
  { id: "upper", cells: { length: 50 } },
  { id: "leaf", cells: { parentId: "upper", length: 35 } },
];
const PINNED = [
  { id: "upper", cells: { length: 50, joint: "hinge", axisZ: 1, minRotation: 0, maxRotation: 0 } },
  { id: "leaf", cells: { parentId: "upper", length: 35 } },
];
const LEAF_GOAL = [{ id: "g", cells: { memberId: "leaf", x: 80, y: 40, z: 30 } }];

describe("aggregate 3D IK", () => {
  it("AJ-1 declares chain, goals, base and an optional pole, and nothing else", () => {
    const requires = ik3dPlugin.inputs.requires!;
    expect(Object.keys(requires)).toEqual(["chain", "goals", "base", "pole"]);
    expect(requires.chain).toBe(Body3d);
    expect(requires.goals).toBe(Goals3d);
    expect(requires.base).toBe(Point3d);
    expect("optional" in requires.pole! && requires.pole.optional).toBe(true);
    expect(ik3dPlugin.outputs.values).toBe(Solved3d);
    expect(Object.keys(ik3dPlugin.outputs)).toEqual(["values", "inspect"]);
  });

  it("AJ-2 publishes the frozen golden rows and inspection", () => {
    const result = run();
    expect(result.values).toEqual(GOLDEN_ROWS);
    expect(result.inspect).toEqual({
      kind: "converged",
      residual: 0.0008097659902506232,
      iterations: 23,
      atBound: false,
    });
    expect(run({ inspect: false })).not.toHaveProperty("inspect");
  });

  it("AJ-3 is independent of authored body order", () => {
    expect(rowsOf(run({ chain: [...BODY].reverse() }))).toEqual(GOLDEN_ROWS);
  });

  it("AJ-4 refuses malformed goal tables at the model and cross-source boundary", () => {
    const refusal = (goals: unknown): string => {
      if (!isValue(goals)) return "invalid-value";
      const parsed = Goals3d.parse?.(goals);
      if (parsed === undefined) return "no-parse";
      if (!parsed.ok) return parsed.issues[0]?.message ?? "refused";
      return goalDiagnostics(bodyStructure(BODY, true), parsed.value)[0]?.ruleId ?? "accepted";
    };
    expect(refusal({})).toContain("table");
    expect(refusal([])).toBe("ik-solver-no-goal");
    expect(refusal([{ id: "g" }])).toContain("id and a cells");
    expect(refusal([{ id: "", cells: { memberId: "left", x: 0, y: 0, z: 0 } }])).toContain(
      "non-empty",
    );
    expect(refusal([{ id: "g", cells: { memberId: "zzz", x: 0, y: 0, z: 0 } }])).toBe(
      "ik-goal-unknown-member",
    );
    expect(refusal([{ id: "g", cells: { memberId: "upper", x: 0, y: 0, z: 0 } }])).toBe(
      "ik-goal-not-leaf",
    );
    expect(
      refusal([GOALS[0], { id: "dup", cells: { memberId: "left", x: 1, y: 1, z: 1 } }]),
    ).toContain("Two goal rows");
    expect(refusal([GOALS[0]])).toBe("ik-leaf-without-goal");
  });

  it("AJ-4b keeps the goal refusal in the plugin hooks", () => {
    const structures = {
      chain: bodyStructure(BODY, true),
      goals: goalsStructure([{ id: "g", cells: { memberId: "zzz", x: 0, y: 0, z: 0 } }], true),
    };
    const prepared = ik3dPlugin.prepare?.({ values: {}, param: {}, structures });
    expect(prepared?.ok).toBe(false);
    if (prepared?.ok === false)
      expect(prepared.diagnostics[0]?.ruleId).toBe("ik-goal-unknown-member");
  });

  it("AJ-5 reads an optional pole and is still total without one", () => {
    const withPole = rowsOf(run());
    const without = rowsOf(run({ pole: null }));
    expect(without.map((row) => row.id)).toEqual(["upper", "left", "right"]);
    for (const row of [...withPole, ...without])
      for (const value of Object.values(row.cells))
        expect(Number.isFinite(Number(value))).toBe(true);
  });

  it("AJ-6 reports a pinned hinge as limited and at bound", () => {
    const result = run({ chain: PINNED, goals: LEAF_GOAL });
    expect(result.inspect).toMatchObject({ kind: "limited", atBound: true });
    expect(rowsOf(result)[0]!.cells.atBound).toBe(true);
  });

  it("AJ-7 reads goal influence", () => {
    const weighted = GOALS.map((goal) =>
      goal.id === "goal-left" ? { ...goal, cells: { ...goal.cells, influence: 2 } } : goal,
    );
    const base = rowsOf(run());
    const changed = rowsOf(run({ goals: weighted }));
    expect(changed).not.toEqual(base);
    expect(changed.map((row) => row.id)).toEqual(["upper", "left", "right"]);
  });

  it("AJ-8 reads body orient", () => {
    const flat = BODY.map((row) =>
      row.id === "left" ? { id: "left", cells: { parentId: "upper", length: 35 } } : row,
    );
    expect(rowsOf(run({ chain: flat }))[1]).not.toEqual(GOLDEN_ROWS[1]);
  });

  it("AJ-9 keeps row identity and canonical order for tree, two-bone and constrained solves", () => {
    for (const options of [
      {},
      { chain: TWO, goals: LEAF_GOAL },
      { chain: PINNED, goals: LEAF_GOAL },
    ]) {
      const chain = (options as { chain?: { id: string }[] }).chain ?? BODY;
      expect(rowsOf(run(options)).map((row) => row.id)).toEqual(chain.map((row) => row.id));
    }
  });
});

function project(
  ids = { root: "root", body: "body", goals: "goals", pole: "pole", solve: "solve" },
  goalZ: unknown = 15,
  motion = "demo",
): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "aggregate-ik3d",
    motions: [
      {
        id: motion,
        trigger: { type: "manual" },
        tracks: [
          { id: ids.root, output: { model: "Point3d" }, input: { values: ROOT } },
          {
            id: ids.pole,
            input: { values: { x: 0, y: 0, z: 100 } },
            output: { model: "Pole3d" },
          },
          {
            id: ids.body,
            output: { model: "Body3d" },
            input: {
              values: [
                { id: "upper", cells: { length: 50 } },
                { id: "left", cells: { parentId: "upper", length: 35 } },
              ],
            },
          },
          {
            id: ids.goals,
            output: { model: "Goals3d" },
            input: {
              values: [{ id: "g", cells: { memberId: "left", x: 60, y: 20, z: goalZ } }],
            },
          },
          {
            id: ids.solve,
            output: { plugin: "ik3d" },
            input: {
              param: { inspect: true },
              requires: { chain: ids.body, goals: ids.goals, base: ids.root, pole: ids.pole },
            },
          },
        ],
      },
    ],
  } as unknown as ProjectDefinition;
}

function open(definition: ProjectDefinition) {
  const plugins = new PluginCatalog({ models: [...testModels, Pole3d] });
  plugins.register({ plugins: [ik3dPlugin] });
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(definition);
  const motion = definition.motions[0]!;
  for (const track of motion.tracks) handle.mount(`${motion.id}/${track.id}`);
  handle.seek(`${motion.id}/solve`, 0);
  return handle;
}
function solved(handle: ReturnType<typeof open>, node = "demo/solve") {
  const patch = handle.get(node);
  if (patch?.status !== "ready") throw new Error(`Expected ${node} to be ready.`);
  return patch.outputs.values as Row[];
}

describe("aggregate 3D IK through the engine", () => {
  it("AJ-12 publishes, ignores track naming, follows animation and refuses the old shape", () => {
    const rows = solved(open(project()));
    expect(rows.map((row) => row.id)).toEqual(["upper", "left"]);

    const renamed = open(
      project(
        { root: "origin", body: "skeleton", goals: "targets", pole: "bend", solve: "solve" },
        15,
        "other",
      ),
    );
    expect(solved(renamed, "other/solve")).toEqual(rows);

    const animated = open(
      project(undefined, [
        { p: 0, v: 15 },
        { p: 1, v: 40 },
      ]),
    );
    animated.seek("demo/goals", 0);
    const start = JSON.stringify(solved(animated));
    animated.seek("demo/goals", 1);
    expect(JSON.stringify(solved(animated))).not.toBe(start);

    const handle = open(project());
    const revision = handle.get("demo/solve")!.revision;
    const calls = solver.calls;
    const seen: unknown[] = [];
    const off = handle.subscribeNode("demo/solve", (patch) => seen.push(patch));
    handle.values((tx) => {
      tx.track("demo/body").input.values.setField({ row: "upper", field: "length" }, 55);
    });
    off();
    expect(solver.calls - calls).toBe(1);
    expect(seen).toHaveLength(1);
    expect(handle.get("demo/solve")!.revision).toBe(revision + 1);

    const old = structuredClone(project()) as any;
    old.motions[0].tracks[4].input.requires = {
      members: { upper: "body" },
      root: "root",
      goals: { g: "goals" },
    };
    expect(() => open(old as ProjectDefinition)).toThrow(/slot-unknown at demo\/solve/);

    const invalid = (edit: (tracks: any[]) => void) => {
      const definition = structuredClone(project()) as any;
      edit(definition.motions[0].tracks);
      return () => open(definition as ProjectDefinition);
    };
    expect(
      invalid((t) => {
        t[2].input.values[0].cells.joint = "banana";
      }),
    ).toThrow(/cell-form-invalid .*joint/);
    expect(
      invalid((t) => {
        t[2].input.values[0].cells.maxSwing = 500;
      }),
    ).toThrow(/cell-form-invalid .*maxSwing/);
    expect(
      invalid((t) => {
        t[2].input.values[0].cells.orient = 2;
      }),
    ).toThrow(/cell-form-invalid .*orient/);
    expect(
      invalid((t) => {
        t[2].input.values[0].cells.orient = [
          { p: 0, v: 0 },
          { p: 1, v: 1 },
        ];
      }),
    ).toThrow(/static-field-stops .*orient/);
    expect(
      invalid((t) => {
        t[3].input.values[0].cells.influence = 0;
      }),
    ).toThrow(/cell-form-invalid .*influence/);
  });
});

describe("aggregate 3D IK captured twins", () => {
  it("AJ-10 reproduces every case captured from the grouped plugin bit for bit", () => {
    expect(Object.keys(GOLDENS).length).toBeGreaterThanOrEqual(17);
    for (const [name, { input: twin, expected }] of Object.entries(GOLDENS)) {
      const result = ik3dPlugin.transform(
        {
          values: {},
          param: twin.values ?? { inspect: true },
          requires: {
            chain: twin.body,
            goals: twin.goals,
            base: twin.base,
            ...(twin.pole === undefined ? {} : { pole: { values: twin.pole } }),
          },
          structures: rigStructures(twin.body, twin.goals, true),
        } as never,
        CTX,
      );
      expect({ name, result }).toEqual({ name, result: expected });
    }
  });

  it("AJ-11 treats a member named root or base as an ordinary row", () => {
    const named = [
      { id: "root", cells: { length: 50 } },
      { id: "base", cells: { parentId: "root", length: 35 } },
    ];
    const plain = [
      { id: "a", cells: { length: 50 } },
      { id: "b", cells: { parentId: "a", length: 35 } },
    ];
    const goalFor = (member: string) => [
      { id: "g", cells: { memberId: member, x: 60, y: 20, z: 15 } },
    ];
    const cells = (chain: typeof named, member: string) =>
      rowsOf(run({ chain, goals: goalFor(member), pole: null })).map((row) => row.cells);
    expect(cells(named, "base")).toEqual(cells(plain, "b"));
  });
});
