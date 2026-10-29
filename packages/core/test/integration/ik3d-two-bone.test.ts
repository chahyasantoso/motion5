import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import type { AuthoredPluginRequires, ProjectDefinition } from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine } from "../../src/engine";
import { buildGraphIR } from "../../src/graph/ir";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { fk3dPlugin } from "@motion5/plugins/fk3d";
import {
  blendOrientation3d,
  composeWorld3d,
  readEuler3d,
  readFrame3d,
  ZERO_EULER,
  type Euler3d,
  type WorldFrame3d,
} from "@motion5/plugins/frame3d";
import { ik3dPlugin } from "@motion5/plugins/ik3d";
import { transform3dPlugin } from "@motion5/plugins/transform3d";
import type { Patch } from "../../src/runtime/patch-registry";
import { builtinRegistry } from "../support/builtin-registry";

const ROOT_DEFAULT = { x: 0, y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0 };

const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", input: { values: ROOT_DEFAULT } },
        {
          id: "goals",
          input: {
            values: [
              {
                id: "goal",
                cells: {
                  memberId: "fore",
                  x: 100,
                  y: 20,
                  z: 30,
                },
              },
            ],
          },
        },
        {
          id: "body",
          input: {
            values: [
              { id: "upper", cells: { length: 80, rotation: 0, rotationX: 0, rotationY: 0 } },
              {
                id: "fore",
                cells: { parentId: "upper", length: 60, rotation: 0, rotationX: 0, rotationY: 0 },
              },
            ],
          },
        },
        {
          id: "solve",
          plugin: "ik3d",
          input: { values: {}, requires: { chain: "body", goals: "goals", base: "root" } },
        },
        {
          id: "pose",
          plugin: "fk3d",
          input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
        },
      ],
    },
  ],
};

function poleSide(elbow: Readonly<Record<string, unknown>>, poleY: number): number {
  const unit = [GOAL.x, GOAL.y, GOAL.z].map((c) => c / Math.hypot(GOAL.x, GOAL.y, GOAL.z));
  const off = (v: readonly number[]) => {
    const along = v[0]! * unit[0]! + v[1]! * unit[1]! + v[2]! * unit[2]!;
    return v.map((c, i) => c - unit[i]! * along);
  };
  const e = off([Number(elbow.x), Number(elbow.y), Number(elbow.z)]);
  const p = off([30, poleY, 10]);
  return e[0]! * p[0]! + e[1]! * p[1]! + e[2]! * p[2]!;
}

function goalMiss(fore: Readonly<Record<string, unknown>>): number {
  return Math.hypot(Number(fore.x) - GOAL.x, Number(fore.y) - GOAL.y, Number(fore.z) - GOAL.z);
}

function staticPoleRig(
  requires: AuthoredPluginRequires,
  poleY: number,
  bodyCells: readonly any[] = [
    { id: "upper", cells: { length: 80, rotation: 0, rotationX: 0, rotationY: 0 } },
    {
      id: "fore",
      cells: { parentId: "upper", length: 60, rotation: 0, rotationX: 0, rotationY: 0 },
    },
  ],
): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "3d-pole-static",
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          { id: "root", input: { values: ROOT_DEFAULT } },
          {
            id: "goals",
            input: { values: [{ id: "goal", cells: { memberId: "fore", ...GOAL } }] },
          },
          {
            id: "knee",
            input: { values: { x: 30, y: poleY, z: 10, rotation: 0, rotationX: 0, rotationY: 0 } },
          },
          { id: "body", input: { values: bodyCells } },
          { id: "solve", plugin: "ik3d", input: { values: {}, requires } },
          {
            id: "pose",
            plugin: "fk3d",
            input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
          },
        ],
      },
    ],
  };
}

function refusedRuleIds(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project, builtinRegistry()).diagnostics.map((d) => d.ruleId);
}

function createRuntime(project: ProjectDefinition = PROJECT) {
  const plugins = new PluginCatalog();
  plugins.registerAll([transform3dPlugin, fk3dPlugin, ik3dPlugin]);
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

const RESTED: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-rest",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "root",
          input: { values: { x: 5, y: -5, z: 0, rotation: 0, rotationX: 0, rotationY: 0 } },
        },
        { id: "goals", input: { values: [{ id: "goal", cells: { memberId: "fore", ...GOAL } }] } },
        {
          id: "body",
          input: {
            values: [
              { id: "upper", cells: { length: 80, ...UPPER_REST, weight: RAMP } },
              { id: "fore", cells: { parentId: "upper", length: 60, ...FORE_REST, weight: RAMP } },
            ],
          },
        },
        {
          id: "solve",
          plugin: "ik3d",
          input: { values: {}, requires: { chain: "body", goals: "goals", base: "root" } },
        },
        {
          id: "pose",
          plugin: "fk3d",
          input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
        },
      ],
    },
  ],
};

