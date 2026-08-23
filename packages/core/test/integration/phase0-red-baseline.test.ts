import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/testing/fakes";
import type { ProjectRuntime } from "../../src/runtime/project-runtime";

describe("Phase 0 Red Baseline: Engine Path & Dynamic Correctness", () => {
  it("1. Engine time playback: project clock tick advances time motion playhead", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "spinner",
          trigger: { type: "time", duration: 1000 },
          tracks: [
            {
              id: "rotation",
              duration: 1000,
              keyframes: {
                angle: [
                  { p: 0, v: 0 },
                  { p: 1, v: 360 },
                ],
              },
            },
          ],
        },
      ],
    };

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("spinner/rotation");
    let publishedAngle: number | undefined;
    handle.subscribe("spinner/rotation", (patch) => {
      publishedAngle = patch.values.angle as number;
    });

    // Advance clock by 500ms (50% progress)
    clock.tick(500);
    scheduler.flush();

    // Assert that publishedAngle updated to ~180
    expect(publishedAngle).toBeCloseTo(180, 1);
    handle.dispose();
  });

  it("2. Multi-track publication: driving a Motion with 2 tracks publishes both node patches in 1 batch", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
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
                x: [
                  { p: 0, v: 0 },
                  { p: 1, v: 100 },
                ],
              },
            },
            {
              id: "t2",
              keyframes: {
                y: [
                  { p: 0, v: 0 },
                  { p: 1, v: 200 },
                ],
              },
            },
          ],
        },
      ],
    };

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");
    handle.mount("hero/t2");

    const patchesReceived: string[] = [];
    handle.subscribe("hero/t1", (patch) => patchesReceived.push(patch.nodeId));
    handle.subscribe("hero/t2", (patch) => patchesReceived.push(patch.nodeId));

    handle.signal("hero", { type: "manual", progress: 0.5 });
    scheduler.flush();

    // Both tracks must be published
    expect(patchesReceived).toContain("hero/t1");
    expect(patchesReceived).toContain("hero/t2");
    handle.dispose();
  });

  it("3. Adopted-track Engine path: adopted free track compiles keyframes and publishes ready patch", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const project: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "t1" }],
        },
      ],
    };

    const engine = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    });

    const handle = engine.load(project);
    // Access runtime from handle (or internal surface)
    const runtime = (handle as unknown as { _runtime?: ProjectRuntime })._runtime;

    if (runtime) {
      const owner = {};
      const adopted = runtime.adopt(
        {
          id: "cursor",
          keyframes: {
            opacity: [
              { p: 0, v: 0 },
              { p: 1, v: 1 },
            ],
          },
        },
        owner,
      );

      expect(adopted.id).toBe("~/cursor");
      const batch = runtime.seek("~/cursor", 0.5);
      const patch = batch.patches.find((p) => p.nodeId === "~/cursor");
      expect(patch?.status).toBe("ready");
      expect(patch?.values.opacity).toBeCloseTo(0.5, 1);
    } else {
      // If handle doesn't expose _runtime yet, this test fails baseline
      expect(runtime).toBeDefined();
    }
    handle.dispose();
  });

  it("4. Stale scheduled write: paused Motion cancels pending write before scheduler flush", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
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
                x: [
                  { p: 0, v: 0 },
                  { p: 1, v: 100 },
                ],
              },
            },
          ],
        },
      ],
    };

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");
    let updateCount = 0;
    handle.subscribe("hero/t1", () => {
      updateCount++;
    });

    handle.signal("hero", { type: "manual", progress: 0.5 });
    // Dispose/pause before scheduler flushes
    handle.dispose();
    scheduler.flush();

    expect(updateCount).toBe(0);
  });

  it("5. Trigger burst behavior: multiple progress signals before flush coalesce to latest progress", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
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
                x: [
                  { p: 0, v: 0 },
                  { p: 1, v: 100 },
                ],
              },
            },
          ],
        },
      ],
    };

    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);

    handle.mount("hero/t1");
    let lastValue = 0;
    handle.subscribe("hero/t1", (patch) => {
      lastValue = patch.values.x as number;
    });

    // Burst 3 signals before flushing scheduler
    handle.signal("hero", { type: "manual", progress: 0.1 });
    handle.signal("hero", { type: "manual", progress: 0.3 });
    handle.signal("hero", { type: "manual", progress: 0.8 });

    scheduler.flush();
    expect(lastValue).toBeCloseTo(80, 1);
    handle.dispose();
  });
});
