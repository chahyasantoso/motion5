import { describe, expect, it } from "vitest";
import { PatchRegistry } from "../../core/src/runtime/patch-registry";
import { createPatchStore } from "../src/patch-store";

describe("React patch consumer boundary", () => {
  it("keeps one frozen snapshot per revision and unsubscribes cleanly", () => {
    const registry = new PatchRegistry();
    const store = createPatchStore(registry, "hero/arm");
    const seen: number[] = [];
    const unsubscribe = store.subscribe((patch) => seen.push(patch.revision));

    registry.beginBatch(1, ["hero/arm"]);
    registry.publish({
      nodeId: "hero/arm",
      values: { opacity: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();
    const first = store.getSnapshot();
    expect(first?.revision).toBe(1);
    expect(Object.isFrozen(first)).toBe(true);
    expect(seen).toEqual([1]);

    registry.beginBatch(2, ["hero/arm"]);
    registry.publish({
      nodeId: "hero/arm",
      values: { opacity: 1 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();
    expect(store.getSnapshot()).toBe(first);
    expect(seen).toEqual([1]);

    unsubscribe();
    registry.beginBatch(3, ["hero/arm"]);
    registry.publish({
      nodeId: "hero/arm",
      values: { opacity: 0 },
      sourceProgress: 0,
      status: "ready",
    });
    registry.closeBatch();
    expect(seen).toEqual([1]);
  });
});
