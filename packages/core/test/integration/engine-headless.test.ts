import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { PluginRegistry } from "../../src/domain/plugins";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    {
      id: "hero",
      trigger: { type: "manual" },
      tracks: [
        {
          id: "arm",
          keyframes: {
            opacity: {
              stops: [
                { p: 0, v: 0.2 },
                { p: 1, v: 1 },
              ],
            },
          },
        },
      ],
    },
  ],
  freeTracks: [{ id: "cursor" }],
};

describe("Engine", () => {
  it("publishes a progress change through the public project handle", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    let published: { values: Readonly<Record<string, unknown>> } | undefined;
    runtime.subscribe("hero/arm", (patch) => {
      published = patch;
    });
    const batch = runtime.seek("hero/arm", 0.5);
    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/arm")?.values.opacity).toBeCloseTo(
      0.6,
      12,
    );
    expect(published?.values.opacity).toBeCloseTo(0.6, 12);
    runtime.dispose();
  });

  it("keeps one clock owner while clock progress publishes once", () => {
    const clock = createManualClock();
    const subscribe = vi.spyOn(clock, "subscribe");
    const runtime = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    runtime.seek("hero/arm", 0.25);
    expect(subscribe).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });

  it("still resolves authored-key plugins during progress updates", () => {
    const plugins = new PluginRegistry();
    plugins.register({
      name: "opacity",
      keys: ["opacity"],
      compose: (values) => ({ ...values, rendered: true }),
    });
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load(project);
    runtime.mount("hero/arm");
    runtime.subscribe("hero/arm", (patch) => {
      expect(patch.values).toEqual({ opacity: 1, rendered: true });
    });
    runtime.seek("hero/arm", 1);
    runtime.dispose();
  });

  it("routes a manual trigger through the public handle into a published patch", () => {
    const scheduler = createFakeScheduler();
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler,
    }).load(project);
    runtime.mount("hero/arm");
    let opacity = 0;
    runtime.subscribe("hero/arm", (patch) => {
      opacity = Number(patch.values.opacity);
    });

    runtime.signal("hero", { type: "manual", progress: 0.75 });
    expect(opacity).toBe(0);
    scheduler.flush();
    expect(opacity).toBeCloseTo(0.8, 12);

    expect(() => runtime.signal("hero", { type: "manual", progress: 1.5 })).toThrow(
      "between 0 and 1",
    );
    runtime.dispose();
  });
});
