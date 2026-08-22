import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { Motion } from "../../src/domain/motion";
import { Track } from "../../src/domain/track";
import { createManualClock } from "../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
  createFakeTriggerPort,
} from "../../src/testing/fakes";
import { createManualTriggerPort, assertTriggerPort } from "../../src/ports/trigger";

describe("Phase 3: TriggerPort Migration & Boundary Neutrality", () => {
  const project: ProjectDefinition = {
    schemaVersion: 5,
    motions: [
      {
        id: "hero",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "t1",
            keyframes: {
              x: {
                stops: [
                  { p: 0, v: 0 },
                  { p: 1, v: 100 },
                ],
              },
            },
          },
        ],
      },
    ],
  };

  it("1. Port lifecycle: subscribe, emit, unsubscribe, and resubscribe cleanly", () => {
    const port = createManualTriggerPort();
    assertTriggerPort(port);

    const received: number[] = [];
    const unsubscribe1 = port.subscribe((p) => received.push(p));

    port.emit(0.25);
    expect(received).toEqual([0.25]);

    unsubscribe1();
    port.emit(0.5);
    expect(received).toEqual([0.25]);

    const unsubscribe2 = port.subscribe((p) => received.push(p));
    port.emit(0.75);
    expect(received).toEqual([0.25, 0.75]);

    unsubscribe2();
    port.dispose();
  });

  it("2. Core validation boundary: NaN, infinite, and out-of-bounds progress are rejected loudly", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const trigger = createManualTriggerPort();
    const track = new Track({
      interpolator: createFakeInterpolator(),
      interpolationConfig: { id: "t1" },
    });
    const registry = createFakeTrackRegistry<Track>();
    registry.register("t1", track);

    const motion = new Motion({
      clock,
      scheduler,
      trigger,
      tracks: [{ id: "t1" }],
      resolveTrack: registry.resolveTrack,
    });

    motion.play();

    // This case asserted silent clamping until issue #138. The clamp was partial, so one rule had
    // three owners and NaN passed all of them. ADR-037 gives the rule a single owner in
    // Motion.#scheduleProgress, which rejects at the emit site rather than deferring to a flush.
    expect(() => trigger.emit(-0.5)).toThrow(RangeError);
    expect(() => trigger.emit(1.5)).toThrow(RangeError);
    expect(() => trigger.emit(Number.NaN)).toThrow(TypeError);
    expect(() => trigger.emit(Number.POSITIVE_INFINITY)).toThrow(TypeError);
    scheduler.flush();
    expect(motion.position).toBe(0);

    // Still a boundary case rather than only a throw: an in-range emission keeps working.
    trigger.emit(0.5);
    scheduler.flush();
    expect(motion.position).toBe(0.5);

    motion.dispose();
  });

  it("3. Manual and custom trigger ports operate without DOM imports in core", () => {
    const fakePort = createFakeTriggerPort();
    const clock = createManualClock();
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");
    let patchValue = 0;
    handle.subscribe("hero/t1", (patch) => {
      patchValue = patch.values.x as number;
    });

    // Custom driver pushes progress into port
    fakePort.emit(0.4);
    handle.signal("hero", { type: "manual", progress: 0.4 });
    scheduler.flush();

    expect(patchValue).toBeCloseTo(40, 1);
    handle.dispose();
    fakePort.dispose();
  });

  it("4. Single clock invariant: attaching TriggerPorts creates zero secondary clock subscriptions", () => {
    const clock = createManualClock();
    const subscribeSpy = vi.spyOn(clock, "subscribe");
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");

    // Exactly 1 clock subscription (owned by ProjectRuntime)
    expect(subscribeSpy).toHaveBeenCalledTimes(1);

    handle.signal("hero", { type: "manual", progress: 0.8 });
    scheduler.flush();

    // Still exactly 1 clock subscription
    expect(subscribeSpy).toHaveBeenCalledTimes(1);
    handle.dispose();
  });

  it("5. Idempotent teardown: pause, unmount, and dispose cleanly detach ports without leaks", () => {
    const fakeTrigger = createFakeTriggerPort();
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const track = new Track({
      interpolator: createFakeInterpolator(),
      interpolationConfig: { id: "t1" },
    });
    const registry = createFakeTrackRegistry<Track>();
    registry.register("t1", track);

    const motion = new Motion({
      clock,
      scheduler,
      trigger: fakeTrigger,
      tracks: [{ id: "t1" }],
      resolveTrack: registry.resolveTrack,
    });

    motion.play();
    expect(fakeTrigger.subscriberCount).toBe(1);

    motion.pause();
    expect(fakeTrigger.subscriberCount).toBe(0);

    // Idempotent pause/dispose
    motion.pause();
    motion.dispose();
    expect(fakeTrigger.subscriberCount).toBe(0);
  });
});
