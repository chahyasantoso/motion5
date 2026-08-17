import { describe, expect, it, vi } from "vitest";
import type { TriggerType } from "../../src/contract/v5";
import { Motion } from "../../src/domain/motion";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/ports/fakes";
import { createManualTriggerPort } from "../../src/ports/trigger";

function track() {
  return { setProgress: vi.fn(), dispose: vi.fn() };
}

describe("Motion trigger types and clock ownership", () => {
  it.each(["manual", "scroll", "time"] as TriggerType[])(
    "%s signals use the same scheduled progress path",
    (type) => {
      const scheduler = createFakeScheduler();
      const current = track();
      const invalidate = vi.fn();
      const motion = new Motion({
        clock: createManualClock(),
        scheduler,
        trigger: createManualTriggerPort(),
        tracks: [{ id: "track" }],
        resolveTrack: () => current as never,
        invalidate,
        listenToClock: false,
      });

      motion.play();
      motion.signal({ type, progress: 0.4 });
      expect(current.setProgress).not.toHaveBeenCalled();
      scheduler.flush();
      expect(current.setProgress).toHaveBeenCalledWith(0.4);
      expect(invalidate).toHaveBeenCalledWith(0.4);
      motion.dispose();
    },
  );

  it("advances from the one injected clock and rejects control after disposal", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const current = track();
    const motion = new Motion({
      clock,
      scheduler,
      tracks: [{ id: "track", duration: 1000 }],
      resolveTrack: () => current as never,
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
    const current = track();
    const trigger = createManualTriggerPort();
    const motion = new Motion({
      clock: createManualClock(),
      scheduler,
      trigger,
      tracks: [{ id: "track" }],
      resolveTrack: () => current as never,
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
