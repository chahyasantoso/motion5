import { describe, expect, it, vi } from "vitest";
import type { MotionDefinition, TriggerSignal } from "../../src/contract/v5";
import { Motion } from "../../src/domain/motion";
import { Track } from "../../src/domain/track";
import { Engine } from "../../src/engine";
import type { ScrollSource } from "../../src/adapters/scroll-trigger";
import { createTriggerFactory } from "../../src/adapters/trigger-factory/default";
import { createManualClock } from "../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
} from "../../src/testing/fakes";
import { createManualTriggerPort } from "../../src/ports/trigger";

const DRIVER_BACKED =
  "Motion has a configured trigger driver and does not accept external signals.";

/**
 * One compiled Track behind the shared registry fake, with spies wrapping the real methods rather
 * than replacing the object. That keeps every retained assertion in this file at its exact shape
 * and values while the `as never` track double disappears. A `vi.fn()` double would only trade
 * that cast for `as unknown as Track`, because the registry fake is typed to Track.
 */
function registerTrack(id: string) {
  const registry = createFakeTrackRegistry<Track>();
  const track = registry.register(
    id,
    new Track({ interpolator: createFakeInterpolator(), nodeId: `~/trigger-${id}` }),
  );
  return {
    resolveTrack: registry.resolveTrack,
    setProgress: vi.spyOn(track, "setProgress"),
    dispose: vi.spyOn(track, "dispose"),
  };
}

function ramp(id: string) {
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

function motionOf(id: string, trigger: MotionDefinition["trigger"]): MotionDefinition {
  return { id, trigger, tracks: [ramp("arm")] };
}

const HERO: ScrollSource = { subscribe: () => () => undefined };

/** Loads one authored Motion through the real factory. Only a scroll trigger asks the resolver. */
function loadOne(motion: MotionDefinition) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const handle = new Engine({
    clock,
    interpolator: createFakeInterpolator(),
    scheduler,
    triggerFactory: createTriggerFactory({ scroll: () => HERO }),
  }).load({ schemaVersion: 5, motions: [motion] });
  handle.mount(`${motion.id}/arm`);
  return { clock, scheduler, handle };
}

interface TypeCase {
  readonly motion: MotionDefinition;
  readonly acceptsSignal: boolean;
  readonly afterTick: Readonly<Record<string, number>>;
}

describe("Motion trigger types and clock ownership", () => {
  it("T-11 gives each trigger type its own input path instead of the manual one", () => {
    // Replaces the three retired cases that asserted manual, scroll, and time "use the same
    // scheduled progress path". That claim is exactly the inert semantics T5 removes, and they
    // asserted it by constructing Motion around a manual port directly, so they stayed green no
    // matter what the factory did. trigger-time.test.ts and trigger-scroll.test.ts already prove
    // each type in isolation, and isolation is how a fallback hides, so the contrast is asserted
    // here side by side: whether signal() is accepted, and whether the project clock moves it.
    const cases: readonly TypeCase[] = [
      {
        motion: motionOf("manualMotion", { type: "manual" }),
        acceptsSignal: true,
        // No authored duration, so Motion's own advance divides by 1 and one tick pins it to 1.
        afterTick: { x: 100 },
      },
      {
        motion: motionOf("timeMotion", { type: "time", duration: 1000 }),
        acceptsSignal: false,
        afterTick: { x: 25 },
      },
      {
        motion: motionOf("scrollMotion", { type: "scroll", source: "hero" }),
        acceptsSignal: false,
        // Push-driven, so there is no clock consumer at all and the tick reaches nothing.
        afterTick: { x: 0 },
      },
    ];

    for (const { motion, acceptsSignal, afterTick } of cases) {
      const { clock, scheduler, handle } = loadOne(motion);
      const signal: TriggerSignal = { type: motion.trigger.type, progress: 0.5 };
      const attempt = () => handle.signal(motion.id, signal);
      if (acceptsSignal) expect(attempt).not.toThrow();
      else expect(attempt).toThrow(DRIVER_BACKED);

      clock.tick(250);
      scheduler.flush();
      // Publishing nothing at all is the scroll expectation, so the fallback keeps the shape.
      expect(handle.get(`${motion.id}/arm`)?.values ?? { x: 0 }).toEqual(afterTick);
      handle.dispose();
    }
  });

  it("T-12 lets seek scrub a driver-backed node and lets the driver overwrite it", () => {
    // ADR-021 and T5-5. seek is node-level scrubbing, signal() is Motion-level control, and seek
    // is deliberately not gated by acceptsExternalSignal. Pinning the interaction in executable
    // form documents it without merging the two; gating it would need a new decision.
    const timed = motionOf("timed", { type: "time", duration: 1000 });
    const { clock, scheduler, handle } = loadOne(timed);

    handle.seek("timed/arm", 0.9);
    expect(handle.get("timed/arm")?.values).toEqual({ x: 90 });

    clock.tick(250);
    scheduler.flush();
    expect(handle.get("timed/arm")?.values).toEqual({ x: 25 });

    handle.dispose();
  });

  it("advances from the one injected clock and rejects control after disposal", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const current = registerTrack("track");
    const motion = new Motion({
      clock,
      scheduler,
      tracks: [{ id: "track", duration: 1000 }],
      resolveTrack: current.resolveTrack,
      invalidate: vi.fn(),
      disposeTracks: true,
    });

    motion.play();
    clock.tick(250);
    scheduler.flush();
    expect(motion.position).toBeCloseTo(0.25, 12);
    expect(current.setProgress).toHaveBeenLastCalledWith(0.25);

    motion.dispose();
    expect(() => motion.signal({ type: "manual", progress: 0.5 })).toThrow("destroyed");
    expect(() => motion.play()).toThrow("destroyed");
    expect(current.dispose).toHaveBeenCalledTimes(1);
  });

  it("cancels queued trigger work when paused and does not duplicate on remount", () => {
    const scheduler = createFakeScheduler();
    const current = registerTrack("track");
    const trigger = createManualTriggerPort();
    const motion = new Motion({
      clock: createManualClock(),
      scheduler,
      trigger,
      tracks: [{ id: "track" }],
      resolveTrack: current.resolveTrack,
      listenToClock: false,
    });

    motion.play();
    motion.signal({ type: "manual", progress: 0.2 });
    motion.pause();
    scheduler.flush();
    expect(current.setProgress).not.toHaveBeenCalled();

    motion.play();
    motion.signal({ type: "manual", progress: 0.8 });
    scheduler.flush();
    expect(current.setProgress).toHaveBeenCalledTimes(1);
    expect(current.setProgress).toHaveBeenLastCalledWith(0.8);
    motion.dispose();
  });
});
