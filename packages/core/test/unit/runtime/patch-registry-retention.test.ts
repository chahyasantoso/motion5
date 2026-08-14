import { describe, expect, it } from "vitest";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

describe("PatchRegistry lifecycle retention", () => {
  it("evicts one node patch without removing its subscriber or publishing a batch", () => {
    const registry = new PatchRegistry();
    let notifications = 0;
    registry.subscribeNode("~/source", () => {
      notifications += 1;
    });

    registry.beginBatch(1, ["~/source"]);
    const first = registry.publish({
      nodeId: "~/source",
      values: { value: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();
    expect(first?.revision).toBe(1);
    expect(registry.get("~/source")).toBeDefined();
    expect(notifications).toBe(1);

    registry.remove("~/source");
    expect(registry.get("~/source")).toBeUndefined();

    registry.beginBatch(2, ["~/source"]);
    const second = registry.publish({
      nodeId: "~/source",
      values: { value: 2 },
      sourceProgress: 0,
      status: "ready",
    });
    const batch = registry.closeBatch();
    expect(second?.revision).toBe(1);
    expect(batch.patches).toHaveLength(1);
    expect(notifications).toBe(2);
  });

  it("treats repeated eviction as an idempotent teardown operation", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, ["~/source"]);
    registry.publish({
      nodeId: "~/source",
      values: { value: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();

    registry.remove("~/source");
    expect(() => registry.remove("~/source")).not.toThrow();
    expect(registry.get("~/source")).toBeUndefined();
  });
});
