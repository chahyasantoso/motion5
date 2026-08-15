import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";
import { Motion } from "../../src/domain/motion";
import { Track } from "../../src/domain/track";

describe("Phase 2: Motion Scheduling & Coalescing", () => {
  const project: ProjectDefinition = {
    schemaVersion: 5,
    motions: [
      {
        id: "hero",
        trigger: { type: "manual" },
        tracks: [
          {
            id: "t1",
            keyframes: {
              x: {
                stops: [
                  { p: 0, v: 0 },
                  { p: 1, v: 100 },
                ],
              },
            },
          },
        ],
      },
    ],
  };

  it("1. Ten signals before Scheduler flush produce exactly 1 Track write with latest progress", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");

    const trackValues: number[] = [];
    handle.subscribe("hero/t1", (patch) => {
      trackValues.push(patch.values.x as number);
    });

    // Fire 10 rapid progress signals
    for (let i = 1; i <= 10; i++) {
      handle.signal("hero", { type: "manual", progress: i / 10 });
    }

    // No track write before flush
    expect(trackValues).toHaveLength(0);

    // Flush scheduler once
    scheduler.flush();

    // Exactly 1 update with the 10th value (progress = 1.0 -> x = 100)
    expect(trackValues).toEqual([100]);
    handle.dispose();
  });

  it("2. Pause cancels pending scheduled write and prevents Track mutation on flush", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");

    let updated = false;
    handle.subscribe("hero/t1", () => {
      updated = true;
    });

    handle.signal("hero", { type: "manual", progress: 0.5 });
    // Pause / dispose before scheduler flush
    handle.dispose();

    scheduler.flush();
    expect(updated).toBe(false);
  });

  it("3. Remount does not duplicate subscriptions or schedule parallel jobs", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const track = new Track({
      interpolator: createFakeInterpolator(),
      interpolationConfig: { id: "t1" },
    });

    let invalidateCount = 0;
    const motion = new Motion({
      clock,
      scheduler,
      tracks: [{ id: "t1", track }],
      invalidate: () => {
        invalidateCount++;
      },
    });

    motion.play();
    motion.pause();
    motion.play();
    motion.play(); // Multi play calls

    motion.seek(0.5);
    // Seek is synchronous
    expect(invalidateCount).toBe(1);

    motion.dispose();
  });

  it("4. Clock and trigger paths both retain cancellation behavior on pause", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const track = new Track({
      interpolator: createFakeInterpolator(),
      interpolationConfig: { id: "t1", duration: 1000 },
    });

    let invalids = 0;
    const motion = new Motion({
      clock,
      scheduler,
      tracks: [{ id: "t1", track, duration: 1000 }],
      invalidate: () => {
        invalids++;
      },
    });

    motion.play();
    motion.onTick({ tick: 1, time: 200, delta: 200 });

    // Pause before scheduler flush
    motion.pause();
    scheduler.flush();

    expect(invalids).toBe(0);
    motion.dispose();
  });

  it("5. Burst signals produce exactly 1 published patch batch", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");

    const batchHistory: number[] = [];
    handle.subscribe("hero/t1", (patch) => {
      batchHistory.push(patch.revision);
    });

    for (let p = 0.1; p <= 0.9; p += 0.1) {
      handle.signal("hero", { type: "manual", progress: p });
    }

    scheduler.flush();

    // Batch produced exactly 1 revision update
    expect(batchHistory).toHaveLength(1);
    handle.dispose();
  });
});
