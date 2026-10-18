import { describe, expect, it } from "vitest";
import { PluginRegistry, type PluginDefinition } from "../../src/domain/plugins";
import {
  compileTrackExecutionPlan,
  type CompiledEntryPlan,
  type NormalizedDictBinding,
  type NormalizedSingleBinding,
} from "../../src/domain/execution-plan";
import {
  collectTrack,
  deriveDependants,
  describeEdge,
  edgeKey,
  edgeRequirement,
  finalizeGraph,
  type GraphEdge,
} from "../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { hasSafeProperty } from "../../src/contract/address";
import { UNJUDGED_CAPABILITIES } from "../../src/ports/plugin-capabilities";

function readyCompose(values: Readonly<Record<string, unknown>>): PublisherNode["compose"] {
  return () => ({ values, sourceProgress: 0, sourceRevisions: {} });
}

function makeNode(
  id: string,
  edges: readonly GraphEdge[],
  compose: PublisherNode["compose"],
  extras: Partial<PublisherNode> = {},
): PublisherNode {
  return Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose,
    ...extras,
  }) as PublisherNode;
}

function makeSnapshot(nodes: readonly PublisherNode[]): PublisherSnapshot {
  const nodeById: Record<string, PublisherNode> = {};
  for (const n of nodes) nodeById[n.id] = n;
  return {
    nodes,
    nodeById,
    dependants: deriveDependants(nodes),
    order: nodes.map((n) => n.id),
    diagnostics: [],
  };
}

