import { describe, expect, it } from "vitest";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

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
});
