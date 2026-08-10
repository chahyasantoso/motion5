import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
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
          keyframes: { opacity: { stops: [{ p: 0, v: 0.2 }, { p: 1, v: 1 }] } },
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

  it("composes through one real Track and publishes renderer-neutral values", () => {
    const runtime = new Engine({
      clock: createManualClock(),
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project);
    runtime.mount("hero/arm");
    const first = runtime.graph.flush(["hero/arm"], 1);
    const patch = first.patches.find(({ nodeId }) => nodeId === "hero/arm");
    expect(patch?.values).toEqual({ opacity: 0.2 });
    expect(patch?.values).not.toHaveProperty("nodeId");
    expect(patch?.sourceProgress).toBe(0);

    const second = runtime.graph.flush(["hero/arm"], 2);
    expect(second.patches.find(({ nodeId }) => nodeId === "hero/arm")?.values).toBe(
      patch?.values,
    );
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
