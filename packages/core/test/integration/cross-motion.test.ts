import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import type { RequirementInputs } from "../../src/domain/plugins";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";
import { slotOf } from "../helpers/requirement-inputs";

/**
 * Deterministic diagnostic rule id a pending cross-motion reference must carry. Written as a
 * literal, not imported, so this test is red against the unmodified publisher before
 * `core/graph/references.ts` exists, and keeps independently checking that the rule id string
 * itself never drifts once that module lands.
 */
const PENDING_REFERENCE_RULE_ID = "observation-pending-reference";

// The cross-motion dependency is authored as a plugin requirement, which is the only way a value
// enters composition. Graph construction reads the binding syntactically and holds no registry, so
// `rig` here names nothing that has to be registered. See ADR-047.
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
          keyframes: { rig: { requires: { parent: "base/root" } } },
        },
      ],
    },
  ],
};

// `self` is the node's own identity and `parentWorld` is the upstream's. They cannot collide any
// more, because the slot is the scope rather than a renamed key, but the case still asserts that
// the observer's own value is the one it publishes.
const compose = (node: { id: string }) => (requirementInputs: RequirementInputs) => ({
  values: Object.freeze({
    parentWorld: slotOf(requirementInputs, "rig", "parent").self ?? null,
    self: node.id,
  }),
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("P5-01 cross-motion references", () => {
  it("keeps an observer pending while its cross-motion source is unmounted, then resolves once it mounts", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);

    runtime.attach("arm/child");
    // Every flush names its seeds now: the member-set default is gone. Each list here is the
    // member insertion order that default derived, so what publishes is unchanged. Issue #371.
    const pendingBatch = runtime.flush(["arm/child"]);
    const pendingPatch = pendingBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(pendingPatch?.status).toBe("blocked");
    if (pendingPatch?.status !== "blocked")
      throw new Error(`arm/child is ${pendingPatch?.status ?? "absent"}, not blocked.`);
    expect(pendingPatch.diagnostics[0]?.ruleId).toBe(PENDING_REFERENCE_RULE_ID);
    // Re-read rather than adjusted: an unmounted source left the observer publishing an empty
    // pose, and the claim was that it composed with nothing. A blocked patch owns no values at
    // all now, so the same claim is the member's absence.
    expect("values" in pendingPatch).toBe(false);

    runtime.attach("base/root");
    const readyBatch = runtime.flush(["arm/child", "base/root"]);
    const readyPatch = readyBatch.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(readyPatch).toBeDefined();
    expect(readyPatch?.status).toBe("ready");
    if (readyPatch?.status !== "ready")
      throw new Error(`arm/child is ${readyPatch?.status ?? "absent"}, not ready.`);
    expect(readyPatch.values).toMatchObject({ parentWorld: "base/root", self: "arm/child" });
    expect(Object.isFrozen(readyPatch)).toBe(true);
    expect(Object.isFrozen(readyPatch.values)).toBe(true);

    runtime.dispose();
  });

  it("publishes the same ready output regardless of mount order", () => {
    const observerFirst = new GraphRuntime(project, createManualClock(), compose);
    observerFirst.attach("arm/child");
    observerFirst.attach("base/root");
    const observerFirstBatch = observerFirst.flush(["arm/child", "base/root"]);
    observerFirst.dispose();

    const sourceFirst = new GraphRuntime(project, createManualClock(), compose);
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
          tracks: [{ id: "child", observes: [{ source: "missing/root" }] }],
        },
      ],
    };

    expect(() => new GraphRuntime(invalid, createManualClock(), compose)).toThrow(
      "observation-unknown-source",
    );
  });
});
