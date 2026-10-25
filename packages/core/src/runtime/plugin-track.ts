import type {
  Diagnostic,
  Outputs,
  PluginDefinition,
  ResolvedInput,
  ResolvedRequires,
  Value,
  ValueSpec,
} from "../contract/v5";
import type { ParsedRecord, ParsedValues } from "../contract/v5-parse";
import { diagnostic } from "../contract/diagnostics";
import type { Interpolator } from "../ports/interpolator";
import { createValueEvaluator, type ValueEvaluator } from "./evaluate-values";
import { replaceEvaluator } from "./evaluator-replacement";
import { PluginNodeError, validatePluginOutputs } from "./plugin-output";
import { isValue, validateRuntimeValue } from "./value-validation";
import type { PublisherComposition } from "./graph-publisher";

const EMPTY_RECORD: ParsedRecord = Object.freeze({ kind: "record", fields: Object.freeze({}) });

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isOutputs(value: unknown): value is Outputs {
  return isPlainRecord(value) && Object.values(value).every(isValue);
}

function extraFields(spec: ValueSpec): "allow" | "reject" {
  if (spec.kind === "table")
    return spec.schema.row.additionalProperties === true ? "allow" : "reject";
  return spec.additionalProperties === true ? "allow" : "reject";
}

function inputFailure(path: string, message: string): PluginNodeError {
  return new PluginNodeError([diagnostic("plugin-input-invalid", path, message)]);
}

function pickOutputs(
  outputs: unknown,
  declared: Readonly<Record<string, ValueSpec>>,
  path: string,
): Outputs {
  if (!isOutputs(outputs)) throw inputFailure(path, "Bound slot did not receive an output set.");
  const picked: Record<string, Value> = {};
  for (const [name, spec] of Object.entries(declared)) {
    const value = outputs[name];
    if (value === undefined) {
      if (spec.optional === true) continue;
      throw inputFailure(`${path}.${name}`, `Required output '${name}' is absent.`);
    }
    const issues = validateRuntimeValue(value, spec, `${path}.${name}`, {
      extraFields: "allow",
    });
    const first = issues[0];
    if (first !== undefined) throw inputFailure(first.path, first.message);
    picked[name] = value;
  }
  return Object.freeze(picked);
}

function isValidateDiagnostic(value: unknown): value is Diagnostic {
  return (
    isPlainRecord(value) &&
    typeof value.path === "string" &&
    typeof value.message === "string" &&
    (value.severity === "error" || value.severity === "warning")
  );
}

/**
 * The compiled form of one identified-table track that selects a plugin.
 *
 * It owns local evaluation, dependency narrowing, custom validation and the transform call. The
 * publisher owns readiness and same-batch ordering; this class is reached only after the publisher
 * has proved every bound source is ready.
 *
 * The slot receives only the outputs its declaration names. Authored stops, local input, private
 * runtime state and undeclared upstream outputs never enter `requires`; `pickOutputs` is the one
 * place that narrowing happens.
 */
export class PluginTrack {
  readonly kind = "plugin";
  readonly nodeId: string;
  readonly plugin: PluginDefinition;
  readonly #interpolator: Interpolator;
  #evaluator: ValueEvaluator;
  #overlay: Value | undefined;
  #progress = 0;
  #disposed = false;