describe("Slice B5: Scope requirements and graph destinations by entry", () => {
  const joinPlugin: PluginDefinition = {
    name: "join",
    keys: ["length", "angle"],
    requirements: {
      base: {},
      targets: { dict: true },
    },
    collect: (entry) => ({ ...(entry as Record<string, unknown>) }),
  };

  const customDictPlugin: PluginDefinition = {
    name: "custom_solver",
    keys: ["weight"],
    requirements: {
      custom_controllers: { dict: true },
      single_root: {},
    },
    collect: (e) => ({ ...(e as Record<string, unknown>) }),
  };

  function createTestRegistry(): PluginRegistry {
    const registry = new PluginRegistry();
    registry.register(joinPlugin);
    registry.register(customDictPlugin);
    return registry;
  }

  it("B5-1: repeated joins bind distinct chain/parent sources and both arrive", () => {
    const registry = createTestRegistry();
    const keyframes = [
      { upper_join: { plugin: "join", requires: { base: "spine/shoulder" } } },
      { fore_join: { plugin: "join", requires: { base: "arm/upper" } } },
    ];

    const plan = compileTrackExecutionPlan({
      trackId: "arm",
      keyframes,
      registry,
    });

    expect(plan.entries).toHaveLength(2);
    const [upperPlan, forePlan] = plan.entries as [CompiledEntryPlan, CompiledEntryPlan];

    expect(upperPlan.bindings).toHaveLength(1);
    expect(forePlan.bindings).toHaveLength(1);

    const upperBinding = upperPlan.bindings[0] as NormalizedSingleBinding;
    const foreBinding = forePlan.bindings[0] as NormalizedSingleBinding;

    expect(upperBinding.entryId).toBe("upper_join");
    expect(upperBinding.slot).toBe("base");
    expect(upperBinding.qualifiedSource).toBe("spine/shoulder");

    expect(foreBinding.entryId).toBe("fore_join");
    expect(foreBinding.slot).toBe("base");
    expect(foreBinding.qualifiedSource).toBe("arm/upper");

    expect(upperBinding.tupleKey).not.toBe(foreBinding.tupleKey);

    // Build GraphNode and ensure distinct edges
    const diagnostics: any[] = [];
    const graphNode = collectTrack({ id: "arm", keyframes }, "motion", "hero", 0, diagnostics);
    expect(graphNode).toBeDefined();
    expect(diagnostics).toHaveLength(0);
    expect(graphNode!.edges).toHaveLength(2);

    const [edge1, edge2] = graphNode!.edges as [GraphEdge, GraphEdge];
    expect(edgeKey(edge1)).not.toBe(edgeKey(edge2));

    // GraphPublisher deliveries
    const patchRegistry = new PatchRegistry();
    const publisher = new GraphPublisher(patchRegistry);
    let capturedInputs: any;

    const shoulderNode = makeNode("spine/shoulder", [], readyCompose({ x: 10, y: 20 }));
    const upperNode = makeNode("arm/upper", [], readyCompose({ x: 30, y: 40 }));
    const armNode = makeNode("hero/arm", graphNode!.edges, (inputs) => {
      capturedInputs = inputs;
      return { values: {}, sourceProgress: 0, sourceRevisions: {} };
    });

    const snap = makeSnapshot([shoulderNode, upperNode, armNode]);
    publisher.flush(snap, snap.order, 1);

    expect(capturedInputs).toBeDefined();
    expect(capturedInputs.upper_join.base).toEqual({ x: 10, y: 20 });
    expect(capturedInputs.fore_join.base).toEqual({ x: 30, y: 40 });
  });

  it("B5-2: the same source feeds two entries on one track and both arrive", () => {
    const registry = createTestRegistry();
    const keyframes = [
      { leg_l: { plugin: "join", requires: { base: "pelvis" } } },
      { leg_r: { plugin: "join", requires: { base: "pelvis" } } },
    ];

    const plan = compileTrackExecutionPlan({
      trackId: "legs",
      keyframes,
      registry,
    });

    expect(plan.bindings).toHaveLength(2);
    const [bL, bR] = plan.bindings as [NormalizedSingleBinding, NormalizedSingleBinding];
    expect(bL.qualifiedSource).toBe("pelvis");
    expect(bR.qualifiedSource).toBe("pelvis");
    expect(bL.tupleKey).not.toBe(bR.tupleKey);

    const diagnostics: any[] = [];
    const graphNode = collectTrack({ id: "legs", keyframes }, "motion", "runner", 0, diagnostics);
    expect(graphNode).toBeDefined();
    expect(diagnostics).toHaveLength(0);
    expect(graphNode!.edges).toHaveLength(2);

    const pelvisNode = makeNode("runner/pelvis", [], readyCompose({ height: 100 }));
    const finalization = finalizeGraph([pelvisNode, graphNode!], [], UNJUDGED_CAPABILITIES);
    expect(finalization.diagnostics).toHaveLength(0);

    let deliveredInputs: any;
    const legsPublisherNode = makeNode("runner/legs", graphNode!.edges, (inputs) => {
      deliveredInputs = inputs;
      return { values: {}, sourceProgress: 0, sourceRevisions: {} };
    });

    const patchRegistry = new PatchRegistry();
    const publisher = new GraphPublisher(patchRegistry);
    const snap = makeSnapshot([pelvisNode, legsPublisherNode]);
    publisher.flush(snap, snap.order, 1);

    expect(deliveredInputs.leg_l.base).toEqual({ height: 100 });
    expect(deliveredInputs.leg_r.base).toEqual({ height: 100 });
  });

  it("B5-3: two dict keys to one source survive without last-write-wins collapse", () => {
    const registry = createTestRegistry();
    const keyframes = [
      {
        ik_joint: {
          plugin: "join",
          requires: {
            targets: {
              goal_a: "marker",
              goal_b: "marker",
            },
          },
        },
      },
    ];

    const plan = compileTrackExecutionPlan({
      trackId: "solver_track",
      keyframes,
      registry,
    });

    expect(plan.bindings).toHaveLength(2);
    const [goalA, goalB] = plan.bindings as [NormalizedDictBinding, NormalizedDictBinding];
    expect(goalA.kind).toBe("dict");
    expect(goalB.kind).toBe("dict");
    expect(goalA.memberKey).toBe("goal_a");
    expect(goalB.memberKey).toBe("goal_b");
    expect(goalA.tupleKey).not.toBe(goalB.tupleKey);

    const diagnostics: any[] = [];
    const graphNode = collectTrack(
      { id: "solver_track", keyframes },
      "motion",
      "rig",
      0,
      diagnostics,
    );
    expect(graphNode!.edges).toHaveLength(2);
    const [eA, eB] = graphNode!.edges as [GraphEdge, GraphEdge];
    expect(edgeKey(eA)).not.toBe(edgeKey(eB));

    const markerNode = makeNode("rig/marker", [], readyCompose({ tx: 5, ty: 15 }));
    let receivedInputs: any;
    const solverNode = makeNode("rig/solver_track", graphNode!.edges, (inputs) => {
      receivedInputs = inputs;
      return { values: {}, sourceProgress: 0, sourceRevisions: {} };
    });

    const patchRegistry = new PatchRegistry();
    const publisher = new GraphPublisher(patchRegistry);
    const snap = makeSnapshot([markerNode, solverNode]);
    publisher.flush(snap, snap.order, 1);

    expect(receivedInputs.ik_joint.targets.goal_a).toEqual({ tx: 5, ty: 15 });
    expect(receivedInputs.ik_joint.targets.goal_b).toEqual({ tx: 5, ty: 15 });
  });

  it("B5-4: prototype-looking dictionary keys remain own properties and do not pollute prototype", () => {
    const registry = createTestRegistry();
    const keyframes = [
      {
        safe_entry: {
          plugin: "join",
          requires: {
            targets: {
              ["__proto__"]: "source_a",
              toString: "source_b",
              valueOf: "source_c",
            },
          },
        },
      },
    ];

    const plan = compileTrackExecutionPlan({
      trackId: "safe_track",
      keyframes,
      registry,
    });
    expect(plan.diagnostics).toHaveLength(0);
    expect(plan.bindings).toHaveLength(3);

    const graphNode = collectTrack({ id: "safe_track", keyframes }, "motion", "rig", 0, []);
    expect(graphNode!.edges).toHaveLength(3);

    const nodeA = makeNode("rig/source_a", [], readyCompose({ payload: "A" }));
    const nodeB = makeNode("rig/source_b", [], readyCompose({ payload: "B" }));
    const nodeC = makeNode("rig/source_c", [], readyCompose({ payload: "C" }));

    let delivered: any;
    const consumer = makeNode("rig/safe_track", graphNode!.edges, (inputs) => {
      delivered = inputs;
      return { values: {}, sourceProgress: 0, sourceRevisions: {} };
    });

    const patchRegistry = new PatchRegistry();
    const publisher = new GraphPublisher(patchRegistry);
    const snap = makeSnapshot([nodeA, nodeB, nodeC, consumer]);
    publisher.flush(snap, snap.order, 1);

    const targets = delivered.safe_entry.targets;
    expect(hasSafeProperty(targets, "__proto__")).toBe(true);
    expect(hasSafeProperty(targets, "toString")).toBe(true);
    expect(hasSafeProperty(targets, "valueOf")).toBe(true);

    expect(targets.__proto__).toEqual({ payload: "A" });
    expect(targets.toString).toEqual({ payload: "B" });
    expect(targets.valueOf).toEqual({ payload: "C" });

    // Object prototype remains unpolluted
    const emptyObject: any = {};
    expect(emptyObject.payload).toBeUndefined();
    expect(Object.getPrototypeOf(targets)).toBe(Object.prototype);
  });

  it("B5-5: required generic dict validation works under arbitrary slot names", () => {
    const registry = createTestRegistry();

    // 1. Authoring scalar at custom_controllers (declared as dict)
    const scalarAtDictPlan = compileTrackExecutionPlan({
      trackId: "t1",
      keyframes: [
        {
          entry1: {
            plugin: "custom_solver",
            requires: {
              custom_controllers: "single_source",
            },
          },
        },
      ],
      registry,
    });
    expect(
      scalarAtDictPlan.diagnostics.some((d) => d.ruleId === "plugin-requirement-dict-required"),
    ).toBe(true);

    // 2. Authoring dict at single_root (declared as scalar)
    const dictAtScalarPlan = compileTrackExecutionPlan({
      trackId: "t2",
      keyframes: [
        {
          entry2: {
            plugin: "custom_solver",
            requires: {
              single_root: { key1: "source1" },
            },
          },
        },
      ],
      registry,
    });
    expect(
      dictAtScalarPlan.diagnostics.some((d) => d.ruleId === "plugin-requirement-dict-unsupported"),
    ).toBe(true);
  });

  it("B5-6: valid qualification persists across free-track, motion-local, and cross-motion sources", () => {
    const registry = createTestRegistry();
    const keyframes = [
      {
        e1: {
          plugin: "join",
          requires: {
            base: "~/global_tracker",
            targets: {
              local: "local_node",
              cross: "dance/foot",
            },
          },
        },
      },
    ];

    const graphNode = collectTrack({ id: "my_track", keyframes }, "motion", "dance", 0, []);

    const edges = graphNode!.edges;
    expect(edges).toHaveLength(3);

    const baseEdge = edges.find((e) => edgeRequirement(e)?.slot === "base");
    expect(baseEdge?.sourceId).toBe("~/global_tracker");

    const localEdge = edges.find((e) => edgeRequirement(e)?.memberKey === "local");
    expect(localEdge?.sourceId).toBe("dance/local_node");

    const crossEdge = edges.find((e) => edgeRequirement(e)?.memberKey === "cross");
    expect(crossEdge?.sourceId).toBe("dance/foot");
  });

  it("B5-7: real, self, and pose-driven cycles refuse", () => {
    // 1. Self reference
    const selfKeyframes = [{ e1: { plugin: "join", requires: { base: "loop_node" } } }];
    const selfNode = collectTrack(
      { id: "loop_node", keyframes: selfKeyframes },
      "motion",
      "hero",
      0,
      [],
    );
    const selfFinal = finalizeGraph([selfNode!], [], UNJUDGED_CAPABILITIES);
    expect(selfFinal.diagnostics.some((d) => d.ruleId === "observation-self-reference")).toBe(true);

    // 2. Mutual cycle: A -> B -> A
    const aNode = collectTrack(
      { id: "node_a", keyframes: [{ e: { plugin: "join", requires: { base: "node_b" } } }] },
      "motion",
      "hero",
      0,
      [],
    );
    const bNode = collectTrack(
      { id: "node_b", keyframes: [{ e: { plugin: "join", requires: { base: "node_a" } } }] },
      "motion",
      "hero",
      1,
      [],
    );
    const cycleFinal = finalizeGraph([aNode!, bNode!], [], UNJUDGED_CAPABILITIES);
    expect(cycleFinal.diagnostics.some((d) => d.ruleId === "graph-cycle")).toBe(true);

    // 3. Unknown source
    const missingNode = collectTrack(
      { id: "node_c", keyframes: [{ e: { plugin: "join", requires: { base: "ghost" } } }] },
      "motion",
      "hero",
      0,
      [],
    );
    const missingFinal = finalizeGraph([missingNode!], [], UNJUDGED_CAPABILITIES);
    expect(missingFinal.diagnostics.some((d) => d.ruleId === "observation-unknown-source")).toBe(
      true,
    );
  });

  it("B5-8: single/dict union ensures optional absence remains absent", () => {
    const registry = createTestRegistry();
    const keyframes = [
      {
        entry_single: {
          plugin: "join",
          requires: { base: "anchor" },
        },
      },
      {
        entry_dict: {
          plugin: "join",
          requires: { targets: { sub_key: "anchor" } },
        },
      },
    ];

    const plan = compileTrackExecutionPlan({
      trackId: "test_track",
      keyframes,
      registry,
    });

    const singleBinding = plan.bindings.find((b) => b.kind === "single")!;
    const dictBinding = plan.bindings.find((b) => b.kind === "dict")!;

    expect(singleBinding.kind).toBe("single");
    expect("memberKey" in singleBinding).toBe(false);

    expect(dictBinding.kind).toBe("dict");
    expect("memberKey" in dictBinding).toBe(true);
    expect(dictBinding.memberKey).toBe("sub_key");

    // When destinationTrack is omitted in plan options:
    const untrackedPlan = compileTrackExecutionPlan({
      keyframes,
      registry,
    });
    const untrackedBinding = untrackedPlan.bindings[0]!;
    expect("destinationTrack" in untrackedBinding).toBe(false);
  });
});
