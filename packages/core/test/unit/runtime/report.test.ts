import { describe, expect, it } from "vitest";
import type { RuleId } from "../../../src/contract/rule-id";
import type { Diagnostic } from "../../../src/contract/v5";
import {
  CLEAN_TRACE,
  DEFERRED_FLUSH_RULE,
  DEFERRED_VALUE_BATCH_RULE,
  DIAGNOSTIC_SINK_FAILURE_RULE,
  batchFor,
  describeWithCauses,
  rejectAfterRollback,
  reportDiagnostic,
  reporting,
  retainedDiagnostic,
  runSteps,
  sinkFailure,
  undeliverable,
  type ReportTrace,
} from "../../../src/runtime/report";
import {
  frameRequest,
  requestSeeds,
  requestTick,
  seedRequest,
} from "../../../src/runtime/publish-request";
import { describeError } from "../../../src/runtime/schema-refusals";

/**
 * Issue #443, phase B steps 11 and 12: one owner for what a caller is told.
 *
 * Three modules held this concern, and the shapes they held it in were a message string selected by
 * which function a caller reached, three builders of one four-field batch, and two nullable slots
 * whose combinations included one that means nothing. This file pins each of them as data.
 *
 * Almost everything here is an equivalence claim, and that is the honest description: no message, rule
 * id, batch field or retained answer moves. The two claims that are not are the ones the union states
 * and the pair of nullables could not: a delivery failure with no report behind it is unrepresentable,
 * and a report a host accepts after one that failed keeps the failure, which is what ADR-091 says in
 * as many words and what the three-variant sketch in the issue would have erased.
 */
const ARM = "hero/arm";
const HAND = "hero/hand";

function diagnostic(ruleId: RuleId): Diagnostic {
  const entry: Diagnostic = Object.freeze({
    ruleId,
    path: "1",
    message: `${ruleId} happened`,
    severity: "error",
    ids: Object.freeze([ARM]),
  });
  return entry;
}

function thrownBy(operation: () => unknown): unknown {
  try {
    operation();
  } catch (error) {
    return error;
  }
  throw new Error("Expected the operation to throw.");
}

/** One slot, advanced the way the runtime advances its own. */
function slot(): {
  readonly retain: (advance: (trace: ReportTrace) => ReportTrace) => void;
  readonly read: () => ReportTrace;
} {
  let trace: ReportTrace = CLEAN_TRACE;
  return {
    retain: (advance) => {
      trace = advance(trace);
    },
    read: () => trace,
  };
}

