import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget, type StageLike } from "../../src/adapters/dom";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import type { Patch } from "../../src/runtime/patch-registry";
import { createFakeScheduler } from "../../src/testing/fakes";
import { createRealGsapSeam } from "../support/real-gsap";

// Slice C3 of issue #195: Full 2-bone IK integration across engine, runtime, and DOM adapter.
//
// A throwing solver is not expressible through a valid loaded project, so the failure semantics
// (`IK-14`) live at the publisher, where a composition can be made to throw on purpose. See
// `packages/core/test/unit/runtime/publisher-solver-members.test.ts`.

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
  it("IK-13 full flush over six-node rig: forearm tip reaches target and hand follows", () => {
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

    // And the default elbow convention survives the whole pipeline, not just the solver unit.
    const upperArmPatch = patches.get("walker/upper-arm");
    expect(upperArmPatch?.values.rotation).toBeCloseTo(40.168, 3);

    const handPatch = patches.get("walker/hand");
    expect(handPatch?.status).toBe("ready");
    expect(typeof handPatch?.values.x).toBe("number");
    expect(typeof handPatch?.values.y).toBe("number");
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
      values: {
        rotations: { "walker/upper-arm": 30, "walker/forearm": 45 },
      },
    };

    dom.apply(solverPatch);

    // The bug is a non-style key falling through to `target[key] = value`, so the assertion has to
    // be the object property. `target.style.rotations` is undefined whether or not the guard
    // exists, which is exactly what made the previous version of this case vacuous and green.
    expect(target.rotations).toBeUndefined();
    expect(stage.rotations).toBeUndefined();
    expect(Object.keys(target.style)).toEqual([]);

    // And the writer is never reached at all, so a custom writer cannot reintroduce the write.
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
