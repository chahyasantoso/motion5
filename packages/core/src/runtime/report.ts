import { diagnostic as buildDiagnostic } from "../contract/diagnostics";
import type { OwnedIds } from "../contract/rule";
import type { RuleId } from "../contract/rule-id";
import type { Diagnostic, PatchBatch } from "../contract/v5";
import { collect, report } from "../domain/completion";
import { unreachable } from "../lang/exhaustive";
import { describeError } from "./schema-refusals";

/** Which side of acceptance a step run is on; each names a different failure summary. */
export type StepPhase = "rollback" | "settle";

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

/** Attempts all steps in order, then reports failures once under the phase's summary. */
export function runSteps(phase: StepPhase, steps: readonly (() => void)[]): void {
  report(collect(steps), stepSummary(phase));
}

/** Which release a failed operation ran; the one thing two callers of a policy differ in. */
export type CleanupPhase = "cleanup" | "rollback";
function cleanupSummary(phase: CleanupPhase): string {
  switch (phase) {
    case "cleanup":
      return "Cleanup failed";
    case "rollback":
      return "Rollback failed";
    default:
      return unreachable(phase);
  }
}
/** Error to throw for `failure` after a `cleanup` that may itself fail.
 * A throwing cleanup never drops `failure`: one `AggregateError`, `failure` first. */
export function afterCleanup(failure: unknown, phase: CleanupPhase, cleanup: () => void): unknown {
  try {
    cleanup();
  } catch (cleanupFailure) {
    const detail = describeError(cleanupFailure);
    return new AggregateError(
      [failure, cleanupFailure],
      `${describeError(failure)} ${cleanupSummary(phase)}: ${detail}`,
    );
  }
  return failure;
}
/** Rejects an operation whose rollback can fail alone: `afterCleanup` under `rollback`. */
export function rejectAfterRollback(rejection: unknown, rollback: () => void): never {
  throw afterCleanup(rejection, "rollback", rollback);
}

/** Renders `error` with every `AggregateError` cause, flattened recursively.
 * `error.cause` is deliberately not rendered: every message carrying one would move. */
export function describeWithCauses(error: unknown): string {
  if (error instanceof AggregateError) {
    const causes = error.errors.map((cause: unknown) => describeWithCauses(cause)).join("; ");
    return [error.message, causes].filter((part) => part.length > 0).join(" ");
  }
  return describeError(error);
}

/** Rule id a diagnostic carries when the host's own diagnostic sink threw. */
export const DIAGNOSTIC_SINK_FAILURE_RULE = "diagnostic-sink-failure" satisfies RuleId;

/** Rule id a value write staged inside an open batch answers under. */
export const DEFERRED_VALUE_BATCH_RULE = "value-batch-deferred" satisfies RuleId;

/** Rule id a flush requested during subscriber notification answers under. */
export const DEFERRED_FLUSH_RULE = "reentrant-flush-deferred" satisfies RuleId;

/** Rule id a deferral with no seed to name answers under; a seeded one always names ids. */
export const DEFERRED_FLUSH_FRAME_RULE = "reentrant-flush-deferred-frame" satisfies RuleId;

declare const REPORT_BRAND: unique symbol;

/** The brand, not the discriminant, closes this union to values `mint` made. */
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

/** What a reporting runtime knows about its own reporting, as one value.
 * A failed handover survives the next accepted report instead of being erased. */
export type ReportTrace =
  | Minted<CleanShape>
  | Minted<ReportedShape>
  | Minted<UndeliveredShape>
  | Minted<RecoveredShape>;

/** Nothing reported, nothing refused: what a runtime starts with. */
export const CLEAN_TRACE: ReportTrace = mint<CleanShape>({ kind: "clean" });

/** How a runtime's one trace slot advances: handed over as a callback, not assigned.
 * So an older report unwinding cannot overwrite a newer one from a re-entrant sink. */
export type RetainTrace = (advance: (trace: ReportTrace) => ReportTrace) => void;

/** Last runtime diagnostic this trace retained. */
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

/** The failed handover's diagnostic, kept visible past the next accepted report. */
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

