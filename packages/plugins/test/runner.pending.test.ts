// @ts-nocheck
import { describe, expect, it } from "vitest";
import { type ClockTick, type LivePatch, type LiveValues, type ProjectHandle } from "@motion5/core";
import { patchRender, unreachable } from "@motion5/core/plugin-api";

import {
  attachRunners,
  createLatestSlot,
  type Runner,
  type RunnerFailure,
  type RunnerStep,
} from "../src/runner";
import { fixture } from "./support/runner-fixture";
import { patchValues } from "./support/patch-values";
const write = (nodeId: string, x: number): Runner => ({
  nodeId,
  step: () => ({ kind: "write", values: { x } }),
});
function publishedX(patch: LivePatch | undefined): unknown {
  const decision = patchRender(patch);
  switch (decision.kind) {
    case "render":
      return patchValues(decision.patch).x;
    case "retain":
    case "gone":
      return undefined;
    default:
      return unreachable(decision);
  }
}
const xOf = (project: ProjectHandle, id = "a") => publishedX(project.get(`scene/${id}`));

describe("application-attached runners", () => {
  it("R1 writes an override without changing the authored definition", () => {
    const f = fixture();
    const before = f.project.track("scene/a").definition;
    const stop = f.attach([write("scene/a", 12)]);
    f.clock.tick();
    expect(xOf(f.project)).toBe(12);
    expect(f.project.track("scene/a").definition).toEqual(before);
    stop();
    f.project.dispose();
  });

  it("R2 two ordered writes share one value batch and read before publication", () => {
    const f = fixture();
    const reads: unknown[] = [];
    const stop = f.attach([
      write("scene/a", 3),
      {
        nodeId: "scene/b",
        step: (_tick, read) => {
          reads.push(publishedX(read("scene/a")));
          return { kind: "write", values: { x: 7 } };
        },
      },
    ]);
    f.clock.tick();
    expect(f.batches()).toBe(1);
    expect(reads).toEqual([0]);
    expect([xOf(f.project), xOf(f.project, "b")]).toEqual([3, 7]);
    stop();
    f.project.dispose();
  });

  it("R4 release restores authored values and keeps the runner attached", () => {
    const f = fixture();
    let step: RunnerStep = { kind: "write", values: { x: 8 } };
    const stop = f.attach([{ nodeId: "scene/a", step: () => step }]);
    f.clock.tick();
    expect(xOf(f.project)).toBe(8);
    step = { kind: "release" };
    f.clock.tick();
    expect(xOf(f.project)).toBe(0);
    step = { kind: "write", values: { x: 9 } };
    f.clock.tick();
    expect(xOf(f.project)).toBe(9);
    stop();
    f.project.dispose();
  });

  it("R5 a throwing step releases once, disposes once, reports after batch and preserves other writes", () => {
    const f = fixture();
    const cause = new Error("step");
    let fail = false;
    let disposed = 0;
    const runner: Runner = {
      nodeId: "scene/a",
      step: () => {
        if (fail) throw cause;
        return { kind: "write", values: { x: 4 } };
      },
      dispose: () => {
        disposed += 1;
      },
    };
    const stop = f.attach([runner, write("scene/b", 6)], (failure) => {
      expect(f.inBatch()).toBe(false);
      f.failures.push(failure);
    });
    f.clock.tick();
    fail = true;
    f.clock.tick();
    f.clock.tick();
    expect(f.failures).toEqual([{ kind: "step-threw", nodeId: "scene/a", cause }]);
    expect(disposed).toBe(1);
    expect([xOf(f.project), xOf(f.project, "b")]).toEqual([0, 6]);
    stop();
    expect(disposed).toBe(1);
    f.project.dispose();
  });

  it("R6 writes are visible as soon as the engine clock tick returns", () => {
    const f = fixture();
    const ticks: ClockTick[] = [];
    const stop = f.attach([
      {
        nodeId: "scene/a",
        step: (tick) => {
          ticks.push(tick);
          return { kind: "write", values: { x: tick.time } };
        },
      },
    ]);
    f.clock.tick(16);
    expect(xOf(f.project)).toBe(16);
    expect(ticks).toEqual([{ tick: 1, time: 16, delta: 16 }]);
    stop();
    f.project.dispose();
  });

  it("R7 a refused write releases its prior overlay and does not discard another runner's write", () => {
    const f = fixture();
    let values: LiveValues = { x: 2 };
    let disposed = 0;
    const stop = f.attach([
      {
        nodeId: "scene/a",
        step: () => ({ kind: "write", values }),
        dispose: () => {
          disposed += 1;
        },
      },
      write("scene/b", 5),
    ]);
    f.clock.tick();
    values = { unauthored: 1 };
    f.clock.tick();
    f.clock.tick();
    expect(f.failures.map((failure) => failure.kind)).toEqual(["write-refused"]);
    expect(disposed).toBe(1);
    expect([xOf(f.project), xOf(f.project, "b")]).toEqual([0, 5]);
    stop();
    f.project.dispose();
  });

  it("R11 latest-wins storage consumes once and applies asynchronous results on the next tick", async () => {
    const slot = createLatestSlot<number>();
    expect(slot.take()).toBeUndefined();
    slot.offer(1);
    slot.offer(2);
    expect(slot.take()).toBe(2);
    expect(slot.take()).toBeUndefined();
    const f = fixture();
    const stop = f.attach([
      {
        nodeId: "scene/a",
        step: () => {
          const x = slot.take();
          return x === undefined ? { kind: "hold" } : { kind: "write", values: { x } };
        },
      },
    ]);
    await Promise.resolve().then(() => {
      slot.offer(9);
    });
    expect(xOf(f.project)).toBe(0);
    f.clock.tick();
    expect(xOf(f.project)).toBe(9);
    f.clock.tick();
    expect(f.batches()).toBe(1);
    stop();
    f.project.dispose();
  });

  it("R17 a clock firing inside subscribe neither hits an uninitialized handle nor leaks", () => {
    const f = fixture();
    const onFailure = (failure: RunnerFailure) => {
      f.failures.push(failure);
    };
    let released = 0;
    const eager = (tick: ClockTick) => ({
      ...f.clock,
      subscribe: (listener: (tick: ClockTick) => void) => {
        listener(tick);
        return () => {
          released += 1;
        };
      },
    });
    const thrower: Runner = {
      nodeId: "scene/a",
      step: () => {
        throw new Error("boom");
      },
    };
    const tick: ClockTick = { tick: 1, time: 0, delta: 0 };
    const stopped = attachRunners(f.port, [thrower], { clock: eager(tick), onFailure });
    expect(f.failures.map((failure) => failure.kind)).toEqual(["step-threw"]);
    expect(released).toBe(1);
    stopped();
    expect(released).toBe(1);
    const stop = attachRunners(f.port, [write("scene/a", 4)], { clock: eager(tick), onFailure });
    expect(xOf(f.project)).toBe(4);
    expect(released).toBe(1);
    stop();
    expect(released).toBe(2);
    f.project.dispose();
  });
});
