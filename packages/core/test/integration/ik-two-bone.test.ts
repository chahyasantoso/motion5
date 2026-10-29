import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget, type StageLike } from "../../src/adapters/dom";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeScheduler } from "../../src/testing/fakes";
import { createRealGsapSeam } from "../support/real-gsap";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { fkPlugin } from "@motion5/plugins/fk";
import { ikPlugin } from "@motion5/plugins/ik";
import { transformPlugin } from "@motion5/plugins/transform";

const SIX_NODE_IK_PROJECT: ProjectDefinition = {
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
        {
          id: "goals",
          input: {
            values: [{ id: "hand-target", cells: { memberId: "hand", x: 320, y: 340 } }],
          },
        },
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

describe("Two-bone IK Integration (Slice C3)", () => {
  it("IK-13 full flush over six-node rig: forearm tip reaches target and hand follows", () => {
    const runtime = createEngine(SIX_NODE_IK_PROJECT);
    const patches = new Map<string, Patch>();

    for (const trackId of [
      "walker/shoulder",
      "walker/body",
      "walker/goals",
      "walker/arm-solve",
      "walker/pose",
    ]) {
      runtime.mount(trackId);
      runtime.subscribeNode(trackId, (p) => patches.set(trackId, p));
    }

    runtime.seek("walker/pose", 0);

    const solverPatch = patches.get("walker/arm-solve");
    expect(solverPatch?.status).toBe("ready");

    const posePatch = patches.get("walker/pose");
    expect(posePatch?.status).toBe("ready");
    if (posePatch?.status !== "ready")
      throw new Error(`posePatch is ${posePatch?.status ?? "absent"}, not ready.`);
    const rows = posePatch.outputs.values as readonly any[];
    const upperArm = rows.find((r) => r.id === "upper-arm")?.cells;
    const forearm = rows.find((r) => r.id === "forearm")?.cells;
    const hand = rows.find((r) => r.id === "hand")?.cells;

    expect(forearm).toBeDefined();
    expect(forearm.x).toBeCloseTo(320, 1);
    expect(forearm.y).toBeCloseTo(340, 1);

    expect(upperArm).toBeDefined();
    expect(upperArm.rotation).toBeCloseTo(40.168, 2);

    expect(hand).toBeDefined();
    expect(typeof hand.x).toBe("number");
    expect(typeof hand.y).toBe("number");
  });

  it("IK-15 animating target across ticks moves solved bones smoothly with correct revisions", () => {
    const animatedProject: ProjectDefinition = {
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
            {
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
            },
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

    const runtime = createEngine(animatedProject);
    let posePatch: Patch | undefined;
    for (const id of [
      "walker/shoulder",
      "walker/body",
      "walker/goals",
      "walker/arm-solve",
      "walker/pose",
    ]) {
      runtime.mount(id);
    }
    runtime.subscribeNode("walker/pose", (p) => {
      posePatch = p;
    });

    runtime.seek("walker/goals", 0);
    runtime.seek("walker/pose", 0);
    if (posePatch?.status !== "ready")
      throw new Error(`posePatch is ${posePatch?.status ?? "absent"}, not ready.`);
    const rows0 = posePatch.outputs.values as readonly any[];
    const x0 = rows0.find((r) => r.id === "forearm")?.cells.x as number;

    runtime.seek("walker/goals", 1);
    runtime.seek("walker/pose", 1);
    const rows1 = posePatch.outputs.values as readonly any[];
    const x1 = rows1.find((r) => r.id === "forearm")?.cells.x as number;

    expect(x0).toBeDefined();
    expect(x1).toBeDefined();
    expect(x1).not.toEqual(x0);
  });

  it("IK-16 DOM adapter skips a nested composite and writes nothing for a solver node", () => {
    const stage: StageLike = { style: {} };
    const target: DomTarget = { style: {} };
    const dom = createDomPatchAdapter(stage, undefined, () => target);

    const solverPatch: Patch = {
      nodeId: "walker/arm-solve",
      revision: 1,
      status: "ready",
      sourceProgress: 0,
      sourceRevisions: {},
      diagnostics: [],
      outputs: {
        values: [
          { id: "upper-arm", cells: { rotation: 30 } },
          { id: "forearm", cells: { rotation: 45 } },
        ],
      },
    };

    dom.apply(solverPatch);

    expect(target.rotations).toBeUndefined();
    expect(stage.rotations).toBeUndefined();
    expect(Object.keys(target.style)).toEqual([]);

    const written: Readonly<Record<string, unknown>>[] = [];
    const recording = createDomPatchAdapter(
      stage,
      undefined,
      () => target,
      (_t, values) => {
        written.push(values);
      },
    );
    recording.apply(solverPatch);
    expect(written).toEqual([]);
  });

  it("IK-17 handle.get for solver node returns solved rotations record", () => {
    const runtime = createEngine(SIX_NODE_IK_PROJECT);
    for (const id of [
      "walker/shoulder",
      "walker/body",
      "walker/goals",
      "walker/arm-solve",
      "walker/pose",
    ]) {
      runtime.mount(id);
    }
    runtime.seek("walker/arm-solve", 0);

    const solverHandle = runtime.get("walker/arm-solve");
    expect(solverHandle).toBeDefined();
    if (solverHandle?.status !== "ready")
      throw new Error(`solverHandle is ${solverHandle?.status ?? "absent"}, not ready.`);
    expect(solverHandle.outputs.values).toBeDefined();
  });
});
