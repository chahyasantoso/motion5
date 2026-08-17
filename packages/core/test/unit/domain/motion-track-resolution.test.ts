import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Motion, type MotionOptions } from "../../../src/domain/motion";
import { Track } from "../../../src/domain/track";
import { createManualClock } from "../../../src/ports/clock";
import {
  createFakeInterpolator,
  createFakeScheduler,
  createFakeTrackRegistry,
} from "../../../src/ports/fakes";

// Read the domain source once. C-3 asserts on the source itself, because "Motion never holds a
// compiled Track" is invisible to behavioral tests as long as a cached reference happens to be
// the right one. The source guard is what stops the capture from creeping back in.
const MOTION_SOURCE = readFileSync(
  fileURLToPath(new URL("../../../src/domain/motion.ts", import.meta.url)),
  "utf8",
);

interface SetupOptions {
  readonly stagger?: number;
  readonly disposeTracks?: boolean;
  readonly invalidate?: (progress: number) => void;
}

function setup(ids: readonly string[], options: SetupOptions = {}) {
  const clock = createManualClock();
  const scheduler = createFakeScheduler();
  const interpolator = createFakeInterpolator();
  const registry = createFakeTrackRegistry<Track>();
  const created = new Map<string, Track>();
  for (const id of ids) created.set(id, registry.register(id, new Track({ interpolator })));
  const motion = new Motion({
    clock,
    scheduler,
    tracks: ids.map((id) => ({ id })),
    resolveTrack: registry.resolveTrack,
    stagger: options.stagger,
    disposeTracks: options.disposeTracks,
    invalidate: options.invalidate,
  });
  return { clock, scheduler, interpolator, registry, created, motion };
}

function construct(resolveTrack: unknown): () => Motion {
  const options = {
    clock: createManualClock(),
    scheduler: createFakeScheduler(),
    tracks: [],
    resolveTrack,
  } as unknown as MotionOptions;
  return () => new Motion(options);
}

