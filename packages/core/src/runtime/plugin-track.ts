import type {
  DataType,
  Diagnostic,
  Outputs,
  PluginDefinition,
  ResolvedInput,
  ResolvedRequires,
  Scalar,
  SlotSpec,
  SourceStructure,
  SourceStructures,
  Structure,
  Value,
  ValueSpec,
} from "../contract/v5";
import type { ParsedRecord, ParsedValues } from "../contract/v5-parse";
import { diagnostic } from "../contract/diagnostics";
import { unreachable } from "../lang/exhaustive";
import { defineOwnValue } from "../lang/own-property";
import type { Interpolator } from "../ports/interpolator";
import { createValueEvaluator, type ValueEvaluator } from "./evaluate-values";
import { replaceEvaluator } from "./evaluator-replacement";
import { parseDataType } from "./data-type-parse";
import { PluginNodeError, validatePluginOutputs } from "./plugin-output";
import type { SlotSources, SourceRef } from "./source-ref";
import { isValue } from "./value-validation";
import type { PublisherComposition } from "./graph-publisher";

const EMPTY_RECORD: ParsedRecord = Object.freeze({ kind: "record", fields: Object.freeze({}) });

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function inputFailure(path: string, message: string): PluginNodeError {
  return new PluginNodeError([diagnostic("plugin-input-invalid", path, message)]);
}

function pickOutputs(
  outputs: unknown,
  declared: Readonly<Record<string, ValueSpec>>,
  path: string,
): Outputs {
  if (!isPlainRecord(outputs))
    throw inputFailure(path, "Bound slot did not receive an output set.");
  const picked: Record<string, Value> = {};
  for (const [name, spec] of Object.entries(declared)) {
    if (!Object.hasOwn(outputs, name)) {
      if (spec.optional === true) continue;
      throw inputFailure(`${path}.${name}`, `Required output '${name}' is absent.`);
    }
    picked[name] = outputs[name] as Value;
  }
  return Object.freeze(picked);
}

function staticFieldNames(spec: ValueSpec): readonly string[] {
  const fields = spec.kind === "table" ? spec.schema.row.fields : spec.fields;
  return Object.entries(fields)
    .filter(([, field]) => field.static === true)
    .map(([name]) => name)
    .sort();
}

function isTable(
  value: Value,
): value is readonly { readonly id: string; readonly cells: Readonly<Record<string, Scalar>> }[] {
  return Array.isArray(value);
}

function structureSignature(type: DataType<unknown, unknown>, value: Value): string {
  const staticNames = staticFieldNames(type.spec);
  const staticOf = (cells: Readonly<Record<string, Scalar>>): string =>
    staticNames.map((name) => `${name}=${JSON.stringify(cells[name])}`).join(",");
  if (!isTable(value)) return `record:${staticOf(value)}`;
  return `table:${value.map((row) => `${row.id}{${staticOf(row.cells)}}`).join("|")}`;
}

