import type {
  Diagnostic,
  NonEmptyDiagnostics,
  Outputs,
  AdmittedPlugin,
  Prepared,
  ResolvedInput,
  ResolvedRequires,
  SlotSpec,
  SourceStructure,
  SourceStructures,
  Structure,
  Value,
  ValueSpec,
} from "../../contract/v5";
import type { ParsedRecord, ParsedValues } from "../../contract/v5-parse";
import { describeDiagnostics, diagnostic } from "../../contract/diagnostics";
import { unreachable } from "../../lang/exhaustive";
import { isPlainRecord } from "../../lang/plain-record";
import { defineOwnValue } from "../../lang/own-property";
import type { Interpolator } from "../../ports/interpolator";
import { createValueEvaluator } from "../evaluate-values";
import { parseModel } from "../model-parse";
import { checkLaterOutputs, PluginNodeError, validatePluginOutputs } from "../plugin-output";
import type { BoundSlot, BoundSlots } from "../bound-slot";
import { isOptionalSlot } from "../../contract/slot-declaration";
import { isValue, findNonFinite } from "../value-validation";
import type { PublisherComposition } from "../graph-publisher";
import { LocalInput } from "../local-input";
import { authoringValue } from "../authoring-value";
import { runtimeStaticView, sameStaticView, type StaticView } from "../static-view";
import type { Processor } from "./processor";

const EMPTY_RECORD: ParsedRecord = Object.freeze({ kind: "record", fields: Object.freeze({}) });
const EMPTY_RECORD_SPEC: ValueSpec = Object.freeze({ kind: "record", fields: Object.freeze({}) });

function staticPayload(view: StaticView, spec: ValueSpec): unknown {
  switch (view.kind) {
    case "record":
      return view.fields;
    case "table":
      return view.rows;
    case "absent":
      return spec.kind === "record" ? Object.freeze({}) : Object.freeze([]);
    default:
      return unreachable(view);
  }
}

function inputFailure(path: string, message: string): PluginNodeError {
  return new PluginNodeError([diagnostic("plugin-input-invalid", path, message)]);
}

