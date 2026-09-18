import type { Diagnostic, PatchBatch } from "../contract/v5";
import { collect, report } from "../domain/completion";
import { unreachable } from "../domain/exhaustive";
// Two questions about a thrown value, and each name states which one it answers. `describeError`
// renders one value as its own message and is this folder's owner of that; `describeWithCauses` below
// adds the causes an `AggregateError` collected and delegates its leaf case here, so one expression
// renders a message and no message moves. Issue #446, and see ADR-096.
import { describeError } from "./schema-refusals";

/**
 * What a caller is told when a step fails, and what a caller is answered when a publication was asked
 * for and did not happen here.
 *
 * Three modules held one concern until issue #443. `rollback.ts` ran ordered steps under two names
 * that differed in a message string, re-exported `collect` and `report` from `domain/completion` so
 * that it read as their owner, and held the rejection shape a failed rollback earns.
 * `diagnostic-report.ts` rendered an error and owned the handover to a host's diagnostic sink, with the
 * two nullable slots a reporting runtime keeps beside it. `value-batch.ts` built two of the three
 * batches this runtime answers when a publication did not happen, and `graph-runtime.ts` built the
 * third, so one four-field shape had three builders differing in prose and in a rule id.
 *
 * So which phase a run of steps belongs to is a value, why a batch exists instead of a publication is a
 * value, and what a runtime retains about its own reporting is a value. Each of the three is read by
 * one total switch. `collect` and `report` are imported from their owner and not re-exported, so this
 * module reads that mechanism rather than becoming a second name for it.
 *
 * Issue #443, phase B step 11. See ADR-035, ADR-071, ADR-078, ADR-079, ADR-080, ADR-084 and ADR-091.
 */

/** Which side of acceptance a run of steps is on. The two differ in what a caller is told. */
export type StepPhase = "rollback" | "settle";

/** The summary one phase reports under, which is the whole of what the two runs ever differed in. */
function stepSummary(phase: StepPhase): string {
  switch (phase) {
    case "rollback":
      return "Track replacement rollback failed.";
    case "settle":
      return "Commit settlement failed.";
    default:
      return unreachable(phase);
  }
}

/**
 * Attempts every ordered step, then reports the failures once under the summary its phase earns.
 *
 * `runRollbackSteps` and `runSettleSteps` were this call with a different string, so which of the two
 * a caller wanted was stated by which function it reached rather than by a value it passed, and the
 * two names made one mechanism look like two. ADR-035's precedence and ADR-071's collect-then-report
 * granularity are unchanged: every step is attempted, a single failure keeps its identity including a
 * thrown `undefined`, and two or more become one `AggregateError` in occurrence order.
 *
 * The phase is a parameter rather than a summary string, because a caller that passes prose can pass
 * prose no reader recognises, and the two summaries are a closed set that callers anchor on.
 */
export function runSteps(phase: StepPhase, steps: readonly (() => void)[]): void {
  report(collect(steps), stepSummary(phase));
}

/**
 * Rejects an operation whose rollback can fail on its own.
 *
 * Every structural commit rolls back through hooks that reach application code: the `destroyMotion`
 * hook disposes a `CreatedTrigger` whose `dispose` closes over a host-owned `ScrollSource`
 * unsubscribe, and `disposeTrack` disposes a compiled `Track`. A host whose teardown throws must not
 * be able to replace the diagnosis with its own unrelated failure.
 *
 * Suppress and attach, never suppress and drop. When the rollback succeeds the rejection is rethrown
 * untouched, so every existing message and error type contract holds, including the two categories
 * that have nothing to revert at all. When it fails, one error carries both, which is the
 * collect-then-report-once shape `Engine`'s clock consumer fanout already uses, so no new failure
 * shape is invented here. See ADR-035.
 */
export function rejectAfterRollback(rejection: unknown, rollback: () => void): never {
  try {
    rollback();
  } catch (rollbackFailure) {
    // The rejection's message comes first, verbatim, so a caller that anchored on it before a
    // rollback could fail still matches it. Both facts stay first-class in `errors`, in the order
    // they happened, and the rejection itself is not mutated: it is thrown from the graph layer,
    // which does not own this failure and should not look like it does.
    const errors = [rejection, rollbackFailure];
    const detail = describeError(rollbackFailure);
    throw new AggregateError(errors, `${describeError(rejection)} Rollback failed: ${detail}`);
  }
  throw rejection;
}

