// @ts-nocheck
import { describe, expect, it } from "vitest";
import type { ProjectDefinition, TrackDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime, type ProjectRuntimeOptions } from "../../../src/runtime/project-runtime";

const MOTION_ID = "hero";
const ADDED_ID = "hero/hand";
const BASE_PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: MOTION_ID, trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};
/** Refused by the candidate graph rather than by authored validation, so the rollback runs. */
const REJECTED_TRACK: TrackDefinition = { id: "hand", observes: [{ source: "~/missing" }] };
const compose = (node: { id: string }) => () => ({
  outputs: { values: { node: node.id } },
  sourceProgress: 0,
  sourceRevisions: {},
});

function recorder(): {
  readonly entries: readonly string[];
  readonly options: ProjectRuntimeOptions;
} {
  const entries: string[] = [];
  return {
    entries,
    options: {
      clock: createManualClock(),
      compose,
      compileTrack: (_track, nodeId) => entries.push(`compile ${String(nodeId)}`),
      disposeTrack: (nodeId) => entries.push(`dispose ${nodeId}`),
    },
  };
}

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

describe("a structural change runs one transaction, in one order", () => {
  it("RA-4 disposes the compiled Track and registers nothing when the graph refuses", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    const thrown = thrownBy(() => runtime.addTrack(REJECTED_TRACK, { motionId: MOTION_ID }));

    expect(thrown).toBeInstanceOf(TypeError);
    expect((thrown as Error).message).toMatch(/^observation-unknown-source at /);
    expect(journal.entries).toEqual(["compile hero/hand", "dispose hero/hand"]);
    expect(runtime.instanceCount).toBe(0);
    expect(() => runtime.track(ADDED_ID)).toThrow(/Unknown graph node "hero\/hand"/);

    runtime.dispose();
  });
});
