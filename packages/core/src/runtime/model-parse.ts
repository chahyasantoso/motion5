import type { Diagnostic, Model, Structure, Value } from "../contract/v5";
import { diagnostic } from "../contract/diagnostics";
import { brandStructure } from "../contract/structure";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "../lang/outcome";
import { extraFieldsPolicy, validateRuntimeValue } from "./value-validation";

/** Validates a value against the model's declared spec, runs model.parse if defined, and brands the result. */
export function parseModel<S>(
  model: Model<unknown, S>,
  value: Value,
  path: string,
): Outcome<Structure<S> | undefined, Diagnostic> {
  const issues = validateRuntimeValue(value, model.spec, path, {
    extraFields: extraFieldsPolicy(model.spec),
  });
  if (issues.length > 0)
    return refusedOutcomeFrom(
      issues.map((issue) => diagnostic("model-value-invalid", issue.path, issue.message)),
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
    return diagnostic("model-value-invalid", issueP, issue.message);
  });
  return refusedOutcomeFrom(Object.freeze(diagnostics));
}