/**
 * Renders `error` for a diagnostic message, keeping every original cause.
 *
 * An `AggregateError` is flattened rather than printed by its own message. The clock consumer fanout
 * reports two or more failures as one aggregate whose message is only the boundary's context string,
 * so printing that alone would name the boundary and drop every cause it collected, which is the same
 * attribution loss this module exists to prevent one level up. Recursive, so a nested aggregate
 * flattens too. Issue #154.
 *
 * Named for the question it answers, which is issue #446: this and `describeError` were two functions
 * of one name sitting one import apart, and nothing said which caller wanted which. The leaf case
 * delegates, so this folder has one renderer of a thrown value's own message and every rendered
 * string is the string it was. Two decisions the rename made explicit rather than moved: the
 * boundary's own context stays in the output, dropped only when it is empty, because it names which
 * boundary collected the causes; and `error.cause` is deliberately not rendered, because that would
 * move every message whose error carries one. See ADR-096.
 */
export function describeWithCauses(error: unknown): string {
  if (error instanceof AggregateError) {
    const causes = error.errors.map((cause: unknown) => describeWithCauses(cause)).join("; ");
    return [error.message, causes].filter((part) => part.length > 0).join(" ");
  }
  return describeError(error);
}

/** The rule id a diagnostic carries when the host's own diagnostic sink threw. Issue #410. */
export const DIAGNOSTIC_SINK_FAILURE_RULE = "diagnostic-sink-failure";

/** The rule id a value write staged inside an open batch answers under. See ADR-078. */
export const DEFERRED_VALUE_BATCH_RULE = "value-batch-deferred";

/** The rule id a flush asked for while subscribers are being notified answers under. */
export const DEFERRED_FLUSH_RULE = "reentrant-flush-deferred";

declare const REPORT_BRAND: unique symbol;

/**
 * The mint mark that keeps the trace below closed as well as discriminated, for the reason issue #387
 * gave: a variant declaring only its discriminant is not closed, because TypeScript's excess-property
 * check reads a fresh object literal rather than a value arriving through a variable.
 */
interface ReportBrand {
  readonly [REPORT_BRAND]: true;
}

type Minted<Shape extends { readonly kind: string }> = Shape & ReportBrand;

function mint<Shape extends { readonly kind: string }>(shape: Shape): Minted<Shape> {
  return Object.freeze(shape) as unknown as Minted<Shape>;
}

interface CleanShape {
  readonly kind: "clean";
}

interface ReportedShape {
  readonly kind: "reported";
  readonly diagnostic: Diagnostic;
}

interface UndeliveredShape {
  readonly kind: "undelivered";
  readonly diagnostic: Diagnostic;
  readonly sinkFailure: Diagnostic;
}

interface RecoveredShape {
  readonly kind: "recovered";
  readonly diagnostic: Diagnostic;
  readonly sinkFailure: Diagnostic;
}

/**
 * What a reporting runtime knows about its own reporting, as one value.
 *
 * Two independent nullables held this: `#lastFlushError` and `#lastSinkError`, so reported and
 * delivered, reported and refused, and never reported at all were facts a reader reconstructed by
 * comparing two fields, and a sink failure with no report behind it was writable.
 *
 * One deliberate departure from the shape issue #443 sketches. Its union has three variants, which
 * makes the trace describe the last report alone, and a sink failure would then be erased by the next
 * report a host accepted. ADR-091 says the opposite in as many words: a host bug in the sink stops
 * being invisible, and it does not stop being invisible if the next successful report clears it. So
 * there is a fourth variant for the state that already existed, a delivery that failed earlier and a
 * report that has since been accepted, and `lastSinkError` answers from both of the variants that
 * carry one. That keeps every existing answer byte-identical while closing the combinations nothing
 * means.
 */
export type ReportTrace =
  | Minted<CleanShape>
  | Minted<ReportedShape>
  | Minted<UndeliveredShape>
  | Minted<RecoveredShape>;

/** Nothing reported and nothing refused, which is what a runtime starts with. */
export const CLEAN_TRACE: ReportTrace = mint<CleanShape>({ kind: "clean" });

/** How a runtime's one trace slot is advanced, which is the whole of what this module asks of it. */
export type RetainTrace = (advance: (trace: ReportTrace) => ReportTrace) => void;

