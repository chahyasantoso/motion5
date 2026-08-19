import { describe, expect, it, vi } from "vitest";
import { Track } from "../../../src/domain/track";
import type { ImmutableRecord } from "../../../src/domain/values";

const emptyPreparation = { keyframes: Object.freeze({}), tweenVars: Object.freeze({}) } as const;
function createInterpolator() {
  const progressCalls: number[] = [];
  const timeline = {
    duration: 1,
    state: {} as Readonly<Record<string, unknown>>,
    progress: (value?: number) => {
      if (value !== undefined) progressCalls.push(value);
      return 0;
    },
    kill: vi.fn(),
  };
  return { progressCalls, interpolator: { create: vi.fn(() => timeline) } };
}
function createRejectingInterpolator() {
  let timelineProgress = 0;
  let shouldReject = true;
  const progress = vi.fn((value?: number) => {
    if (value === undefined) return timelineProgress;
    if (shouldReject && value === 0.5) throw new Error("timeline rejected progress");
    timelineProgress = value;
    return timelineProgress;
  });
  const timeline = {
    duration: 1,
    state: {} as Readonly<Record<string, unknown>>,
    progress,
    kill: vi.fn(),
  };
  return {
    acceptRejectedValue: () => {
      shouldReject = false;
    },
    interpolator: { create: vi.fn(() => timeline) },
    progress,
    timelineProgress: () => timelineProgress,
  };
}
function createPlugin(
  name: string,
  compose: (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord,
) {
  return { name, compose };
}
function plugins(...items: ReturnType<typeof createPlugin>[]) {
  return {
    plugins: Object.freeze(items),
    diagnostics: Object.freeze([]),
    authoredKeyframes: Object.freeze({}),
    outputSerializers: Object.freeze({}),
    preparation: emptyPreparation,
  };
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
      plugins: plugins(createPlugin("opacity", compose)),
    });
    expect(() => track.setProgress(Number.NaN)).toThrow(/finite/);
    const first = track.compose({ x: 1 });
    const second = track.compose({ x: 1 });
    expect(second).toBe(first);
    expect(compose).toHaveBeenCalledTimes(1);
    expect(first.values).toEqual({ x: 1, opacity: 1 });
  });
  it("recomposes a clean track when its inputs change", () => {
    const fake = createInterpolator();
    const compose = vi.fn((values: Readonly<ImmutableRecord>) => ({ ...values }));
    const track = new Track({
      interpolator: fake.interpolator,
      plugins: plugins(createPlugin("passthrough", compose)),
    });
    const first = track.compose({ x: 1 });
    const second = track.compose({ x: 2 });
    expect(second).not.toBe(first);
    expect(second.values).toEqual({ x: 2 });
    expect(compose).toHaveBeenCalledTimes(2);
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
  it("S-1 keeps clean Track bookkeeping at the accepted value after rejection", () => {
    const fake = createRejectingInterpolator();
    const track = new Track({ interpolator: fake.interpolator });
    track.setProgress(0.25);
    track.compose();

    expect(() => track.setProgress(0.5)).toThrow("timeline rejected progress");
    // The renderer rejected 0.5, so Track must still report the accepted 0.25 state.
    expect(track.progress).toBe(0.25);
    expect(fake.timelineProgress()).toBe(0.25);
    expect(track.dirty).toBe(false);
  });
  it("S-2 retries the same value after a timeline rejection", () => {
    const fake = createRejectingInterpolator();
    const track = new Track({ interpolator: fake.interpolator });

    expect(() => track.setProgress(0.5)).toThrow("timeline rejected progress");
    fake.acceptRejectedValue();

    expect(track.setProgress(0.5)).toBe(true);
    expect(fake.progress).toHaveBeenCalledTimes(2);
    expect(track.progress).toBe(0.5);
    expect(fake.timelineProgress()).toBe(0.5);
  });
  it("S-3 leaves an already-dirty Track unchanged after rejection", () => {
    const fake = createRejectingInterpolator();
    const track = new Track({ interpolator: fake.interpolator });

    expect(track.dirty).toBe(true);
    expect(() => track.setProgress(0.5)).toThrow("timeline rejected progress");
    expect(track.progress).toBe(0);
    expect(fake.timelineProgress()).toBe(0);
    expect(track.dirty).toBe(true);
  });
  it("S-4 commits progress and dirtiness after the timeline accepts", () => {
    const fake = createRejectingInterpolator();
    const track = new Track({ interpolator: fake.interpolator });
    track.compose();
    fake.acceptRejectedValue();

    expect(track.setProgress(0.5)).toBe(true);
    expect(fake.timelineProgress()).toBe(0.5);
    expect(track.progress).toBe(0.5);
    expect(track.dirty).toBe(true);
  });
});
