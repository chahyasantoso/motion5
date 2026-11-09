import {
  admittedOutputSpec,
  type AdmittedPlugin,
  type Diagnostic,
  type Outputs,
} from "../contract/v5";
import { describeDiagnostics, diagnostic } from "../contract/diagnostics";
import { freezeValue, type ImmutableValue } from "../domain/values";
import { isValue, validateRuntimeValue, type ValueIssue } from "./value-validation";
import { isPlainRecord, RESERVED_NAMES } from "../lang/plain-record";

/** A plugin-side refusal carrying the diagnostics that publish as the node's error. */
export class PluginNodeError extends Error {
  readonly diagnostics: readonly Diagnostic[];

  constructor(diagnostics: readonly Diagnostic[]) {
    super(describeDiagnostics(diagnostics));
    this.name = diagnostics[0]?.ruleId ?? "plugin-error";
    this.diagnostics = Object.freeze([...diagnostics]);
  }
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

type DeclaredOutputs = AdmittedPlugin["outputs"];

function outputNameDiagnostics(
  raw: Readonly<Record<string, unknown>>,
  declared: DeclaredOutputs,
  nodeId: string,
): Diagnostic[] {
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
  for (const [name, declaredOutput] of Object.entries(declared))
    if (!Object.hasOwn(raw, name) && admittedOutputSpec(declaredOutput).optional !== true)
      diagnostics.push(
        diagnostic(
          "output-missing",
          `${nodeId}.outputs.${name}`,
          `required output '${name}' is absent.`,
        ),
      );
  return diagnostics;
}

/** Validates and freezes the first output set a plugin publishes. */
export function validatePluginOutputs(
  raw: unknown,
  declared: DeclaredOutputs,
  nodeId: string,
): Outputs {
  if (!isPlainRecord(raw)) throw invalidOutput(nodeId, "Plugin transform must return an object.");
  const diagnostics = outputNameDiagnostics(raw, declared, nodeId);
  const validated: Record<string, Outputs[string]> = {};
  for (const [name, declaredOutput] of Object.entries(declared)) {
    const spec = admittedOutputSpec(declaredOutput);
    if (!Object.hasOwn(raw, name)) continue;
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

/** Checks a later frame's output names and table or record shape; its cells stay trusted. */
export function checkLaterOutputs(
  raw: Outputs,
  declared: DeclaredOutputs,
  nodeId: string,
): Outputs {
  if (!isPlainRecord(raw)) throw invalidOutput(nodeId, "Plugin transform must return an object.");
  const diagnostics = outputNameDiagnostics(raw, declared, nodeId);
  for (const [name, declaredOutput] of Object.entries(declared)) {
    if (!Object.hasOwn(raw, name)) continue;
    const isTable = admittedOutputSpec(declaredOutput).kind === "table";
    if (Array.isArray(raw[name]) !== isTable)
      diagnostics.push(
        diagnostic(
          "output-invalid",
          `${nodeId}.outputs.${name}`,
          `output '${name}' must stay a ${isTable ? "table" : "record"}.`,
        ),
      );
  }
  if (diagnostics.length > 0) throw new PluginNodeError(diagnostics);
  return raw;
}

function invalidOutput(nodeId: string, message: string): PluginNodeError {
  return new PluginNodeError([diagnostic("output-invalid", nodeId, message)]);
}
