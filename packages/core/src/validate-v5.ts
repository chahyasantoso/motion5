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
import { acceptedOutcome, refusedOutcomeFrom, type Outcome } from "./lang/outcome";
import { unreachable } from "./lang/exhaustive";
import { buildGraphIR } from "./graph/ir";
import { UNJUDGED_CAPABILITIES, type PluginCapabilities } from "./ports/plugin-capabilities";
import type { ParseContext } from "./contract/v5-parse";

export type ValidationResult = Outcome<ProjectDefinition, Diagnostic>;

/**
 * Validate a complete authored project, preserving schema and graph diagnostics in their original
 * order and values. Without capabilities, declaration-dependent rules are unjudged (ADR-136).
 *
 * The same capabilities answer the parser's plugin-admission question, so an id a host never
 * registered is refused as `plugin-unknown` here rather than accepted and discovered at compile.
 * One capability reader answers both, which is why this is a projection rather than a second rule.
 */
export function validateV5(
  input: unknown,
  capabilities: PluginCapabilities = UNJUDGED_CAPABILITIES,
): ValidationResult {
  const context: ParseContext = {
    isPluginRegistered: (pluginId) => capabilities.capabilityOf(pluginId) !== undefined,
  };
  const schema = validateSchemaV5(input, context);
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
