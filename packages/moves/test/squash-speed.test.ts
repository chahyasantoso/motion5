import { describe, expect, it } from "vitest";
import { squashFromSpeed } from "@gerak/moves";

describe("squashFromSpeed", () => {
  it("is still at zero speed", () => {
    expect(squashFromSpeed({ vx: 0, vy: 0 }, { amount: 0.001, most: 0.5 })).toEqual({});
  });

  it("stretches along a horizontal speed and squashes across it", () => {
    const pose = squashFromSpeed({ vx: 100, vy: 0 }, { amount: 0.002, most: 0.5 });
    expect(pose.rotation).toBeCloseTo(0, 9);
    expect(pose.scaleX).toBeCloseTo(1.18, 9);
    expect(pose.scaleY).toBeCloseTo(0.8, 9);
  });

  it("follows the heading, upright for a leftward speed", () => {
    const pose = squashFromSpeed({ vx: -100, vy: 0 }, { amount: 0.002, most: 0.5 });
    expect(pose.rotation).toBeCloseTo(0, 9);
    expect(squashFromSpeed({ vx: 0, vy: 100 }, { amount: 0.002, most: 0.5 }).rotation).toBe(90);
  });

  it("is capped by most", () => {
    const pose = squashFromSpeed({ vx: 1e6, vy: 0 }, { amount: 0.01, most: 0.3 });
    expect(pose.scaleY).toBeCloseTo(0.7, 9);
    expect(pose.scaleX).toBeCloseTo(1.27, 9);
  });

  it("refuses settings out of range", () => {
    expect(() => squashFromSpeed({ vx: 1, vy: 0 }, { amount: -1, most: 0.5 })).toThrow(RangeError);
    expect(() => squashFromSpeed({ vx: 1, vy: 0 }, { amount: 1, most: 1 })).toThrow(RangeError);
  });
});
