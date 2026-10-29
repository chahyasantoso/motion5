import { describe, expect, it, vi } from "vitest";
import { Engine, PluginCatalog, createManualClock, type ProjectDefinition } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { ik3dPlugin } from "../../src/ik3d";
import { fk3dPlugin } from "../../src/fk3d";
import { BODY_3D_SPEC, GOALS_3D_SPEC, POSE_3D_SPEC } from "../../src/aggregate-topology";

const composer = vi.hoisted(() => ({ calls: 0 }));
vi.mock("../../src/frame3d", async (importOriginal) => {
  const original = await importOriginal<typeof import("../../src/frame3d")>();
  return {
    ...original,
    composeWorld3d: (...args: Parameters<typeof original.composeWorld3d>) => {
      composer.calls += 1;
      return original.composeWorld3d(...args);
    },
  };
});

const CTX = { nodeId: "rig/pose", progress: 0 };

type Ids = { root: string; pole: string; body: string; goals: string; solve: string; pose: string };
const IDS: Ids = {
  root: "root",
  pole: "pole",
  body: "body",
  goals: "goals",
  solve: "solve",
  pose: "pose",
};

function project(ids: Ids = IDS, motion = "demo"): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "aggregate-fk3d",
    motions: [
      {
        id: motion,
        trigger: { type: "manual" },
        tracks: [
          {
            id: ids.root,
            input: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
          },
          { id: ids.pole, input: { values: { x: 0, y: 0, z: 100 } } },
          {
            id: ids.body,
            input: {
              schema: BODY_3D_SPEC,
              values: [
                { id: "trunk", cells: { length: 20 } },
                { id: "left-upper", cells: { parentId: "trunk", length: 10 } },
                { id: "left-lower", cells: { parentId: "left-upper", length: 10 } },
              ],
            },
          },
          {
            id: ids.goals,
            input: {
              schema: GOALS_3D_SPEC,
              values: [{ id: "left-hand", cells: { memberId: "left-lower", x: 12, y: 8, z: 5 } }],
            },
          },
          {
            id: ids.solve,
            plugin: "ik3d",
            input: {
              values: { inspect: false },
              requires: { chain: ids.body, goals: ids.goals, base: ids.root, pole: ids.pole },
            },
          },
          {
            id: ids.pose,
            plugin: "fk3d",
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
  plugins.registerAll([ik3dPlugin, fk3dPlugin]);
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

describe("aggregate 3D FK", () => {
  it("AL-1 declares chain, solved and base single slots and POSE_3D_SPEC output", () => {
    const requires = fk3dPlugin.inputs.requires!;
    expect(Object.keys(requires)).toEqual(["chain", "solved", "base"]);
    for (const slot of Object.values(requires)) expect(slot.binding).toBeUndefined();
    expect((requires as Record<string, unknown>).member).toBeUndefined();
    expect((requires as Record<string, unknown>).solver).toBeUndefined();
    expect(fk3dPlugin.outputs.values).toEqual(POSE_3D_SPEC);
    expect(Object.keys(fk3dPlugin.outputs)).toEqual(["values"]);
  });

  it("AL-2 single-bone golden parity matches fk3d-v5 bit for bit", () => {
    const output = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [
              {
                id: "bone",
                cells: {
                  length: 10,
                  rotation: 20,
                  rotationX: -10,
                  rotationY: 15,
                  weight: 0.5,
                  x: 2,
                  y: 1,
                  z: -3,
                },
              },
            ],
          },
          solved: {
            values: [
              {
                id: "bone",
                cells: { rotation: 80, rotationX: 25, rotationY: -40 },
              },
            ],
          },
          base: {
            values: { x: 5, y: 6, z: 7, rotation: 30, rotationX: 5, rotationY: -20 },
          },
        },
      } as never,
      CTX,
    );
    expect(output).toEqual({
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

  it("AL-3 multi-bone 3D tree hierarchy composes child bones inheriting parent tip coordinates", () => {
    const output = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [
              {
                id: "upper",
                cells: { length: 50, rotation: 30, rotationX: 0, rotationY: 0, weight: 1 },
              },
              {
                id: "left",
                cells: {
                  parentId: "upper",
                  length: 35,
                  rotation: 0,
                  rotationX: 45,
                  rotationY: 0,
                  weight: 1,
                },
              },
              {
                id: "right",
                cells: {
                  parentId: "upper",
                  length: 30,
                  rotation: -30,
                  rotationX: 0,
                  rotationY: 20,
                  weight: 1,
                },
              },
            ],
          },
          solved: {
            values: [
              { id: "upper", cells: { rotation: 30, rotationX: 0, rotationY: 0 } },
              { id: "left", cells: { rotation: 0, rotationX: 45, rotationY: 0 } },
              { id: "right", cells: { rotation: -30, rotationX: 0, rotationY: 20 } },
            ],
          },
          base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: { id: string; cells: Record<string, number> }[] };
    expect(output.values).toHaveLength(3);
    const upper = output.values.find((r) => r.id === "upper")!;
    const left = output.values.find((r) => r.id === "left")!;
    const right = output.values.find((r) => r.id === "right")!;
    expect(upper.cells.x).toBeCloseTo(50 * Math.cos((30 * Math.PI) / 180), 5);
    expect(upper.cells.y).toBeCloseTo(50 * Math.sin((30 * Math.PI) / 180), 5);
    expect(upper.cells.z).toBeCloseTo(0, 5);
    expect(left.cells.x).not.toBe(0);
    expect(right.cells.x).not.toBe(0);
  });

  it("AL-4 refuses a missing solved row with TypeError", () => {
    expect(() =>
      fk3dPlugin.transform(
        {
          values: {},
          requires: {
            chain: { values: [{ id: "bone", cells: { length: 10 } }] },
            solved: {
              values: [{ id: "other", cells: { rotation: 10, rotationX: 0, rotationY: 0 } }],
            },
            base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
          },
        } as never,
        CTX,
      ),
    ).toThrow('FK3d solver row missing for member "bone".');
  });

  it("AL-5 refuses non-finite solved orientation with TypeError", () => {
    for (const key of ["rotation", "rotationX", "rotationY"] as const) {
      for (const badValue of [Number.NaN, Number.POSITIVE_INFINITY]) {
        expect(() =>
          fk3dPlugin.transform(
            {
              values: {},
              requires: {
                chain: { values: [{ id: "bone", cells: { length: 10 } }] },
                solved: {
                  values: [
                    {
                      id: "bone",
                      cells: {
                        rotation: 0,
                        rotationX: 0,
                        rotationY: 0,
                        [key]: badValue,
                      },
                    },
                  ],
                },
                base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
              },
            } as never,
            CTX,
          ),
        ).toThrow('FK3d solver row for member "bone" has no finite orientation.');
      }
    }
  });

  it("AL-6 blends authored rest and solved orientation via blendOrientation3d", () => {
    const solve = (weight: number | undefined) => {
      const output = fk3dPlugin.transform(
        {
          values: {},
          requires: {
            chain: {
              values: [
                {
                  id: "bone",
                  cells: {
                    length: 10,
                    rotation: 10,
                    rotationX: 20,
                    rotationY: 30,
                    ...(weight !== undefined ? { weight } : {}),
                  },
                },
              ],
            },
            solved: {
              values: [
                {
                  id: "bone",
                  cells: { rotation: 50, rotationX: -10, rotationY: -20 },
                },
              ],
            },
            base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
          },
        } as never,
        CTX,
      ) as unknown as {
        values: [{ cells: { rotation: number; rotationX: number; rotationY: number } }];
      };
      return output.values[0].cells;
    };
    const w0 = solve(0);
    expect(w0.rotation).toBeCloseTo(10, 5);
    expect(w0.rotationX).toBeCloseTo(20, 5);
    expect(w0.rotationY).toBeCloseTo(30, 5);

    const w1 = solve(1);
    expect(w1.rotation).toBeCloseTo(50, 5);
    expect(w1.rotationX).toBeCloseTo(-10, 5);
    expect(w1.rotationY).toBeCloseTo(-20, 5);

    const wDef = solve(undefined);
    expect(wDef.rotation).toBeCloseTo(50, 5);
    expect(wDef.rotationX).toBeCloseTo(-10, 5);
    expect(wDef.rotationY).toBeCloseTo(-20, 5);

    const wHalf = solve(0.5);
    expect(wHalf.rotation).toBeGreaterThan(10);
    expect(wHalf.rotation).toBeLessThan(50);

    expect(solve(-0.5)).toEqual(w0);
    expect(solve(1.5)).toEqual(w1);
  });

  it("AL-7 applies 3D pivot offsets in rotated parent space", () => {
    const withOffset = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [{ id: "bone", cells: { length: 10, x: 2, y: 3, z: 4, weight: 1 } }],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 0, rotationX: 0, rotationY: 0 } }] },
          base: { values: { x: 0, y: 0, z: 0, rotation: 90, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: [{ cells: { x: number; y: number; z: number; rotation: number } }] };
    expect(withOffset.values[0].cells.x).toBeCloseTo(-3, 10);
    expect(withOffset.values[0].cells.y).toBeCloseTo(12, 10);
    expect(withOffset.values[0].cells.z).toBeCloseTo(4, 10);
    expect(withOffset.values[0].cells.rotation).toBe(90);
  });

  it("AL-8 clamps zero or negative bone length to zero extent", () => {
    const zeroLen = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [
              {
                id: "bone",
                cells: { length: 0, rotation: 0, rotationX: 0, rotationY: 0, x: 5, y: 10, z: 15 },
              },
            ],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 0, rotationX: 0, rotationY: 0 } }] },
          base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: [{ cells: { x: number; y: number; z: number } }] };
    expect(zeroLen.values[0].cells.x).toBe(5);
    expect(zeroLen.values[0].cells.y).toBe(10);
    expect(zeroLen.values[0].cells.z).toBe(15);

    const negLen = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [
              {
                id: "bone",
                cells: { length: -20, rotation: 0, rotationX: 0, rotationY: 0, x: 5, y: 10, z: 15 },
              },
            ],
          },
          solved: { values: [{ id: "bone", cells: { rotation: 0, rotationX: 0, rotationY: 0 } }] },
          base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: [{ cells: { x: number; y: number; z: number } }] };
    expect(negLen.values[0].cells.x).toBe(5);
    expect(negLen.values[0].cells.y).toBe(10);
    expect(negLen.values[0].cells.z).toBe(15);
  });

  it("AL-9 is independent of authored body row order", () => {
    const forward = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [
              {
                id: "upper",
                cells: { length: 50, rotation: 0, rotationX: 0, rotationY: 0, weight: 1 },
              },
              {
                id: "left",
                cells: {
                  parentId: "upper",
                  length: 35,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                  weight: 1,
                },
              },
              {
                id: "right",
                cells: {
                  parentId: "upper",
                  length: 30,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                  weight: 1,
                },
              },
            ],
          },
          solved: {
            values: [
              { id: "upper", cells: { rotation: 40, rotationX: 10, rotationY: 5 } },
              { id: "left", cells: { rotation: -30, rotationX: -5, rotationY: 15 } },
              { id: "right", cells: { rotation: 60, rotationX: 20, rotationY: -10 } },
            ],
          },
          base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    );
    const reversed = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: {
            values: [
              {
                id: "right",
                cells: {
                  parentId: "upper",
                  length: 30,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                  weight: 1,
                },
              },
              {
                id: "left",
                cells: {
                  parentId: "upper",
                  length: 35,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                  weight: 1,
                },
              },
              {
                id: "upper",
                cells: { length: 50, rotation: 0, rotationX: 0, rotationY: 0, weight: 1 },
              },
            ],
          },
          solved: {
            values: [
              { id: "right", cells: { rotation: 60, rotationX: 20, rotationY: -10 } },
              { id: "upper", cells: { rotation: 40, rotationX: 10, rotationY: 5 } },
              { id: "left", cells: { rotation: -30, rotationX: -5, rotationY: 15 } },
            ],
          },
          base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    );
    expect(reversed).toEqual(forward);
  });

  it("AL-10 publishes a ready pose table through the engine", () => {
    const rows = poses(open(project()));
    expect(rows.map((row) => row.id)).toEqual(["trunk", "left-upper", "left-lower"]);
    for (const row of rows) {
      expect(Number.isFinite(row.cells.x)).toBe(true);
      expect(Number.isFinite(row.cells.y)).toBe(true);
      expect(Number.isFinite(row.cells.z)).toBe(true);
      expect(Number.isFinite(row.cells.rotation)).toBe(true);
      expect(Number.isFinite(row.cells.rotationX)).toBe(true);
      expect(Number.isFinite(row.cells.rotationY)).toBe(true);
    }
  });

  it("AL-11 evaluates a 14-member body table in a single whole-table pass", () => {
    const memberIds = Array.from({ length: 14 }, (_, index) => `bone-${index}`);
    const chain = memberIds.map((id, index) => ({
      id,
      cells: {
        ...(index > 0 ? { parentId: memberIds[index - 1] } : {}),
        length: 5,
        rotation: 5,
        rotationX: 2,
        rotationY: -2,
        weight: 1,
      },
    }));
    const solved = memberIds.map((id) => ({
      id,
      cells: { rotation: 10, rotationX: 5, rotationY: -5 },
    }));
    const calls = composer.calls;
    const result = fk3dPlugin.transform(
      {
        values: {},
        requires: {
          chain: { values: chain },
          solved: { values: solved },
          base: { values: { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
      } as never,
      CTX,
    ) as unknown as { values: { id: string; cells: Record<string, number> }[] };
    expect(result.values).toHaveLength(14);
    // 14 members * 2 composeWorld3d calls = 28 calls in a single transform pass
    expect(composer.calls - calls).toBe(28);
  });

  it("AL-12 runs composition once and publishes once per value batch", () => {
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
    // 3 bones * 2 composeWorld3d calls per bone = 6 calls per single transform pass
    expect(composer.calls - calls).toBe(6);
    expect(seen).toHaveLength(1);
    expect(handle.get("demo/pose")!.revision).toBe(revision + 1);
    expect(poses(handle)).not.toEqual(before);
  });
});
