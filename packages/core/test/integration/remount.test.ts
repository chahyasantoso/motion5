import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import type { RequirementInputs } from "../../src/domain/plugins";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

const sourceId = "~/source";
const consumerId = "~/consumer";
// The dependency is a plugin requirement, which is the only way a value enters composition. It is
// still an input edge, so it is still what makes the consumer pending while upstream is unmounted.
const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [] }],
  freeTracks: [
    { id: "source" },
    {
      id: "consumer",
      keyframes: { rig: { requires: { upstream: sourceId } } },
    },
  ],
};
const compose = (node: { id: string }) => (inputs: RequirementInputs) => ({
  values: { node: node.id, inputs },
  sourceProgress: 0,
  sourceRevisions: {},
});

function createRuntime() {
  const runtime = new ProjectRuntime(project, {
    clock: createManualClock(),
    compose,
  });
  runtime.mount(sourceId);
  runtime.mount(consumerId);
  return runtime;
}

describe("P5-04 unmount/remount recovery", () => {
  it("blocks the downstream closure while upstream is unmounted and recovers with a newer revision", () => {
    const runtime = createRuntime();
    const first = runtime.seek(sourceId, 0);
    const firstConsumer = first.patches.find(({ nodeId }) => nodeId === consumerId);
    expect(firstConsumer?.status).toBe("ready");
    const firstRevision = firstConsumer?.revision ?? 0;

    runtime.unmount(sourceId);
    const blocked = runtime.seek(consumerId, 0);
    const blockedConsumer = blocked.patches.find(({ nodeId }) => nodeId === consumerId);
    expect(blockedConsumer?.status).toBe("blocked");
    expect(blockedConsumer?.diagnostics[0]?.ruleId).toBe("observation-pending-reference");

    runtime.mount(sourceId);
    const recovered = runtime.seek(sourceId, 1);
    const recoveredConsumer = recovered.patches.find(({ nodeId }) => nodeId === consumerId);
    expect(recoveredConsumer?.status).toBe("ready");
    expect(recoveredConsumer?.revision).toBeGreaterThan(firstRevision);
    runtime.dispose();
  });

  it("keeps patch and subscription retention flat across 50 unmount/remount cycles", () => {
    const runtime = createRuntime();
    runtime.seek(sourceId, 0);
    const revisions: number[] = [];
    let notifications = 0;
    const unsubscribe = runtime.graph.registry.subscribeNode(consumerId, () => {
      notifications += 1;
    });

    for (let cycle = 0; cycle < 50; cycle += 1) {
      runtime.unmount(sourceId);
      runtime.seek(consumerId, cycle / 50);
      runtime.mount(sourceId);
      const batch = runtime.seek(sourceId, (cycle + 1) / 50);
      const patch = batch.patches.find(({ nodeId }) => nodeId === consumerId);
      expect(patch?.status).toBe("ready");
      revisions.push(patch?.revision ?? 0);
    }

    expect(new Set(revisions).size).toBe(50);
    expect(revisions.at(-1)).toBeGreaterThan(revisions[0] ?? 0);
    expect(notifications).toBe(100);
    unsubscribe();
    runtime.dispose();
  });
});
