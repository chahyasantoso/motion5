import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";

/**
 * Deterministic diagnostic rule id a pending cross-motion reference must carry. Written as a
 * literal, not imported, so this test is red against the unmodified publisher before
 * `core/graph/references.ts` exists, and keeps independently checking that the rule id string
 * itself never drifts once that module lands.
 */
const PENDING_REFERENCE_RULE_ID = "observation-pending-reference";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "base", trigger: { type: "manual" }, tracks: [{ id: "root" }] },
    {
      id: "arm",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "child",
          observes: [
            {
              source: "base/root",
              role: "input",
              projection: { map: { self: "parentWorld" } },
            },
          ],
        },
      ],
    },
  ],
};

// `self` is written after spreading `inputs` so the node's own identity always wins on a key
// collision. This deliberately avoids a footgun where an unprojected upstream value could
// silently overwrite a node's own composed identity if inputs were spread last instead.
const compose = (node: { id: string }) => (inputs: Readonly<Record<string, unknown>>) => ({
  values: Object.freeze({ ...inputs, self: node.id }),
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("P5-01 cross-motion references", () => {
  it("keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);

    runtime.attach("arm/child");
    const pendingBatch = runtime.flush();
    const pendingPatch = pendingBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(pendingPatch?.status).toBe("blocked");
    expect(pendingPatch?.diagnostics[0]?.ruleId).toBe(PENDING_REFERENCE_RULE_ID);
    expect(pendingPatch?.values).toEqual({});

    runtime.attach("base/root");
    const readyBatch = runtime.flush();
    const readyPatch = readyBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(readyPatch).toBeDefined();
    expect(readyPatch?.status).toBe("ready");
    expect(readyPatch?.values).toMatchObject({ parentWorld: "base/root", self: "arm/child" });
    expect(Object.isFrozen(readyPatch)).toBe(true);
    expect(Object.isFrozen(readyPatch?.values)).toBe(true);

    runtime.dispose();
  });

  it("publishes the same ready output regardless of mount order", () => {
    const observerFirst = new GraphRuntime(project, createManualClock(), compose);
    observerFirst.attach("arm/child");
    observerFirst.attach("base/root");
    const observerFirstBatch = observerFirst.flush();
    observerFirst.dispose();

    const sourceFirst = new GraphRuntime(project, createManualClock(), compose);
    sourceFirst.attach("base/root");
    sourceFirst.attach("arm/child");
    const sourceFirstBatch = sourceFirst.flush();
    sourceFirst.dispose();

    const observerFirstChild = observerFirstBatch.patches.find(
      ({ nodeId }) => nodeId === "arm/child",
    );
    const sourceFirstChild = sourceFirstBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(observerFirstChild?.status).toBe("ready");
    expect(sourceFirstChild?.status).toBe("ready");
    expect(observerFirstChild?.values).toEqual(sourceFirstChild?.values);
  });

  it("rejects an unknown cross-motion source at load instead of treating it as pending", () => {
    const invalid: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        { id: "base", trigger: { type: "manual" }, tracks: [{ id: "root" }] },
        {
          id: "arm",
          trigger: { type: "manual" },
          tracks: [{ id: "child", observes: [{ source: "missing/root", role: "input" }] }],
        },
      ],
    };

    expect(() => new GraphRuntime(invalid, createManualClock(), compose)).toThrow(
      "observation-unknown-source",
    );
  });
});
