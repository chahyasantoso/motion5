import { describe, expect, it } from "vitest";
import { laneTime, lanes } from "@motion5/moves";

describe("lanes", () => {
  it("spans to the last finish", () => {
    expect(lanes([1, 1, 1], 0.25).span).toBe(1.5);
    expect(lanes([1, 1, 1], 1).span).toBe(3);
    expect(lanes([2, 1], 0.5).span).toBe(2);
    expect(lanes([1, 1], 0).span).toBe(1);
  });
});

describe("laneTime", () => {
  const three = lanes([1, 1, 1], 0.25);

  it("finishes every lane when the position reaches 1", () => {
    for (const index of [0, 1, 2]) expect(laneTime(1, index, three).progress).toBe(1);
  });

  it("starts each lane one stagger after the last", () => {
    // Three lanes at 0.25 span 1.5, so at position 1/6 the first has run a quarter and the second starts.
    expect(laneTime(1 / 6, 0, three).progress).toBeCloseTo(0.25, 12);
    expect(laneTime(1 / 6, 1, three).progress).toBeCloseTo(0, 12);
    expect(laneTime(1 / 6, 2, three).progress).toBe(0);
  });

  it("keeps every lane on the position under no stagger, whatever its length", () => {
    const flat = lanes([1, 0.5], 0);
    expect(laneTime(0.4, 0, flat).progress).toBe(0.4);
    expect(laneTime(0.4, 1, flat).progress).toBe(0.4);
  });

  it("is untimed without a duration", () => {
    expect(laneTime(0.5, 0, three).clock).toEqual({ kind: "untimed" });
  });

  it("gives each lane the milliseconds of its own window", () => {
    // A 1000 ms Motion over a span of 1.5 gives each lane 1000 / 1.5 ms.
    const length = 1000 / 1.5;
    expect(laneTime(1 / 6, 0, three, 1000).clock).toEqual({
      kind: "timed",
      elapsed: expect.closeTo(length * 0.25, 9),
      length: expect.closeTo(length, 9),
    });
    expect(laneTime(1 / 6, 2, three, 1000).clock).toEqual({
      kind: "timed",
      elapsed: 0,
      length: expect.closeTo(length, 9),
    });
    expect(laneTime(1, 2, three, 1000).clock).toEqual({
      kind: "timed",
      elapsed: expect.closeTo(length, 9),
      length: expect.closeTo(length, 9),
    });
  });

  it("gives every lane the whole duration under no stagger", () => {
    expect(laneTime(0.5, 1, lanes([1, 1], 0), 800).clock).toEqual({
      kind: "timed",
      elapsed: 400,
      length: 800,
    });
  });
});
