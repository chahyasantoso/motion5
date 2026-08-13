import { describe, expect, it } from "vitest";
import { PatchRegistry } from "../../../src/runtime/patch-registry";

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

describe("PatchRegistry: listener snapshots (recovery P1-6)", () => {
  it("delivers a settled batch to a node listener that an earlier listener unsubscribed", () => {
    const registry = new PatchRegistry();
    const seen: string[] = [];
    let releaseSecond: (() => void) | undefined;

    registry.subscribeNode(NODE_ID, () => {
      seen.push("first");
      releaseSecond?.();
    });
    releaseSecond = registry.subscribeNode(NODE_ID, () => {
      seen.push("second");
    });

    publish(registry, 1, 1);
    // The batch was already settled when notification began, so both listeners see it.
    expect(seen).toEqual(["first", "second"]);

    publish(registry, 2, 0.5);
    // The unsubscribe still takes effect for every later batch.
    expect(seen).toEqual(["first", "second", "first"]);
  });

  it("does not deliver a settled batch to a node listener subscribed during notification", () => {
    const registry = new PatchRegistry();
    const seen: string[] = [];

    registry.subscribeNode(NODE_ID, () => {
      seen.push("first");
      if (seen.length === 1)
        registry.subscribeNode(NODE_ID, () => {
          seen.push("late");
        });
    });

    publish(registry, 1, 1);
    expect(seen).toEqual(["first"]);

    publish(registry, 2, 0.5);
    expect(seen).toEqual(["first", "first", "late"]);
  });

  it("node and batch listeners follow the same snapshot rule", () => {
    const registry = new PatchRegistry();
    const nodeSeen: string[] = [];
    const batchSeen: string[] = [];
    let releaseSecondNode: (() => void) | undefined;
    let releaseSecondBatch: (() => void) | undefined;

    registry.subscribeNode(NODE_ID, () => {
      nodeSeen.push("first");
      releaseSecondNode?.();
    });
    releaseSecondNode = registry.subscribeNode(NODE_ID, () => {
      nodeSeen.push("second");
    });
    registry.subscribeBatch(() => {
      batchSeen.push("first");
      releaseSecondBatch?.();
    });
    releaseSecondBatch = registry.subscribeBatch(() => {
      batchSeen.push("second");
    });

    publish(registry, 1, 1);
    expect(nodeSeen).toEqual(batchSeen);
  });
});
