import type {
  DependencySpec,
  Diagnostic,
  EvaluationContext,
  Outputs,
  PluginDefinition,
  ResolvedInput,
  ValueSpec,
} from "../contract/v5";
import type { RuleId } from "../contract/rule-id";
import { readValueSpec } from "../contract/v5-parse";
import type { PluginCapabilities, PluginCapability } from "../ports/plugin-capabilities";

/**
 * The admitted-plugin registry for the identified-table path.
 *
 * The grouped registry in `domain/plugins.ts` is a different contract and stays untouched until
 * Phase 7 removes it. This one is keyed by the authored `id`, admits one complete definition at a
 * time, and stores nothing until every definition in a batch has passed.
 *
 * The public overloads take `PluginDefinition`; the implementation takes `unknown`, because
 * admission is also reachable from JavaScript and from separately built modules. That is where the
 * unchecked declarations stop: every field read below is proved before it reaches a stored
 * definition, and a caller's objects are never frozen in place.
 */

const PLUGIN_FIELDS = new Set(["id", "inputs", "outputs", "validate", "transform"]);
const INPUT_FIELDS = new Set(["values", "requires"]);
const DEPENDENCY_FIELDS = new Set(["outputs", "optional", "binding"]);
const RESERVED_NAMES = new Set(["__proto__", "constructor", "prototype"]);
const BINDING_MODES = new Set(["single", "map"]);
const EMPTY_MEMBERS: readonly string[] = Object.freeze([]);

type TransformHook = PluginDefinition["transform"];
type ValidateHook = NonNullable<PluginDefinition["validate"]>;

/** One admission refusal, carrying the rule id and the definition path that refused it. */
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

function readDependency(value: unknown, path: string): DependencySpec {
  const source = requireRecord(value, path);
  assertKnownKeys(source, DEPENDENCY_FIELDS, path, "DependencySpec");
  const outputsSource = requireRecord(own(source, "outputs"), `${path}.outputs`);
  const outputs: Record<string, ValueSpec> = {};
  for (const [name, spec] of Object.entries(outputsSource)) {
    const outputName = readName(name, `${path}.outputs.${name}`, "Output name");
    outputs[outputName] = readSpec(spec, `${path}.outputs.${outputName}`, false);
  }
  return Object.freeze({
    outputs: Object.freeze(outputs),
    ...(readTrue(own(source, "optional"), `${path}.optional`, "optional") === undefined
      ? {}
      : { optional: true as const }),
    binding: readBinding(own(source, "binding"), `${path}.binding`),
  });
}

function readInputs(value: unknown, path: string): PluginDefinition["inputs"] {
  const source = requireRecord(value, path);
  assertKnownKeys(source, INPUT_FIELDS, path, "Plugin inputs");
  if (!Object.hasOwn(source, "values"))
    refuse("plugin-shape", `${path}.values`, "Plugin inputs must declare values.");
  const values = readSpec(source.values, `${path}.values`, true);
  if (values.optional === true)
    refuse(
      "plugin-input-invalid",
      `${path}.values.optional`,
      "optional is not valid on inputs.values.",
    );
  let requires: Readonly<Record<string, DependencySpec>> | undefined;
  if (source.requires !== undefined) {
    const requiresSource = requireRecord(source.requires, `${path}.requires`);
    const slots: Record<string, DependencySpec> = {};
    for (const [slot, dependency] of Object.entries(requiresSource)) {
      const slotName = readName(slot, `${path}.requires.${slot}`, "Dependency slot");
      slots[slotName] = readDependency(dependency, `${path}.requires.${slotName}`);
    }
    requires = Object.freeze(slots);
  }
  return Object.freeze({
    values,
    ...(requires === undefined ? {} : { requires }),
  });
}

function readOutputs(value: unknown, path: string): Readonly<Record<string, ValueSpec>> {
  const source = requireRecord(value, path);
  const outputs: Record<string, ValueSpec> = {};
  for (const [name, spec] of Object.entries(source)) {
    const outputName = readName(name, `${path}.${name}`, "Output name");
    outputs[outputName] = readSpec(spec, `${path}.${outputName}`, false);
  }
  return Object.freeze(outputs);
}

/**
 * One definition, read exactly once and frozen before it can be stored.
 *
 * `staged` is the set of ids earlier members of the same batch reserved, so a batch refuses a
 * duplicate that is not in the registry yet. Nothing is written by this function.
 */
function admitPlugin(
  value: unknown,
  staged: ReadonlySet<string>,
  registered: (id: string) => boolean,
): PluginDefinition {
  const source = requireRecord(value, "plugin");
  assertKnownKeys(source, PLUGIN_FIELDS, "plugin", "Plugin definition");
  const id = readName(own(source, "id"), "plugin.id", "Plugin id");
  if (registered(id) || staged.has(id))
    refuse("plugin-duplicate-id", "plugin.id", `Plugin '${id}' is already admitted.`);
  const inputs = readInputs(own(source, "inputs"), "plugin.inputs");
  const outputs = readOutputs(own(source, "outputs"), "plugin.outputs");
  const rawValidate = readHook<ValidateHook>(
    own(source, "validate"),
    "plugin.validate",
    "validate",
  );
  const rawTransform = readHook<TransformHook>(
    own(source, "transform"),
    "plugin.transform",
    "transform",
  );
  if (rawTransform === undefined)
    refuse("plugin-shape", "plugin.transform", "transform must be a function.");
  // The wrappers are the one place an authored-time type meets the shared ResolvedInput. The
  // runtime validates the values before calling them and validates the result after, so this is a
  // checked boundary rather than an unchecked spread through plugins. The remaining authored-type
  // gap is recorded as Phase 3 follow-up in the report.
  const transform: TransformHook = (input: ResolvedInput, context: EvaluationContext) =>
    Reflect.apply(rawTransform, source, [input, context]) as Outputs;
  const validate: ValidateHook | undefined =
    rawValidate === undefined
      ? undefined
      : (input: ResolvedInput, context: EvaluationContext) =>
          Reflect.apply(rawValidate, source, [input, context]) as readonly Diagnostic[];
  return Object.freeze({
    id,
    inputs,
    outputs,
    ...(validate === undefined ? {} : { validate }),
    transform,
  });
}

/** The identified-table plugin registry. One instance belongs to one host composition. */
export class PluginCatalog implements PluginCapabilities {
  readonly #plugins = new Map<string, PluginDefinition>();

  /** Admit one definition atomically. */
  register<Input extends ResolvedInput>(plugin: PluginDefinition<Input>): void;
  register(plugin: unknown): void {
    this.#registerBatch([plugin]);
  }

  /**
   * Admit every definition in one batch, or none of them.
   *
   * Every definition is read and checked against the ids registered before this call and the ids
   * staged earlier in the batch. The map is written only after the last definition has passed.
   */
  registerAll<Input extends ResolvedInput>(plugins: readonly PluginDefinition<Input>[]): void;
  registerAll(plugins: unknown): void {
    this.#registerBatch(plugins);
  }

  #registerBatch(plugins: unknown): void {
    if (!Array.isArray(plugins))
      throw new PluginAdmissionError("plugin-shape", "plugins", "must be an array.");
    const staged = new Set<string>();
    const admitted: PluginDefinition[] = [];
    for (const candidate of plugins) {
      const definition = admitPlugin(candidate, staged, (id) => this.#plugins.has(id));
      staged.add(definition.id);
      admitted.push(definition);
    }
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

  /** The registry answers no grouped solver capability; that belongs to the retired registry. */
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
}
