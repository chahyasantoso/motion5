import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget, type StageLike } from "../../../src/adapters/dom";
import type {
  AuthoredProperty,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { INSPECT_KEY, INSPECTION_KEY } from "../../../src/contract/solver-constraints";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { freezeValue, type ImmutableRecord } from "../../../src/domain/values";
import { Engine } from "../../../src/engine";
import { buildGraphIR } from "../../../src/graph/ir";
import { unreachable } from "../../../src/lang/exhaustive";
import { createManualClock } from "../../../src/ports/clock";
import type { Patch } from "../../../src/runtime/patch-registry";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { fk3dPlugin } from "../../../src/plugins/fk3d";
import { readFrame3d, ZERO_PIVOT_OFFSET3D, type WorldFrame3d } from "../../../src/plugins/frame3d";
import { ikPlugin } from "../../../src/plugins/ik";
import {
  inspectSolve,
  inspectionOutput,
  type ClosedFormQuality,
  type SolveInspection,
} from "../../../src/plugins/ik-result";
import { ik3dPlugin } from "../../../src/plugins/ik3d";
import { solveTwoBone3d, type SolveMember3d } from "../../../src/plugins/ik3d-analytic";
import type { SolveResult3d } from "../../../src/plugins/ik3d-result";
import { transform3dPlugin } from "../../../src/plugins/transform3d";

/** A 3D solve's delivered inputs, as the publisher hands them to `ik3d`. */
function inputsOf(
  root: WorldFrame3d,
  target: WorldFrame3d,
  first: SolveMember3d,
  second: SolveMember3d,
) {
  return {
    root,
    target,
    members: [
      { id: first.id, base: "rig/root", values: { length: first.length }, progress: 1 },
      { id: second.id, base: first.id, values: { length: second.length }, progress: 1 },
    ],
  };
}

function member3d(id: string, length: number): SolveMember3d {
  return { id, length, offset: ZERO_PIVOT_OFFSET3D };
}

function inspectionOf(values: Readonly<Record<string, unknown>>): SolveInspection {
  const inspection = values[INSPECTION_KEY];
  if (inspection === undefined || typeof inspection !== "object" || inspection === null)
    throw new Error("Expected an inspection record.");
  return inspection as SolveInspection;
}

/** The kinds the closed form answers with, read exhaustively so a new kind turns this red. */
function closedFormKind(quality: ClosedFormQuality): ClosedFormQuality["kind"] {
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
      return quality.kind;
    default:
      return unreachable(quality);
  }
}

const ROOT = readFrame3d({ x: 5, y: -3, z: 2, rotation: 25, rotationX: -15, rotationY: 20 });
const UPPER = member3d("rig/upper", 80);
const FORE = member3d("rig/fore", 60);

/** One rig per closed-form kind, including a far one that solves as its power-of-two image. */
const KINDS: readonly {
  readonly kind: ClosedFormQuality["kind"];
  readonly root: WorldFrame3d;
  readonly target: WorldFrame3d;
  readonly first: SolveMember3d;
  readonly second: SolveMember3d;
}[] = [
  {
    kind: "reached",
    root: ROOT,
    target: readFrame3d({ x: 70, y: 40, z: 50 }),
    first: UPPER,
    second: FORE,
  },
  {
    kind: "too-far",
    root: ROOT,
    target: readFrame3d({ x: 400, y: -90, z: 120 }),
    first: UPPER,
    second: FORE,
  },
  {
    kind: "too-near",
    root: ROOT,
    target: readFrame3d({ x: 12, y: -1, z: 4 }),
    first: UPPER,
    second: member3d("rig/fore", 30),
  },
  {
    kind: "coincident",
    root: ROOT,
    target: readFrame3d({ x: 5, y: -3, z: 2 }),
    first: member3d("rig/upper", 50),
    second: member3d("rig/fore", 50),
  },
  {
    kind: "too-far",
    root: readFrame3d({}),
    target: readFrame3d({ x: 1e300, y: 2e300, z: -1e300 }),
    first: member3d("rig/upper", 2e299),
    second: member3d("rig/fore", 1e299),
  },
];

function registry(...plugins: readonly PluginDefinition[]): PluginRegistry {
  const result = new PluginRegistry();
  for (const plugin of plugins) result.register(plugin);
  return result;
}

function plugins3d(solver: PluginDefinition = ik3dPlugin): PluginRegistry {
  return registry(transform3dPlugin, fk3dPlugin, solver);
}

function load(project: ProjectDefinition, plugins: PluginRegistry = plugins3d()) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
}

const GOAL_SWEEP = [
  { p: 0, v: 70 },
  { p: 1, v: 400 },
];

