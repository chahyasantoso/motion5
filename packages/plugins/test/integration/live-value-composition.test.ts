import { describe, expect, it } from "vitest";
import type { ProjectDefinition, ProjectHandle } from "@motion5/core";
import { PluginCatalog, Engine, createManualClock } from "@motion5/core";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";

const UPPER = "upper-arm";
const FOREARM = "forearm";
const TRACKS = [
  "walker/shoulder",
  "walker/body",
  "walker/goals",
  "walker/arm-solve",
  "walker/pose",
];

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "walker",
      trigger: { type: "manual" },
      tracks: [
        { id: "shoulder", input: { values: { x: 200, y: 300, rotation: 0 } } },
        {
          id: "body",
          input: {
            values: [
              { id: "upper-arm", cells: { length: 80, rotation: 0 } },
              { id: "forearm", cells: { parentId: "upper-arm", length: 60, rotation: 0 } },
            ],
          },
        },
        {
          id: "goals",
          input: {
            values: [{ id: "hand-target", cells: { memberId: "forearm", x: 320, y: 340 } }],
          },
        },
        {
          id: "arm-solve",
          plugin: "ik",
          input: { values: {}, requires: { chain: "body", goals: "goals", base: "shoulder" } },
        },
        {
          id: "pose",
          plugin: "fk",
          input: {
            values: {},
            requires: { chain: "body", solved: "arm-solve", base: "shoulder" },
          },
        },
      ],
    },
  ],
};

function seekAll(handle: ProjectHandle): void {
  for (const id of TRACKS) handle.seek(id, 0);
}

function load(): ProjectHandle {
  const plugins = new PluginCatalog();
  plugins.registerAll([fkPlugin, ikPlugin]);
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
  for (const id of TRACKS) handle.mount(id);
  seekAll(handle);
  return handle;
}

function boneValues(handle: ProjectHandle, boneId: string): Readonly<Record<string, number>> {
  const patch = handle.get("walker/pose");
  expect(patch?.status).toBe("ready");
  const values = (patch as any).outputs.values as readonly {
    readonly id: string;
    readonly cells: Record<string, number>;
  }[];
  const row = values.find((r) => r.id === boneId);
  expect(row).toBeDefined();
  return row!.cells;
}

function solved(handle: ProjectHandle): Readonly<Record<string, number>> {
  const patch = handle.get("walker/arm-solve");
  expect(patch?.status).toBe("ready");
  const values = (patch as any).outputs.values as readonly {
    readonly id: string;
    readonly cells: { readonly rotation: number };
  }[];
  const map: Record<string, number> = {};
  for (const row of values) {
    map[row.id] = row.cells.rotation;
  }
  return map;
}

describe("a masked value reaches composition and the publisher's MemberState", () => {
  it("LV-2 reaches both surfaces from one call", () => {
    const handle = load();
    const before = boneValues(handle, UPPER);
    expect(solved(handle)[UPPER]).toBeCloseTo(40.168, 3);

    handle.track("walker/body").input.values.set([
      { id: UPPER, cells: { length: 100, rotation: 0 } },
      { id: FOREARM, cells: { parentId: UPPER, length: 60, rotation: 0 } },
    ]);
    seekAll(handle);

    expect(boneValues(handle, UPPER)).not.toEqual(before);
    expect(solved(handle)[UPPER]).not.toBeCloseTo(40.168, 3);
    expect(boneValues(handle, FOREARM).x).toBeCloseTo(320, 1);
    expect(boneValues(handle, FOREARM).y).toBeCloseTo(340, 1);
    handle.dispose();
  });

  it("LV-3 makes a dependent IK solver recompute from the masked member", () => {
    const handle = load();
    const rotations = solved(handle);
    expect(rotations[UPPER]).toBeCloseTo(40.168, 3);
    expect(rotations[FOREARM]).toBeCloseTo(-51.318, 3);

    handle.track("walker/body").input.values.set([
      { id: UPPER, cells: { length: 80, rotation: 0 } },
      { id: FOREARM, cells: { parentId: UPPER, length: 100, rotation: 0 } },
    ]);
    seekAll(handle);

    expect(solved(handle)[UPPER]).not.toBeCloseTo(40.168, 3);
    expect(solved(handle)[FOREARM]).not.toBeCloseTo(-51.318, 3);
    expect(boneValues(handle, FOREARM).x).toBeCloseTo(320, 1);
    expect(boneValues(handle, FOREARM).y).toBeCloseTo(340, 1);
    handle.dispose();
  });

  it("LV-22 a live negative length composes zero extent, where the solve placed the bone", () => {
    const negative = load();
    negative.track("walker/body").input.values.set([
      { id: UPPER, cells: { length: -20, rotation: 0 } },
      { id: FOREARM, cells: { parentId: UPPER, length: 60, rotation: 0 } },
    ]);
    seekAll(negative);

    const zero = load();
    zero.track("walker/body").input.values.set([
      { id: UPPER, cells: { length: 0, rotation: 0 } },
      { id: FOREARM, cells: { parentId: UPPER, length: 60, rotation: 0 } },
    ]);
    seekAll(zero);

    expect(boneValues(negative, UPPER).x).toBe(200);
    expect(boneValues(negative, UPPER).y).toBe(300);
    expect(boneValues(negative, UPPER)).toEqual(boneValues(zero, UPPER));
    expect(boneValues(negative, FOREARM)).toEqual(boneValues(zero, FOREARM));

    const forearm = boneValues(negative, FOREARM);
    const direction = Math.atan2(340 - 300, 320 - 200);
    expect(forearm.x).toBeCloseTo(200 + 60 * Math.cos(direction), 9);
    expect(forearm.y).toBeCloseTo(300 + 60 * Math.sin(direction), 9);
    negative.dispose();
    zero.dispose();
  });
});
