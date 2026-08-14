import { describe, expect, it } from "vitest";
import { PatchRegistry, type Patch } from "../../core/src/runtime/patch-registry";
import { createPatchStore } from "../src/patch-store";

const NODE_ID = "hero/arm";

function publish(registry: PatchRegistry, tick: number, opacity: number): void {
  registry.beginBatch(tick, [NODE_ID]);
  registry.publish({
    nodeId: NODE_ID,
    values: { opacity },
    sourceProgress: 0,
    status: "ready",
  });
  registry.closeBatch();
}

describe("React patch store lifecycle (C1)", () => {
  it("receives patches again after the last listener leaves and a new one arrives", () => {
    const registry = new PatchRegistry();
    const store = createPatchStore(registry, NODE_ID);

    const mounted: number[] = [];
    const unmount = store.subscribe((patch) => mounted.push(patch.revision));
    publish(registry, 1, 1);
    expect(mounted).toEqual([1]);

    unmount();
    // Published while nothing is mounted: no listener may run, but the store must not keep
    // reporting the patch it happened to see before it was torn down.
    publish(registry, 2, 0.5);

    const remounted: number[] = [];
    const unmountAgain = store.subscribe((patch) => remounted.push(patch.revision));
    expect(store.getSnapshot()?.revision).toBe(2);
    expect(store.getSnapshot()?.values).toEqual({ opacity: 0.5 });

    publish(registry, 3, 0);
    expect(remounted).toEqual([3]);
    expect(mounted).toEqual([1]);
    expect(store.getSnapshot()?.revision).toBe(3);

    unmountAgain();
  });

  it("survives a StrictMode-style double mount without duplicating deliveries", () => {
    const registry = new PatchRegistry();
    const store = createPatchStore(registry, NODE_ID);
    const seen: number[] = [];
    const listener = (patch: Patch): void => {
      seen.push(patch.revision);
    };

    // StrictMode runs the subscribe effect, tears it down, and runs it again.
    store.subscribe(listener)();
    const unmount = store.subscribe(listener);

    publish(registry, 1, 1);
    // Exactly one delivery proves the first attach was released instead of leaked.
    expect(seen).toEqual([1]);

    unmount();
    publish(registry, 2, 0);
    expect(seen).toEqual([1]);
    expect(store.getSnapshot()?.revision).toBe(2);
  });
});
