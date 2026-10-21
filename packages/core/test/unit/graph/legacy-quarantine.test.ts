import { describe, expect, it } from "vitest";
import { builtinRegistry } from "../../support/builtin-registry";
import {
  PluginRegistry,
  type PluginDefinition,
  type RequirementInputs,
} from "../../../src/domain/plugins";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import {
  buildGraphIR,
  deriveDependants,
  type GraphBuildResult,
  type GraphEdge,
  type SolveMember,
} from "../../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import type { ImmutableRecord } from "../../../src/domain/values";
import { ikPlugin } from "../../../../plugins/src/ik";
import { ik3dPlugin } from "../../../../plugins/src/ik3d";

// Slice C6: every kinematic reader sits behind one legacy predicate, and a plugin without `compose`
// is governed only by its declarations however its slots are spelled.

function project(tracks: readonly TrackDefinition[]): ProjectDefinition {
  return {
    schemaVersion: 5,
    projectId: "c6",
    motions: [{ id: "walker", trigger: { type: "manual" }, tracks }],
  };
}

function solvesOf(result: GraphBuildResult, id: string): readonly SolveMember[] | undefined {
  return result.graph?.nodeById[id]?.solves;
}

const toy: PluginDefinition = {
  name: "toy",
  keys: ["length"],
  requirements: { root: {}, base: {}, solver: {}, targets: { dict: true } },
  collect: () => ({}),
};

// Every slot spelling an IK rig uses, on a plugin that never composes. If any of them classified,
// the broken base below would report `ik-solver-unreachable-root` and the unknown goal key would
// report `ik-goal-unknown-member`.
const TOY_RIG: readonly TrackDefinition[] = [
  { id: "anchor" },
  { id: "goal" },
  {
    id: "rig-solve",
    keyframes: [
      {
        "rig-solve": {
          plugin: "toy",
          requires: { root: "anchor", targets: { hand: "goal" } },
        },
      },
    ],
  },
  {
    id: "upper",
    keyframes: [
      {
        upper: {
          plugin: "toy",
          values: { length: 80 },
          requires: { base: "goal", solver: "rig-solve" },
        },
      },
    ],
  },
];

const PLANAR_RIG: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: { ik: { requires: { root: "shoulder", target: "hand-target" } } },
  },
  {
    id: "upper-arm",
    keyframes: {
      fk: { values: { length: 80 }, requires: { base: "shoulder", solver: "arm-solve" } },
    },
  },
  {
    id: "forearm",
    keyframes: {
      fk: { values: { length: 60 }, requires: { base: "upper-arm", solver: "arm-solve" } },
    },
  },
];

const PLANAR_ENTRY_RIG: readonly TrackDefinition[] = [
  { id: "shoulder" },
  { id: "hand-target" },
  {
    id: "arm-solve",
    keyframes: [
      {
        "arm-solve": {
          plugin: "ik",
          requires: { root: "shoulder", target: "hand-target" },
        },
      },
    ],
  },
  {
    id: "upper-arm",
    keyframes: [
      {
        "upper-arm": {
          plugin: "fk",
          values: { length: 80 },
          requires: { base: "shoulder", solver: "arm-solve" },
        },
      },
    ],
  },
  {
    id: "forearm",
    keyframes: [
      {
        forearm: {
          plugin: "fk",
          values: { length: 60 },
          requires: { base: "upper-arm", solver: "arm-solve" },
        },
      },
    ],
  },
];

const SPATIAL_RIG: readonly TrackDefinition[] = [
  { id: "root", keyframes: { transform3d: { values: { x: 0, y: 0, z: 0 } } } },
  { id: "goal", keyframes: { transform3d: { values: { x: 10, y: 20, z: 30 } } } },
  {
    id: "solve",
    keyframes: { ik3d: { requires: { root: "root", targets: { b: "goal" } } } },
  },
  {
    id: "a",
    keyframes: { fk3d: { values: { length: 30 }, requires: { base: "root", solver: "solve" } } },
  },
  {
    id: "b",
    keyframes: { fk3d: { values: { length: 30 }, requires: { base: "a", solver: "solve" } } },
  },
];

