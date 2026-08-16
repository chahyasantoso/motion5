import { describe, expect, it } from "vitest";
import { PatchRegistry, type Patch } from "../../core/src/runtime/patch-registry";
import { createPatchStore } from "../src/patch-store";

const NODE_ID = "walk/armL_upper";

function publish(registry: PatchRegistry, tick: number, x: number): void {
  registry.beginBatch(tick, [NODE_ID]);
  registry.publish({ nodeId: NODE_ID, values: { x }, sourceProgress: 0, status: "ready" });
  registry.closeBatch();
}

describe("React patch store under node destruction (D1)", () => {
  it("reports undefined once its node is evicted instead of freezing the last pose", () => {
    const registry = new PatchRegistry();
    const store = createPatchStore(registry, NODE_ID);
    const notifications: Patch[] = [];
    const unmount = store.subscribe((patch) => notifications.push(patch));

    publish(registry, 1, 45);
    expect(store.getSnapshot()?.values).toEqual({ x: 45 });

    registry.evict(NODE_ID);

    // The store is still attached: the component that owns it is still mounted and still
    // re-rendering every frame. Liveness therefore has to come from the snapshot, which is
    // exactly what made the destroyed node keep drawing before this fix.
    expect(notifications.at(-1)?.status).toBe("destroyed");
    expect(store.getSnapshot()).toBeUndefined();

    unmount();
  });

  it("recovers when the same node id is adopted again", () => {
    const registry = new PatchRegistry();
    const store = createPatchStore(registry, NODE_ID);
    const unmount = store.subscribe(() => undefined);

    publish(registry, 1, 45);
    registry.evict(NODE_ID);
    expect(store.getSnapshot()).toBeUndefined();

    publish(registry, 2, 60);
    expect(store.getSnapshot()?.values).toEqual({ x: 60 });

    unmount();
  });

  it("reports undefined from a detached store after eviction too", () => {
    const registry = new PatchRegistry();
    const store = createPatchStore(registry, NODE_ID);

    publish(registry, 1, 45);
    registry.evict(NODE_ID);

    expect(store.getSnapshot()).toBeUndefined();
  });
});
