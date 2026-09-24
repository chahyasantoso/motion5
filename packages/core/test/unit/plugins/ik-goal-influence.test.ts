import { describe, expect, it } from "vitest";
import type {
  AuthoredProperty,
  ProjectDefinition,
  TrackDefinition,
} from "../../../src/contract/v5";
import { PluginRegistry } from "../../../src/domain/plugins";
import { buildGraphIR } from "../../../src/graph/ir";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/testing/fakes";
import { fkPlugin } from "../../../src/plugins/fk";
import { ikPlugin } from "../../../src/plugins/ik";
import { branchPulls, compromise, readInfluence } from "../../../src/plugins/ik-goal";
import { readSolveMembers, type DeliveredMember } from "../../../src/plugins/ik-chain";
import { solveFabrik } from "../../../src/plugins/fabrik";
import { solveChain } from "../../../src/plugins/ik-solve";
import type { SolveMember } from "../../../src/plugins/ik-member";
import { inspectSolve } from "../../../src/plugins/ik-result";
import type { WorldFrame } from "../../../src/plugins/frame";
import { transformPlugin } from "../../../src/plugins/transform";

const ROOT: WorldFrame = { x: 0, y: 0, rotation: 0 };
const property = (value: unknown): AuthoredProperty => value as AuthoredProperty;

function member(
  id: string,
  base: string,
  length: number,
  extra: Partial<SolveMember> = {},
): SolveMember {
  return { id, base, length, ...extra };
}

function diagnostics(project: ProjectDefinition): readonly string[] {
  return buildGraphIR(project).diagnostics.map(({ ruleId }) => ruleId);
}

function registry(): PluginRegistry {
  const plugins = new PluginRegistry();
  plugins.register(transformPlugin);
  plugins.register(fkPlugin);
  plugins.register(ikPlugin);
  return plugins;
}

function load(project: ProjectDefinition) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: registry(),
  }).load(project);
}
function publishedSolver(project: ProjectDefinition) {
  const runtime = load(project);
  const published: unknown[] = [];
  for (const id of [
    "rig/root",
    "rig/goal-a",
    "rig/goal-b",
    "rig/solve",
    "rig/shared",
    "rig/a",
    "rig/b",
  ])
    runtime.mount(id);
  runtime.subscribeNode("rig/solve", (patch) => published.push(patch));
  runtime.seek("rig/root", 0);
  const patch = published.at(-1);
  if (patch === undefined) throw new Error("The solver published no patch.");
  return patch as {
    readonly status: string;
    readonly values?: Readonly<Record<string, unknown>>;
  };
}

function goalProject(
  leafValues: Readonly<Record<string, unknown>> = {},
  solveValues: Readonly<Record<string, unknown>> = {},
  solveRequires: Readonly<Record<string, unknown>> = {
    root: "root",
    targets: { a: "goal-a", b: "goal-b" },
  },
  extra: readonly TrackDefinition[] = [],
  sharedBase = "root",
): ProjectDefinition {
  const values = ["a", "b"].map((id) => {
    const influence = leafValues[id];
    return [
      id,
      influence === undefined ? { length: 50 } : { length: 50, influence: property(influence) },
    ];
  });
  return {
    schemaVersion: 5,
    projectId: "goal-influence",
    motions: [
      {
        id: "rig",
        trigger: { type: "manual" },
        tracks: [
          { id: "root", keyframes: { transform: { values: { x: 0, y: 0, rotation: 0 } } } },
          { id: "goal-a", keyframes: { transform: { values: { x: 70, y: 60, rotation: 0 } } } },
          { id: "goal-b", keyframes: { transform: { values: { x: 70, y: -60, rotation: 0 } } } },
          {
            id: "solve",
            keyframes: {
              ik: {
                ...(Object.keys(solveValues).length === 0 ? {} : { values: solveValues }),
                requires: solveRequires,
              },
            },
          },
          {
            id: "shared",
            keyframes: {
              fk: {
                values: {
                  length: 50,
                  ...(leafValues.shared === undefined
                    ? {}
                    : { influence: property(leafValues.shared) }),
                },
                requires: { base: sharedBase, solver: "solve" },
              },
            },
          },
          ...values.map(([id, authored]) => ({
            id,
            keyframes: {
              fk: {
                values: authored,
                requires: { base: "shared", solver: "solve" },
              },
            },
          })),
          ...extra,
        ],
      },
    ],
  };
}

