import { describe, expect, it } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { ProjectRuntime } from "../../src/runtime/project-runtime";
import { buildGraphIR } from "../../src/graph/ir";

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
    expect(runtime.graph.memberCount).toBe(1);
    expect(() => runtime.mount("hero/arm", {})).toThrow(TypeError);
    runtime.unmount("hero/arm");
    expect(runtime.instanceCount).toBe(0);
    expect(runtime.graph.memberCount).toBe(0);
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

  it("uses a custom GraphBuilder if provided in options", () => {
    let buildCount = 0;
    const clock = createManualClock();

    const customBuilder = {
      build: (proj: ProjectDefinition) => {
        buildCount += 1;
        return buildGraphIR(proj);
      },
    };

    const runtime = new ProjectRuntime(project, {
      clock,
      compose,
      graphBuilder: customBuilder,
    });

    // 1 call during initial runtime construction
    expect(buildCount).toBe(1);

    // 1 call during adopt
    runtime.adopt({ id: "adopted_1" }, {});
    expect(buildCount).toBe(2);

    runtime.dispose();
  });
});