const PLANAR_SOLVES: readonly SolveMember[] = [
  { id: "walker/upper-arm", base: "walker/shoulder" },
  { id: "walker/forearm", base: "walker/upper-arm" },
];

function toyRegistry(): PluginRegistry {
  const registry = new PluginRegistry();
  registry.register(toy);
  return registry;
}

function publisherNode(
  id: string,
  edges: readonly GraphEdge[],
  values: Readonly<Record<string, unknown>>,
  capture?: (inputs: RequirementInputs) => void,
): PublisherNode {
  return {
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    interpolated: () => ({ id, values, progress: 0 }),
    compose: (inputs) => {
      capture?.(inputs);
      return { values, sourceProgress: 0, sourceRevisions: {} };
    },
  } as PublisherNode;
}

function inputEdge(id: string, sourceId: string, slot: string, memberKey?: string): GraphEdge {
  return {
    observerId: id,
    sourceId,
    role: "input",
    requirement: {
      plugin: "toy",
      slot,
      ...(memberKey === undefined ? {} : { memberKey }),
    },
  } as GraphEdge;
}

function snapshot(nodes: readonly PublisherNode[]): PublisherSnapshot {
  const nodeById: Record<string, PublisherNode> = {};
  for (const node of nodes) nodeById[node.id] = node;
  return {
    nodes,
    nodeById,
    dependants: deriveDependants(nodes),
    order: nodes.map((node) => node.id),
    diagnostics: [],
  };
}

function flushDerived(
  result: GraphBuildResult,
  valuesOf: (id: string) => ImmutableRecord,
  composeOf: (id: string, values: ImmutableRecord, inputs: RequirementInputs) => ImmutableRecord,
): PatchRegistry {
  const graph = result.graph;
  if (graph === undefined) throw new Error("The rig must build.");
  const registry = new PatchRegistry();
  const nodes: PublisherNode[] = graph.nodes.map((node) => {
    const values = valuesOf(node.id);
    return {
      ...node,
      interpolated: () => ({ id: node.id, values, progress: 0 }),
      compose: (inputs) => ({
        values: composeOf(node.id, values, inputs),
        sourceProgress: 0,
        sourceRevisions: {},
      }),
    };
  });
  const nodeById: Record<string, PublisherNode> = {};
  for (const node of nodes) nodeById[node.id] = node;
  new GraphPublisher(registry).flush(
    { nodes, nodeById, dependants: graph.dependants, order: graph.order, diagnostics: [] },
    graph.order,
    1,
  );
  return registry;
}

