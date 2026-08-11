import { describe, expect, it } from "vitest";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

describe("GSAP multi-stop compilation (B2)", () => {
  it("interpolates authored stops at 0, 0.5, and 1 using adapter-owned state", () => {
    let progressValue = 0;
    let target: Record<string, unknown> | undefined;
    const interpolator = createGsapInterpolator({
      timeline: (): GsapTimelineLike => {
        function progress(): number;
        function progress(value: number): GsapTimelineLike;
        function progress(value?: number): number | GsapTimelineLike {
          if (value === undefined) return progressValue;
          progressValue = value;
          if (target) {
            const stops = [0, 50, 100];
            const segment = Math.min(1, progressValue * 2);
            const index = Math.min(1, Math.floor(segment));
            const local = segment - index;
            const from = stops[index] ?? stops[0];
            const to = stops[index + 1] ?? stops[stops.length - 1];
            target.x = from + (to - from) * local;
          }
          return timeline;
        }
        const timeline: GsapTimelineLike = {
          duration: () => 1,
          progress,
          to(nextTarget) {
            target = nextTarget;
            return timeline;
          },
          kill() {},
        };
        return timeline;
      },
    });

    const timeline = interpolator.create({
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    expect(timeline.state).toEqual({ x: 0 });
    timeline.progress(0.5);
    expect(timeline.state).toEqual({ x: 50 });
    timeline.progress(1);
    expect(timeline.state).toEqual({ x: 100 });
  });
});
