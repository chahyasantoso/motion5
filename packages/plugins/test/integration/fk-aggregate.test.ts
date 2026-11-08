import { describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { ikPlugin } from "../../src/ik/ik";
import { fkPlugin } from "../../src/fk/fk";
import { BODY_2D_SPEC } from "../support/aggregate-topology";
import { Body2d, Point2d, Points2d, Solved2d, Goals2d } from "../../src/models/index";
import { bodyStructure, solvedStructure } from "../support/rig-input";
import { testModels } from "../../../core/test/support/test-models";
import { UNTIMED } from "@motion5/moves";

const composer = vi.hoisted(() => ({ calls: 0 }));
vi.mock("@motion5/rig", async (importOriginal) => {
  const original = await importOriginal<typeof import("@motion5/rig")>();
  return {
    ...original,
    composeWorld: (...args: Parameters<typeof original.composeWorld>) => {
      composer.calls += 1;
      return original.composeWorld(...args);
    },
  };
});

const CTX = { nodeId: "rig/pose", progress: 0, clock: UNTIMED };

type RawFkInput = {
  readonly values: unknown;
  readonly requires: {
    readonly chain: { readonly values: unknown };
    readonly solved?: { readonly values: unknown };
    readonly base: { readonly values: unknown };
  };
};

function runFk(raw: RawFkInput, _ctx?: unknown) {
  return fkPlugin.transform(
    {
      values: raw.values,
      requires: {
        chain: raw.requires.chain.values,
        ...(raw.requires.solved === undefined ? {} : { solved: raw.requires.solved.values }),
        base: raw.requires.base.values,
      },
      structures: {
        chain: bodyStructure(raw.requires.chain.values),
        ...(raw.requires.solved === undefined
          ? {}
          : { solved: solvedStructure(raw.requires.solved.values) }),
      },
    } as never,
    CTX,
  );
}

type Ids = { root: string; body: string; goals: string; solve: string; pose: string };
const IDS: Ids = {
  root: "root",
  body: "body",
  goals: "goals",
  solve: "solve",
  pose: "pose",
};

function project(ids: Ids = IDS, motion = "demo"): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "aggregate-fk",
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
              values: [{ id: "left-hand", cells: { memberId: "left-lower", x: 12, y: 8 } }],
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
          {
            id: ids.pose,
            output: { plugin: "fk" },
            input: {
              requires: { chain: ids.body, solved: ids.solve, base: ids.root },
            },
          },
        ],
      },
    ],
  } as unknown as ProjectDefinition;
}

function open(definition: ProjectDefinition) {
  const plugins = new PluginCatalog({ models: testModels });
  plugins.register({ plugins: [ikPlugin, fkPlugin] });
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(definition);
  const motion = definition.motions[0]!;
  for (const track of motion.tracks) handle.mount(`${motion.id}/${track.id}`);
  handle.seek(`${motion.id}/${IDS.pose}`, 0);
  return handle;
}

function poses(handle: ReturnType<typeof open>, node = "demo/pose") {
  const patch = handle.get(node);
  if (patch?.status !== "ready") throw new Error(`Expected ${node} to be ready.`);
  return patch.outputs.values as readonly { id: string; cells: Record<string, number> }[];
}

