import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "@motion5/core";
import { Engine, PluginCatalog } from "@motion5/core";
import type { PluginDefinition } from "@motion5/core/plugin-api";
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

function readX(value: unknown): number {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return 0;
  const record =
    "values" in (value as Record<string, unknown>) &&
    typeof (value as Record<string, unknown>).values === "object" &&
    (value as Record<string, unknown>).values !== null
      ? ((value as Record<string, unknown>).values as Record<string, unknown>)
      : (value as Record<string, unknown>);
  const x = record.x;
  return typeof x === "number" ? x : 0;
}

const reachPlugin: PluginDefinition = {
  id: "reach",
  inputs: {
    values: { kind: "record", fields: { weight: { kind: "number" } } },
    requires: {
      base: { outputs: { values: ROOT_2D_SPEC } },
      destination: { outputs: { values: ROOT_2D_SPEC } },
    },
  },
  outputs: {
    values: { kind: "record", fields: { span: { kind: "number" } } },
  },
  transform({ values, requires }) {
    return {
      values: {
        span: readX(requires.base) + readX(requires.destination),
      },
    };
  },
};

const bone: TrackDefinition = {
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

function rig(child: TrackDefinition): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [
      {
        id: "walk",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "pelvis",
            input: {
              schema: ROOT_2D_SPEC,
              values: { x: ramp(0, 200), y: hold(100), rotation: hold(0) },
            },
          },
          bodyTrack,
          solvedTrack,
          child,
        ],
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

describe("plugin-owned requirements end to end", () => {
  it("Q-7 derives the input edge from the binding and composes world space from it", () => {
    const handle = load(rig(bone), rigRegistry());
    handle.mount("walk/pelvis");
    handle.mount("walk/body");
    handle.mount("walk/solved");
    handle.mount("walk/thigh");

    const batch = handle.seek("walk/pelvis", 0);
    const thighPatch = batch.patches.find(({ nodeId }) => nodeId === "walk/thigh");
    if (thighPatch?.status !== "ready")
      throw new Error(`thigh is ${thighPatch?.status ?? "absent"}, not ready.`);
    const row = (thighPatch.outputs.values as any)[0];
    expect(row.cells.x).toBeCloseTo(35.355, 3);
    expect(row.cells.y).toBeCloseTo(135.355, 3);
    expect(row.cells.rotation).toBeCloseTo(45, 12);

    expect(handle.dependantsOf("walk/pelvis")).toEqual(["walk/thigh"]);
    handle.dispose();
  });

  it("Q-8 leaves an omitted optional binding with no edge", () => {
    const optionalPlugin: PluginDefinition = {
      id: "opt-reach",
      inputs: {
        values: { kind: "record", fields: { length: { kind: "number" } } },
        requires: {
          base: { outputs: { values: ROOT_2D_SPEC }, optional: true },
        },
      },
      outputs: {
        values: { kind: "record", fields: { x: { kind: "number" }, y: { kind: "number" } } },
      },
      transform({ values, requires }) {
        const len = typeof (values as any)?.length === "number" ? (values as any).length : 0;
        return { values: { x: readX(requires.base) + len, y: 0 } };
      },
    };
    const unbound: TrackDefinition = {
      id: "thigh",
      plugin: "opt-reach",
      input: { values: { length: 50 } },
    };
    const plugins = rigRegistry();
    plugins.register(optionalPlugin);
    const handle = load(rig(unbound), plugins);
    handle.mount("walk/thigh");
    handle.seek("walk/thigh", 0);

    const walkThighPatch = handle.get("walk/thigh");
    if (walkThighPatch?.status !== "ready")
      throw new Error(`walk/thigh is ${walkThighPatch?.status ?? "absent"}, not ready.`);
    const vals = walkThighPatch.outputs.values as any;
    expect(vals.x).toBeCloseTo(50, 12);
    expect(vals.y).toBeCloseTo(0, 12);
    expect(handle.dependantsOf("walk/pelvis")).toEqual([]);
    handle.dispose();
  });

  it("Q-9 refuses a binding whose source is not a node in the graph with edge-unknown-source", () => {
    const dangling: TrackDefinition = {
      id: "thigh",
      plugin: "fk",
      input: {
        values: {},
        requires: { chain: "walk/body", solved: "walk/solved", base: "walk/missing" },
      },
    };
    expect(() => load(rig(dangling), rigRegistry())).toThrow(/edge-unknown-source/);
  });

  it("Q-10 treats two slots bound to one source as two edges rather than a duplicate", () => {
    const span: TrackDefinition = {
      id: "span",
      plugin: "reach",
      input: {
        values: { weight: hold(1) },
        requires: { base: "walk/pelvis", destination: "walk/pelvis" },
      },
    };
    const plugins = rigRegistry();
    plugins.register(reachPlugin);

    const handle = load(rig(span), plugins);
    handle.mount("walk/pelvis");
    handle.mount("walk/span");

    const batch = handle.seek("walk/pelvis", 1);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "walk/span");
    expect(patch?.status).toBe("ready");
    if (patch?.status !== "ready")
      throw new Error(`patch is ${patch?.status ?? "absent"}, not ready.`);
    expect((patch.outputs.values as any).span).toBeCloseTo(400, 12);
    handle.dispose();
  });

  it("Q-11 keeps an upstream value out of the observer's authored value namespace", () => {
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "walk",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "pelvis",
              input: {
                schema: ROOT_2D_SPEC,
                values: { x: hold(0), y: hold(0), rotation: hold(30) },
              },
            },
            bodyTrack,
            solvedTrack,
            {
              id: "thigh",
              plugin: "fk",
              input: {
                values: {},
                requires: { chain: "walk/body", solved: "walk/solved", base: "walk/pelvis" },
              },
            },
          ],
        },
      ],
    };
    const handle = load(project, rigRegistry());
    handle.mount("walk/pelvis");
    handle.mount("walk/body");
    handle.mount("walk/solved");
    handle.mount("walk/thigh");
    handle.seek("walk/pelvis", 0);

    const walkThighPatch2 = handle.get("walk/thigh");
    if (walkThighPatch2?.status !== "ready")
      throw new Error(`walk/thigh is ${walkThighPatch2?.status ?? "absent"}, not ready.`);
    const row = (walkThighPatch2.outputs.values as any)[0];
    expect(row.cells.rotation).toBeCloseTo(75, 12);
    handle.dispose();
  });

  it("Q-12 refuses a binding to a slot the plugin never declared with slot-unknown", () => {
    const bad: TrackDefinition = {
      id: "thigh",
      plugin: "fk",
      input: {
        values: {},
        requires: {
          chain: "walk/body",
          solved: "walk/solved",
          base: "walk/pelvis",
          debug: "walk/pelvis",
        },
      },
    };
    expect(() => load(rig(bad), rigRegistry())).toThrow(/slot-unknown/);
  });
});
