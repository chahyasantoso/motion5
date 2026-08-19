import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition } from "../../../src/contract/v5";
import type { GraphNode } from "../../../src/graph/ir";
import { createManualClock, type ClockTick } from "../../../src/ports/clock";
import { GraphRuntime, type ComposeResolver } from "../../../src/runtime/graph-runtime";

/**
 * Clock consumer advancement and graph flushing are separate error boundaries. Issue #154.
 *
 * `GraphRuntime` owns the project's only clock subscription and does two unrelated things with
 * every tick: it advances the clock consumers through `onClockTick`, and it flushes the graph.
 * These cases pin that each one is reported under its own rule id, that neither cancels the other,
 * and that a consumer failure keeps every original cause and names the tick it happened on.
 *
 * Rule ids are asserted as literals on purpose. They are the diagnostic contract a host reads, so
 * a test that imported the constants would still pass if a rename silently changed the wire value,
 * and this file has to stay red against the parent commit for the failing-first replay.
 */
const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

/**
 * Composes a different value every call, so no publication is ever suppressed as unchanged.
 * A test about flush survival must not be able to pass because nothing was published.
 */
function countingCompose(): ComposeResolver {
  let calls = 0;
  return (node: GraphNode) => () => ({
    values: { node: node.id, call: (calls += 1) },
    sourceProgress: 0,
    sourceRevisions: {},
  });
}

interface Harness {
  readonly clock: ReturnType<typeof createManualClock>;
  readonly runtime: GraphRuntime;
  readonly failures: readonly Diagnostic[];
  readonly batchTicks: readonly number[];
}

/**
 * Builds a runtime with one attached node, a recording diagnostic sink, and a batch recorder.
 *
 * The batch recorder is what proves a flush actually happened. Asserting on diagnostics alone
 * would leave "the flush was skipped" and "the flush ran and published" indistinguishable.
 */
function harness(onClockTick: (event: ClockTick) => void): Harness {
  const clock = createManualClock();
  const failures: Diagnostic[] = [];
  const batchTicks: number[] = [];
  const runtime = new GraphRuntime(project, clock, countingCompose(), {
    onFlushError: (diagnostic) => failures.push(diagnostic),
    onClockTick,
  });
  runtime.attach("hero/arm");
  runtime.registry.subscribeBatch((batch) => batchTicks.push(batch.tick));
  return { clock, runtime, failures, batchTicks };
}

