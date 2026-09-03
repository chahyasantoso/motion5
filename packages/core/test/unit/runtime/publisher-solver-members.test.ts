import { describe, expect, it } from "vitest";
import { deriveDependants, type GraphEdge } from "../../../src/graph/ir";
import { PluginRegistry, type PluginDefinition } from "../../../src/domain/plugins";
import { Track } from "../../../src/domain/track";
import type { ImmutableRecord } from "../../../src/domain/values";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import { createFakeInterpolator } from "../../../src/testing/fakes";

// Slice C3 of issue #195: Publisher solver member inputs, failure semantics, and seed propagation.
//
// When a node declares `solves: readonly SolveMember[]`, GraphPublisher gathers each member's
// `interpolated()` state, joins the derived `base` onto it, and delivers the frozen list as
// `inputs[<plugin that owns the root slot>].members`. Invalidating a member also marks its solver
// in the publisher's affected BFS, and a solver that throws blocks its members and their children.
//
// Every fixture below orders the solver before its members, which is the real topological order
// (`IK-13` shows it end to end). Ordering the solver last hides both the member-side read of
// `rotations` and every blocked-upstream classification.

export interface MemberState {
  readonly id: string;
  readonly values: Readonly<Record<string, unknown>>;
  readonly progress: number;
}

function rootEdgeFor(observerId: string, sourceId: string, plugin = "ik"): GraphEdge {
  return { observerId, sourceId, role: "input", requirement: { plugin, slot: "root" } };
}

function solverEdgeFor(observerId: string, sourceId: string): GraphEdge {
  return { observerId, sourceId, role: "input", requirement: { plugin: "fk", slot: "solver" } };
}

function baseEdgeFor(observerId: string, sourceId: string): GraphEdge {
  return { observerId, sourceId, role: "input", requirement: { plugin: "fk", slot: "base" } };
}

