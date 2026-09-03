import { describe, expect, it } from "vitest";
import { PatchRegistry } from "../../../src/runtime/patch-registry";
import {
  GraphPublisher,
  type PublisherNode,
  type PublisherSnapshot,
} from "../../../src/runtime/graph-publisher";
import { deriveDependants } from "../../../src/graph/ir";

const soleNode = (id: string): PublisherNode =>
  Object.freeze({
    id,
    owner: "motion",
    authoredIndex: 0,
    track: { id },
    edges: Object.freeze([]),
    compose: () => ({ values: { x: 1 }, sourceProgress: 0, sourceRevisions: {} }),
  });

const soleSnapshot = (id: string): PublisherSnapshot => {
  const node = soleNode(id);
  return {
    nodes: [node],
    nodeById: Object.freeze({ [id]: node }),
    dependants: deriveDependants([node]),
    order: Object.freeze([id]),
    diagnostics: Object.freeze([]),
  };
};

describe("PatchRegistry: subscriber error handling (recovery A2)", () => {
  it("a throwing node subscriber does not prevent other subscribers from being notified", () => {
    const registry = new PatchRegistry();
    let secondCalled = false;
    registry.subscribeNode("hero/arm", () => {
      throw new Error("boom from first subscriber");
    });
    registry.subscribeNode("hero/arm", () => {
      secondCalled = true;
    });

    registry.beginBatch(1, ["hero/arm"]);
    registry.publish({ nodeId: "hero/arm", values: { x: 1 }, sourceProgress: 0, status: "ready" });

    expect(() => registry.closeBatch()).toThrow(/boom from first subscriber/);
    expect(secondCalled).toBe(true);
  });

  it("closeBatch always fully resets its internal state, even when a subscriber throws, so the next beginBatch succeeds", () => {
    const registry = new PatchRegistry();
    registry.subscribeNode("hero/arm", () => {
      throw new Error("boom");
    });

    registry.beginBatch(1, ["hero/arm"]);
    registry.publish({ nodeId: "hero/arm", values: { x: 1 }, sourceProgress: 0, status: "ready" });
    expect(() => registry.closeBatch()).toThrow(/boom/);

    // The registry must not be left thinking a batch is still open.
    expect(() => registry.beginBatch(2, ["hero/arm"])).not.toThrow();
  });

  it("the real caller's original error is not replaced by a recovery close attempt (GraphPublisher-shaped scenario)", () => {
    const registry = new PatchRegistry();
    registry.subscribeNode("hero/arm", () => {
      throw new Error("original subscriber failure");
    });

    // Mirrors GraphPublisher.flush()'s try/catch shape: attempt to close, and on failure,
    // attempt a recovery close before rethrowing.
    registry.beginBatch(1, ["hero/arm"]);
    registry.publish({ nodeId: "hero/arm", values: { x: 1 }, sourceProgress: 0, status: "ready" });

    let caught: unknown;
    try {
      registry.closeBatch();
    } catch (error) {
      try {
        registry.closeBatch();
      } catch {
        // best-effort cleanup only; must never mask the original error below
      }
      caught = error;
    }
    expect((caught as Error)?.message).toBe("original subscriber failure");
  });

  it("GraphPublisher.flush() surfaces the real subscriber error, not a masked 'No patch batch is open'", () => {
    const registry = new PatchRegistry();
    registry.subscribeNode("hero/arm", () => {
      throw new Error("original subscriber failure");
    });
    const publisher = new GraphPublisher(registry);

    expect(() => publisher.flush(soleSnapshot("hero/arm"), ["hero/arm"], 1)).toThrow(
      /original subscriber failure/,
    );

    // And the registry must be usable again immediately afterward.
    expect(() => publisher.flush(soleSnapshot("hero/arm"), [], 2)).not.toThrow();
  });
});
