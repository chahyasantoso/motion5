import { describe, expect, it } from "vitest";
import type { GraphEdge, GraphIR } from "../../../src/graph/ir";
import { GraphPublisher, type PublisherNode } from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

// Slice C3 of issue #195: Publisher solver member inputs and seed propagation.
//
// When a node declares `solves: readonly SolveMember[]`, GraphPublisher gathers each member's
// `interpolated()` state and delivers it as `inputs[solvingPlugin].members`.
// In addition, invalidating a member node also marks its solver in the publisher's affected BFS.

export interface MemberState {
  readonly id: string;
  readonly base: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
}

export type PublisherNodeWithInterpolated = PublisherNode & {
  readonly interpolated?: () => MemberState;
};

function solverNode(
  id: string,
  edges: readonly GraphEdge[],
  solves: readonly { readonly id: string; readonly base: string }[],
  compose: PublisherNode["compose"],
  interpolated?: () => MemberState,
): PublisherNodeWithInterpolated {
  return Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    solves: Object.freeze(solves),
    compose,
    ...(interpolated ? { interpolated } : {}),
  });
}

function memberNode(
  id: string,
  edges: readonly GraphEdge[],
  compose: PublisherNode["compose"],
  interpolated: () => MemberState,
): PublisherNodeWithInterpolated {
  return Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 1,
    track: { id },
    edges: Object.freeze(edges),
    compose,
    interpolated,
  });
}

function shoulderNode(id = "walker/shoulder"): PublisherNodeWithInterpolated {
  return memberNode(
    id,
    [],
    () => ({
      values: { x: 200, y: 300, rotation: 0 },
      sourceProgress: 0,
      sourceRevisions: {},
    }),
    () => ({
      id,
      base: "",
      values: { x: 200, y: 300, rotation: 0 },
      progress: 0,
    }),
  );
}

function snapshot(
  nodes: readonly PublisherNodeWithInterpolated[],
): GraphIR & { nodes: readonly PublisherNodeWithInterpolated[] } {
  const nodeById: Record<string, PublisherNodeWithInterpolated> = {};
  for (const n of nodes) nodeById[n.id] = n;
  return {
    nodes,
    nodeById,
    order: nodes.map((n) => n.id),
    diagnostics: [],
  } as unknown as GraphIR & { nodes: readonly PublisherNodeWithInterpolated[] };
}

