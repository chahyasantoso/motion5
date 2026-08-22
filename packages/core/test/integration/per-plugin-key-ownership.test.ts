import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { PluginRegistry } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

function hold(value: number) {
  return {
    stops: [
      { p: 0, v: value },
      { p: 1, v: value },
    ],
  };
}

function ramp(from: number, to: number) {
  return {
    stops: [
      { p: 0, v: from },
      { p: 1, v: to },
    ],
  };
}

// The rig case: `transform` claims `x`, `y`, `rotation` and `fk` claims `length`, `rotation`, so
// `rotation` has two claimants and each track names the one it means. Registration used to refuse
// this registry outright, which is the whole reason `fkPlugin` mangled its own key names.
//
// The parent is now bound through `fk.requires.base` rather than through a track-level input
// observation with a projection map onto `parentX`, `parentY`, and `parentRotation`. See ADR-044.
const thigh: TrackDefinition = {
  id: "thigh",
  keyframes: { fk: { length: hold(50), rotation: hold(45), requires: { base: "walk/pelvis" } } },
};

function rig(bone: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "walk",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "pelvis",
            keyframes: { transform: { x: ramp(0, 200), y: hold(100), rotation: hold(0) } },
          },
          bone,
        ],
      },
    ],
  };
}

function rigRegistry(): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  return plugins;
}

function load(project: ProjectDefinition, plugins: PluginRegistry) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("per-plugin keyframe key ownership", () => {
  it("N-7 claims the natural bone key names and composes world space from them", () => {
    expect(fkPlugin.keys).toEqual(["length", "rotation"]);

    // `rotation` is claimed and produced. The authored value is this bone's rotation relative to
    // its parent; the composed one is its rotation in world space, which is what a child observes
    // and what a renderer writes. The parent's own `rotation` arrives inside the `base` slot, so
    // the two never share a namespace and neither has to be renamed.
    const parent = { base: { rotation: 90 } };
    const composed = fkPlugin.compose({ length: 10, rotation: -90 }, 1, parent);
    expect(composed.x).toBeCloseTo(10, 12);
    expect(composed.y).toBeCloseTo(0, 12);
    expect(composed.rotation).toBe(0);
  });

  it("N-8 composes a rig from two plugins that both claim rotation", () => {
    const handle = load(rig(thigh), rigRegistry());
    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");

    const batch = handle.seek("walk/pelvis", 0);
    const thighPatch = batch.patches.find(({ nodeId }) => nodeId === "walk/thigh");

    // The same numbers the `boneLength`/`boneRotation` spelling produced: a pelvis at (0, 100)
    // with rotation 0, a bone of length 50 at 45 degrees. A mid-rig value, not a clean load: an
    // ownership change that stopped the interpolator reading a leaf would load without diagnostics
    // and then hold still.
    expect(thighPatch?.values.x).toBeCloseTo(35.355, 3);
    expect(thighPatch?.values.y).toBeCloseTo(135.355, 3);
    expect(thighPatch?.values.rotation).toBeCloseTo(45, 12);
    handle.dispose();
  });

  it("N-9 refuses the flat spelling of a key both plugins claim", () => {
    const flatRotation: TrackDefinition = {
      id: "thigh",
      keyframes: {
        fk: { length: hold(50), requires: { base: "walk/pelvis" } },
        rotation: hold(45),
      },
    };

    // Not a winner decided by registration order, and not a silent overwrite. The load is refused
    // with both claimants named, so the author can see which group to reach for.
    expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/plugin-ambiguous-key/);
    expect(() => load(rig(flatRotation), rigRegistry())).toThrow(/"fk" and "transform"/);
  });

  it("N-10 publishes grouped leaves under their unprefixed names", () => {
    const handle = load(rig(thigh), rigRegistry());
    handle.mount("walk/pelvis");

    handle.seek("walk/pelvis", 1);

    // Green on the parent by design, and not claimed as red. This is the guard a canonical
    // `transform:x` leaf would break rather than migrate: ADR-042 drops every namespaced key
    // before publication, so the prefixed spelling would publish an empty patch. See ADR-043.
    const values = handle.get("walk/pelvis")?.values ?? {};
    expect(Object.keys(values).sort()).toEqual(["rotation", "x", "y"]);
    handle.dispose();
  });
});
