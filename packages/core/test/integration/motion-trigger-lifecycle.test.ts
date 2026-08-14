import { describe, expect, it, vi } from "vitest";
import { Motion } from "../../src/domain/motion";
import { createTrigger } from "../../src/domain/triggers";
import { createManualClock } from "../../src/ports/clock";
import { createFakeScheduler } from "../../src/ports/fakes";

function createTrack() {
  return {
    setProgress: vi.fn(),
    dispose: vi.fn(),
  };
}

describe("Motion and trigger lifecycle", () => {
  it("routes trigger progress through Track and invalidates the owning runtime", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const trigger = createTrigger("manual");
    const track = createTrack();
    const invalidate = vi.fn();
    const motion = new Motion({
      clock,
      scheduler,
      trigger,
      invalidate,
      tracks: [{ id: "arm", track: track as never }],
    });

    motion.play();
    trigger.signal({ type: "manual", progress: 0.5 });
    scheduler.flush();

    expect(track.setProgress).toHaveBeenCalledWith(0.5);
    expect(invalidate).toHaveBeenCalledWith(0.5);
    expect(motion.position).toBe(0.5);

    motion.pause();
    trigger.signal({ type: "manual", progress: 0.75 });
    scheduler.flush();
    expect(track.setProgress).toHaveBeenCalledTimes(1);
    expect(invalidate).toHaveBeenCalledTimes(1);

    motion.play();
    trigger.signal({ type: "manual", progress: 1 });
    scheduler.flush();
    expect(track.setProgress).toHaveBeenLastCalledWith(1);
    expect(invalidate).toHaveBeenLastCalledWith(1);

    motion.dispose();
    expect(track.dispose).toHaveBeenCalledTimes(1);
  });
});
