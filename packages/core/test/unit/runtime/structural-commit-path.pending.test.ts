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

function disagreeing(runtime: ProjectRuntime): readonly string[] {
  return runtime.graph.graph.nodes
    .filter((node) => runtime.track(node.id).definition !== node.track)
    .map((node) => node.id);
}

describe("a structural change runs one transaction, in one order", () => {
  it("RA-7 leaves the retained definitions and the committed graph agreeing", () => {
    const journal = recorder();
    const runtime = new ProjectRuntime(BASE_PROJECT, journal.options);

    expect(disagreeing(runtime)).toEqual([]);

    runtime.addTrack({ id: "hand" }, { motionId: MOTION_ID });
    expect(disagreeing(runtime)).toEqual([]);

    runtime.track(ADDED_ID).replace({ id: "hand", duration: 250 });
    expect(disagreeing(runtime)).toEqual([]);

    // A refused candidate has to leave the pair agreeing too, which is the half a commit path that
    // writes its maps before the graph accepted would get wrong.
    thrownBy(() => runtime.track(ADDED_ID).replace(REJECTED_TRACK));
    expect(disagreeing(runtime)).toEqual([]);
    expect(runtime.track(ADDED_ID).definition).toEqual({ id: "hand", duration: 250 });

    runtime.track(ADDED_ID).remove();
    expect(disagreeing(runtime)).toEqual([]);

    runtime.dispose();
  });

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
