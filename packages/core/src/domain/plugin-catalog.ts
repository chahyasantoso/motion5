import type {
  DataType,
  Diagnostic,
  EvaluationContext,
  Model,
  ModelSlotSpec,
  Outputs,
  Parsed,
  PluginDefinition,
  Prepared,
  RecordSpec,
  ResolvedInput,
  SlotSpec,
  SourceStructures,
  Structure,
  Value,
  ValueSpec,
} from "../contract/v5";
import { isModel, isOptionalModel } from "../contract/v5";
import type { RuleId } from "../contract/rule-id";
import { readValueSpec } from "../contract/v5-parse";
import type { PluginCapabilities, PluginCapability } from "../ports/plugin-capabilities";

/**
 * Identified-table plugin registry keyed by authored `id`: admits whole definitions, all-or-none per batch.
 */

const PLUGIN_FIELDS = new Set(["id", "inputs", "outputs", "checkSources", "prepare", "transform"]);
const INPUT_FIELDS = new Set(["param", "values", "requires"]);
const DEPENDENCY_FIELDS = new Set(["kind", "outputs", "optional", "binding"]);
const TYPED_FIELDS = new Set(["kind", "type", "optional", "binding"]);
const MODEL_SLOT_FIELDS = new Set(["kind", "model", "optional", "binding"]);
const DATA_TYPE_FIELDS = new Set(["id", "spec", "parse", "bind"]);
const RESERVED_NAMES = new Set(["__proto__", "constructor", "prototype"]);
const BINDING_MODES = new Set(["single", "map"]);
const PASCAL_CASE_RE = /^[A-Z][A-Za-z0-9]*$/;
const EMPTY_MEMBERS: readonly string[] = Object.freeze([]);
const EMPTY_TYPES: readonly DataType<unknown, unknown>[] = Object.freeze([]);
const EMPTY_MODELS: readonly Model<unknown, unknown>[] = Object.freeze([]);
const EMPTY_RECORD_SPEC: ValueSpec = Object.freeze({ kind: "record", fields: Object.freeze({}) });

type TransformHook = PluginDefinition["transform"];
type CheckSourcesHook = NonNullable<PluginDefinition["checkSources"]>;
type PrepareHook = NonNullable<PluginDefinition["prepare"]>;

/** One admission refusal carrying its rule id and definition path. */
export class PluginAdmissionError extends TypeError {
  readonly ruleId: RuleId;

