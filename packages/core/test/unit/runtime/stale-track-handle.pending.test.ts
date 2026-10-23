// @ts-nocheck
import { describe, expect, it } from "vitest";
import type { ObservationDefinition, ProjectDefinition } from "../../../src/contract/v5";
import type { TrackHandle } from "../../../src/contract/track-handle";
import { createManualClock } from "../../../src/ports/clock";
import { ProjectRuntime } from "../../../src/runtime/project-runtime";

const NODE_ID = "hero/arm";
const OTHER_ID = "hero/leg";
const PROJECT: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }, { id: "leg" }] }],
};
const compose = (node: { id: string }) => () => ({
  outputs: { values: { node: node.id } },
  sourceProgress: 0,
  sourceRevisions: {},
});

function runtime(): ProjectRuntime {
  return new ProjectRuntime(PROJECT, { clock: createManualClock(), compose });
}
function handleFor(project: ProjectRuntime, id: string = NODE_ID): TrackHandle {
  return project.track(id);
}

describe("a stale TrackHandle refuses uniformly, and `live` asks without throwing", () => {
  it("SH-6 leaves the live path exactly as it was", () => {
    const project = runtime();
    const handle = handleFor(project);
    expect(handle.definition).toEqual({ id: "arm" });

    handle.replace({ id: "arm", duration: 250 });
    expect(handle.definition).toEqual({ id: "arm", duration: 250 });

    const observation: ObservationDefinition = { source: OTHER_ID };
    handle.addObserve(observation);
    expect(project.dependantsOf(OTHER_ID)).toEqual([NODE_ID]);
    handle.removeObserve(observation);
    expect(project.dependantsOf(OTHER_ID)).toEqual([]);

    handle.remove();
    expect(project.dependantsOf(OTHER_ID)).toEqual([]);

    project.dispose();
  });
});
