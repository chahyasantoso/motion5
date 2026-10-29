import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "@motion5/core";
import { Engine, PluginCatalog } from "@motion5/core";
import { fkPlugin } from "../../src/fk";
import { transformPlugin } from "../../src/transform";
import { BODY_2D_SPEC, ROOT_2D_SPEC, SOLVED_2D_SPEC } from "../../src/aggregate-topology";
import { createManualClock } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";

function hold(value: number) {
  return value;
}

function ramp(from: number, to: number) {
  return [
    { p: 0, v: from },
    { p: 1, v: to },
  ];
}

const thigh: TrackDefinition = {
  id: "thigh",
  plugin: "fk",
  input: {
    values: {},
    requires: { chain: "walk/body", solved: "walk/solved", base: "walk/pelvis" },
  },
};

const bodyTrack: TrackDefinition = {
  id: "body",
  input: {
    schema: BODY_2D_SPEC,
    values: [{ id: "thigh", cells: { length: 50, rotation: 45, weight: 1 } }],
  },
};

const solvedTrack: TrackDefinition = {
  id: "solved",
  input: {
    schema: SOLVED_2D_SPEC,
    values: [{ id: "thigh", cells: { rotation: 45 } }],
  },
};

const rootTrack: TrackDefinition = {
  id: "pelvis",
  input: {
    schema: ROOT_2D_SPEC,
    values: { x: ramp(0, 200), y: hold(100), rotation: hold(0) },
  },
};

function rig(thighTrack: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "walk",
        trigger: { type: "manual" },
        tracks: [rootTrack, bodyTrack, solvedTrack, thighTrack],
      },
    ],
  };
}

function rigRegistry(): PluginCatalog {
  const plugins = new PluginCatalog();
  plugins.registerAll([transformPlugin, fkPlugin]);
  return plugins;
}

function load(project: ProjectDefinition, plugins: PluginCatalog) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

describe("per-plugin keyframe key ownership", () => {
  it("N-7 claims expected keys and schema fields", () => {
    expect(
      (BODY_2D_SPEC as Extract<typeof BODY_2D_SPEC, { kind: "table" }>).schema.row.fields,
    ).toHaveProperty("length");
    expect(
      (BODY_2D_SPEC as Extract<typeof BODY_2D_SPEC, { kind: "table" }>).schema.row.fields,
    ).toHaveProperty("rotation");
    expect(
      (BODY_2D_SPEC as Extract<typeof BODY_2D_SPEC, { kind: "table" }>).schema.row.fields,
    ).toHaveProperty("weight");
    expect(
      (BODY_2D_SPEC as Extract<typeof BODY_2D_SPEC, { kind: "table" }>).schema.row.fields,
    ).toHaveProperty("parentId");

    const composed = fkPlugin.transform(
      {
        values: {},
        requires: {
          chain: { values: [{ id: "thigh", cells: { length: 50, rotation: 45 } }] },
          solved: { values: [{ id: "thigh", cells: { rotation: 45 } }] },
          base: { values: { x: 0, y: 100, rotation: 0 } },
        },
      },
      { nodeId: "walk/thigh", progress: 0 },
    );
    const row = (composed.values as any)[0];
    expect(row.cells.x).toBeCloseTo(35.355, 3);
    expect(row.cells.y).toBeCloseTo(135.355, 3);
    expect(row.cells.rotation).toBeCloseTo(45, 12);
  });

  it("N-8 composes a rig from aggregate fk and transform", () => {
    const handle = load(rig(thigh), rigRegistry());
    handle.mount("walk/pelvis");
    handle.mount("walk/body");
    handle.mount("walk/solved");
    handle.mount("walk/thigh");

    const batch = handle.seek("walk/pelvis", 0);
    const thighPatch = batch.patches.find(({ nodeId }) => nodeId === "walk/thigh");

    if (thighPatch?.status !== "ready")
      throw new Error(`thighPatch is ${thighPatch?.status ?? "absent"}, not ready.`);
    const row = (thighPatch.outputs.values as any)[0];
    expect(row.cells.x).toBeCloseTo(35.355, 3);
    expect(row.cells.y).toBeCloseTo(135.355, 3);
    expect(row.cells.rotation).toBeCloseTo(45, 12);
    handle.dispose();
  });

  it("N-9 refuses legacy keyframes field as track-legacy-field", () => {
    const legacyTrack: TrackDefinition = {
      id: "thigh",
      keyframes: { fk: { values: { length: 50 } } },
    } as unknown as TrackDefinition;

    expect(() => load(rig(legacyTrack), rigRegistry())).toThrow();
  });

  it("N-10 publishes record outputs under values", () => {
    const handle = load(rig(thigh), rigRegistry());
    handle.mount("walk/pelvis");

    handle.seek("walk/pelvis", 1);

    const walkPelvisPatch = handle.get("walk/pelvis");
    if (walkPelvisPatch?.status !== "ready")
      throw new Error(`walk/pelvis is ${walkPelvisPatch?.status ?? "absent"}, not ready.`);
    const values = walkPelvisPatch.outputs.values ?? {};
    expect(Object.keys(values).sort()).toEqual(["rotation", "x", "y"]);
    handle.dispose();
  });
});
