import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import type { TrackDefinition } from "../../src/contract/v5";

function ramp(from: number, to: number) {
  return { stops: [{ p: 0, v: from }, { p: 1, v: to }] };
}
function track(id: string, from: number, to: number): TrackDefinition {
  return { id, keyframes: { x: ramp(from, to) } };
}

describe("motion-owned Track replacement", () => {
  it("keeps the Motion attached to the replacement Track", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load({
      schemaVersion: 5,
      motions: [{ id: "scene", trigger: { type: "manual" }, tracks: [track("arm", 0, 100)] }],
    });

    handle.mount("scene/arm");
    handle.signal("scene", { type: "manual", progress: 0.5 });
    scheduler.flush();
    handle.track("scene/arm").replace(track("arm", 0, 250));

    // Before the fix, Motion still holds the disposed pre-replacement Track.
    expect(() => {
      handle.signal("scene", { type: "manual", progress: 0.5 });
      scheduler.flush();
    }).not.toThrow();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 125 });

    handle.dispose();
  });
});