describe("Publisher solver member inputs (Slice C3)", () => {
  it("IK-9 members arrives under solving plugin scope root-most first and is frozen", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let capturedMembers: unknown;

    const shoulder = shoulderNode();
    const rootEdge: GraphEdge = {
      observerId: "walker/arm-solve",
      sourceId: "walker/shoulder",
      role: "input",
      requirement: { plugin: "ik", slot: "root" },
    };

    const upperArm = memberNode(
      "walker/upper-arm",
      [],
      () => ({ values: { rotation: 0 }, sourceProgress: 0, sourceRevisions: {} }),
      () => ({
        id: "walker/upper-arm",
        base: "walker/shoulder",
        values: { length: 80 },
        progress: 0,
      }),
    );

    const forearm = memberNode(
      "walker/forearm",
      [],
      () => ({ values: { rotation: 0 }, sourceProgress: 0, sourceRevisions: {} }),
      () => ({
        id: "walker/forearm",
        base: "walker/upper-arm",
        values: { length: 60 },
        progress: 0,
      }),
    );

    const solver = solverNode(
      "walker/arm-solve",
      [rootEdge],
      [
        { id: "walker/upper-arm", base: "walker/shoulder" },
        { id: "walker/forearm", base: "walker/upper-arm" },
      ],
      (inputs) => {
        capturedMembers = inputs.ik?.members;
        return {
          values: { rotations: { "walker/upper-arm": 10, "walker/forearm": 20 } },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );

    const snap = snapshot([shoulder, upperArm, forearm, solver]);
    publisher.flush(snap, snap.order, 1);

    expect(capturedMembers).toBeDefined();
    const membersList = capturedMembers as readonly MemberState[];
    expect(membersList).toHaveLength(2);
    expect(membersList[0]!.id).toBe("walker/upper-arm");
    expect(membersList[1]!.id).toBe("walker/forearm");
    expect(Object.isFrozen(membersList)).toBe(true);
    expect(() => {
      (membersList as unknown as unknown[])[0] = null;
    }).toThrow();
  });

  it("IK-10 solver whose member exposes no interpolated function fails loudly", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);

    const shoulder = shoulderNode();
    const rootEdge: GraphEdge = {
      observerId: "walker/arm-solve",
      sourceId: "walker/shoulder",
      role: "input",
      requirement: { plugin: "ik", slot: "root" },
    };

    // member has no interpolated function
    const upperArm = solverNode("walker/upper-arm", [], [], () => ({
      values: {},
      sourceProgress: 0,
      sourceRevisions: {},
    }));

    const solver = solverNode(
      "walker/arm-solve",
      [rootEdge],
      [{ id: "walker/upper-arm", base: "walker/shoulder" }],
      () => ({
        values: { rotations: {} },
        sourceProgress: 0,
        sourceRevisions: {},
      }),
    );

    const snap = snapshot([shoulder, upperArm, solver]);
    const batch = publisher.flush(snap, snap.order, 1);
    const solverPatch = batch.patches.find((p) => p.nodeId === "walker/arm-solve");
    expect(solverPatch?.status).toBe("error");
  });

  it("IK-11 dirty check re-solves when member interpolated length changes but not when identical", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let solveCount = 0;
    let currentLength = 80;

    const shoulder = shoulderNode();
    const rootEdge: GraphEdge = {
      observerId: "walker/arm-solve",
      sourceId: "walker/shoulder",
      role: "input",
      requirement: { plugin: "ik", slot: "root" },
    };

    const upperArm = memberNode(
      "walker/upper-arm",
      [],
      () => ({ values: {}, sourceProgress: 0, sourceRevisions: {} }),
      () => ({
        id: "walker/upper-arm",
        base: "walker/shoulder",
        values: { length: currentLength },
        progress: 0,
      }),
    );

    const solver = solverNode(
      "walker/arm-solve",
      [rootEdge],
      [{ id: "walker/upper-arm", base: "walker/shoulder" }],
      () => {
        solveCount++;
        return {
          values: { rotations: { "walker/upper-arm": solveCount } },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );

    const snap = snapshot([shoulder, upperArm, solver]);

    // Tick 1: initial solve
    publisher.flush(snap, snap.order, 1);
    expect(solveCount).toBe(1);

    // Tick 2: nothing changed -> memoized, no re-solve
    publisher.flush(snap, snap.order, 2);
    expect(solveCount).toBe(1);

    // Tick 3: member length changes -> solver re-solves
    currentLength = 90;
    publisher.flush(snap, ["walker/upper-arm"], 3);
    expect(solveCount).toBe(2);
  });

  it("IK-12 seed rule marks solver when only its member is invalidated", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let solverComposed = false;

    const shoulder = shoulderNode();
    const rootEdge: GraphEdge = {
      observerId: "walker/arm-solve",
      sourceId: "walker/shoulder",
      role: "input",
      requirement: { plugin: "ik", slot: "root" },
    };

    const upperArm = memberNode(
      "walker/upper-arm",
      [],
      () => ({ values: {}, sourceProgress: 0, sourceRevisions: {} }),
      () => ({
        id: "walker/upper-arm",
        base: "walker/shoulder",
        values: { length: 80 },
        progress: 0,
      }),
    );

    const solver = solverNode(
      "walker/arm-solve",
      [rootEdge],
      [{ id: "walker/upper-arm", base: "walker/shoulder" }],
      () => {
        solverComposed = true;
        return {
          values: { rotations: {} },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
    );

    const snap = snapshot([shoulder, upperArm, solver]);
    publisher.flush(snap, snap.order, 1);
    solverComposed = false;

    // Invalidate ONLY upper-arm
    publisher.flush(snap, ["walker/upper-arm"], 2);
    expect(solverComposed).toBe(true);
  });
});
