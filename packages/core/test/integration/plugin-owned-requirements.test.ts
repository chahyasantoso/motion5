import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import { fkPlugin } from "../../src/plugins/fk";
import { transformPlugin } from "../../src/plugins/transform";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

// Issue #173 and ADR-044. The authored form under test is the plugin-owned one:
//
//   keyframes: { fk: { length, rotation, requires: { base: "walk/pelvis" } } }
//
// The projection map it replaces made the author repeat the plugin's own input contract, and the
// projected keys landed in the same flat bag as the track's authored values, where an upstream
// `rotation` could silently replace a bone's local one.

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

function readX(value: unknown): number {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return 0;
  const x = (value as Record<string, unknown>).x;
  return typeof x === "number" ? x : 0;
}

// Two slots, one plugin. This is the shape the issue names for IK, and it is the reason a
// requirement is part of edge identity: both slots may intentionally observe one source.
const reachPlugin: PluginDefinition = {
  name: "reach",
  keys: ["weight"],
  requirements: { base: {}, destination: {} },
  stage: "compose",
  outputs: ["span"],
  compose: (values, progress, inputs) => ({
    span: readX(inputs.base) + readX(inputs.destination),
  }),
};

const bone: TrackDefinition = {
  id: "thigh",
  keyframes: {
    fk: { length: hold(50), rotation: hold(45), requires: { base: "walk/pelvis" } },
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
            keyframes: { transform: { x: ramp(0, 200), y: hold(100), rotation: hold(0) } },
          },
          child,
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

describe("plugin-owned requirements end to end", () => {
  it("Q-7 derives the input edge from the binding and composes world space from it", () => {
    const handle = load(rig(bone), rigRegistry());
    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");

    // The same numbers the projection form produced: a pelvis at (0, 100) with rotation 0 and a
    // bone of length 50 at 45 degrees. A mid-rig value, not a clean load, so a binding that
    // derived an edge and delivered nothing would read as a held bone rather than as green.
    const batch = handle.seek("walk/pelvis", 0);
    const thigh = batch.patches.find(({ nodeId }) => nodeId === "walk/thigh");
    expect(thigh?.values.x).toBeCloseTo(35.355, 3);
    expect(thigh?.values.y).toBeCloseTo(135.355, 3);
    expect(thigh?.values.rotation).toBeCloseTo(45, 12);

    expect(handle.dependantsOf("walk/pelvis")).toEqual(["walk/thigh"]);
    handle.dispose();
  });

  it("Q-8 leaves an omitted binding with no edge and lets the plugin own the unbound case", () => {
    const unbound: TrackDefinition = {
      id: "thigh",
      keyframes: { fk: { length: hold(50), rotation: hold(0) } },
    };
    const handle = load(rig(unbound), rigRegistry());
    handle.mount("walk/thigh");
    handle.seek("walk/thigh", 0);

    const values = handle.get("walk/thigh")?.values ?? {};
    expect(values.x).toBeCloseTo(50, 12);
    expect(values.y).toBeCloseTo(0, 12);
    expect(handle.dependantsOf("walk/pelvis")).toEqual([]);
    handle.dispose();
  });

  it("Q-9 refuses a binding whose source is not a node in the graph", () => {
    const dangling: TrackDefinition = {
      id: "thigh",
      keyframes: {
        fk: { length: hold(50), rotation: hold(45), requires: { base: "walk/missing" } },
      },
    };
    expect(() => load(rig(dangling), rigRegistry())).toThrow(/observation-unknown-source/);
  });

  it("Q-10 treats two slots bound to one source as two edges rather than a duplicate", () => {
    const span: TrackDefinition = {
      id: "span",
      keyframes: {
        reach: {
          weight: hold(1),
          requires: { base: "walk/pelvis", destination: "walk/pelvis" },
        },
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
    expect(patch?.values.span).toBeCloseTo(400, 12);
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
              keyframes: { transform: { x: hold(0), y: hold(0), rotation: hold(30) } },
            },
            bone,
          ],
        },
      ],
    };
    const handle = load(project, rigRegistry());
    handle.mount("walk/pelvis");
    handle.mount("walk/thigh");
    handle.seek("walk/pelvis", 0);

    // Parent 30 plus local 45. This number is the separation proof: a flat merge would have
    // replaced the bone's authored 45 with the upstream 30 and composed 60 instead.
    expect(handle.get("walk/thigh")?.values.rotation).toBeCloseTo(75, 12);
    handle.dispose();
  });

  it("Q-12 refuses a binding to a slot the plugin never declared, at load", () => {
    const bad: TrackDefinition = {
      id: "thigh",
      keyframes: {
        fk: { length: hold(50), rotation: hold(45), requires: { debug: "walk/pelvis" } },
      },
    };
    expect(() => load(rig(bad), rigRegistry())).toThrow(/plugin-unknown-requirement/);
  });
});
