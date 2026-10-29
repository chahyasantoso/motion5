import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "@motion5/core";
import { PluginCatalog, Engine } from "@motion5/core";
import { fkPlugin } from "../../src/fk";
import { transformPlugin } from "../../src/transform";
import { BODY_2D_SPEC, ROOT_2D_SPEC, SOLVED_2D_SPEC } from "../../src/aggregate-topology";
import { createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";

function hold(value: number) {
  return value;
}

const PELVIS: TrackDefinition = {
  id: "pelvis",
  input: {
    schema: ROOT_2D_SPEC,
    values: { x: hold(0), y: hold(0), rotation: hold(30) },
  },
};

const BODY: TrackDefinition = {
  id: "body",
  input: {
    schema: BODY_2D_SPEC,
    values: [{ id: "thigh", cells: { length: 50, rotation: 45, weight: 1 } }],
  },
};

const SOLVED: TrackDefinition = {
  id: "solved",
  input: {
    schema: SOLVED_2D_SPEC,
    values: [{ id: "thigh", cells: { rotation: 45 } }],
  },
};

const THIGH: TrackDefinition = {
  id: "thigh",
  plugin: "fk",
  input: {
    values: {},
    requires: { chain: "walk/body", solved: "walk/solved", base: "walk/pelvis" },
  },
};

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "walk", trigger: { type: "manual" }, tracks: [PELVIS, BODY, SOLVED, THIGH] }],
};

function load() {
  const plugins = new PluginCatalog();
  plugins.registerAll([transformPlugin, fkPlugin]);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("a plugin requirement is the only input channel", () => {
  it("J-8 composes an upstream value without it ever becoming an authored one", () => {
    const handle = load();
    handle.mount("walk/pelvis");
    handle.mount("walk/body");
    handle.mount("walk/solved");
    handle.mount("walk/thigh");
    handle.seek("walk/pelvis", 0);

    const walkThighPatch = handle.get("walk/thigh");
    if (walkThighPatch?.status !== "ready")
      throw new Error(`walk/thigh is ${walkThighPatch?.status ?? "absent"}, not ready.`);
    const row = (walkThighPatch.outputs.values as any)[0];
    const cells = row.cells ?? {};
    expect(cells.rotation).toBeCloseTo(75, 12);
    expect(Object.keys(cells).sort()).toEqual(expect.arrayContaining(["rotation", "x", "y"]));
    expect(handle.dependantsOf("walk/pelvis")).toEqual(["walk/thigh"]);

    handle.dispose();
  });
});
