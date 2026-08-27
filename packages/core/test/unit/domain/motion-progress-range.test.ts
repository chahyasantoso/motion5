import { describe, expect, it, vi } from "vitest";
import { Motion } from "../../../src/domain/motion";
import { Track } from "../../../src/domain/track";
import { createManualClock } from "../../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
  createFakeTriggerPort,
} from "../../../src/testing/fakes";
import { createManualTriggerPort } from "../../../src/ports/trigger";

interface MountOptions {
  /**
   * Mount without playing. That is the reachable form of "attached but not advancing": pause()
   * detaches the trigger subscription outright, so a paused Motion's port has no listener left to
   * reject anything. Case R-5 pins that difference so R-3 is not "repaired" back into it.
   */
  readonly playing?: boolean;
}

/** One Motion behind the shared registry fake, with a spy wrapping the real Track.setProgress. */
function mounted({ playing = true }: MountOptions = {}) {
  const scheduler = createFakeScheduler();
  const registry = createFakeTrackRegistry<Track>();
  const interpolator = createFakeInterpolator();
  const track = registry.register("track", new Track({ interpolator, nodeId: "~/range-track" }));
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
    // Red before ADR-037: emit() clamped to 1 in silence, so the same value carried two
    // contracts depending on which door it entered through.
    expect(() => trigger.emit(1.5)).toThrow(RangeError);
    scheduler.flush();
    expect(setProgress).not.toHaveBeenCalled();
    motion.dispose();
  });

  it("R-2 rejects a non-finite emission at the boundary instead of poisoning position", () => {
    const { motion, trigger, scheduler } = mounted();
    expect(() => motion.signal({ type: "manual", progress: Number.NaN })).toThrow(TypeError);
    // Red before ADR-037: NaN survived both clamps, so the throw was deferred to the scheduler
    // flush and blamed the Track for a value the port handed in, with position already NaN.
    expect(() => trigger.emit(Number.NaN)).toThrow(TypeError);
    expect(scheduler.pending).toHaveLength(0);
    expect(motion.position).toBe(0);
    motion.dispose();
  });

  it("R-3 rejects a malformed emission on a mounted Motion that is not playing", () => {
    // Red before ADR-037: #scheduleProgress returned on the liveness guard before it ever looked
    // at the value, so a Motion that is attached but not advancing swallowed garbage and the port
    // never learned about its own bug.
    const { motion, trigger } = mounted({ playing: false });
    expect(motion.playing).toBe(false);
    expect(motion.state).toBe("mounted");
    expect(() => trigger.emit(2)).toThrow(RangeError);
    motion.dispose();
  });

  it("R-5 detaches a paused Motion's port instead of swallowing an emission", () => {
    // Not red, and not claimed as red. It exists so that nobody restates R-3 in terms of pause()
    // and then adds a fourth owner of the range rule to the manual port to make it pass.
    const trigger = createFakeTriggerPort();
    const registry = createFakeTrackRegistry<Track>();
    const interpolator = createFakeInterpolator();
    registry.register("track", new Track({ interpolator, nodeId: "~/range-track" }));
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
