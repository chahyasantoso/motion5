import { describe, expect, it } from "vitest";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";
import { createRealGsapSeam } from "../support/real-gsap";

describe("GSAP interpolator clock ownership (P0-2)", () => {
  it("creates a paused timeline so the project clock is the only clock owner", () => {
    let receivedConfig: unknown;
    const timeline: GsapTimelineLike = {
      duration: () => 1,
      progress,
      to() {
        return timeline;
      },
      kill() {},
    };
    function progress(): number;
    function progress(value: number): GsapTimelineLike;
    function progress(value?: number): number | GsapTimelineLike {
      return value === undefined ? 0 : timeline;
    }

    const interpolator = createGsapInterpolator({
      timeline(config) {
        receivedConfig = config;
        return timeline;
      },
    });

    interpolator.create({ duration: 1, keyframes: {} });

    expect(receivedConfig).toEqual({ paused: true });
  });

  it("is paused according to real GSAP, not according to the fixture", () => {
    // The config check above proves what the adapter asked for. This proves what real GSAP did
    // with it, through a seam that forwards the config verbatim instead of supplying its own.
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
    expect(seam.created[0]?.config).toEqual({ paused: true });
    expect(seam.created[0]?.paused()).toBe(true);
  });
});
