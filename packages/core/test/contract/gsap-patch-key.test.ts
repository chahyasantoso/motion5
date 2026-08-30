import { describe, expect, it } from "vitest";
import {
  createGsapInterpolator,
  type GsapLike,
  type GsapTimelineLike,
  type GsapTweenLike,
} from "../../src/adapters/interpolator/gsap";
import type { InterpolationTimeline } from "../../src/ports/interpolator";
import { createRealGsapOneTweenSeam, createRealGsapSeam, readNumber } from "../support/real-gsap";

/**
 * Issue #222, phase 1 red. One invariant: one animated key's tweens are replaced on the still-live
 * timeline and every reader of `state` sees only the new stops, or the call refuses and changes
 * nothing.
 *
 * `patchKey` does not exist yet, so it is declared locally and cast, exactly as #217's `StaleSeam`
 * and #218's `LiveTrack` were: a test naming a member that does not exist fails `typecheck` and
 * stops `quality` before `npm test`, which is a broken file rather than evidence. `patchable()`
 * asserts the member is a function before every use, so this file fails at an assertion rather than
 * at a `TypeError` from calling `undefined`. Both the local interface and that helper's cast are
 * deleted by the commit that lands the source.
 *
 * Two cases here are already true on `main`, and they are regression guards rather than gaps.
 * `PK-11` pins that the one-tween interpolator never grows a stub, because it has no per-key child
 * to kill. `PK-5` pins that a static leaf is refused structurally, per ADR-050 and `LF-7`.
 *
 * The double records children instead of animating them, so sibling isolation is asserted on
 * retained handle identity rather than on output alone. Anything that depends on real interpolation,
 * on the terminal padding tween, or on GSAP's own duration bookkeeping goes through
 * `test/support/real-gsap.ts` instead, which needs no change for this slice: a real
 * `gsap.timeline()` already has `recent()`.
 */
interface PatchableTimeline extends InterpolationTimeline {
  patchKey?(key: string, leaf: unknown): boolean;
}
/** The capability, asserted present before it is used, so a red run fails on an assertion. */
function patchable(timeline: InterpolationTimeline): (key: string, leaf: unknown) => boolean {
  const candidate = timeline as PatchableTimeline;
  expect(typeof candidate.patchKey).toBe("function");
  return (key, leaf) => candidate.patchKey?.(key, leaf) ?? false;
}

