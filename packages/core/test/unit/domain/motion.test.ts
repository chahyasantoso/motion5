import { describe, expect, it } from "vitest";
import { createFakeInterpolator, createFakeScheduler } from "../../../src/ports/fakes";
import { createManualClock } from "../../../src/ports/clock";
import { Motion } from "../../../src/domain/motion";
import { Track } from "../../../src/domain/track";

function createMotion(stagger = 0) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const interpolator = createFakeInterpolator();
  const tracks = [0, 1, 2].map((index) => ({
    id: `track-${index}`,
    track: new Track({ interpolator }),
  }));
  return { clock, scheduler, motion: new Motion({ clock, scheduler, tracks, stagger }), tracks };
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
    expect(tracks[0]?.track.progress).toBe(0.25);
    expect(tracks[1]?.track.progress).toBe(0.25);
  });

  it("clamps seek and rejects non-finite values", () => {
    const { motion, tracks } = createMotion();
    motion.seek(2);
    expect(tracks[0]?.track.progress).toBe(1);
    expect(() => motion.seek(Number.POSITIVE_INFINITY)).toThrow(/finite/);
  });

  it("pauses and disposes owner-first without leaking clock work", () => {
    const { clock, motion, tracks } = createMotion();
    motion.play();
    motion.pause();
    clock.tick(0.5);
    expect(tracks[0]?.track.progress).toBe(0);
    motion.dispose();
    expect(tracks.every(({ track }) => { try { track.compose(); return false; } catch { return true; } })).toBe(true);
  });
});
