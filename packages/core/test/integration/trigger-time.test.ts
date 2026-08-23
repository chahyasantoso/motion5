import { describe, expect, it } from "vitest";
import { Engine } from "../../src/engine";
import { createDefaultTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTriggerPort,
} from "../../src/testing/fakes";
import type { TriggerFactory } from "../../src/ports/trigger-factory";

function track(id: string) {
  return {
    id,
    keyframes: {
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 100 },
      ],
    },
  };
}
function loadTimeMotion() {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load({
    schemaVersion: 5,
    motions: [
      { id: "timeMotion", trigger: { type: "time", duration: 1000 }, tracks: [track("arm")] },
    ],
  });
  handle.mount("timeMotion/arm");
  return { clock, scheduler, handle };
}
describe("time trigger integration T2", () => {
  it("drives a time Motion once per project-clock tick", () => {
    const { clock, scheduler, handle } = loadTimeMotion();
    const seen: unknown[] = [];
    handle.subscribe("timeMotion/arm", (patch) => seen.push(patch.values));
    seen.length = 0;
    clock.tick(250);
    scheduler.flush();
    expect(handle.get("timeMotion/arm")?.values).toEqual({ x: 25 });
    clock.tick(750);
    scheduler.flush();
    expect(handle.get("timeMotion/arm")?.values).toEqual({ x: 100 });
    // GraphRuntime flushes once before the scheduler applies the driver's progress,
    // so the initial x=0 publication is expected. The meaningful assertion is that
    // each driver tick produces exactly one non-zero progress application.
    expect(seen.filter((values) => (values as { x?: unknown }).x !== 0)).toEqual([
      { x: 25 },
      { x: 100 },
    ]);
    handle.dispose();
  });
  it("does not emit before the first tick", () => {
    const { scheduler, handle } = loadTimeMotion();
    scheduler.flush();
    expect(handle.get("timeMotion/arm")?.values).toBeUndefined();
    expect(scheduler.pending).toHaveLength(0);
    handle.dispose();
  });
  it("rejects external signals without changing progress", () => {
    const { scheduler, handle } = loadTimeMotion();
    const before = handle.get("timeMotion/arm")?.values;
    expect(() => handle.signal("timeMotion", { type: "time", progress: 0.5 })).toThrow(TypeError);
    expect(() => handle.signal("timeMotion", { type: "time", progress: 0.5 })).toThrow(
      "Motion has a configured trigger driver and does not accept external signals.",
    );
    scheduler.flush();
    expect(handle.get("timeMotion/arm")?.values).toEqual(before);
    expect(scheduler.pending).toHaveLength(0);
    handle.dispose();
  });
  it("coalesces rapid driver ticks to the latest progress", () => {
    const { clock, scheduler, handle } = loadTimeMotion();
    for (let index = 0; index < 100; index += 1) clock.tick(1);
    expect(scheduler.pending).toHaveLength(1);
    scheduler.flush();
    expect(handle.get("timeMotion/arm")?.values).toEqual({ x: 10 });
    handle.dispose();
  });
  it("keeps exactly one project clock subscription for multiple Motions", () => {
    let subscriptions = 0;
    const base = createManualClock();
    const clock = {
      subscribe(listener: Parameters<typeof base.subscribe>[0]) {
        subscriptions += 1;
        return base.subscribe(listener);
      },
    };
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load({
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
  it("keeps manual signals working and preserves range validation", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const handle = new Engine({ clock, interpolator: createFakeInterpolator(), scheduler }).load({
      schemaVersion: 5,
      motions: [{ id: "manualMotion", trigger: { type: "manual" }, tracks: [track("arm")] }],
    });
    handle.mount("manualMotion/arm");
    expect(() => handle.signal("manualMotion", { type: "manual", progress: 1.5 })).toThrow(
      RangeError,
    );
    handle.signal("manualMotion", { type: "manual", progress: 0.5 });
    scheduler.flush();
    expect(handle.get("manualMotion/arm")?.values).toEqual({ x: 50 });
    handle.dispose();
  });
  it("isolates a throwing clock consumer while preserving other Motion progress", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const defaultFactory = createDefaultTriggerFactory();
    const factory: TriggerFactory = {
      create(context) {
        if (context.motionId !== "boom") return defaultFactory.create(context);
        const port = createFakeTriggerPort();
        return {
          port,
          acceptsExternalSignal: false,
          clockBinding: {
            kind: "driver",
            onTick: () => {
              throw new Error("driver boom");
            },
          },
          dispose: () => port.dispose(),
        };
      },
    };
    const handle = new Engine({
      clock,
      scheduler,
      interpolator: createFakeInterpolator(),
      triggerFactory: factory,
    }).load({
      schemaVersion: 5,
      motions: [
        { id: "boom", trigger: { type: "time", duration: 1000 }, tracks: [] },
        { id: "good", trigger: { type: "time", duration: 1000 }, tracks: [track("arm")] },
      ],
    });
    handle.mount("good/arm");
    expect(() => clock.tick(250)).not.toThrow();
    scheduler.flush();
    expect(handle.get("good/arm")?.values).toEqual({ x: 25 });
    handle.dispose();
  });
});
