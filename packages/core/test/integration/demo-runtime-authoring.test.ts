import { describe, expect, it, vi } from "vitest";
import {
  ALL_NODE_IDS,
  ARM,
  TENTACLE,
  armSolverTrack,
  frameTrack,
  ikPlaygroundProject,
  nodeId,
  tentacleSolverTrack,
} from "../../../../apps/ik-playground/src/ik-playground-project";
import {
  armTracks,
  coreWalkerTracks,
  initialWalkerProject,
} from "../../../../apps/react-demo/src/full-body-project";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine, type ProjectHandle } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { ikPlugin } from "../../src/plugins/ik";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

// Actual demo definitions through Engine. Controlled host ports replace the browser, not the
// runtime, plugins or publisher. Compare the new value edits with the previous full replacements.
function load(definition: ProjectDefinition) {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler,
    plugins,
  }).load(definition);
  const runtime = (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
  const flush = () => {
    for (let rounds = 0; scheduler.pending.length; rounds++) {
      if (rounds > 20) throw new Error("Scheduler did not settle.");
      scheduler.flush();
    }
  };
  return { handle, runtime, flush };
}

function playground() {
  const test = load(ikPlaygroundProject);
  for (const id of ALL_NODE_IDS) test.handle.mount(id);
  for (const rig of [ARM, TENTACLE]) {
    test.handle.seek(nodeId(rig.rootTrack), 0);
    test.handle.seek(nodeId(rig.goalTrack), 0);
  }
  test.flush();
  return test;
}

function expectSamePose(actual: ProjectHandle, reference: ProjectHandle) {
  for (const id of ALL_NODE_IDS) {
    expect(actual.get(id)?.status).toBe("ready");
    expect(actual.get(id)?.values).toEqual(reference.get(id)?.values);
  }
}

describe("demo runtime authoring", () => {
  it("adds and removes all walker arms in one graph commit and supports re-addition", () => {
    // Manual input substitutes for ScrollTrigger while retaining the actual animated tracks.
    const test = load({
      ...initialWalkerProject,
      motions: [{ id: "walk", trigger: { type: "manual" }, tracks: coreWalkerTracks }],
    });
    const { handle, runtime } = test;
    try {
      for (const track of coreWalkerTracks) handle.mount(`walk/${track.id}`);
      handle.signal("walk", { type: "manual", progress: 0.6 });
      test.flush();
      const chest = handle.get("walk/chest");
      const replace = vi.spyOn(runtime.graph, "replaceGraph");
      const invalidate = vi.spyOn(runtime.graph, "invalidate");
      for (let cycle = 0; cycle < 2; cycle++) {
        replace.mockClear();
        invalidate.mockClear();
        const arms = handle.edit((tx) => {
          const walk = tx.motion("walk");
          return armTracks.map((track) => walk.addTrack(track));
        });
        expect(replace).toHaveBeenCalledTimes(1);
        expect(invalidate).toHaveBeenCalledTimes(1);
        expect(handle.motion("walk").trackIds).toHaveLength(13);
        for (const arm of arms) {
          expect(arm.live).toBe(true);
          expect(handle.get(arm.id)?.status).toBe("ready");
          expect(handle.get(arm.id)?.sourceProgress).toBeCloseTo(0.6);
        }
        expect(handle.get("walk/chest")).toBe(chest);
        replace.mockClear();
        handle.edit(() => {
          for (const arm of [...arms].reverse()) arm.remove();
        });
        expect(replace).toHaveBeenCalledTimes(1);
        expect(handle.motion("walk").trackIds).toHaveLength(9);
        for (const arm of arms) expect(arm.live).toBe(false);
        for (const track of armTracks) {
          expect(handle.tryTrack(`walk/${track.id}`)).toBeUndefined();
        }
      }
      const arms = handle.edit((tx) => {
        const walk = tx.motion("walk");
        return armTracks.map((track) => walk.addTrack(track));
      });
      replace.mockClear();
      handle.dispose();
      expect(replace).not.toHaveBeenCalled();
      for (const arm of arms) expect(arm.live).toBe(false);
    } finally {
      handle.dispose();
    }
  });

  it.each([ARM, TENTACLE])("moves $label goals in one value flush without graph work", (rig) => {
    const actual = playground();
    const reference = playground();
    try {
      const replace = vi.spyOn(actual.runtime.graph, "replaceGraph");
      const invalidate = vi.spyOn(actual.runtime.graph, "invalidate");
      const track = actual.handle.track(nodeId(rig.goalTrack));
      const requires = track.requires;
      for (const offset of [10, -15]) {
        const x = rig.goal.x + offset;
        const y = rig.goal.y - offset;
        invalidate.mockClear();
        track.setValues({ x, y });
        expect(invalidate).toHaveBeenCalledTimes(1);
        expect(replace).not.toHaveBeenCalled();
        expect(track.requires).toEqual(requires);
        expect(track.definition.keyframes).toMatchObject({
          transform: { values: { x, y, rotation: 0 } },
        });
        reference.handle.track(nodeId(rig.goalTrack)).replace(frameTrack(rig.goalTrack, x, y));
        reference.handle.seek(nodeId(rig.goalTrack), 0);
        expectSamePose(actual.handle, reference.handle);
      }
    } finally {
      actual.handle.dispose();
      reference.handle.dispose();
    }
  });

  it.each([
    { rig: ARM, solver: armSolverTrack },
    { rig: TENTACLE, solver: tentacleSolverTrack },
  ])("flips $rig.label without replacing its solver bindings", ({ rig, solver }) => {
    const actual = playground();
    const reference = playground();
    try {
      const replace = vi.spyOn(actual.runtime.graph, "replaceGraph");
      const invalidate = vi.spyOn(actual.runtime.graph, "invalidate");
      const track = actual.handle.track(nodeId(rig.solverTrack));
      const requires = track.requires;
      for (const flip of [true, false]) {
        invalidate.mockClear();
        track.setKeyframe("ik", "flip", flip);
        expect(invalidate).toHaveBeenCalledTimes(1);
        expect(replace).not.toHaveBeenCalled();
        expect(track.requires).toEqual(requires);
        expect(track.definition.keyframes).toMatchObject({ ik: { values: { flip } } });
        reference.handle.track(nodeId(rig.solverTrack)).replace(solver(flip));
        reference.handle.seek(nodeId(rig.solverTrack), 0);
        expectSamePose(actual.handle, reference.handle);
      }
    } finally {
      actual.handle.dispose();
      reference.handle.dispose();
    }
  });
});