const OFFSET_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-offsets",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "root",
          input: { values: { x: 5, y: -3, z: 2, rotation: 25, rotationX: -15, rotationY: 20 } },
        },
        {
          id: "goals",
          input: { values: [{ id: "goal", cells: { memberId: "fore", x: 70, y: 40, z: 50 } }] },
        },
        {
          id: "body",
          input: {
            values: [
              {
                id: "upper",
                cells: { length: 80, x: 5, y: -3, z: 2, rotation: 0, rotationX: 0, rotationY: 0 },
              },
              {
                id: "fore",
                cells: {
                  parentId: "upper",
                  length: 60,
                  x: -10,
                  y: 6,
                  z: 4,
                  rotation: 0,
                  rotationX: 0,
                  rotationY: 0,
                },
              },
            ],
          },
        },
        {
          id: "solve",
          plugin: "ik3d",
          input: { values: {}, requires: { chain: "body", goals: "goals", base: "root" } },
        },
        {
          id: "pose",
          plugin: "fk3d",
          input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
        },
      ],
    },
  ],
};

const POLE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  projectId: "3d-pole",
  motions: [
    {
      id: "rig",
      trigger: { type: "manual" },
      tracks: [
        { id: "root", input: { values: ROOT_DEFAULT } },
        { id: "goals", input: { values: [{ id: "goal", cells: { memberId: "fore", ...GOAL } }] } },
        {
          id: "knee",
          input: {
            values: {
              x: 30,
              y: [
                { p: 0, v: 120 },
                { p: 1, v: -120 },
              ],
              z: 10,
              rotation: 0,
              rotationX: 0,
              rotationY: 0,
            },
          },
        },
        {
          id: "body",
          input: {
            values: [
              { id: "upper", cells: { length: 80, rotation: 0, rotationX: 0, rotationY: 0 } },
              {
                id: "fore",
                cells: { parentId: "upper", length: 60, rotation: 0, rotationX: 0, rotationY: 0 },
              },
            ],
          },
        },
        {
          id: "solve",
          plugin: "ik3d",
          input: {
            values: {},
            requires: { chain: "body", goals: "goals", base: "root", pole: "knee" },
          },
        },
        {
          id: "pose",
          plugin: "fk3d",
          input: { values: {}, requires: { chain: "body", solved: "solve", base: "root" } },
        },
      ],
    },
  ],
};

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
    for (const id of ["rig/root", "rig/goals", "rig/body", "rig/solve", "rig/pose"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    runtime.seek("rig/pose", 0);
    for (const patch of patches.values()) if (patch.status === "ready") adapter.apply(patch);
    const pose = patches.get("rig/pose");
    if (pose?.status !== "ready") throw new Error("3D pose did not publish");
    const foreCells = (pose.outputs.values as any[]).find((r) => r.id === "fore")?.cells;
    const scalarPatch = {
      nodeId: "rig/fore",
      revision: 1,
      status: "ready" as const,
      sourceProgress: 0,
      sourceRevisions: {},
      diagnostics: [],
      outputs: { values: foreCells },
    };
    adapter.apply(scalarPatch);
    const solve = patches.get("rig/solve");
    expect(solve?.status).toBe("ready");
    if (solve?.status !== "ready") throw new Error("3D solve did not publish");
    expect(solve.outputs.values).toBeDefined();
    expect(target.style.transform).toContain("translate3d(");
    expect(target.style.transform).toContain(" rotate(");
    expect(target.style.transform).toContain(" rotateX(");
    expect(target.style.transform).toContain(" rotateY(");
  });

  it("TH-15 propagates a goal edit through solver and member patches", () => {
    const runtime = createRuntime();
    const revisions = new Map<string, number>();
    for (const id of ["rig/root", "rig/goals", "rig/body", "rig/solve", "rig/pose"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => {
        if (patch.status === "ready") revisions.set(id, patch.revision);
      });
    }
    runtime.seek("rig/pose", 0);
    const initial = new Map(revisions);
    runtime
      .track("rig/goals")
      .writeValues([{ id: "goal", cells: { memberId: "fore", x: 110, y: 25, z: 35 } }]);
    for (const id of ["rig/goals", "rig/solve", "rig/pose"]) {
      expect(initial.get(id)).toBeDefined();
      expect(revisions.get(id)).toBeGreaterThan(initial.get(id) ?? Number.POSITIVE_INFINITY);
    }
    expect(revisions.get("rig/root")).toBe(initial.get("rig/root"));
  });

  it("TH-32 a rest pose ramps into the solve by weight and seeks back to the same bytes", () => {
    const runtime = createRuntime(RESTED);
    const ids = ["rig/root", "rig/goals", "rig/body", "rig/solve", "rig/pose"];
    const patches = new Map<string, Patch>();
    for (const id of ids) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    const ready = (id: string) => {
      const patch = patches.get(id);
      if (patch?.status !== "ready") throw new Error(`${id} is ${patch?.status ?? "absent"}.`);
      return patch;
    };
    const seekMembers = (progress: number) => {
      runtime.seek("rig/body", progress);
      runtime.seek("rig/pose", progress);
      const pose = ready("rig/pose");
      const rows = pose.outputs.values as readonly any[];
      return {
        upper: { ...rows.find((r) => r.id === "upper")?.cells },
        fore: { ...rows.find((r) => r.id === "fore")?.cells },
      };
    };
    const rest = seekMembers(0);
    const root = readFrame3d({ x: 5, y: -5, z: 0, rotation: 0, rotationX: 0, rotationY: 0 });
    const solvePatch = ready("rig/solve");
    const solveRows = solvePatch.outputs.values as readonly any[];
    const upperSolved = readEuler3d(solveRows.find((r) => r.id === "upper")?.cells);
    const foreSolved = readEuler3d(solveRows.find((r) => r.id === "fore")?.cells);
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
    expect(goalMiss(rest.fore)).toBeGreaterThan(1);

    const partway = new Map<number, ReturnType<typeof seekMembers>>();
    for (const weight of [0.25, 0.5, 0.75]) {
      const pose = seekMembers(weight);
      const expected = oracle(weight);
      expect(sameBytes(pose.upper, expected.upper)).toBe(true);
      expect(sameBytes(pose.fore, expected.fore)).toBe(true);
      partway.set(weight, pose);
    }

    expect(goalMiss(seekMembers(1).fore)).toBeLessThan(1e-9);

    expect(seekMembers(0)).toEqual(rest);
    for (const weight of [0.75, 0.25, 0.5])
      expect(seekMembers(weight)).toEqual(partway.get(weight));
  });

  it("TH-39 carries offsets through Engine and DOM, closes, and seeks byte-for-byte", () => {
    const runtime = createRuntime(OFFSET_PROJECT);
    const patches = new Map<string, Patch>();
    const target: DomTarget = { style: {} };
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => target);
    for (const id of ["rig/root", "rig/goals", "rig/body", "rig/solve", "rig/pose"]) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    runtime.seek("rig/pose", 0);
    const pose = patches.get("rig/pose");
    if (pose?.status !== "ready") throw new Error("offset pose did not publish");
    const fore = (pose.outputs.values as any[]).find((r) => r.id === "fore")?.cells;
    adapter.apply({
      nodeId: "rig/fore",
      revision: 1,
      status: "ready",
      sourceProgress: 0,
      sourceRevisions: {},
      diagnostics: [],
      outputs: { values: fore },
    });
    const miss = Math.hypot(Number(fore.x) - 70, Number(fore.y) - 40, Number(fore.z) - 50);
    expect(miss).toBeLessThanOrEqual(1e-9);
    expect(target.style.transform).toContain("translate3d(");
    const bytes = { ...fore };
    runtime.seek("rig/pose", 0);
    const poseAgain = patches.get("rig/pose");
    if (poseAgain?.status !== "ready") throw new Error("offset pose did not republish");
    const foreAgain = (poseAgain.outputs.values as any[]).find((r) => r.id === "fore")?.cells;
    expect(foreAgain).toEqual(bytes);
  });

  it("TH-48 an animated pole flips the elbow through Engine and DOM and seeks byte-for-byte", () => {
    const runtime = createRuntime(POLE_PROJECT);
    const ids = ["rig/root", "rig/goals", "rig/knee", "rig/body", "rig/solve", "rig/pose"];
    const patches = new Map<string, Patch>();
    for (const id of ids) {
      runtime.mount(id);
      runtime.subscribeNode(id, (patch) => patches.set(id, patch));
    }
    const target: DomTarget = { style: {} };
    const adapter = createDomPatchAdapter({ style: {} }, undefined, () => target);
    const ready = (id: string) => {
      const patch = patches.get(id);
      if (patch?.status !== "ready") throw new Error(`${id} is ${patch?.status ?? "absent"}.`);
      return patch;
    };
    const poseAt = (progress: number) => {
      runtime.seek("rig/knee", progress);
      runtime.seek("rig/pose", 0);
      const pose = ready("rig/pose");
      const rows = pose.outputs.values as readonly any[];
      const fore = rows.find((r) => r.id === "fore")?.cells;
      adapter.apply({
        nodeId: "rig/fore",
        revision: pose.revision,
        status: "ready",
        sourceProgress: 0,
        sourceRevisions: {},
        diagnostics: [],
        outputs: { values: fore },
      });
      return {
        upper: { ...rows.find((r) => r.id === "upper")?.cells },
        fore: { ...rows.find((r) => r.id === "fore")?.cells },
      };
    };
    const above = poseAt(0);
    expect(goalMiss(above.fore)).toBeLessThanOrEqual(1e-9);
    expect(poleSide(above.upper, 120)).toBeGreaterThan(0);
    expect(target.style.transform).toContain("translate3d(");
    const below = poseAt(1);
    expect(goalMiss(below.fore)).toBeLessThanOrEqual(1e-9);
    expect(poleSide(below.upper, -120)).toBeGreaterThan(0);
    expect(below.upper).not.toEqual(above.upper);
    expect(poseAt(0)).toEqual(above);
    expect(poseAt(1)).toEqual(below);
  });

  it("TH-49 a misplaced pole refuses the whole load under exactly one rule", () => {
    const chain = { chain: "body", goals: "goals", base: "root" };
    expect(refusedRuleIds(staticPoleRig({ ...chain, pole: "knee" }, 120))).toEqual([]);

    const misplacedPoseProject = {
      ...staticPoleRig(chain, 120),
      motions: [
        {
          ...staticPoleRig(chain, 120).motions[0]!,
          tracks: staticPoleRig(chain, 120).motions[0]!.tracks.map((t) =>
            t.id === "pose"
              ? {
                  ...t,
                  input: {
                    values: {},
                    requires: { chain: "body", solved: "solve", base: "root", pole: "knee" },
                  },
                }
              : t,
          ),
        },
      ],
    };
    expect(refusedRuleIds(misplacedPoseProject as ProjectDefinition)).toEqual(["slot-unknown"]);

    const singleBoneBody = [
      { id: "upper", cells: { length: 80, rotation: 0, rotationX: 0, rotationY: 0 } },
    ];
    const singleBoneProject = staticPoleRig({ ...chain, pole: "knee" }, 120, singleBoneBody);
    expect(refusedRuleIds(singleBoneProject)).toEqual([]);
  });

  it("TH-50 a solver addressing its leaf through targets bends toward its pole too", () => {
    const pose = (poleY: number) => {
      const runtime = createRuntime(
        staticPoleRig({ chain: "body", goals: "goals", base: "root", pole: "knee" }, poleY),
      );
      const patches = new Map<string, Patch>();
      for (const id of ["rig/root", "rig/goals", "rig/knee", "rig/body", "rig/solve", "rig/pose"]) {
        runtime.mount(id);
        runtime.subscribeNode(id, (patch) => patches.set(id, patch));
      }
      runtime.seek("rig/pose", 0);
      const posePatch = patches.get("rig/pose");
      if (posePatch?.status !== "ready") throw new Error("pose not ready");
      const rows = posePatch.outputs.values as readonly any[];
      return {
        upper: { ...rows.find((r) => r.id === "upper")?.cells },
        fore: { ...rows.find((r) => r.id === "fore")?.cells },
      };
    };
    for (const poleY of [120, -120]) {
      const { upper, fore } = pose(poleY);
      expect(goalMiss(fore)).toBeLessThanOrEqual(1e-9);
      expect(poleSide(upper, poleY)).toBeGreaterThan(0);
    }
    expect(pose(120).upper).not.toEqual(pose(-120).upper);
  });
});
