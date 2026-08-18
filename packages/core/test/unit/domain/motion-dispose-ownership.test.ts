import { describe, expect, it, vi } from "vitest";
import type { MotionDefinition } from "../../../src/contract/v5";
import { Motion } from "../../../src/domain/motion";
import { Engine } from "../../../src/engine";
import { createManualClock } from "../../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTriggerPort,
} from "../../../src/ports/fakes";
import type { CreatedTrigger, TriggerFactory } from "../../../src/ports/trigger-factory";

describe("Motion compiled Track disposal ownership", () => {
  it("C-14 does not dispose resolver-owned Tracks when Motion is disposed", () => {
    // The resolver owner, not Motion, must dispose compiled Tracks. Otherwise the resolver's
    // single-owner contract is false and a shared Track can be killed by an unrelated Motion.
    const track = { setProgress: vi.fn(), dispose: vi.fn() };
    const motion = new Motion({
      clock: createManualClock(),
      scheduler: createFakeScheduler(),
      tracks: [{ id: "arm" }],
      resolveTrack: () => track as never,
    });

    motion.dispose();

    expect(track.dispose).not.toHaveBeenCalled();
  });

  it("C-15 does not dispose the replacement returned by a resolver after a swap", () => {
    // A resolver can rotate compiled instances independently. Motion teardown must not dispose
    // either instance because it does not own their lifetime.
    const first = { setProgress: vi.fn(), dispose: vi.fn() };
    const second = { setProgress: vi.fn(), dispose: vi.fn() };
    let current = first;
    const motion = new Motion({
      clock: createManualClock(),
      scheduler: createFakeScheduler(),
      tracks: [{ id: "arm" }],
      resolveTrack: () => current as never,
    });

    current = second;
    motion.dispose();

    expect(first.dispose).not.toHaveBeenCalled();
    expect(second.dispose).not.toHaveBeenCalled();
  });

  it("C-16 keeps a shared Track usable after one Motion is disposed", () => {
    // Disposal by one consumer must not kill a Track still resolved by another consumer.
    const track = { setProgress: vi.fn(), dispose: vi.fn() };
    const createMotion = () =>
      new Motion({
        clock: createManualClock(),
        scheduler: createFakeScheduler(),
        tracks: [{ id: "arm" }],
        resolveTrack: () => track as never,
      });
    const first = createMotion();
    const second = createMotion();

    first.dispose();
    second.seek(0.75);

    expect(track.dispose).not.toHaveBeenCalled();
    expect(track.setProgress).toHaveBeenCalledWith(0.75);
  });
});

const PLAY_FAILURE = "play() failed after the lifecycle mounted.";

type FakePort = ReturnType<typeof createFakeTriggerPort>;

interface FakeTriggers {
  readonly factory: TriggerFactory;
  /** One port per Motion, in creation order, each with an observable subscriber count. */
  readonly ports: readonly FakePort[];
  readonly disposals: number;
}

/**
 * Manual-shaped triggers. Nothing here is under test; the ports are the observation surface, and
 * the outer dispose counter is what proves releaseMotion's half of the teardown still runs once.
 */
function fakeTriggers(): FakeTriggers {
  const ports: FakePort[] = [];
  let disposals = 0;
  const factory: TriggerFactory = {
    create(): CreatedTrigger {
      const port = createFakeTriggerPort();
      ports.push(port);
      return {
        port,
        acceptsExternalSignal: true,
        clockBinding: { kind: "motion" },
        dispose() {
          disposals += 1;
          port.dispose();
        },
      };
    },
  };
  return {
    factory,
    ports,
    get disposals() {
      return disposals;
    },
  };
}

interface MotionProbe {
  /** Every Motion that reached play(), in creation order. */
  readonly built: readonly Motion[];
  disposals(motion: Motion): number;
  restore(): void;
}

