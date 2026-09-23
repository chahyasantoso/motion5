import { describe, expect, it } from "vitest";
import { createDomPatchAdapter, type DomTarget, type StageLike } from "../../../src/adapters/dom";
import type {
  AuthoredProperty,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { PluginRegistry } from "../../../src/domain/plugins";
import type { ImmutableRecord } from "../../../src/domain/values";
import { freezeValue } from "../../../src/domain/values";
import { Engine } from "../../../src/engine";
import { buildGraphIR } from "../../../src/graph/ir";
import { unreachable } from "../../../src/lang/exhaustive";
import { createManualClock } from "../../../src/ports/clock";
import type { Patch } from "../../../src/runtime/patch-registry";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { fkPlugin } from "../../../src/plugins/fk";
import { ikPlugin } from "../../../src/plugins/ik";
import { readGoals, readMembers, readSolveMembers } from "../../../src/plugins/ik-chain";
import { solveChain } from "../../../src/plugins/ik-solve";
import { transformPlugin } from "../../../src/plugins/transform";
import type { SolveInspection, SolveQuality } from "../../../src/plugins/ik-result";
import { inspectSolve } from "../../../src/plugins/ik-result";

const ROOT = { x: 200, y: 300, rotation: 0 };
const TARGET = { x: 320, y: 340, rotation: 0 };
const MEMBERS = [
  { id: "walker/upper", base: "walker/shoulder", values: { length: 80 }, progress: 0 },
  { id: "walker/fore", base: "walker/upper", values: { length: 60 }, progress: 0 },
];

function qualityKind(quality: SolveQuality): SolveQuality["kind"] {
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
    case "converged":
    case "stalled":
    case "iteration-cap":
    case "limited":
      return quality.kind;
    default:
      return unreachable(quality);
  }
}

function projectWith(
  solve: TrackDefinition,
  extra: readonly TrackDefinition[] = [],
): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "inspection",
    motions: [
      {
        id: "walker",
        trigger: { type: "manual" },
        tracks: [
          { id: "root", keyframes: { transform: { values: { x: 200, y: 300, rotation: 0 } } } },
          { id: "goal", keyframes: { transform: { values: { x: 320, y: 340, rotation: 0 } } } },
          solve,
          {
            id: "upper",
            keyframes: {
              fk: { values: { length: 80 }, requires: { base: "root", solver: "solve" } },
            },
          },
          {
            id: "fore",
            keyframes: {
              fk: { values: { length: 60 }, requires: { base: "upper", solver: "solve" } },
            },
          },
          ...extra,
        ],
      },
    ],
  };
}

function ruleIds(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map((d) => d.ruleId);
}

function publishedSolver(project: ProjectDefinition): Patch {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  const runtime = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins,
  }).load(project);
  const published: Patch[] = [];
  for (const id of ["walker/root", "walker/goal", "walker/solve", "walker/upper", "walker/fore"])
    runtime.mount(id);
  runtime.subscribeNode("walker/solve", (patch) => {
    published.push(patch);
  });
  runtime.seek("walker/root", 0);
  const solver = published.at(-1);
  if (solver === undefined) throw new Error("The solver published no patch.");
  return solver;
}

function projectWithInspect(value: AuthoredProperty, grouped = true): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "inspection",
    motions: [
      {
        id: "walker",
        trigger: { type: "manual" },
        tracks: [
          { id: "root" },
          { id: "goal" },
          {
            id: "solve",
            keyframes: grouped
              ? { ik: { values: { inspect: value }, requires: { root: "root", target: "goal" } } }
              : { inspect: value, ik: { requires: { root: "root", target: "goal" } } },
          },
          {
            id: "upper",
            keyframes: {
              fk: { values: { length: 80 }, requires: { base: "root", solver: "solve" } },
            },
          },
          {
            id: "fore",
            keyframes: {
              fk: { values: { length: 60 }, requires: { base: "upper", solver: "solve" } },
            },
          },
        ],
      },
    ],
  };
}

function inspectionOf(values: Readonly<Record<string, unknown>>): SolveInspection {
  const inspection = values.inspection;
  if (inspection === undefined || typeof inspection !== "object" || inspection === null)
    throw new Error("Expected an inspection record.");
  return inspection as SolveInspection;
}

function expectedIterations(quality: SolveQuality): number {
  switch (quality.kind) {
    case "reached":
    case "too-far":
    case "too-near":
    case "coincident":
      return 0;
    case "converged":
    case "stalled":
    case "iteration-cap":
    case "limited":
      return quality.iterations;
    default:
      return unreachable(quality);
  }
}

