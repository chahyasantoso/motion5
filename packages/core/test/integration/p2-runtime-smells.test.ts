import { describe, expect, it, vi } from "vitest";
import { deriveDependants, type GraphEdge } from "../../src/graph/ir";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../src/runtime/graph-publisher";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { Track } from "../../src/domain/track";
import type { Interpolator } from "../../src/ports/interpolator";
import { slotOf } from "../helpers/requirement-inputs";

const node = (id: string, edges: GraphEdge[], compose: PublisherNode["compose"]): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze(edges),
    compose,
  });
// Reverse topology comes from its one owner rather than from a second walk written here. A snapshot
// assembled by hand is still a graph, and the publisher reads shape instead of deriving it, so a
// helper that answered this itself would be the second derivation the source just deleted.
const snapshot = (nodes: readonly PublisherNode[]): PublisherSnapshot => ({
  nodes,
  nodeById: Object.freeze(Object.fromEntries(nodes.map((entry) => [entry.id, entry]))),
  dependants: deriveDependants(nodes),
  order: Object.freeze(nodes.map(({ id }) => id)),
  diagnostics: Object.freeze([]),
});
// Every input edge carries a requirement now, so the fixtures below name one. `slot` is what
// distinguishes two edges of one plugin; the ids still decide their order. See ADR-047.
const requires = (observerId: string, sourceId: string, slot: string): GraphEdge => ({
  observerId,
  sourceId,
  role: "input",
  requirement: { plugin: "p", slot },
});
function fakeInterpolator(state: Readonly<Record<string, unknown>> = { x: 1 }) {
  const kill = vi.fn();
  const timeline = { state, progress: vi.fn(), kill };
  return { interpolator: { create: vi.fn(() => timeline) } as unknown as Interpolator, kill };
}

describe("P2 runtime smell hardening", () => {
  it("preserves the last known good values when a node publishes error", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, ["source"]);
    registry.publish({ nodeId: "source", values: { x: 1 }, sourceProgress: 0, status: "ready" });
    registry.closeBatch();
    registry.beginBatch(2, ["source"]);
    registry.publish({
      nodeId: "source",
      status: "error",
      diagnostics: [
        {
          ruleId: "composition-failure",
          path: "source",
          message: "boom",
          severity: "error",
          ids: ["source"],
        },
      ],
    });
    registry.closeBatch();
    // Re-read rather than adjusted: the last known good values are still preserved, and the
    // registry is what preserves them. They were a payload the errored patch carried until
    // ADR-098, so the pose is asked for by name and the old place is asserted empty beside it.
    const errored = registry.get("source");
    if (errored?.status !== "error")
      throw new Error(`source is ${errored?.status ?? "absent"}, not error.`);
    expect("values" in errored).toBe(false);
    expect(registry.lastReady("source")?.values).toEqual({ x: 1 });
  });
  it("derives source revisions from the upstream patches consumed in the flush", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const source = node("source", [], () => ({
      values: { x: 1 },
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    const consumer = node("consumer", [requires("consumer", "source", "s")], (inputs) => ({
      values: slotOf(inputs, "p", "s"),
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    publisher.flush(snapshot([source, consumer]), ["source", "consumer"], 1);
    const consumerPatch = registry.get("consumer");
    if (consumerPatch?.status !== "ready")
      throw new Error(`consumer is ${consumerPatch?.status ?? "absent"}, not ready.`);
    expect(consumerPatch.sourceRevisions).toEqual({ source: 1 });
    expect(consumerPatch.values).toEqual({ x: 1 });
  });
  it("reports a pending reference instead of silently composing with an input hole", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const consumer = node("consumer", [requires("consumer", "missing", "s")], (inputs) => ({
      values: slotOf(inputs, "p", "s"),
      sourceProgress: 0,
      sourceRevisions: {},
    }));
    publisher.flush(snapshot([consumer]), ["consumer"], 1);
    const blocked = registry.get("consumer");
    expect(blocked?.status).toBe("blocked");
    if (blocked?.status !== "blocked")
      throw new Error(`consumer is ${blocked?.status ?? "absent"}, not blocked.`);
    expect(blocked.diagnostics[0]?.ruleId).toBe("observation-pending-reference");
    // The hole is still not composed with, and it is not reported as an empty pose either: a
    // blocked patch owns no values at all now, which is that refusal stated in the type.
    expect("values" in blocked).toBe(false);
  });
  it("chooses the blocked upstream deterministically by edge key, not authored edge order", () => {
    const registry = new PatchRegistry();
    const publisher = new GraphPublisher(registry);
    const failedA = node("a", [], () => {
      throw new Error("a failed");
    });
    const failedB = node("b", [], () => {
      throw new Error("b failed");
    });
    const consumer = node(
      "consumer",
      [requires("consumer", "b", "right"), requires("consumer", "a", "left")],
      () => ({ values: {}, sourceProgress: 0, sourceRevisions: {} }),
    );
    publisher.flush(snapshot([failedA, failedB, consumer]), ["a", "b", "consumer"], 1);
    const consumerPatch = registry.get("consumer");
    // An upstream failure blocks this node, and `blocked` is the status owning that diagnostic.
    if (consumerPatch?.status !== "blocked")
      throw new Error(`consumer is ${consumerPatch?.status ?? "absent"}, not blocked.`);
    expect(consumerPatch.diagnostics[0]?.ids).toEqual(["a", "consumer"]);
  });
  it("rejects host objects from interpolator state at the renderer edge", () => {
    const { interpolator } = fakeInterpolator({ host: new Date(0) });
    const track = new Track({ interpolator, nodeId: "~/smell-test" });
    expect(() => track.compose()).toThrow(/renderer-neutral/);
  });
  it("kills a timeline exactly once when a Track is disposed repeatedly", () => {
    const { interpolator, kill } = fakeInterpolator();
    const track = new Track({ interpolator, nodeId: "~/smell-test" });
    track.dispose();
    track.dispose();
    expect(kill).toHaveBeenCalledOnce();
    expect(() => track.compose()).toThrow(/disposed/);
  });
});
