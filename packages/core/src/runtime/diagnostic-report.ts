import type { Diagnostic } from "../contract/v5";

/**
 * Renders `error` for a diagnostic message, keeping every original cause.
 *
 * An `AggregateError` is flattened rather than printed by its own message. The clock consumer
 * fanout reports two or more failures as one aggregate whose message is only the boundary's
 * context string, so printing that alone would name the boundary and drop every cause it
 * collected, which is the same attribution loss this module exists to prevent one level up.
 * Recursive, so a nested aggregate flattens too. Issue #154.
 */
export function describeError(error: unknown): string {
  if (error instanceof AggregateError) {
    const causes = error.errors.map((cause: unknown) => describeError(cause)).join("; ");
    return [error.message, causes].filter((part) => part.length > 0).join(" ");
  }
  return error instanceof Error ? error.message : String(error);
}

/** The rule id a diagnostic carries when the host's own diagnostic sink threw. Issue #410. */
export const DIAGNOSTIC_SINK_FAILURE_RULE = "diagnostic-sink-failure";

/**
 * The two slots a reporting runtime keeps, so the boundary can fill them in the order it owns.
 *
 * Storage is the caller's and ordering is this module's, which is the split issue #415 asks for:
 * `GraphRuntime.#report` used to assign from this module's return value, so a sink that re-entered
 * the runtime filed a newer diagnostic that the outer assignment then overwrote with the older one.
 * A `retain` the boundary calls before the handover cannot lose that race, and it keeps the rule in
 * the one place that owns the handover rather than at five call sites. Splitting this into
 * `buildDiagnostic` and `handOver` and letting the caller assign between them is refused for that
 * reason: it hands the ordering back to the callers the boundary exists to relieve. See ADR-076 and
 * ADR-091.
 *
 * `retainSinkFailure` is a second slot rather than a second hook, which is issue #410: a hook is a
 * second sink and therefore a second thing that can throw. See ADR-091.
 */
export interface DiagnosticRetention {
  readonly retain: (diagnostic: Diagnostic) => void;
  readonly retainSinkFailure: (diagnostic: Diagnostic) => void;
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
 * Builds one runtime diagnostic, retains it, then hands it to `sink` inside the boundary that owns
 * the handover.
 *
 * The one owner of what a host may do to a runtime failure, which is issue #400. `onFlushError` is
 * a documented option, nothing says it may not throw, and a runtime reporting through it had no
 * boundary of its own: the throw left through whichever member was reporting, at a statement that
 * member's own `try` could not see. `GraphRuntime.#releaseBooking` is where that mattered most,
 * because it runs after the deferred payload has been taken and before the publication boundary
 * that would have put it back, so a port whose `cancel` throws plus a host whose `onFlushError`
 * throws dropped the drained seeds outright. Five callers shared that hole and one `try` here
 * closes it for all of them, which is why the boundary sits at the handover rather than at each
 * call site. See ADR-076 and ADR-088.
 *
 * Retention precedes the handover and does not depend on it, which is what finally makes ADR-088's
 * own sentence true: that record already said the diagnostic is retained before the sink is
 * touched, and the code assigned it afterwards from a return value. Issue #415. Nothing is returned
 * now, because an answer beside the retained slot is a second owner of what the runtime knows.
 *
 * A host failure is still swallowed rather than aggregated or rethrown, and it is no longer lost:
 * the exception becomes its own diagnostic in its own slot, named for the report it failed to
 * carry, and that diagnostic is handed to nothing, because the only sink available is the one that
 * has just thrown. Issue #410. So a runtime failure is never replaced by a delivery failure, and a
 * host bug in the sink stops being invisible rather than stops being contained. ADR-039's clock
 * boundaries are the precedent: a failure in injected code is labelled and contained where it
 * happens, and it does not become the failure of the operation that was already in flight. See
 * ADR-091.
 */
export function reportDiagnostic(
  sink: ((diagnostic: Diagnostic) => void) | undefined,
  retention: DiagnosticRetention,
  ruleId: string,
  message: string,
  tick: number,
  ids: readonly string[],
): void {
  const diagnostic = frozenDiagnostic(ruleId, message, tick, ids);
  retention.retain(diagnostic);
  try {
    sink?.(diagnostic);
  } catch (error) {
    retention.retainSinkFailure(
      frozenDiagnostic(
        DIAGNOSTIC_SINK_FAILURE_RULE,
        `Diagnostic delivery for ${ruleId} failed: ${describeError(error)}`,
        tick,
        ids,
      ),
    );
  }
}
