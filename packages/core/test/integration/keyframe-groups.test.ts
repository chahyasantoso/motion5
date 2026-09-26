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

// A local plugin claiming `boneLength` and `boneRotation`. The names are arbitrary: grouping routes a
// leaf to the plugin its group names whatever the leaf is called, so nothing here depends on them.
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
    if (patch?.status !== "ready")
      throw new Error(`patch is ${patch?.status ?? "absent"}, not ready.`);
    expect(patch.values.boneLength).toBeCloseTo(15, 12);
    expect(patch.values.boneRotation).toBeCloseTo(45, 12);
    handle.dispose();
  });

  it("F-11 interpolates a grouped track when the Engine has no plugin registry", () => {
    const handle = load(project({ fk: { values: { boneLength: ramp(10, 20) } } }));
    handle.mount("hero/arm");

    const batch = handle.seek("hero/arm", 0.5);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");

    if (patch?.status !== "ready")
      throw new Error(`patch is ${patch?.status ?? "absent"}, not ready.`);
    expect(patch.values.boneLength).toBeCloseTo(15, 12);
    handle.dispose();
  });

  it("F-12 refuses the retired flat spelling while grouped values remain accepted", () => {
    expect(() =>
      load(
        project({ boneLength: ramp(10, 20) } as unknown as Readonly<
          Record<string, AuthoredKeyframe>
        >),
        fkRegistry(),
      ),
    ).toThrow("keyframes-ungrouped-key");
    const grouped = load(project({ fk: { values: { boneLength: ramp(10, 20) } } }), fkRegistry());
    grouped.mount("hero/arm");
    grouped.seek("hero/arm", 0.25);

    const heroArmPatch = grouped.get("hero/arm");
    if (heroArmPatch?.status !== "ready")
      throw new Error(`hero/arm is ${heroArmPatch?.status ?? "absent"}, not ready.`);
    expect(heroArmPatch.values).toEqual({ boneLength: 12.5 });
    grouped.dispose();
  });
});