describe("aggregate 2D FK", () => {
  it("AK-1 declares chain, solved and base single slots and Points2d output", () => {
    const requires = fkPlugin.inputs.requires!;
    expect(Object.keys(requires)).toEqual(["chain", "solved", "base"]);
    expect(requires.chain).toBe(Body2d);
    expect(requires.base).toBe(Point2d);
    expect(requires.solved).toMatchObject({ optional: true, model: Solved2d });
    expect((requires as Record<string, unknown>).member).toBeUndefined();
    expect((requires as Record<string, unknown>).solver).toBeUndefined();
    expect(fkPlugin.outputs.values).toBe(Points2d);
    expect(Object.keys(fkPlugin.outputs)).toEqual(["values"]);
  });

  it("AK-2a evaluates to rest pose with weight 0 when solved is unbound", () => {
    const output = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [{ id: "bone", cells: { length: 10, rotation: 20, weight: 1 } }],
          },
          base: { values: { x: 5, y: 6, rotation: 30 } },
        },
      } as never,
      CTX,
    );
    expect(output).toEqual({
      values: [
        {
          id: "bone",
          cells: {
            x: 5 + 10 * Math.cos((50 * Math.PI) / 180),
            y: 6 + 10 * Math.sin((50 * Math.PI) / 180),
            rotation: 50,
          },
        },
      ],
    });
  });

  it("AK-2 single-bone golden parity matches fk-v5 bit for bit", () => {
    const output = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [{ id: "bone", cells: { length: 10, rotation: 20, weight: 0.5, x: 2, y: 1 } }],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 80 } }] },
          base: { values: { x: 5, y: 6, rotation: 30 } },
        },
      } as never,
      CTX,
    );
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
  });

  it("AK-3 multi-bone tree hierarchy composes child bones inheriting parent tip coordinates", () => {
    const output = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [
              { id: "upper", cells: { length: 50, rotation: 0, weight: 1 } },
              { id: "left", cells: { parentId: "upper", length: 35, rotation: 0, weight: 1 } },
              { id: "right", cells: { parentId: "upper", length: 30, rotation: 0, weight: 1 } },
            ],
          },
          solved: {
            values: [
              { id: "upper", cells: { rotation: 40 } },
              { id: "left", cells: { rotation: -30 } },
              { id: "right", cells: { rotation: 60 } },
            ],
          },
          base: { values: { x: 0, y: 0, rotation: 0 } },
        },
      } as never,
      CTX,
    );
    expect(output).toEqual({
      values: [
        {
          id: "upper",
          cells: {
            x: 38.302222155948904,
            y: 32.13938048432696,
            rotation: 40,
          },
        },
        {
          id: "left",
          cells: {
            x: 72.77049351137619,
            y: 38.21706670266953,
            rotation: 10,
          },
        },
        {
          id: "right",
          cells: {
            x: 33.092776825940994,
            y: 61.683613074693206,
            rotation: 100,
          },
        },
      ],
    });
  });

  it("AK-4 refuses a missing solved row with TypeError", () => {
    expect(() =>
      runFk(
        {
          values: {},
          requires: {
            chain: { values: [{ id: "bone", cells: { length: 10, rotation: 0 } }] },
            solved: { values: [{ id: "other", cells: { rotation: 10 } }] },
            base: { values: { x: 0, y: 0, rotation: 0 } },
          },
        } as never,
        CTX,
      ),
    ).toThrow('Solver row missing for member "bone".');
  });

  it("AK-4b refuses a missing solved row in prepare", () => {
    const structures = {
      chain: bodyStructure([
        { id: "root", cells: { length: 10, rotation: 0 } },
        { id: "bone", cells: { parentId: "root", length: 10, rotation: 0 } },
      ]),
      solved: solvedStructure([{ id: "root", cells: { rotation: 0 } }]),
    };
    const prepared = fkPlugin.prepare?.({ values: {}, param: {}, structures });
    expect(prepared?.ok).toBe(false);
    if (prepared?.ok === false) {
      expect(prepared.diagnostics[0]).toMatchObject({
        ruleId: "plugin-validation-failed",
        path: "solved",
      });
      expect(prepared.diagnostics[0]?.message).toContain('member "bone"');
    }
  });

  it("AK-5 refuses non-finite solved rotation at the model boundary", () => {
    expect(() =>
      runFk(
        {
          values: {},
          requires: {
            chain: { values: [{ id: "bone", cells: { length: 10, rotation: 0 } }] },
            solved: { values: [{ id: "bone", cells: { rotation: Number.NaN } }] },
            base: { values: { x: 0, y: 0, rotation: 0 } },
          },
        } as never,
        CTX,
      ),
    ).toThrow(/model-value-invalid/);

    expect(() =>
      runFk(
        {
          values: {},
          requires: {
            chain: { values: [{ id: "bone", cells: { length: 10, rotation: 0 } }] },
            solved: { values: [{ id: "bone", cells: { rotation: Number.POSITIVE_INFINITY } }] },
            base: { values: { x: 0, y: 0, rotation: 0 } },
          },
        } as never,
        CTX,
      ),
    ).toThrow(/model-value-invalid/);
  });

  it("AK-6 blends authored and solved rotation along short arc with clamping", () => {
    const solve = (weight: number | undefined, authored = 20, solved = 80) => {
      const output = runFk(
        {
          values: {},
          requires: {
            chain: {
              values: [
                {
                  id: "bone",
                  cells: {
                    length: 10,
                    rotation: authored,
                    ...(weight !== undefined ? { weight } : {}),
                  },
                },
              ],
            },
            solved: { values: [{ id: "bone", cells: { rotation: solved } }] },
            base: { values: { x: 0, y: 0, rotation: 0 } },
          },
        } as never,
        CTX,
      ) as unknown as { values: [{ cells: { rotation: number } }] };
      return output.values[0].cells.rotation;
    };
    expect(solve(undefined)).toBe(80);
    expect(solve(0)).toBe(20);
    expect(solve(1)).toBe(80);
    expect(solve(0.5)).toBe(50);
    expect(solve(1.5)).toBe(80);
    expect(solve(-0.5)).toBe(20);
    expect(solve(0.5, 170, -170)).toBeCloseTo(180, 10);
  });

  it("AK-7 applies pivot offsets in rotated parent space", () => {
    const withOffset = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [{ id: "bone", cells: { length: 10, rotation: 0, weight: 1, x: 2, y: 1 } }],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 0 } }] },
          base: { values: { x: 0, y: 0, rotation: 90 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: [{ cells: { x: number; y: number; rotation: number } }] };
    expect(withOffset.values[0].cells.x).toBeCloseTo(-1, 10);
    expect(withOffset.values[0].cells.y).toBeCloseTo(12, 10);
    expect(withOffset.values[0].cells.rotation).toBe(90);
  });

  it("AK-8 clamps zero or negative bone length to zero extent", () => {
    const zeroLen = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [{ id: "bone", cells: { length: 0, rotation: 45, x: 5, y: 10 } }],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 45 } }] },
          base: { values: { x: 0, y: 0, rotation: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: [{ cells: { x: number; y: number; rotation: number } }] };
    expect(zeroLen.values[0].cells.x).toBe(5);
    expect(zeroLen.values[0].cells.y).toBe(10);

    const negLen = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [{ id: "bone", cells: { length: -20, rotation: 45, x: 5, y: 10 } }],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 45 } }] },
          base: { values: { x: 0, y: 0, rotation: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: [{ cells: { x: number; y: number; rotation: number } }] };
    expect(negLen.values[0].cells.x).toBe(5);
    expect(negLen.values[0].cells.y).toBe(10);
  });

  it("AK-9 is independent of authored body row order", () => {
    const forward = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [
              { id: "upper", cells: { length: 50, rotation: 0, weight: 1 } },
              { id: "left", cells: { parentId: "upper", length: 35, rotation: 0, weight: 1 } },
              { id: "right", cells: { parentId: "upper", length: 30, rotation: 0, weight: 1 } },
            ],
          },
          solved: {
            values: [
              { id: "upper", cells: { rotation: 40 } },
              { id: "left", cells: { rotation: -30 } },
              { id: "right", cells: { rotation: 60 } },
            ],
          },
          base: { values: { x: 0, y: 0, rotation: 0 } },
        },
      } as never,
      CTX,
    );
    const reversed = runFk(
      {
        values: {},
        requires: {
          chain: {
            values: [
              { id: "right", cells: { parentId: "upper", length: 30, rotation: 0, weight: 1 } },
              { id: "left", cells: { parentId: "upper", length: 35, rotation: 0, weight: 1 } },
              { id: "upper", cells: { length: 50, rotation: 0, weight: 1 } },
            ],
          },
          solved: {
            values: [
              { id: "right", cells: { rotation: 60 } },
              { id: "upper", cells: { rotation: 40 } },
              { id: "left", cells: { rotation: -30 } },
            ],
          },
          base: { values: { x: 0, y: 0, rotation: 0 } },
        },
      } as never,
      CTX,
    );
    expect(reversed).toEqual(forward);
  });

  it("AK-10 publishes a ready pose table through the engine", () => {
    const rows = poses(open(project()));
    expect(rows.map((row) => row.id)).toEqual(["trunk", "left-upper", "left-lower"]);
    for (const row of rows) {
      expect(Number.isFinite(row.cells.x)).toBe(true);
      expect(Number.isFinite(row.cells.y)).toBe(true);
      expect(Number.isFinite(row.cells.rotation)).toBe(true);
    }
  });

  it("AK-11 is independent of source track ids and motion id", () => {
    const renamed = open(
      project(
        { root: "origin", body: "skeleton", goals: "targets", solve: "solver", pose: "pose" },
        "other",
      ),
    );
    expect(poses(renamed, "other/pose")).toEqual(poses(open(project())));
  });

  it("AK-12a refuses a source row-set change that strands the reader, and recovers when the chain is replaced", () => {
    const handle = open(project());
    expect(() =>
      handle.track("demo/body").input.replace({
        values: [
          { id: "trunk", cells: { length: 20, rotation: 0 } },
          { id: "left-upper", cells: { parentId: "trunk", length: 10, rotation: 0 } },
          { id: "left-lower", cells: { parentId: "left-upper", length: 10, rotation: 0 } },
          { id: "left-lower-2", cells: { parentId: "left-upper", length: 8, rotation: 0 } },
        ],
      }),
    ).toThrow(/ik-leaf-without-goal/);
    expect(poses(handle).map((row) => row.id)).toEqual(["trunk", "left-upper", "left-lower"]);

    handle.edit((transaction) => {
      transaction.track("demo/body").input.replace({
        values: [
          { id: "trunk", cells: { length: 20, rotation: 0 } },
          { id: "left-upper", cells: { parentId: "trunk", length: 10, rotation: 0 } },
          { id: "left-lower", cells: { parentId: "left-upper", length: 10, rotation: 0 } },
          { id: "left-lower-2", cells: { parentId: "left-upper", length: 8, rotation: 0 } },
        ],
      });
      transaction.track("demo/goals").input.replace({
        values: [
          { id: "left-hand", cells: { memberId: "left-lower", x: 12, y: 8 } },
          { id: "left-hand-2", cells: { memberId: "left-lower-2", x: 4, y: 12 } },
        ],
      });
    });
    expect(handle.get("demo/pose")?.status).toBe("ready");
    expect(poses(handle).map((row) => row.id)).toEqual([
      "trunk",
      "left-upper",
      "left-lower",
      "left-lower-2",
    ]);
  });

  it("AK-12 runs composition once and publishes once per value batch", () => {
    const handle = open(project());
    const before = poses(handle);
    const revision = handle.get("demo/pose")!.revision;
    const calls = composer.calls;
    const seen: unknown[] = [];
    const off = handle.subscribeNode("demo/pose", (patch) => seen.push(patch));
    handle.values((tx) => {
      tx.track("demo/body").input.values.setField({ row: "trunk", field: "length" }, 25);
    });
    off();
    // 3 bones * 2 composeWorld calls per bone = 6 calls per single transform pass
    expect(composer.calls - calls).toBe(6);
    expect(seen).toHaveLength(1);
    expect(handle.get("demo/pose")!.revision).toBe(revision + 1);
    expect(poses(handle)).not.toEqual(before);
  });
});