describe("one owner reports what a step failed at and what a deferral answers", () => {
  it("attempts every step and reports the failures under the summary its phase earns", () => {
    const ran: string[] = [];
    const first = new Error("first");
    const second = new Error("second");

    // One failure keeps its identity, on both phases, which is what every caller of the two retired
    // functions anchored on.
    expect(
      thrownBy(() =>
        runSteps("settle", [
          () => ran.push("a"),
          () => {
            throw first;
          },
          () => ran.push("b"),
        ]),
      ),
    ).toBe(first);
    // Every step is attempted, which is the granularity ADR-071 makes the guarantee about.
    expect(ran).toEqual(["a", "b"]);

    const settle = thrownBy(() =>
      runSteps("settle", [
        () => {
          throw first;
        },
        () => {
          throw second;
        },
      ]),
    );
    expect((settle as AggregateError).message).toBe("Commit settlement failed.");
    expect((settle as AggregateError).errors).toEqual([first, second]);

    const rollback = thrownBy(() =>
      runSteps("rollback", [
        () => {
          throw first;
        },
        () => {
          throw second;
        },
      ]),
    );
    expect((rollback as AggregateError).message).toBe("Track replacement rollback failed.");

    // Nothing thrown is nothing reported.
    expect(() => runSteps("rollback", [() => ran.push("c")])).not.toThrow();
  });

  it("rethrows a rejection untouched, and carries both when the rollback fails too", () => {
    const rejection = new TypeError("motion-id at motions[0].id: bad");
    expect(thrownBy(() => rejectAfterRollback(rejection, () => undefined))).toBe(rejection);

    const teardown = new Error("host teardown refused");
    const failure = thrownBy(() =>
      rejectAfterRollback(rejection, () => {
        throw teardown;
      }),
    );
    expect(failure).toBeInstanceOf(AggregateError);
    expect((failure as AggregateError).errors).toEqual([rejection, teardown]);
    // The rejection's message first, verbatim, so a caller that anchored on it still matches.
    expect((failure as AggregateError).message).toBe(
      "motion-id at motions[0].id: bad Rollback failed: host teardown refused",
    );
  });

  it("answers the three batches a publication that did not happen leaves", () => {
    const empty = batchFor(4, { kind: "empty" });
    expect(empty).toEqual({ tick: 4, seeds: [], patches: [], diagnostics: [] });
    expect(Object.isFrozen(empty)).toBe(true);

    const seeds = [ARM];
    const staged = batchFor(7, { kind: "deferred-in-batch", seeds });
    seeds.push(HAND);
    expect(staged.tick).toBe(7);
    // Copied at the build, so a caller holding the array it passed cannot widen a batch afterwards.
    expect(staged.seeds).toEqual([ARM]);
    expect(staged.patches).toEqual([]);
    expect(staged.diagnostics).toEqual([
      {
        ruleId: DEFERRED_VALUE_BATCH_RULE,
        path: "value-batch",
        message:
          "A value write inside an open batch staged its seed; the batch publishes once when the recipe returns.",
        severity: "warning",
        ids: [ARM],
      },
    ]);

    const scheduled = batchFor(9, {
      kind: "deferred-in-flush",
      seeds: [ARM, HAND],
      scheduled: true,
    });
    expect(scheduled.diagnostics[0]).toEqual({
      ruleId: DEFERRED_FLUSH_RULE,
      path: "deferred-flush",
      message:
        "A flush requested while subscribers were being notified was queued as one follow-up publication for a scheduled drain.",
      severity: "warning",
      ids: [ARM, HAND],
    });
    const carried = batchFor(9, { kind: "deferred-in-flush", seeds: [ARM], scheduled: false });
    expect(carried.diagnostics[0]?.message).toBe(
      "A flush requested while subscribers were being notified was queued as one follow-up publication carried by the next flush.",
    );
    // Two conditions keep two rule ids, because one id would be a diagnostic nobody can branch on.
    expect(DEFERRED_FLUSH_RULE).not.toBe(DEFERRED_VALUE_BATCH_RULE);
  });

  it("retains before it hands over, and keeps the newest report when a sink throws", () => {
    const held = slot();
    const seen: (Diagnostic | undefined)[] = [];
    // The sink reads the slot it is being handed a diagnostic through, which is the ordering ADR-091
    // owns: retention has already happened by the time host code runs.
    reportDiagnostic(
      (delivered) => {
        seen.push(retainedDiagnostic(held.read()));
        expect(retainedDiagnostic(held.read())).toBe(delivered);
      },
      held.retain,
      "flush-failure",
      "flushing failed",
      3,
      [ARM],
    );
    expect(seen).toHaveLength(1);
    expect(retainedDiagnostic(held.read())?.ruleId).toBe("flush-failure");
    expect(retainedDiagnostic(held.read())?.path).toBe("3");
    expect(sinkFailure(held.read())).toBeUndefined();

    // A sink that throws leaves its own diagnostic in the trace, named for the report it failed to
    // carry, and it is handed nowhere.
    const refusing = slot();
    reportDiagnostic(
      () => {
        throw new Error("sink refused");
      },
      refusing.retain,
      "scheduler-failure",
      "scheduling failed",
      2,
      [ARM],
    );
    expect(retainedDiagnostic(refusing.read())?.ruleId).toBe("scheduler-failure");
    expect(sinkFailure(refusing.read())?.ruleId).toBe(DIAGNOSTIC_SINK_FAILURE_RULE);
    expect(sinkFailure(refusing.read())?.message).toBe(
      "Diagnostic delivery for scheduler-failure failed: sink refused",
    );

    // A sink that re-enters and reports again keeps the newer report, which is issue #415 read from
    // the other side: the older one is what used to win.
    const reentrant = slot();
    let entered = false;
    reportDiagnostic(
      () => {
        if (!entered) {
          entered = true;
          reportDiagnostic(
            undefined,
            reentrant.retain,
            "clock-consumer-failure",
            "consumer failed",
            1,
            [ARM],
          );
        }
        throw new Error("sink refused");
      },
      reentrant.retain,
      "flush-failure",
      "flushing failed",
      0,
      [ARM],
    );
    expect(retainedDiagnostic(reentrant.read())?.ruleId).toBe("clock-consumer-failure");
    expect(sinkFailure(reentrant.read())?.ruleId).toBe(DIAGNOSTIC_SINK_FAILURE_RULE);
  });

  it("keeps a handover failure visible after the next report a host accepts", () => {
    const older = diagnostic("scheduler-failure");
    const failure = diagnostic(DIAGNOSTIC_SINK_FAILURE_RULE);
    const refused = undeliverable(reporting(CLEAN_TRACE, older), older, failure);
    expect(retainedDiagnostic(refused)).toBe(older);
    expect(sinkFailure(refused)).toBe(failure);

    // The fourth variant, and the reason there is one: the three-variant sketch would answer
    // `undefined` here, so a host bug would stop being invisible and then start again.
    const newer = diagnostic("flush-failure");
    const accepted = reporting(refused, newer);
    expect(retainedDiagnostic(accepted)).toBe(newer);
    expect(sinkFailure(accepted)).toBe(failure);

    // And the newest failure wins where two of them happen, which is what overwriting a slot did.
    const second = diagnostic("clock-tick-regression");
    const again = undeliverable(accepted, newer, second);
    expect(sinkFailure(again)).toBe(second);
    expect(retainedDiagnostic(again)).toBe(newer);

    // Clean answers neither, and every trace is frozen at the mint.
    expect(retainedDiagnostic(CLEAN_TRACE)).toBeUndefined();
    expect(sinkFailure(CLEAN_TRACE)).toBeUndefined();
    expect(Object.isFrozen(CLEAN_TRACE)).toBe(true);
    expect(Object.isFrozen(accepted)).toBe(true);
  });

  it("keeps the nested handover failure rather than the outer one unwinding behind it", () => {
    const held = slot();
    let entered = false;
    reportDiagnostic(
      () => {
        if (!entered) {
          entered = true;
          // A nested report whose own handover also fails, so a sink failure is retained before the
          // outer one is. Both are real, and the trace holds one.
          reportDiagnostic(
            () => {
              throw new Error("nested sink refused");
            },
            held.retain,
            "clock-consumer-failure",
            "consumer failed",
            1,
            [ARM],
          );
        }
        throw new Error("outer sink refused");
      },
      held.retain,
      "flush-failure",
      "flushing failed",
      0,
      [ARM],
    );

    // Red before this change: the outer handover overwrote the slot, so the trace named the nested
    // report and the outer report's handover failure, and one pair described two reports. Issue
    // #436, and see ADR-096.
    expect(retainedDiagnostic(held.read())?.ruleId).toBe("clock-consumer-failure");
    expect(sinkFailure(held.read())?.message).toBe(
      "Diagnostic delivery for clock-consumer-failure failed: nested sink refused",
    );

    // The control beside it, unchanged: one report, one failed handover, and the failure is the one
    // that just happened.
    const alone = slot();
    reportDiagnostic(
      () => {
        throw new Error("sink refused");
      },
      alone.retain,
      "flush-failure",
      "flushing failed",
      0,
      [ARM],
    );
    expect(sinkFailure(alone.read())?.message).toBe(
      "Diagnostic delivery for flush-failure failed: sink refused",
    );

    // Read directly, the rule is one comparison: a handover failure is retained unless the trace
    // already carries one belonging to a newer report, and then the trace is answered unchanged.
    const older = diagnostic("flush-failure");
    const newer = diagnostic("clock-consumer-failure");
    const nested = diagnostic("scheduler-failure");
    const outer = diagnostic("clock-tick-regression");
    const trace = undeliverable(reporting(reporting(CLEAN_TRACE, older), newer), newer, nested);
    expect(sinkFailure(trace)).toBe(nested);
    expect(undeliverable(trace, older, outer)).toBe(trace);
  });

  it("flattens an aggregate into its causes rather than printing the boundary alone", () => {
    const inner = new AggregateError([new Error("a"), new Error("b")], "inner failed");
    expect(describeWithCauses(new AggregateError([inner], "outer failed"))).toBe(
      "outer failed inner failed a; b",
    );
    expect(describeWithCauses("plain")).toBe("plain");
    // The boundary's own context stays in the string, which is the half of issue #446 that is a
    // decision rather than a rename: it names which boundary collected the causes, and it is dropped
    // only when it is empty.
    expect(describeWithCauses(new AggregateError([new Error("a")], "boundary"))).toBe("boundary a");
    expect(describeWithCauses(new AggregateError([], "boundary"))).toBe("boundary");
  });

  it("renders a leaf through the one owner of a thrown value's own message", () => {
    // Two functions named `describeError` sat one import apart and neither name said which question
    // it answered. The leaf case delegates now, so one expression renders a message and no rendered
    // string moves. Issue #446, and see ADR-096.
    const error = new TypeError("bad");
    expect(describeWithCauses(error)).toBe(describeError(error));
    expect(describeWithCauses(undefined)).toBe(describeError(undefined));
    expect(describeWithCauses("plain")).toBe(describeError("plain"));
    // And the two answer differently for exactly one subject, which is why there are two names.
    const aggregate = new AggregateError([new Error("a")], "boundary");
    expect(describeError(aggregate)).toBe("boundary");
    expect(describeWithCauses(aggregate)).toBe("boundary a");
    // Neither renders `cause`, which is the decision that keeps every existing message where it was.
    expect(describeWithCauses(new TypeError("outer", { cause: new Error("hidden") }))).toBe(
      "outer",
    );
  });

  it("states a publication request as a variant rather than as an optional frame", () => {
    const seeds = seedRequest([ARM]);
    const frame = frameRequest([ARM, HAND], 12);

    expect(requestSeeds(seeds)).toEqual([ARM]);
    expect(requestTick(seeds)).toBeUndefined();
    expect(requestSeeds(frame)).toEqual([ARM, HAND]);
    expect(requestTick(frame)).toBe(12);
    // A frame of zero is a frame, which an optional number read as a truthy value would have lost.
    expect(requestTick(frameRequest([], 0))).toBe(0);
    expect(Object.isFrozen(seeds)).toBe(true);
    expect(Object.isFrozen(frame)).toBe(true);
  });
});
