import type {
  Diagnostic,
  Model,
  Outputs,
  PluginDefinition,
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
import { isModel } from "../../contract/v5";
import type { ParsedRecord, ParsedValues } from "../../contract/v5-parse";
import { describeDiagnostics, diagnostic } from "../../contract/diagnostics";
import { unreachable } from "../../lang/exhaustive";
import { defineOwnValue } from "../../lang/own-property";
import type { Interpolator } from "../../ports/interpolator";
import { createValueEvaluator } from "../evaluate-values";
import { parseModel } from "../model-parse";
import { PluginNodeError, validatePluginOutputs } from "../plugin-output";
import type { BoundSlot, BoundSlots } from "../bound-slot";
import {
  isOptionalSlot,
  needsSlotStructure,
  slotDeclaration,
} from "../../contract/slot-declaration";
import { isValue } from "../value-validation";
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
  plugin: PluginDefinition,
): ParsedValues | undefined {
  if (values !== undefined) return values;
  const raw = plugin.inputs.values;
  const spec = isModel(raw) ? raw.spec : (raw ?? EMPTY_RECORD_SPEC);
  return spec.kind === "record" ? EMPTY_RECORD : undefined;
}

export interface ComputedProcessorOptions {
  readonly nodeId: string;
  readonly plugin?: PluginDefinition;
  readonly definition?: PluginDefinition;
  readonly values: ParsedValues | undefined;
  readonly param?: ParsedValues;
  readonly interpolator: Interpolator;
  readonly requires?: Record<string, unknown>;
}

export class ComputedProcessor implements Processor {
  readonly kind = "computed" as const;
  readonly nodeId: string;
  readonly plugin: PluginDefinition;
  readonly #interpolator: Interpolator;
  #paramInput: LocalInput | undefined;
  #outputsChecked = false;
  readonly #computedStructures = new Map<string, Structure<unknown>>();
  #checkedStructures: SourceStructures | undefined;
  #checkedWarnings: readonly Diagnostic[] = Object.freeze([]);
  #preparedState: unknown;
  #isPrepared = false;
  #parsedValues: ParsedValues | undefined;
  #parsedParam: ParsedValues | undefined;
  readonly #outputStructures = new Map<string, Structure<unknown> | undefined>();
  readonly #outputStaticSnapshots = new Map<string, StaticView>();

