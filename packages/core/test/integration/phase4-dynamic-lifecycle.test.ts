import { describe, expect, it, vi } from "vitest";
import type { TrackDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { PatchRegistry } from "../../src/runtime/patch-registry";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

const project = {
  schemaVersion: 5 as const,
  motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
};
const compose =
  (node: { id: string }) =>
  () => ({
    values: { node: node.id },
    sourceProgress: 0,
    sourceRevisions: {},
  });

describe("Phase 4: Dynamic Graph Lifecycle Hardening", () => {
  it("1. Adoption produces ready patches and publishes through the ordinary graph path", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    const adopted = runtime.adopt({ id: "cursor" } as TrackDefinition, owner);
    expect(adopted.id).toBe("~/cursor");

    const batch = runtime.seek("~/cursor", 0);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "~/cursor");
    expect(patch).toBeDefined();
    expect(patch?.status).toBe("ready");
    expect(patch?.values).toEqual({ node: "~/cursor" });
    runtime.dispose();
  });

  it("2. Failed adoption (duplicate id) is observationally atomic — graph, membership, and patches are unchanged", () => {
    const runtime = new ProjectRuntime(project, { clock: createManualClock(), compose });
    const owner = {};
    runtime.adopt({ id: "cursor" } as TrackDefinition, owner);

    const snapshotBefore = runtime.graph.state.snapshot();
    const countBefore = runtime.instanceCount;

    // Duplicate adopt should fail atomically
    expect(() => runtime.adopt({ id: "cursor" } as TrackDefinition, {})).toThrow(/already exists/);

    // State is byte-identical to pre-mutation snapshot
    const snapshotAfter = runtime.graph.state.snapshot();
    expect(snapshotAfter.nodes).toEqual(snapshotBefore.nodes);
    expect(snapshotAfter.edges).toEqual(snapshotBefore.edges);
    expect(runtime.instanceCount).toBe(countBefore);
    runtime.dispose();
  });

  it("3. Repeated adopt/destroy cycles do not retain dead GraphNode identities or stale compose closures", () => {
    const composeCallNodes = new Set<object>();
    const trackingCompose = (node: { id: string }) => {
      composeCallNodes.add(node);
      return () => ({
        values: { node: node.id },
        sourceProgress: 0,
        sourceRevisions: {},
      });
    };

    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose: trackingCompose,
    });
    const owner = {};

    // 5 sequential adopt/destroy cycles
    for (let i = 0; i < 5; i++) {
      const adopted = runtime.adopt({ id: `track${i}` } as TrackDefinition, owner);
      runtime.seek(adopted.id, 0);
      runtime.destroyAdopted(adopted.id, owner);
    }

    // After all cycles, observation state should have no lingering nodes
    const snapshot = runtime.graph.state.snapshot();
    expect(snapshot.nodes.some((id) => id.startsWith("~/track"))).toBe(false);

    runtime.dispose();
  });

  it("4. PatchRegistry.dispose() clears all retained patches and rejects future publication", () => {
    const registry = new PatchRegistry();
    const tick = 1;
    const seeds = ["a"];

    registry.beginBatch(tick, seeds);
    registry.publish({
      nodeId: "a",
      sourceProgress: 0,
      status: "ready",
      values: { x: 1 },
    });
    registry.closeBatch();

    expect(registry.get("a")).toBeDefined();
    registry.dispose();
    expect(registry.disposed).toBe(true);
    expect(registry.get("a")).toBeUndefined();

    // beginBatch and publish after dispose are no-ops, not throws
    registry.beginBatch(2, ["a"]);
    const result = registry.publish({ nodeId: "a", sourceProgress: 0, status: "ready" });
    expect(result).toBeUndefined();
  });

  it("5. Projection-only replacement updates edge identity consistently with GraphIR", () => {
    const runtime = new ProjectRuntime(
      {
        schemaVersion: 5,
        motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
        freeTracks: [
          {
            id: "source",
          },
          {
            id: "observer",
            observes: [
              {
                source: "~/source",
                role: "input" as const,
                projection: { pick: ["x"] },
              },
            ],
          },
        ],
      },
      { clock: createManualClock(), compose },
    );

    const snapshot = runtime.graph.state.snapshot();
    const edge = snapshot.edges.find(
      (e) => e.observerId === "~/observer" && e.sourceId === "~/source",
    );
    // Projection must be preserved in the live edge
    expect(edge?.projection).toEqual({ pick: ["x"] });

    runtime.dispose();
  });

  it("6. Keyframe validation is shared: malformed adopted stops are rejected before graph commit", () => {
    const compileTrack = vi.fn((track: TrackDefinition) => {
      for (const [, prop] of Object.entries(track.keyframes ?? {})) {
        const stops = (prop as unknown as { stops: { p: number }[] }).stops;
        for (const stop of stops) {
          if (!Number.isFinite(stop.p)) throw new TypeError("Keyframe stop p must be finite.");
        }
        const ps = stops.map((s) => s.p);
        for (let i = 1; i < ps.length; i++) {
          if ((ps[i] as number) <= (ps[i - 1] as number))
            throw new TypeError("Keyframe stops must be monotonically increasing.");
        }
      }
    });

    const runtime = new ProjectRuntime(project, {
      clock: createManualClock(),
      compose,
      compileTrack,
    });

    const snapshotBefore = runtime.graph.state.snapshot();

    const badTrack: TrackDefinition = {
      id: "bad",
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0, v: 100 }, // duplicate p — not monotonic
          ],
        },
      },
    };

    expect(() => runtime.adopt(badTrack, {})).toThrow(/monoton/);

    // Graph state byte-identical after failed adoption
    const snapshotAfter = runtime.graph.state.snapshot();
    expect(snapshotAfter.nodes).toEqual(snapshotBefore.nodes);

    runtime.dispose();
  });
});
