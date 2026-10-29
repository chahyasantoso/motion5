import { describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { ikPlugin } from "../../src/ik";
import { fkPlugin } from "../../src/fk";
import { BODY_2D_SPEC, GOALS_2D_SPEC, POSE_2D_SPEC } from "../../src/aggregate-topology";

const composer = vi.hoisted(() => ({ calls: 0 }));
vi.mock("../../src/frame", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/frame")>();
  return {
    ...original,
    composeWorld: (...args: Parameters<typeof original.composeWorld>) => {
      composer.calls += 1;
      return original.composeWorld(...args);
    },
  };
});

const CTX = { nodeId: "rig/pose", progress: 0 };

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
              values: [{ id: "left-hand", cells: { memberId: "left-lower", x: 12, y: 8 } }],
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
          {
            id: ids.pose,
            plugin: "fk",
            input: {
              values: {},
              requires: { chain: ids.body, solved: ids.solve, base: ids.root },
            },
          },
        ],
      },
    ],
  } as unknown as ProjectDefinition;
}

function open(definition: ProjectDefinition) {
  const plugins = new PluginCatalog();
  plugins.registerAll([ikPlugin, fkPlugin]);
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
  it("AK-1 declares chain, solved and base single slots and POSE_2D_SPEC output", () => {
    const requires = fkPlugin.inputs.requires!;
    expect(Object.keys(requires)).toEqual(["chain", "solved", "base"]);
    for (const slot of Object.values(requires)) expect(slot.binding).toBeUndefined();
    expect((requires as Record<string, unknown>).member).toBeUndefined();
    expect((requires as Record<string, unknown>).solver).toBeUndefined();
    expect(fkPlugin.outputs.values).toEqual(POSE_2D_SPEC);
    expect(Object.keys(fkPlugin.outputs)).toEqual(["values"]);
  });

  it("AK-2 single-bone golden parity matches fk-v5 bit for bit", () => {
    const output = fkPlugin.transform(
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
    const output = fkPlugin.transform(
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
      fkPlugin.transform(
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

  it("AK-5 refuses non-finite solved rotation with TypeError", () => {
    expect(() =>
      fkPlugin.transform(
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
    ).toThrow('FK solver row for member "bone" has no finite rotation.');

    expect(() =>
      fkPlugin.transform(
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
    ).toThrow('FK solver row for member "bone" has no finite rotation.');
  });

  it("AK-6 blends authored and solved rotation along short arc with clamping", () => {
    const solve = (weight: number | undefined, authored = 20, solved = 80) => {
      const output = fkPlugin.transform(
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
    const withOffset = fkPlugin.transform(
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
    const zeroLen = fkPlugin.transform(
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

    const negLen = fkPlugin.transform(
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
    const forward = fkPlugin.transform(
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
    const reversed = fkPlugin.transform(
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
