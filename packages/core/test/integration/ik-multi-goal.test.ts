import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { transformPlugin } from "@motion5/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeScheduler } from "../../src/testing/fakes";
import { createRealGsapSeam } from "../support/real-gsap";

function goalRig(goalsTrack: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "walker",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "shoulder",
            input: { values: { x: 200, y: 300, rotation: 0 } },
          },
          {
            id: "body",
            input: {
              values: [
                { id: "upper-arm", cells: { length: 80, rotation: 0 } },
                { id: "forearm", cells: { parentId: "upper-arm", length: 60, rotation: 0 } },
                { id: "hand", cells: { parentId: "forearm", length: 0, rotation: 0 } },
              ],
            },
          },
          goalsTrack,
          {
            id: "arm-solve",
            plugin: "ik",
            input: {
              values: {},
              requires: { chain: "body", goals: "goals", base: "shoulder" },
            },
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
}

const STATIC_GOAL = goalRig({
  id: "goals",
  input: {
    values: [{ id: "hand-target", cells: { memberId: "hand", x: 320, y: 340 } }],
  },
});

const ANIMATED_GOAL = goalRig({
  id: "goals",
  input: {
    values: [
      {
        id: "hand-target",
        cells: {
          memberId: "hand",
          x: [
            { p: 0, v: 300 },
            { p: 1, v: 330 },
          ],
          y: [
            { p: 0, v: 300 },
            { p: 1, v: 340 },
          ],
        },
      },
    ],
  },
});

const NODE_IDS = [
  "walker/shoulder",
  "walker/body",
  "walker/goals",
  "walker/arm-solve",
  "walker/pose",
];

function createEngine(project: ProjectDefinition) {
  const seam = createRealGsapSeam();
  const plugins = new PluginCatalog();
  plugins.registerAll([transformPlugin, fkPlugin, ikPlugin]);
  return new Engine({
    clock: createManualClock(),
    interpolator: seam.interpolator,
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("goal-addressed IK integration (Slice D1)", () => {
  it("MG-12 the worked rig re-expressed with a goal dict solves to the same two numbers", () => {
    const runtime = createEngine(STATIC_GOAL);
    const patches = new Map<string, Patch>();
    for (const id of NODE_IDS) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }

    runtime.seek("walker/pose", 0);

    const solver = patches.get("walker/arm-solve");
    expect(solver?.status).toBe("ready");
    if (solver?.status !== "ready")
      throw new Error(`solver is ${solver?.status ?? "absent"}, not ready.`);
    const rows = solver.outputs.values as readonly any[];
    const upperArmRot = rows.find((r) => r.id === "upper-arm")?.cells.rotation;
    const forearmRot = rows.find((r) => r.id === "forearm")?.cells.rotation;
    expect(upperArmRot).toBeCloseTo(40.168, 2);
    expect(forearmRot).toBeCloseTo(-51.318, 2);

    const pose = patches.get("walker/pose");
    expect(pose?.status).toBe("ready");
    if (pose?.status !== "ready")
      throw new Error(`pose is ${pose?.status ?? "absent"}, not ready.`);
    const poseRows = pose.outputs.values as readonly any[];
    const forearm = poseRows.find((r) => r.id === "forearm")?.cells;
    expect(forearm).toBeDefined();
    expect(forearm.x).toBeCloseTo(320, 1);
    expect(forearm.y).toBeCloseTo(340, 1);

    expect(poseRows.find((r) => r.id === "hand")).toBeDefined();
  });

  it("MG-13 seeding the goal node alone re-solves the whole chain", () => {
    const runtime = createEngine(ANIMATED_GOAL);
    for (const id of NODE_IDS) runtime.mount(id);
    let posePatch: Patch | undefined;
    runtime.subscribeNode("walker/pose", (patch) => {
      posePatch = patch;
    });

    runtime.seek("walker/goals", 0);
    runtime.seek("walker/pose", 0);
    if (posePatch?.status !== "ready")
      throw new Error(`posePatch is ${posePatch?.status ?? "absent"}, not ready.`);
    const rows0 = posePatch.outputs.values as readonly any[];
    const first = Number(rows0.find((r) => r.id === "forearm")?.cells.x);

    runtime.seek("walker/goals", 1);
    runtime.seek("walker/pose", 1);
    const rows1 = posePatch.outputs.values as readonly any[];
    const second = Number(rows1.find((r) => r.id === "forearm")?.cells.x);

    expect(Number.isFinite(first)).toBe(true);
    expect(Number.isFinite(second)).toBe(true);
    expect(second).not.toEqual(first);
  });
});
