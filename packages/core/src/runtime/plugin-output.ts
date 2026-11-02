import type { Diagnostic } from "../contract/v5";
import { describeDiagnostics } from "../contract/diagnostics";

/** A plugin-side refusal carrying the diagnostics that publish as the node's error. */
export class PluginNodeError extends Error {
  readonly diagnostics: readonly Diagnostic[];

  constructor(diagnostics: readonly Diagnostic[]) {
    super(describeDiagnostics(diagnostics));
    this.name = diagnostics[0]?.ruleId ?? "plugin-error";
    this.diagnostics = Object.freeze([...diagnostics]);
  }
}
