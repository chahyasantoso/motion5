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
  it("publishes a progress change through the existing graph runtime", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    runtime.graph.flush(["hero/arm"], 1);
    const batch = runtime.seek("hero/arm", 0.5);
    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/arm")?.values).toEqual({
      opacity: 0.6,
    });
    expect(batch.patches.find(({ nodeId }) => nodeId === "hero/arm")?.sourceProgress).toBe(0.5);
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
    runtime.seek("hero/arm", 1);
    expect(runtime.graph.registry.get("hero/arm")?.values).toEqual({ opacity: 1, rendered: true });
    runtime.dispose();
  });
});