/** The last runtime diagnostic this trace retained, which is what `lastFlushError` answers. */
export function retainedDiagnostic(trace: ReportTrace): Diagnostic | undefined {
  switch (trace.kind) {
    case "clean":
      return undefined;
    case "reported":
    case "undelivered":
    case "recovered":
      return trace.diagnostic;
    default:
      return unreachable(trace);
  }
}

/**
 * The diagnostic describing a failed handover, or `undefined` while none has failed.
 *
 * Answered from both variants that carry one, which is what keeps a host's own bug visible after the
 * next report it accepts. See ADR-091.
 */
export function sinkFailure(trace: ReportTrace): Diagnostic | undefined {
  switch (trace.kind) {
    case "clean":
    case "reported":
      return undefined;
    case "undelivered":
    case "recovered":
      return trace.sinkFailure;
    default:
      return unreachable(trace);
  }
}

/** Answers the trace one retained diagnostic leaves, carrying any handover failure behind it. */
export function reporting(trace: ReportTrace, diagnostic: Diagnostic): ReportTrace {
  switch (trace.kind) {
    case "clean":
    case "reported":
      return mint<ReportedShape>({ kind: "reported", diagnostic });
    // A handover that failed earlier is still the last thing this runtime knows about its host, so a
    // report the host accepts carries that failure rather than clearing it.
    case "undelivered":
    case "recovered":
      return mint<RecoveredShape>({
        kind: "recovered",
        diagnostic,
        sinkFailure: trace.sinkFailure,
      });
    default:
      return unreachable(trace);
  }
}

/**
 * Answers the trace a failed handover leaves, keeping the newest report rather than the one it failed.
 *
 * The newest is what a reentrant sink leaves behind: it reported again from inside the delivery that
 * is now failing, and issue #415 is that the older of the two used to win. Retention precedes the
 * handover, so the trace already names a report by the time this is asked.
 *
 * And the failure it keeps is the newest one too, which is issue #436. This overwrote the slot, so a
 * sink that re-entered, caused a nested report whose own handover failed, and then threw itself
 * retained the nested failure first and the outer one second: `lastSinkError` then named an older
 * report's handover while `lastFlushError` named the newer report, and one pair described two
 * reports. The retained report is the ordering token rather than a counter beside it, because a
 * handover failure whose report is no longer the newest is older news about an older report. See
 * ADR-096.
 */
export function undeliverable(
  trace: ReportTrace,
  reported: Diagnostic,
  failure: Diagnostic,
): ReportTrace {
  switch (trace.kind) {
    // Unreachable through `reportDiagnostic`, which retains first. Answered with the report it was
    // handed rather than left as a hole, because a delivery failure is a fact either way.
    case "clean":
      return mint<UndeliveredShape>({
        kind: "undelivered",
        diagnostic: reported,
        sinkFailure: failure,
      });
    // No failure is retained yet, so this handover is the newest thing known about the host.
    case "reported":
      return mint<UndeliveredShape>({
        kind: "undelivered",
        diagnostic: trace.diagnostic,
        sinkFailure: failure,
      });
    // One is, so whose report it belongs to decides. A failure retained under a newer report stays,
    // and the trace is answered unchanged rather than half-rewritten.
    case "undelivered":
    case "recovered":
      if (trace.diagnostic !== reported) return trace;
      return mint<UndeliveredShape>({
        kind: "undelivered",
        diagnostic: trace.diagnostic,
        sinkFailure: failure,
      });
    default:
      return unreachable(trace);
  }
}

function frozenDiagnostic(
  ruleId: string,
  message: string,
  tick: number,
  ids: readonly string[],
): Diagnostic {
  const diagnostic: Diagnostic = Object.freeze({
    ruleId,
    path: String(tick),
    message,
    severity: "error",
    ids: Object.freeze([...ids]),
  });
  return diagnostic;
}

/**
 * Builds one runtime diagnostic, retains it, then hands it to `sink` inside the boundary that owns the
 * handover.
 *
 * The one owner of what a host may do to a runtime failure, which is issue #400. `onFlushError` is a
 * documented option, nothing says it may not throw, and a runtime reporting through it had no boundary
 * of its own: the throw left through whichever member was reporting, at a statement that member's own
 * `try` could not see. Five callers shared that hole and one `try` here closes it for all of them.
 *
 * Retention precedes the handover and does not depend on it, which is what makes ADR-088's own
 * sentence true. Issue #415. Nothing is returned, because an answer beside the retained trace is a
 * second owner of what the runtime knows. The trace is advanced through a function rather than
 * assigned, so a sink that re-enters and reports again cannot have its newer report overwritten by the
 * older one unwinding behind it.
 *
 * A host failure is still swallowed rather than aggregated or rethrown, and it is not lost: the
 * exception becomes its own diagnostic in the trace, named for the report it failed to carry, and that
 * diagnostic is handed to nothing, because the only sink available is the one that has just thrown.
 * Issue #410. ADR-039's clock boundaries are the precedent. See ADR-091.
 */
