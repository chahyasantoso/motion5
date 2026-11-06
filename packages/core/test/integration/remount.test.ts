import { describe, expect, it } from "vitest";
import { shape } from "@motion5/core/plugin-api";
import type { PluginDefinition, ProjectDefinition, ValueSpec } from "../../src/contract/v5";
import { PluginCatalog } from "../../src/domain/plugin-catalog";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { record, track } from "../support/v5-builders";
import { testModels } from "../support/test-models";

const sourceId = "~/source";
const consumerId = "~/consumer";
const EMPTY_TABLE: ValueSpec = {
  kind: "table",
  schema: { row: { fields: {} } },
};
// The dependency is a declared plugin slot, which is the only way a value enters composition. It is
// still an input edge, so it is still what makes the consumer pending while upstream is unmounted.
const PASS: PluginDefinition = {
  id: "pass",
  inputs: {
    values: { kind: "record", fields: {} },
    requires: { upstream: shape({ outputs: { values: EMPTY_TABLE } }) },
  },
  outputs: { values: EMPTY_TABLE },
  transform() {
    return { values: [] };
  },
};
const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [],
  freeTracks: [
    track({ id: "source", model: "TestTable" }),
    track({
      id: "consumer",
      plugin: PASS.id,
      values: record({}),
      requires: { upstream: sourceId },
      model: "TestRecord",
    }),
  ],
};
const CATALOG = new PluginCatalog({ models: testModels });
CATALOG.register({ plugins: [PASS] });

function createRuntime() {
  const runtime = new ProjectRuntime(project, {
    clock: createManualClock(),
    compose: () => () => ({ outputs: { values: [] }, sourceProgress: 0, sourceRevisions: {} }),
    capabilities: CATALOG,
    isPluginRegistered: (pluginId) => CATALOG.isPluginAdmitted(pluginId),
  });
  runtime.mount(sourceId);
  runtime.mount(consumerId);
  return runtime;
}

describe("P5-04 unmount/remount recovery", () => {
  it("blocks the downstream closure while upstream is unmounted and recovers with a newer revision", () => {
    const runtime = createRuntime();
    try {
      const first = runtime.seek(sourceId, 0);
      const firstConsumer = first.patches.find(({ nodeId }) => nodeId === consumerId);
      expect(firstConsumer?.status).toBe("ready");
      const firstRevision = firstConsumer?.revision ?? 0;

      runtime.unmount(sourceId);
      const blocked = runtime.seek(consumerId, 0);
      const blockedConsumer = blocked.patches.find(({ nodeId }) => nodeId === consumerId);
      expect(blockedConsumer?.status).toBe("blocked");
      if (blockedConsumer?.status !== "blocked")
        throw new Error(`${consumerId} is ${blockedConsumer?.status ?? "absent"}, not blocked.`);
      expect(blockedConsumer.diagnostics[0]?.ruleId).toBe("source-pending");

      runtime.mount(sourceId);
      const recovered = runtime.seek(sourceId, 1);
      const recoveredConsumer = recovered.patches.find(({ nodeId }) => nodeId === consumerId);
      expect(recoveredConsumer?.status).toBe("ready");
      expect(recoveredConsumer?.revision).toBeGreaterThan(firstRevision);
    } finally {
      runtime.dispose();
    }
  });

  it("keeps patch and subscription retention flat across 50 unmount/remount cycles", () => {
    const runtime = createRuntime();
    try {
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
    } finally {
      runtime.dispose();
    }
  });
});
