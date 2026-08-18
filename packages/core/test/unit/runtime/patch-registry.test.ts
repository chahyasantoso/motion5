import { describe, expect, it } from "vitest";
import { PatchRegistry, type Patch } from "../../../src/runtime/patch-registry";

function publishReady(registry: PatchRegistry, tick: number, values: Record<string, unknown>) {
  registry.beginBatch(tick, ["hero/arm"]);
  const patch = registry.publish({
    nodeId: "hero/arm",
    values,
    sourceProgress: 0,
    status: "ready",
  });
  registry.closeBatch();
  return patch;
}

describe("PatchRegistry", () => {
  it("I-7 deeply freezes published patches and batches", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, ["hero/arm"]);
    const patch = registry.publish({
      nodeId: "hero/arm",
      values: { nested: { opacity: 1 } },
      sourceProgress: 0.5,
      status: "ready",
    });
    const batch = registry.closeBatch();
    expect(patch).toBeDefined();
    expect(Object.isFrozen(patch)).toBe(true);
    expect(Object.isFrozen(patch?.values)).toBe(true);
    expect(Object.isFrozen(patch?.values.nested as object)).toBe(true);
    expect(Object.isFrozen(batch)).toBe(true);
  });

  it("I-8 suppresses unchanged republish and advances revisions only on change", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, ["hero/arm"]);
    const first = registry.publish({
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();
    registry.beginBatch(2, ["hero/arm"]);
    const unchanged = registry.publish({
      nodeId: "hero/arm",
      values: { x: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    const second = registry.publish({
      nodeId: "hero/arm",
      values: { x: 2 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();
    expect(first?.revision).toBe(1);
    expect(unchanged).toBeUndefined();
    expect(second?.revision).toBe(2);
  });

  it("I-6 notifies node subscribers before batch subscribers and safely snapshots listeners", () => {
    const registry = new PatchRegistry();
    const events: string[] = [];
    registry.beginBatch(1, ["hero/arm"]);
    registry.subscribeNode("hero/arm", () => events.push("node"));
    registry.subscribeBatch(() => events.push("batch"));
    registry.publish({ nodeId: "hero/arm", values: {}, sourceProgress: 0, status: "ready" });
    registry.closeBatch();
    expect(events).toEqual(["node", "batch"]);
  });

  it("does not notify subscribers for an unchanged publish", () => {
    const registry = new PatchRegistry();
    let count = 0;
    registry.subscribeNode("hero/arm", () => count++);
    registry.beginBatch(1, ["hero/arm"]);
    registry.publish({ nodeId: "hero/arm", values: {}, sourceProgress: 0, status: "ready" });
    registry.closeBatch();
    registry.beginBatch(2, ["hero/arm"]);
    registry.publish({ nodeId: "hero/arm", values: {}, sourceProgress: 0, status: "ready" });
    registry.closeBatch();
    expect(count).toBe(1);
  });

  it("rejects opening a second empty batch and closing without an open batch", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, []);
    expect(() => registry.beginBatch(2, [])).toThrow("already open");
    registry.closeBatch();
    expect(() => registry.closeBatch()).toThrow("No patch batch is open");
  });

  it("D1 publishes one terminal patch to node subscribers when a node is evicted", () => {
    const registry = new PatchRegistry();
    const seen: Patch[] = [];
    registry.subscribeNode("hero/arm", (patch) => seen.push(patch));
    publishReady(registry, 1, { x: 45 });

    registry.evict("hero/arm");

    expect(seen).toHaveLength(2);
    expect(seen[0]?.status).toBe("ready");
    // Without this event the ready patch above stays the subscriber's truth forever.
    expect(seen[1]?.status).toBe("destroyed");
    expect(seen[1]?.values).toEqual({});
    expect(seen[1]?.revision).toBe(2);
    expect(registry.get("hero/arm")).toBeUndefined();
  });

  it("D1 stays silent when evicting a node that never published", () => {
    const registry = new PatchRegistry();
    let count = 0;
    registry.subscribeNode("hero/arm", () => count++);
    registry.evict("hero/arm");
    expect(count).toBe(0);
  });

  it("D1 keeps a pre-eviction subscriber deliverable when the same node id returns", () => {
    const registry = new PatchRegistry();
    const statuses: string[] = [];
    registry.subscribeNode("hero/arm", (patch) => statuses.push(patch.status));

    publishReady(registry, 1, { x: 45 });
    registry.evict("hero/arm");
    // Re-adoption of the same id: the listener registered before the eviction must still be
    // the one the registry publishes into, not an orphan in a discarded Set.
    publishReady(registry, 2, { x: 60 });

    expect(statuses).toEqual(["ready", "destroyed", "ready"]);
  });

  it("D1 completes eviction even when a subscriber throws", () => {
    const registry = new PatchRegistry();
    publishReady(registry, 1, { x: 45 });
    registry.subscribeNode("hero/arm", () => {
      throw new Error("boom");
    });

    expect(() => registry.evict("hero/arm")).not.toThrow();
    expect(registry.get("hero/arm")).toBeUndefined();
  });

  it("D1 unmount removes the retained patch without a terminal event", () => {
    const registry = new PatchRegistry();
    const statuses: string[] = [];
    registry.subscribeNode("hero/arm", (patch) => statuses.push(patch.status));
    publishReady(registry, 1, { x: 45 });

    // Unmount is reversible, so it must not claim the node was destroyed.
    registry.remove("hero/arm");

    expect(statuses).toEqual(["ready"]);
    expect(registry.get("hero/arm")).toBeUndefined();
  });
});