describe("C6 legacy quarantine", () => {
  it("C6-1 a plugin without compose is never classified by its slot names", () => {
    const result = buildGraphIR(project(TOY_RIG), toyRegistry());
    expect(result.diagnostics).toEqual([]);
    const graph = result.graph;
    if (graph === undefined) throw new Error("The toy rig must build.");
    expect(graph.nodes.filter((node) => node.solves !== undefined)).toEqual([]);
    const solver = graph.nodeById["walker/rig-solve"];
    expect(solver?.solves).toBeUndefined();
    expect(
      solver?.edges.map((edge) => [
        edge.sourceId,
        edge.role === "input" ? edge.requirement.slot : undefined,
      ]),
    ).toEqual(
      expect.arrayContaining([
        ["walker/anchor", "root"],
        ["walker/goal", "targets"],
      ]),
    );
    expect(graph.nodeById["walker/upper"]?.edges.map((edge) => edge.sourceId)).toEqual(
      expect.arrayContaining(["walker/goal", "walker/rig-solve"]),
    );
  });

  it("C6-2 legacy ik and ik3d still derive solves through the quarantined channel", () => {
    const planar = buildGraphIR(project(PLANAR_RIG), builtinRegistry());
    expect(planar.diagnostics).toEqual([]);
    expect(solvesOf(planar, "walker/arm-solve")).toEqual(PLANAR_SOLVES);
    expect(planar.graph?.nodeById["walker/arm-solve"]?.solveScope).toBe("ik");

    // The predicate reads both authored forms, so entry records keep their legacy classification.
    const planarEntry = buildGraphIR(project(PLANAR_ENTRY_RIG), builtinRegistry());
    expect(planarEntry.diagnostics).toEqual([]);
    expect(solvesOf(planarEntry, "walker/arm-solve")).toEqual(PLANAR_SOLVES);

    const spatial = buildGraphIR(project(SPATIAL_RIG), builtinRegistry());
    expect(spatial.diagnostics).toEqual([]);
    expect(solvesOf(spatial, "walker/solve")).toEqual([
      { id: "walker/a", base: "walker/root" },
      { id: "walker/b", base: "walker/a", goal: "walker/goal" },
    ]);
    expect(spatial.graph?.nodeById["walker/solve"]?.solveScope).toBe("ik3d");
  });

  it("C6-3 the publisher injects members only into a node that derived solves", () => {
    const registry = new PatchRegistry();
    let captured: RequirementInputs | undefined;
    const anchor = publisherNode("walker/anchor", [], { x: 1 });
    const goal = publisherNode("walker/goal", [], { x: 2 });
    const solve = publisherNode(
      "walker/rig-solve",
      [
        inputEdge("walker/rig-solve", "walker/anchor", "root"),
        inputEdge("walker/rig-solve", "walker/goal", "targets", "hand"),
      ],
      {},
      (inputs) => {
        captured = inputs;
      },
    );
    const upper = publisherNode(
      "walker/upper",
      [inputEdge("walker/upper", "walker/rig-solve", "solver")],
      { length: 80 },
    );

    const nodes = [anchor, goal, solve, upper];
    new GraphPublisher(registry).flush(
      snapshot(nodes),
      nodes.map((node) => node.id),
      1,
    );

    expect(captured?.toy).toEqual({
      root: { x: 1 },
      targets: { hand: { x: 2 } },
    });
    expect(captured?.toy).not.toHaveProperty("members");
    expect(captured?.ik).toBeUndefined();
  });

  it("C6-4 refuses solverChain on a definition that does not compose", () => {
    expect(() =>
      new PluginRegistry().register({
        name: "half-legacy",
        solverChain: { kind: "any" },
        collect: () => ({}),
      }),
    ).toThrow(
      new TypeError(
        'Plugin "half-legacy" declares solverChain without compose; it belongs to the legacy compose channel.',
      ),
    );
  });

  it("C6-5 generic dependency cycles are still refused", () => {
    const cyclic: readonly TrackDefinition[] = [
      { id: "a", keyframes: [{ a: { plugin: "toy", requires: { base: "b" } } }] },
      { id: "b", keyframes: [{ b: { plugin: "toy", requires: { base: "a" } } }] },
    ];
    const result = buildGraphIR(project(cyclic), toyRegistry());
    expect(result.diagnostics.map(({ ruleId }) => ruleId)).toContain("graph-cycle");
  });

  it("C6-6 a legacy root scopes members even when a non-legacy root edge comes first", () => {
    const mixed: readonly TrackDefinition[] = [
      { id: "toy-root" },
      { id: "ik-root" },
      { id: "goal" },
      {
        id: "solver",
        keyframes: [
          { toyEntry: { plugin: "toy", requires: { root: "toy-root" } } },
          { ikEntry: { plugin: "ik", requires: { root: "ik-root", target: "goal" } } },
        ],
      },
      {
        id: "upper",
        keyframes: [
          {
            upper: {
              plugin: "fk",
              values: { length: 80 },
              requires: { base: "ik-root", solver: "solver" },
            },
          },
        ],
      },
    ];
    const result = buildGraphIR(project(mixed), builtinRegistry(toy));
    expect(result.diagnostics).toEqual([]);
    const solver = result.graph?.nodeById["walker/solver"];
    expect(solver?.solves).toEqual([{ id: "walker/upper", base: "walker/ik-root" }]);
    // The first `root` edge belongs to `toy`, so a publisher that re-read the slot name would
    // deliver the members under `toy`; the derived scope is the only one that can answer this.
    expect(solver?.solveScope).toBe("ik");
    expect(solver?.solveRootEntry).toBe("ikEntry");

    // The entry-id alias is legacy delivery too. An entry id naming a registered non-compose
    // plugin is withheld, so `toy` can never receive `members` through the alias.
    const shadowed = mixed.map((track) =>
      track.id === "solver"
        ? {
            ...track,
            keyframes: [
              { toyEntry: { plugin: "toy", requires: { root: "toy-root" } } },
              { toy: { plugin: "ik", requires: { root: "ik-root", target: "goal" } } },
            ],
          }
        : track,
    );
    const shadowedResult = buildGraphIR(project(shadowed), builtinRegistry(toy));
    expect(shadowedResult.diagnostics).toEqual([]);
    expect(shadowedResult.graph?.nodeById["walker/solver"]?.solveScope).toBe("ik");
    expect(shadowedResult.graph?.nodeById["walker/solver"]?.solveRootEntry).toBeUndefined();
  });

  it("C6-7 keeps an unregistered solver binder on the legacy fallback without judging it", () => {
    const deadRotation: readonly TrackDefinition[] = [
      { id: "root" },
      { id: "goal" },
      {
        id: "solver",
        keyframes: { ik: { requires: { root: "root", target: "goal" } } },
      },
      {
        id: "member",
        keyframes: {
          fk: { values: { rotation: 20 }, requires: { base: "root", solver: "solver" } },
        },
      },
    ];
    const unjudged = buildGraphIR(project(deadRotation), toyRegistry());
    // The fallback itself: an unregistered `ik` still classifies as legacy and derives solves.
    expect(unjudged.graph?.nodeById["walker/solver"]?.solves).toEqual([
      { id: "walker/member", base: "walker/root" },
    ]);
    // The binder is the solver's plugin, and only a registered declaration is judged (ADR-136).
    expect(unjudged.diagnostics.map((entry) => entry.ruleId)).not.toContain(
      "ik-solved-rotation-dead",
    );

    const judged = buildGraphIR(project(deadRotation), builtinRegistry());
    expect(judged.diagnostics.map((entry) => entry.ruleId)).toContain("ik-solved-rotation-dead");
  });

  it("C6-8 joins derived solves to the publisher and the real ik/ik3d composes", () => {
    const planar = flushDerived(
      buildGraphIR(project(PLANAR_RIG), builtinRegistry()),
      (id) => {
        if (id === "walker/shoulder") return { x: 200, y: 300, rotation: 0 };
        if (id === "walker/hand-target") return { x: 320, y: 340, rotation: 0 };
        if (id === "walker/upper-arm") return { length: 80 };
        if (id === "walker/forearm") return { length: 60 };
        return {};
      },
      (id, values, inputs) =>
        id === "walker/arm-solve" ? ikPlugin.compose!(values, 0, inputs.ik ?? {}, id) : values,
    );
    const planarPatch = planar.get("walker/arm-solve");
    if (planarPatch?.status !== "ready") throw new Error("The planar solver did not publish.");
    const rotations = planarPatch.values.rotations as Readonly<Record<string, number>>;
    expect(Object.keys(rotations).sort()).toEqual(["walker/forearm", "walker/upper-arm"]);
    expect(rotations["walker/upper-arm"]).toBeCloseTo(40.168, 3);

    const spatial = flushDerived(
      buildGraphIR(project(SPATIAL_RIG), builtinRegistry()),
      (id) => {
        if (id === "walker/goal") return { x: 10, y: 20, z: 30 };
        if (id === "walker/a" || id === "walker/b") return { length: 30 };
        if (id === "walker/solve") return {};
        return { x: 0, y: 0, z: 0 };
      },
      (id, values, inputs) =>
        id === "walker/solve" ? ik3dPlugin.compose!(values, 0, inputs.ik3d ?? {}, id) : values,
    );
    const spatialPatch = spatial.get("walker/solve");
    if (spatialPatch?.status !== "ready") throw new Error("The spatial solver did not publish.");
    const rotations3d = spatialPatch.values.rotations3d as Readonly<
      Record<string, Readonly<Record<string, number>>>
    >;
    expect(Object.keys(rotations3d).sort()).toEqual(["walker/a", "walker/b"]);
    expect(typeof rotations3d["walker/a"]?.rotation).toBe("number");
  });
});
