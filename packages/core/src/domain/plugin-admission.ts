import type { PluginDefinition, PluginStage } from "./plugins";

export interface AdmittedPlugin {
  readonly definition: PluginDefinition;
  readonly keys: readonly string[];
  readonly inputs: readonly string[];
}

export interface AdmissionContext {
  isRegistered(name: string): boolean;
  inputOwner(input: string): string | undefined;
}

const VALID_STAGES: Readonly<Record<PluginStage, true>> = { prepare: true, compose: true };
function isPluginStage(value: unknown): value is PluginStage {
  return typeof value === "string" && Object.hasOwn(VALID_STAGES, value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child, seen);
  return Object.freeze(value);
}

/** Validates one own-property snapshot before any registry write. See ADR-134. */
export function admitPlugin(plugin: PluginDefinition, context: AdmissionContext): AdmittedPlugin {
  if (typeof plugin !== "object" || plugin === null)
    throw new TypeError("Plugin name must be a non-empty string.");
  const source: PluginDefinition = { ...plugin };
  if (typeof source.name !== "string" || !source.name.trim())
    throw new TypeError("Plugin name must be a non-empty string.");
  if (typeof source.compose !== "function")
    throw new TypeError("Plugin compose must be a function.");
  if (source.keys !== undefined && !Array.isArray(source.keys))
    throw new TypeError("Plugin keys must be an array when provided.");
  if (source.claimsKey !== undefined && typeof source.claimsKey !== "function")
    throw new TypeError("Plugin claimsKey must be a function when provided.");
  if (source.inputs !== undefined && !Array.isArray(source.inputs))
    throw new TypeError("Plugin inputs must be an array when provided.");
  if (source.outputs !== undefined && !Array.isArray(source.outputs))
    throw new TypeError("Plugin outputs must be an array when provided.");
  if (source.requirements !== undefined && !isRecord(source.requirements))
    throw new TypeError("Plugin requirements must be an object when provided.");
  if (source.stage !== undefined && !isPluginStage(source.stage))
    throw new TypeError(`Unknown plugin stage "${source.stage}".`);
  if (source.contribute && source.stage !== "prepare")
    throw new TypeError(`Plugin "${source.name}" contribute requires stage "prepare".`);
  if (
    source.priority !== undefined &&
    (!Number.isFinite(source.priority) || !Number.isInteger(source.priority))
  )
    throw new TypeError("Plugin priority must be a finite integer when provided.");
  if (context.isRegistered(source.name))
    throw new Error(`Plugin "${source.name}" is already registered.`);
  const keys = Object.freeze([...(source.keys ?? [])]);
  const inputs = Object.freeze([...(source.inputs ?? [])]);
  const outputs = Object.freeze([...(source.outputs ?? [])]);
  const slots = Object.keys(source.requirements ?? {});
  for (const slot of slots)
    if (!slot.trim())
      throw new TypeError(`Plugin "${source.name}" requirement slot must be non-empty.`);
  // Public metadata must not enter the colon-namespaced internal-key space. See ADR-057.
  for (const name of [...keys, ...inputs, ...outputs, ...slots]) {
    if (!name.includes(":")) continue;
    const detail = `metadata name "${name}" must not contain ':'`;
    throw new TypeError(`Plugin "${source.name}" ${detail}.`);
  }
  // Inputs have no authored group that could select an owner. Keys and slots do.
  for (const input of inputs) {
    const owner = context.inputOwner(input);
    if (owner !== undefined)
      throw new TypeError(
        `plugin-input-collision: Plugin "${owner}" already owns input "${input}".`,
      );
  }
  const definition = Object.freeze({
    ...source,
    ...(source.keys ? { keys } : {}),
    ...(source.inputs ? { inputs } : {}),
    ...(source.outputs ? { outputs } : {}),
    ...(source.requirements ? { requirements: deepFreeze({ ...source.requirements }) } : {}),
  });
  return { definition, keys, inputs };
}
