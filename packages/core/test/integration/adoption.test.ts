import { describe, expect, it } from "vitest";
import type { TrackDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});
const freeTrack: TrackDefinition = { id: "cursor" };

describe("P5-02 adopted free tracks", () => {
  it("adopts a free track under ~/id and publishes through the ordinary graph path", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    const adopted = runtime.adopt(freeTrack, owner);
    expect(adopted.id).toBe("~/cursor");
    const batch = runtime.seek("~/cursor", 0);
    expect(runtime.instanceCount).toBe(1);
    expect(batch.patches.find(({ nodeId }) => nodeId === "~/cursor")?.values).toEqual({
      node: "~/cursor",
    });
    runtime.dispose();
  });

  it("rejects duplicate adopted ids instead of silently replacing membership", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    runtime.adopt(freeTrack, {});
    expect(() => runtime.adopt(freeTrack, {})).toThrow(/already exists/);
    runtime.dispose();
  });

  it("lets a borrower detach without destroying the adopted track, while only the owner can destroy it", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    const borrower = {};
    const adopted = runtime.adopt(freeTrack, owner);
    runtime.detach(adopted.id, borrower);
    expect(runtime.instanceCount).toBe(0);
    expect(runtime.graph.state.nodeIds).toContain("~/cursor");
    expect(() => runtime.destroyAdopted(adopted.id, borrower)).toThrow(/owner/);
    runtime.destroyAdopted(adopted.id, owner);
    expect(runtime.graph.state.nodeIds).not.toContain("~/cursor");
    runtime.dispose();
  });
});
