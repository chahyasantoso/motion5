import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { GraphRuntime } from "../../src/runtime/graph-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("GraphRuntime", () => {
  it("TR-R-14 mounts through one project-owned GraphRuntime", () => {
    const clock = createManualClock();
    const subscriptions = vi.spyOn(clock, "subscribe");
    const runtime = new GraphRuntime(project, clock, compose);

    expect(subscriptions).toHaveBeenCalledTimes(1);
    expect(runtime.registry).toBe(runtime.registry);
    expect((runtime as unknown as { publisher?: unknown }).publisher).toBeUndefined();
    expect(runtime.state).toBe(runtime.binding.state);
    runtime.dispose();
  });
});
