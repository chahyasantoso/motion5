import { describe, expect, it, vi } from "vitest";
import { Track } from "../../../src/domain/track";
import type { ImmutableRecord } from "../../../src/domain/values";

const emptyPreparation = { keyframes: Object.freeze({}), tweenVars: Object.freeze({}) } as const;
const TIMELINE_REJECTED = "timeline rejected progress";
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
/**
 * Rejects one progress value and records both what the timeline was handed and what it accepted,
 * so a case can tell the Track's own bookkeeping apart from the timeline's state. Local to this
 * file rather than folded into createFakeInterpolator: the shared fake is the well-behaved one,
 * and a hostile timeline is evidence for these cases only. The Track under test is real, which is
 * what makes the L- series about the commit ordering rather than about a double. Issue #149.
 */
function createRejectingInterpolator(rejected: number) {
  const calls: number[] = [];
  let accepted = 0;
  let rejecting = true;
  const timeline = {
    duration: 1,
    state: {} as Readonly<Record<string, unknown>>,
    progress: (value?: number) => {
      if (value === undefined) return accepted;
      calls.push(value);
      if (rejecting && value === rejected) throw new Error(TIMELINE_REJECTED);
      accepted = value;
      return accepted;
    },
    kill: vi.fn(),
  };
  return {
    calls,
    interpolator: { create: vi.fn(() => timeline) },
    get accepted() {
      return accepted;
    },
    accept() {
      rejecting = false;
    },
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
    internalKeys: Object.freeze([]),
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
});

describe("Track progress commit ordering", () => {
  it("L-1 leaves progress at the prior value when the timeline rejects the new one", () => {
    // The timeline call is the only stage that can refuse a clamped, finite value on a live
    // Track, and it is injected Interpolator code, so Track has no say in whether it throws.
    // Assigning #progress before that call is what lets one playhead report two numbers.
    const fake = createRejectingInterpolator(0.5);
    const track = new Track({ interpolator: fake.interpolator });
    expect(track.setProgress(0.25)).toBe(true);

    expect(() => track.setProgress(0.5)).toThrow(TIMELINE_REJECTED);

    expect(track.progress).toBe(0.25);
    // Asserted against the timeline as well, because "unchanged" has to mean the leaf and its
    // timeline still agree, not merely that some number stayed put.
    expect(fake.accepted).toBe(0.25);
  });
  it("L-2 rejects a repeated update identically instead of reporting no change", () => {
    // The sharpest form of the defect. A committed #progress makes the second attempt equal to
    // the current value, so Object.is short-circuits and setProgress reports false rather than
    // rejecting again. A caller that treats the throw as a refusal is then told, on retry, that
    // there was nothing to do.
    const fake = createRejectingInterpolator(0.5);
    const track = new Track({ interpolator: fake.interpolator });

    expect(() => track.setProgress(0.5)).toThrow(TIMELINE_REJECTED);
    expect(() => track.setProgress(0.5)).toThrow(TIMELINE_REJECTED);

    // Twice, because the second attempt has to reach the timeline at all.
    expect(fake.calls).toEqual([0.5, 0.5]);
    expect(track.progress).toBe(0);
  });
  it("L-3 lets a retry reach the timeline once it is willing to accept the value", () => {
    // The consequence of L-2 that a caller actually feels: a transient rejection becomes
    // permanent, because the value the timeline refused is the value the Track thinks it holds.
    const fake = createRejectingInterpolator(0.5);
    const track = new Track({ interpolator: fake.interpolator });
    expect(() => track.setProgress(0.5)).toThrow(TIMELINE_REJECTED);

    fake.accept();

    expect(track.setProgress(0.5)).toBe(true);
    expect(track.progress).toBe(0.5);
    expect(fake.accepted).toBe(0.5);
  });
  it("L-4 leaves a clean Track clean and self-consistent after a rejection", () => {
    // #dirty is already untouched by the failure, since it is written after the timeline call.
    // That is exactly what makes the committed #progress worse than a lone stale field: the
    // cached snapshot stays valid and keeps serving the old progress while the getter reports
    // the refused one. Two answers for one playhead, from one object.
    const fake = createRejectingInterpolator(0.5);
    const track = new Track({ interpolator: fake.interpolator });
    track.setProgress(0.25);
    const composed = track.compose();
    expect(track.dirty).toBe(false);

    expect(() => track.setProgress(0.5)).toThrow(TIMELINE_REJECTED);

    expect(track.dirty).toBe(false);
    expect(track.progress).toBe(0.25);
    expect(track.compose()).toBe(composed);
    expect(track.compose().progress).toBe(track.progress);
  });
  it("L-5 still commits a successful update and hands the timeline the clamped value", () => {
    // Guard, green before and after. The fix moves the assignment past the timeline call, so
    // this pins the two things that must not move with it: clamping still happens before the
    // timeline sees the value, and a successful update still marks the leaf dirty.
    const fake = createRejectingInterpolator(0.5);
    const track = new Track({ interpolator: fake.interpolator });
    track.setProgress(0.25);
    track.compose();
    expect(track.dirty).toBe(false);

    expect(track.setProgress(2)).toBe(true);

    expect(track.progress).toBe(1);
    expect(fake.accepted).toBe(1);
    expect(fake.calls).toEqual([0.25, 1]);
    expect(track.dirty).toBe(true);
  });
  it("L-6 keeps every rejection that precedes the timeline call ahead of it", () => {
    // Guard, green before and after. Three refusals that must never reach the timeline: a
    // non-finite value, an unchanged value, and a disposed Track. If the fix reordered any of
    // them past the commit point, a hostile timeline would start seeing values Track rejects.
    const fake = createRejectingInterpolator(0.5);
    const track = new Track({ interpolator: fake.interpolator });

    expect(() => track.setProgress(Number.NaN)).toThrow("Track progress must be finite.");
    expect(track.setProgress(0)).toBe(false);
    expect(fake.calls).toEqual([]);

    track.dispose();

    expect(() => track.setProgress(0.5)).toThrow("Track is disposed.");
    expect(fake.calls).toEqual([]);
  });
});
