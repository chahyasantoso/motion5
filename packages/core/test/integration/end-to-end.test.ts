import { describe, expect, it } from "vitest";
import { createBrowserClock } from "../../src/adapters/browser-clock";
import { createDomPatchAdapter, type DomTarget } from "../../src/adapters/dom";
import { createGsapInterpolator } from "../../src/adapters/interpolator/gsap";

describe("Phase 4 end-to-end adapter path", () => {
  it("drives a frozen patch through current adapter boundaries without mutation", () => {
    let progress = 0;
    const interpolator = createGsapInterpolator({
      timeline: () => {
        const timeline = {
          duration: () => 1,
          progress(value?: number): number | typeof timeline {
            if (value === undefined) return progress;
            progress = value;
            return timeline;
          },
          kill: () => undefined,
        };
        return timeline;
      },
    });
    const timeline = interpolator.create({});
    timeline.progress(0.75);
    const patch = Object.freeze({
      nodeId: "hero/arm",
      revision: 1,
      values: Object.freeze({ opacity: timeline.progress() }),
      sourceProgress: timeline.progress(),
      sourceRevisions: Object.freeze({}),
      status: "ready" as const,
      diagnostics: Object.freeze([]),
    });
    const target: DomTarget = { style: { opacity: undefined } };
    createDomPatchAdapter(
      target,
      1200,
      () => target,
      (resolved, values) => {
        for (const [key, value] of Object.entries(values)) resolved.style[key] = value;
      },
    ).apply(patch);
    expect(target.style).toEqual({ perspective: "1200px", opacity: 0.75 });
    expect(patch.values.opacity).toBe(0.75);
  });

  it("runs a browser clock through one injected frame source", () => {
    const frames: ((time: number) => void)[] = [];
    const clock = createBrowserClock({
      requestFrame(listener) {
        frames.push(listener);
        return frames.length;
      },
      cancelFrame() {},
    });
    const ticks: number[] = [];
    clock.subscribe(({ tick }) => ticks.push(tick));
    frames.shift()?.(16);
    expect(ticks).toEqual([1]);
    clock.dispose();
  });
});