/** Trace one retained diagnostic leaves, carrying any handover failure behind it. */
export function reporting(trace: ReportTrace, diagnostic: Diagnostic): ReportTrace {
  switch (trace.kind) {
    case "clean":
    case "reported":
      return mint<ReportedShape>({ kind: "reported", diagnostic });
    // Accepted report carries an earlier handover failure rather than clearing it.
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

/** Trace a failed handover leaves: newest report, newest failure. */
export function undeliverable(
  trace: ReportTrace,
  reported: Diagnostic,
  failure: Diagnostic,
): ReportTrace {
  switch (trace.kind) {
    // Unreachable via `reportDiagnostic`, which retains first; answered with `reported` anyway.
    case "clean":
      return mint<UndeliveredShape>({
        kind: "undelivered",
        diagnostic: reported,
        sinkFailure: failure,
      });
    // No failure retained yet → this handover is the newest known fact about the host.
    case "reported":
      return mint<UndeliveredShape>({
        kind: "undelivered",
        diagnostic: trace.diagnostic,
        sinkFailure: failure,
      });
    // Failure retained → ownership decides; an older trace returns unchanged.
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
  ruleId: RuleId,
  message: string,
  tick: number,
  ids: readonly string[] | undefined,
): Diagnostic {
  return buildDiagnostic(ruleId, String(tick), message, ids);
}

/** Retains a diagnostic, then hands it to `sink` inside the handover boundary.
 * Retention precedes delivery; a sink throw becomes its own diagnostic, not a caller throw. */
export function reportDiagnostic<Rule extends RuleId>(
  sink: ((diagnostic: Diagnostic) => void) | undefined,
  retain: RetainTrace,
  ruleId: Rule,
  message: string,
  tick: number,
  ...carried: OwnedIds<Rule>
): void {
  // Carried list opened here, where the rule is named.
  const [ids] = carried as unknown as readonly [(readonly string[])?];
  const diagnostic = frozenDiagnostic(ruleId, message, tick, ids);
  retain((trace) => reporting(trace, diagnostic));
  try {
    sink?.(diagnostic);
  } catch (error) {
    const failure = frozenDiagnostic(
      DIAGNOSTIC_SINK_FAILURE_RULE,
      `Diagnostic delivery for ${ruleId} failed: ${describeWithCauses(error)}`,
      tick,
      // Rule always names ids → a failed handover carries `[]`, never an absent field.
      ids ?? [],
    );
    retain((trace) => undeliverable(trace, diagnostic, failure));
  }
}

/** Seed list a deferral names, proven non-empty: a deferral cannot name nothing. */
export type DeferredSeeds = readonly [string, ...string[]];

/** `seeds` as a list a deferral may name, or `undefined` when nothing can be named. */
export function namedSeeds(seeds: readonly string[]): DeferredSeeds | undefined {
  const [first, ...rest] = seeds;
  return first === undefined ? undefined : [first, ...rest];
}

/** Why a batch exists rather than a publication: read at one call site, stored nowhere. */
export type BatchReason =
  | { readonly kind: "empty" }
  | { readonly kind: "deferred-in-batch"; readonly seeds: DeferredSeeds }
  | {
      readonly kind: "deferred-in-flush";
      readonly seeds: DeferredSeeds;
      readonly scheduled: boolean;
    }
  | {
      readonly kind: "deferred-frame-in-flush";
      readonly tick: number;
      readonly scheduled: boolean;
    };

function frozenBatch(
  sequence: number,
  seeds: readonly string[],
  diagnostics: readonly Diagnostic[],
): PatchBatch {
  // Annotated, not cast: this producer must not skip the shape check.
  const batch: PatchBatch = {
    tick: sequence,
    seeds: Object.freeze([...seeds]),
    patches: Object.freeze([]),
    diagnostics: Object.freeze(diagnostics),
  };
  return Object.freeze(batch);
}

/** Batch a caller is answered when a requested publication did not happen here.
 * Consumers branch on each rule id and message, so none may be reworded. */
export function batchFor(sequence: number, reason: BatchReason): PatchBatch {
  switch (reason.kind) {
    case "empty":
      return frozenBatch(sequence, [], []);
    case "deferred-in-batch":
      return frozenBatch(sequence, reason.seeds, [
        buildDiagnostic(
          DEFERRED_VALUE_BATCH_RULE,
          "value-batch",
          "A value write inside an open batch staged its seed; the batch publishes once when the recipe returns.",
          reason.seeds,
        ),
      ]);
    case "deferred-in-flush":
      return frozenBatch(sequence, reason.seeds, [
        buildDiagnostic(
          DEFERRED_FLUSH_RULE,
          "deferred-flush",
          reason.scheduled
            ? "A flush requested while subscribers were being notified was queued as one follow-up publication for a scheduled drain."
            : "A flush requested while subscribers were being notified was queued as one follow-up publication carried by the next flush.",
          reason.seeds,
        ),
      ]);
    case "deferred-frame-in-flush":
      return frozenBatch(
        sequence,
        [],
        [
          buildDiagnostic(
            DEFERRED_FLUSH_FRAME_RULE,
            "deferred-flush",
            reason.scheduled
              ? `A flush requested while subscribers were being notified named no seed, so frame ${reason.tick} was queued as one follow-up publication for a scheduled drain.`
              : `A flush requested while subscribers were being notified named no seed, so frame ${reason.tick} was queued as one follow-up publication carried by the next flush.`,
          ),
        ],
      );
    default:
      return unreachable(reason);
  }
}
