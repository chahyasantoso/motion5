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

describe("lanes order and spacing", () => {
  const starts = (of: ReturnType<typeof lanes>) => of.starts.map((start) => start / of.stagger);

  it("starts from the first lane by default, as before", () => {
    expect(starts(lanes([1, 1, 1, 1, 1], 0.25))).toEqual([0, 1, 2, 3, 4]);
    expect(lanes([1, 1, 1, 1, 1], 0.25, { from: "start" })).toEqual(lanes([1, 1, 1, 1, 1], 0.25));
  });

  it("ranks lanes from the end, the centre or the edges", () => {
    expect(starts(lanes([1, 1, 1, 1, 1], 0.25, { from: "end" }))).toEqual([4, 3, 2, 1, 0]);
    expect(starts(lanes([1, 1, 1, 1, 1], 0.25, { from: "center" }))).toEqual([2, 1, 0, 1, 2]);
    expect(starts(lanes([1, 1, 1, 1, 1], 0.25, { from: "edges" }))).toEqual([0, 1, 2, 1, 0]);
    expect(starts(lanes([1, 1, 1, 1], 0.25, { from: "center" }))).toEqual([1, 0, 0, 1]);
  });

  it("starts the centre lane first, its neighbours together, and finishes every lane at 1", () => {
    const five = lanes([1, 1, 1, 1, 1], 0.25, { from: "center" });
    expect(laneTime(0.1, 2, five).progress).toBeGreaterThan(0);
    expect(laneTime(0.1, 1, five).progress).toBe(0);
    expect(laneTime(0.3, 1, five).progress).toBe(laneTime(0.3, 3, five).progress);
    for (const index of [0, 1, 2, 3, 4]) expect(laneTime(1, index, five).progress).toBe(1);
  });

  it("shuffles by a seed, the same way every time", () => {
    const shuffled = starts(lanes([1, 1, 1, 1, 1, 1], 0.25, { from: { seed: 3 } }));
    expect([...shuffled].sort()).toEqual([0, 1, 2, 3, 4, 5]);
    expect(starts(lanes([1, 1, 1, 1, 1, 1], 0.25, { from: { seed: 3 } }))).toEqual(shuffled);
    expect(starts(lanes([1, 1, 1, 1, 1, 1], 0.25, { from: { seed: 4 } }))).not.toEqual(shuffled);
  });

  it("bends the start times by a spacing ease, keeping the first and last", () => {
    const even = starts(lanes([1, 1, 1, 1, 1], 0.25));
    const bent = starts(lanes([1, 1, 1, 1, 1], 0.25, { spacing: (u) => u * u }));
    expect(bent[0]).toBe(0);
    expect(bent[4]).toBe(4);
    for (const index of [1, 2, 3]) expect(bent[index]).toBeLessThan(even[index] ?? 0);
  });
});
