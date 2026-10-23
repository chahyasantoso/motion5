import { describe, expect, it } from "vitest";
import { type ClockTick, type LivePatch, type ProjectHandle } from "@motion5/core";
import { patchRender, unreachable } from "@motion5/core/plugin-api";

import {
  attachRunners,
  createLatestSlot,
  describeRunnerFailure,
  type Runner,
  type RunnerFailure,
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
  it("R3 all-hold ticks open no batch", () => {
    const f = fixture();
    const stop = f.attach([{ nodeId: "scene/a", step: () => ({ kind: "hold" }) }]);
    f.clock.tick();
    f.clock.tick();
    expect(f.batches()).toBe(0);
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

  it("R17b an eager tick whose failure report throws still releases, disposes and unsubscribes", () => {
    const f = fixture();
    let released = 0;
    let disposed = 0;
    const tick: ClockTick = { tick: 1, time: 0, delta: 0 };
    const clock = {
      ...f.clock,
      subscribe: (listener: (tick: ClockTick) => void) => {
        listener(tick);
        return () => {
          released += 1;
        };
      },
    };
    const reportError = new Error("report");
    const runners: Runner[] = [
      {
        nodeId: "scene/a",
        step: () => {
          throw new Error("boom");
        },
      },
      { ...write("scene/b", 5), dispose: () => (disposed += 1) },
    ];
    const onFailure = () => {
      throw reportError;
    };
    expect(() => attachRunners(f.port, runners, { clock, onFailure })).toThrow(reportError);
    expect([released, disposed, xOf(f.project, "b")]).toEqual([1, 1, 0]);
    f.project.dispose();
  });

  it("R18 malformed options are refused by name before subscribing", () => {
    const f = fixture();
    const runners = [write("scene/a", 1)];
    const onFailure = () => {};
    const refusals: [unknown, string][] = [
      [undefined, "Runners require an options object."],
      [{ onFailure }, "Runners require a clock with a subscribe function."],
      [{ clock: {}, onFailure }, "Runners require a clock with a subscribe function."],
      [{ clock: f.clock }, "Runners require an onFailure function."],
    ];
    for (const [options, message] of refusals) {
      expect(() =>
        attachRunners(f.port, runners, options as Parameters<typeof attachRunners>[2]),
      ).toThrow(new TypeError(message));
    }
    f.clock.tick();
    expect(xOf(f.project)).toBe(0);
    f.project.dispose();
  });

  it("R19 a latest slot cannot be typed to carry undefined, which means empty", () => {
    // @ts-expect-error undefined is the empty answer of take(), never an offered value.
    createLatestSlot<undefined>();
    // @ts-expect-error an optional payload must be wrapped in a record instead.
    createLatestSlot<number | undefined>();
    const slot = createLatestSlot<{ readonly value: number | undefined } | null>();
    slot.offer({ value: undefined });
    expect(slot.take()).toEqual({ value: undefined });
    slot.offer(null);
    expect(slot.take()).toBeNull();
    expect(slot.take()).toBeUndefined();
  });
});
