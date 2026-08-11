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
  it("TR-R-15 validates ports and loads a headless project without implicit membership", () => {
    const clock = createManualClock();
    const engine = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    });
    const runtime = engine.load(project);
    expect(runtime.graph.memberCount).toBe(0);
    runtime.dispose();
  });

  it("reuses one compiled timeline across repeated flushes and kills it once", () => {
    const create = vi.fn(createFakeInterpolator().create);
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: { create },
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    runtime.graph.flush(["hero/arm"], 1);
    runtime.graph.flush(["hero/arm"], 2);
    expect(create).toHaveBeenCalledTimes(1);
    runtime.dispose();
    expect(create.mock.results[0]?.value).toBeDefined();
  });

  it("resolves and composes authored-key plugins once during Track construction", () => {
    const plugins = new PluginRegistry();
    const compose = vi.fn((values: Record<string, unknown>) => ({ ...values, rendered: true }));
    plugins.register({ name: "opacity", keys: ["opacity"], compose });
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
      plugins,
    }).load(project);
    runtime.mount("hero/arm");
    const first = runtime.graph.flush(["hero/arm"], 1);
    const second = runtime.graph.flush(["hero/arm"], 2);
    expect(first.patches[0]?.values).toEqual({ opacity: 0.2, rendered: true });
    expect(second.patches[0]?.values).toEqual({ opacity: 0.2, rendered: true });
    expect(compose).toHaveBeenCalledTimes(1);
    runtime.dispose();
  });

  it("composes through a real Track and publishes renderer-neutral values", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    const batch = runtime.graph.flush(["hero/arm"], 1);
    const patch = batch.patches.find(({ nodeId }) => nodeId === "hero/arm");
    expect(patch?.values).toEqual({ opacity: 0.2 });
    expect(patch?.values).not.toHaveProperty("nodeId");
    expect(patch?.sourceProgress).toBe(0);
    runtime.dispose();
  });

  it("rejects invalid injected ports", () => {
    const clock = createManualClock();
    const invalidInterpolator: unknown = {};
    const invalidScheduler: unknown = {};
    expect(
      () =>
        new Engine({
          clock,
          interpolator: invalidInterpolator as never,
          scheduler: invalidScheduler as never,
        }),
    ).toThrow(TypeError);
  });
});
