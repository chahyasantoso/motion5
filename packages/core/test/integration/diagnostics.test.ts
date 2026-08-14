import { describe, expect, it } from "vitest";
import type { TrackDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

/**
 * Three independent consumer/source pairs. Each consumer observes a free track that is never
 * seeded, so the observation source never publishes a value and every seek of a consumer
 * produces exactly one fresh `observation-pending-reference` diagnostic (never the same
 * diagnostic twice, since the observer id differs each time). This lets a handful of
 * sequential `seek` calls exercise the ring buffer's eviction without any node ever
 * resolving.
 */
function pendingProject(): {
  readonly schemaVersion: 5;
  readonly motions: readonly {
    id: string;
    trigger: { type: "manual" };
    tracks: readonly never[];
  }[];
  readonly freeTracks: readonly TrackDefinition[];
} {
  return {
    schemaVersion: 5 as const,
    motions: [{ id: "hero", trigger: { type: "manual" as const }, tracks: [] }],
    freeTracks: [
      { id: "source1" },
      { id: "source2" },
      { id: "source3" },
      { id: "consumer1", observes: [{ source: "~/source1" }] },
      { id: "consumer2", observes: [{ source: "~/source2" }] },
      { id: "consumer3", observes: [{ source: "~/source3" }] },
    ],
  };
}
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("P5-03 unified inline diagnostics", () => {
  it("bounds the retained diagnostic history at a fixed capacity and reports a drop count once exceeded", () => {
    const runtime = new ProjectRuntime(pendingProject(), {
      clock: createManualClock(),
      compose,
      diagnosticsCapacity: 2,
    });
    runtime.seek("~/consumer1", 0);
    runtime.seek("~/consumer2", 0);
    runtime.seek("~/consumer3", 0);
    const snapshot = runtime.diagnostics;
    expect(snapshot.entries).toHaveLength(2);
    expect(snapshot.droppedCount).toBe(1);
    expect(snapshot.entries.map((entry) => entry.path)).toEqual(["~/consumer2", "~/consumer3"]);
    runtime.dispose();
  });

  it("still surfaces the same diagnostic inline on the affected patch and the batch summary", () => {
    const runtime = new ProjectRuntime(pendingProject(), { clock: createManualClock(), compose });
    const batch = runtime.seek("~/consumer1", 0);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "~/consumer1");
    expect(patch?.diagnostics).toHaveLength(1);
    expect(patch?.diagnostics[0]?.ruleId).toBe("observation-pending-reference");
    expect(batch.diagnostics).toHaveLength(1);
    expect(runtime.diagnostics.entries).toHaveLength(1);
    expect(runtime.diagnostics.entries[0]).toEqual(patch?.diagnostics[0]);
    runtime.dispose();
  });

  it("uses the one shared Diagnostic shape for every retained entry, load-time or runtime", () => {
    const runtime = new ProjectRuntime(pendingProject(), { clock: createManualClock(), compose });
    runtime.seek("~/consumer1", 0);
    const [entry] = runtime.diagnostics.entries;
    expect(entry).toBeDefined();
    expect(Object.keys(entry!).sort()).toEqual(
      ["ids", "message", "path", "ruleId", "severity"].sort(),
    );
    expect(typeof entry!.ruleId).toBe("string");
    expect(typeof entry!.path).toBe("string");
    expect(typeof entry!.message).toBe("string");
    expect(typeof entry!.severity).toBe("string");
    runtime.dispose();
  });

  it("exposes diagnostics as one bounded read-only snapshot, never a second subscribe/emit surface", () => {
    const runtime = new ProjectRuntime(pendingProject(), { clock: createManualClock(), compose });
    const snapshot = runtime.diagnostics;
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.entries)).toBe(true);
    const runtimeAsRecord = runtime as unknown as Record<string, unknown>;
    expect(runtimeAsRecord["onDiagnostic"]).toBeUndefined();
    expect(runtimeAsRecord["subscribeDiagnostics"]).toBeUndefined();
    expect(runtimeAsRecord["diagnosticsEmitter"]).toBeUndefined();
    runtime.dispose();
  });
});