describe("clock consumer and flush error boundaries", () => {
  it("B-1 labels a clock consumer failure as clock-consumer-failure, not flush-failure", () => {
    const { clock, runtime, failures } = harness(() => {
      throw new Error("driver boom");
    });

    // A consumer's bug must not be able to stop the frame loop, and must not be attributed to a
    // flush that never ran.
    expect(() => clock.tick(16)).not.toThrow();
    expect(failures.map(({ ruleId }) => ruleId)).toEqual(["clock-consumer-failure"]);
    expect(failures[0]?.message).toBe("Clock consumers at tick 1 failed: driver boom");
    expect(failures[0]?.severity).toBe("error");
    // The tick the failure happened on, not the last tick a flush managed to complete.
    expect(failures[0]?.path).toBe("1");

    runtime.dispose();
  });

  it("B-2 still flushes the graph on a tick whose clock consumer threw", () => {
    const { clock, runtime, failures, batchTicks } = harness(() => {
      throw new Error("driver boom");
    });

    clock.tick(16);

    // One Motion's driver does not get to cost every other node in the project its frame.
    expect(batchTicks).toEqual([1]);
    expect(runtime.tick).toBe(1);
    expect(runtime.sequence).toBe(1);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(failures.map(({ ruleId }) => ruleId)).toEqual(["clock-consumer-failure"]);

    runtime.dispose();
  });

  it("B-3 keeps every cause when several clock consumers fail on one tick", () => {
    // The shape the fanout owner reports: consumers behind a throwing one still run, then one
    // AggregateError carries every failure while its own message is only the boundary's context.
    const fanout = new AggregateError(
      [new Error("first boom"), new Error("third boom")],
      "Clock consumer fanout failed.",
    );
    const { clock, runtime, failures } = harness(() => {
      throw fanout;
    });

    clock.tick(16);

    expect(failures.map(({ ruleId }) => ruleId)).toEqual(["clock-consumer-failure"]);
    expect(failures[0]?.message).toBe(
      "Clock consumers at tick 1 failed: Clock consumer fanout failed. first boom; third boom",
    );

    runtime.dispose();
  });

  it("B-4 still reports a real flush failure as flush-failure", () => {
    const advanced: number[] = [];
    const { clock, runtime, failures } = harness((event) => advanced.push(event.tick));
    runtime.registry.subscribeNode("hero/arm", () => {
      throw new Error("publisher boom");
    });

    expect(() => clock.tick(16)).not.toThrow();
    // The consumers ran and succeeded, so the only failure on this tick is the flush.
    expect(advanced).toEqual([1]);
    expect(failures.map(({ ruleId }) => ruleId)).toEqual(["flush-failure"]);
    expect(failures[0]?.message).toBe("Flush at tick 1 failed: publisher boom");
    expect(failures[0]?.path).toBe("1");
    // The work the failed flush was carrying is queued, not dropped.
    expect(runtime.pendingSeeds).toContain("hero/arm");

    runtime.dispose();
  });

  it("B-5 reports a consumer failure and a flush failure separately on one tick", () => {
    const { clock, runtime, failures } = harness(() => {
      throw new Error("driver boom");
    });
    runtime.registry.subscribeNode("hero/arm", () => {
      throw new Error("publisher boom");
    });

    clock.tick(16);

    // Two independent failures, two rule ids, in the order they happened. Neither cause is
    // replaced by the other and neither is dropped.
    expect(failures.map(({ ruleId }) => ruleId)).toEqual([
      "clock-consumer-failure",
      "flush-failure",
    ]);
    expect(failures.map(({ message }) => message)).toEqual([
      "Clock consumers at tick 1 failed: driver boom",
      "Flush at tick 1 failed: publisher boom",
    ]);

    runtime.dispose();
  });

  it("B-6 keeps one clock subscription and one report per failure", () => {
    const listeners: ((event: ClockTick) => void)[] = [];
    let subscriptions = 0;
    const clock = {
      subscribe(listener: (event: ClockTick) => void) {
        subscriptions += 1;
        listeners.push(listener);
        return () => {
          listeners.splice(listeners.indexOf(listener), 1);
        };
      },
    };
    const failures: Diagnostic[] = [];
    let consumerCalls = 0;
    const runtime = new GraphRuntime(project, clock, countingCompose(), {
      onFlushError: (diagnostic) => failures.push(diagnostic),
      onClockTick: () => {
        consumerCalls += 1;
        throw new Error("driver boom");
      },
    });
    runtime.attach("hero/arm");

    expect(subscriptions).toBe(1);
    expect(listeners).toHaveLength(1);

    listeners[0]?.(Object.freeze({ tick: 1, time: 16, delta: 16 }));

    // A second boundary must not become a second subscription, and one failure must not be
    // reported twice under two rule ids.
    expect(subscriptions).toBe(1);
    expect(consumerCalls).toBe(1);
    expect(failures).toHaveLength(1);
    expect(failures[0]?.ruleId).toBe("clock-consumer-failure");

    runtime.dispose();
    expect(listeners).toHaveLength(0);
  });

  it("B-7 keeps advancing frames after a clock consumer failure", () => {
    let calls = 0;
    const { clock, runtime, failures, batchTicks } = harness(() => {
      calls += 1;
      if (calls === 1) throw new Error("driver boom");
    });

    clock.tick(16);
    clock.tick(16);

    // Both frames advanced the consumers and both published, so a failed tick leaves no gap in
    // either the clock's frame numbering or batch identity.
    expect(calls).toBe(2);
    expect(runtime.tick).toBe(2);
    expect(batchTicks).toEqual([1, 2]);
    expect(failures.map(({ ruleId }) => ruleId)).toEqual(["clock-consumer-failure"]);

    runtime.dispose();
  });
});
