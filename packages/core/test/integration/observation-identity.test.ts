import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { ProjectDefinition, TrackDefinition } from "../../src/contract/v5";

function track(id: string): TrackDefinition {
  return { id, keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 1 }] } } };
}
function makeHandle(project: ProjectDefinition) {
  return new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
  }).load(project);
}

describe("observation identity", () => {
  it("removes a logically identical observation when property order changes", () => {
    const handle = makeHandle({
      schemaVersion: 5,
      motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [track("root"), track("child")] }],
    });
    const child = handle.track("hero/child");
    child.addObserve({ source: "hero/root", role: "input" });
    expect(handle.dependantsOf("hero/root")).toEqual(["hero/child"]);
    child.removeObserve({ role: "input", source: "hero/root" });
    expect(handle.dependantsOf("hero/root")).toEqual([]);
    handle.dispose();
  });

  it("deduplicates equivalent observations instead of throwing", () => {
    const handle = makeHandle({
      schemaVersion: 5,
      motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [track("root"), track("child")] }],
    });
    const child = handle.track("hero/child");
    child.addObserve({ source: "root" });
    expect(() => child.addObserve({ role: "output", source: "root" })).not.toThrow();
    expect(handle.dependantsOf("hero/root")).toEqual(["hero/child"]);
    handle.dispose();
  });
});
