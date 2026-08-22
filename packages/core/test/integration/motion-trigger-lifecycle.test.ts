import { describe, expect, it, vi } from "vitest";
import { Motion } from "../../src/domain/motion";
import { Track } from "../../src/domain/track";
import { createManualClock } from "../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
} from "../../src/testing/fakes";
import { createManualTriggerPort } from "../../src/ports/trigger";

/**
 * Mechanical replacement for the `as never` track double this suite passed to `resolveTrack`.
 * Spies wrap the real Track methods, so every assertion below keeps its exact shape and values. A
 * `vi.fn()` double would only trade that cast for `as unknown as Track`, because the shared
 * registry fake is typed to Track.
 */
function registerTrack(id: string) {
  const registry = createFakeTrackRegistry<Track>();
  const track = registry.register(id, new Track({ interpolator: createFakeInterpolator() }));
  return {
    resolveTrack: registry.resolveTrack,
    setProgress: vi.spyOn(track, "setProgress"),
    dispose: vi.spyOn(track, "dispose"),
  };
}

describe("Motion and trigger lifecycle", () => {
  it("routes trigger progress through Track and invalidates the owning runtime", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const trigger = createManualTriggerPort();
    const track = registerTrack("arm");
    const invalidate = vi.fn();
    const motion = new Motion({
      clock,
      scheduler,
      trigger,
      invalidate,
      tracks: [{ id: "arm" }],
      resolveTrack: track.resolveTrack,
      disposeTracks: true,
    });

    motion.play();
    trigger.emit(0.5);
    scheduler.flush();

    expect(track.setProgress).toHaveBeenCalledWith(0.5);
    expect(invalidate).toHaveBeenCalledWith(0.5);
    expect(motion.position).toBe(0.5);

    motion.pause();
    trigger.emit(0.75);
    scheduler.flush();
    expect(track.setProgress).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledTimes(1);

    motion.play();
    trigger.emit(1);
    scheduler.flush();
    expect(track.setProgress).toHaveBeenLastCalledWith(1);
    expect(invalidate).toHaveBeenLastCalledWith(1);

    motion.dispose();
    expect(track.dispose).toHaveBeenCalledTimes(1);
  });
});