/**
 * Patches the prototype instead of injecting a double, because Engine builds its Motions inside a
 * closure and publishes neither the instance nor a dispose counter. That unreachability is the
 * defect in issue #134 rather than an accident of the test, and it is why T4's counting factory
 * could not see this: it counts trigger disposals, not Motion disposals. play() runs for real
 * before it throws, so the failure lands where the issue puts it, after the lifecycle mounted and
 * after the trigger subscription attached.
 */
function probeMotion(failAtPlayCall: number): MotionProbe {
  const realPlay = Motion.prototype.play;
  const realDispose = Motion.prototype.dispose;
  const built: Motion[] = [];
  const disposals = new Map<Motion, number>();
  Motion.prototype.play = function play(this: Motion) {
    built.push(this);
    realPlay.call(this);
    if (built.length === failAtPlayCall) throw new Error(PLAY_FAILURE);
  };
  Motion.prototype.dispose = function dispose(this: Motion) {
    disposals.set(this, (disposals.get(this) ?? 0) + 1);
    realDispose.call(this);
  };
  return {
    built,
    disposals: (motion) => disposals.get(motion) ?? 0,
    restore() {
      Motion.prototype.play = realPlay;
      Motion.prototype.dispose = realDispose;
    },
  };
}

function manual(id: string): MotionDefinition {
  return { id, trigger: { type: "manual" }, tracks: [] };
}

function loadWith(factory: TriggerFactory, motions: readonly MotionDefinition[]) {
  const engine = new Engine({
    clock: createManualClock(),
    interpolator: createFakeInterpolator(),
    scheduler: createFakeScheduler(),
    triggerFactory: factory,
  });
  return engine.load({ schemaVersion: 5, motions });
}

describe("Motion disposal ownership when a build fails", () => {
  it("C-21 disposes a Motion that was built but never returned", () => {
    // Issue #134. buildMotion's catch released the clock consumer and the created trigger and
    // stopped there. The instance is never returned on that path, so it never enters Engine's
    // motions map, so disposeComposition cannot find it either. Nothing could. ADR-032 says
    // disposal is exactly once; here it was exactly zero.
    const triggers = fakeTriggers();
    const probe = probeMotion(1);
    try {
      expect(() => loadWith(triggers.factory, [manual("scene")])).toThrow(PLAY_FAILURE);

      expect(probe.built).toHaveLength(1);
      const leaked = probe.built[0]!;
      // Exactly once, not at least once. A 2 would mean a second owner also disposes Motions.
      expect(probe.disposals(leaked)).toBe(1);
      // The damage a dispose counter alone would miss: play() had already mounted the lifecycle
      // and attached the trigger subscription before it threw, and both outlived the failure.
      expect(leaked.state).toBe("destroyed");
      expect(triggers.ports[0]!.subscriberCount).toBe(0);
      // releaseMotion's half of the teardown must stay exactly as it was.
      expect(triggers.disposals).toBe(1);
    } finally {
      probe.restore();
    }
  });

  it("C-22 disposes each built Motion exactly once when a later build fails", () => {
    // The two catches must not overlap. Engine's outer catch owns the Motions already in the map;
    // buildMotion's catch owns the one that never got there. A fix bolted into the outer catch
    // instead would dispose the first Motion twice and the second not at all.
    const triggers = fakeTriggers();
    const probe = probeMotion(2);
    const motions = [manual("first"), manual("second")];
    try {
      expect(() => loadWith(triggers.factory, motions)).toThrow(PLAY_FAILURE);

      expect(probe.built).toHaveLength(2);
      for (const motion of probe.built) {
        expect(probe.disposals(motion)).toBe(1);
        expect(motion.state).toBe("destroyed");
      }
      // No port keeps a listener, and every created trigger is disposed exactly once.
      expect(triggers.ports.map((port) => port.subscriberCount)).toEqual([0, 0]);
      expect(triggers.disposals).toBe(2);
    } finally {
      probe.restore();
    }
  });
});