interface RecordedChild extends GsapTweenLike {
  readonly vars: Record<string, unknown>;
  readonly position: number | undefined;
  readonly killed: boolean;
}
function createChild(vars: Record<string, unknown>, position: number | undefined): RecordedChild {
  let killed = false;
  let seconds = typeof vars.duration === "number" ? vars.duration : 0;
  function duration(): number;
  function duration(value: number): GsapTweenLike;
  function duration(value?: number): number | GsapTweenLike {
    if (value === undefined) return seconds;
    seconds = value;
    return child;
  }
  function progress(): number;
  function progress(value: number): GsapTweenLike;
  function progress(value?: number): number | GsapTweenLike {
    if (value === undefined) return 0;
    return child;
  }
  const child: RecordedChild = {
    vars,
    position,
    get killed() {
      return killed;
    },
    duration,
    progress,
    kill() {
      killed = true;
    },
  };
  return child;
}
interface TimelineDouble extends GsapTimelineLike {
  readonly children: readonly RecordedChild[];
  readonly wholeKills: number;
  recent(): RecordedChild | undefined;
}
function createTimelineDouble(): TimelineDouble {
  const children: RecordedChild[] = [];
  let kills = 0;
  let current = 0;
  function duration(): number;
  function duration(value: number): GsapTimelineLike;
  function duration(value?: number): number | GsapTimelineLike {
    if (value === undefined) return 1;
    return timeline;
  }
  function progress(): number;
  function progress(value: number): GsapTimelineLike;
  function progress(value?: number): number | GsapTimelineLike {
    if (value === undefined) return current;
    current = value;
    return timeline;
  }
  const timeline: TimelineDouble = {
    children,
    get wholeKills() {
      return kills;
    },
    duration,
    progress,
    to(_target: Record<string, unknown>, vars: Record<string, unknown>, position?: number) {
      children.push(createChild(vars, position));
      return timeline;
    },
    recent() {
      return children[children.length - 1];
    },
    kill() {
      kills += 1;
    },
  };
  return timeline;
}
interface Seam {
  readonly timeline: InterpolationTimeline;
  readonly created: readonly TimelineDouble[];
}
function create(keyframes: Record<string, unknown>, duration = 1): Seam {
  const created: TimelineDouble[] = [];
  const gsap: GsapLike = {
    timeline() {
      const made = createTimelineDouble();
      created.push(made);
      return made;
    },
  };
  return { timeline: createGsapInterpolator(gsap).create({ duration, keyframes }), created };
}
/** Every child whose vars carry `key`, which is how the adapter marks the property it tweens. */
function childrenOf(seam: Seam, key: string): readonly RecordedChild[] {
  return (seam.created[0]?.children ?? []).filter((child) => key in child.vars);
}
function alive(children: readonly RecordedChild[]): readonly RecordedChild[] {
  return children.filter((child) => !child.killed);
}
/** The terminal padding tween, owned by no key: its only var is `duration`. */
function paddingOf(seam: Seam): readonly RecordedChild[] {
  return (seam.created[0]?.children ?? []).filter((child) => Object.keys(child.vars).length === 1);
}
function sameObjects(left: readonly unknown[], right: readonly unknown[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

const X_TWO = [
  { p: 0, v: 0 },
  { p: 1, v: 100 },
];
const Y_TWO = [
  { p: 0, v: 0 },
  { p: 1, v: 10 },
];
const X_MOVED = [
  { p: 0, v: 0 },
  { p: 0.5, v: 50 },
  { p: 1, v: 10 },
];
/** A first stop after 0%, which is what makes the re-seed observable. */
const X_LATE = [
  { p: 0.5, v: 200 },
  { p: 1, v: 300 },
];
/** A last stop before 100%, which is what makes the padding tween observable. */
const X_EARLY = [
  { p: 0, v: 0 },
  { p: 0.5, v: 100 },
];
const X_EASED = [
  { p: 0, v: 0 },
  { p: 1, v: 100, ease: "power1.in" },
];
const Y_EASED = [
  { p: 0, v: 0 },
  { p: 1, v: 10, ease: "power1.in" },
];
const Y_CLASHING = [
  { p: 0, v: 0 },
  { p: 1, v: 10, ease: "power2.out" },
];
/** Neither entry survives `readCompilableStops`: no position, then a position that is not a number. */
const NOT_STOPS = [{ v: 1 }, { p: "half", v: 2 }];
/** The retired object wrapper the issue's own snippet passes to the compiler. */
const WRAPPED = { stops: X_MOVED };

describe("a patched key is rebuilt on the live timeline, or nothing happens", () => {
  it("PK-1 rebuilds from a bare array and refuses the retired wrapper", () => {
    const seam = create({ x: X_TWO, y: Y_TWO });
    const original = childrenOf(seam, "x");
    expect(original).toHaveLength(1);

    expect(patchable(seam.timeline)("x", X_MOVED)).toBe(true);

    expect(original.every((child) => child.killed)).toBe(true);
    expect(alive(childrenOf(seam, "x"))).toHaveLength(2);

    // The wrapper is the kind ADR-050 retired and `readAuthoredLeaf` refuses by name. It compiles to
    // no stops and emits no diagnostic, so a guard that only reads diagnostics reports success after
    // killing every tween the key had.
    const wrapper = create({ x: X_TWO, y: Y_TWO });
    const before = childrenOf(wrapper, "x");
    expect(patchable(wrapper.timeline)("x", WRAPPED)).toBe(false);
    expect(sameObjects(alive(childrenOf(wrapper, "x")), before)).toBe(true);
  });

  it("PK-2 builds no second timeline and never kills the whole one", () => {
    const seam = create({ x: X_TWO, y: Y_TWO });

    expect(patchable(seam.timeline)("x", X_MOVED)).toBe(true);

    expect(seam.created).toHaveLength(1);
    expect(seam.created[0]?.wholeKills).toBe(0);
  });

  it("PK-3 leaves every sibling child the same object, unkilled", () => {
    const seam = create({ x: X_TWO, y: Y_TWO });
    const siblings = childrenOf(seam, "y");
    const padding = paddingOf(seam);
    expect(siblings).toHaveLength(1);
    expect(padding).toHaveLength(1);

    expect(patchable(seam.timeline)("x", X_MOVED)).toBe(true);

    expect(sameObjects(childrenOf(seam, "y"), siblings)).toBe(true);
    expect(siblings.some((child) => child.killed)).toBe(false);
    expect(padding.some((child) => child.killed)).toBe(false);
  });

  it("PK-4 refuses a key that was never animated, and changes nothing", () => {
    const seam = create({ x: X_TWO });
    const before = { ...seam.timeline.state };

    expect(patchable(seam.timeline)("z", X_MOVED)).toBe(false);

    expect(seam.timeline.state).toEqual(before);
    expect(alive(childrenOf(seam, "x"))).toHaveLength(1);
    expect(seam.created[0]?.wholeKills).toBe(0);
  });

  it("PK-5 refuses a static key, structurally rather than by name", () => {
    const seam = create({ x: X_TWO, w: 5 });

    // A static leaf never enters `compiled.properties` at all, per ADR-050 and `LF-7`, so there is
    // no per-key child to replace and no branch here that knows the word "static".
    expect(patchable(seam.timeline)("w", X_MOVED)).toBe(false);
    expect(seam.timeline.state.w).toBe(5);
  });

  it("PK-6 refuses a leaf whose stops all filter away, without diagnostics", () => {
    const seam = create({ x: X_TWO });
    const before = childrenOf(seam, "x");

    expect(patchable(seam.timeline)("x", NOT_STOPS)).toBe(false);

    // The refusal is the absent compiled property, not a diagnostic: shape belongs to
    // `validateKeyframes`, and the only rule `compilePercentKeyframes` can push is the ease
    // collision below. A guard reading `diagnostics` here would be dead code.
    expect(sameObjects(alive(childrenOf(seam, "x")), before)).toBe(true);
  });

  it("PK-7 refuses a patch that collides with a sibling's ease", () => {
    const seam = create({ x: X_EASED, y: Y_EASED });
    const before = childrenOf(seam, "y");

    // `plugin-contribution-ease-collision` needs two keys at one percent, so a one-entry recompile
    // is structurally blind to it while `engine.ts` would reject the same record on the next real
    // compile. The whole retained record is compiled instead, so a patch sees what a fresh compile
    // sees.
    expect(patchable(seam.timeline)("y", Y_CLASHING)).toBe(false);
    expect(sameObjects(alive(childrenOf(seam, "y")), before)).toBe(true);
  });

  it("PK-8 compiles a later patch against the record an earlier one left", () => {
    const moved = create({ x: X_TWO, y: Y_TWO });
    const patchMoved = patchable(moved.timeline);
    expect(patchMoved("x", X_EASED)).toBe(true);

    // The ease that now collides was introduced by the patch above, so a refusal here can only come
    // from a retained record that moved with it.
    expect(patchMoved("y", Y_CLASHING)).toBe(false);

    const untouched = create({ x: X_TWO, y: Y_TWO });
    expect(patchable(untouched.timeline)("y", Y_CLASHING)).toBe(true);
  });

  it("PK-9 re-seeds the proxy, so state carries only the new stops", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 1, keyframes: { x: X_TWO } });
    timeline.progress(0.5);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(50);

    expect(patchable(timeline)("x", X_LATE)).toBe(true);

    // Killing a tween does not revert `proxy`, and `state` is `proxy`, so 50 survives unless the
    // patch re-seeds the key from the recompiled `initial` and re-applies the current progress.
    expect(seam.created).toHaveLength(1);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(200);
    expect(timeline.progress()).toBeCloseTo(0.5);
  });

  it("PK-10 keeps the total duration and the terminal padding tween", () => {
    const seam = createRealGsapSeam();
    const timeline = seam.interpolator.create({ duration: 2, keyframes: { x: X_TWO } });
    expect(seam.created[0]?.duration()).toBeCloseTo(2);
    timeline.progress(0.25);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(25);

    expect(patchable(timeline)("x", X_EARLY)).toBe(true);

    // A patch that kills the padding tween lets GSAP renormalize against a shorter timeline, and
    // every mapped time silently moves. Asserted against real GSAP's duration, not the shim's.
    expect(seam.created[0]?.duration()).toBeCloseTo(2);
    timeline.progress(0.5);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100);
    timeline.progress(0.75);
    expect(readNumber(timeline.state, "x")).toBeCloseTo(100);
  });

  it("PK-11 leaves the one-tween interpolator without the capability", () => {
    const seam = createRealGsapOneTweenSeam();
    const timeline = seam.interpolator.create({ duration: 1, keyframes: { x: X_TWO } });

    // One `gsap.to` carrying a keyframes map has no per-key child to kill, so a `patchKey` here
    // would be a lie. This is the interface-segregation argument for the member being optional.
    expect((timeline as PatchableTimeline).patchKey).toBeUndefined();
  });

  it("PK-12 is indistinguishable from a fresh create with the same config", () => {
    const seam = createRealGsapSeam();
    const patched = seam.interpolator.create({ duration: 1, keyframes: { x: X_TWO, y: Y_TWO } });
    expect(patchable(patched)("x", X_MOVED)).toBe(true);
    const fresh = seam.interpolator.create({ duration: 1, keyframes: { x: X_MOVED, y: Y_TWO } });

    for (const sample of [0, 0.5, 1]) {
      patched.progress(sample);
      fresh.progress(sample);
      expect(readNumber(patched.state, "x")).toBeCloseTo(readNumber(fresh.state, "x"));
      expect(readNumber(patched.state, "y")).toBeCloseTo(readNumber(fresh.state, "y"));
    }
  });
});
