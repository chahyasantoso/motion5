import { describe, expect, it } from "vitest";
import { atProgress, liveAt, loop, type Time } from "@gerak/core";

const at = (ms: number, length = 4000): Time => ({
  progress: ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

describe("loop", () => {
  it("runs 0 to 1 inside every period", () => {
    const cycle = loop(1000);
    expect(cycle.of(at(0)).progress).toBe(0);
    expect(cycle.of(at(250)).progress).toBe(0.25);
    expect(cycle.of(at(999)).progress).toBeCloseTo(0.999, 12);
    expect(cycle.of(at(1000)).progress).toBe(0);
    expect(cycle.of(at(2500)).progress).toBe(0.5);
    expect(cycle.of(at(4000)).progress).toBe(0);
  });

  it("gives a timed clock one period long", () => {
    expect(loop(1000).of(at(1250)).clock).toEqual({ kind: "timed", elapsed: 250, length: 1000 });
  });

  it("runs odd cycles backwards with yoyo, turning without a jump", () => {
    const cycle = loop(1000, { yoyo: true });
    expect(cycle.of(at(250)).progress).toBe(0.25);
    expect(cycle.of(at(999)).progress).toBeCloseTo(0.999, 12);
    expect(cycle.of(at(1000)).progress).toBe(1);
    expect(cycle.of(at(1250)).progress).toBe(0.75);
    expect(cycle.of(at(2000)).progress).toBe(0);
    expect(cycle.of(at(3500)).progress).toBe(0.5);
  });

  it("moves a yoyo clock with its progress", () => {
    expect(loop(1000, { yoyo: true }).of(at(1250)).clock).toEqual({
      kind: "timed",
      elapsed: 750,
      length: 1000,
    });
  });

  it("reads a live clock in ms", () => {
    expect(loop(1000).of(liveAt(1250)).progress).toBe(0.25);
  });

  it("throws on an untimed time and on a period that is no stretch", () => {
    expect(() => loop(1000).of(atProgress(0.5))).toThrow(RangeError);
    expect(() => loop(0)).toThrow(RangeError);
    expect(() => loop(-5)).toThrow(RangeError);
    expect(() => loop(Number.NaN)).toThrow(RangeError);
  });
});