export function reportDiagnostic(
  sink: ((diagnostic: Diagnostic) => void) | undefined,
  retain: RetainTrace,
  ruleId: string,
  message: string,
  tick: number,
  ids: readonly string[],
): void {
  const diagnostic = frozenDiagnostic(ruleId, message, tick, ids);
  retain((trace) => reporting(trace, diagnostic));
  try {
    sink?.(diagnostic);
  } catch (error) {
    const failure = frozenDiagnostic(
      DIAGNOSTIC_SINK_FAILURE_RULE,
      `Diagnostic delivery for ${ruleId} failed: ${describeWithCauses(error)}`,
      tick,
      ids,
    );
    retain((trace) => undeliverable(trace, diagnostic, failure));
  }
}

/**
 * Why a batch exists rather than a publication.
 *
 * Read at its one call site and stored nowhere, so it is unbranded, on the precedent `RefusalShape`
 * set: the closed thing is the answer, and the shape is what a caller hands the builder.
 *
 * `scheduled` is a question only the member that books a drain can answer, and it stays a field of
 * the flush reason because that is the only reason it means anything for. Issue #383.
 */
export type BatchReason =
  | { readonly kind: "empty" }
  | { readonly kind: "deferred-in-batch"; readonly seeds: readonly string[] }
  | {
      readonly kind: "deferred-in-flush";
      readonly seeds: readonly string[];
      readonly scheduled: boolean;
    };

function frozenBatch(
  sequence: number,
  seeds: readonly string[],
  diagnostics: readonly Diagnostic[],
): PatchBatch {
  // Annotated rather than cast, on ADR-079's decision: the function whose entire job is producing a
  // correctly shaped batch is the last one that should opt out of the check that it does.
  const batch: PatchBatch = {
    tick: sequence,
    seeds: Object.freeze([...seeds]),
    patches: Object.freeze([]),
    diagnostics: Object.freeze(diagnostics),
  };
  return Object.freeze(batch);
}

/**
 * The batch a caller is answered when a publication was asked for and did not happen here.
 *
 * Three builders of one four-field shape became one switch. What each of them answered is unchanged,
 * including both rule ids and every word of both deferral messages, because two conditions with one
 * rule id would be one diagnostic a consumer cannot branch on and a reworded one is a separate,
 * deliberate commit.
 *
 * An empty recipe carries no diagnostic at all: nothing was queued and nothing was skipped, so there
 * is nothing to report. A staged value write carries its own seed, because the seed is the one thing a
 * caller can still act on. A deferred flush carries the seeds it deferred and says which of two
 * futures the work has. `tick` is the sequence the graph is still on in all three, so a consumer
 * comparing it against the batch a later publication answers can see that nothing published in
 * between. See ADR-078, ADR-080 and ADR-084.
 */
export function batchFor(sequence: number, reason: BatchReason): PatchBatch {
  switch (reason.kind) {
    case "empty":
      return frozenBatch(sequence, [], []);
    case "deferred-in-batch":
      return frozenBatch(sequence, reason.seeds, [
        Object.freeze({
          ruleId: DEFERRED_VALUE_BATCH_RULE,
          path: "value-batch",
          message:
            "A value write inside an open batch staged its seed; the batch publishes once when the recipe returns.",
          severity: "warning",
          ids: Object.freeze([...reason.seeds]),
        }),
      ]);
    case "deferred-in-flush":
      return frozenBatch(sequence, reason.seeds, [
        Object.freeze({
          ruleId: DEFERRED_FLUSH_RULE,
          path: "deferred-flush",
          message: reason.scheduled
            ? "A flush requested while subscribers were being notified was queued as one follow-up publication for a scheduled drain."
            : "A flush requested while subscribers were being notified was queued as one follow-up publication carried by the next flush.",
          severity: "warning",
          ids: Object.freeze([...reason.seeds]),
        }),
      ]);
    default:
      return unreachable(reason);
  }
}
