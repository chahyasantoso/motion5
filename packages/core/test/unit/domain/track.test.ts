import { describe, expect, it, vi } from "vitest";
import { Track } from "../../../src/domain/track";
import type { ImmutableRecord } from "../../../src/domain/values";

function createInterpolator() {
  const progressCalls: number[] = [];
  const timeline = {
    duration: 1,
    progress: (value?: number) => {
      if (value !== undefined) progressCalls.push(value);
      return 0;
    },
    kill: vi.fn(),
  };
  return {
    progressCalls,
    interpolator: { create: vi.fn(() => timeline) },
  };
}

function createPlugin(name: string, compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord) {
  return { name, compose };
}

describe("Track leaf", () => {
  it("clamps progress and marks the leaf dirty only when progress changes", () => {
    const fake = createInterpolator();
    const track = new Track({ interpolator: fake.interpolator });

    expect(track.setProgress(2)).toBe(true);
    expect(track.progress).toBe(1);
    expect(track.setProgress(1)).toBe(false);
    expect(fake.progressCalls).toEqual([1]);
    expect(track.dirty).toBe(true);
  });

  it("rejects non-finite progress and composes local values once per dirty state", () => {
    const fake = createInterpolator();
    const compose = vi.fn((values: Readonly<ImmutableRecord>) => ({ ...values, opacity: 1 }));
    const track = new Track({
      interpolator: fake.interpolator,
      plugins: { plugins: Object.freeze([createPlugin("opacity", compose)]), diagnostics: Object.freeze([]) },
    });

    expect(() => track.setProgress(Number.NaN)).toThrow(/finite/);
    const first = track.compose({ x: 1 });
    const second = track.compose({ x: 999 });
    expect(second).toBe(first);
    expect(compose).toHaveBeenCalledTimes(1);
    expect(first.values).toEqual({ x: 1, opacity: 1 });
  });

  it("is a leaf with no composite or graph API", () => {
    const track = new Track({ interpolator: createInterpolator().interpolator });
    expect("children" in track).toBe(false);
    expect("parent" in track).toBe(false);
    expect("play" in track).toBe(false);
    expect("observe" in track).toBe(false);
    expect("composeGraph" in track).toBe(false);
  });

  it("disposes once and rejects future work", () => {
    const fake = createInterpolator();
    const track = new Track({ interpolator: fake.interpolator });
    track.dispose();
    track.dispose();
    expect(fake.interpolator.create().kill).toBeDefined();
    expect(() => track.compose()).toThrow(/disposed/);
    expect(() => track.setProgress(0.5)).toThrow(/disposed/);
  });
});
