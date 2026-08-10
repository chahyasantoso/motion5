import { describe, expect, it } from "vitest";

import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator } from "../../src/ports/fakes";
import { createFakeScheduler } from "../../src/ports/fakes";

describe("Clock port contract", () => {
  it("emits monotonic ticks and accumulated time", () => {
    const clock = createManualClock();
    const events: Array<{ tick: number; time: number; delta: number }> = [];
    clock.subscribe((event) => events.push(event));

    clock.tick(0.25);
    clock.tick(0.5);

    expect(events).toEqual([
      { tick: 1, time: 0.25, delta: 0.25 },
      { tick: 2, time: 0.75, delta: 0.5 },
    ]);
  });

  it("unsubscribes and rejects invalid deltas", () => {
    const clock = createManualClock();
    let calls = 0;
    const unsubscribe = clock.subscribe(() => calls++);
    unsubscribe();
    clock.tick();
    expect(calls).toBe(0);
    expect(() => clock.tick(-1)).toThrow(TypeError);
  });
});

describe("Interpolator port contract", () => {
  it("creates a controllable timeline and kills it", () => {
    const timeline = createFakeInterpolator().create({ duration: 2 });
    expect(timeline.duration).toBe(2);
    timeline.progress(0.4);
    expect(timeline.progress()).toBe(0.4);
    timeline.kill();
    expect(() => timeline.progress(0.5)).toThrow("killed");
  });
});

describe("Scheduler port contract", () => {
  it("runs pending jobs and supports cancellation", () => {
    const scheduler = createFakeScheduler();
    const calls: string[] = [];
    scheduler.schedule(() => calls.push("cancelled")).cancel();
    scheduler.schedule(() => calls.push("kept"));
    scheduler.flush();
    expect(calls).toEqual(["kept"]);
  });
});
