import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type {
  ObservationDefinition,
  ProjectDefinition,
  TrackDefinition,
} from "../../src/contract/v5";

const TARGET_INPUT = {
  source: "hero/root",
  role: "input",
  target: "x",
} as unknown as ObservationDefinition;

const TARGET_OUTPUT = {
  source: "hero/root",
  role: "output",
  target: "x",
} as unknown as ObservationDefinition;

const ROLE_INPUT = { source: "hero/root", role: "input" } as unknown as ObservationDefinition;
const ROLE_OUTPUT = { source: "hero/root", role: "output" } as unknown as ObservationDefinition;
const PROJECTED = {
  source: "hero/root",
  projection: { pick: ["x"] },
} as unknown as ObservationDefinition;

function track(id: string, observes?: TrackDefinition["observes"]): TrackDefinition {
  return {
    id,
    keyframes: {
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 1 },
      ],
    },
    ...(observes ? { observes } : {}),
  };
}
function makeHandle(project: ProjectDefinition) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(project);
}
function project(
  freeTracks: readonly TrackDefinition[] = [],
  tracks: readonly TrackDefinition[] = [track("root"), track("child")],
): ProjectDefinition {
  return {
    schemaVersion: 5,
    motions: [{ id: "hero", trigger: { type: "manual" }, tracks }],
    ...(freeTracks.length ? { freeTracks } : {}),
  };
}

describe("observation identity", () => {
  it("covers source spelling across an add and its matching remove", () => {
    // One authored field is left, so identity is source spelling and nothing else: a local
    // spelling and its qualified form name the same edge.
    const handle = makeHandle(project());
    const child = handle.track("hero/child");
    child.addObserve({ source: "root" });
    expect(handle.dependantsOf("hero/root")).toEqual(["hero/child"]);
    child.removeObserve({ source: "hero/root" });
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });
  it("deduplicates equivalent observations and preserves no-op sequence", () => {
    const handle = makeHandle(project());
    const child = handle.track("hero/child");
    child.addObserve({ source: "root" });
    const sequence = (handle as unknown as { _runtime: { graph: { sequence: number } } })._runtime
      .graph.sequence;
    expect(() => child.addObserve({ source: "hero/root" })).not.toThrow();
    expect(
      (handle as unknown as { _runtime: { graph: { sequence: number } } })._runtime.graph.sequence,
    ).toBe(sequence);
    expect(() => child.removeObserve({ source: "root" })).not.toThrow();
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });
  it("rejects an invalid free-track observation with stable diagnostics", () => {
    const handle = makeHandle(project([track("free")]));
    const free = handle.track("~/free");
    expect(() => free.addObserve({ source: "arm" })).toThrow(/observation-source/);
    handle.dispose();
  });
  it("V-7 refuses an authored target through addObserve on either role", () => {
    const handle = makeHandle(project());
    const child = handle.track("hero/child");
    expect(() => child.addObserve(TARGET_INPUT)).toThrow(/observation-target-unsupported/);
    expect(() => child.addObserve(TARGET_OUTPUT)).toThrow(/observation-target-unsupported/);
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });
  it("J-7 refuses an authored role or projection through addObserve", () => {
    const handle = makeHandle(project());
    const child = handle.track("hero/child");
    expect(() => child.addObserve(ROLE_INPUT)).toThrow(/observation-role-unsupported/);
    expect(() => child.addObserve(ROLE_OUTPUT)).toThrow(/observation-role-unsupported/);
    expect(() => child.addObserve(PROJECTED)).toThrow(/observation-projection-unsupported/);
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    // The one authored form that is left still works, and still removes.
    child.addObserve({ source: "root" });
    expect(handle.dependantsOf("hero/root")).toEqual(["hero/child"]);
    child.removeObserve({ source: "root" });
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });
});
