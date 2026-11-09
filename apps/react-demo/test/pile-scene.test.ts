import { describe, expect, it } from "vitest";
import { liveAt } from "@motion5/moves";
import { FLOOR, SIZE, STARTS, durationMs, scene } from "../src/pile-scene";

describe("the tumble scene", () => {
  it("brings every letter to rest above the floor, some of them turned", () => {
    const end = scene(liveAt(durationMs), []);
    const before = scene(liveAt(durationMs - 200), []);
    expect(end).toEqual(before);
    STARTS.forEach((start, index) => {
      const y = start.y + (end.letters[index]?.y ?? 0);
      expect(y).toBeLessThan(FLOOR - SIZE.width / 2 + 2);
    });
    const turned = end.letters.filter((pose) => Math.abs(pose.rotation ?? 0) % 180 > 45);
    expect(turned.length).toBeGreaterThan(0);
  });

  it("squashes a glyph on the frame its letter's contact starts", () => {
    const squashed = Array.from(
      { length: 400 },
      (_, step) => scene(liveAt(step * 8), []).glyphs[0]?.scaleY ?? 1,
    );
    expect(Math.min(...squashed)).toBeLessThan(0.9);
  });

  it("is the same at a time however it got there", () => {
    const later = scene(liveAt(1500), []);
    scene(liveAt(300), []);
    expect(scene(liveAt(1500), [])).toEqual(later);
  });
});
