import type { PluginDefinition, PluginStage } from "./plugins";
import { ANY_CHAIN, POLE_SLOT, type SolverChainShape } from "../contract/solver-shape";
import { JOINT_KEY } from "../contract/solver-constraints";
import type { PluginCapability } from "../ports/plugin-capabilities";
import { COLLECT_OUTPUT } from "../contract/collect";
import { isCapabilityToken } from "../contract/capability";

export interface AdmittedPlugin {
  readonly definition: PluginDefinition;
  readonly keys: readonly string[];
  readonly inputs: readonly string[];
  readonly capability: PluginCapability;
}

/** Runtime declarations are untrusted; unknown kinds are admission errors, not unreachable. */
function admitChain(value: unknown, name: string): SolverChainShape {
  if (value === undefined) return ANY_CHAIN;
  if (!isRecord(value))
    throw new TypeError(`Plugin "${name}" solverChain must be an object when provided.`);
  const { kind, memberPlugin } = value;
  switch (kind) {
    case "any":
      return ANY_CHAIN;
    case "tree":
      if (
        typeof memberPlugin !== "string" ||
        !memberPlugin.trim() ||
        memberPlugin.includes(":") ||
        memberPlugin === name
      )
        throw new TypeError(
          `Plugin "${name}" solverChain memberPlugin must be non-empty, contain no ':' and differ from its name.`,
        );
      return Object.freeze({ kind: "tree", memberPlugin });
    default:
      throw new TypeError(`Plugin "${name}" declares an unknown solverChain kind.`);
  }
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

/** Whether `plugin` claims `key`, by listing it or by predicate: the one claim rule. */
export function claims(plugin: PluginDefinition, key: string): boolean {
  return Boolean(plugin.keys?.includes(key) || plugin.claimsKey?.(key));
}

/** Admission for one slot's capability: one token, or a non-empty duplicate-free tuple of them. */
function admitRequirementCapabilities(plugin: string, slot: string, value: unknown): void {
  const names = Array.isArray(value) ? value : [value];
  if (names.length === 0)
    throw new TypeError(
      `Plugin "${plugin}" requirement "${slot}" capability array must not be empty.`,
    );
  const seen = new Set<string>();
  for (const name of names) {
    if (!isCapabilityToken(name))
      throw new TypeError(
        `Plugin "${plugin}" requirement "${slot}" capability must be a non-empty string without ':'.`,
      );
    if (seen.has(name))
      throw new TypeError(
        `Plugin "${plugin}" requirement "${slot}" capability "${name}" is declared twice.`,
      );
    seen.add(name);
  }
}

/** Validates one own-property snapshot before any registry write. See ADR-134. */
export function admitPlugin(plugin: PluginDefinition, context: AdmissionContext): AdmittedPlugin {
  if (typeof plugin !== "object" || plugin === null)
    throw new TypeError("Plugin name must be a non-empty string.");
  // Own enumerable properties, each getter read exactly once; every later check reads `source`.
  const source: PluginDefinition = { ...plugin };
  if (typeof source.name !== "string" || !source.name.trim())
    throw new TypeError("Plugin name must be a non-empty string.");

  const hasCompose = typeof source.compose === "function";
  const hasCollect = source.collect !== undefined;
  const hasFold = source.fold !== undefined;

  if (!hasCompose && !hasCollect && !hasFold)
    throw new TypeError(`Plugin "${source.name}" must declare collect, fold, or both operations.`);

  if (source.compose !== undefined && typeof source.compose !== "function")
    throw new TypeError("Plugin compose must be a function.");

  if (source.fold !== undefined) {
    if (!isRecord(source.fold))
      throw new TypeError(`Plugin "${source.name}" fold must be an object.`);
    if (!Array.isArray(source.fold.outputs) || source.fold.outputs.length === 0)
      throw new TypeError(
        `Plugin "${source.name}" fold outputs must be a non-empty array of strings.`,
      );
    const seenFold = new Set<string>();
    for (const out of source.fold.outputs) {
      if (typeof out !== "string" || !out.trim())
        throw new TypeError(`Plugin "${source.name}" fold outputs must contain non-empty strings.`);
      if (out.includes(":"))
        throw new TypeError(`Plugin "${source.name}" fold output "${out}" must not contain ':'.`);
      if (seenFold.has(out))
        throw new TypeError(
          `Plugin "${source.name}" fold outputs contains duplicate output "${out}".`,
        );
      seenFold.add(out);
    }
    if (source.fold.outputs.includes(COLLECT_OUTPUT)) {
      throw new TypeError(
        `Plugin "${source.name}" fold output cannot use reserved name "${COLLECT_OUTPUT}".`,
      );
    }
  }

  if (Object.hasOwn(source, "createEvaluator")) {
    throw new TypeError(
      `Plugin "${source.name}" createEvaluator was removed; declare init and prepare instead.`,
    );
  }
  // Admission reads untrusted runtime shapes, so the typed view cannot narrow these guards.
  const unchecked: {
    readonly init?: unknown;
    readonly prepare?: unknown;
    readonly dispose?: unknown;
    readonly collect?: unknown;
    readonly fold?: unknown;
  } = source;
  if (unchecked.init !== undefined) {
    if (typeof unchecked.init !== "function")
      throw new TypeError(`Plugin "${source.name}" init must be a function when provided.`);
    if (typeof unchecked.prepare !== "function")
      throw new TypeError(`Plugin "${source.name}" with init must declare prepare as a function.`);
    if (unchecked.dispose !== undefined && typeof unchecked.dispose !== "function")
      throw new TypeError(`Plugin "${source.name}" dispose must be a function when provided.`);
  } else if (unchecked.prepare !== undefined || unchecked.dispose !== undefined) {
    throw new TypeError(`Plugin "${source.name}" declares prepare or dispose without init.`);
  }
  if (unchecked.collect !== undefined && typeof unchecked.collect !== "function")
    throw new TypeError(`Plugin "${source.name}" collect must be a function.`);
  if (
    unchecked.fold !== undefined &&
    (!isRecord(unchecked.fold) || typeof unchecked.fold.run !== "function")
  )
    throw new TypeError(`Plugin "${source.name}" fold run must be a function.`);

  if (source.validate !== undefined && typeof source.validate !== "function") {
    throw new TypeError(`Plugin "${source.name}" validate must be a function when provided.`);
  }

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
  if (source.derive !== undefined && typeof source.derive !== "function")
    throw new TypeError(`Plugin "${source.name}" derive must be a function when provided.`);

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
  for (const slot of slots) {
    if (!slot.trim())
      throw new TypeError(`Plugin "${source.name}" requirement slot must be non-empty.`);
    const req = (requirements as Record<string, { capability?: unknown }>)[slot];
    if (req?.capability !== undefined)
      admitRequirementCapabilities(source.name, slot, req.capability);
  }
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
  const chain = admitChain(source.solverChain, source.name);
  const capability: PluginCapability = Object.freeze({
    chain,
    pole: Object.hasOwn(requirements ?? {}, POLE_SLOT),
    joint: claims(source, JOINT_KEY),
  });
  const definition = Object.freeze({
    ...source,
    ...(source.solverChain === undefined ? {} : { solverChain: chain }),
    ...(source.keys ? { keys } : {}),
    ...(source.inputs ? { inputs } : {}),
    ...(source.outputs ? { outputs } : {}),
    ...(requirements ? { requirements } : {}),
  });
  return { definition, keys, inputs, capability };
}
