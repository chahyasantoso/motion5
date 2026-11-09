import type { Diagnostic, NonEmptyDiagnostics } from "@motion5/core/plugin-api";

/** Narrows a diagnostic list to the non-empty tuple a prepare refusal requires. */
export function nonEmptyDiagnostics(
  diagnostics: readonly Diagnostic[],
): NonEmptyDiagnostics | undefined {
  const [first, ...rest] = diagnostics;
  return first === undefined ? undefined : [first, ...rest];
}
