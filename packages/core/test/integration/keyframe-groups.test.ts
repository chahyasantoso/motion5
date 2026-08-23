import { describe, expect, it } from "vitest";
import type { AuthoredKeyframe, ProjectDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}

function project(keyframes: Readonly<Record<string, AuthoredKeyframe>>): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "hero",
        trigger: { type: "manual" },
        tracks: [{ id: "arm", keyframes }],
      },
    ],
  };
}

// Keys stay `boneLength` and `boneRotation`, the names `fkPlugin` already claims. Renaming them to
// the natural `length` and `rotation` needs key ownership scoped per plugin, because `rotation` is
// owned by `transformPlugin` in one global map, and `PluginRegistry.register` throws on that today.
// That is a separate slice; grouping must work without it.
function fkRegistry() {
  const plugins = new PluginRegistry();
  plugins.register({
    name: "fk",
    keys: ["boneLength", "boneRotation"],
    compose: (values) => values,
  });
  return plugins;
}

function load(definition: ProjectDefinition, plugins?: PluginRegistry) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    ...(plugins ? { plugins } : {}),
  }).load(definition);
}

describe("plugin-named authored keyframe groups", () => {
  it("F-10 interpolates grouped leaves without renaming the owning plugin", () => {
    const values = { boneLength: ramp(10, 20), boneRotation: ramp(0, 90) };
    const handle = load(project({ fk: { values } }), fkRegistry());
    handle.mount("hero/arm");

    const batch = handle.seek("hero/arm", 0.5);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");

    // A mid-progress value, not a load without diagnostics: a grouped property the interpolator
    // never read would compile clean and hold still at every progress.
    expect(patch?.values.boneLength).toBeCloseTo(15, 12);
    expect(patch?.values.boneRotation).toBeCloseTo(45, 12);
    handle.dispose();
  });

  it("F-11 interpolates a grouped track when the Engine has no plugin registry", () => {
    const handle = load(project({ fk: { values: { boneLength: ramp(10, 20) } } }));
    handle.mount("hero/arm");

    const batch = handle.seek("hero/arm", 0.5);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");

    expect(patch?.values.boneLength).toBeCloseTo(15, 12);
    handle.dispose();
  });

  it("F-12 publishes identical values for the flat and grouped spellings", () => {
    const flat = load(project({ boneLength: ramp(10, 20) }), fkRegistry());
    const values = { boneLength: ramp(10, 20) };
    const grouped = load(project({ fk: { values } }), fkRegistry());
    flat.mount("hero/arm");
    grouped.mount("hero/arm");

    flat.seek("hero/arm", 0.25);
    grouped.seek("hero/arm", 0.25);

    expect(flat.get("hero/arm")?.values).toEqual({ boneLength: 12.5 });
    expect(grouped.get("hero/arm")?.values).toEqual(flat.get("hero/arm")?.values);
    flat.dispose();
    grouped.dispose();
  });
});
