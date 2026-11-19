import { describe, expect, it } from "vitest";
import { motion, span, type Time } from "@gerak/core";

const at = (ms: number, length = 4000): Time => ({
  progress: ms / length,
  clock: { kind: "timed", elapsed: ms, length },
});

const progressOf = motion((time: Time) => time.progress);

describe("motion", () => {
  it("runs the progress inside a span through the ease given to in", () => {
    const eased = progressOf.in(span(0, 1000), (progress) => progress * progress);
    expect(eased(at(500, 1000))).toBe(0.25);
    expect(progressOf.in(span(0, 1000))(at(500, 1000))).toBe(0.5);
  });

  it("answers what the function answers, with the context passed along", () => {
    const echo = motion((time: Time, context?: string) => `${time.progress}:${context}`);
    expect(echo(at(1000), "ctx")).toBe("0.25:ctx");
    expect(echo.span).toBeUndefined();
    expect(echo.period).toBeUndefined();
    expect(echo.joins).toBe("layer");
  });

  it("holds the start before its span, maps during it and holds the end after it", () => {
    const inside = progressOf.in(span(1000, 2000));
    expect(inside(at(0))).toBe(0);
    expect(inside(at(1000))).toBe(0);
    expect(inside(at(1500))).toBe(0.5);
    expect(inside(at(2000))).toBe(1);
    expect(inside(at(3500))).toBe(1);
    expect(inside.span?.from).toBe(1000);
  });

  it("repeats every period with loop", () => {
    const cycle = progressOf.loop(1000);
    expect(cycle(at(250))).toBe(0.25);
    expect(cycle(at(1250))).toBe(0.25);
    expect(cycle.period).toBe(1000);
  });

  it("applies the loop before the span", () => {
    const both = motion((time: Time) => time.progress)
      .loop(1000)
      .in(span(500, 1000));
    expect(both(at(250))).toBe(0);
    expect(both(at(750))).toBe(0.5);
    expect(both(at(1750))).toBe(0.5);
  });

  it("sets joins with take and returns new motions each time", () => {
    const taken = progressOf.take();
    expect(taken.joins).toBe("take");
    expect(progressOf.joins).toBe("layer");
    expect(taken.in(span(0, 1000)).joins).toBe("take");
    expect(taken.in(span(0, 1000))).not.toBe(taken);
  });

  it("refuses what is not a span or a period", () => {
    expect(() => progressOf.loop(0)).toThrow(RangeError);
    expect(() => progressOf.loop(Number.NaN)).toThrow(RangeError);
    // @ts-expect-error a span is made by `span`
    expect(() => progressOf.in({ from: 0 })).toThrow(RangeError);
  });

  it("marks a motion ambient with ambient(), keeping its time, and keeps the mark through in, loop and take", () => {
    expect(progressOf.isAmbient).toBe(false);
    const alive = progressOf.ambient();
    expect(alive.isAmbient).toBe(true);
    expect(alive(at(1000))).toBe(0.25);
    expect(progressOf.isAmbient).toBe(false);
    expect(alive.in(span(0, 1000)).isAmbient).toBe(true);
    expect(alive.loop(500).isAmbient).toBe(true);
    expect(alive.take().isAmbient).toBe(true);
    expect(progressOf.loop(500).isAmbient).toBe(false);
  });
});
