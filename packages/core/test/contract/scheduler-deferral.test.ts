import { describe, expect, it, vi } from "vitest";
import type { ProjectDefinition } from "../../src/contract/v5";
import { createManualClock } from "../../src/ports/clock";
import { INLINE_JOB_MESSAGE, deferredScheduler, type Cancel } from "../../src/ports/scheduler";
import { GraphRuntime } from "../../src/runtime/graph-runtime";
import type { PatchBatch } from "../../src/runtime/patch-registry";

/**
 * Issue #377, found by the quality pass over #375.
 *
 * The `Scheduler` port declared `schedule(job, options?): Cancel` and said nothing about when the
 * job runs, so a port that ran its job inline satisfied the contract while breaking the runtime.
 * `#scheduleDrain` books from inside the publication that deferred, the job lowers that booking as
 * its first act, and a `flush` from inside the same publication defers and books again. That is
 * unbounded recursion to a stack overflow rather than a slow drain, and the booking cannot stop it
 * because it is lowered before `schedule` has returned.
 *
 * ADR-038 already decided the pass boundary for the shipped adapter, so nothing reachable today
 * recursed. #377 is that the decision lived in a record and in this runtime's assumptions and not
 * in the contract a future adapter reads. It is decided at the port, which is the issue's own first
 * recommendation, and enforced there once instead of guarded at every call site. See ADR-086.
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

describe("a Scheduler defers, and the port is what says so", () => {
  it("passes a job through to a port that defers, and hands back that port's own handle", () => {
    const jobs: (() => void)[] = [];
    const cancel = vi.fn();
    const guarded = deferredScheduler({
      schedule(job: () => void): Cancel {
        jobs.push(job);
        return { cancel };
      },
    });

    let ran = 0;
    const handle = guarded.schedule(() => (ran += 1));

    expect(jobs).toHaveLength(1);
    expect(ran).toBe(0);
    jobs[0]?.();
    expect(ran).toBe(1);
    handle.cancel();
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("refuses a job the port runs before schedule returns, rather than running it", () => {
    let ran = 0;
    const guarded = deferredScheduler({
      schedule(job: () => void): Cancel {
        job();
        return { cancel() {} };
      },
    });

    // Running the job is the recursion, so refusing to run it is the fix rather than a symptom of
    // one. The refusal leaves through `schedule`, which every caller already has a boundary for.
    expect(() => guarded.schedule(() => (ran += 1))).toThrow(INLINE_JOB_MESSAGE);
    expect(ran).toBe(0);
  });

  it("refuses the call whose refusal a port swallowed, and every later call with it", () => {
    let attempts = 0;
    const cancelled: number[] = [];
    const guarded = deferredScheduler({
      schedule(job: () => void): Cancel {
        attempts += 1;
        try {
          job();
        } catch {
          // Out of contract twice: it ran the job inline and then hid the refusal.
        }
        return {
          cancel() {
            cancelled.push(attempts);
          },
        };
      },
    });

    // Red before this change, and the whole of issue #402's first interleaving: the refusal was only
    // visible to a caller through a port that propagated it, so this call answered that port's own
    // handle and a runtime storing it believed a drain was booked that nothing would ever run.
    expect(() => guarded.schedule(() => undefined)).toThrow(INLINE_JOB_MESSAGE);
    // And the handle it offered is cancelled rather than leaked, because the job it names has
    // already run and been refused.
    expect(cancelled).toEqual([1]);
    expect(() => guarded.schedule(() => undefined)).toThrow(INLINE_JOB_MESSAGE);
    expect(attempts).toBe(1);
  });

  it("invalidates a callback a port retained after schedule threw", () => {
    let ran = 0;
    let retained: (() => void) | undefined;
    const guarded = deferredScheduler({
      schedule(job: () => void): Cancel {
        retained = job;
        throw new Error("port refused after taking the job");
      },
    });

    expect(() => guarded.schedule(() => (ran += 1))).toThrow(/after taking the job/);
    expect(retained).toBeDefined();

    // Red before this change, and issue #402's second interleaving: `scheduling` was already false
    // by the time the port invoked what it kept, so the wrapper ran the job against a caller that
    // had been told its booking failed and had released it. The permanent latch does not help,
    // because it is only read on entry to `schedule`.
    expect(() => retained?.()).not.toThrow();
    expect(ran).toBe(0);
  });

  it("bounds a runtime composed over a synchronous port, and keeps that runtime's work", () => {
    const clock = createManualClock();
    let calls = 0;
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler: {
        schedule(job: () => void): Cancel {
          calls += 1;
          job();
          return { cancel() {} };
        },
      },
    });
    runtime.attach("hero/arm");

    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      runtime.flush(["caption/label"]);
    });

    // Red before the port was enforced: this recursed until the stack ran out.
    expect(() => clock.tick()).not.toThrow();
    expect(calls).toBeLessThanOrEqual(2);
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastFlushError?.message).toMatch(/before schedule\(\) returns/);

    // The work is not dropped. It stays pending and the next publication carries it, which is
    // exactly what a runtime given no scheduler at all already does.
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    runtime.flush([]);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.registry.get("caption/label")?.values.node).toBe("caption/label");
    runtime.dispose();
  });

  it("keeps the work and claims no scheduled drain when a port swallows the refusal", () => {
    const clock = createManualClock();
    let attempts = 0;
    const runtime = new GraphRuntime(project, clock, compose, {
      scheduler: {
        schedule(job: () => void): Cancel {
          attempts += 1;
          try {
            job();
          } catch {
            // Out of contract twice: it ran the job inline and then hid the refusal.
          }
          return { cancel() {} };
        },
      },
    });
    runtime.attach("hero/arm");

    let deferred: PatchBatch | undefined;
    let acted = false;
    runtime.registry.subscribeNode("hero/arm", () => {
      if (acted) return;
      acted = true;
      deferred = runtime.flush(["caption/label"]);
    });

    expect(() => clock.tick()).not.toThrow();
    expect(attempts).toBe(1);

    // The evidence issue #402 asks for, and every line of it was red before this change: the port
    // answered a handle, so the booking was held, no `scheduler-failure` was reported, and the batch
    // the deferral handed back told the caller a scheduled drain would publish this.
    expect(runtime.lastFlushError?.ruleId).toBe("scheduler-failure");
    expect(runtime.lastFlushError?.message).toMatch(/before schedule\(\) returns/);
    expect(deferred?.diagnostics[0]?.ruleId).toBe("reentrant-flush-deferred");
    expect(deferred?.diagnostics[0]?.message).toMatch(/carried by the next flush/);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);

    // And the work is not dropped. The next publication carries it, which is what a runtime given no
    // scheduler at all already does, and which is why this refusal is safe to make total.
    runtime.flush([]);
    expect(runtime.pendingSeeds).toEqual([]);
    expect(runtime.registry.get("caption/label")?.values.node).toBe("caption/label");
    runtime.dispose();
  });
});
