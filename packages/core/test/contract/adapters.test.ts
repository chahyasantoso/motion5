import { describe, expect, it } from "vitest";
import { createBrowserClock } from "../../src/adapters/browser-clock";
import { createDomPatchAdapter } from "../../src/adapters/dom";
import { createGsapInterpolator, type GsapTweenLike } from "../../src/adapters/interpolator/gsap";
import { createRealGsapSeam } from "../support/real-gsap";

describe("adapter ports", () => {
  it("compiles authored stops onto an adapter-owned proxy state", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 2,
      keyframes: { x: { stops: [{ p: 0, v: 0 }, { p: 1, v: 100 }] } },
    });
    expect(timeline.state).toMatchObject({ x: 0 });
    timeline.progress(0.5);
    expect(timeline.state).toMatchObject({ x: 50 });
    timeline.kill();
  });

  it("adapts a GSAP-like tween without leaking the engine object", () => {
    let value = 0;
    let killed = false;
    const tween: GsapTweenLike = {
      duration: () => 2,
      progress: (next?: number) => {
        if (next === undefined) return value;
        value = next;
        return tween;
      },
      kill: () => {
        killed = true;
      },
    };
    const interpolator = createGsapInterpolator({ to: () => tween });
    const adapted = interpolator.create({});
    expect(adapted.duration).toBe(2);
    adapted.progress(0.5);
    expect(adapted.progress()).toBe(0.5);
    adapted.kill();
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
