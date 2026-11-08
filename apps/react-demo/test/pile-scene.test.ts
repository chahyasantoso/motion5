import { describe, expect, it } from "vitest";
import { liveAt } from "@motion5/moves";
import { FLOOR, SIZE, STARTS, durationMs, scene } from "../src/pile-scene";

describe("the tumble scene", () => {
  it("brings every letter to rest standing on the floor", () => {
    const end = scene(liveAt(durationMs), []);
    STARTS.forEach((start, index) => {
      const y = start.y + (end.letters[index]?.y ?? 0);
      expect(Math.abs(y + SIZE.height / 2 - FLOOR)).toBeLessThan(1);
      expect(end.letters[index]?.scaleY ?? 1).toBeCloseTo(1, 3);
    });
  });

  it("squashes a letter on the frame its contact starts", () => {
    const squashed = Array.from(
      { length: 300 },
      (_, step) => scene(liveAt(step * 8), []).letters[0]?.scaleY ?? 1,
    );
    expect(Math.min(...squashed)).toBeLessThan(0.9);
  });

  it("is the same at a time however it got there", () => {
    const later = scene(liveAt(1500), []);
    scene(liveAt(300), []);
    expect(scene(liveAt(1500), [])).toEqual(later);
  });
});