  constructor(ruleId: RuleId, path: string, message: string) {
    super(`${ruleId} at ${path}: ${message}`);
    this.name = "PluginAdmissionError";
    this.ruleId = ruleId;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function own(record: Record<string, unknown>, key: string): unknown {
  return Object.hasOwn(record, key) ? record[key] : undefined;
}

function refuse(ruleId: RuleId, path: string, message: string): never {
  throw new PluginAdmissionError(ruleId, path, message);
}

function requireRecord(value: unknown, path: string): Record<string, unknown> {
  if (!isRecord(value)) refuse("plugin-shape", path, "must be a plain object.");
  return value;
}

function admitModel(value: unknown, path: string): Model<unknown, unknown> {
  const source = requireRecord(value, path);
  const idValue = own(source, "id");
  if (typeof idValue !== "string" || !PASCAL_CASE_RE.test(idValue)) {
    refuse(
      "model-id-invalid",
      `${path}.id`,
      `Model id must match PascalCase ^[A-Z][A-Za-z0-9]*$, received '${String(idValue)}'.`,
    );
  }
  readSpec(own(source, "spec"), `${path}.spec`, true);
  const parse = own(source, "parse");
  if (parse !== undefined && typeof parse !== "function") {
    refuse("plugin-shape", `${path}.parse`, "parse must be a function.");
  }
  const legacyTypeId = own(source, "legacyTypeId");
  if (legacyTypeId !== undefined && typeof legacyTypeId !== "string") {
    refuse("plugin-shape", `${path}.legacyTypeId`, "legacyTypeId must be a string when present.");
  }
  if (!isModel(value)) {
    refuse("plugin-shape", path, "must be a Model.");
  }
  return value;
}

function assertKnownKeys(
  record: Readonly<Record<string, unknown>>,
  allowed: ReadonlySet<string>,
  path: string,
  what: string,
): void {
  for (const key of Object.keys(record))
    if (!allowed.has(key)) refuse("plugin-shape", `${path}.${key}`, `${what} member is unknown.`);
}

function readName(value: unknown, path: string, what: string): string {
  if (typeof value !== "string" || value.trim().length === 0)
    refuse("plugin-shape", path, `${what} must be a non-empty string.`);
  const name = value;
  if (RESERVED_NAMES.has(name)) refuse("name-reserved", path, `${what} '${name}' is reserved.`);
  if (name.includes(":"))
    refuse("name-reserved", path, `${what} '${name}' must not contain ':' (internal namespace).`);
  return name;
}

function readSpec(value: unknown, path: string, allowStatic: boolean): ValueSpec {
  const diagnostics: Diagnostic[] = [];
  const spec = readValueSpec(value, path, diagnostics);
  const first = diagnostics[0];
  if (first !== undefined) throw new PluginAdmissionError(first.ruleId, first.path, first.message);
  if (spec === undefined) refuse("plugin-shape", path, "must be a complete ValueSpec.");
  if (!allowStatic) rejectStatic(spec, path);
  return spec;
}

function rejectStatic(spec: ValueSpec, path: string): void {
  const fields = spec.kind === "table" ? spec.schema.row.fields : spec.fields;
  const prefix = spec.kind === "table" ? `${path}.schema.row.fields` : `${path}.fields`;
  for (const [name, field] of Object.entries(fields))
    if (field.static === true)
      refuse(
        "spec-field-unknown",
        `${prefix}.${name}.static`,
        "static is local authored input only.",
      );
}

function readTrue(value: unknown, path: string, name: string): true | undefined {
  if (value === undefined) return undefined;
  if (value !== true) refuse("plugin-shape", path, `${name} must be true when present.`);
  return true;
}

function readBinding(value: unknown, path: string): "single" | "map" {
  if (value === undefined) return "single";
  if (typeof value !== "string" || !BINDING_MODES.has(value))
    refuse("slot-binding-mode", path, 'binding must be "single" or "map".');
  return value === "map" ? "map" : "single";
}

function readHook<T>(value: unknown, path: string, name: string): T | undefined {
  if (value === undefined) return undefined;
  if (typeof value !== "function")
    refuse("plugin-shape", path, `${name} must be a function when present.`);
  return value as T;
}

function readDataType(value: unknown, path: string): DataType<unknown, unknown> {
  const source = requireRecord(value, path);
  assertKnownKeys(source, DATA_TYPE_FIELDS, path, "DataType");
  const id = readName(own(source, "id"), `${path}.id`, "Data type id");
  const spec = readSpec(own(source, "spec"), `${path}.spec`, true);
  const parse = readHook<DataType<unknown, unknown>["parse"]>(
    own(source, "parse"),
    `${path}.parse`,
    "parse",
  );
  const bind = readHook<DataType<unknown, unknown>["bind"]>(
    own(source, "bind"),
    `${path}.bind`,
    "bind",
  );
  if (parse === undefined) refuse("plugin-shape", `${path}.parse`, "parse must be a function.");
  if (bind === undefined) refuse("plugin-shape", `${path}.bind`, "bind must be a function.");
  const type = source as unknown as DataType<unknown, unknown>;
  if (type.id !== id) refuse("plugin-shape", `${path}.id`, "data type id moved during admission.");
  Object.freeze(type.spec);
  return Object.freeze(type);
}

function readShapeSlot(source: Readonly<Record<string, unknown>>, path: string): SlotSpec {
  assertKnownKeys(source, DEPENDENCY_FIELDS, path, "Shape slot");
  const outputsSource = requireRecord(own(source, "outputs"), `${path}.outputs`);
  const outputs: Record<string, ValueSpec> = {};
  for (const [name, spec] of Object.entries(outputsSource)) {
    const outputName = readName(name, `${path}.outputs.${name}`, "Output name");
    outputs[outputName] = readSpec(spec, `${path}.outputs.${outputName}`, false);
  }
  return Object.freeze({
    kind: "shape",
    outputs: Object.freeze(outputs),
    ...(readTrue(own(source, "optional"), `${path}.optional`, "optional") === undefined
      ? {}
      : { optional: true as const }),
    binding: readBinding(own(source, "binding"), `${path}.binding`),
  });
}

function readTypedSlot(source: Readonly<Record<string, unknown>>, path: string): SlotSpec {
  assertKnownKeys(source, TYPED_FIELDS, path, "Typed slot");
  return Object.freeze({
    kind: "typed",
    type: readDataType(own(source, "type"), `${path}.type`),
    ...(readTrue(own(source, "optional"), `${path}.optional`, "optional") === undefined
      ? {}
      : { optional: true as const }),
    binding: readBinding(own(source, "binding"), `${path}.binding`),
  });
}

function readModelSlot(source: Readonly<Record<string, unknown>>, path: string): SlotSpec {
  assertKnownKeys(source, MODEL_SLOT_FIELDS, path, "Model slot");
  const model = admitModel(own(source, "model"), `${path}.model`);
  return Object.freeze({
    kind: "model",
    model,
    ...(readTrue(own(source, "optional"), `${path}.optional`, "optional") === undefined
      ? {}
      : { optional: true as const }),
    binding: readBinding(own(source, "binding"), `${path}.binding`),
  });
}

function readSlotSpec(value: unknown, path: string): SlotSpec {
  const source = requireRecord(value, path);
  const kind = own(source, "kind");
  switch (kind) {
    case "model":
      return readModelSlot(source, path);
    case "shape":
      return readShapeSlot(source, path);
    case "typed":
      return readTypedSlot(source, path);
    default:
      return refuse(
        "plugin-shape",
        `${path}.kind`,
        'Slot kind must be "model", "typed", or "shape".',
      );
  }
}

function readInputs(
  value: unknown,
  path: string,
  referencedModels: Model<unknown, unknown>[],
): PluginDefinition["inputs"] {
  const source = requireRecord(value, path);
  assertKnownKeys(source, INPUT_FIELDS, path, "Plugin inputs");
  let param: RecordSpec | undefined;
  if (source.param !== undefined) {
    const spec = readSpec(source.param, `${path}.param`, true);
    if (spec.kind !== "record") {
      refuse("plugin-input-invalid", `${path}.param`, "Plugin param must be a record spec.");
    }
    param = spec;
  }
  let values: ValueSpec | undefined;
  if (source.values !== undefined) {
    if (isModel(source.values)) {
      const model = admitModel(source.values, `${path}.values`);
      referencedModels.push(model);
      values = model.spec;
    } else {
      values = readSpec(source.values, `${path}.values`, true);
    }
    if (values.optional === true)
      refuse(
        "plugin-input-invalid",
        `${path}.values.optional`,
        "optional is not valid on inputs.values.",
      );
  } else if (param === undefined) {
    refuse("plugin-shape", `${path}.values`, "Plugin inputs must declare values.");
  }
  let requires: Readonly<Record<string, SlotSpec>> | undefined;
  if (source.requires !== undefined) {
    const requiresSource = requireRecord(source.requires, `${path}.requires`);
    const slots: Record<string, SlotSpec> = {};
    for (const [slot, dependency] of Object.entries(requiresSource)) {
      const slotName = readName(slot, `${path}.requires.${slot}`, "Dependency slot");
      if (isModel(dependency)) {
        const model = admitModel(dependency, `${path}.requires.${slotName}`);
        referencedModels.push(model);
        slots[slotName] = Object.freeze({
          kind: "model",
          model,
          binding: "single",
        });
      } else if (isOptionalModel(dependency)) {
        const model = admitModel(dependency.model, `${path}.requires.${slotName}.model`);
        referencedModels.push(model);
        slots[slotName] = Object.freeze({
          kind: "model",
          model,
          optional: true,
          binding: dependency.binding ?? "single",
        });
      } else {
        const slotSpec = readSlotSpec(dependency, `${path}.requires.${slotName}`);
        if (slotSpec.kind === "model") {
          referencedModels.push(slotSpec.model);
        }
        slots[slotName] = slotSpec;
      }
    }
    requires = Object.freeze(slots);
  }
  return Object.freeze({
    ...(param === undefined ? {} : { param }),
    values: values ?? Object.freeze({ kind: "record", fields: Object.freeze({}) }),
    ...(requires === undefined ? {} : { requires }),
  });
}

function readOutputs(
  value: unknown,
  path: string,
  referencedModels: Model<unknown, unknown>[],
): PluginDefinition["outputs"] {
  const source = requireRecord(value, path);
  const outputs: Record<string, ValueSpec | Model<unknown, unknown>> = {};
  const outputModelIds = new Set<string>();
  for (const [name, specOrModel] of Object.entries(source)) {
    const outputName = readName(name, `${path}.${name}`, "Output name");
    if (isModel(specOrModel)) {
      const model = admitModel(specOrModel, `${path}.${outputName}`);
      if (outputModelIds.has(model.id)) {
        refuse(
          "plugin-duplicate-output",
          `${path}.${outputName}`,
          `Plugin cannot implement model '${model.id}' on multiple outputs.`,
        );
      }
      outputModelIds.add(model.id);
      referencedModels.push(model);
      outputs[outputName] = model;
    } else {
      outputs[outputName] = readSpec(specOrModel, `${path}.${outputName}`, false);
    }
  }
  return Object.freeze(outputs);
}

/** Reads and freezes one definition; `staged` holds ids reserved earlier in the batch. */
function admitPlugin(
  value: unknown,
  staged: ReadonlySet<string>,
  registered: (id: string) => boolean,
): { readonly definition: PluginDefinition; readonly models: readonly Model<unknown, unknown>[] } {
  const source = requireRecord(value, "plugin");
  assertKnownKeys(source, PLUGIN_FIELDS, "plugin", "Plugin definition");
  const id = readName(own(source, "id"), "plugin.id", "Plugin id");
  if (registered(id) || staged.has(id))
    refuse("plugin-duplicate-id", "plugin.id", `Plugin '${id}' is already admitted.`);
  const referencedModels: Model<unknown, unknown>[] = [];
  const inputs = readInputs(own(source, "inputs"), "plugin.inputs", referencedModels);
  const outputs = readOutputs(own(source, "outputs"), "plugin.outputs", referencedModels);
  const rawTransform = readHook<TransformHook>(
    own(source, "transform"),
    "plugin.transform",
    "transform",
  );
  if (rawTransform === undefined)
    refuse("plugin-transform-missing", "plugin.transform", "transform must be a function.");
  const rawCheckSources = readHook<CheckSourcesHook>(
    own(source, "checkSources"),
    "plugin.checkSources",
    "checkSources",
  );
  const rawPrepare = readHook<PrepareHook>(own(source, "prepare"), "plugin.prepare", "prepare");
  // Runtime validates values before and result after; wrapper rebinds `this` and casts.
  const transform: TransformHook = (input: ResolvedInput, context: EvaluationContext) =>
    Reflect.apply(rawTransform, source, [input, context]) as Outputs;
  const checkSources: CheckSourcesHook | undefined =
    rawCheckSources === undefined
      ? undefined
      : (structures: SourceStructures) =>
          Reflect.apply(rawCheckSources, source, [structures]) as readonly Diagnostic[];
  const prepare: PrepareHook | undefined =
    rawPrepare === undefined
      ? undefined
      : (ctx) => Reflect.apply(rawPrepare, source, [ctx]) as Prepared<unknown>;
  const definition = Object.freeze({
    id,
    inputs,
    outputs,
    ...(checkSources === undefined ? {} : { checkSources }),
    ...(prepare === undefined ? {} : { prepare }),
    transform,
  });
  return { definition, models: referencedModels };
}

interface TypeBatch {
  readonly types: ReadonlyMap<string, DataType<unknown, unknown>>;
}

function collectTypes(definitions: readonly PluginDefinition[]): TypeBatch {
  const types = new Map<string, DataType<unknown, unknown>>();
  for (const definition of definitions) {
    for (const slot of Object.values(definition.inputs.requires ?? {})) {
      if (!("type" in slot) || slot.kind !== "typed") continue;
      const existing = types.get(slot.type.id);
      if (existing !== undefined && existing !== slot.type)
        throw new PluginAdmissionError(
          "plugin-shape",
          `plugin.${definition.id}.inputs.requires`,
          `Data type '${slot.type.id}' is declared twice with different definitions.`,
        );
      types.set(slot.type.id, slot.type);
    }
  }
  return { types };
}

/** One declared plugin slot, flattened for inspection. */
export type DescribedSlot =
  | {
      readonly kind: "model";
      readonly modelId: string;
      readonly optional?: true;
      readonly binding: "single" | "map";
    }
  | {
      readonly kind: "typed";
      readonly typeId: string;
      readonly spec: ValueSpec;
      readonly optional?: true;
      readonly binding: "single" | "map";
    }
  | {
      readonly kind: "shape";
      readonly outputs: Readonly<Record<string, ValueSpec>>;
      readonly optional?: true;
      readonly binding: "single" | "map";
    };

/** A plugin's declared input and output contracts. */
export interface PluginDescription {
  readonly id: string;
  readonly values: ValueSpec;
  readonly requires: Readonly<Record<string, DescribedSlot>>;
  readonly outputs: Readonly<Record<string, ValueSpec | Model<unknown, unknown>>>;
}

function describeSlot(slot: SlotSpec): DescribedSlot {
  switch (slot.kind) {
    case "model":
      return Object.freeze({
        kind: "model",
        modelId: slot.model.id,
        ...(slot.optional === true ? { optional: true as const } : {}),
        binding: slot.binding ?? "single",
      });
    case "typed":
      return Object.freeze({
        kind: "typed",
        typeId: slot.type.id,
        spec: slot.type.spec,
        ...(slot.optional === true ? { optional: true as const } : {}),
        binding: slot.binding ?? "single",
      });
    case "shape":
      return Object.freeze({
        kind: "shape",
        outputs: slot.outputs,
        ...(slot.optional === true ? { optional: true as const } : {}),
        binding: slot.binding ?? "single",
      });
    default:
      return unreachableSlot(slot);
  }
}

function unreachableSlot(slot: never): never {
  throw new TypeError(`Unknown slot kind: ${JSON.stringify(slot)}`);
}

/** Options for initializing a PluginCatalog with plugins and models. */
export interface PluginCatalogOptions {
  readonly plugins?: readonly PluginDefinition<never>[];
  readonly models?: readonly Model<unknown, unknown>[];
}

/** Identified-table registry; one instance belongs to one host composition. */
export class PluginCatalog implements PluginCapabilities {
  readonly #plugins = new Map<string, PluginDefinition>();
  readonly #dataTypes = new Map<string, DataType<unknown, unknown>>();
  readonly #models = new Map<string, Model<unknown, unknown>>();

  constructor(options?: PluginCatalogOptions | readonly PluginDefinition<never>[]) {
    if (options !== undefined) {
      if (Array.isArray(options)) {
        this.registerAll(options);
      } else if (typeof options === "object" && options !== null) {
        const plugins = "plugins" in options ? (options.plugins ?? []) : [];
        const models = "models" in options ? (options.models ?? []) : [];
        this.#admitBatch({ plugins, models });
      }
    }
  }

  /** Admit one definition atomically. */
  register<Input extends ResolvedInput>(plugin: PluginDefinition<Input>): void;
  register(model: Model<unknown, unknown>): void;
  register(candidate: unknown): void;
  register(candidate: unknown): void {
    if (isModel(candidate)) {
      this.registerModels([candidate]);
    } else {
      this.#admitBatch({ plugins: [candidate], models: [] });
    }
  }

  /** Admit a single model definition atomically. */
  registerModel(model: unknown): void {
    this.registerModels([model]);
  }

  /** Admit an array of model definitions atomically. */
  registerModels(models: unknown): void {
    if (!Array.isArray(models))
      throw new PluginAdmissionError("plugin-shape", "models", "must be an array.");
    this.#admitBatch({ plugins: [], models });
  }

  /** Admit a batch atomically: every definition passes or none is stored. */
  registerAll(plugins: readonly PluginDefinition<never>[]): void;
  registerAll(options: PluginCatalogOptions): void;
  registerAll(plugins: unknown): void {
    if (isRecord(plugins) && ("plugins" in plugins || "models" in plugins)) {
      const pluginsList = own(plugins, "plugins");
      const modelsList = own(plugins, "models");
      this.#admitBatch({
        plugins: Array.isArray(pluginsList) ? pluginsList : [],
        models: Array.isArray(modelsList) ? modelsList : [],
      });
      return;
    }
    if (!Array.isArray(plugins))
      throw new PluginAdmissionError("plugin-shape", "plugins", "must be an array.");
    if (plugins.length > 0 && plugins.every((item) => isModel(item))) {
      this.#admitBatch({ plugins: [], models: plugins });
      return;
    }
    this.#admitBatch({ plugins, models: [] });
  }

