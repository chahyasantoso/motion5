import { describe, expect, it } from "vitest";
import { atProgress, drop, hop, type Time } from "@gerak/moves";

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

describe("a move's moments", () => {
  it("put each hop landing where the hop touches the floor and counts a hit", () => {
    const options = { height: 330, bounces: 2, decay: 0.35, dx: 1000 };
    const { landings, lastLanding } = hop.moments(options);
    expect(landings).toHaveLength(3);
    expect(lastLanding).toBeCloseTo(0.9173, 4);
    expect(landings.at(-1)).toBe(lastLanding);
    landings.forEach((share, flight) => {
      expect(hop(options, atProgress(share - 1e-9)).y).toBeCloseTo(0, 4);
      expect(hop(options, atProgress(share + 1e-9)).contact.hits).toBe(flight + 1);
    });
    expect(hop(options, atProgress(lastLanding)).x).toBeCloseTo(0, 9);
  });

  it("put the drop's landing where it reaches rest", () => {
    const { landing } = drop.moments({ distance: 500 });
    expect(drop({ distance: 500 }, atProgress(landing)).y).toBeCloseTo(0, 9);
    expect(drop({ distance: 500 }, atProgress(landing - 0.05)).y).toBeLessThan(0);
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
