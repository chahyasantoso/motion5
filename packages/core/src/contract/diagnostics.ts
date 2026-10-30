import { ruleSeverity, type OwnedIds } from "./rule";
import type { Diagnostic, DiagnosticOf } from "./v5";
import type { RuleId } from "./rule-id";

/**
 * Single `Diagnostic` constructor: `RuleId` closed, payload `OwnedIds<Rule>`, severity from `ruleSeverity`, ids always frozen.
 */
export function diagnostic<Rule extends RuleId>(
  ruleId: Rule,
  path: string,
  message: string,
  ...carried: OwnedIds<Rule>
): DiagnosticOf<Rule> {
  // Not indexable until `Rule` instantiates; `contract/rule.ts` owns id derivation; `Diagnostic.ids` is required, so an array even when empty.
  const [carriedIds] = carried as unknown as readonly [(readonly string[])?];
  return Object.freeze({
    ruleId,
    path,
    message,
    severity: ruleSeverity(ruleId),
    ids: Object.freeze([...(carriedIds ?? [])]),
  });
}

/**
 * `entry` with `hint` appended to `message`, frozen; the suffix stays at the rendering boundary.
 */
export function hintDiagnostic(entry: Diagnostic, hint: string): Diagnostic {
  return Object.freeze({ ...entry, message: `${entry.message}${hint}` });
}

/** `hintDiagnostic` over each entry, frozen. */
export function hintDiagnostics(
  diagnostics: readonly Diagnostic[],
  hint: string,
): readonly Diagnostic[] {
  return Object.freeze(diagnostics.map((entry) => hintDiagnostic(entry, hint)));
}

/**
 * Single renderer of a `Diagnostic` in a thrown message: `${ruleId} at ${path}: ${message}`, joined by spaces; editors consume `ruleId`.
 */
export function describeDiagnostics(diagnostics: readonly Diagnostic[]): string {
  return diagnostics
    .map(({ ruleId, path, message }) => `${ruleId} at ${path}: ${message}`)
    .join(" ");
}
