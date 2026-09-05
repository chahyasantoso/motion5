import { describe, expect, it, vi } from "vitest";
import { gsap } from "gsap";
import { fileURLToPath } from "node:url";
import { compilePercentKeyframes } from "../../src/domain/keyframe-compiler";
import {
  createGsapInterpolator,
  createGsapOneTweenInterpolator,
  KeyframeCompilationError,
  type GsapTimelineLike,
} from "../../src/adapters/interpolator/gsap";
import type { InterpolationTimeline, Interpolator } from "../../src/ports/interpolator";
import { readNumber } from "../support/real-gsap";
import { code, member } from "../helpers/source-region";

/**
 * Issue #231, plan v3. One invariant: an animated key's tweens are replaced on the still-live
 * timeline against a retained base record, every reader of `state` sees only the effective stops,
 * an overlay is revertible wholesale and a rebase is sticky, or the write declines and escalates to
 * the recompile that was always available.
 *
 * This file owns the timeline adapter's half. `Track` and the runtime's half are
 * `unit/domain/track-live-values.test.ts`, `unit/runtime/live-value-updates.test.ts`, and
 * `unit/runtime/live-value-animated.test.ts`. Every case asserts the capability's presence first, so
 * a failing run fails on an assertion rather than on a `TypeError` from calling `undefined`.
 * See ADR-060.
 */
const ADAPTER_SOURCE = fileURLToPath(
  new URL("../../src/adapters/interpolator/gsap.ts", import.meta.url),
);
type RealTimeline = ReturnType<typeof gsap.timeline>;
interface Seam {
  readonly interpolator: Interpolator;
  readonly timelines: readonly RealTimeline[];
  created(): number;
}
/**
 * A real `gsap.timeline()` behind the adapter, with the instance kept.
 *
 * Real gsap rather than a fixture, because the claims are about tween lifetime and about what a
 * re-applied progress renders, and a fixture that answers those is the thing under test wearing a
 * different name. The instance is kept so a case can ask gsap itself which children exist.
 */
function createSeam(): Seam {
  const timelines: RealTimeline[] = [];
  let created = 0;
  const interpolator = createGsapInterpolator({
    timeline(vars): GsapTimelineLike {
      created += 1;
      const real = gsap.timeline(vars as Parameters<typeof gsap.timeline>[0]);
      timelines.push(real);
      return real;
    },
  });
  return { interpolator, timelines, created: () => created };
}
const AUTHORED_X = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 100 },
]);
const AUTHORED_Y = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 200 },
]);
const BASE = Object.freeze({
  duration: 1,
  keyframes: { x: AUTHORED_X, y: AUTHORED_Y },
});
/** Same key, same shape, different values: the ordinary patch. */
const SLOWER_X = Object.freeze([
  { p: 0, v: 0 },
  { p: 1, v: 40 },
]);
/** Ends before the timeline does, which is what makes the padding tween's role observable. */
const SHORT_X = Object.freeze([
  { p: 0, v: 0 },
  { p: 0.5, v: 100 },
]);
/** Starts after 0%, so the old value would survive on the proxy without a re-seed. */
const LATE_X = Object.freeze([
  { p: 0.5, v: 500 },
  { p: 1, v: 900 },
]);
const EASED = Object.freeze({
  duration: 1,
  keyframes: {
    x: [
      { p: 0, v: 0 },
      { p: 0.5, v: 50, ease: "power1.out" },
      { p: 1, v: 100 },
    ],
    y: AUTHORED_Y,
  },
});
/** Authors a conflicting ease at a percent the base already claimed. */
const COLLIDING_Y = Object.freeze([
  { p: 0, v: 0 },
  { p: 0.5, v: 100, ease: "power2.out" },
  { p: 1, v: 200 },
]);
function patch(
  timeline: InterpolationTimeline,
  overlay: Readonly<Record<string, unknown>>,
  rebase = false,
): boolean {
  expect(timeline.patchKeys).toBeTypeOf("function");
  return timeline.patchKeys?.(overlay, rebase) ?? false;
}
function childrenOf(timeline: RealTimeline): readonly unknown[] {
  return timeline.getChildren(false, true, false);
}
function tweensFor(timeline: RealTimeline, key: string): readonly unknown[] {
  return timeline
    .getChildren(false, true, false)
    .filter((child) => key in (child.vars as unknown as Record<string, unknown>));
}
function sample(timeline: InterpolationTimeline, key: string, at: number): number {
  timeline.progress(at);
  return readNumber(timeline.state, key);
}

