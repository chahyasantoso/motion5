import { describe, expect, it } from "vitest";
import { manualDriver, play } from "@motion5/player";
import { DROPLETS, IMPACT_MS, durationMs, scene } from "../src/splash-scene";

function at(ms: number) {
  const driver = manualDriver({ durationMs });
  const player = play(scene, driver);
  driver.seek(ms / durationMs);
  return player.values;
}

describe("the splash scene", () => {
  it("brings the falling drop to the water at the moment the rings start", () => {
    expect(at(IMPACT_MS).drop.y ?? 0).toBeCloseTo(0, 6);
    expect(at(IMPACT_MS - 100).drop.y ?? 0).toBeLessThan(-50);
    expect(at(IMPACT_MS).rings.every((ring) => (ring.opacity ?? 0) === 0)).toBe(true);
    expect(at(IMPACT_MS + 100).rings[0]?.opacity ?? 0).toBeGreaterThan(0);
  });

  it("throws every droplet up and lands it back on its ripple", () => {
    const mid = at(IMPACT_MS + 400);
    DROPLETS.forEach((droplet, index) => {
      expect(mid.droplets[index]?.y ?? 0, `droplet ${index} in the air`).toBeLessThan(
        -droplet.depth,
      );
      const landed = at(IMPACT_MS + droplet.launch + droplet.flight);
      expect(landed.droplets[index]?.y ?? 1, `droplet ${index} lands`).toBeCloseTo(0, 6);
      expect(landed.droplets[index]?.x ?? 1, `droplet ${index} on its ripple`).toBeCloseTo(0, 6);
    });
  });

  it("ends with the word at rest and the water still", () => {
    const end = at(durationMs);
    for (const letter of end.letters) {
      expect(letter.y ?? 0).toBeCloseTo(0, 6);
      expect(letter.rotation ?? 0).toBeCloseTo(0, 6);
    }
    for (const part of [end.drop, ...end.rings, ...end.droplets, ...end.ripples, ...end.foam])
      expect(part.opacity ?? 1).toBeCloseTo(0, 6);
  });
});
