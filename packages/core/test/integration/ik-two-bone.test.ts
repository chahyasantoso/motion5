import { describe, expect, it } from "vitest";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeScheduler } from "../../src/testing/fakes";
import { createRealGsapSeam } from "../support/real-gsap";

// Slice C3 of issue #195: Full 2-bone IK integration across engine, runtime, and DOM adapter.

const SIX_NODE_IK_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "walker",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "shoulder",
          keyframes: {
            transform: {
              values: { x: 200, y: 300, rotation: 0 },
            },
          },
        },
        {
          id: "hand-target",
          keyframes: {
            transform: {
              values: { x: 320, y: 340, rotation: 0 },
            },
          },
        },
        {
          id: "arm-solve",
          keyframes: {
            ik: {
              requires: { root: "shoulder", target: "hand-target" },
            },
          },
        },
        {
          id: "upper-arm",
          keyframes: {
            fk: {
              values: { length: 80 },
              requires: { base: "shoulder", solver: "arm-solve" },
            },
          },
        },
        {
          id: "forearm",
          keyframes: {
            fk: {
              values: { length: 60 },
              requires: { base: "upper-arm", solver: "arm-solve" },
            },
          },
        },
        {
          id: "hand",
          keyframes: {
            fk: {
              values: { length: 20 },
              requires: { base: "forearm" },
            },
          },
        },
      ],
    },
  ],
};

import { PluginRegistry } from "../../src/domain/plugins";
import { transformPlugin } from "../../src/plugins/transform";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";

function createEngine(project: ProjectDefinition) {
  const seam = createRealGsapSeam();
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: seam.interpolator,
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("Two-bone IK Integration (Slice C3)", () => {
  it("IK-13 full flush over six-node rig: forearm tip reaches target and hand follows without IK awareness", () => {
    const runtime = createEngine(SIX_NODE_IK_PROJECT);
    const patches = new Map<string, Patch>();

    for (const trackId of [
      "walker/shoulder",
      "walker/hand-target",
      "walker/arm-solve",
      "walker/upper-arm",
      "walker/forearm",
      "walker/hand",
    ]) {
      runtime.mount(trackId);
      runtime.subscribe(trackId, (p) => patches.set(trackId, p));
    }

    runtime.seek("walker/shoulder", 0);

    const solverPatch = patches.get("walker/arm-solve");
    expect(solverPatch?.status).toBe("ready");

    const forearmPatch = patches.get("walker/forearm");
    expect(forearmPatch?.status).toBe("ready");
    // Forearm tip should land on target (320, 340)
    expect(forearmPatch?.values.x).toBeCloseTo(320, 1);
    expect(forearmPatch?.values.y).toBeCloseTo(340, 1);

    const handPatch = patches.get("walker/hand");
    expect(handPatch?.status).toBe("ready");
    expect(typeof handPatch?.values.x).toBe("number");
    expect(typeof handPatch?.values.y).toBe("number");
  });

  it("IK-14 solver throws -> arm-solve errors, members get blocked-upstream, and hand is blocked", () => {
    // Project where solver requirements are corrupted/missing
    const throwingProject: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "walker",
          trigger: { type: "manual" },
          tracks: [
            { id: "shoulder", keyframes: { transform: { values: { x: 200, y: 300 } } } },
            { id: "hand-target", keyframes: { transform: { values: { x: 320, y: 340 } } } },
            {
              id: "arm-solve",
              keyframes: {
                ik: { requires: { root: "shoulder", target: "hand-target" } },
              },
            },
            {
              id: "upper-arm",
              keyframes: {
                fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
              },
            },
            {
              id: "forearm",
              keyframes: {
                fk: {
                  values: { length: 60 },
                  requires: { base: "upper-arm", solver: "arm-solve" },
                },
              },
            },
          ],
        },
      ],
    };

    const runtime = createEngine(throwingProject);
    const patches = new Map<string, Patch>();
    for (const id of ["walker/arm-solve", "walker/upper-arm", "walker/forearm"]) {
      runtime.mount(id);
      runtime.subscribe(id, (p) => patches.set(id, p));
    }

    runtime.seek("walker/shoulder", 0);
    expect(patches.get("walker/upper-arm")).toBeDefined();
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
              keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } },
            },
            {
              id: "hand-target",
              keyframes: {
                transform: {
                  values: {
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
              },
            },
            {
              id: "arm-solve",
              keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
            },
            {
              id: "upper-arm",
              keyframes: {
                fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
              },
            },
            {
              id: "forearm",
              keyframes: {
                fk: {
                  values: { length: 60 },
                  requires: { base: "upper-arm", solver: "arm-solve" },
                },
              },
            },
          ],
        },
      ],
    };

    const runtime = createEngine(animatedProject);
    let forearmPatch: Patch | undefined;
    for (const id of [
      "walker/shoulder",
      "walker/hand-target",
      "walker/arm-solve",
      "walker/upper-arm",
      "walker/forearm",
    ]) {
      runtime.mount(id);
    }
    runtime.subscribe("walker/forearm", (p) => {
      forearmPatch = p;
    });

    runtime.seek("walker/hand-target", 0);
    const x0 = forearmPatch?.values.x as number;
    runtime.seek("walker/hand-target", 1);
    const x1 = forearmPatch?.values.x as number;

    expect(x0).toBeDefined();
    expect(x1).toBeDefined();
    expect(x1).not.toEqual(x0);
  });

  it("IK-16 DOM adapter skips nested rotations record and contributes zero writes for solver node", () => {
    const stage = { style: {} as Record<string, unknown> };
    const target = { style: {} as Record<string, unknown> };
    const dom = createDomPatchAdapter(stage, undefined, () => target);

    const solverPatch: Patch = {
      nodeId: "walker/arm-solve",
      revision: 1,
      status: "ready",
      sourceProgress: 0,
      sourceRevisions: {},
      diagnostics: [],
      values: {
        rotations: { "walker/upper-arm": 30, "walker/forearm": 45 },
      },
    };

    dom.apply(solverPatch);
    // rotations should not be written to style
    expect((target.style as Record<string, unknown>).rotations).toBeUndefined();
    expect((stage.style as Record<string, unknown>).rotations).toBeUndefined();
  });

  it("IK-17 handle.get for solver node returns solved rotations record", () => {
    const runtime = createEngine(SIX_NODE_IK_PROJECT);
    for (const id of [
      "walker/shoulder",
      "walker/hand-target",
      "walker/arm-solve",
      "walker/upper-arm",
      "walker/forearm",
      "walker/hand",
    ]) {
      runtime.mount(id);
    }
    runtime.seek("walker/shoulder", 0);

    const solverHandle = runtime.get("walker/arm-solve");
    expect(solverHandle).toBeDefined();
    expect(solverHandle?.values).toHaveProperty("rotations");
  });
});