  constructor(options: ComputedProcessorOptions) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    const plugin = options.definition ?? options.plugin;
    if (plugin === undefined) throw new TypeError("Plugin definition must be provided.");
    this.nodeId = options.nodeId;
    this.plugin = plugin;
    this.#interpolator = options.interpolator;
    this.#parsedValues = options.values;
    this.#parsedParam = options.param;
    if (this.plugin.inputs.param !== undefined) {
      const paramSpec = this.plugin.inputs.param;
      this.#paramInput = new LocalInput(
        createValueEvaluator(
          options.param ?? (paramSpec.kind === "record" ? EMPTY_RECORD : undefined),
          options.interpolator,
          paramSpec,
        ),
      );
    }
  }

  structureAtCommit(): Structure<unknown> | undefined {
    return undefined;
  }

  outputStructure(outputName: string): Structure<unknown> | undefined {
    return this.#outputStructures.get(outputName);
  }

  setProgress(value: number, localInput: LocalInput): boolean {
    const p1 = localInput.setProgress(value);
    const p2 = this.#paramInput?.setProgress(value) ?? false;
    return p1 || p2;
  }

  replaceValues(values: ParsedValues | undefined, localInput: LocalInput): void {
    const rawSpec = this.plugin.inputs.values;
    const valuesSpec = isModel(rawSpec) ? rawSpec.spec : (rawSpec ?? EMPTY_RECORD_SPEC);
    this.#parsedValues = values;
    localInput.replaceEvaluator(() =>
      createValueEvaluator(
        defaultPluginValues(values, this.plugin),
        this.#interpolator,
        valuesSpec,
      ),
    );
    this.#isPrepared = false;
    this.#outputStaticSnapshots.clear();
    this.#outputStructures.clear();
  }

  replaceParam(param: ParsedValues | undefined): void {
    const spec = this.plugin.inputs.param;
    if (spec === undefined) return;
    this.#parsedParam = param;
    this.#paramInput?.replaceEvaluator(() =>
      createValueEvaluator(
        param ?? (spec.kind === "record" ? EMPTY_RECORD : undefined),
        this.#interpolator,
        spec,
      ),
    );
  }

  compose(slots: BoundSlots = {}, localInput: LocalInput): PublisherComposition {
    localInput.assertActive();
    const rawValues = this.plugin.inputs.values;
    const spec = isModel(rawValues) ? rawValues.spec : (rawValues ?? EMPTY_RECORD_SPEC);
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
    const warnings = this.#checkSources(structures);
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
      ? raw
      : validatePluginOutputs(raw, this.plugin.outputs, this.nodeId);
    this.#outputsChecked = true;
    this.#checkOutputModels(raw);
    return {
      outputs,
      sourceProgress: localInput.progress,
      sourceRevisions: {},
      ...(warnings.length === 0 ? {} : { diagnostics: warnings }),
    };
  }

  markPrepared(state: unknown, structures: SourceStructures): void {
    this.#preparedState = state;
    this.#isPrepared = true;
    this.#checkedStructures = structures;
  }

  prepareCommit(structures: SourceStructures): void {
    const prepare = this.plugin.prepare;
    if (prepare === undefined) return;
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
      throw new TypeError(
        describeDiagnostics([
          diagnostic(
            "plugin-validation-failed",
            this.nodeId,
            `Plugin '${this.plugin.id}' prepare threw: ${error instanceof Error ? error.message : String(error)}`,
          ),
        ]),
      );
    }
    if (!res.ok) {
      const diagnostics = res.issues.map((issue) =>
        diagnostic(
          "plugin-validation-failed",
          issue.path.length === 0
            ? this.nodeId
            : issue.path.startsWith(this.nodeId)
              ? issue.path
              : `${this.nodeId}.input.requires.${issue.path}`,
          issue.message,
        ),
      );
      throw new TypeError(describeDiagnostics(diagnostics));
    }
    this.#preparedState = res.value;
    this.#isPrepared = true;
    this.#checkedStructures = structures;
  }

  #staticValuesView(): unknown {
    const raw = this.plugin.inputs.values;
    const spec = isModel(raw) ? raw.spec : (raw ?? EMPTY_RECORD_SPEC);
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
      throw new PluginNodeError([
        diagnostic(
          "plugin-validation-failed",
          this.nodeId,
          `Plugin '${this.plugin.id}' prepare threw: ${error instanceof Error ? error.message : String(error)}`,
        ),
      ]);
    }
    if (!res.ok) {
      const diagnostics = res.issues.map((issue) =>
        diagnostic(
          "plugin-validation-failed",
          issue.path.length === 0
            ? this.nodeId
            : issue.path.startsWith(this.nodeId)
              ? issue.path
              : `${this.nodeId}.input.requires.${issue.path}`,
          issue.message,
        ),
      );
      throw new PluginNodeError(diagnostics);
    }
    this.#preparedState = res.value;
    this.#isPrepared = true;
    this.#checkedStructures = structures;
  }

  #checkOutputModels(raw: Outputs): void {
    for (const [name, specOrModel] of Object.entries(this.plugin.outputs)) {
      if (!isModel(specOrModel)) continue;
      const rawValue = raw[name];
      if (!isValue(rawValue)) continue;
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
    for (const [slot, declaredSlot] of Object.entries(this.plugin.inputs.requires ?? {})) {
      const declaration = slotDeclaration(declaredSlot);
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
        const structure =
          bound.structure ??
          (declaration.model.parse !== undefined
            ? this.#computedModelStructure(declaration.model, bound.sourceId, value, path)
            : undefined);
        if (structure !== undefined) defineOwnValue(structures, structureKey, structure);
        return value;
      }
      case "shape":
        return pickOutputs(outputs, declaration.outputs, path);
      default:
        return unreachable(declaration);
    }
  }

  #computedModelStructure(
    model: Model<unknown, unknown>,
    sourceId: string,
    value: Value,
    path: string,
  ): Structure<unknown> | undefined {
    const key = `${sourceId}\u0000${model.id}`;
    const cached = this.#computedStructures.get(key);
    if (cached !== undefined) return cached;
    const parsed = parseModel(model, value, `${path}.values`);
    if (parsed.kind === "refused") throw new PluginNodeError(parsed.diagnostics);
    if (parsed.value !== undefined) {
      this.#computedStructures.set(key, parsed.value);
    }
    return parsed.value;
  }

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
    const structured = Object.entries(declared).filter(([, slot]) =>
      needsSlotStructure(slotDeclaration(slot)),
    );
    if (structured.length === 0) return Object.freeze([]);
    for (const [slot] of structured) if (structures[slot] === undefined) return Object.freeze([]);
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

  dispose(): void {
    this.#paramInput?.dispose();
  }
}
