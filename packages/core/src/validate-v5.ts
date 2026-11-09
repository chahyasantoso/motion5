/** The public validation path: contract shape then graph topology, from one capability source. */
import type { Diagnostic, ProjectDefinition } from "./contract/v5";
import { validateSchemaV5 } from "./contract/validate-v5";
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "./lang/outcome";
import { unreachable } from "./lang/exhaustive";
import { buildGraphIR } from "./graph/ir";
import { parseContextOf, type PluginCapabilities } from "./ports/plugin-capabilities";

export type ValidationResult = Outcome<ProjectDefinition, Diagnostic>;

/** Validates a project with the caller's catalog; schema and graph diagnostics keep their order. */
export function validateV5(input: unknown, capabilities: PluginCapabilities): ValidationResult {
  const schema = validateSchemaV5(input, parseContextOf(capabilities));
  switch (schema.kind) {
    case "refused":
      return schema;
    case "accepted": {
      const graph = buildGraphIR(schema.value, capabilities);
      const diagnostics = Object.freeze([...schema.diagnostics, ...graph.diagnostics]);
      if (graph.diagnostics.some(({ severity }) => severity === "error"))
        return refusedOutcomeFrom<ProjectDefinition, Diagnostic>(diagnostics);
      return acceptedOutcome(schema.value, diagnostics);
    }
    default:
      return unreachable(schema);
  }
}
