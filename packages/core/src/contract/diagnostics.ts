import type { Diagnostic } from "./v5";

/**
 * The single constructor for a `Diagnostic`.
 *
 * `validate-v5.ts` owns the authored-schema rules, but rule ids are contractual (plan section 0.8)
 * and are also raised by injected adapters such as the trigger factory. Both build diagnostics
 * here so the frozen shape has exactly one owner.
 */
export function diagnostic(
  ruleId: string,
  path: string,
  message: string,
  severity: Diagnostic["severity"] = "error",
  ids: readonly string[] = [],
): Diagnostic {
  return Object.freeze({
    ruleId,
    path,
    message,
    severity,
    ...(ids.length ? { ids: Object.freeze([...ids]) } : {}),
  });
}

/**
 * The single renderer for diagnostics inside a thrown message.
 *
 * Never hand-write `${ruleId} at ${path}: ${message}` anywhere else. Editors consume rule ids, so
 * their rendering must not drift between the validator, the Engine, and injected adapters.
 */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