  constructor(options: {
    readonly nodeId: string;
    readonly plugin: PluginDefinition;
    readonly values: ParsedValues | undefined;
    readonly interpolator: Interpolator;
  }) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.plugin = options.plugin;
    this.#interpolator = options.interpolator;
    this.#evaluator = createValueEvaluator(this.#withDefault(options.values), options.interpolator);
  }

  get progress(): number {
    return this.#progress;
  }

  /**
   * Evaluates the local values this track was last given, at the current progress.
   *
   * The plugin, its declared slots and the surrounding graph are untouched: a cheap authored edit
   * changes only the local table or record the transform reads. The candidate evaluator is built
   * before the previous evaluator is disposed, so a throwing rebuild leaves the prior evaluator
   * active and undisposed.
   */
  replaceValues(values: ParsedValues | undefined): void {
    this.assertActive();
    replaceEvaluator(
      this.#evaluator,
      () => createValueEvaluator(this.#withDefault(values), this.#interpolator),
      (next) => {
        this.#evaluator = next;
      },
    );
  }

  /**
   * The whole local value this track publishes, or `undefined` to resume authored evaluation.
   *
   * The plugin still runs on every composition: a live overlay replaces the local table or record
   * the transform reads, not the transform or its dependency validation. That is what lets a write
   * that is valid alone still turn the node into an error when a bound source changes.
   */
  replaceOverlay(value: Value | undefined): void {
    this.assertActive();
    this.#overlay = value;
  }

  /** A plugin track has no grouped chain; the identified-table output set is the plugin's. */
  get plugins(): undefined {
    return undefined;
  }

  #withDefault(values: ParsedValues | undefined): ParsedValues | undefined {
    if (values !== undefined) return values;
    return this.plugin.inputs.values.kind === "record" ? EMPTY_RECORD : undefined;
  }

  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#progress = next;
    return true;
  }

  /** Evaluate local values and the bound slots, then run the one plugin. */
  compose(requires: ResolvedRequires): PublisherComposition {
    this.assertActive();
    const spec = this.plugin.inputs.values;
    const local = this.#overlay ?? this.#evaluator.evaluate(this.#progress);
    if (spec.kind === "table" ? !Array.isArray(local) : Array.isArray(local))
      throw new PluginNodeError([
        diagnostic(
          "values-shape-invalid",
          `${this.nodeId}.input.values`,
          `Plugin '${this.plugin.id}' declares ${spec.kind} input.`,
        ),
      ]);
    const localIssues = validateRuntimeValue(local, spec, `${this.nodeId}.input.values`, {
      extraFields: extraFields(spec),
    });
    const localIssue = localIssues[0];
    if (localIssue !== undefined) throw inputFailure(localIssue.path, localIssue.message);

    const resolved = this.#resolve(requires);
    const input: ResolvedInput = Object.freeze({
      values: local,
      requires: Object.freeze(resolved),
    });
    const context = Object.freeze({ nodeId: this.nodeId, progress: this.#progress });
    const warnings = this.#validate(input, context);
    const raw = this.plugin.transform(input, context);
    const outputs = validatePluginOutputs(raw, this.plugin.outputs, this.nodeId);
    return {
      outputs,
      sourceProgress: this.#progress,
      sourceRevisions: {},
      ...(warnings.length === 0 ? {} : { diagnostics: warnings }),
    };
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#evaluator.dispose();
  }

  #resolve(requires: ResolvedRequires): Record<string, Outputs | Record<string, Outputs>> {
    const resolved: Record<string, Outputs | Record<string, Outputs>> = {};
    for (const [slot, declaration] of Object.entries(this.plugin.inputs.requires ?? {})) {
      const bound = requires[slot];
      const path = `${this.nodeId}.input.requires.${slot}`;
      if (bound === undefined) {
        if (declaration.optional === true) continue;
        throw inputFailure(path, `Required slot '${slot}' is not bound.`);
      }
      if ((declaration.binding ?? "single") === "map") {
        if (!isPlainRecord(bound))
          throw inputFailure(path, `Slot '${slot}' requires a map binding.`);
        const members: Record<string, Outputs> = {};
        for (const [key, outputs] of Object.entries(bound)) {
          members[key] = pickOutputs(outputs, declaration.outputs, `${path}.${key}`);
        }
        resolved[slot] = Object.freeze(members);
        continue;
      }
      resolved[slot] = pickOutputs(bound, declaration.outputs, path);
    }
    return resolved;
  }

  #validate(
    input: ResolvedInput,
    context: { nodeId: string; progress: number },
  ): readonly Diagnostic[] {
    const validate = this.plugin.validate;
    if (validate === undefined) return Object.freeze([]);
    let raw: unknown;
    try {
      raw = validate(input, context);
    } catch (error) {
      throw new PluginNodeError([
        diagnostic(
          "plugin-validation-failed",
          this.nodeId,
          `Plugin '${this.plugin.id}' validate threw: ${error instanceof Error ? error.message : String(error)}`,
        ),
      ]);
    }
    if (!Array.isArray(raw))
      throw new PluginNodeError([
        diagnostic(
          "plugin-validation-failed",
          this.nodeId,
          `Plugin '${this.plugin.id}' validate must return an array of diagnostics.`,
        ),
      ]);
    const wrapped: Diagnostic[] = [];
    for (const entry of raw) {
      if (!isValidateDiagnostic(entry))
        throw new PluginNodeError([
          diagnostic(
            "plugin-validation-failed",
            this.nodeId,
            `Plugin '${this.plugin.id}' validate returned a malformed diagnostic.`,
          ),
        ]);
      const ruleId =
        entry.severity === "warning" ? "plugin-validation-warning" : "plugin-validation-failed";
      wrapped.push(diagnostic(ruleId, entry.path, entry.message));
    }
    const errors = wrapped.filter(({ severity }) => severity === "error");
    if (errors.length > 0) throw new PluginNodeError(errors);
    return Object.freeze(wrapped);
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
