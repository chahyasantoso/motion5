import { describe, expect, it } from "vitest";
import { liveAt, type Events } from "@gerak/moves";
import { scene } from "../src/card-scene";

const pointer = (...steps: readonly [string, number][]): Events =>
  steps.map(([name, at]) => ({ name, at, target: "card" }));

describe("the hover card scene", () => {
  it("drops in, then rests until the pointer comes", () => {
    expect(scene(liveAt(0), []).card.y ?? 0).toBeLessThan(-400);
    expect(scene(liveAt(900), []).card.y ?? 1).toBeCloseTo(0, 6);
    expect(scene(liveAt(5000), []).card.y ?? 1).toBeCloseTo(0, 6);
  });

  it("lifts on hover and settles back down after a leave half way, with no jump", () => {
    const hover = pointer(["enter", 1000]);
    const leftEarly = pointer(["enter", 1000], ["leave", 1080]);
    expect(scene(liveAt(1080), leftEarly).card.y).toBeCloseTo(
      scene(liveAt(1080), hover).card.y ?? NaN,
      9,
    );
    expect(scene(liveAt(4000), hover).card.y ?? 0).toBeCloseTo(-14, 3);
    expect(scene(liveAt(4000), leftEarly).card.y ?? 1).toBeCloseTo(0, 3);
  });

  it("sinks while pressed and comes back on release", () => {
    expect(
      scene(liveAt(1300), pointer(["enter", 1000], ["down", 1200])).card.scale ?? 1,
    ).toBeLessThan(0.97);
    expect(
      scene(liveAt(3000), pointer(["enter", 1000], ["down", 1200], ["up", 1300])).card.scale,
    ).toBeCloseTo(1, 4);
  });
});
