import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { fk3dPlugin } from "../../src/plugins/fk3d";
import {
  blendOrientation3d,
  composeWorld3d,
  readEuler3d,
  readFrame3d,
  ZERO_EULER,
  type Euler3d,
  type WorldFrame3d,
} from "../../src/plugins/frame3d";
import { ik3dPlugin } from "../../src/plugins/ik3d";
import { transform3dPlugin } from "../../src/plugins/transform3d";
import type { Patch } from "../../src/runtime/patch-registry";

function member(id: string, base: string, length: number): TrackDefinition {
  return {
    id,
    keyframes: { fk3d: { values: { length }, requires: { base, solver: "solve" } } },
  };
}

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
        {
          id: "goal",
          keyframes: {
            transform3d: {
              values: {
                x: [
                  { p: 0, v: 100 },
                  { p: 1, v: 110 },
                ],
                y: [
                  { p: 0, v: 20 },
                  { p: 1, v: 25 },
                ],
                z: [
                  { p: 0, v: 30 },
                  { p: 1, v: 35 },
                ],
              },
            },
          },
        },
        { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
        member("upper", "root", 80),
        member("fore", "upper", 60),
      ],
    },
  ],
};

function createRuntime(project: ProjectDefinition = PROJECT) {
  const plugins = new PluginRegistry();
  plugins.register(transform3dPlugin);
  plugins.register(fk3dPlugin);
  plugins.register(ik3dPlugin);
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

const RAMP = [
  { p: 0, v: 0 },
  { p: 1, v: 1 },
];
const UPPER_REST: Euler3d = { rotation: 20, rotationX: -30, rotationY: 10 };
const FORE_REST: Euler3d = { rotation: 0, rotationX: 15, rotationY: -25 };
const GOAL = { x: 70, y: 40, z: 50 };

/** Issue #500 phase 1: both members author a rest orientation and ramp their weight in. */
const RESTED: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-rest",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", keyframes: { transform3d: { values: { x: 5, y: -5, z: 0 } } } },
        { id: "goal", keyframes: { transform3d: { values: GOAL } } },
        { id: "solve", keyframes: { ik3d: { requires: { root: "root", target: "goal" } } } },
        {
          id: "upper",
          keyframes: {
            fk3d: {
              values: { length: 80, ...UPPER_REST, weight: RAMP },
              requires: { base: "root", solver: "solve" },
            },
          },
        },
        {
          id: "fore",
          keyframes: {
            fk3d: {
              values: { length: 60, ...FORE_REST, weight: RAMP },
              requires: { base: "upper", solver: "solve" },
            },
          },
        },
      ],
    },
  ],
};

/** A member's published frame, restated from `frame3d.ts` as the oracle. */
function tipOf(base: WorldFrame3d, local: Euler3d, length: number): WorldFrame3d {
  return composeWorld3d(composeWorld3d(base, { x: 0, y: 0, z: 0, ...local }), {
    ...ZERO_EULER,
    x: length,
    y: 0,
    z: 0,
  });
}

