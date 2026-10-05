import { describe, expect, it } from "vitest";
import { type ClockTick, type LivePatch, type LiveValues, type ProjectHandle } from "@motion5/core";
import { patchRender, unreachable } from "@motion5/core/plugin-api";

import {
  attachRunners,
  createLatestSlot,
  describeRunnerFailure,
  type Runner,
  type RunnerFailure,
  type RunnerStep,
} from "../src/runner";
import { fixture } from "./support/runner-fixture";
const write = (nodeId: string, x: number): Runner => ({
  nodeId,
  step: () => ({ kind: "write", values: { x } }),
});
function publishedX(patch: LivePatch | undefined): unknown {
  const decision = patchRender(patch);
  switch (decision.kind) {
    case "render":
      return decision.patch.values.x;
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

  it("R3 all-hold ticks open no batch", () => {
    const f = fixture();
    const stop = f.attach([{ nodeId: "scene/a", step: () => ({ kind: "hold" }) }]);
    f.clock.tick();
    f.clock.tick();
    expect(f.batches()).toBe(0);
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

  it("R8 a removed node is detached and reported once", () => {
    const f = fixture();
    let disposed = 0;
    const stop = f.attach([
      {
        ...write("scene/a", 2),
        dispose: () => {
          disposed += 1;
        },
      },
    ]);
    f.project.edit((tx) => tx.track("scene/a").remove());
    f.clock.tick();
    f.clock.tick();
    expect(f.failures).toEqual([{ kind: "node-missing", nodeId: "scene/a" }]);
    expect(disposed).toBe(1);
    stop();
    f.project.dispose();
  });

  it("R9 attach rejects non-arrays, duplicate ids and absent nodes before subscribing", () => {
    const f = fixture();
    let subscriptions = 0;
    const options = {
      clock: { ...f.clock, subscribe: f.clock.subscribe },
      onFailure: (failure: RunnerFailure) => {
        f.failures.push(failure);
      },
    };
    options.clock.subscribe = (listener) => {
      subscriptions += 1;
      return f.clock.subscribe(listener);
    };
    expect(() => attachRunners(f.port, null as unknown as readonly Runner[], options)).toThrow(
      TypeError,
    );
    expect(() =>
      attachRunners(f.port, [write("scene/a", 1), write("scene/a", 2)], options),
    ).toThrow(TypeError);
    expect(() => attachRunners(f.port, [write("scene/missing", 1)], options)).toThrow(TypeError);
    expect(subscriptions).toBe(0);
    const stop = attachRunners(f.port, [write("scene/a", 1)], options);
    expect(subscriptions).toBe(1);
    stop();
    f.project.dispose();
  });

  it("R10 snapshots the input array, releases all live overlays in one batch and disposes idempotently", () => {
    const f = fixture();
    const calls: string[] = [];
    const runners: Runner[] = ["a", "b"].map((id) => ({
      ...write(`scene/${id}`, 2),
      dispose: () => {
        calls.push(id);
      },
    }));
    const stop = f.attach(runners);
    runners.length = 0;
    f.clock.tick();
    stop();
    stop();
    f.clock.tick();
    expect([xOf(f.project), xOf(f.project, "b")]).toEqual([0, 0]);
    expect(f.batches()).toBe(2);
    expect(calls).toEqual(["a", "b"]);
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

  it("R12 every failure variant has one descriptive owner", () => {
    const failures: RunnerFailure[] = [
      { kind: "step-threw", nodeId: "scene/a", cause: 1 },
      { kind: "write-refused", nodeId: "scene/a", cause: 2 },
      { kind: "node-missing", nodeId: "scene/a" },
      { kind: "dispose-threw", nodeId: "scene/a", cause: 3 },
      { kind: "project-unavailable", cause: 4 },
    ];
    const descriptions = failures.map(describeRunnerFailure);
    expect(new Set(descriptions).size).toBe(5);
    for (const description of descriptions) expect(description.length).toBeGreaterThan(0);
  });

  it("R14 a throwing failure listener cannot suppress a later failure and rethrows the first value", () => {
    const f = fixture();
    const first = new Error("report");
    const stop = f.attach(
      ["a", "b"].map((id) => ({
        nodeId: `scene/${id}`,
        step: () => {
          throw id;
        },
      })),
      (failure) => {
        f.failures.push(failure);
        if (f.failures.length === 1) throw first;
        throw new Error("later report");
      },
    );
    expect(() => f.clock.tick()).toThrow(first);
    expect(f.failures.map((failure) => failure.kind)).toEqual(["step-threw", "step-threw"]);
    expect(() => f.clock.tick()).not.toThrow();
    stop();
    f.project.dispose();
  });

  it("R15 unavailable projects stop all runners, dispose each once and unsubscribe without repeated reports", () => {
    const f = fixture();
    const disposed: string[] = [];
    const stop = f.attach(
      ["a", "b"].map((id) => ({
        ...write(`scene/${id}`, 2),
        dispose: () => {
          disposed.push(id);
        },
      })),
    );
    f.project.dispose();
    expect(() => f.clock.tick()).not.toThrow();
    expect(f.failures.map((failure) => failure.kind)).toEqual(["project-unavailable"]);
    expect(disposed).toEqual(["a", "b"]);
    f.clock.tick();
    stop();
    stop();
    expect(f.failures).toHaveLength(1);
    expect(disposed).toEqual(["a", "b"]);
  });

  it("R16 reversed cleanup rethrows once after disposing every runner, then becomes silent", () => {
    const f = fixture();
    const disposed: string[] = [];
    const stop = f.attach(
      ["a", "b"].map((id) => ({
        ...write(`scene/${id}`, 2),
        dispose: () => {
          disposed.push(id);
        },
      })),
    );
    f.project.dispose();
    expect(stop).toThrow("disposed");
    expect(disposed).toEqual(["a", "b"]);
    expect(stop).not.toThrow();
    f.clock.tick();
    expect(disposed).toEqual(["a", "b"]);
  });

  it("reports every throwing disposal and preserves thrown undefined from onFailure", () => {
    const f = fixture();
    const stop = f.attach(
      ["a", "b"].map((id) => ({
        ...write(`scene/${id}`, 1),
        dispose: () => {
          throw id;
        },
      })),
      (failure) => {
        f.failures.push(failure);
        throw undefined;
      },
    );
    let threw = false;
    let caught: unknown = "not thrown";
    try {
      stop();
    } catch (error) {
      threw = true;
      caught = error;
    }
    expect(threw).toBe(true);
    expect(caught).toBeUndefined();
    expect(f.failures.map((failure) => failure.kind)).toEqual(["dispose-threw", "dispose-threw"]);
    expect(stop).not.toThrow();
    f.project.dispose();
  });
});
