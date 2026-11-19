import { describe, expect, it } from "vitest";
import { NO_EVENTS, shared, type Events, type Signal, type Time } from "@gerak/core";

const timed = (elapsed: number, progress = elapsed / 1000): Time => ({
  progress,
  clock: { kind: "timed", elapsed, length: 1000 },
});

function counted(): { signal: Signal<number>; calls: () => number } {
  let calls = 0;
  const signal: Signal<number> = (time) => {
    calls += 1;
    return time.progress * 2;
  };
  return { signal, calls: () => calls };
}

describe("shared", () => {
  it("runs once for the same time and the same events list", () => {
    const { signal, calls } = counted();
    const read = shared(signal);
    expect(read(timed(500), NO_EVENTS)).toBe(1);
    expect(read(timed(500), NO_EVENTS)).toBe(1);
    expect(calls()).toBe(1);
  });

  it("runs again for a new time or a new events list", () => {
    const { signal, calls } = counted();
    const read = shared(signal);
    read(timed(500), NO_EVENTS);
    read(timed(600), NO_EVENTS);
    expect(calls()).toBe(2);
    const other: Events = [];
    read(timed(600), other);
    expect(calls()).toBe(3);
    read({ progress: 0.6, clock: { kind: "live", elapsed: 600 } }, other);
    expect(calls()).toBe(4);
  });

  it("gives the values of the plain signal", () => {
    const { signal } = counted();
    const read = shared(signal);
    for (const ms of [0, 250, 250, 900, 100])
      expect(read(timed(ms), NO_EVENTS)).toBe(signal(timed(ms), NO_EVENTS));
  });
});
