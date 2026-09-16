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

/**
 * Builds one runtime diagnostic and hands it to `sink` inside the boundary that owns the handover.
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
 * A host failure is swallowed rather than aggregated, and that is stated rather than implied. The
 * diagnostic is answered to the caller that asked for it and retained there, so nothing the runtime
 * knew is lost; and a second diagnostic about a sink that has just thrown would be handed to that
 * same sink, which is a loop rather than a report. ADR-039's clock boundaries are the precedent: a
 * failure in injected code is labelled and contained where it happens, and it does not become the
 * failure of the operation that was already in flight.
 */
export function reportDiagnostic(
  sink: ((diagnostic: Diagnostic) => void) | undefined,
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
  try {
    sink?.(diagnostic);
  } catch {
    // Swallowed on purpose. The docblock above owns the reason rather than this line repeating it.
  }
  return diagnostic;
}
