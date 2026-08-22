import { describe, expect, it } from "vitest";

import { createManualClock } from "../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTriggerPort,
} from "../../src/testing/fakes";
import { assertTriggerPort, createManualTriggerPort } from "../../src/ports/trigger";

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
  it("exposes deterministic adapter-owned state for authored stops", () => {
    const timeline = createFakeInterpolator().create({
      duration: 2,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 10 },
            { p: 1, v: 30 },
          ],
        },
      },
    });
    expect(timeline.state).toEqual({ x: 10 });
    timeline.progress(0.5);
    expect(timeline.state).toEqual({ x: 20 });
    timeline.progress(1);
    expect(timeline.state).toEqual({ x: 30 });
  });

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

describe("TriggerPort contract", () => {
  it("subscribes, emits progress, and unsubscribes cleanly", () => {
    const trigger = createManualTriggerPort();
    const progressValues: number[] = [];
    const unsubscribe = trigger.subscribe((p) => progressValues.push(p));

    trigger.emit(0.25);
    trigger.emit(0.75);
    expect(progressValues).toEqual([0.25, 0.75]);

    unsubscribe();
    trigger.emit(1);
    expect(progressValues).toEqual([0.25, 0.75]);
    trigger.dispose();
  });

  it("fake trigger port tracks subscriber count", () => {
    const fake = createFakeTriggerPort();
    expect(fake.subscriberCount).toBe(0);
    const un1 = fake.subscribe(() => undefined);
    const un2 = fake.subscribe(() => undefined);
    expect(fake.subscriberCount).toBe(2);
    un1();
    expect(fake.subscriberCount).toBe(1);
    un2();
    expect(fake.subscriberCount).toBe(0);
    fake.dispose();
  });
});
