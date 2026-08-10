import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [{ id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] }],
  freeTracks: [{ id: "cursor" }],
};
const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

describe("ProjectRuntime", () => {
  it("TR-R-14 mounts through one project-owned GraphRuntime", () => {
    const clock = createManualClock();
    const runtime = new ProjectRuntime(project, { clock, compose });
    const first = {};
    runtime.mount("hero/arm", first);
    expect(runtime.instanceCount).toBe(1);
    expect(runtime.graph.memberCount).toBe(2);
    expect(() => runtime.mount("hero/arm", {})).toThrow(TypeError);
    runtime.unmount("hero/arm");
    expect(runtime.instanceCount).toBe(0);
    runtime.dispose();
  });

  it("rejects invalid candidates before constructing a replacement runtime", () => {
    const clock = createManualClock();
    const invalid: ProjectDefinition = {
      schemaVersion: 5,
      motions: [
        {
          id: "hero",
          trigger: { type: "manual" },
          tracks: [{ id: "arm", observes: [{ source: "missing" }] }],
        },
      ],
      freeTracks: [{ id: "cursor" }],
    };
    expect(() => new ProjectRuntime(invalid, { clock, compose })).toThrow(TypeError);
  });

  it("releases every mounted instance and clock subscription on repeated dispose", () => {
    const clock = createManualClock();
    let subscriptions = 0;
    const subscribe = clock.subscribe;
    clock.subscribe = ((listener) => {
      subscriptions += 1;
      return subscribe(listener);
    }) as typeof clock.subscribe;
    const runtime = new ProjectRuntime(project, { clock, compose });
    runtime.mount("hero/arm");
    runtime.dispose();
    runtime.dispose();
    expect(runtime.instanceCount).toBe(0);
    expect(subscriptions).toBe(1);
    expect(() => clock.tick()).not.toThrow();
  });
});
