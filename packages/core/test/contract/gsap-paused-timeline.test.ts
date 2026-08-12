import { describe, expect, it } from "vitest";
import { createGsapInterpolator, type GsapTimelineLike } from "../../src/adapters/interpolator/gsap";

describe("GSAP interpolator clock ownership (P0-2)", () => {
  it("creates a paused timeline so the project clock is the only clock owner", () => {
    let receivedConfig: unknown;
    const timeline: GsapTimelineLike = {
      duration: () => 1,
      progress(value?: number) {
        return value === undefined ? 0 : timeline;
      },
      to() {
        return timeline;
      },
      kill() {},
    };

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
