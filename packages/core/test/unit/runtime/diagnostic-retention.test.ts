import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import type { Cancel } from "../../../src/ports/scheduler";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";

/**
 * Issues #415 and #410, found by the quality pass over #405.
 *
 * One question read three ways, and this file owns two of them: what this runtime retains, and when
 * it hands anything over. #415 is a sink that re-enters and reports again, so the nested diagnostic
 * was filed and then overwritten by the older outer one, because retention was an assignment from
 * the boundary's return value rather than an act inside it. #410 is a sink that throws, contained
 * correctly by #400 and then lost entirely, so an ordinary programming error in host code left no
 * trace anywhere while the operation that reported through it looked complete. The third, #409, is
 * the terminal-phase guard, and its case stays in `deferred-payload.test.ts` because that is where
 * the claim it narrows was pinned.
 *
 * The slot is the observable throughout rather than the callback, because the callback is what all
 * three findings are about: a case that reads only what was delivered cannot tell a diagnostic that
 * was withheld from one that was discarded, and cannot see a delivery that failed at all. See
 * ADR-091.
 */

const project: ProjectDefinition = {
  schemaVersion: 5,
  motions: [
    { id: "hero", trigger: { type: "manual" }, tracks: [{ id: "arm" }] },
    { id: "caption", trigger: { type: "manual" }, tracks: [{ id: "label" }] },
  ],
};

const compose = (node: { id: string }) => () => ({
  values: { node: node.id },
  sourceProgress: 0,
  sourceRevisions: {},
});

const refusingSchedule = {
  schedule(): Cancel {
    throw new Error("schedule refused");
  },
};

describe("a reentrant sink cannot win the race backwards", () => {
  it("keeps the diagnostic a reentrant sink filed, not the one that was already unwinding", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const received: Diagnostic[] = [];
    let refusing = false;
    let reentered = false;
    const refusingCompose = (node: { id: string }) => {
      if (refusing) throw new Error("compose refused");
      return () => ({ values: { node: node.id }, sourceProgress: 0, sourceRevisions: {} });
    };
    const runtime = new GraphRuntime(project, clock, refusingCompose, {
      scheduler,
      onClockTick: () => {
        throw new Error("consumer refused");
      },
      onFlushError: (diagnostic) => {
        received.push(diagnostic);
        if (reentered) return;
        reentered = true;
        // The re-entry the finding is about, and the only thing it has to do: cause a second report
        // while the first is still unwinding. The graph is made publishable again first, so the
        // frame this tick goes on to flush is not a third failure competing for the same slot.
        refusing = false;
        clock.tick();
      },
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    runtime.flush(["hero/arm"]);
    expect(scheduler.pending).toHaveLength(1);
    expect(received).toEqual([]);

    // `replaceGraph` colds the memo and releases the cached publisher nodes, which is what puts the
    // injected supplier back on the publication path.
    runtime.replaceGraph(project);
    refusing = true;
    scheduler.flush();

    // The drain reported first and the tick the sink caused reported second, and both reached the
    // host in that order, so the case is about which one was kept rather than which one arrived.
    expect(received.map((diagnostic) => diagnostic.ruleId)).toEqual([
      "flush-failure",
      "clock-consumer-failure",
    ]);

    // Red before this change: the nested report assigned the consumer failure, then the outer
    // assignment put the drain failure back, so the slot named the older of the two and the failure
    // it lost was the newer one. The frame is what tells them apart: the drain reported under the
    // last flushed tick and the consumer failure reported under the tick it was handling.
    expect(runtime.lastFlushError?.ruleId).toBe("clock-consumer-failure");
    expect(runtime.lastFlushError?.path).toBe("1");
    expect(runtime.lastSinkError).toBeUndefined();
    runtime.dispose();
  });
});

describe("a sink that throws is contained, and leaves a trace of its own", () => {
  it("retains the runtime diagnostic a throwing sink never accepted", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler: refusingSchedule,
      onFlushError: () => {
        throw new Error("diagnostic sink refused");
      },
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    // The host cannot reroute the publication, which is what #400 already pinned. This is the half
    // beside it: the diagnostic is retained whether or not the handover succeeded, so the fix for a
    // reentrant sink cannot be made by moving retention after the sink and dropping it on a throw.
    expect(() => runtime.flush(["hero/arm"])).not.toThrow();
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastFlushError?.message).toMatch(/scheduling failed/);
    runtime.dispose();
  });

  it("retains the sink's own failure in its own slot, without handing it anywhere", () => {
    const clock = createManualClock();
    const delivered: Diagnostic[] = [];
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler: refusingSchedule,
      onFlushError: (diagnostic) => {
        delivered.push(diagnostic);
        throw new Error("diagnostic sink refused");
      },
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    runtime.flush(["hero/arm"]);

    // Red before this change: the host's exception was neither rethrown, chained, retained nor
    // counted, so a sink failing for an ordinary programming error left no trace at all while the
    // operation that reported through it appeared to have completed normally.
    expect(runtime.lastSinkError?.ruleId).toBe("diagnostic-sink-failure");
    expect(runtime.lastSinkError?.message).toMatch(/diagnostic sink refused/);
    // It names the report it failed to carry, and it does not become that report.
    expect(runtime.lastSinkError?.message).toMatch(/scheduler-failure/);
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");

    // Handed to nothing, which is why it is a slot and not a second hook: the host was reached, and
    // every diagnostic it was handed is a runtime failure rather than its own.
    expect(delivered.length).toBeGreaterThan(0);
    expect(delivered.every((diagnostic) => diagnostic.ruleId === "scheduler-failure")).toBe(true);
    runtime.dispose();
  });

  it("leaves the sink slot empty while the host accepts what it is handed", () => {
    const clock = createManualClock();
    const received: Diagnostic[] = [];
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler: refusingSchedule,
      onFlushError: (diagnostic) => received.push(diagnostic),
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    runtime.flush(["hero/arm"]);

    // The slot is filled by a failure rather than by every report, so a host that works leaves it
    // empty and reading it is not a way of counting diagnostics.
    expect(received.length).toBeGreaterThan(0);
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastSinkError).toBeUndefined();
    runtime.dispose();
  });
});
