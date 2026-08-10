import { describe, expect, it } from "vitest";
import { createBrowserClock } from "../../src/adapters/browser-clock";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

describe("adapter ports", () => {
  it("adapts a GSAP-like timeline without leaking the engine object", () => {
    let value = 0;
    let killed = false;
    const interpolator = createGsapInterpolator({
      timeline: (): GsapTimelineLike => {
        function progress(): number;
        function progress(next: number): GsapTimelineLike;
        function progress(next?: number): number | GsapTimelineLike {
          if (next === undefined) return value;
          value = next;
          return timeline;
        }
        const timeline: GsapTimelineLike = {
          duration: () => 2,
          progress,
          kill() {
            killed = true;
          },
        };
        return timeline;
      },
    });
    const timeline = interpolator.create({});
    expect(timeline.duration).toBe(2);
    timeline.progress(0.5);
    expect(timeline.progress()).toBe(0.5);
    timeline.kill();
    expect(killed).toBe(true);
  });

  it("ticks through an injected frame source and cancels on dispose", () => {
    const frames: ((time: number) => void)[] = [];
    let cancelled = 0;
    const clock = createBrowserClock({
      requestFrame(listener) {
        frames.push(listener);
        return frames.length;
      },
      cancelFrame() {
        cancelled += 1;
      },
    });
    const ticks: number[] = [];
    clock.subscribe(({ tick }) => ticks.push(tick));
    frames.shift()?.(10);
    expect(ticks).toEqual([1]);
    clock.dispose();
    expect(cancelled).toBe(1);
  });

  it("applies perspective once and never applies blocked patches", () => {
    const stage: { style: { perspective?: string }; opacity?: number } = { style: {} };
    const adapter = createDomPatchAdapter(stage, 1200);
    adapter.apply({
      nodeId: "hero/arm",
      revision: 1,
      values: { opacity: 1 },
      sourceProgress: 0,
      sourceRevisions: {},
      status: "blocked",
      diagnostics: [],
    });
    expect(stage.style.perspective).toBe("1200px");
    expect(stage.opacity).toBeUndefined();
  });
});
