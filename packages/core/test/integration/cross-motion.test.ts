import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "base",
      trigger: { type: "manual" },
      tracks: [{ id: "root" }],
    },
    {
      id: "arm",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "child",
          observes: [{ source: "base/root", role: "input", target: "parentWorld" }],
        },
      ],
    },
  ],
};

const compose = (node: { id: string }) => (inputs: Readonly<Record<string, unknown>>) => ({
  values: { node: node.id, ...inputs },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("P5-01 cross-motion references", () => {
  it("keeps a child pending when its cross-motion source is not mounted, then recovers independent of mount order", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);

    runtime.attach("arm/child");
    const pending = runtime.flush();
    const pendingPatch = pending.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(pendingPatch?.status).toBe("blocked");
    expect(pendingPatch?.diagnostics[0]?.ruleId).toBe("pending-reference");

    runtime.attach("base/root");
    const recovered = runtime.flush();
    const childPatch = recovered.patches.find(({ nodeId }) => nodeId === "arm/child");
    expect(childPatch?.status).toBe("ready");
    expect(childPatch?.values).toEqual({ node: "arm/child", parentWorld: { node: "base/root" } });

    runtime.dispose();
  });

  it("publishes the same child output when the source is mounted first", () => {
    const runtime = new GraphRuntime(project, createManualClock(), compose);

    runtime.attach("base/root");
    runtime.attach("arm/child");
    const batch = runtime.flush();
    const childPatch = batch.patches.find(({ nodeId }) => nodeId === "arm/child");

    expect(childPatch?.status).toBe("ready");
    expect(childPatch?.values).toEqual({ node: "arm/child", parentWorld: { node: "base/root" } });
    runtime.dispose();
  });
});
