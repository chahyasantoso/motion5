import { describe, expect, it } from "vitest";
import {
  createManualClock,
  Engine,
  PluginRegistry,
  type ProjectHandle,
  type TrackDefinition,
} from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { fk3dPlugin } from "../src/fk3d";
import { readFrame3d } from "../src/frame3d";
import { ik3dPlugin } from "../src/ik3d";
import { readRigValues, rigPlugin } from "../src/rig";
import { transform3dPlugin } from "../src/transform3d";

function load(tracks: readonly TrackDefinition[]): ProjectHandle {
  const plugins = new PluginRegistry();
  plugins.registerAll([
    transform3dPlugin,
    fk3dPlugin,
    ik3dPlugin,
    rigPlugin,
    { name: "empty", keys: ["tag"], compose: () => ({}) },
  ]);
  const project = new Engine({
    plugins,
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load({
    schemaVersion: 5,
    motions: [{ id: "scene", trigger: { type: "manual" }, tracks }],
  });
  for (const track of tracks) project.mount(`scene/${track.id}`);
  for (const track of tracks) project.seek(`scene/${track.id}`, 0);
  return project;
}

function values(project: ProjectHandle, id: string): Readonly<Record<string, unknown>> {
  const patch = project.get(`scene/${id}`);
  if (patch?.status !== "ready") throw new Error(`${id} did not publish ready`);
  return patch.values;
}

const bone: TrackDefinition = {
  id: "bone",
  keyframes: {
    transform3d: { values: { x: 3, y: -2, z: 7, rotation: 25, rotationX: -30, rotationY: 40 } },
  },
};

describe("rig world-frame aggregation", () => {
  it("G1 requires-only selection publishes exactly the bound bone frames and control points", () => {
    const registry = new PluginRegistry();
    registry.register(rigPlugin);
    const resolved = registry.resolveForKeyframes({
      rig: { requires: { bones: { wrist: "bone" } } },
    });
    expect(resolved.diagnostics).toEqual([]);
    expect(resolved.plugins.map(({ name }) => name)).toEqual(["rig"]);
    const project = load([
      bone,
      { id: "unused", keyframes: { transform3d: { values: { x: 999 } } } },
      {
        id: "rig",
        keyframes: { rig: { requires: { bones: { wrist: "bone" }, controls: { goal: "bone" } } } },
      },
    ]);
    try {
      const frame = readFrame3d(values(project, "bone"));
      const decoded = readRigValues(values(project, "rig"));
      expect(decoded.pose).toEqual({ wrist: frame });
      expect(decoded.controls).toEqual({ goal: { x: frame.x, y: frame.y, z: frame.z } });
      expect(Object.isFrozen(values(project, "rig").pose)).toBe(true);
    } finally {
      project.dispose();
    }
  });

  it("G2 an upstream ik3d seek propagates solved world frames without a second solve", () => {
    const project = load([
      { id: "root", keyframes: { transform3d: { values: { x: 0 } } } },
      {
        id: "goal",
        keyframes: {
          transform3d: {
            values: {
              x: [
                { p: 0, v: 15 },
                { p: 1, v: 0 },
              ],
              y: [
                { p: 0, v: 0 },
                { p: 1, v: 15 },
              ],
            },
          },
        },
      },
      { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
      {
        id: "upper",
        keyframes: {
          fk3d: { values: { length: 10 }, requires: { base: "root", solver: "solve" } },
        },
      },
      {
        id: "lower",
        keyframes: {
          fk3d: { values: { length: 10 }, requires: { base: "upper", solver: "solve" } },
        },
      },
      {
        id: "rig",
        keyframes: { rig: { requires: { bones: { upper: "upper", wrist: "lower" } } } },
      },
    ]);
    try {
      const before = readRigValues(values(project, "rig")).pose.wrist;
      project.seek("scene/goal", 1);
      const pose = readRigValues(values(project, "rig")).pose;
      expect(pose.upper).toEqual(readFrame3d(values(project, "upper")));
      expect(pose.wrist).toEqual(readFrame3d(values(project, "lower")));
      expect(pose.wrist).not.toEqual(before);
      expect(pose.wrist!.y).toBeCloseTo(15, 2);
      expect(rigPlugin.solverChain).toBeUndefined();
      expect(rigPlugin.outputSerializers).toBeUndefined();
    } finally {
      project.dispose();
    }
  });

  it("G3 bones-only bindings decode controls as empty", () => {
    const project = load([
      bone,
      { id: "rig", keyframes: { rig: { requires: { bones: { wrist: "bone" } } } } },
    ]);
    try {
      expect(readRigValues(values(project, "rig")).controls).toEqual({});
    } finally {
      project.dispose();
    }
  });

  it("G3b an unbound rig publishes no pose key and decodes empty records", () => {
    // Empty authored groups/dicts are schema refusals; an unbound data track omits the group.
    const project = load([{ id: "rig" }]);
    try {
      expect(values(project, "rig").pose).toBeUndefined();
      expect(readRigValues(values(project, "rig"))).toEqual({ pose: {}, controls: {} });
    } finally {
      project.dispose();
    }
  });

  it("G3c a present bone without frame keys decodes zeros rather than an absent bone", () => {
    const project = load([
      { id: "bone", keyframes: { empty: { values: { tag: true } } } },
      { id: "rig", keyframes: { rig: { requires: { bones: { wrist: "bone" } } } } },
    ]);
    try {
      expect(readRigValues(values(project, "rig")).pose).toEqual({ wrist: readFrame3d({}) });
    } finally {
      project.dispose();
    }
  });

  it("G4 readers sort dictionaries and handle malformed input without mutating it", () => {
    const input = {
      pose: { zebra: { x: 2 }, alpha: { x: 1 } },
      controls: { zebra: {}, alpha: {} },
    };
    const decoded = readRigValues(input);
    expect(Object.keys(decoded.pose)).toEqual(["alpha", "zebra"]);
    expect(Object.keys(decoded.controls)).toEqual(["alpha", "zebra"]);
    expect(input.pose.alpha).toEqual({ x: 1 });
    for (const malformed of [undefined, null, [], 1, "rig", { pose: [], controls: false }]) {
      expect(readRigValues(malformed)).toEqual({ pose: {}, controls: {} });
    }
    const special = readRigValues({
      pose: Object.fromEntries([
        ["__proto__", { x: 9 }],
        ["constructor", { y: 8 }],
      ]),
    });
    expect(Object.hasOwn(special.pose, "__proto__")).toBe(true);
    expect(special.pose.__proto__!.x).toBe(9);
    expect(Object.getPrototypeOf(special.pose)).toBe(Object.prototype);
  });
});
