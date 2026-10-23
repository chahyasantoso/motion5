import type { Diagnostic, Outputs, ValueSpec } from "../contract/v5";
import { describeDiagnostics, diagnostic } from "../contract/diagnostics";
import { freezeValue, type ImmutableValue } from "../domain/values";
import { isValue, validateRuntimeValue, type ValueIssue } from "./value-validation";

/**
 * The runtime boundary for one plugin's returned output set.
 *
 * Every declared output is checked, every undeclared one is refused, and the set is frozen before
 * it can become published state. A failure is carried as diagnostics rather than as a partial map:
 * the caller publishes the node as an error, so a node's outputs succeed or fail together.
 */
export class PluginNodeError extends Error {
  readonly diagnostics: readonly Diagnostic[];

  constructor(diagnostics: readonly Diagnostic[]) {
    super(describeDiagnostics(diagnostics));
    this.name = diagnostics[0]?.ruleId ?? "plugin-error";
    this.diagnostics = Object.freeze([...diagnostics]);
  }
}

const RESERVED_NAMES = new Set(["__proto__", "constructor", "prototype"]);

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function outputIssue(issue: ValueIssue): Diagnostic {
  const ruleId =
    issue.code === "row-id-duplicate"
      ? "output-row-id-duplicate"
      : issue.code === "reserved"
        ? "name-reserved"
        : "output-invalid";
  return diagnostic(ruleId, issue.path, issue.message);
}

/**
 * Validate and freeze one plugin's complete output set.
 *
 * The declared map is closed: an output the plugin did not declare is `output-undeclared`, and a
 * declared required output that is absent is `output-missing`. Optional outputs may be absent. A
 * table's row ids are unique per table, which is the one identity rule an output owns beyond its
 * `ValueSpec`.
 */
export function validatePluginOutputs(
  raw: unknown,
  declared: Readonly<Record<string, ValueSpec>>,
  nodeId: string,
): Outputs {
  if (!isPlainRecord(raw)) throw invalidOutput(nodeId, "Plugin transform must return an object.");
  const diagnostics: Diagnostic[] = [];
  for (const name of Object.keys(raw)) {
    if (RESERVED_NAMES.has(name)) {
      diagnostics.push(
        diagnostic("name-reserved", `${nodeId}.outputs.${name}`, `output '${name}' is reserved.`),
      );
      continue;
    }
    if (!Object.hasOwn(declared, name))
      diagnostics.push(
        diagnostic(
          "output-undeclared",
          `${nodeId}.outputs.${name}`,
          `Plugin does not declare output '${name}'.`,
        ),
      );
  }
  const validated: Record<string, Outputs[string]> = {};
  for (const [name, spec] of Object.entries(declared)) {
    if (!Object.hasOwn(raw, name)) {
      if (spec.optional !== true)
        diagnostics.push(
          diagnostic(
            "output-missing",
            `${nodeId}.outputs.${name}`,
            `required output '${name}' is absent.`,
          ),
        );
      continue;
    }
    const value = raw[name];
    const issues = validateRuntimeValue(value, spec, `${nodeId}.outputs.${name}`, {
      extraFields: "reject",
    });
    for (const issue of issues) diagnostics.push(outputIssue(issue));
    if (issues.length === 0 && isValue(value)) validated[name] = value;
  }
  if (diagnostics.length > 0) throw new PluginNodeError(diagnostics);
  try {
    const frozen: Record<string, Outputs[string]> = {};
    for (const [name, value] of Object.entries(validated))
      frozen[name] = freezeValue(value as unknown as ImmutableValue) as Outputs[string];
    return Object.freeze(frozen);
  } catch (error) {
    throw invalidOutput(nodeId, error instanceof Error ? error.message : String(error));
  }
}

function invalidOutput(nodeId: string, message: string): PluginNodeError {
  return new PluginNodeError([diagnostic("output-invalid", nodeId, message)]);
}
