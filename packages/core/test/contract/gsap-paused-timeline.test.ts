import { describe, expect, it } from "vitest";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";
import { createRealGsapSeam } from "../support/real-gsap";

describe("GSAP interpolator clock ownership (P0-2)", () => {
  it("creates a paused parent timeline so the project clock is the only clock owner", () => {
    let receivedVars: Record<string, unknown> | undefined;
    let currentProgress = 0;
    const timeline: GsapTimelineLike = {
      duration: () => 1,
      progress(value?: number): number | GsapTimelineLike {
        if (value === undefined) return currentProgress;
        currentProgress = value;
        return timeline;
      },
      to: () => timeline,
      kill() {},
    } as GsapTimelineLike;
    const interpolator = createGsapInterpolator({
      timeline(vars) {
        receivedVars = vars;
        return timeline;
      },
    });

    interpolator.create({ duration: 1, keyframes: {} });

    expect(receivedVars).toMatchObject({ paused: true });
  });

  it("is paused according to real GSAP, not according to the fixture", () => {
    const seam = createRealGsapSeam();
    seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 1, v: 100 },
          ],
        },
      },
    });
    expect(seam.created).toHaveLength(1);
    expect(seam.created[0]?.paused()).toBe(true);
  });
});