function twoBranchMembers(aInfluence?: number, bInfluence?: number): readonly SolveMember[] {
  return [
    member("shared", "root", 50),
    member("a", "shared", 50, {
      goal: { x: 70, y: 60, rotation: 0 },
      ...(aInfluence === undefined ? {} : { influence: aInfluence }),
    }),
    member("b", "shared", 50, {
      goal: { x: 70, y: -60, rotation: 0 },
      ...(bInfluence === undefined ? {} : { influence: bInfluence }),
    }),
  ];
}

describe("IK goal influence and conflict policy", () => {
  it("GI-1 compromises equal and weighted proposals, including zero and spread", () => {
    const equal = compromise([
      { point: { x: -0, y: 2 }, weight: 1 },
      { point: { x: 4, y: 6 }, weight: 1 },
    ]);
    expect(equal.point).toEqual({ x: 2, y: 4 });
    expect(Object.is(equal.point.x, -0)).toBe(false);
    expect(equal.spread).toBeCloseTo(Math.hypot(2, 2), 12);

    const weighted = compromise([
      { point: { x: 0, y: 0 }, weight: 1 },
      { point: { x: 10, y: 20 }, weight: 3 },
    ]);
    expect(weighted.point).toEqual({ x: 7.5, y: 15 });
    expect(compromise([{ point: { x: 3, y: -4 }, weight: 99 }])).toEqual({
      point: { x: 3, y: -4 },
      spread: 0,
    });
    expect(compromise([{ point: { x: 3, y: 4 }, weight: 1 }]).spread).toBe(0);
  });

  it("GI-2 gives each subtree the mean addressed-leaf pull and defaults empty ones", () => {
    const members = new Map<string, SolveMember>([
      ["root", member("root", "outside", 1)],
      ["shared", member("shared", "root", 1)],
      ["a", member("a", "shared", 1, { influence: 2 })],
      ["b", member("b", "shared", 1, { influence: 4 })],
      ["orphan", member("orphan", "root", 1)],
    ]);
    const pulls = branchPulls(members, ["a", "b"]);
    expect(pulls.get("a")).toBe(2);
    expect(pulls.get("b")).toBe(4);
    expect(pulls.get("shared")).toBe(3);
    expect(pulls.get("root")).toBe(3);
    expect(pulls.get("orphan")).toBe(1);
  });

  it("GI-3 reads only positive finite static influence and omits everything else", () => {
    const values = [undefined, 0, -1, Number.NaN, Number.POSITIVE_INFINITY, "2", 2];
    const read = values.map((value) => readInfluence({ influence: value }));
    expect(read).toEqual([undefined, undefined, undefined, undefined, undefined, undefined, 2]);
    const delivered: readonly DeliveredMember[] = values.map((value, index) => ({
      id: `m${index}`,
      base: "root",
      values: { length: 1, influence: value },
      progress: 0,
    }));
    const solved = readSolveMembers(delivered, new Map());
    expect(solved.map((item) => Object.hasOwn(item, "influence"))).toEqual([
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    ]);
  });

  it("GI-4 raises one branch's influence toward its goal and keeps equal authored weights default-identical", () => {
    const low = solveFabrik(ROOT, twoBranchMembers());
    const high = solveFabrik(ROOT, twoBranchMembers(20, 1));
    const lowA = high.residuals.a!;
    const lowB = high.residuals.b!;
    expect(lowA).toBeLessThan(low.residuals.b!);
    expect(lowA).toBeGreaterThanOrEqual(0);
    expect(lowB).toBeGreaterThanOrEqual(0);
    expect(high.residuals.a).toBeLessThan(low.residuals.a!);
    expect(high.residuals.b).toBeGreaterThan(low.residuals.b!);
    const authored = solveFabrik(ROOT, twoBranchMembers(1, 1));
    for (const id of Object.keys(low.rotations))
      expect(Object.is(authored.rotations[id], low.rotations[id])).toBe(true);
  });

  it("GI-5 unweighted FABRIK keeps the phase-4 rotations byte-identical", () => {
    const unweighted = solveFabrik(ROOT, twoBranchMembers());
    const reference = solveFabrik(
      ROOT,
      twoBranchMembers().map(({ influence: _influence, ...rest }) => rest),
    );
    expect(unweighted.rotations).toEqual(reference.rotations);
    for (const id of Object.keys(reference.rotations))
      expect(Object.is(unweighted.rotations[id], reference.rotations[id])).toBe(true);
  });

  it("GI-6 reports canonical per-leaf residuals and the worst quality residual", () => {
    const members = twoBranchMembers(20, 1);
    const solved = solveFabrik(ROOT, members);
    expect(Object.keys(solved.residuals)).toEqual(["a", "b"]);
    expect(solved.quality.residual).toBe(Math.max(...Object.values(solved.residuals)));
    const closed = solveChain(ROOT, [
      member("upper", "root", 80),
      member("fore", "upper", 60, { goal: { x: 120, y: 40, rotation: 0 } }),
    ]);
    expect(Object.keys(closed.residuals)).toEqual(["fore"]);
    expect(closed.residuals.fore).toBe(closed.quality.residual);
  });

  it("GI-7 distinguishes conflict from reachable, single-chain stall, and a limited miss", () => {
    expect(solveFabrik(ROOT, twoBranchMembers()).quality.kind).toBe("conflicted");
    const reachable = solveFabrik(ROOT, [
      member("shared", "root", 50),
      member("a", "shared", 50, { goal: { x: 70, y: 60, rotation: 0 } }),
      member("b", "shared", 50, { goal: { x: 70, y: 60, rotation: 0 } }),
    ]);
    expect(reachable.quality.kind).toBe("converged");
    const stalled = solveFabrik(ROOT, [
      member("a", "root", 50),
      member("b", "a", 50, { goal: { x: 200, y: 0, rotation: 0 } }),
    ]);
    expect(stalled.quality.kind).toBe("stalled");
    const limited = solveFabrik(ROOT, [
      member("a", "root", 50, { limit: { kind: "range", min: 0, max: 0 } }),
      member("b", "a", 50, { goal: { x: 0, y: 100, rotation: 0 } }),
    ]);
    expect(limited.quality.kind).toBe("limited");
  });

  it("GI-8 publishes conflicted inspection and leaves unopted patches unchanged", () => {
    const result = solveFabrik(ROOT, twoBranchMembers());
    const inspection = inspectSolve(result);
    expect(inspection.kind).toBe("conflicted");
    expect(inspection.residuals).toEqual(result.residuals);
    expect(Object.isFrozen(inspection.residuals)).toBe(true);

    const unopted = publishedSolver(goalProject({}, {}));
    const opted = publishedSolver(goalProject({}, { inspect: true }));
    expect(unopted.status).toBe("ready");
    expect(opted.status).toBe("ready");
    expect(unopted.values).toBeDefined();
    expect(Object.keys(unopted.values ?? {})).toEqual(["rotations"]);
    expect(opted.values?.inspection).toEqual({
      kind: "conflicted",
      residual: result.quality.residual,
      iterations: result.quality.kind === "conflicted" ? result.quality.iterations : -1,
      atBound: [],
      residuals: { "rig/a": result.residuals.a, "rig/b": result.residuals.b },
    });
    expect(opted.values?.rotations).toEqual(unopted.values?.rotations);
  });

  it("GI-9 refuses malformed influence and accepts a valid addressed leaf in the same rig", () => {
    for (const value of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "heavy"]) {
      const project = goalProject({ a: value });
      expect(diagnostics(project)).toContain("ik-influence-malformed");
    }
    const keyframed = goalProject({ a: [{ p: 0, v: 2 }] });
    expect(diagnostics(keyframed)).toContain("ik-influence-malformed");
    const accepted = goalProject({ a: 2 });
    expect(diagnostics(accepted)).toEqual([]);
    expect(() => load(accepted)).not.toThrow();
  });

  it("GI-10 scopes influence refusals to addressed leaves and the solver-binding group", () => {
    const nonLeaf = goalProject({ shared: 2 });
    expect(diagnostics(nonLeaf)).toContain("ik-influence-without-goal");
    const base = goalProject();
    const misgrouped = {
      ...base,
      motions: [
        {
          ...base.motions[0]!,
          tracks: base.motions[0]!.tracks.map((track) =>
            track.id === "a"
              ? {
                  ...track,
                  keyframes: {
                    ...track.keyframes,
                    someplugin: { values: { influence: 2 } },
                  },
                }
              : track,
          ),
        },
      ],
    };
    expect(diagnostics(misgrouped)).toContain("ik-influence-without-goal");
    expect(diagnostics(misgrouped)).not.toContain("ik-influence-malformed");
  });

  it("GI-11 leaves pre-existing goal and chain diagnostics as the only answers", () => {
    const broken = goalProject(
      { a: 2 },
      {},
      { root: "root", targets: { a: "goal-a", b: "goal-b" } },
      [{ id: "other-root" }],
      "other-root",
    );
    expect(diagnostics(broken)).toContain("ik-solver-unreachable-root");
    expect(diagnostics(broken)).not.toContain("ik-influence-without-goal");

    const missed = goalProject({ b: 2 }, {}, { root: "root", targets: { a: "goal-a" } });
    expect(diagnostics(missed)).toEqual(["ik-leaf-without-goal"]);
    const notLeaf = goalProject({ shared: 2 }, {}, { root: "root", targets: { shared: "goal-a" } });
    expect(diagnostics(notLeaf)).not.toContain("ik-influence-without-goal");
    expect(diagnostics(notLeaf)).toContain("ik-goal-not-leaf");
  });

  it("GI-12 exempts nodes without a solver and handles bare target's leaf placement", () => {
    const noSolver = goalProject({}, {}, { root: "root", targets: { a: "goal-a", b: "goal-b" } }, [
      { id: "bystander", keyframes: { influence: 2 } },
    ]);
    expect(diagnostics(noSolver)).toEqual([]);

    const bare: ProjectDefinition = {
      schemaVersion: 5,
      projectId: "bare-influence",
      motions: [
        {
          id: "rig",
          trigger: { type: "manual" },
          tracks: [
            { id: "root", keyframes: { transform: { values: { x: 0, y: 0, rotation: 0 } } } },
            { id: "goal", keyframes: { transform: { values: { x: 70, y: 0, rotation: 0 } } } },
            { id: "solve", keyframes: { ik: { requires: { root: "root", target: "goal" } } } },
            {
              id: "shared",
              keyframes: {
                fk: {
                  values: { length: 50 },
                  requires: { base: "root", solver: "solve" },
                },
              },
            },
            {
              id: "leaf",
              keyframes: {
                fk: {
                  values: { length: 50, influence: 2 },
                  requires: { base: "shared", solver: "solve" },
                },
              },
            },
          ],
        },
      ],
    };
    expect(diagnostics(bare)).toEqual([]);
    const bareNonLeaf = {
      ...bare,
      motions: [
        {
          ...bare.motions[0]!,
          tracks: bare.motions[0]!.tracks.map((track) =>
            track.id === "shared"
              ? {
                  ...track,
                  keyframes: {
                    fk: {
                      values: { length: 50, influence: 2 },
                      requires: { base: "root", solver: "solve" },
                    },
                  },
                }
              : track,
          ),
        },
      ],
    };
    expect(diagnostics(bareNonLeaf)).toContain("ik-influence-without-goal");
    expect(fkPlugin.keys).toContain("influence");
  });
});
