import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { fkPlugin } from "../../src/plugins/fk";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

function hold(value: number) {
  return {
    stops: [
      { p: 0, v: value },
      { p: 1, v: value },
    ],
  };
}

// The pelvis publishes its own `rotation` and the bone authors one under `fk`. They meet in one
// composition and neither is renamed, because the requirement slot is the scope rather than a key.
const PELVIS: TrackDefinition = {
  id: "pelvis",
  keyframes: { transform: { x: hold(0), y: hold(0), rotation: hold(30) } },
};
const THIGH: TrackDefinition = {
  id: "thigh",
  keyframes: {
    fk: { length: hold(50), rotation: hold(45), requires: { base: "walk/pelvis" } },
  },
};
const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "walk", trigger: { type: "manual" }, tracks: [PELVIS, THIGH] }],
};

function load() {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("a plugin requirement is the only input channel", () => {
  it("J-8 composes an upstream value without it ever becoming an authored one", () => {
    // Passes on the parent by design, because the walker rig is already pure `requires`. It is the
    // mutation guard: reintroducing a flat merge anywhere turns 75 into 60 or adds a bare key.
    const handle = load();
    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.seek("walk/pelvis", 0);

    const values = handle.get("walk/thigh")?.values ?? {};
    // Parent 30 plus local 45. A flat merge would have replaced the bone's authored 45 with the
    // upstream 30 and composed 60, which is the number this case exists to refuse.
    expect(values.rotation).toBeCloseTo(75, 12);
    // And nothing arrived beside it: the published key set is exactly what fk produces.
    expect(Object.keys(values).sort()).toEqual(["rotation", "x", "y"]);
    // One edge, derived from the binding rather than authored as a generic observation.
    expect(handle.dependantsOf("walk/pelvis")).toEqual(["walk/thigh"]);

    handle.dispose();
  });
});
