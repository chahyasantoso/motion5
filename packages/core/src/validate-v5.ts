// Docs: ./validate-v5.md
/**
 * Compose the public authored-project validation contract.
 *
 * The contract validator owns schema shape. Graph IR owns reference and topology validation. This
 * outer composition module is the one use-case path that combines them for callers of `validateV5`.
 * Keeping the composition here preserves the dependency direction: contract never imports graph.
 */
import type { Diagnostic, ProjectDefinition } from "./contract/v5";
import { validateSchemaV5 } from "./contract/validate-v5";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "./domain/outcome";
import { unreachable } from "./lang/exhaustive";
import { buildGraphIR } from "./graph/ir";

export type ValidationResult = Outcome<ProjectDefinition>;

/**
 * Validate a complete authored project, preserving schema and graph diagnostics in their original
 * order and values.
 */
export function validateV5(input: unknown): ValidationResult {
  const schema = validateSchemaV5(input);
  switch (schema.kind) {
    case "refused":
      return schema;
    case "accepted": {
      const graph = buildGraphIR(schema.value);
      const diagnostics = Object.freeze([...schema.diagnostics, ...graph.diagnostics]);
      if (graph.diagnostics.some(({ severity }) => severity === "error"))
        return refusedOutcomeFrom<ProjectDefinition, Diagnostic>(diagnostics);
      return acceptedOutcome(schema.value, diagnostics);
    }
    default:
      return unreachable(schema);
  }
}
