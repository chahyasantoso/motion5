import { describe, expect, it } from "vitest";
import { inputs } from "@gerak/core";
import { liveClock, type FrameSource } from "@gerak/dom";

function frames(): FrameSource & { run(): void; readonly waiting: number } {
  let queued = new Map<number, (time: number) => void>();
  let next = 1;
  return {
    requestFrame(listener) {
      queued.set(next, listener);
      return next++;
    },
    cancelFrame(handle) {
      queued.delete(handle);
    },
    run() {
      const due = queued;
      queued = new Map();
      for (const listener of due.values()) listener(0);
    },
    get waiting() {
      return queued.size;
    },
  };
}

describe("liveClock", () => {
  it("runs from creation, records typed set/trigger inputs, and dedups unchanged values", () => {
    let ms = 1000;
    const source = frames();
    const clock = liveClock({ frames: source, now: () => ms, settleMs: 500 });
    expect(clock.now()).toEqual({ progress: 0, clock: { kind: "live", elapsed: 0 } });
    expect(source.waiting).toBe(0);

    const contract = inputs({ values: { level: {} }, triggers: { ping: { targets: ["card"] } } });
    ms = 1200;
    clock.set(contract, "level", 5);
    expect(source.waiting).toBe(1);
    clock.set(contract, "level", 5);
    ms = 1300;
    clock.trigger(contract, "ping", 1, "card");
    expect(clock.input()).toEqual([
      { kind: "value", name: "level", at: 200, value: 5 },
      { kind: "trigger", name: "ping", at: 300, value: 1, target: "card" },
    ]);
    clock.dispose();
    expect(source.waiting).toBe(0);
  });

  it("keeps asking for frames for settleMs after the latest input, stops, and wakes on later input", () => {
    let ms = 0;
    const source = frames();
    const clock = liveClock({ frames: source, now: () => ms, settleMs: 500 });
    const contract = inputs({ triggers: { go: {} } });
    let steps = 0;
    clock.subscribe(() => {
      steps += 1;
    });

    expect(source.waiting).toBe(0);
    clock.trigger(contract, "go");
    expect(steps).toBe(0);
    expect(source.waiting).toBe(1);

    ms = 400;
    source.run();
    expect(steps).toBe(1);
    expect(source.waiting).toBe(1);

    ms = 600;
    source.run();
    expect(steps).toBe(2);
    expect(source.waiting).toBe(0);

    ms = 1000;
    clock.trigger(contract, "go");
    expect(source.waiting).toBe(1);
    ms = 1100;
    source.run();
    expect(steps).toBe(3);
    expect(source.waiting).toBe(1);

    ms = 1600;
    source.run();
    expect(steps).toBe(4);
    expect(source.waiting).toBe(0);
    clock.dispose();
  });

  it("runs frames for introMs after start and sizes its log window to max(settleMs, 4000)", () => {
    let ms = 0;
    const source = frames();
    const clock = liveClock({ frames: source, now: () => ms, introMs: 800, settleMs: 6000 });
    expect(source.waiting).toBe(1);
    ms = 500;
    source.run();
    expect(source.waiting).toBe(1);
    ms = 900;
    source.run();
    expect(source.waiting).toBe(0);

    const contract = inputs({ values: { level: {} } });
    for (let t = 1000; t <= 20_000; t += 100) {
      ms = t;
      clock.set(contract, "level", t);
    }
    const kept = clock.input().map((entry) => entry.at);
    expect(kept[0]).toBeGreaterThanOrEqual(20_000 - 12_000);
    expect(kept.includes(14_000)).toBe(true);
    clock.dispose();
  });
});