function refusalDiagnostics(
  diagnostics: NonEmptyDiagnostics,
  pluginId: string,
): NonEmptyDiagnostics {
  if (!Array.isArray(diagnostics) || diagnostics.length === 0)
    throw new TypeError(`Plugin '${pluginId}' refused prepare without diagnostics.`);
  if (!diagnostics.some(({ severity }) => severity === "error"))
    throw new TypeError(`Plugin '${pluginId}' refused prepare without an error diagnostic.`);
  return diagnostics;
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

export function defaultPluginValues(
  values: ParsedValues | undefined,
  plugin: AdmittedPlugin,
): ParsedValues | undefined {
  if (values !== undefined) return values;
  const spec = plugin.inputs.values?.spec ?? EMPTY_RECORD_SPEC;
  return spec.kind === "record" ? EMPTY_RECORD : undefined;
}

export interface ComputedProcessorOptions {
  readonly nodeId: string;
  readonly plugin: AdmittedPlugin;
  readonly values: ParsedValues | undefined;
  readonly param?: ParsedValues;
  readonly interpolator: Interpolator;
  readonly localInput: LocalInput;
}

type PrepareResult =
  | { readonly kind: "ok" }
  | { readonly kind: "threw"; readonly message: string }
  | { readonly kind: "refused"; readonly diagnostics: NonEmptyDiagnostics };

export class ComputedProcessor implements Processor {
  readonly kind = "computed" as const;
  readonly nodeId: string;
  readonly plugin: AdmittedPlugin;
  readonly #interpolator: Interpolator;
  readonly #localInput: LocalInput;
  #paramInput: LocalInput | undefined;
  #outputsChecked = false;
  #checkedStructures: SourceStructures | undefined;
  #preparedState: unknown;
  #isPrepared = false;
  #parsedValues: ParsedValues | undefined;
  #parsedParam: ParsedValues | undefined;
  readonly #outputStructures = new Map<string, Structure<unknown> | undefined>();
  readonly #outputStaticSnapshots = new Map<string, StaticView>();

  constructor(options: ComputedProcessorOptions) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.plugin = options.plugin;
    this.#interpolator = options.interpolator;
    this.#localInput = options.localInput;
    this.#parsedValues = options.values;
    this.#parsedParam = options.param;
    this.#parseLocalModel(options.values);
    if (this.plugin.inputs.param !== undefined) {
      const paramSpec = this.plugin.inputs.param;
      this.#paramInput = new LocalInput(
        createValueEvaluator(options.param ?? EMPTY_RECORD, options.interpolator, paramSpec),
      );
    }
  }

  get #valuesSpec(): ValueSpec {
    return this.plugin.inputs.values?.spec ?? EMPTY_RECORD_SPEC;
  }

  #parseLocalModel(values: ParsedValues | undefined): void {
    const model = this.plugin.inputs.values?.model;
    if (model === undefined) return;
    const path = `${this.nodeId}.input.values`;
    const parsed = parseModel(model, authoringValue(values, model.spec), path);
    if (parsed.kind === "refused") throw new TypeError(describeDiagnostics(parsed.diagnostics));
  }

  structureAtCommit(): Structure<unknown> | undefined {
    return undefined;
  }

  /** The next compose validates, parses and snapshots afresh; the last structure serves until then. */
  invalidateOutputs(): void {
    this.#outputsChecked = false;
    this.#outputStaticSnapshots.clear();
  }

  outputStructure(outputName: string): Structure<unknown> | undefined {
    return this.#outputStructures.get(outputName);
  }

  setProgress(value: number): boolean {
    const p1 = this.#localInput.setProgress(value);
    const p2 = this.#paramInput?.setProgress(value) ?? false;
    return p1 || p2;
  }

  replaceValues(values: ParsedValues | undefined): void {
    const valuesSpec = this.#valuesSpec;
    this.#localInput.replaceEvaluator(
      () =>
        createValueEvaluator(
          defaultPluginValues(values, this.plugin),
          this.#interpolator,
          valuesSpec,
        ),
      () => {
        this.#parsedValues = values;
      },
    );
  }

  replaceParam(param: ParsedValues | undefined): void {
    const spec = this.plugin.inputs.param;
    if (spec === undefined) return;
    this.#paramInput?.replaceEvaluator(
      () => createValueEvaluator(param ?? EMPTY_RECORD, this.#interpolator, spec),
      () => {
        this.#parsedParam = param;
      },
    );
  }

  replaceParamOverlay(value: Value | undefined): void {
    this.#paramInput?.replaceOverlay(value);
  }

  compose(slots: BoundSlots = {}): PublisherComposition {
    const localInput = this.#localInput;
    localInput.assertActive();
    const spec = this.#valuesSpec;
    const local = localInput.evaluate();
    if (spec.kind === "table" ? !Array.isArray(local) : Array.isArray(local))
      throw new PluginNodeError([
        diagnostic(
          "values-shape-invalid",
          `${this.nodeId}.input.values`,
          `Plugin '${this.plugin.id}' declares ${spec.kind} input.`,
        ),
      ]);
    const { values: resolved, structures } = this.#resolve(slots);
    this.#runPrepare(structures);
    const evaluatedParam = this.#paramInput?.evaluate();
    const input: ResolvedInput = Object.freeze({
      values: local,
      requires: Object.freeze(resolved),
      ...(evaluatedParam !== undefined ? { param: evaluatedParam } : {}),
      structures,
      state: this.#preparedState,
    });
    const context = Object.freeze({ nodeId: this.nodeId, progress: localInput.progress });
    const raw = this.plugin.transform(input, context);
    const outputs = this.#outputsChecked
      ? checkLaterOutputs(raw, this.plugin.outputs, this.nodeId)
      : validatePluginOutputs(raw, this.plugin.outputs, this.nodeId);
    this.#outputsChecked = true;
    this.#checkOutputs(raw);
    return {
      outputs,
      sourceProgress: localInput.progress,
      sourceRevisions: {},
    };
  }

  prepareCommit(structures: SourceStructures): void {
    const result = this.#prepareWith(structures);
    switch (result.kind) {
      case "ok":
        return;
      case "threw":
        throw new TypeError(describeDiagnostics([this.#prepareThrew(result.message)]));
      case "refused":
        throw new TypeError(describeDiagnostics(result.diagnostics));
      default:
        return unreachable(result);
    }
  }

  #prepareThrew(message: string): Diagnostic {
    return diagnostic(
      "plugin-validation-failed",
      this.nodeId,
      `Plugin '${this.plugin.id}' prepare threw: ${message}`,
    );
  }

  #prepareWith(structures: SourceStructures): PrepareResult {
    const prepare = this.plugin.prepare;
    if (prepare === undefined) return { kind: "ok" };
    const staticValues = this.#staticValuesView();
    const staticParam = this.#staticParamView();
    let res: Prepared<unknown>;
    try {
      res = prepare({
        values: staticValues,
        param: staticParam,
        structures,
      });
    } catch (error) {
      return { kind: "threw", message: error instanceof Error ? error.message : String(error) };
    }
    if (!res.ok)
      return { kind: "refused", diagnostics: refusalDiagnostics(res.diagnostics, this.plugin.id) };
    this.#preparedState = res.value;
    this.#isPrepared = true;
    this.#checkedStructures = structures;
    return { kind: "ok" };
  }

  #staticValuesView(): unknown {
    const spec = this.#valuesSpec;
    const view = runtimeStaticView(authoringValue(this.#parsedValues, spec), spec);
    return staticPayload(view, spec);
  }

  #staticParamView(): unknown {
    const spec = this.plugin.inputs.param;
    if (spec === undefined) return undefined;
    const view = runtimeStaticView(authoringValue(this.#parsedParam, spec), spec);
    return staticPayload(view, spec);
  }

  #runPrepare(structures: SourceStructures): void {
    const prepare = this.plugin.prepare;
    if (prepare === undefined) return;
    if (this.#isPrepared && sameSourceStructures(this.#checkedStructures, structures)) {
      return;
    }
    const result = this.#prepareWith(structures);
    switch (result.kind) {
      case "ok":
        return;
      case "threw":
        throw new PluginNodeError([this.#prepareThrew(result.message)]);
      case "refused":
        throw new PluginNodeError(result.diagnostics);
      default:
        return unreachable(result);
    }
  }

  #checkOutputs(raw: Outputs): void {
    for (const [name, output] of Object.entries(this.plugin.outputs)) {
      const rawValue = raw[name];
      if (rawValue === undefined) continue;
      const badPath = findNonFinite(rawValue, "");
      if (badPath !== undefined) {
        const relative = badPath === "" ? name : `${name}.${badPath}`;
        throw new PluginNodeError([
          diagnostic(
            "output-invalid",
            `${this.nodeId}.output.${relative}`,
            `Plugin '${this.plugin.id}' published a non-finite value at ${relative}.`,
          ),
        ]);
      }
      switch (output.kind) {
        case "spec":
          continue;
        case "model":
          break;
        default:
          return unreachable(output);
      }
      if (!isValue(rawValue)) continue;
      const specOrModel = output.model;
      const snapshot = this.#outputStaticSnapshots.get(name);
      if (snapshot === undefined) {
        const parsed = parseModel(specOrModel, rawValue, `${this.nodeId}.output.${name}`);
        if (parsed.kind === "refused") throw new PluginNodeError(parsed.diagnostics);
        this.#outputStructures.set(name, parsed.value);
        const staticView = runtimeStaticView(rawValue, specOrModel.spec);
        this.#outputStaticSnapshots.set(name, staticView);
      } else {
        const currentView = runtimeStaticView(rawValue, specOrModel.spec);
        if (!sameStaticView(snapshot, currentView)) {
          throw new PluginNodeError([
            diagnostic(
              "output-static-changed",
              `${this.nodeId}.output.${name}`,
              `Static cells of output '${name}' changed between frames.`,
            ),
          ]);
        }
      }
    }
  }

  #resolve(slots: BoundSlots): {
    readonly values: ResolvedRequires;
    readonly structures: SourceStructures;
  } {
    const resolved: Record<string, unknown> = {};
    const structures: Record<string, SourceStructure> = {};
    for (const [slot, declaration] of Object.entries(this.plugin.inputs.requires ?? {})) {
      const entry = slots[slot];
      const path = `${this.nodeId}.input.requires.${slot}`;
      if (entry === undefined) {
        if (isOptionalSlot(declaration)) continue;
        throw inputFailure(path, `Required slot '${slot}' is not bound.`);
      }
      switch (entry.kind) {
        case "single": {
          const singleStructures: Record<string, Structure<unknown>> = {};
          defineOwnValue(
            resolved,
            slot,
            this.#resolveSlot(declaration, entry.bound, path, singleStructures, slot),
          );
          const structure = singleStructures[slot];
          if (structure !== undefined) defineOwnValue(structures, slot, structure);
          break;
        }
        case "map": {
          if (Object.keys(entry.members).length === 0)
            throw inputFailure(path, `Slot '${slot}' requires a map binding.`);
          const members: Record<string, unknown> = {};
          const memberStructures: Record<string, Structure<unknown>> = {};
          for (const [key, bound] of Object.entries(entry.members)) {
            defineOwnValue(
              members,
              key,
              this.#resolveSlot(declaration, bound, `${path}.${key}`, memberStructures, key),
            );
          }
          defineOwnValue(resolved, slot, Object.freeze(members));
          if (Object.keys(memberStructures).length > 0)
            defineOwnValue(structures, slot, Object.freeze(memberStructures));
          break;
        }
        default:
          return unreachable(entry);
      }
    }
    return { values: Object.freeze(resolved), structures: Object.freeze(structures) };
  }

  #resolveSlot(
    declaration: SlotSpec,
    bound: BoundSlot,
    path: string,
    structures: Record<string, Structure<unknown>>,
    structureKey: string,
  ): unknown {
    const outputs = bound.values;
    switch (declaration.kind) {
      case "model": {
        if (!isPlainRecord(outputs)) throw inputFailure(path, `Model slot received no output set.`);
        const value = outputs.values;
        if (!isValue(value))
          throw inputFailure(`${path}.values`, `Model slot requires a values output.`);
        if (bound.structure === undefined && declaration.model.parse !== undefined)
          throw inputFailure(path, "Model slot has no parsed structure.");
        if (bound.structure !== undefined)
          defineOwnValue(structures, structureKey, bound.structure);
        return value;
      }
      case "shape":
        return pickOutputs(outputs, declaration.outputs, path);
      default:
        return unreachable(declaration);
    }
  }

  dispose(): void {
    this.#paramInput?.dispose();
  }
}
