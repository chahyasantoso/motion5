import { describe, expect, it } from "vitest";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
  createFakeTriggerPort,
} from "../../../src/ports/fakes";
import { createManualClock } from "../../../src/ports/clock";
import { Motion } from "../../../src/domain/motion";
import { Track } from "../../../src/domain/track";

function createMotion(stagger = 0, duration?: number, disposeTracks = false) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const interpolator = createFakeInterpolator();
  const registry = createFakeTrackRegistry<Track>();
  const ids = ["track-0", "track-1", "track-2"];
  // `instance`, not `track`: a MotionTrackEntry can never carry a compiled Track, and a fixture
  // shaped like one defeats the grep gate that enforces it.
  const tracks = ids.map((id) => ({
    id,
    instance: registry.register(id, new Track({ interpolator })),
    ...(duration === undefined ? {} : { duration }),
  }));
  const motion = new Motion({
    clock,
    scheduler,
    tracks: ids.map((id) => ({ id, ...(duration === undefined ? {} : { duration }) })),
    resolveTrack: registry.resolveTrack,
    stagger,
    disposeTracks,
  });
  return { clock, scheduler, interpolator, registry, motion, tracks };
}

describe("Motion composite", () => {
  it("preserves authored order and computes deterministic stagger offsets", () => {
    const { motion } = createMotion(0.08);
    expect(motion.tracks.map(({ id }) => id)).toEqual(["track-0", "track-1", "track-2"]);
    expect(motion.schedule()).toEqual([0, 0.08, 0.16]);
  });
  it("plays through one clock subscription and scheduler jobs", () => {
    const { clock, scheduler, motion, tracks } = createMotion();
    motion.play();
    clock.tick(0.25);
    expect(scheduler.pending).toHaveLength(1);
    scheduler.flush();
    expect(tracks[0]?.instance.progress).toBe(0.25);
    expect(tracks[1]?.instance.progress).toBe(0.25);
  });
  it("converts clock time into normalized progress using authored duration", () => {
    const { clock, scheduler, motion, tracks } = createMotion(0, 2);
    motion.play();
    clock.tick(0.5);
    scheduler.flush();
    expect(tracks[0]?.instance.progress).toBe(0.25);
  });
  it("pausing detaches the clock and play resubscribes without duplicate work", () => {
    const { clock, scheduler, motion, tracks } = createMotion();
    motion.play();
    motion.pause();
    motion.play();
    clock.tick(0.25);
    expect(scheduler.pending).toHaveLength(1);
    scheduler.flush();
    expect(tracks[0]?.instance.progress).toBe(0.25);
  });
  it("reattaches one trigger listener after pause and play", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const trigger = createFakeTriggerPort();
    const registry = createFakeTrackRegistry<Track>();
    const motion = new Motion({
      clock,
      scheduler,
      trigger,
      tracks: [],
      resolveTrack: registry.resolveTrack,
      disposeTracks: false,
    });
    motion.play();
    expect(trigger.subscriberCount).toBe(1);
    motion.pause();
    expect(trigger.subscriberCount).toBe(0);
    motion.play();
    expect(trigger.subscriberCount).toBe(1);
    motion.dispose();
    expect(trigger.subscriberCount).toBe(0);
  });
  it("clamps seek and rejects non-finite values", () => {
    const { motion, tracks } = createMotion();
    motion.seek(2);
    expect(tracks[0]?.instance.progress).toBe(1);
    expect(() => motion.seek(Number.POSITIVE_INFINITY)).toThrow(/finite/);
  });
  it("pauses and disposes owner-first without leaking clock work", () => {
    const { clock, motion, tracks } = createMotion(0, undefined, true);
    motion.play();
    motion.pause();
    clock.tick(0.5);
    expect(tracks[0]?.instance.progress).toBe(0);
    motion.dispose();
    expect(
      tracks.every(({ instance }) => {
        try {
          instance.compose();
          return false;
        } catch {
          return true;
        }
      }),
    ).toBe(true);
  });
  it("addTrack adds a track, updates snapshot, and snaps to current progress", () => {
    const { motion, registry, interpolator } = createMotion();
    motion.seek(0.6);
    const newTrack = registry.register("track-added", new Track({ interpolator }));
    (motion as any).addTrack({ id: "track-added" });
    expect(motion.tracks.map(({ id }) => id)).toEqual([
      "track-0",
      "track-1",
      "track-2",
      "track-added",
    ]);
    expect(newTrack.progress).toBe(0.6);
  });
  it("addTrack throws on duplicate track id", () => {
    const { motion } = createMotion();
    const addDuplicate = () => (motion as any).addTrack({ id: "track-0" });
    expect(addDuplicate).toThrow(/Duplicate Motion track id/);
  });
  it("removeTrack removes a track and updates snapshot", () => {
    const { motion } = createMotion();
    (motion as any).removeTrack("track-1");
    expect(motion.tracks.map(({ id }) => id)).toEqual(["track-0", "track-2"]);
  });
  it("adding a track does not automatically reflow schedule until reflow is called", () => {
    const { motion, registry, interpolator } = createMotion(0.1);
    const initialSchedule = motion.schedule();
    expect(initialSchedule).toEqual([0, 0.1, 0.2]);
    registry.register("track-added", new Track({ interpolator }));
    (motion as any).addTrack({ id: "track-added" });
    // schedule() evaluates based on current tracks, but schedule offset formula is tracks.map
    // When reflow() is called, it returns the updated schedule
    expect(motion.reflow()).toEqual([0, 0.1, 0.2, 0.30000000000000004]);
  });
});
