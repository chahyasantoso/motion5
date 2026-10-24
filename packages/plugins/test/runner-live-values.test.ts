import { describe, expect, it, vi } from "vitest";
import { createManualClock, Engine, type LivePatch, type ProjectHandle } from "@motion5/core";
import { createFakeInterpolator, createFakeScheduler } from "@motion5/core/testing";
import { project, row, table, track } from "../../core/test/support/v5-builders";
import { ProjectRuntime } from "../../core/src/runtime/project-runtime";
import { attachRunners, type RunnerStep } from "../src/runner";

function runtimeOf(handle: ProjectHandle): ProjectRuntime {
  return (handle as ProjectHandle & { readonly _runtime: ProjectRuntime })._runtime;
}

function readyValues(patch: LivePatch | undefined): unknown {
  if (patch?.status !== "ready")
    throw new Error(`Expected a ready patch: ${JSON.stringify(patch)}`);
  return patch.outputs.values;
}

const ROWS = track({ id: "rows", values: table(row("r1", { x: 1, y: 2 })) });

describe("a runner's write step carries the whole evaluated value", () => {
  it("writes a table, holds without a call, and releases to authored", () => {
    const clock = createManualClock();
    const handle = new Engine({
      clock,
      interpolator: createFakeInterpolator(),
      scheduler: createFakeScheduler(),
    }).load(project([ROWS]));
    try {
      handle.mount("demo/rows");
      handle.seek("demo/rows", 0);
      const runtime = runtimeOf(handle);
      const flush = vi.spyOn(runtime.graph, "flush");

      let step: RunnerStep = {
        kind: "write",
        values: table(row("r2", { x: 9, y: 8 })),
      };
      let read: unknown;
      const stop = attachRunners(
        handle,
        [
          {
            nodeId: "demo/rows",
            step: (_tick, committed) => {
              read = readyValues(committed("demo/rows"));
              return step;
            },
          },
        ],
        { clock, onFailure: () => undefined },
      );

      clock.tick();
      expect(flush).toHaveBeenCalledTimes(1);
      expect(read).toEqual([{ id: "r1", cells: { x: 1, y: 2 } }]);
      expect(readyValues(handle.get("demo/rows"))).toEqual([{ id: "r2", cells: { x: 9, y: 8 } }]);
      expect(handle.track("demo/rows").definition.input?.values).toEqual([
        { id: "r1", cells: { x: 1, y: 2 } },
      ]);

      step = { kind: "hold" };
      clock.tick();
      expect(flush).toHaveBeenCalledTimes(1);
      expect(readyValues(handle.get("demo/rows"))).toEqual([{ id: "r2", cells: { x: 9, y: 8 } }]);

      step = { kind: "release" };
      clock.tick();
      expect(flush).toHaveBeenCalledTimes(2);
      expect(readyValues(handle.get("demo/rows"))).toEqual([{ id: "r1", cells: { x: 1, y: 2 } }]);

      stop();
    } finally {
      handle.dispose();
    }
  });
});
