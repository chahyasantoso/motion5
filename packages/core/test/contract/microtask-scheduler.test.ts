import { describe, expect, it } from "vitest";

import * as core from "../../src/index";
import type { Cancel, Scheduler } from "../../src/ports/scheduler";

/**
 * Reached through the package entry namespace rather than a named import, so this file still loads
 * on the parent commit and every red case is an assertion. The recovery audit refuses
 * import-resolution red as failing-first evidence, so red has to be a failed expectation.
 */
const surface = core as unknown as Record<string, unknown>;

interface SchedulerOptions {
  readonly host?: { enqueue(drain: () => void): void };
  readonly onError?: (failure: unknown) => void;
}

type SchedulerFactory = (options?: SchedulerOptions) => Scheduler<() => void>;

function create(options?: SchedulerOptions): Scheduler<() => void> {
  const factory = surface["createMicrotaskScheduler"];
  expect(typeof factory).toBe("function");
  return (factory as SchedulerFactory)(options);
}

interface ManualHost {
  enqueue(drain: () => void): void;
  /** How many passes the scheduler has asked this host for. */
  readonly enqueued: number;
  /** Runs every drain handed over since the last call. */
  run(): void;
}

function createManualHost(): ManualHost {
  let pending: Array<() => void> = [];
  let enqueued = 0;
  return {
    enqueue(drain) {
      enqueued += 1;
      pending.push(drain);
    },
    get enqueued() {
      return enqueued;
    },
    run() {
      const due = pending;
      pending = [];
      for (const drain of due) drain();
    },
  };
}

function nextTurn(): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}

describe("production microtask scheduler (issue #155)", () => {
  it("K-1 runs no job during the scheduling turn and every job on the host's pass", () => {
    const host = createManualHost();
    const scheduler = create({ host });
    const ran: string[] = [];

    scheduler.schedule(() => ran.push("first"));
    scheduler.schedule(() => ran.push("second"));

    // Nothing applies mid-emission. That separation is the whole reason the port exists: a trigger
    // produces progress in one turn and the scheduler applies it in the next.
    expect(ran).toEqual([]);
    expect(host.enqueued).toBe(1);

    host.run();

    expect(ran).toEqual(["first", "second"]);
  });

  it("K-2 preserves scheduling order inside a pass and across passes", () => {
    const host = createManualHost();
    const scheduler = create({ host });
    const ran: string[] = [];

    for (const name of ["a", "b", "c"]) scheduler.schedule(() => ran.push(name));
    host.run();
    for (const name of ["d", "e"]) scheduler.schedule(() => ran.push(name));
    host.run();

    expect(ran).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("K-3 never runs a cancelled job, and cancelling after the pass changes nothing", () => {
    const host = createManualHost();
    const scheduler = create({ host });
    const ran: string[] = [];

    const dropped = scheduler.schedule(() => ran.push("dropped"));
    const kept = scheduler.schedule(() => ran.push("kept"));
    dropped.cancel();
    host.run();

    expect(ran).toEqual(["kept"]);

    // A stale handle is inert rather than an error, so a caller holding one cannot break a later
    // pass. Motion.pause() cancels a progress job it may already have seen run.
    kept.cancel();
    scheduler.schedule(() => ran.push("later"));
    host.run();

    expect(ran).toEqual(["kept", "later"]);
  });

  it("K-4 honours a cancellation made by an earlier job in the same pass", () => {
    const host = createManualHost();
    const scheduler = create({ host });
    const ran: string[] = [];
    let doomed: Cancel | undefined;

    scheduler.schedule(() => {
      ran.push("first");
      doomed?.cancel();
    });
    doomed = scheduler.schedule(() => ran.push("doomed"));
    scheduler.schedule(() => ran.push("last"));

    host.run();

    // Reading the cancelled flag when the pass was taken rather than when each job runs would have
    // executed the doomed job anyway, which makes cancellation advisory instead of a guarantee.
    expect(ran).toEqual(["first", "last"]);
  });

  it("K-5 defers a job scheduled from inside a job to the next pass", () => {
    const host = createManualHost();
    const scheduler = create({ host });
    const ran: string[] = [];

    scheduler.schedule(() => {
      ran.push("outer");
      scheduler.schedule(() => ran.push("inner"));
      scheduler.schedule(() => ran.push("sibling"));
    });

    expect(host.enqueued).toBe(1);

    host.run();

    // One host pass per enqueue, never one per job. GraphRuntime.#scheduleDrain relies on this
    // boundary to keep applying progress and the graph follow-up it queues in separate turns.
    expect(ran).toEqual(["outer"]);
    expect(host.enqueued).toBe(2);

    host.run();

    expect(ran).toEqual(["outer", "inner", "sibling"]);
    expect(host.enqueued).toBe(2);
  });

  it("K-6 runs every remaining job when one throws and reports the failure once", () => {
    const boom = new Error("job failed");
    const host = createManualHost();
    const scheduler = create({ host });
    const ran: string[] = [];

    scheduler.schedule(() => {
      throw boom;
    });
    scheduler.schedule(() => ran.push("after"));

    let thrown: unknown;
    try {
      host.run();
    } catch (error) {
      thrown = error;
    }

    // By identity, not by shape: a lone failure is rethrown verbatim rather than wrapped, because
    // callers assert on what a job threw. Same rule as Engine.runAllAndReportOnce and ADR-035.
    expect(thrown).toBe(boom);
    expect(ran).toEqual(["after"]);

    const failures: unknown[] = [];
    const reporting = create({ host, onError: (failure) => failures.push(failure) });
    reporting.schedule(() => {
      throw boom;
    });
    reporting.schedule(() => {
      throw new Error("second failure");
    });
    host.run();

    expect(failures).toHaveLength(1);
    const reported = failures[0] as AggregateError;
    expect(reported).toBeInstanceOf(AggregateError);
    expect(reported.errors).toHaveLength(2);
    expect(reported.errors[0]).toBe(boom);
  });

  it("K-7 propagates a throwing host and hands the refused work to the next pass", () => {
    const pending: Array<() => void> = [];
    let attempts = 0;
    const host = {
      enqueue(drain: () => void) {
        attempts += 1;
        if (attempts === 1) throw new Error("host unavailable");
        pending.push(drain);
      },
    };
    const scheduler = create({ host });
    const ran: string[] = [];

    expect(() => scheduler.schedule(() => ran.push("first"))).toThrow("host unavailable");

    // The refused job is kept, not dropped. GraphRuntime already reports a throwing schedule() as
    // scheduler-failure and retries on the next invalidation, so that retry has to be able to
    // carry the work this attempt could not hand over.
    scheduler.schedule(() => ran.push("second"));

    expect(attempts).toBe(2);

    for (const drain of pending.splice(0, pending.length)) drain();

    expect(ran).toEqual(["first", "second"]);
  });

  it("K-8 drains on a microtask ahead of a timer when no host is injected", async () => {
    const scheduler = create();
    const order: string[] = [];

    setTimeout(() => order.push("timer"), 0);
    scheduler.schedule(() => order.push("job"));

    // Behavioral proof of the semantics rather than a grep for a global: nothing ran synchronously,
    // and the job lands before the macrotask behind it, which is what keeps a value from
    // publishing a frame after the tick that produced it.
    expect(order).toEqual([]);

    await nextTurn();

    expect(order).toEqual(["job", "timer"]);
  });
});