/** A 3D rig whose solver track is `solve`; the goal's x sweeps out of reach when animated. */
function rig(solve: TrackDefinition, animatedGoal = false): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "3d-inspection",
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "root",
            keyframes: {
              transform3d: {
                values: { x: 5, y: -3, z: 2, rotation: 25, rotationX: -15, rotationY: 20 },
              },
            },
          },
          {
            id: "goal",
            keyframes: {
              transform3d: { values: { x: animatedGoal ? GOAL_SWEEP : 70, y: 40, z: 50 } },
            },
          },
          solve,
          {
            id: "upper",
            keyframes: {
              fk3d: { values: { length: 80 }, requires: { base: "root", solver: "solve" } },
            },
          },
          {
            id: "fore",
            keyframes: {
              fk3d: { values: { length: 60 }, requires: { base: "upper", solver: "solve" } },
            },
          },
        ],
      },
    ],
  };
}

const CHAIN = { root: "root", target: "goal" };

function solverWith(inspect: AuthoredProperty | undefined, grouped = true): TrackDefinition {
  if (inspect === undefined) return { id: "solve", keyframes: { ik3d: { requires: CHAIN } } };
  return grouped
    ? { id: "solve", keyframes: { ik3d: { values: { inspect }, requires: CHAIN } } }
    : { id: "solve", keyframes: { inspect, ik3d: { requires: CHAIN } } };
}

function ruleIds(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map((d) => d.ruleId);
}

const IDS = ["rig/root", "rig/goal", "rig/solve", "rig/upper", "rig/fore"] as const;

/** Mounts the whole rig and returns a reader of each node's latest ready patch. */
function mounted(project: ProjectDefinition) {
  const runtime = load(project);
  const patches = new Map<string, Patch>();
  for (const id of IDS) {
    runtime.mount(id);
    runtime.subscribeNode(id, (patch) => patches.set(id, patch));
  }
  const ready = (id: string) => {
    const patch = patches.get(id);
    if (patch?.status !== "ready") throw new Error(`${id} is ${patch?.status ?? "absent"}.`);
    return patch;
  };
  const at = (progress: number) => {
    runtime.seek("rig/goal", progress);
    runtime.seek("rig/upper", 0);
    runtime.seek("rig/fore", 0);
    return { solve: ready("rig/solve"), upper: ready("rig/upper"), fore: ready("rig/fore") };
  };
  return { at };
}

