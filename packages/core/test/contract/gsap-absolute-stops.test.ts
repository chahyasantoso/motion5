import { describe, expect, it } from "vitest";
import { createGsapInterpolator, type GsapTimelineLike } from "../../src/adapters/interpolator/gsap";
import { createRealGsapSeam, readNumber } from "../support/real-gsap";

type Tween = {
  target: Record<string, unknown>;
  vars: Record<string, unknown>;
};

function createDeterministicTimeline(): {
  readonly timeline: GsapTimelineLike;
  readonly state: Record<string, unknown>;
  readonly tweens: readonly Tween[];
} {
  const state: Record<string, unknown> = {};
  const tweens: Tween[] = [];
  let currentProgress = 0;
  const timeline: GsapTimelineLike = {
    duration: () => 1,
    progress,
    to(target, vars) {
      tweens.push({ target, vars });
      return timeline;
    },
    kill() {},
  };
  function progress(): number;
  function progress(value: number): GsapTimelineLike;
  function progress(value?: number): number | GsapTimelineLike {
    if (value === undefined) return currentProgress;
    currentProgress = value;
    const tween = tweens[0];
    const keyframes = (tween?.vars.keyframes ?? {}) as Record<string, Record<string, unknown>>;
    const points = Object.keys(keyframes)
      .map(Number)
      .sort((a, b) => a - b);
    for (const key of new Set(points.flatMap((point) => Object.keys(keyframes[`${point}%`] ?? {})))) {
      const entries = points
        .map((point) => ({ point: point / 100, value: keyframes[`${point}%`]?.[key] }))
        .filter(({ value }) => value !== undefined);
      const previous = entries.filter(({ point }) => point <= currentProgress).at(-1) ?? entries[0];
      const next = entries.find(({ point }) => point > currentProgress);
      if (!previous) continue;
      if (!next || typeof previous.value !== "number" || typeof next.value !== "number") {
        state[key] = previous.value;
        continue;
      }
      const amount = (currentProgress - previous.point) / (next.point - previous.point);
      state[key] = previous.value + (next.value - previous.value) * amount;
    }
    return timeline;
  }
  return { timeline, state, tweens };
}

describe("GSAP absolute multi-property stops (P0-3)", () => {
  it("uses one shared percent-keyframe tween with independent absolute grids", () => {
    const fake = createDeterministicTimeline();
    const timeline = createGsapInterpolator({ timeline: () => fake.timeline }).create({
      duration: 1,
      keyframes: {
        x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50 }, { p: 1, v: 100 }] },
        y: { stops: [{ p: 0.2, v: 20 }, { p: 0.25, v: 25 }, { p: 1, v: 100 }] },
      },
    });

    expect(fake.tweens).toHaveLength(1);
    expect(fake.tweens[0]?.vars.keyframes).toEqual({
      "0%": { x: 0, y: 20 },
      "20%": { y: 20 },
      "25%": { y: 25 },
      "50%": { x: 50 },
      "100%": { x: 100, y: 100 },
    });
    timeline.progress(0);
    expect(fake.state).toEqual({ x: 0, y: 20 });
    timeline.progress(0.2);
    expect(fake.state).toEqual({ x: 20, y: 20 });
    timeline.progress(0.25);
    expect(fake.state).toEqual({ x: 25, y: 25 });
    timeline.progress(0.5);
    expect(fake.state).toEqual({ x: 50, y: 50 });
    timeline.progress(1);
    expect(fake.state).toEqual({ x: 100, y: 100 });
  });

  it("keeps per-property grids and the leading hold intact on real GSAP", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({
      duration: 1,
      keyframes: {
        x: { stops: [{ p: 0, v: 0 }, { p: 0.5, v: 50 }, { p: 1, v: 100 }] },
        y: { stops: [{ p: 0.2, v: 20 }, { p: 0.25, v: 25 }, { p: 1, v: 100 }] },
      },
    });

    const x = (): number => readNumber(timeline.state, "x");
    const y = (): number => readNumber(timeline.state, "y");
    expect(timeline.duration).toBeCloseTo(1, 10);
    timeline.progress(0);
    expect(x()).toBeCloseTo(0, 6);
    expect(y()).toBeCloseTo(20, 6);
    timeline.progress(0.2);
    expect(x()).toBeCloseTo(20, 6);
    expect(y()).toBeCloseTo(20, 6);
    timeline.progress(0.25);
    expect(x()).toBeCloseTo(25, 6);
    expect(y()).toBeCloseTo(25, 6);
    timeline.progress(0.5);
    expect(x()).toBeCloseTo(50, 6);
    expect(y()).toBeCloseTo(50, 6);
    timeline.progress(1);
    expect(x()).toBeCloseTo(100, 6);
    expect(y()).toBeCloseTo(100, 6);
    timeline.kill();
  });
});
