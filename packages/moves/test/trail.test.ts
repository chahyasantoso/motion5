import { describe, expect, it } from "vitest";
import { atProgress, elapsedOf, liveAt, spring, trail, type Time } from "@motion5/moves";

const ms = (time: Time) => elapsedOf(time.clock) ?? 0;
const step = (time: Time) => (ms(time) < 500 ? 0 : 1);
const peak = (damping: number) => {
  const tail = trail(step, { stiffness: 170, damping });
  return Math.max(...Array.from({ length: 150 }, (_, i) => tail(liveAt(500 + i * 10), [])));
};

describe("trail", () => {
  it("sits on a signal that never moves", () => {
    const still = trail(() => 7, {});
    expect(still(liveAt(0), [])).toBe(7);
    expect(still(liveAt(2500), [])).toBeCloseTo(7, 12);
  });

  it("lags a step, overshooting it only when under-damped", () => {
    const tail = trail(step, { stiffness: 170, damping: 26 });
    expect(tail(liveAt(510), [])).toBeGreaterThan(0);
    expect(tail(liveAt(510), [])).toBeLessThan(0.5);
    expect(tail(liveAt(3000), [])).toBeCloseTo(1, 3);
    expect(peak(8)).toBeGreaterThan(1.2);
    expect(peak(40)).toBeLessThanOrEqual(1);
  });

  it("gives the same value whatever order frames are asked in", () => {
    const tail = trail(step, { damping: 10 });
    const late = tail(liveAt(900), []);
    const early = tail(liveAt(300), []);
    const fresh = trail(step, { damping: 10 });
    expect(fresh(liveAt(300), [])).toBe(early);
    expect(fresh(liveAt(900), [])).toBe(late);
  });

  it("costs the same at an hour as at ten seconds, and stays within rest of a full run", () => {
    const wave = (time: Time) => Math.sin(ms(time) / 300);
    let calls = 0;
    const counted = (time: Time) => {
      calls += 1;
      return wave(time);
    };
    const options = { stiffness: 170, damping: 12, stepMs: 8 };
    const tail = trail(counted, options);
    tail(liveAt(10_000), []);
    const atTen = calls;
    calls = 0;
    const hour = 3_600_000;
    const windowed = tail(liveAt(hour), []);
    expect(Math.abs(calls - atTen)).toBeLessThanOrEqual(1);

    let value = wave(liveAt(0));
    let speed = 0;
    for (let t = 0; t < hour; t += 8) {
      const goal = wave(liveAt(t));
      const moved = spring(value - goal, speed, Math.min(8, hour - t) / 1000, options);
      value = goal + moved.offset;
      speed = moved.speed;
    }
    expect(Math.abs(windowed - value)).toBeLessThan(0.001 * 2);
  });

  it("is the signal itself with no clock", () => {
    expect(trail(() => 3, {})(atProgress(0.5), [])).toBe(3);
  });

  it("refuses a spring too slow to forget its past within four seconds", () => {
    expect(() => trail(step, { stiffness: 170, damping: 1 })).toThrow(RangeError);
    expect(() => trail(step, { stepMs: 50 })).toThrow(RangeError);
  });
});