describe("opt-in 3D solve inspection (issue #500 phase 4, ADR-120)", () => {
  it("TH-52 ik3d claims inspect, owns inspection and publishes the fixed record", () => {
    expect(ik3dPlugin.keys).toEqual([INSPECT_KEY]);
    expect(ik3dPlugin.outputs).toEqual(["rotations3d", INSPECTION_KEY]);
    const target = readFrame3d({ x: 70, y: 40, z: 50 });
    const composed = ik3dPlugin.compose(
      { inspect: true },
      1,
      inputsOf(ROOT, target, UPPER, FORE),
      "rig/solve",
    );
    // Values first, then the pose, then the record: the key order the 2D solver publishes.
    expect(Object.keys(composed)).toEqual(["inspect", "rotations3d", "inspection"]);
    expect(composed.inspect).toBe(true);
    const inspection = inspectionOf(composed);
    expect(Object.keys(inspection).sort()).toEqual([
      "atBound",
      "iterations",
      "kind",
      "residual",
      "residuals",
    ]);
    expect(inspection).toEqual({
      kind: "reached",
      residual: 0,
      iterations: 0,
      atBound: [],
      residuals: { "rig/fore": 0 },
    });
    expect(Object.isFrozen(inspection)).toBe(true);
    expect(Object.isFrozen(inspection.atBound)).toBe(true);
    expect(Object.isFrozen(inspection.residuals)).toBe(true);
    expect(() => freezeValue(inspection as unknown as ImmutableRecord)).not.toThrow();
  });

  it("TH-53 keeps an unopted solver's bytes and honours an explicit false", () => {
    const target = readFrame3d({ x: 70, y: 40, z: 50 });
    const inputs = inputsOf(ROOT, target, UPPER, FORE);
    const solved = solveTwoBone3d(ROOT, target, UPPER, FORE);
    const unopted = ik3dPlugin.compose({}, 1, inputs, "rig/solve");
    const explicitFalse = ik3dPlugin.compose({ inspect: false }, 1, inputs, "rig/solve");
    const opted = ik3dPlugin.compose({ inspect: true }, 1, inputs, "rig/solve");
    // Byte identity against the solve itself rather than a second call of the same composer.
    expect(Object.keys(unopted)).toEqual(["rotations3d"]);
    expect(JSON.stringify(unopted)).toBe(JSON.stringify({ rotations3d: solved.rotations3d }));
    expect(Object.keys(explicitFalse)).toEqual(["inspect", "rotations3d"]);
    expect(explicitFalse).not.toHaveProperty("inspection");
    // Opting in reads `quality` and never feeds back into the pose, so no angle moves by a bit.
    const pose = opted.rotations3d as unknown as SolveResult3d["rotations3d"];
    for (const [id, euler] of Object.entries(solved.rotations3d))
      for (const key of ["rotation", "rotationX", "rotationY"] as const)
        expect(Object.is(pose[id]![key], euler[key])).toBe(true);
    // A non-boolean truthy switch is not an opt-in at runtime either; load refuses it (TH-56).
    expect(ik3dPlugin.compose({ inspect: 1 }, 1, inputs, "rig/solve")).not.toHaveProperty(
      "inspection",
    );
  });

  it("TH-54 publishes every closed-form kind with the direct solve's residuals", () => {
    const seen = new Set<string>();
    for (const { kind, root, target, first, second } of KINDS) {
      const solved = solveTwoBone3d(root, target, first, second);
      expect(closedFormKind(solved.quality)).toBe(kind);
      const composed = ik3dPlugin.compose(
        { inspect: true },
        1,
        inputsOf(root, target, first, second),
        "rig/solve",
      );
      const inspection = inspectionOf(composed);
      expect(inspection.kind).toBe(kind);
      expect(Object.is(inspection.residual, solved.quality.residual)).toBe(true);
      expect(inspection.iterations).toBe(0);
      expect(inspection.atBound).toEqual([]);
      // One addressed leaf, so exactly one entry, equal to the worst residual.
      expect(Object.keys(inspection.residuals)).toEqual([second.id]);
      expect(Object.is(inspection.residuals[second.id], solved.quality.residual)).toBe(true);
      seen.add(kind);
    }
    expect([...seen].sort()).toEqual(["coincident", "reached", "too-far", "too-near"]);
    // The far rig solved as its image, and its residual was restored rather than published small.
    const far = inspectionOf(
      ik3dPlugin.compose(
        { inspect: true },
        1,
        inputsOf(KINDS[4]!.root, KINDS[4]!.target, KINDS[4]!.first, KINDS[4]!.second),
        "rig/solve",
      ),
    );
    expect(far.residual).toBeGreaterThan(1e299);
    expect(Number.isFinite(far.residual)).toBe(true);
  });

  it("TH-55 reads through the 2D inspection owner and agrees with 2D on a planar rig", () => {
    // One owner: the published record is exactly the 2D projection of the 3D evidence, for every
    // kind, rather than a 3D restatement that happens to match today.
    for (const { root, target, first, second } of KINDS) {
      const solved = solveTwoBone3d(root, target, first, second);
      const composed = ik3dPlugin.compose(
        { inspect: true },
        1,
        inputsOf(root, target, first, second),
        "rig/solve",
      );
      expect(inspectionOf(composed)).toEqual(inspectSolve(solved));
      expect(inspectionOutput({ inspect: true }, solved)).toEqual({
        inspection: inspectSolve(solved),
      });
      expect(inspectionOutput({ inspect: false }, solved)).toEqual({});
    }
    // One vocabulary: a planar 3D rig reports the kind the 2D closed form reports for the same
    // rig, and a residual equal to rounding, keyed by the same leaf.
    const planar = [
      { x: 90, y: 60 },
      { x: 400, y: -30 },
      { x: 8, y: 3 },
    ];
    const members2d = [
      { id: "rig/upper", base: "rig/root", values: { length: 80 }, progress: 1 },
      { id: "rig/fore", base: "rig/upper", values: { length: 60 }, progress: 1 },
    ];
    for (const goal of planar) {
      const flat = inspectionOf(
        ikPlugin.compose(
          { inspect: true },
          1,
          {
            root: { x: 0, y: 0, rotation: 30 },
            target: { ...goal, rotation: 0 },
            members: members2d,
          },
          "rig/solve",
        ),
      );
      const spatial = inspectionOf(
        ik3dPlugin.compose(
          { inspect: true },
          1,
          inputsOf(readFrame3d({ rotation: 30 }), readFrame3d(goal), UPPER, FORE),
          "rig/solve",
        ),
      );
      expect(spatial.kind).toBe(flat.kind);
      expect(Object.keys(spatial.residuals)).toEqual(Object.keys(flat.residuals));
      expect(Math.abs(spatial.residual - flat.residual)).toBeLessThanOrEqual(1e-9);
    }
  });

  it("TH-56 holds ik3d's switch to the 2D load rules, flat and grouped", () => {
    // Malformed, grouped or flat, is the 2D rule, read for the group that bound the 3D root.
    for (const bad of ["yes", 1, [{ p: 0, v: true }]] as const) {
      expect(ruleIds(rig(solverWith(bad)))).toContain("ik-inspect-malformed");
      expect(ruleIds(rig(solverWith(bad, false)))).toContain("ik-inspect-malformed");
    }
    const path = buildGraphIR(rig(solverWith("yes"))).diagnostics.find(
      (d) => d.ruleId === "ik-inspect-malformed",
    )?.path;
    expect(path).toBe("rig/solve.keyframes.ik3d.values.inspect");
    // Under a group that did not bind the root it is misgrouped, and only misgrouped.
    const misgrouped = rig({
      id: "solve",
      keyframes: { ik3d: { requires: CHAIN }, transform3d: { values: { inspect: "yes" } } },
    });
    expect(buildGraphIR(misgrouped).diagnostics.map((d) => [d.ruleId, d.path])).toEqual([
      ["ik-solver-key-misgrouped", "rig/solve.keyframes.transform3d.values.inspect"],
    ]);
    // Both static booleans load through the engine, grouped and flat, with nothing refused.
    const accepted = [solverWith(true), solverWith(false), solverWith(true, false)];
    for (const solve of accepted) {
      expect(buildGraphIR(rig(solve)).diagnostics).toEqual([]);
      expect(() => load(rig(solve))).not.toThrow();
    }
    // The half that needs this phase: without the claim the registry refuses the switch.
    const unclaimed = plugins3d({ ...ik3dPlugin, keys: [] });
    for (const solve of accepted)
      expect(() => load(rig(solve), unclaimed)).toThrow(/plugin-unknown-key/);
    // Two registered claimants make the flat spelling ambiguous, exactly as `x` already is between
    // `transform` and `transform3d` (TH-10); the group names the owner (ADR-043).
    const both = registry(transform3dPlugin, fk3dPlugin, ik3dPlugin, ikPlugin);
    expect(() => load(rig(solverWith(true, false)), both)).toThrow(/plugin-ambiguous-key/);
    expect(() => load(rig(solverWith(true)), both)).not.toThrow();
  });

  it("TH-57 publishes through the engine, stays off the DOM and seeks back byte for byte", () => {
    const opted = mounted(rig(solverWith(true), true));
    const unopted = mounted(rig(solverWith(undefined), true));
    const reachedOpted = opted.at(0);
    const reachedUnopted = unopted.at(0);
    expect(Object.keys(reachedUnopted.solve.values)).toEqual(["rotations3d"]);
    expect(Object.keys(reachedOpted.solve.values)).toEqual([
      "inspect",
      "rotations3d",
      "inspection",
    ]);
    expect(inspectionOf(reachedOpted.solve.values).kind).toBe("reached");
    // Opting in changes the solver's patch by exactly the two added keys, and no member patch.
    const { values: optedValues, ...optedEnvelope } = reachedOpted.solve;
    const { values: unoptedValues, ...unoptedEnvelope } = reachedUnopted.solve;
    expect(JSON.stringify(optedEnvelope)).toBe(JSON.stringify(unoptedEnvelope));
    const { inspect, inspection, ...optedRest } = optedValues;
    expect(inspect).toBe(true);
    expect(inspection).toBeDefined();
    expect(JSON.stringify(optedRest)).toBe(JSON.stringify(unoptedValues));
    expect(JSON.stringify(reachedOpted.upper)).toBe(JSON.stringify(reachedUnopted.upper));
    expect(JSON.stringify(reachedOpted.fore)).toBe(JSON.stringify(reachedUnopted.fore));

    // An animated goal leaving the band changes the kind, and seeking back reproduces every byte.
    const far = opted.at(1);
    const farInspection = inspectionOf(far.solve.values);
    expect(farInspection.kind).toBe("too-far");
    expect(farInspection.residual).toBeGreaterThan(0);
    const snapshot = (pose: ReturnType<typeof opted.at>) =>
      JSON.stringify([pose.solve.values, pose.upper.values, pose.fore.values]);
    const reachedBytes = snapshot(reachedOpted);
    const farBytes = snapshot(far);
    expect(snapshot(opted.at(0))).toBe(reachedBytes);
    expect(snapshot(opted.at(1))).toBe(farBytes);
    expect(snapshot(opted.at(0.5))).not.toBe(reachedBytes);
    expect(snapshot(opted.at(0))).toBe(reachedBytes);

    // The record is data for a consumer, not a property a renderer writes.
    const writes: Record<string, unknown>[] = [];
    const stage = { style: {} } as unknown as StageLike;
    const adapter = createDomPatchAdapter(stage, undefined, undefined, (_: DomTarget, values) => {
      writes.push({ ...values });
    });
    adapter.apply(far.solve);
    const written = writes.flatMap((write) => Object.keys(write));
    expect(written).not.toContain("inspection");
    expect(written).not.toContain("rotations3d");
  });
});
