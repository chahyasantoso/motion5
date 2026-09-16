import { describe, expect, it } from "vitest";
import type { Diagnostic, ProjectDefinition } from "../../../src/contract/v5";
import { createManualClock } from "../../../src/ports/clock";
import { createFakeScheduler } from "../../../src/testing/fakes";
import { GraphRuntime } from "../../../src/runtime/graph-runtime";
import type { PatchBatch } from "../../../src/runtime/patch-registry";

/**
 * Issue #383, found by the quality pass over #375.
 *
 * The message under `reentrant-flush-deferred` said the flush "was queued as one follow-up
 * invalidation for the scheduler", and two of its words were wrong. `invalidate` is an operation
 * ADR-082 retired from this tier, so a reader tracing the diagnostic looked for a member that is
 * not there. And "for the scheduler" presumed one: `#scheduleDrain` answers immediately when there
 * is none, the seeds wait for whatever flush runs next, and `publisher-reentrancy` builds exactly
 * that runtime, so the wrong half was the half most of the existing evidence exercised.
 *
 * The rule id is accurate and does not move. Which of the two things happened is decided where it
 * is known, which is the one member that books. See ADR-086.
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

/** Drives one reentrant deferral and answers the diagnostic its batch carried. */
function deferralFrom(runtime: GraphRuntime, clock: { tick(): void }): Diagnostic {
  let deferred: PatchBatch | undefined;
  let acted = false;
  runtime.registry.subscribeNode("hero/arm", () => {
    if (acted) return;
    acted = true;
    deferred = runtime.flush(["caption/label"]);
  });
  clock.tick();
  const carried = deferred?.diagnostics.find(
    (entry) => entry.ruleId === "reentrant-flush-deferred",
  );
  if (carried === undefined) throw new Error("the deferral carried no diagnostic");
  return carried;
}

describe("the deferred-flush diagnostic says what actually happens to the work", () => {
  it("names a scheduled drain when a scheduler took the work", () => {
    const clock = createManualClock();
    const scheduler = createFakeScheduler();
    const runtime = new GraphRuntime(project, clock, compose, { scheduler });
    runtime.attach("hero/arm");

    const carried = deferralFrom(runtime, clock);

    expect(carried.message).toMatch(/scheduled drain/);
    expect(scheduler.pending).toHaveLength(1);
    runtime.dispose();
  });

  it("names the next flush when there is no scheduler to take it", () => {
    const clock = createManualClock();
    const runtime = new GraphRuntime(project, clock, compose);
    runtime.attach("hero/arm");

    const carried = deferralFrom(runtime, clock);

    // Red before this change: this runtime was told about a scheduler it was never given, and the
    // seeds are in fact carried by whatever flush runs next, which is the clock here.
    expect(carried.message).toMatch(/next flush/);
    expect(carried.message).not.toMatch(/scheduler/);
    expect(runtime.pendingSeeds).toEqual(["caption/label"]);
    clock.tick();
    expect(runtime.pendingSeeds).toEqual([]);
    runtime.dispose();
  });

  it("names no operation this tier retired, on either side", () => {
    const bookedClock = createManualClock();
    const scheduler = createFakeScheduler();
    const booked = new GraphRuntime(project, bookedClock, compose, { scheduler });
    booked.attach("hero/arm");
    const first = deferralFrom(booked, bookedClock);

    const carriedClock = createManualClock();
    const carrying = new GraphRuntime(project, carriedClock, compose);
    carrying.attach("hero/arm");
    const second = deferralFrom(carrying, carriedClock);

    // This tier's verb is `flush`; `invalidate` belongs to `ProjectRuntime` one layer up, so a
    // reader tracing either message reaches a member that exists. Rule id, severity and path are
    // untouched on both sides, which is what keeps this a message change and not a rule change.
    for (const carried of [first, second]) {
      expect(carried.message).not.toMatch(/invalidat/i);
      expect(carried.ruleId).toBe("reentrant-flush-deferred");
      expect(carried.severity).toBe("warning");
      expect(carried.path).toBe("deferred-flush");
    }
    booked.dispose();
    carrying.dispose();
  });
});
