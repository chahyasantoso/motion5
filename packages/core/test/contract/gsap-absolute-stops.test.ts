import { describe, expect, it } from "vitest";
import {
  createGsapInterpolator,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";

type Tween = {
  target: Record<string, unknown>;
  vars: Record<string, unknown>;
  position: number | undefined;
};

function createDeterministicTimeline(): {
  readonly timeline: GsapTimelineLike;
  readonly state: Record<string, unknown>;
} {
  const state: Record<string, unknown> = {};
  const tweens: Tween[] = [];
  let currentProgress = 0;
  const timeline: GsapTimelineLike = {
    duration: () => 1,
    progress,
    to(target, vars, position) {
      tweens.push({ target, vars, position });
      return timeline;
    },
    kill() {},
  };
  function progress(): number;
  function progress(value: number): GsapTimelineLike;
  function progress(value?: number): number | GsapTimelineLike {
    if (value === undefined) return currentProgress;
    currentProgress = value;
    for (const tween of tweens) {
      const start = tween.position ?? 0;
      const duration = typeof tween.vars.duration === "number" ? tween.vars.duration : 0;
      const end = start + duration;
      if (currentProgress < start) continue;
      const amount = end <= start ? 1 : Math.min(1, (currentProgress - start) / duration);
      for (const [key, valueAtEnd] of Object.entries(tween.vars)) {
        if (key === "duration" || key === "ease") continue;
        const valueAtStart = tween.target[key];
        if (typeof valueAtStart === "number" && typeof valueAtEnd === "number")
          state[key] = valueAtStart + (valueAtEnd - valueAtStart) * amount;
        else if (amount >= 1) state[key] = valueAtEnd;
      }
    }
    return timeline;
  }
  return { timeline, state };
}

describe("GSAP absolute multi-property stops (P0-3)", () => {
  it("preserves each property's absolute positions and independent timing", () => {
    const fake = createDeterministicTimeline();
    const timeline = createGsapInterpolator({ timeline: () => fake.timeline }).create({
      duration: 1,
      keyframes: {
        x: {
          stops: [
            { p: 0, v: 0 },
            { p: 0.5, v: 50 },
            { p: 1, v: 100 },
          ],
        },
        y: {
          stops: [
            { p: 0.2, v: 20 },
            { p: 0.25, v: 25 },
            { p: 1, v: 100 },
          ],
        },
      },
    });

    timeline.progress(0);
    expect(fake.state).toEqual({ x: 0 });
    timeline.progress(0.2);
    expect(fake.state).toEqual({ x: 20, y: 20 });
    timeline.progress(0.25);
    expect(fake.state).toEqual({ x: 25, y: 25 });
    timeline.progress(0.5);
    expect(fake.state).toEqual({ x: 50, y: 50 });
    timeline.progress(1);
    expect(fake.state).toEqual({ x: 100, y: 100 });
  });
});
