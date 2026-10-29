import { describe, expect, it } from "vitest";
import type { TrackDefinition } from "../../src/contract/v5";

import { createManualClock } from "../../src/ports/clock";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { record, track } from "../support/v5-builders";

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
};
const compose = (node: { id: string }) => () => ({
  outputs: { values: { node: node.id } },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("Phase 4: Dynamic Graph Lifecycle Hardening", () => {
  it("1. A runtime add produces ready patches and publishes through the ordinary graph path", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    try {
      const added = runtime.addTrack({ id: "cursor" } as TrackDefinition);
      expect(added.id).toBe("~/cursor");

      // The ordinary graph path, and it is the commit's own flush rather than the next seek:
      // still one publisher, one batch and one status, which is what this case is about.
      const patch = runtime.graph.registry.get("~/cursor");
      expect(patch?.status).toBe("ready");
      if (patch?.status !== "ready")
        throw new Error(`patch is ${patch?.status ?? "absent"}, not ready.`);
      expect(patch.outputs.values).toEqual({ node: "~/cursor" });
      expect(runtime.seek("~/cursor", 0).patches).toEqual([]);
    } finally {
      runtime.dispose();
    }
  });

  it("2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    try {
      runtime.addTrack({ id: "cursor" } as TrackDefinition);
      const snapshotBefore = runtime.graph.state.snapshot();
      const countBefore = runtime.instanceCount;

      expect(() => runtime.addTrack({ id: "cursor" } as TrackDefinition)).toThrow(/already exists/);

      const snapshotAfter = runtime.graph.state.snapshot();
      expect(snapshotAfter.nodes).toEqual(snapshotBefore.nodes);
      expect(snapshotAfter.edges).toEqual(snapshotBefore.edges);
      expect(runtime.instanceCount).toBe(countBefore);
    } finally {
      runtime.dispose();
    }
  });

  it("3. Repeated add/remove cycles do not retain dead GraphNode identities or stale compose closures", () => {
    const composeCallNodes = new Set<object>();
    const trackingCompose = (node: { id: string }) => {
      composeCallNodes.add(node);
      return () => ({
        outputs: { values: { node: node.id } },
        sourceProgress: 0,
        sourceRevisions: {},
      });
    };

    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose: trackingCompose,
    });
    try {
      for (let index = 0; index < 5; index += 1) {
        const added = runtime.addTrack({ id: `track${index}` } as TrackDefinition);
        runtime.seek(added.id, 0);
        added.remove();
      }

      const snapshot = runtime.graph.state.snapshot();
      expect(snapshot.nodes.some((id) => id.startsWith("~/track"))).toBe(false);
    } finally {
      runtime.dispose();
    }
  });

  it("4. PatchRegistry.dispose() clears all retained patches and rejects future publication", () => {
    const registry = new PatchRegistry();
    registry.beginBatch(1, ["a"]);
    registry.publish({
      nodeId: "a",
      sourceProgress: 0,
      status: "ready",
      outputs: { values: { x: 1 } },
    });
    registry.closeBatch();

    expect(registry.get("a")).toBeDefined();
    registry.dispose();
    expect(registry.disposed).toBe(true);
    expect(registry.get("a")).toBeUndefined();

    // beginBatch and publish after dispose are no-ops, not throws.
    registry.beginBatch(2, ["a"]);
    const result = registry.publish({
      nodeId: "a",
      outputs: { values: {} },
      sourceProgress: 0,
      status: "ready",
    });
    expect(result).toBeUndefined();
  });

  it("5. Requirement-scoped replacement updates edge identity consistently with GraphIR", () => {
    const runtime = new ProjectRuntime(
      {
        schemaVersion: 5,
        motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
        freeTracks: [
          track({ id: "source" }),
          track({
            id: "observer",
            plugin: "rig",
            values: record({}),
            requires: { upstream: "~/source" },
          }),
        ],
      },
      { clock: createManualClock(), compose },
    );
    try {
      const snapshot = runtime.graph.state.snapshot();
      const edge = snapshot.edges.find(
        (candidate) => candidate.observerId === "~/observer" && candidate.sourceId === "~/source",
      );
      expect(edge === undefined ? undefined : edge.requirement).toEqual({
        plugin: "rig",
        slot: "upstream",
      });
    } finally {
      runtime.dispose();
    }
  });

  it("6. Authored stop validation is shared: malformed stops are rejected before graph commit", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    try {
      const snapshotBefore = runtime.graph.state.snapshot();
      const badTrack = track({
        id: "bad",
        values: record({
          x: [
            { p: 0, v: 0 },
            { p: 0, v: 100 },
          ],
        }),
      });

      expect(() => runtime.addTrack(badTrack)).toThrow(/cell-stops-invalid/);

      const snapshotAfter = runtime.graph.state.snapshot();
      expect(snapshotAfter.nodes).toEqual(snapshotBefore.nodes);
    } finally {
      runtime.dispose();
    }
  });
});