function sameSourceStructures(
  left: SourceStructures | undefined,
  right: SourceStructures,
): boolean {
  if (left === undefined) return false;
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);
  if (leftKeys.length !== rightKeys.length) return false;
  for (const key of leftKeys) {
    const a = left[key];
    const b = right[key];
    if (a === b) continue;
    if (a === undefined || b === undefined) return false;
    if (typeof a !== "object" || typeof b !== "object") return false;
    if (Array.isArray(a) || Array.isArray(b)) return false;
    const aMembers = a as Readonly<Record<string, Structure<unknown>>>;
    const bMembers = b as Readonly<Record<string, Structure<unknown>>>;
    const aNames = Object.keys(aMembers);
    const bNames = Object.keys(bMembers);
    if (aNames.length !== bNames.length) return false;
    for (const name of aNames) if (aMembers[name] !== bMembers[name]) return false;
  }
  return true;
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
  #outputsChecked = false;
  #disposed = false;
  readonly #computedStructures = new Map<
    string,
    { readonly structure: Structure<unknown>; readonly signature: string }
  >();
  #checkedStructures: SourceStructures | undefined;
  #checkedWarnings: readonly Diagnostic[] = Object.freeze([]);

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
    this.#evaluator = createValueEvaluator(
      this.#withDefault(options.values),
      options.interpolator,
      this.plugin.inputs.values,
    );
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
      () =>
        createValueEvaluator(
          this.#withDefault(values),
          this.#interpolator,
          this.plugin.inputs.values,
        ),
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
  compose(requires: ResolvedRequires, sources: SlotSources = {}): PublisherComposition {
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
    const { values: resolved, structures } = this.#resolve(requires, sources);
    const warnings = this.#checkSources(structures);
    const input: ResolvedInput = Object.freeze({
      values: local,
      requires: Object.freeze(resolved),
    });
    const context = Object.freeze({ nodeId: this.nodeId, progress: this.#progress });
    const raw = this.plugin.transform(input, context);
    const outputs = this.#outputsChecked
      ? raw
      : validatePluginOutputs(raw, this.plugin.outputs, this.nodeId);
    this.#outputsChecked = true;
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

  #resolve(
    requires: ResolvedRequires,
    sources: SlotSources,
  ): { readonly values: ResolvedRequires; readonly structures: SourceStructures } {
    const resolved: Record<string, unknown> = {};
    const structures: Record<string, SourceStructure> = {};
    for (const [slot, declaration] of Object.entries(this.plugin.inputs.requires ?? {})) {
      const bound = requires[slot];
      const source = sources[slot];
      const path = `${this.nodeId}.input.requires.${slot}`;
      if (bound === undefined) {
        if (declaration.optional === true) continue;
        throw inputFailure(path, `Required slot '${slot}' is not bound.`);
      }
      if ((declaration.binding ?? "single") === "map") {
        if (!isPlainRecord(bound) || !isPlainRecord(source))
          throw inputFailure(path, `Slot '${slot}' requires a map binding.`);
        const members: Record<string, unknown> = {};
        const memberStructures: Record<string, Structure<unknown>> = {};
        for (const [key, outputs] of Object.entries(bound)) {
          const ref = source[key] as SourceRef | undefined;
          const member = this.#resolveSlot(
            declaration,
            outputs,
            ref,
            `${path}.${key}`,
            memberStructures,
            key,
          );
          defineOwnValue(members, key, member);
        }
        resolved[slot] = Object.freeze(members);
        if (Object.keys(memberStructures).length > 0)
          structures[slot] = Object.freeze(memberStructures);
        continue;
      }
      const singleStructures: Record<string, Structure<unknown>> = {};
      resolved[slot] = this.#resolveSlot(
        declaration,
        bound,
        source as SourceRef | undefined,
        path,
        singleStructures,
        slot,
      );
      const structure = singleStructures[slot];
      if (structure !== undefined) structures[slot] = structure;
    }
    return { values: Object.freeze(resolved), structures: Object.freeze(structures) };
  }

  #resolveSlot(
    declaration: SlotSpec,
    outputs: unknown,
    ref: SourceRef | undefined,
    path: string,
    structures: Record<string, Structure<unknown>>,
    structureKey: string,
  ): unknown {
    switch (declaration.kind) {
      case "shape":
        return pickOutputs(outputs, declaration.outputs, path);
      case "typed": {
        if (!isPlainRecord(outputs)) throw inputFailure(path, `Typed slot received no output set.`);
        const value = outputs.values;
        if (!isValue(value))
          throw inputFailure(`${path}.values`, `Typed slot requires a values output.`);
        const structure =
          ref?.structure ??
          this.#computedStructure(declaration.type, ref?.sourceId ?? path, value, path);
        defineOwnValue(structures, structureKey, structure);
        return declaration.type.bind(structure, value);
      }
      default:
        return unreachable(declaration);
    }
  }

  #computedStructure(
    type: DataType<unknown, unknown>,
    sourceId: string,
    value: Value,
    path: string,
  ): Structure<unknown> {
    const key = `${sourceId}\u0000${type.id}`;
    const signature = structureSignature(type, value);
    const cached = this.#computedStructures.get(key);
    if (cached?.signature === signature) return cached.structure;
    const parsed = parseDataType(type, value, `${path}.values`);
    if (parsed.kind === "refused") throw new PluginNodeError(parsed.diagnostics);
    this.#computedStructures.set(key, { structure: parsed.value, signature });
    return parsed.value;
  }

  /** Seeds the commit-time cross-source verdict so the first frame does not repeat it. */
  markSourcesChecked(
    structures: SourceStructures,
    warnings: readonly Diagnostic[] = Object.freeze([]),
  ): void {
    this.#checkedStructures = structures;
    this.#checkedWarnings = warnings;
  }

  #checkSources(structures: SourceStructures): readonly Diagnostic[] {
    const check = this.plugin.checkSources;
    if (check === undefined) return Object.freeze([]);
    const declared = this.plugin.inputs.requires ?? {};
    const typed: [string, Extract<SlotSpec, { kind: "typed" }>][] = [];
    for (const [slot, spec] of Object.entries(declared))
      if (spec.kind === "typed") typed.push([slot, spec]);
    if (typed.length === 0) return Object.freeze([]);
    for (const [slot, spec] of typed)
      if (structures[slot] === undefined && spec.optional !== true) return Object.freeze([]);
    if (sameSourceStructures(this.#checkedStructures, structures)) return this.#checkedWarnings;
    let warnings: readonly Diagnostic[];
    try {
      warnings = check(structures);
    } catch (error) {
      throw new PluginNodeError([
        diagnostic(
          "plugin-validation-failed",
          this.nodeId,
          `Plugin '${this.plugin.id}' checkSources threw: ${error instanceof Error ? error.message : String(error)}`,
        ),
      ]);
    }
    const errors = warnings.filter(({ severity }) => severity === "error");
    if (errors.length > 0) throw new PluginNodeError(errors);
    this.#checkedStructures = structures;
    this.#checkedWarnings = Object.freeze([...warnings]);
    return this.#checkedWarnings;
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
