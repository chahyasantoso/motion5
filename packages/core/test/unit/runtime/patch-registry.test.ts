import { describe, expect, it } from "vitest";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

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
});