describe("3D seam through engine and DOM", () => {
  it("TH-14 reaches the DOM adapter with scalar CSS transforms", () => {
    const runtime = createRuntime();
    const patches = new Map<string, Patch>();
    const target: DomTarget = { style: {} };
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => target);
    for (const id of ["rig/root", "rig/goal", "rig/solve", "rig/upper", "rig/fore"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    runtime.seek("rig/goal", 0);
    for (const patch of patches.values()) if (patch.status === "ready") adapter.apply(patch);
    const solve = patches.get("rig/solve");
    expect(solve?.status).toBe("ready");
    if (solve?.status !== "ready") throw new Error("3D solve did not publish");
    expect(solve.values.rotations3d).toBeDefined();
    expect(target.style.transform).toContain("translate3d(");
    expect(target.style.transform).toContain(" rotate(");
    expect(target.style.transform).toContain(" rotateX(");
    expect(target.style.transform).toContain(" rotateY(");
  });

  it("TH-15 propagates a goal edit through solver and member patches", () => {
    const runtime = createRuntime();
    const revisions = new Map<string, number>();
    for (const id of ["rig/root", "rig/goal", "rig/solve", "rig/upper", "rig/fore"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => {
        if (patch.status === "ready") revisions.set(id, patch.revision);
      });
    }
    runtime.seek("rig/goal", 0);
    const initial = new Map(revisions);
    runtime.seek("rig/goal", 1);
    // The goal moved, so it and every node downstream of it republish; the root reads nothing
    // that moved and must not.
    for (const id of ["rig/goal", "rig/solve", "rig/upper", "rig/fore"]) {
      expect(initial.get(id)).toBeDefined();
      expect(revisions.get(id)).toBeGreaterThan(initial.get(id) ?? Number.POSITIVE_INFINITY);
    }
    expect(revisions.get("rig/root")).toBe(initial.get("rig/root"));
  });

  it("TH-32 a rest pose ramps into the solve by weight and seeks back to the same bytes", () => {
    const runtime = createRuntime(RESTED);
    const ids = ["rig/root", "rig/goal", "rig/solve", "rig/upper", "rig/fore"];
    const patches = new Map<string, Patch>();
    for (const id of ids) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    const ready = (id: string) => {
      const patch = patches.get(id);
      if (patch?.status !== "ready") throw new Error(`${id} is ${patch?.status ?? "absent"}.`);
      return patch.values;
    };
    const seekMembers = (progress: number) => {
      runtime.seek("rig/upper", progress);
      runtime.seek("rig/fore", progress);
      return { upper: { ...ready("rig/upper") }, fore: { ...ready("rig/fore") } };
    };
    // Weight 0 is the authored rest pose exactly, though the solve is bound and published.
    const rest = seekMembers(0);
    const root = readFrame3d({ x: 5, y: -5, z: 0 });
    const solved = ready("rig/solve").rotations3d as Readonly<Record<string, unknown>>;
    const upperSolved = readEuler3d(solved["rig/upper"]);
    const foreSolved = readEuler3d(solved["rig/fore"]);
    const oracle = (weight: number) => {
      const upper = tipOf(root, blendOrientation3d(UPPER_REST, upperSolved, weight), 80);
      return { upper, fore: tipOf(upper, blendOrientation3d(FORE_REST, foreSolved, weight), 60) };
    };
    const sameBytes = (actual: Record<string, unknown>, expected: WorldFrame3d) =>
      (Object.keys(expected) as (keyof WorldFrame3d)[]).every((key) =>
        Object.is(actual[key], expected[key]),
      );

    const restUpper = tipOf(root, UPPER_REST, 80);
    expect(sameBytes(rest.upper, restUpper)).toBe(true);
    expect(sameBytes(rest.fore, tipOf(restUpper, FORE_REST, 60))).toBe(true);
    const miss = (fore: Record<string, unknown>) =>
      Math.hypot(Number(fore.x) - GOAL.x, Number(fore.y) - GOAL.y, Number(fore.z) - GOAL.z);
    expect(miss(rest.fore)).toBeGreaterThan(1);

    // Partway, each member publishes the short-arc blend of its own rest and solved orientation.
    const partway = new Map<number, ReturnType<typeof seekMembers>>();
    for (const weight of [0.25, 0.5, 0.75]) {
      const pose = seekMembers(weight);
      const expected = oracle(weight);
      expect(sameBytes(pose.upper, expected.upper)).toBe(true);
      expect(sameBytes(pose.fore, expected.fore)).toBe(true);
      partway.set(weight, pose);
    }

    // Weight 1 closes on the goal.
    expect(miss(seekMembers(1).fore)).toBeLessThan(1e-9);

    // The solve is a pure function of its inputs, so seeking back reproduces every byte.
    expect(seekMembers(0)).toEqual(rest);
    for (const weight of [0.75, 0.25, 0.5])
      expect(seekMembers(weight)).toEqual(partway.get(weight));
  });
});
