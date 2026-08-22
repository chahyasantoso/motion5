import { describe, expect, it } from "vitest";
import { Motion, type MotionTrackEntry } from "../../../src/domain/motion";
import { Track } from "../../../src/domain/track";
import { createManualClock } from "../../../src/ports/clock";
import type { InterpolationTimeline, Interpolator } from "../../../src/ports/interpolator";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
} from "../../../src/testing/fakes";

const DISPOSED = "Track is disposed.";
const TIMELINE_FAILURE = "interpolation timeline refused the progress";

/**
 * Fails inside Track.setProgress rather than before it, at the one boundary Motion cannot
 * validate: injected interpolator code. This is not a replacement for createFakeInterpolator and
 * not a stand-in for a compiled Track. The Track is real, and this is what makes M-5 evidence
 * about the seeding call itself instead of about disposal.
 */
function throwingInterpolator(): Interpolator {
  return {
    create() {
      return {
        duration: 0,
        state: {},
        progress(value?: number) {
          if (value === undefined) return 0;
          throw new Error(TIMELINE_FAILURE);
        },
        kill() {},
      } as InterpolationTimeline;
    },
  };
}

function fixture(entries: readonly MotionTrackEntry[], stagger?: number) {
  const registry = createFakeTrackRegistry<Track>();
  const motion = new Motion({
    clock: createManualClock(),
    scheduler: createFakeScheduler(),
    tracks: entries,
    resolveTrack: registry.resolveTrack,
    stagger,
  });
  // Registers under an id the registry may already know, because a rotated instance is a normal
  // state under ADR-031 and is how these cases reach a resolvable-but-dead Track.
  const register = (id: string, interpolator: Interpolator = createFakeInterpolator()) =>
    registry.register(id, new Track({ interpolator }));
  return { motion, register };
}

describe("Motion single-track mutation atomicity", () => {
  it("M-1 leaves nothing committed when addTrack cannot seed a resolvable Track", () => {
    // Resolvable and dead at once is a normal state under ADR-031: the registry still maps the
    // id, and the instance's lifetime belongs to whoever owns it. Resolution already runs before
    // any mutation, so this is not the #127 defect; it is the seeding call that follows it.
    const { motion, register } = fixture([]);
    register("arm").dispose();

    expect(() => motion.addTrack({ id: "arm" })).toThrow(DISPOSED);

    expect(motion.tracks).toEqual([]);
    // The retry is the point. A caller told the operation was refused must be able to repeat it
    // once the Track is live; a committed ghost turns that retry into a duplicate-id rejection.
    register("arm");
    expect(() => motion.addTrack({ id: "arm" })).not.toThrow();
    expect(motion.tracks.map(({ id }) => id)).toEqual(["arm"]);
  });

  it("M-2 preserves the prior entry when replaceTrack cannot seed the replacement", () => {
    // A failed replacement must not change live metadata before its Track can accept progress.
    const { motion, register } = fixture([{ id: "arm" }]);
    register("arm").dispose();
    const before = motion.tracks[0];

    expect(() => motion.replaceTrack({ id: "arm", duration: 200 })).toThrow(DISPOSED);

    // By identity, not by shape: the live entry object itself must still be the previous one.
    expect(motion.tracks[0]).toBe(before);
    expect(motion.tracks[0]?.duration).toBeUndefined();
    register("arm");
    expect(() => motion.replaceTrack({ id: "arm", duration: 200 })).not.toThrow();
    expect(motion.tracks[0]?.duration).toBe(200);
  });

  it("M-3 rejects a repeated addTrack identically instead of as a duplicate id", () => {
    // The #trackMap half of the commit, which no assertion on motion.tracks can reach. If the
    // first attempt wrote the map, the second reports Duplicate Motion track id and the ghost
    // stays invisible to every other check in this file.
    const { motion, register } = fixture([]);
    register("arm").dispose();

    expect(() => motion.addTrack({ id: "arm" })).toThrow(DISPOSED);
    expect(() => motion.addTrack({ id: "arm" })).toThrow(DISPOSED);

    expect(motion.tracks).toEqual([]);
  });

  it("M-4 keeps entry identity across repeated replaceTrack failures", () => {
    // Two attempts with different durations, so a partial commit from either one shows up.
    const { motion, register } = fixture([{ id: "arm" }]);
    register("arm").dispose();
    const before = motion.tracks[0];

    expect(() => motion.replaceTrack({ id: "arm", duration: 200 })).toThrow(DISPOSED);
    expect(() => motion.replaceTrack({ id: "arm", duration: 300 })).toThrow(DISPOSED);

    expect(motion.tracks[0]).toBe(before);
    expect(motion.tracks[0]?.duration).toBeUndefined();
  });

  it("M-5 is atomic when the seed fails inside injected interpolator code", () => {
    // Disposal is not the only way the seed can fail, and the guarantee is about the call rather
    // than about disposal. Track.setProgress clamps and then hands the value to the interpolator,
    // so a hostile timeline throws from the same line a disposed Track throws from. Position has
    // to be non-zero first: setProgress short-circuits when the value it is given is current.
    const { motion, register } = fixture([{ id: "arm" }]);
    register("arm");
    motion.seek(0.5);
    register("leg", throwingInterpolator());

    expect(() => motion.addTrack({ id: "leg" })).toThrow(TIMELINE_FAILURE);
    expect(motion.tracks.map(({ id }) => id)).toEqual(["arm"]);

    register("arm", throwingInterpolator());
    const before = motion.tracks[0];
    expect(() => motion.replaceTrack({ id: "arm", duration: 200 })).toThrow(TIMELINE_FAILURE);
    expect(motion.tracks[0]).toBe(before);
  });

  it("M-6 seeds the same progress it always did, staggered and with per-entry durations", () => {
    // The trap in the fix rather than in the bug, and the reason this case exists at all.
    // #effectiveProgress reduces over the entry list for #totalDuration, so seeding against the
    // pre-mutation list changes the number a staggered Motion writes: 0 instead of 0.25 below,
    // and 0.125 instead of 0.375. Exact equality, because a drift here is a behavior change
    // smuggled in under a bug fix.
    const { motion, register } = fixture([{ id: "a", duration: 200 }], 100);
    const a = register("a");
    motion.seek(0.5);
    expect(a.progress).toBe(0.5);

    const b = register("b");
    motion.addTrack({ id: "b", duration: 400 });

    // (0.5 * 400 - 100) / 400, so the prospective total duration of 400 is load bearing.
    expect(b.progress).toBe(0.25);
    // Only the new entry is seeded. addTrack never swept its siblings and still must not.
    expect(a.progress).toBe(0.5);

    motion.replaceTrack({ id: "b", duration: 800 });

    // (0.5 * 800 - 100) / 800, again against the list the mutation is about to commit.
    expect(b.progress).toBe(0.375);
    expect(a.progress).toBe(0.5);
    expect(motion.tracks.map(({ id }) => id)).toEqual(["a", "b"]);
    expect(motion.tracks[1]?.duration).toBe(800);
  });
});
