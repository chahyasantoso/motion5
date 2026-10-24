import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import type { ComposeIdentifiedResolver } from "../../src/runtime/graph-runtime";
import { GraphRuntime } from "../../src/runtime/graph-runtime";
import { record, track } from "../support/v5-builders";

/**
 * Deterministic diagnostic rule id a pending cross-motion reference must carry. Written as a
 * literal, not imported, so the string itself is checked independently of the producer.
 */
const PENDING_REFERENCE_RULE_ID = "source-pending";

// The cross-motion dependency is a declared plugin slot. Graph construction reads the binding
// syntactically and holds no registry, so `rig` here names nothing that has to be registered.
const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "base", trigger: { type: "manual" }, tracks: [track({ id: "root" })] },
    {
      id: "arm",
      trigger: { type: "manual" },
      tracks: [
        track({
          id: "child",
          plugin: "rig",
          values: record({}),
          requires: { parent: "base/root" },
        }),
      ],
    },
  ],
};

const compose = (node: { id: string }) => () => ({
  outputs: { values: { self: node.id } },
  sourceProgress: 0,
  sourceRevisions: {},
});

const composeIdentified: ComposeIdentifiedResolver = (node) =>
  node.id === "arm/child"
    ? (requires) => ({
        outputs: {
          values: Object.freeze({
            parent: requires.parent === undefined ? "none" : "bound",
            self: node.id,
          }),
        },
        sourceProgress: 0,
        sourceRevisions: {},
      })
    : undefined;

function runtime(source: ProjectDefinition = project): GraphRuntime {
  return new GraphRuntime(source, createManualClock(), compose, {
    composeIdentified,
  });
}

describe("P5-01 cross-motion references", () => {
  it("keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts", () => {
    const graph = runtime();
    try {
      graph.attach("arm/child");
      const pendingBatch = graph.flush(["arm/child"]);
      const pendingPatch = pendingBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
      expect(pendingPatch?.status).toBe("blocked");
      if (pendingPatch?.status !== "blocked")
        throw new Error(`arm/child is ${pendingPatch?.status ?? "absent"}, not blocked.`);
      expect(pendingPatch.diagnostics[0]?.ruleId).toBe(PENDING_REFERENCE_RULE_ID);
      expect("values" in pendingPatch).toBe(false);

      graph.attach("base/root");
      const readyBatch = graph.flush(["arm/child", "base/root"]);
      const readyPatch = readyBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
      expect(readyPatch?.status).toBe("ready");
      if (readyPatch?.status !== "ready")
        throw new Error(`arm/child is ${readyPatch?.status ?? "absent"}, not ready.`);
      expect(readyPatch.outputs.values).toMatchObject({
        parent: "bound",
        self: "arm/child",
      });
      expect(Object.isFrozen(readyPatch)).toBe(true);
      expect(Object.isFrozen(readyPatch.outputs.values)).toBe(true);
    } finally {
      graph.dispose();
    }
  });

  it("publishes the same ready output regardless of mount order", () => {
    const observerFirst = runtime();
    observerFirst.attach("arm/child");
    observerFirst.attach("base/root");
    const observerFirstBatch = observerFirst.flush(["arm/child", "base/root"]);
    observerFirst.dispose();

    const sourceFirst = runtime();
    sourceFirst.attach("base/root");
    sourceFirst.attach("arm/child");
    const sourceFirstBatch = sourceFirst.flush(["base/root", "arm/child"]);
    sourceFirst.dispose();

    const observerFirstChild = observerFirstBatch.patches.find(
      ({ nodeId }) => nodeId === "arm/child",
    );
    const sourceFirstChild = sourceFirstBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(observerFirstChild?.status).toBe("ready");
    expect(sourceFirstChild?.status).toBe("ready");
    if (observerFirstChild?.status !== "ready" || sourceFirstChild?.status !== "ready")
      throw new Error("Both mount orders must publish a ready child.");
    expect(observerFirstChild.outputs).toEqual(sourceFirstChild.outputs);
  });

  it("rejects an unknown cross-motion source at load instead of treating it as pending", () => {
    const invalid: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        { id: "base", trigger: { type: "manual" }, tracks: [track({ id: "root" })] },
        {
          id: "arm",
          trigger: { type: "manual" },
          tracks: [
            track({
              id: "child",
              plugin: "rig",
              values: record({}),
              requires: { parent: "missing/root" },
            }),
          ],
        },
      ],
    };

    expect(() => runtime(invalid)).toThrow(/edge-unknown-source/);
  });
});
