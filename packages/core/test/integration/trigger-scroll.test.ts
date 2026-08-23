import { describe, expect, it } from "vitest";
import type { MotionDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import {
  createTriggerFactory,
  type ScrollSourceResolver,
} from "../../src/adapters/trigger-factory/default";

interface FakeScrollSource extends ScrollSource {
  emit(progress: number): void;
  readonly subscriptions: number;
  readonly unsubscribes: number;
}

function track(id = "arm") {
  return {
    id,
    keyframes: {
      x: [
        { p: 0, v: 0 },
        { p: 1, v: 100 },
      ],
    },
  };
}

function source(): FakeScrollSource {
  let listener: ((progress: number) => void) | undefined;
  let subscriptions = 0;
  let unsubscribes = 0;
  return {
    subscribe(fn) {
      subscriptions += 1;
      listener = fn;
      return () => {
        unsubscribes += 1;
        listener = undefined;
      };
    },
    emit(progress) {
      listener?.(progress);
    },
    get subscriptions() {
      return subscriptions;
    },
    get unsubscribes() {
      return unsubscribes;
    },
  };
}

function load(resolve: ScrollSourceResolver, motions: readonly MotionDefinition[]) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
    triggerFactory: createTriggerFactory({ scroll: resolve }),
  }).load({ schemaVersion: 5, motions });
  return { clock, scheduler, handle };
}

function scrollMotion(id = "scene", key = "hero"): MotionDefinition {
  return { id, trigger: { type: "scroll", source: key }, tracks: [track()] };
}

describe("T3 scroll driver", () => {
  it("3.1 drives progress from an injected source and clamps out-of-range emissions", () => {
    const scroll = source();
    const { scheduler, handle } = load(() => scroll, [scrollMotion()]);
    handle.mount("scene/arm");

    // createFakeScheduler defers until flush() and Motion.#scheduleProgress coalesces through it,
    // so an unflushed assertion reads the pre-emission graph. That is what the first version of
    // this test got wrong: the driver was fine, the test never flushed.
    scroll.emit(0.4);
    scheduler.flush();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 40 });

    scroll.emit(2);
    scheduler.flush();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 100 });

    scroll.emit(-1);
    scheduler.flush();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 0 });

    handle.dispose();
  });

  it("3.2 subscribes to the injected source once and unsubscribes exactly once", () => {
    const scroll = source();
    const { handle } = load(() => scroll, [scrollMotion()]);

    expect(scroll.subscriptions).toBe(1);
    expect(scroll.unsubscribes).toBe(0);

    handle.dispose();

    expect(scroll.subscriptions).toBe(1);
    expect(scroll.unsubscribes).toBe(1);
  });

  it("3.3 rejects a missing source with a trigger-driver-unavailable diagnostic", () => {
    const attempt = () =>
      load(
        () => undefined,
        [{ id: "scene", trigger: { type: "scroll", source: "missing" }, tracks: [] }],
      );

    // Rule id, path, motion id, and source key are all contractual per plan section 0.8.
    expect(attempt).toThrow(/^trigger-driver-unavailable at motions\.scene\.trigger\.source:/);
    expect(attempt).toThrow(/Motion "scene"/);
    expect(attempt).toThrow(/source key "missing"/);
  });

  it("3.4 unsubscribes an already resolved source when a later Motion cannot resolve", () => {
    const hero = source();
    const resolve: ScrollSourceResolver = ({ trigger }) =>
      trigger.source === "hero" ? hero : undefined;

    // Ordering is the point. A lone unavailable Motion passes trivially, because the throw
    // happens before any subscription exists. Only a resolved Motion ahead of the failure proves
    // that Engine.load()'s outer catch tears the live source down.
    expect(() =>
      load(resolve, [scrollMotion("hero", "hero"), scrollMotion("orphan", "missing")]),
    ).toThrow(/trigger-driver-unavailable/);

    expect(hero.subscriptions).toBe(1);
    expect(hero.unsubscribes).toBe(1);
  });

  it("registers no clock consumer for a push-driven scroll Motion", () => {
    const scroll = source();
    const { clock, scheduler, handle } = load(() => scroll, [scrollMotion()]);
    handle.mount("scene/arm");

    // Motion.#onTick advances by delta / totalDuration. With no authored duration that divisor is
    // 1, so a scroll Motion that still registers a clock consumer is pinned at progress 1
    // (x: 100) on its very first frame, regardless of scroll position. The fallback default is
    // the whole reason this assertion exists.
    clock.tick(1000);
    scheduler.flush();
    const afterTick = handle.get("scene/arm")?.values ?? { x: 0 };
    expect(afterTick).toEqual({ x: 0 });

    // Only the injected source moves this Motion.
    scroll.emit(0.25);
    scheduler.flush();
    expect(handle.get("scene/arm")?.values).toEqual({ x: 25 });

    handle.dispose();
  });

  it("rejects external signals for scroll Motions", () => {
    const scroll = source();
    const { handle } = load(() => scroll, [scrollMotion()]);

    expect(() => handle.signal("scene", { type: "scroll", progress: 0.5 })).toThrow(
      "Motion has a configured trigger driver and does not accept external signals.",
    );

    handle.dispose();
  });
});
