import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { Engine } from "../../src/engine";
import { createManualClock } from "../../src/ports/clock";
import { createFakeInterpolator, createFakeScheduler } from "../../src/ports/fakes";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
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
