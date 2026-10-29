import { describe, expect, it, vi } from "vitest";
import type {
  Diagnostic,
  Patch,
  PluginDefinition,
  ProjectDefinition,
  TrackDefinition,
  ValueSpec,
} from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { Engine, type ProjectHandle } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import { buildGraphIR, deriveDependants, type GraphNode } from "../../src/graph/ir";
import { GraphRuntime } from "../../src/runtime/graph-runtime";
import { GraphPublisher } from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { ikPlugin } from "../../../plugins/src/ik";
import { fkPlugin } from "../../../plugins/src/fk";
import {
  BODY_2D_SPEC,
  GOALS_2D_SPEC,
  POSE_2D_SPEC,
  ROOT_2D_SPEC,
} from "../../../plugins/src/aggregate-topology";

const CONSUMER_SPEC: ValueSpec = {
  kind: "record",
  fields: { ok: { kind: "boolean" } },
};

const consumerPlugin: PluginDefinition = {
  id: "consumer-plugin",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: { source: { outputs: { values: POSE_2D_SPEC } } },
  },
  outputs: { values: CONSUMER_SPEC },
  transform() {
    return { values: { ok: true } };
  },
};

function createCatalog(...additional: readonly PluginDefinition[]): PluginCatalog {
  const result = new PluginCatalog();
  result.registerAll([ikPlugin, fkPlugin, consumerPlugin, ...additional]);
  return result;
}

function createEngine(catalog: PluginCatalog): Engine {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    plugins: catalog,
  });
}

function createAggregateProject(overrides?: {
  readonly motionId?: string;
  readonly includeUnrelated?: boolean;
  readonly includeConsumer?: boolean;
}): ProjectDefinition {
  const motionId = overrides?.motionId ?? "demo";
  const tracks: TrackDefinition[] = [
    {
      id: "root",
      input: {
        schema: ROOT_2D_SPEC,
        values: { x: 0, y: 0, rotation: 0 },
      },
    },
    {
      id: "body",
      input: {
        schema: BODY_2D_SPEC,
        values: [
          { id: "upper", cells: { length: 20, rotation: 0 } },
          { id: "lower", cells: { parentId: "upper", length: 15, rotation: 0 } },
        ],
      },
    },
    {
      id: "goals",
      input: {
        schema: GOALS_2D_SPEC,
        values: [{ id: "target", cells: { memberId: "lower", x: 25, y: 10 } }],
      },
    },
    {
      id: "solve",
      plugin: "ik",
      input: {
        values: { flip: false },
        requires: { chain: "body", goals: "goals", base: "root" },
      },
    },
    {
      id: "pose",
      plugin: "fk",
      input: {
        values: {},
        requires: { chain: "body", solved: "solve", base: "root" },
      },
    },
  ];

  if (overrides?.includeUnrelated) {
    tracks.push({
      id: "unrelated",
      input: { values: { counter: 42 } },
    });
  }

  if (overrides?.includeConsumer) {
    tracks.push({
      id: "consumer",
      plugin: "consumer-plugin",
      input: {
        values: {},
        requires: { source: "pose" },
      },
    });
  }

  return {
    schemaVersion: 5,
    projectId: "aggregate-publisher-demo",
    motions: [
      {
        id: motionId,
        trigger: { type: "manual" },
        tracks,
      },
    ],
  };
}

