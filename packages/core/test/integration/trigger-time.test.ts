import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

function track(id: string) {
  return { id, keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } } };
}

describe("time trigger integration T2", () => {
  it("drives a time Motion from the project clock without double advancing", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load({
      schemaVersion: 5,
      motions: [{ id: "timeMotion", trigger: { type: "time", duration: 1000 }, tracks: [track("arm")] }],
    });
    handle.mount("timeMotion/arm");
    clock.tick(1000);
    scheduler.flush();
    expect(handle.get("timeMotion/arm")?.values).toEqual({ x: 100 });
    expect(() => handle.signal("timeMotion", { type: "time", progress: 0.5 })).toThrow(
      "Motion has a configured trigger driver and does not accept external signals.",
    );
    handle.dispose();
  });

  it("keeps exactly one project clock subscription for multiple Motions", () => {
    let subscriptions = 0;
    const base = createManualClock();
    const clock = { subscribe(listener: Parameters<typeof base.subscribe>[0]) { subscriptions += 1; return base.subscribe(listener); } };
    const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler: createFakeScheduler() }).load({
      schemaVersion: 5,
      motions: [
        { id: "timeA", trigger: { type: "time", duration: 1000 }, tracks: [] },
        { id: "timeB", trigger: { type: "time", duration: 1000 }, tracks: [] },
        { id: "manual", trigger: { type: "manual" }, tracks: [] },
      ],
    });
    expect(subscriptions).toBe(1);
    handle.dispose();
    base.dispose();
  });
});