describe("a record-shaped overlay patches a live timeline, or declines", () => {
  it("PK-1 rebuilds a key from a bare stop array and declines the retired wrapper", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(BASE);
    expect(sample(timeline, "x", 0.5)).toBeCloseTo(50, 6);

    expect(patch(timeline, { x: SLOWER_X })).toBe(true);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(20, 6);

    // The wrapper compiles to no property for the key, which is a kind change rather than a patch.
    const real = seam.timelines[0] as RealTimeline;
    const before = { ...timeline.state };
    const alive = childrenOf(real).length;
    expect(patch(timeline, { x: { stops: SLOWER_X } })).toBe(false);
    expect({ ...timeline.state }).toEqual(before);
    expect(childrenOf(real).length).toBe(alive);
    timeline.kill();
  });

  it("PK-2 creates no second timeline and never kills the whole one", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(BASE);
    const real = seam.timelines[0] as RealTimeline;
    const killed = vi.spyOn(real, "kill");

    expect(patch(timeline, { x: SLOWER_X })).toBe(true);

    expect(seam.created()).toBe(1);
    expect(killed).not.toHaveBeenCalled();
    killed.mockRestore();
    timeline.kill();
  });

  it("PK-3 keeps the sibling's own child objects and rebuilds only the patched key's", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(BASE);
    const real = seam.timelines[0] as RealTimeline;
    const yBefore = tweensFor(real, "y");
    const xBefore = tweensFor(real, "x");
    expect(yBefore).toHaveLength(1);
    expect(xBefore).toHaveLength(1);

    expect(patch(timeline, { x: SLOWER_X })).toBe(true);

    // Identity, not output: a killed sibling would leave the timeline entirely.
    expect(tweensFor(real, "y")[0]).toBe(yBefore[0]);
    expect(childrenOf(real)).toContain(yBefore[0]);
    expect(tweensFor(real, "x")).toHaveLength(1);
    expect(tweensFor(real, "x")[0]).not.toBe(xBefore[0]);
    timeline.kill();
  });

  it("PK-4 restores a key dropped from the overlay through the same call", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(BASE);
    const fresh = createSeam().interpolator.create(BASE);

    expect(patch(timeline, { x: SLOWER_X })).toBe(true);
    expect(patch(timeline, {})).toBe(true);

    for (const at of [0, 0.5, 1]) {
      expect(sample(timeline, "x", at)).toBeCloseTo(sample(fresh, "x", at), 6);
      expect(sample(timeline, "y", at)).toBeCloseTo(sample(fresh, "y", at), 6);
    }
    timeline.kill();
    fresh.kill();
  });

  it("PK-5 makes a rebased overlay the new base and leaves a plain one revertible", () => {
    const sticky = createSeam().interpolator.create(BASE);
    expect(patch(sticky, { x: SLOWER_X }, true)).toBe(true);
    expect(patch(sticky, {})).toBe(true);
    expect(sample(sticky, "x", 1)).toBeCloseTo(40, 6);

    const revertible = createSeam().interpolator.create(BASE);
    expect(patch(revertible, { x: SLOWER_X })).toBe(true);
    expect(patch(revertible, {})).toBe(true);
    expect(sample(revertible, "x", 1)).toBeCloseTo(100, 6);
    sticky.kill();
    revertible.kill();
  });

  it("PK-6 declines an effective record that cannot compile, with every tween alive", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(EASED);
    const real = seam.timelines[0] as RealTimeline;
    const before = childrenOf(real);
    const state = { ...timeline.state };

    expect(patch(timeline, { y: COLLIDING_Y })).toBe(false);

    // No diagnostic is surfaced from here, and nothing was killed on the way to the decline.
    expect(childrenOf(real)).toEqual(before);
    expect({ ...timeline.state }).toEqual(state);
    timeline.kill();
  });

  it("PK-7 declines an ease collision a per-key compile could not have seen", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(EASED);
    const effective = { ...EASED.keyframes, y: COLLIDING_Y };

    // The rule fires only when two keys disagree at one percent, so one key alone is blind to it.
    expect(compilePercentKeyframes({ y: COLLIDING_Y }).diagnostics).toEqual([]);
    const whole = compilePercentKeyframes(effective).diagnostics;
    expect(whole.map(({ ruleId }) => ruleId)).toEqual(["plugin-contribution-ease-collision"]);

    expect(patch(timeline, { y: COLLIDING_Y })).toBe(false);

    // The escalating recompile is where the error is raised, from the one place that owns it.
    const recompile = (): InterpolationTimeline =>
      createSeam().interpolator.create({ duration: 1, keyframes: effective });
    expect(recompile).toThrow(KeyframeCompilationError);
    timeline.kill();
  });

  it("PK-8 leaves the terminal padding tween alone and the total duration pinned", () => {
    const seam = createSeam();
    const timeline = seam.interpolator.create(BASE);
    const real = seam.timelines[0] as RealTimeline;
    const keyed = [...tweensFor(real, "x"), ...tweensFor(real, "y")];
    const padding = childrenOf(real).filter((child) => !keyed.includes(child));
    expect(padding).toHaveLength(1);

    timeline.progress(0.5);
    const positionBefore = real.time();
    expect(patch(timeline, { x: SHORT_X })).toBe(true);
    timeline.progress(0.5);

    // A key's last stop moved earlier, and progress still resolves to the same timeline position.
    expect(real.time()).toBeCloseTo(positionBefore, 10);
    expect(real.duration()).toBeCloseTo(1, 10);
    expect(timeline.duration).toBe(1);
    expect(childrenOf(real)).toContain(padding[0]);
    expect(tweensFor(real, "x")).not.toContain(padding[0]);
    timeline.kill();
  });

  it("PK-9 reflects only the effective stops at the progress it was holding", () => {
    const timeline = createSeam().interpolator.create(BASE);
    timeline.progress(0.25);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(25, 6);

    expect(patch(timeline, { x: LATE_X })).toBe(true);

    // The new first stop sits after 0%, so the old value would survive on the proxy unless it is
    // re-seeded from the recompiled initial and the progress is re-applied.
    expect(timeline.progress()).toBeCloseTo(0.25, 10);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(500, 6);
    expect(readNumber(timeline.state, "y")).toBeCloseTo(50, 6);
    timeline.kill();
  });

  it("PK-10 leaves the one-tween interpolator without the capability", () => {
    const tween = createGsapOneTweenInterpolator(gsap).create(BASE);
    expect(tween.patchKeys).toBeUndefined();

    // Structural, so a later refactor cannot quietly add a stub that lies about per-key children.
    // Bounded by the factory's own closing brace rather than by end of file, which is bounded by
    // whatever happens to be declared last: the claim is about this function. See issue #314.
    const factory = member(
      code(ADAPTER_SOURCE),
      "export function createGsapOneTweenInterpolator",
      "",
    );
    expect(factory).not.toMatch(/patchKeys/);
    tween.kill();
  });

  it("PK-11 is indistinguishable from a fresh create, on success and on failure", () => {
    const backends: readonly (() => Interpolator)[] = [() => createSeam().interpolator];
    for (const backend of backends) {
      const timeline = backend().create(BASE);
      expect(timeline.patchKeys).toBeTypeOf("function");
      expect(patch(timeline, { x: SLOWER_X })).toBe(true);
      const patched = { ...BASE.keyframes, x: SLOWER_X };
      const fresh = backend().create({ duration: 1, keyframes: patched });
      for (const at of [0, 0.5, 1]) {
        expect(sample(timeline, "x", at)).toBeCloseTo(sample(fresh, "x", at), 6);
        expect(sample(timeline, "y", at)).toBeCloseTo(sample(fresh, "y", at), 6);
      }

      const declined = backend().create(EASED);
      expect(patch(declined, { y: COLLIDING_Y })).toBe(false);
      const effective = { ...EASED.keyframes, y: COLLIDING_Y };
      const recompile = (): InterpolationTimeline =>
        backend().create({ duration: 1, keyframes: effective });
      expect(recompile).toThrow(KeyframeCompilationError);

      timeline.kill();
      fresh.kill();
      declined.kill();
    }
  });
});
