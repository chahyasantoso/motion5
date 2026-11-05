import type { DataType, Diagnostic, Model, Structure, TypeIssue, Value } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { brandStructure } from "../contract/structure";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { unreachable } from "../lang/exhaustive";
import { validateRuntimeValue } from "./value-validation";

function issuePath(parent: string, issue: TypeIssue): string {
  const suffix = issue.path.map((segment) => `[${JSON.stringify(segment)}]`).join("");
  return `${parent}${suffix}`;
}

function issueDiagnostics(issues: readonly TypeIssue[], path: string): readonly Diagnostic[] {
  return Object.freeze(
    issues.map((issue) => diagnostic("data-type-invalid", issuePath(path, issue), issue.message)),
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

/** Validates a value against the model's declared spec, runs model.parse if defined, and brands the result. */
export function parseModel(
  model: Model<unknown, unknown>,
  value: Value,
  path: string,
): Outcome<Structure<unknown> | undefined, Diagnostic> {
  const issues = validateRuntimeValue(value, model.spec, path, { extraFields: "reject" });
  if (issues.length > 0)
    return refusedOutcomeFrom(
      issues.map((issue) => diagnostic("data-type-invalid", issue.path, issue.message)),
    );
  if (model.parse === undefined) {
    return acceptedOutcome(undefined, Object.freeze([]));
  }
  const parsed = model.parse(value);
  if (parsed.ok) {
    return acceptedOutcome(brandStructure(parsed.value), Object.freeze([]));
  }
  const diagnostics = parsed.issues.map((issue) => {
    const issueP =
      issue.path.length === 0
        ? path
        : issue.path.startsWith(path)
          ? issue.path
          : `${path}.${issue.path}`;
    return diagnostic("data-type-invalid", issueP, issue.message);
  });
  return refusedOutcomeFrom(Object.freeze(diagnostics));
}