describe("Motion resolves Tracks by id", () => {
  it("C-1 requires an injected resolveTrack function", () => {
    // The resolver has no default. A Motion with no way to reach its Tracks is never valid.
    expect(construct(undefined)).toThrow(/Motion requires a resolveTrack function\./);
    expect(construct(null)).toThrow(/Motion requires a resolveTrack function\./);
    expect(construct({})).toThrow(/Motion requires a resolveTrack function\./);
    expect(construct(1)).toThrow(/Motion requires a resolveTrack function\./);
  });

  it("C-2 exposes entries carrying ids and durations, never Track instances", () => {
    // The published entry shape is the contract: no consumer can pull a Track out of a Motion.
    const { motion } = setup(["a"]);
    const entry = motion.tracks[0]!;
    expect("track" in entry).toBe(false);
    expect(Object.keys(entry)).toEqual(["id"]);
  });

  it("C-3 never captures a compiled Track anywhere in the domain source", () => {
    expect(MOTION_SOURCE).not.toMatch(/entry\.track/);
    expect(MOTION_SOURCE).not.toMatch(/\.track\.setProgress/);
    expect(MOTION_SOURCE).not.toMatch(/#trackMap\.get\(.*\)\.track/);
    expect(MOTION_SOURCE).toMatch(/import type \{ Track \} from "\.\/track";/);
    expect(MOTION_SOURCE).not.toMatch(/^import \{ Track \}/m);
  });

  it("C-4 resolves per call, so a Track registered after construction still advances", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const interpolator = createFakeInterpolator();
    const registry = createFakeTrackRegistry<Track>();
    const motion = new Motion({
      clock,
      scheduler,
      tracks: [{ id: "late" }],
      resolveTrack: registry.resolveTrack,
    });
    // Nothing was registered at construction time, so a captured reference could not exist.
    const track = registry.register("late", new Track({ interpolator }));
    motion.seek(0.5);
    expect(track.progress).toBe(0.5);
  });

  it("C-5 drives the currently registered Track, never a captured one", () => {
    // The entire class of bug option C removes. Issue #114 was one instance of it: the runtime
    // swapped the compiled Track and the Motion kept driving the retired object.
    const { motion, registry, interpolator, created } = setup(["arm"]);
    const first = created.get("arm")!;
    motion.seek(0.5);
    expect(first.progress).toBe(0.5);
    const second = registry.register("arm", new Track({ interpolator }));
    motion.seek(0.75);
    expect(second.progress).toBe(0.75);
    // Nobody told the Motion about the swap, and it never touched the retired Track again.
    expect(first.progress).toBe(0.5);
  });

  it("C-6 finishes the sweep and invalidates before reporting unresolved ids", () => {
    // Issue #114 symptoms 1 and 2: one bad track must not skip siblings or suppress invalidation.
    const seen: number[] = [];
    const { motion, registry, created } = setup(["track-0", "track-1", "track-2"], {
      invalidate: (progress) => seen.push(progress),
    });
    registry.drop("track-1");
    expect(() => motion.seek(0.5)).toThrow(/Motion tracks have no compiled Track: track-1\./);
    expect(created.get("track-0")!.progress).toBe(0.5);
    expect(created.get("track-2")!.progress).toBe(0.5);
    expect(seen).toEqual([0.5]);
    expect(motion.position).toBe(0.5);
  });

  it("C-7 disposes best effort, tolerating an id the resolver no longer knows", () => {
    // Disposal must never throw. A dropped id is a no-op and the resolvable Tracks still die.
    const { motion, registry, created } = setup(["a", "b", "c"], { disposeTracks: true });
    registry.drop("b");
    expect(() => motion.dispose()).not.toThrow();
    expect(() => created.get("a")!.compose()).toThrow(/Track is disposed/);
    expect(() => created.get("c")!.compose()).toThrow(/Track is disposed/);
    expect(created.get("b")!.compose().progress).toBe(0);
  });

  it("C-8 keeps replaceTrack narrowed to duration, index, and re-seeded progress", () => {
    // Option A's job minus the reference swap. ADR-029's index guarantee still holds.
    const { motion, registry, interpolator } = setup(["a", "b"]);
    motion.seek(0.5);
    const replacement = registry.register("a", new Track({ interpolator }));
    motion.replaceTrack({ id: "a", duration: 200 });
    expect(motion.tracks.map(({ id }) => id)).toEqual(["a", "b"]);
    expect(replacement.progress).toBe(0.5);
    expect(() => motion.replaceTrack({ id: "missing" })).toThrow(/Unknown Motion track id/);
    expect(() => motion.replaceTrack({ id: "a", duration: 0 })).toThrow(
      /Motion track duration must be a finite positive number/,
    );
  });

  it("C-9 failed addTrack is atomic when the compiled Track is unavailable", () => {
    // A rejected mutation must not leave a ghost id that poisons the next progress sweep.
    const { motion } = setup([]);
    expect(() => motion.addTrack({ id: "missing" })).toThrow(
      'Motion track "missing" has no compiled Track.',
    );
    expect(motion.tracks).toEqual([]);
    expect(() => motion.seek(0.5)).not.toThrow();
  });

  it("C-10 failed replaceTrack preserves the prior entry and can be retried", () => {
    // Failed replacement must not overwrite live metadata before its new compiled Track exists.
    const { motion, registry, interpolator } = setup(["arm"]);
    const before = motion.tracks[0];
    registry.drop("arm");
    expect(() => motion.replaceTrack({ id: "arm", duration: 200 })).toThrow(
      'Motion track "arm" has no compiled Track.',
    );
    expect(motion.tracks[0]).toBe(before);
    registry.register("arm", new Track({ interpolator }));
    expect(() => motion.replaceTrack({ id: "arm", duration: 200 })).not.toThrow();
    expect(motion.tracks[0]?.duration).toBe(200);
  });
});