describe("Explicit Aggregate Graph and Publisher (AM-1..10)", () => {
  it("AM-1 compiles an explicit aggregate graph with pure dependency edges and no solves property", () => {
    const catalog = createCatalog();
    const project = createAggregateProject();
    const result = buildGraphIR(project, catalog);

    expect(result.diagnostics).toEqual([]);
    expect(result.graph).toBeDefined();
    const graph = result.graph!;

    for (const node of graph.nodes) {
      expect("solves" in node).toBe(false);
      expect((node as any).solves).toBeUndefined();
    }

    const solveNode = graph.nodeById["demo/solve"]!;
    expect(solveNode).toBeDefined();
    const solveSources = solveNode.edges.map((e) => e.sourceId).sort();
    expect(solveSources).toEqual(["demo/body", "demo/goals", "demo/root"]);

    const poseNode = graph.nodeById["demo/pose"]!;
    expect(poseNode).toBeDefined();
    const poseSources = poseNode.edges.map((e) => e.sourceId).sort();
    expect(poseSources).toEqual(["demo/body", "demo/root", "demo/solve"]);
  });

  it("AM-2 derives clean reverse dependants topology from explicit edges without phantom member entries", () => {
    const catalog = createCatalog();
    const project = createAggregateProject();
    const result = buildGraphIR(project, catalog);

    expect(result.graph).toBeDefined();
    const graph = result.graph!;

    expect(graph.dependants["demo/root"]).toEqual(["demo/solve", "demo/pose"]);
    expect(graph.dependants["demo/body"]).toEqual(["demo/solve", "demo/pose"]);
    expect(graph.dependants["demo/goals"]).toEqual(["demo/solve"]);
    expect(graph.dependants["demo/solve"]).toEqual(["demo/pose"]);
    expect(graph.dependants["demo/pose"]).toEqual([]);

    expect(graph.dependants["demo/upper"]).toBeUndefined();
    expect(graph.dependants["demo/lower"]).toBeUndefined();
    expect(Object.keys(graph.dependants).sort()).toEqual([
      "demo/body",
      "demo/goals",
      "demo/pose",
      "demo/root",
      "demo/solve",
    ]);

    // deriveDependants must derive reverse topology purely from node.edges, ignoring legacy solves
    const testNodes: readonly GraphNode[] = [
      { id: "demo/root", owner: "motion", authoredIndex: 0, track: { id: "root" }, edges: [] },
      {
        id: "demo/solver",
        owner: "motion",
        authoredIndex: 1,
        track: { id: "solver" },
        edges: [],
        solves: [{ id: "demo/root", base: "demo/root" }],
      } as any,
    ];
    const deps = deriveDependants(testNodes);
    expect(deps["demo/root"]).toEqual([]);
  });

  it("AM-3 orders aggregate graph nodes acyclically ensuring root, body and goals precede solve, and solve precedes pose", () => {
    const catalog = createCatalog();
    const project = createAggregateProject({ includeConsumer: true });
    const result = buildGraphIR(project, catalog);

    expect(result.diagnostics).toEqual([]);
    expect(result.graph).toBeDefined();
    const order = result.graph!.order;

    const rootIdx = order.indexOf("demo/root");
    const bodyIdx = order.indexOf("demo/body");
    const goalsIdx = order.indexOf("demo/goals");
    const solveIdx = order.indexOf("demo/solve");
    const poseIdx = order.indexOf("demo/pose");
    const consumerIdx = order.indexOf("demo/consumer");

    expect(rootIdx).toBeGreaterThanOrEqual(0);
    expect(bodyIdx).toBeGreaterThanOrEqual(0);
    expect(goalsIdx).toBeGreaterThanOrEqual(0);
    expect(solveIdx).toBeGreaterThanOrEqual(0);
    expect(poseIdx).toBeGreaterThanOrEqual(0);
    expect(consumerIdx).toBeGreaterThanOrEqual(0);

    expect(rootIdx).toBeLessThan(solveIdx);
    expect(bodyIdx).toBeLessThan(solveIdx);
    expect(goalsIdx).toBeLessThan(solveIdx);
    expect(solveIdx).toBeLessThan(poseIdx);
    expect(poseIdx).toBeLessThan(consumerIdx);
  });

  it("AM-4 composes identified aggregate nodes with resolved requires and publishes frozen table outputs", () => {
    const catalog = createCatalog();
    const project = createAggregateProject();
    const engine = createEngine(catalog);
    const handle = engine.load(project);

    try {
      const ids = ["demo/root", "demo/body", "demo/goals", "demo/solve", "demo/pose"];
      for (const id of ids) handle.mount(id);
      handle.seek("demo/pose", 0);

      const solvePatch = handle.get("demo/solve");
      expect(solvePatch).toBeDefined();
      expect(solvePatch?.status).toBe("ready");
      const solveValues = solvePatch?.status === "ready" ? solvePatch.outputs.values : undefined;
      expect(Array.isArray(solveValues)).toBe(true);
      expect(Object.isFrozen(solveValues)).toBe(true);
      const solvedRows = solveValues as readonly { id: string; cells: Record<string, unknown> }[];
      expect(solvedRows.length).toBe(2);
      expect(solvedRows.map((r) => r.id)).toEqual(["upper", "lower"]);
      expect(typeof solvedRows[0]?.cells.rotation).toBe("number");
      expect(typeof solvedRows[1]?.cells.rotation).toBe("number");

      const posePatch = handle.get("demo/pose");
      expect(posePatch).toBeDefined();
      expect(posePatch?.status).toBe("ready");
      const poseValues = posePatch?.status === "ready" ? posePatch.outputs.values : undefined;
      expect(Array.isArray(poseValues)).toBe(true);
      expect(Object.isFrozen(poseValues)).toBe(true);
      const poseRows = poseValues as readonly { id: string; cells: Record<string, unknown> }[];
      expect(poseRows.length).toBe(2);
      expect(poseRows.map((r) => r.id)).toEqual(["upper", "lower"]);
      expect(typeof poseRows[0]?.cells.x).toBe("number");
      expect(typeof poseRows[0]?.cells.y).toBe("number");
      expect(typeof poseRows[0]?.cells.rotation).toBe("number");
    } finally {
      handle.dispose();
    }
  });

  it("AM-5 triggers exactly one IK evaluation and one FK evaluation in a single engine flush upon modifying body", () => {
    const ikTransformSpy = vi.fn((input: any, context: any) => ikPlugin.transform!(input, context));
    const fkTransformSpy = vi.fn((input: any, context: any) => fkPlugin.transform!(input, context));

    const spiedIkPlugin = { ...ikPlugin, transform: ikTransformSpy };
    const spiedFkPlugin = { ...fkPlugin, transform: fkTransformSpy };

    const catalog = new PluginCatalog();
    catalog.registerAll([spiedIkPlugin, spiedFkPlugin]);
    const engine = createEngine(catalog);
    const project = createAggregateProject();
    const handle = engine.load(project);

    try {
      const ids = ["demo/root", "demo/body", "demo/goals", "demo/solve", "demo/pose"];
      for (const id of ids) handle.mount(id);
      handle.seek("demo/pose", 0);

      expect(ikTransformSpy).toHaveBeenCalledTimes(1);
      expect(fkTransformSpy).toHaveBeenCalledTimes(1);

      ikTransformSpy.mockClear();
      fkTransformSpy.mockClear();

      const bodyTrack = handle.track("demo/body");
      bodyTrack.writeValues([
        { id: "upper", cells: { length: 22, rotation: 5 } },
        { id: "lower", cells: { parentId: "upper", length: 15, rotation: 0 } },
      ]);

      expect(ikTransformSpy).toHaveBeenCalledTimes(1);
      expect(fkTransformSpy).toHaveBeenCalledTimes(1);
    } finally {
      handle.dispose();
    }
  });

  it("AM-6 advances source revision for solve and subsequently pose when goals change while leaving unrelated tracks untouched", () => {
    const catalog = createCatalog();
    const project = createAggregateProject({ includeUnrelated: true });
    const engine = createEngine(catalog);
    const handle = engine.load(project);

    try {
      const ids = [
        "demo/root",
        "demo/body",
        "demo/goals",
        "demo/solve",
        "demo/pose",
        "demo/unrelated",
      ];
      for (const id of ids) handle.mount(id);
      handle.seek("demo/pose", 0);
      handle.seek("demo/unrelated", 0);

      const rootRev0 = handle.get("demo/root")!.revision;
      const bodyRev0 = handle.get("demo/body")!.revision;
      const goalsRev0 = handle.get("demo/goals")!.revision;
      const solveRev0 = handle.get("demo/solve")!.revision;
      const poseRev0 = handle.get("demo/pose")!.revision;
      const unrelatedRev0 = handle.get("demo/unrelated")!.revision;

      const goalsTrack = handle.track("demo/goals");
      goalsTrack.writeValues([{ id: "target", cells: { memberId: "lower", x: 28, y: 12 } }]);

      expect(handle.get("demo/goals")!.revision).toBe(goalsRev0 + 1);
      expect(handle.get("demo/solve")!.revision).toBe(solveRev0 + 1);
      expect(handle.get("demo/pose")!.revision).toBe(poseRev0 + 1);

      expect(handle.get("demo/root")!.revision).toBe(rootRev0);
      expect(handle.get("demo/body")!.revision).toBe(bodyRev0);
      expect(handle.get("demo/unrelated")!.revision).toBe(unrelatedRev0);
    } finally {
      handle.dispose();
    }
  });

  it("AM-7 propagates blocked state to solve and pose when body is blocked or unmounted", () => {
    const catalog = createCatalog();
    const project = createAggregateProject();
    const engine = createEngine(catalog);
    const handle = engine.load(project);

    try {
      // Mount root, goals, solve, pose, leaving body unmounted
      handle.mount("demo/root");
      handle.mount("demo/goals");
      handle.mount("demo/solve");
      handle.mount("demo/pose");

      handle.seek("demo/pose", 0);

      expect(handle.get("demo/solve")?.status).toBe("blocked");
      expect(handle.get("demo/pose")?.status).toBe("blocked");

      // Mount body: both transition to ready
      handle.mount("demo/body");
      handle.seek("demo/body", 0);
      handle.seek("demo/pose", 0);
      expect(handle.get("demo/solve")?.status).toBe("ready");
      expect(handle.get("demo/pose")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });

  it("AM-8 blocks pose naming solve as unready source when solve fails or throws during evaluation", () => {
    const throwingIkPlugin = {
      ...ikPlugin,
      transform() {
        throw new Error("IK computation singularity");
      },
    };
    const catalog = new PluginCatalog();
    catalog.registerAll([throwingIkPlugin, fkPlugin]);
    const engine = createEngine(catalog);
    const project = createAggregateProject();
    const handle = engine.load(project);

    try {
      const ids = ["demo/root", "demo/body", "demo/goals", "demo/solve", "demo/pose"];
      for (const id of ids) handle.mount(id);
      handle.seek("demo/pose", 0);

      const solvePatch = handle.get("demo/solve");
      expect(solvePatch?.status).toBe("error");

      const posePatch = handle.get("demo/pose");
      expect(posePatch?.status).toBe("blocked");
      expect(posePatch?.diagnostics.some((d) => d.ids.includes("demo/solve"))).toBe(true);
    } finally {
      handle.dispose();
    }
  });

  it("AM-9 compiles and evaluates a multi-branch tree with four limbs attached to external base without cycle diagnostics", () => {
    const catalog = createCatalog();
    const bodyValues = [
      { id: "la-upper", cells: { length: 20, rotation: 0 } },
      { id: "la-lower", cells: { parentId: "la-upper", length: 15, rotation: 0 } },
      { id: "ra-upper", cells: { length: 20, rotation: 0 } },
      { id: "ra-lower", cells: { parentId: "ra-upper", length: 15, rotation: 0 } },
      { id: "ll-upper", cells: { length: 25, rotation: 0 } },
      { id: "ll-lower", cells: { parentId: "ll-upper", length: 20, rotation: 0 } },
      { id: "rl-upper", cells: { length: 25, rotation: 0 } },
      { id: "rl-lower", cells: { parentId: "rl-upper", length: 20, rotation: 0 } },
    ];
    const goalValues = [
      { id: "g-la", cells: { memberId: "la-lower", x: 25, y: 10 } },
      { id: "g-ra", cells: { memberId: "ra-lower", x: -25, y: 10 } },
      { id: "g-ll", cells: { memberId: "ll-lower", x: 15, y: -40 } },
      { id: "g-rl", cells: { memberId: "rl-lower", x: -15, y: -40 } },
    ];

    const project: ProjectDefinition = {
      schemaVersion: 5,
      projectId: "multi-branch-aggregate-demo",
      motions: [
        {
          id: "quad",
          trigger: { type: "manual" },
          tracks: [
            {
              id: "root",
              input: { schema: ROOT_2D_SPEC, values: { x: 0, y: 0, rotation: 0 } },
            },
            {
              id: "body",
              input: { schema: BODY_2D_SPEC, values: bodyValues },
            },
            {
              id: "goals",
              input: { schema: GOALS_2D_SPEC, values: goalValues },
            },
            {
              id: "solve",
              plugin: "ik",
              input: {
                values: { flip: false },
                requires: { chain: "body", goals: "goals", base: "root" },
              },
            },
            {
              id: "pose",
              plugin: "fk",
              input: {
                values: {},
                requires: { chain: "body", solved: "solve", base: "root" },
              },
            },
          ],
        },
      ],
    };

    const result = buildGraphIR(project, catalog);
    expect(result.diagnostics).toEqual([]);
    expect(result.graph).toBeDefined();

    const engine = createEngine(catalog);
    const handle = engine.load(project);
    try {
      const ids = ["quad/root", "quad/body", "quad/goals", "quad/solve", "quad/pose"];
      for (const id of ids) handle.mount(id);
      handle.seek("quad/pose", 0);

      const posePatch = handle.get("quad/pose");
      expect(posePatch?.status).toBe("ready");
      const poseRows = (
        posePatch?.status === "ready" ? posePatch.outputs.values : undefined
      ) as readonly {
        id: string;
        cells: Record<string, unknown>;
      }[];
      expect(poseRows.length).toBe(8);
      for (const row of poseRows) {
        expect(typeof row.cells.x).toBe("number");
        expect(typeof row.cells.y).toBe("number");
        expect(typeof row.cells.rotation).toBe("number");
      }
    } finally {
      handle.dispose();
    }
  });

  it("AM-10 confirms no member interpolated() call is made during graph publication of aggregate nodes", () => {
    const catalog = createCatalog();
    const project = createAggregateProject();
    const engine = createEngine(catalog);
    const handle = engine.load(project);

    try {
      const ids = ["demo/root", "demo/body", "demo/goals", "demo/solve", "demo/pose"];
      for (const id of ids) handle.mount(id);
      handle.seek("demo/pose", 0);

      const registry = new PatchRegistry();
      const publisher = new GraphPublisher(registry);
      const graph = (handle as any)._runtime.graph.graph;
      const nodes = graph.nodes.map((n: GraphNode) => ({
        ...n,
        compose: () => ({ outputs: { values: {} }, sourceProgress: 0, sourceRevisions: {} }),
      }));

      // In current code, if a legacy node carries solves, GraphPublisher attempts solver fan-in
      // and throws failPublication({ kind: "member-interpolation" })!
      const nodeWithSolves = {
        ...nodes[0],
        id: "demo/legacy-solver",
        track: { id: "legacy-solver", keyframes: { ik: {} } },
        composeIdentified: undefined,
        solves: [{ id: "demo/root", base: "demo/root" }],
      };
      // In current code, lines 407-446 execute and fail with status "error" (kind "member-interpolation")!
      // After cleanup, lines 407-446 are deleted and solves is ignored completely, publishing status "ready".
      publisher.flush(
        {
          nodes: [nodes[0], nodeWithSolves],
          nodeById: { [nodes[0].id]: nodes[0], [nodeWithSolves.id]: nodeWithSolves },
          dependants: { [nodes[0].id]: [], [nodeWithSolves.id]: [] },
          order: [nodes[0].id, nodeWithSolves.id],
          diagnostics: [],
        },
        [nodeWithSolves.id],
        1,
      );
      expect(registry.get("demo/legacy-solver")?.status).toBe("ready");
    } finally {
      handle.dispose();
    }
  });
});
