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

// Keyed by the union, so a new stage owes an entry here as well as an arm in `stageRank`. Checked
// at run time because admission is reachable from JavaScript and separately built modules.
const VALID_STAGES: Readonly<Record<PluginStage, true>> = { prepare: true, compose: true };
// `typeof` first: `Object.hasOwn` coerces its key, so `["prepare"]` or a boxed string would pass.
function isPluginStage(value: unknown): value is PluginStage {
  return typeof value === "string" && Object.hasOwn(VALID_STAGES, value);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** A frozen copy of plain records and arrays; the caller's objects are never frozen. */
function frozenCopy(value: unknown): unknown {
  if (Array.isArray(value)) return Object.freeze(value.map(frozenCopy));
  if (!isRecord(value)) return value;
  const copy: Record<string, unknown> = {};
  for (const key of Object.keys(value)) copy[key] = frozenCopy(value[key]);
  return Object.freeze(copy);
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
  // Own enumerable properties, each getter read exactly once; every later check reads `source`.
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
  // One copy: the slots validated are exactly the slots stored, and the caller's data stays theirs.
  const requirements =
    source.requirements === undefined
      ? undefined
      : (frozenCopy(source.requirements) as NonNullable<PluginDefinition["requirements"]>);
  const slots = Object.keys(requirements ?? {});
  for (const slot of slots)
    if (!slot.trim())
      throw new TypeError(`Plugin "${source.name}" requirement slot must be non-empty.`);
  for (const [field, names] of [
    ["keys", keys],
    ["inputs", inputs],
    ["outputs", outputs],
  ] as const)
    if (names.some((name) => typeof name !== "string"))
      throw new TypeError(`Plugin "${source.name}" ${field} must contain only strings.`);
  // The colon is the internal-key namespace: a public `fk:world` output would be dropped before
  // publication, and a namespaced slot could never be spelled inside an authored group. See ADR-057.
  for (const name of [...keys, ...inputs, ...outputs, ...slots]) {
    if (!name.includes(":")) continue;
    const detail = `metadata name "${name}" must not contain ':'`;
    throw new TypeError(`Plugin "${source.name}" ${detail}.`);
  }
  // No key or slot collision guard: an authored group names the owner of its keys and scopes its
  // slots (ADR-043, ADR-121). An input has no group to name an owner, so this is its only owner.
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
    ...(requirements ? { requirements } : {}),
  });
  return { definition, keys, inputs };
}
