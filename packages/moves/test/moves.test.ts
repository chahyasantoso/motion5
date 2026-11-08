import { describe, expect, it } from "vitest";
import { atProgress, drop, hop, type Time } from "@motion5/moves";

function timed(progress: number): Time {
  return { progress, clock: { kind: "timed", elapsed: progress * 800, length: 800 } };
}

describe("hop", () => {
  const options = { height: 400, bounces: 1, decay: 0.25, squash: 0.4 } as const;

  it("starts on the floor, unsquashed, anchored at the bottom", () => {
    expect(hop(options, atProgress(0))).toEqual({
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
      anchor: "bottom",
      contact: { hits: 0, justHit: 0 },
    });
  });

  it("reaches its height at the middle of the first flight", () => {
    expect(hop(options, atProgress(2 / 7)).y).toBeCloseTo(-400, 6);
  });

  it("gives the same pose whatever the clock", () => {
    for (const progress of [0, 0.2, 4 / 7, 0.9, 1])
      expect(hop(options, timed(progress))).toEqual(hop(options, atProgress(progress)));
  });
});

describe("drop", () => {
  it("starts above rest and lands at rest", () => {
    expect(drop({ distance: 300 }, atProgress(0)).y).toBe(-300);
    expect(drop({ distance: 300 }, atProgress(1)).y).toBe(0);
  });

  it("gives the same pose whatever the clock", () => {
    for (const progress of [0, 0.5, 0.75, 0.9, 1])
      expect(drop({ distance: 300, squash: 0.3 }, timed(progress))).toEqual(
        drop({ distance: 300, squash: 0.3 }, atProgress(progress)),
      );
  });
});
