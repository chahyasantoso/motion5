import type { DataType, Diagnostic, Structure, TypeIssue, Value } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { brandStructure } from "../contract/structure";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import { validateRuntimeValue } from "./value-validation";

function issuePath(parent: string, issue: TypeIssue): string {
  const suffix = issue.path.map((segment) => `[${JSON.stringify(segment)}]`).join("");
  return `${parent}${suffix}`;
}

function issueDiagnostics(
  issues: readonly TypeIssue[],
  path: string,
): readonly Diagnostic[] {
  return Object.freeze(
    issues.map((issue) =>
      diagnostic("data-type-invalid", issuePath(path, issue), issue.message),
    ),
  );
}

/** Validates a value against the type's declared spec, then runs the domain parse and brands the result. */
export function parseDataType(
  type: DataType<unknown, unknown>,
  value: Value,
  path: string,
): Outcome<Structure<unknown>, Diagnostic> {
  const issues = validateRuntimeValue(value, type.spec, path, { extraFields: "reject" });
  if (issues.length > 0)
    return refusedOutcomeFrom(
      issues.map((issue) => diagnostic("data-type-invalid", issue.path, issue.message)),
    );
  const parsed = type.parse(value);
  switch (parsed.kind) {
    case "parsed":
      return acceptedOutcome(brandStructure(parsed.structure), Object.freeze([]));
    case "refused":
      return refusedOutcomeFrom(issueDiagnostics(parsed.errors, path));
    default:
      return unreachable(parsed);
  }
}