  #admitBatch(batch: {
    readonly plugins: readonly unknown[];
    readonly models: readonly unknown[];
  }): void {
    const stagedModels = new Map<string, Model<unknown, unknown>>();
    const stageModel = (candidate: unknown, path: string): void => {
      const model = admitModel(candidate, path);
      const existingStaged = stagedModels.get(model.id);
      if (existingStaged !== undefined && existingStaged !== model) {
        refuse(
          "model-duplicate-id",
          `${path}.id`,
          `Model '${model.id}' is declared twice with different definitions.`,
        );
      }
      const existingAdmitted = this.#models.get(model.id);
      if (existingAdmitted !== undefined && existingAdmitted !== model) {
        refuse(
          "model-duplicate-id",
          `${path}.id`,
          `Model '${model.id}' conflicts with an admitted definition.`,
        );
      }
      stagedModels.set(model.id, model);
    };

    for (const candidate of batch.models) {
      stageModel(candidate, "model");
    }

    const stagedPlugins = new Set<string>();
    const admitted: PluginDefinition[] = [];
    for (const candidate of batch.plugins) {
      const result = admitPlugin(candidate, stagedPlugins, (id) => this.#plugins.has(id));
      stagedPlugins.add(result.definition.id);
      admitted.push(result.definition);
      for (const m of result.models) {
        stageModel(m, `plugin.${result.definition.id}`);
      }
    }

    const typeBatch = collectTypes(admitted);
    for (const [id, type] of typeBatch.types) {
      const existing = this.#dataTypes.get(id);
      if (existing !== undefined && existing !== type)
        throw new PluginAdmissionError(
          "plugin-shape",
          `plugin.dataTypes.${id}`,
          `Data type '${id}' conflicts with an admitted definition.`,
        );
    }

    for (const [id, model] of stagedModels) this.#models.set(id, model);
    for (const [id, type] of typeBatch.types) this.#dataTypes.set(id, type);
    for (const definition of admitted) this.#plugins.set(definition.id, definition);
  }

  get(id: string): PluginDefinition | undefined {
    return this.#plugins.get(id);
  }

  has(id: string): boolean {
    return this.#plugins.has(id);
  }

  get size(): number {
    return this.#plugins.size;
  }

  /** Answers no grouped solver capability; always undefined. */
  capabilityOf(_plugin: string): PluginCapability | undefined {
    return undefined;
  }

  dedicatedMembers(): readonly string[] {
    return EMPTY_MEMBERS;
  }

  isPluginAdmitted(id: string): boolean {
    return this.#plugins.has(id);
  }

  pluginDefinition(id: string): PluginDefinition | undefined {
    return this.#plugins.get(id);
  }

  /** The admitted plugin's declarations, or `undefined` when the id is not admitted. */
  describe(id: string): PluginDescription | undefined {
    const definition = this.#plugins.get(id);
    if (definition === undefined) return undefined;
    const requires: Record<string, DescribedSlot> = {};
    for (const [slot, spec] of Object.entries(definition.inputs.requires ?? {})) {
      if (isModel(spec)) {
        requires[slot] = describeSlot({ kind: "model", model: spec, binding: "single" });
      } else if (isOptionalModel(spec)) {
        requires[slot] = describeSlot({
          kind: "model",
          model: spec.model,
          optional: true,
          binding: spec.binding ?? "single",
        });
      } else {
        requires[slot] = describeSlot(spec);
      }
    }
    const outputs: Record<string, ValueSpec> = {};
    for (const [name, output] of Object.entries(definition.outputs)) {
      outputs[name] = isModel(output) ? output.spec : output;
    }
    return Object.freeze({
      id: definition.id,
      values: isModel(definition.inputs.values)
        ? definition.inputs.values.spec
        : (definition.inputs.values ?? EMPTY_RECORD_SPEC),
      requires: Object.freeze(requires),
      outputs: Object.freeze(outputs),
    });
  }

  dataType(id: string): DataType<unknown, unknown> | undefined {
    return this.#dataTypes.get(id);
  }

  /** Sorted admitted type ids; rebuilt on demand, never cached beside the registry. */
  dataTypeIds(): readonly string[] {
    return Object.freeze([...this.#dataTypes.keys()].sort());
  }

  /** Admitted types for diagnostics tooling. */
  dataTypes(): readonly DataType<unknown, unknown>[] {
    return this.#dataTypes.size === 0 ? EMPTY_TYPES : Object.freeze([...this.#dataTypes.values()]);
  }

  /** Returns the admitted model matching the id, or undefined if not admitted. */
  model(id: string): Model<unknown, unknown> | undefined {
    return this.#models.get(id);
  }

  /** Whether the model id is admitted in the catalog. */
  hasModel(id: string): boolean {
    return this.#models.has(id);
  }

  /** Sorted admitted plugin ids. */
  pluginIds(): readonly string[] {
    return Object.freeze([...this.#plugins.keys()].sort());
  }

  /** Sorted admitted model ids. */
  modelIds(): readonly string[] {
    return Object.freeze([...this.#models.keys()].sort());
  }

  /** Admitted models list. */
  models(): readonly Model<unknown, unknown>[] {
    return this.#models.size === 0 ? EMPTY_MODELS : Object.freeze([...this.#models.values()]);
  }
}
