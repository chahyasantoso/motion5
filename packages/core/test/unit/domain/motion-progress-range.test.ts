import { describe, expect, it, vi } from "vitest";
import { Motion } from "../../../src/domain/motion";
import { Track } from "../../../src/domain/track";
import { createManualClock } from "../../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
  createFakeTriggerPort,
} from "../../../src/ports/fakes";
import { createManualTriggerPort } from "../../../src/ports/trigger";

interface MountOptions {
  readonly playing?: boolean;
}
function mounted({ playing = true }: MountOptions = {}) {
  const scheduler = createFakeScheduler();
  const registry = createFakeTrackRegistry<Track>();
  const interpolator = createFakeInterpolator();
  const track = registry.register("track", new Track({ interpolator }));
  const trigger = createManualTriggerPort();
  const motion = new Motion({
    clock: createManualClock(),
    scheduler,
    trigger,
    tracks: [{ id: "track" }],
    resolveTrack: registry.resolveTrack,
    listenToClock: false,
  });
  if (playing) motion.play();
  else motion.mount();
  return { motion, trigger, scheduler, setProgress: vi.spyOn(track, "setProgress") };
}

describe("Motion owns the trigger progress range once", () => {
  it("R-1 rejects an out-of-range port emission exactly as signal() rejects it", () => {
    const { motion, trigger, scheduler, setProgress } = mounted();
    expect(() => motion.signal({ type: "manual", progress: 1.5 })).toThrow(RangeError);
    expect(() => trigger.emit(1.5)).toThrow(RangeError);
    scheduler.flush();
    expect(setProgress).not.toHaveBeenCalled();
    motion.dispose();
  });

  it("R-2 rejects a non-finite emission at the boundary instead of poisoning position", () => {
    const { motion, trigger, scheduler } = mounted();
    expect(() => motion.signal({ type: "manual", progress: Number.NaN })).toThrow(TypeError);
    expect(() => trigger.emit(Number.NaN)).toThrow(TypeError);
    expect(scheduler.pending).toHaveLength(0);
    expect(motion.position).toBe(0);
    motion.dispose();
  });

  it("R-3 rejects a malformed emission on a mounted Motion that is not playing", () => {
    const { motion, trigger } = mounted({ playing: false });
    expect(motion.playing).toBe(false);
    expect(motion.state).toBe("mounted");
    expect(() => trigger.emit(2)).toThrow(RangeError);
    motion.dispose();
  });

  it("R-5 detaches a paused Motion's port instead of swallowing an emission", () => {
    const trigger = createFakeTriggerPort();
    const registry = createFakeTrackRegistry<Track>();
    registry.register("track", new Track({ interpolator: createFakeInterpolator() }));
    const motion = new Motion({
      clock: createManualClock(),
      scheduler: createFakeScheduler(),
      trigger,
      tracks: [{ id: "track" }],
      resolveTrack: registry.resolveTrack,
      listenToClock: false,
    });
    motion.play();
    expect(trigger.subscriberCount).toBe(1);
    motion.pause();
    expect(trigger.subscriberCount).toBe(0);
    expect(() => trigger.emit(2)).not.toThrow();
    motion.dispose();
  });
});