describe("opt-in IK solve inspection", () => {
  it("IN-1 publishes a fixed inspection projection beside authored inspect and rotations", () => {
    const composed = ikPlugin.compose(
      { inspect: true },
      0,
      { root: ROOT, target: TARGET, members: MEMBERS },
      "walker/solve",
    );
    expect(ikPlugin.outputs).toEqual(["rotations", "inspection"]);
    expect(Object.keys(composed).sort()).toEqual(["inspect", "inspection", "rotations"]);
    expect(composed.inspect).toBe(true);
    expect(inspectionOf(composed)).toEqual({
      kind: "reached",
      residual: 0,
      iterations: 0,
      atBound: [],
    });
    expect(Object.isFrozen(composed.inspection)).toBe(true);
    expect(Object.isFrozen(inspectionOf(composed).atBound)).toBe(true);
  });

  it("IN-2 keeps unopted output byte-identical and retains an explicit false opt-out", () => {
    const unopted = ikPlugin.compose(
      {},
      0,
      { root: ROOT, target: TARGET, members: MEMBERS },
      "walker/solve",
    );
    const explicitFalse = ikPlugin.compose(
      { inspect: false },
      0,
      { root: ROOT, target: TARGET, members: MEMBERS },
      "walker/solve",
    );
    expect(Object.keys(unopted)).toEqual(["rotations"]);
    expect(Object.keys(explicitFalse).sort()).toEqual(["inspect", "rotations"]);
    expect(explicitFalse.inspect).toBe(false);
    expect(explicitFalse).not.toHaveProperty("inspection");
    // Byte identity against the solve itself rather than against a second call of the same
    // composer: an unopted patch is exactly `{ rotations }` of the solve, and opting in moves no
    // rotation by a single bit, because inspection reads `quality` and never feeds back into it.
    const members = readMembers(MEMBERS);
    const solved = solveChain(ROOT, readSolveMembers(members, readGoals(TARGET, members)));
    expect(JSON.stringify(unopted)).toBe(JSON.stringify({ rotations: solved.rotations }));
    const opted = ikPlugin.compose(
      { inspect: true },
      0,
      { root: ROOT, target: TARGET, members: MEMBERS },
      "walker/solve",
    );
    const optedRotations = opted.rotations as unknown as Readonly<Record<string, number>>;
    for (const [id, angle] of Object.entries(solved.rotations))
      expect(Object.is(optedRotations[id], angle)).toBe(true);
  });

  it("IN-3 uses the same inspection output key for analytic and FABRIK arities", () => {
    const analytic = ikPlugin.compose(
      { inspect: true },
      0,
      { root: ROOT, target: TARGET, members: MEMBERS },
      "walker/solve",
    );
    const fabrik = ikPlugin.compose(
      { inspect: true },
      0,
      {
        root: ROOT,
        target: TARGET,
        members: [
          ...MEMBERS,
          { id: "walker/tip", base: "walker/fore", values: { length: 40 }, progress: 0 },
        ],
      },
      "walker/solve",
    );
    expect(Object.keys(analytic).sort()).toEqual(["inspect", "inspection", "rotations"]);
    expect(Object.keys(fabrik).sort()).toEqual(["inspect", "inspection", "rotations"]);
    expect(inspectionOf(fabrik).kind).toMatch(/^(converged|stalled|iteration-cap)$/);
  });

  it("IN-4 reads flat and grouped authored spellings", () => {
    expect(buildGraphIR(projectWithInspect("yes")).diagnostics.map((d) => d.ruleId)).toContain(
      "ik-inspect-malformed",
    );
    expect(
      buildGraphIR(projectWithInspect([{ p: 0, v: true }])).diagnostics.map((d) => d.ruleId),
    ).toContain("ik-inspect-malformed");
    expect(
      buildGraphIR(projectWithInspect("yes", false)).diagnostics.map((d) => d.ruleId),
    ).toContain("ik-inspect-malformed");
  });

  it("IN-5 accepts both static boolean spellings", () => {
    expect(buildGraphIR(projectWithInspect(true)).diagnostics.map((d) => d.ruleId)).not.toContain(
      "ik-inspect-malformed",
    );
    expect(
      buildGraphIR(projectWithInspect(false, false)).diagnostics.map((d) => d.ruleId),
    ).not.toContain("ik-inspect-malformed");
  });

  it("IN-6 exhaustively projects every quality kind into one frozen shape", () => {
    const qualities: readonly SolveQuality[] = [
      { kind: "reached", residual: 1 },
      { kind: "too-far", residual: 2 },
      { kind: "too-near", residual: 3 },
      { kind: "coincident", residual: 4 },
      { kind: "converged", iterations: 5, residual: 6 },
      { kind: "stalled", iterations: 7, residual: 8 },
      { kind: "iteration-cap", iterations: 9, residual: 10 },
      { kind: "limited", iterations: 11, residual: 12, atBound: ["walker/upper"] },
    ];
    for (const quality of qualities) {
      const inspection = inspectSolve(quality);
      expect(Object.keys(inspection).sort()).toEqual(["atBound", "iterations", "kind", "residual"]);
      expect(Object.isFrozen(inspection)).toBe(true);
      expect(inspection.kind).toBe(qualityKind(quality));
      expect(inspection.residual).toBe(quality.residual);
      expect(inspection.iterations).toBe(expectedIterations(quality));
      expect(inspection.atBound).toEqual(quality.kind === "limited" ? quality.atBound : []);
      expect(Object.isFrozen(inspection.atBound)).toBe(true);
      expect(() => freezeValue(inspection as unknown as ImmutableRecord)).not.toThrow();
    }
    const source = ["walker/fore"];
    const limited = inspectSolve({ kind: "limited", iterations: 2, residual: 3, atBound: source });
    expect(limited.atBound).not.toBe(source);
  });

  it("IN-7 refuses inspect under a group that did not bind the solver's root", () => {
    const requires = { root: "root", target: "goal" };
    const project = projectWith({
      id: "solve",
      keyframes: { ik: { values: {}, requires }, spring: { values: { inspect: true } } },
    });
    const found = buildGraphIR(project).diagnostics;
    const misgrouped = found.filter((d) => d.ruleId === "ik-solver-key-misgrouped");
    expect(misgrouped.map((d) => d.path)).toEqual(["walker/solve.keyframes.spring.values.inspect"]);
    // Misgrouped is the answer, so the value is not also classified as a malformed switch.
    const malformed = projectWith({
      id: "solve",
      keyframes: { ik: { values: {}, requires }, spring: { values: { inspect: "yes" } } },
    });
    expect(ruleIds(malformed)).toContain("ik-solver-key-misgrouped");
    expect(ruleIds(malformed)).not.toContain("ik-inspect-malformed");
  });

  it("IN-8 leaves another plugin's inspect alone on a node that bound no root", () => {
    const bystander: TrackDefinition = {
      id: "bystander",
      keyframes: { spring: { values: { inspect: "verbose" } }, inspect: 3 },
    };
    const project = projectWith(
      { id: "solve", keyframes: { ik: { requires: { root: "root", target: "goal" } } } },
      [bystander],
    );
    expect(ruleIds(project).filter((id) => id.startsWith("ik-"))).toEqual([]);
  });

  it("IN-9 publishes inspection through the engine and keeps it off the DOM", () => {
    const requires = { root: "root", target: "goal" };
    const opted = publishedSolver(
      projectWith({ id: "solve", keyframes: { ik: { values: { inspect: true }, requires } } }),
    );
    const unopted = publishedSolver(projectWith({ id: "solve", keyframes: { ik: { requires } } }));
    if (opted.status !== "ready" || unopted.status !== "ready")
      throw new Error(`Expected ready solver patches, got ${opted.status} and ${unopted.status}.`);
    expect(Object.keys(unopted.values).sort()).toEqual(["rotations"]);
    expect(Object.keys(opted.values).sort()).toEqual(["inspect", "inspection", "rotations"]);
    expect(opted.values.inspection).toEqual({
      kind: "reached",
      residual: 0,
      iterations: 0,
      atBound: [],
    });
    expect(JSON.stringify(opted.values.rotations)).toBe(JSON.stringify(unopted.values.rotations));

    // The record is data for a consumer, not a property a renderer writes: the DOM adapter skips
    // a plain record, so the stage receives the scalar `inspect` switch and nothing named
    // `inspection` or `rotations`.
    const writes: Record<string, unknown>[] = [];
    const stage = { style: {} } as unknown as StageLike;
    const adapter = createDomPatchAdapter(stage, undefined, undefined, (_: DomTarget, values) => {
      writes.push({ ...values });
    });
    adapter.apply(opted);
    expect(writes.flatMap((write) => Object.keys(write))).not.toContain("inspection");
  });
});
