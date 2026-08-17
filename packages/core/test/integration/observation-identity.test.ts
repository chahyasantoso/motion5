import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";

function track(id: string, observes?: TrackDefinition["observes"]): TrackDefinition {
  return {
    id,
    keyframes: {
      x: {
        stops: [
          { p: 0, v: 0 },
          { p: 1, v: 1 },
        ],
      },
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
  it("covers property order, default role, source spelling, and projection map order", () => {
    const handle = makeHandle(project());
    const child = handle.track("hero/child");
    child.addObserve({ source: "root", role: "input", target: "x" });
    child.removeObserve({ source: "hero/root", role: "input", target: "x" });
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    child.addObserve({
      source: "hero/root",
      role: "input",
      projection: { map: { a: "x", b: "y" } },
    });
    child.removeObserve({
      role: "input",
      source: "hero/root",
      projection: { map: { b: "y", a: "x" } },
    });
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });
  it("deduplicates equivalent observations and preserves no-op sequence", () => {
    const handle = makeHandle(project());
    const child = handle.track("hero/child");
    child.addObserve({ source: "root" });
    const sequence = (handle as unknown as { _runtime: { graph: { sequence: number } } })._runtime
      .graph.sequence;
    expect(() => child.addObserve({ role: "output", source: "root" })).not.toThrow();
    expect(
      (handle as unknown as { _runtime: { graph: { sequence: number } } })._runtime.graph.sequence,
    ).toBe(sequence);
    expect(() => child.removeObserve({ source: "root", role: "output" })).not.toThrow();
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });
  it("rejects invalid free-track and output-target observations with stable diagnostics", () => {
    const handle = makeHandle(project([track("free")]));
    const free = handle.track("~/free");
    expect(() => free.addObserve({ source: "arm" })).toThrow(/observation-source/);
    const child = handle.track("hero/child");
    expect(() => child.addObserve({ source: "hero/root", role: "output", target: "x" })).toThrow(
      /observation-output-target/,
    );
    handle.dispose();
  });
});
