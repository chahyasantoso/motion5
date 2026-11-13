import { describe, expect, it } from "vitest";
import { liveAt, trail } from "@gerak/moves";
import { springMemory } from "../src/spring";
import { trailSettings } from "../src/trail";

const slow = { stiffness: 170, damping: 4 };

describe("trail rest", () => {
  it("plays a slow spring with no rest, at the smallest rest that fits the memory", () => {
    const settings = trailSettings(slow, "trail");
    expect(settings.rest).toBeGreaterThan(0.001);
    expect(settings.memoryMs).toBeLessThanOrEqual(4000);
    expect(springMemory(slow, settings.rest * 0.8) * 1000).toBeGreaterThan(4000);
    expect(trail(() => 1, slow)(liveAt(500), [])).toBeGreaterThan(0);
  });

  it("keeps 0.001 for a spring that settles inside the cap", () => {
    expect(trailSettings({}, "trail").rest).toBe(0.001);
  });

  it("refuses a given rest that is too small and names the one it would take", () => {
    const take = trailSettings(slow, "trail").rest;
    expect(() => trailSettings({ ...slow, rest: 0.01 }, "trail")).toThrow(
      new RegExp(`raise rest to ${take} or more`),
    );
  });
});
