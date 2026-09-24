import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { fk3dPlugin } from "../../src/plugins/fk3d";
import { ik3dPlugin } from "../../src/plugins/ik3d";
import { transform3dPlugin } from "../../src/plugins/transform3d";
import type { Patch } from "../../src/runtime/patch-registry";

function member(id: string, base: string, length: number): TrackDefinition {
  return {
    id,
    keyframes: { fk3d: { values: { length }, requires: { base, solver: "solve" } } },
  };
}

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
        {
          id: "goal",
          keyframes: {
            transform3d: {
              values: {
                x: [
                  { p: 0, v: 100 },
                  { p: 1, v: 110 },
                ],
                y: [
                  { p: 0, v: 20 },
                  { p: 1, v: 25 },
                ],
                z: [
                  { p: 0, v: 30 },
                  { p: 1, v: 35 },
                ],
              },
            },
          },
        },
        { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
        member("upper", "root", 80),
        member("fore", "upper", 60),
      ],
    },
  ],
};

function createRuntime() {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(PROJECT);
}

describe("3D seam through engine and DOM", () => {
  it("TH-14 reaches the DOM adapter with scalar CSS transforms", () => {
    const runtime = createRuntime();
    const patches = new Map<string, Patch>();
    const target: DomTarget = { style: {} };
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => target);
    for (const id of ["rig/root", "rig/goal", "rig/solve", "rig/upper", "rig/fore"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    runtime.seek("rig/goal", 0);
    for (const patch of patches.values()) if (patch.status === "ready") adapter.apply(patch);
    const solve = patches.get("rig/solve");
    expect(solve?.status).toBe("ready");
    if (solve?.status !== "ready") throw new Error("3D solve did not publish");
    expect(solve.values.rotations3d).toBeDefined();
    expect(target.style.transform).toContain("translate3d(");
    expect(target.style.transform).toContain(" rotate(");
    expect(target.style.transform).toContain(" rotateX(");
    expect(target.style.transform).toContain(" rotateY(");
  });

  it("TH-15 propagates a goal edit through solver and member patches", () => {
    const runtime = createRuntime();
    const revisions = new Map<string, number>();
    for (const id of ["rig/root", "rig/goal", "rig/solve", "rig/upper", "rig/fore"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => {
        if (patch.status === "ready") revisions.set(id, patch.revision);
      });
    }
    runtime.seek("rig/goal", 0);
    const initial = new Map(revisions);
    runtime.seek("rig/goal", 1);
    // The goal moved, so it and every node downstream of it republish; the root reads nothing
    // that moved and must not.
    for (const id of ["rig/goal", "rig/solve", "rig/upper", "rig/fore"]) {
      expect(initial.get(id)).toBeDefined();
      expect(revisions.get(id)).toBeGreaterThan(initial.get(id) ?? Number.POSITIVE_INFINITY);
    }
    expect(revisions.get("rig/root")).toBe(initial.get("rig/root"));
  });
});