function node(
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

function readyCompose(values: Readonly<Record<string, unknown>>): PublisherNode["compose"] {
  return () => ({ values, sourceProgress: 0, sourceRevisions: {} });
}

function shoulderNode(id = "walker/shoulder"): PublisherNode {
  return node(id, [], readyCompose({ x: 200, y: 300, rotation: 0 }), {
    interpolated: () => ({ id, values: { x: 200, y: 300, rotation: 0 }, progress: 0 }),
  });
}

// `deriveDependants` rather than a reverse walk written here, and `IK-12` is why it matters: seeding
// a member alone has to mark its solver, and that fan-in comes off `solves`, which no edge carries.
// A helper that derived it itself would make this file agree with itself instead of with the graph.
function snapshot(nodes: readonly PublisherNode[]): PublisherSnapshot {
  const nodeById: Record<string, PublisherNode> = {};
  for (const entry of nodes) nodeById[entry.id] = entry;
  return {
    nodes,
    nodeById,
    dependants: deriveDependants(nodes),
    order: nodes.map((entry) => entry.id),
    diagnostics: [],
  };
}

describe("Publisher solver member inputs (Slice C3)", () => {
  it("IK-9 members arrives under solving plugin scope root-most first and is frozen", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let capturedMembers: unknown;

    const shoulder = shoulderNode();
    const solves = [
      { id: "walker/upper-arm", base: "walker/shoulder" },
      { id: "walker/forearm", base: "walker/upper-arm" },
    ];
    const solver = node(
      "walker/arm-solve",
      [rootEdgeFor("walker/arm-solve", "walker/shoulder")],
      (inputs) => {
        capturedMembers = inputs.ik?.members;
        return {
          values: { rotations: { "walker/upper-arm": 10, "walker/forearm": 20 } },
          sourceProgress: 0,
          sourceRevisions: {},
        };
      },
      { solves: Object.freeze(solves) },
    );
    const upperArm = node(
      "walker/upper-arm",
      [solverEdgeFor("walker/upper-arm", "walker/arm-solve")],
      readyCompose({ rotation: 0 }),
      { interpolated: () => ({ id: "walker/upper-arm", values: { length: 80 }, progress: 0 }) },
    );
    const forearm = node(
      "walker/forearm",
      [solverEdgeFor("walker/forearm", "walker/arm-solve")],
      readyCompose({ rotation: 0 }),
      { interpolated: () => ({ id: "walker/forearm", values: { length: 60 }, progress: 0 }) },
    );

    const snap = snapshot([shoulder, solver, upperArm, forearm]);
    publisher.flush(snap, snap.order, 1);

    expect(capturedMembers).toBeDefined();
    const membersList = capturedMembers as readonly (MemberState & { base: string })[];
    expect(membersList).toHaveLength(2);
    expect(membersList[0]!.id).toBe("walker/upper-arm");
    expect(membersList[1]!.id).toBe("walker/forearm");
    // `base` is joined on from the derivation, not reported by the member.
    expect(membersList[0]!.base).toBe("walker/shoulder");
    expect(membersList[1]!.base).toBe("walker/upper-arm");
    expect(Object.isFrozen(membersList)).toBe(true);
    expect(() => {
      (membersList as unknown as unknown[])[0] = null;
    }).toThrow();
  });

  it("IK-19 members arrive under the plugin that owns the root slot, never a fixed name", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let springMembers: unknown;
    let ikScope: unknown;

    const anchor = shoulderNode("walker/anchor");
    const solver = node(
      "walker/rope-solve",
      [rootEdgeFor("walker/rope-solve", "walker/anchor", "spring")],
      (inputs) => {
        springMembers = inputs.spring?.members;
        ikScope = inputs.ik;
        return { values: { offsets: {} }, sourceProgress: 0, sourceRevisions: {} };
      },
      { solves: Object.freeze([{ id: "walker/bead", base: "walker/anchor" }]) },
    );
    const bead = node(
      "walker/bead",
      [solverEdgeFor("walker/bead", "walker/rope-solve")],
      readyCompose({ rotation: 0 }),
      { interpolated: () => ({ id: "walker/bead", values: { length: 12 }, progress: 0 }) },
    );

    const snap = snapshot([anchor, solver, bead]);
    publisher.flush(snap, snap.order, 1);

    // A publisher that names a plugin makes the first non-kinematic solver an edit to the
    // publisher. The root edge already carries the scope, so it is read rather than assumed.
    expect(springMembers).toBeDefined();
    expect((springMembers as readonly MemberState[])[0]!.id).toBe("walker/bead");
    expect(ikScope).toBeUndefined();
  });

  it("IK-10 solver whose member exposes no interpolated function fails loudly", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);

    const shoulder = shoulderNode();
    const solver = node(
      "walker/arm-solve",
      [rootEdgeFor("walker/arm-solve", "walker/shoulder")],
      readyCompose({ rotations: {} }),
      { solves: Object.freeze([{ id: "walker/upper-arm", base: "walker/shoulder" }]) },
    );
    // No `interpolated` at all, which is the invariant violation this pins.
    const upperArm = node(
      "walker/upper-arm",
      [solverEdgeFor("walker/upper-arm", "walker/arm-solve")],
      readyCompose({}),
    );

    const snap = snapshot([shoulder, solver, upperArm]);
    const batch = publisher.flush(snap, snap.order, 1);
    expect(batch.patches.find((p) => p.nodeId === "walker/arm-solve")?.status).toBe("error");
    expect(batch.patches.find((p) => p.nodeId === "walker/upper-arm")?.status).toBe("blocked");
  });

  it("IK-14 a throwing solver errors, its members block, and their children block", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);

    const shoulder = shoulderNode();
    const solves = [
      { id: "walker/upper-arm", base: "walker/shoulder" },
      { id: "walker/forearm", base: "walker/upper-arm" },
    ];
    const solver = node(
      "walker/arm-solve",
      [rootEdgeFor("walker/arm-solve", "walker/shoulder")],
      () => {
        throw new Error("solve diverged");
      },
      { solves: Object.freeze(solves) },
    );
    const upperArm = node(
      "walker/upper-arm",
      [solverEdgeFor("walker/upper-arm", "walker/arm-solve")],
      readyCompose({ rotation: 0 }),
      { interpolated: () => ({ id: "walker/upper-arm", values: { length: 80 }, progress: 0 }) },
    );
    const forearm = node(
      "walker/forearm",
      [solverEdgeFor("walker/forearm", "walker/arm-solve")],
      readyCompose({ rotation: 0 }),
      { interpolated: () => ({ id: "walker/forearm", values: { length: 60 }, progress: 0 }) },
    );
    const hand = node(
      "walker/hand",
      [baseEdgeFor("walker/hand", "walker/forearm")],
      readyCompose({}),
    );

    const snap = snapshot([shoulder, solver, upperArm, forearm, hand]);
    const batch = publisher.flush(snap, snap.order, 1);
    const patchFor = (id: string) => batch.patches.find((p) => p.nodeId === id);

    const solverPatch = patchFor("walker/arm-solve");
    expect(solverPatch?.status).toBe("error");
    expect(solverPatch?.diagnostics[0]?.ruleId).toBe("composition-failure");
    expect(solverPatch?.diagnostics[0]?.message).toContain("solve diverged");

    for (const id of ["walker/upper-arm", "walker/forearm"]) {
      expect(patchFor(id)?.status).toBe("blocked");
      expect(patchFor(id)?.diagnostics[0]?.ruleId).toBe("blocked-upstream");
    }
    expect(patchFor("walker/hand")?.status).toBe("blocked");
    expect(patchFor("walker/hand")?.diagnostics[0]?.ruleId).toBe("blocked-upstream");
  });

  it("IK-11 one memo, owned by Track, covering members and the solver's own timeline", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let solveCount = 0;
    let currentLength = 80;

    // A real `Track`, not a bare closure. The dirty check under test is `Track`'s, and its memo key
    // is the seed as well as the requirement inputs. A fake compose only pins whatever cache the
    // publisher happened to hold, which is how a publisher-side cache that ignored the solver's own
    // seed passed as evidence for a seam that never had that hole.
    const spy: PluginDefinition = {
      name: "ik",
      keys: ["flip"],
      requirements: { root: {}, target: {} },
      stage: "compose",
      outputs: ["rotations"],
      compose: (values) => {
        solveCount += 1;
        const rotations = { "walker/upper-arm": solveCount };
        return { ...values, rotations } as unknown as ImmutableRecord;
      },
    };
    const plugins = new PluginRegistry();
    plugins.register(spy);
    const authored = {
      ik: {
        values: {
          flip: [
            { p: 0, v: 0 },
            { p: 1, v: 1 },
          ],
        },
      },
    };
    const resolved = plugins.resolveForKeyframes(authored, "walker/arm-solve.keyframes", {
      id: "walker/arm-solve",
    });
    expect(resolved.diagnostics).toEqual([]);
    const track = new Track({
      interpolator: createFakeInterpolator(),
      interpolationConfig: { id: "arm-solve", keyframes: resolved.authoredKeyframes },
      plugins: resolved,
      nodeId: "walker/arm-solve",
    });

    const shoulder = shoulderNode();
    const solver = node(
      "walker/arm-solve",
      [rootEdgeFor("walker/arm-solve", "walker/shoulder")],
      (inputs) => {
        const composed = track.compose(inputs);
        return { values: composed.values, sourceProgress: composed.progress, sourceRevisions: {} };
      },
      { solves: Object.freeze([{ id: "walker/upper-arm", base: "walker/shoulder" }]) },
    );
    const upperArm = node(
      "walker/upper-arm",
      [solverEdgeFor("walker/upper-arm", "walker/arm-solve")],
      readyCompose({ rotation: 0 }),
      {
        interpolated: () => ({
          id: "walker/upper-arm",
          values: { length: currentLength },
          progress: 0,
        }),
      },
    );

    const snap = snapshot([shoulder, solver, upperArm]);

    publisher.flush(snap, snap.order, 1);
    expect(solveCount).toBe(1);

    // Nothing moved: the memo answers.
    publisher.flush(snap, snap.order, 2);
    expect(solveCount).toBe(1);

    // A member's interpolated length changed, and it travels inside the requirement inputs.
    currentLength = 90;
    publisher.flush(snap, ["walker/upper-arm"], 3);
    expect(solveCount).toBe(2);

    // The solver's own authored value moved, and nothing else did. A memo keyed on inputs and
    // members alone would hold still here, with no error and no diagnostic.
    track.setProgress(1);
    publisher.flush(snap, ["walker/arm-solve"], 4);
    expect(solveCount).toBe(3);
  });

  it("IK-12 seed rule marks solver when only its member is invalidated", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    let solverComposed = false;
    let length = 80;

    const shoulder = shoulderNode();
    const solver = node(
      "walker/arm-solve",
      [rootEdgeFor("walker/arm-solve", "walker/shoulder")],
      () => {
        solverComposed = true;
        return { values: { rotations: {} }, sourceProgress: 0, sourceRevisions: {} };
      },
      { solves: Object.freeze([{ id: "walker/upper-arm", base: "walker/shoulder" }]) },
    );
    const upperArm = node(
      "walker/upper-arm",
      [solverEdgeFor("walker/upper-arm", "walker/arm-solve")],
      readyCompose({}),
      { interpolated: () => ({ id: "walker/upper-arm", values: { length }, progress: 0 }) },
    );

    const snap = snapshot([shoulder, solver, upperArm]);
    publisher.flush(snap, snap.order, 1);
    solverComposed = false;

    // Invalidate ONLY upper-arm with new length
    length = 85;
    publisher.flush(snap, ["walker/upper-arm"], 2);
    expect(solverComposed).toBe(true);
  });
});
