import type { AuthoredProperty, AuthoredStop, Diagnostic } from "../contract/v5";
import type { ImmutableRecord } from "./values";

export type PluginComposer = (values: Readonly<ImmutableRecord>, progress: number) => ImmutableRecord;
export type PluginContributor = (keyframes: Readonly<Record<string, unknown>>) => unknown;
export type PluginKeyClaim = (key: string) => boolean;
export type OutputSerializer = (value: unknown) => unknown;
export interface ContributionResult {
  readonly keyframes?: Readonly<Record<string, AuthoredProperty>>;
  readonly tweenVars?: Readonly<Record<string, unknown>>;
}
export interface ResolvedPlugins {
  readonly plugins: readonly PluginDefinition[];
  readonly diagnostics: readonly Diagnostic[];
  readonly preparation?: ContributionResult;
}
export interface PluginDefinition {
  readonly name: string;
  readonly keys?: readonly string[];
  readonly claimsKey?: PluginKeyClaim;
  readonly inputs?: readonly string[];
  readonly stage?: string;
  readonly priority?: number;
  readonly outputs?: readonly string[];
  readonly internalKeys?: readonly string[];
  readonly outputSerializers?: Readonly<Record<string, OutputSerializer>>;
  readonly contribute?: PluginContributor;
  readonly compose: PluginComposer;
}

function diagnostic(ruleId: string, path: string, message: string, ids?: readonly string[]): Diagnostic {
  return { ruleId, path, message, severity: "error", ...(ids ? { ids } : {}) };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function claims(plugin: PluginDefinition, key: string): boolean {
  return Boolean(plugin.keys?.includes(key) || plugin.claimsKey?.(key));
}
function stageRank(stage: string | undefined): number {
  return stage === "prepare" ? 0 : stage === "compose" ? 1 : 2;
}
function comparePlugins(left: PluginDefinition, right: PluginDefinition): number {
  return stageRank(left.stage) - stageRank(right.stage) || (left.priority ?? 0) - (right.priority ?? 0);
}
function validStop(stop: unknown): stop is AuthoredStop {
  return isRecord(stop) && typeof stop.p === "number" && Number.isFinite(stop.p) && "v" in stop;
}
function validateStops(value: unknown, path: string, diagnostics: Diagnostic[]): value is AuthoredProperty {
  if (!isRecord(value) || !Array.isArray(value.stops)) {
    diagnostics.push(diagnostic("plugin-contribution-stops-shape", path, "Contributed property must contain a stops array."));
    return false;
  }
  let previous: number | undefined;
  const seen = new Set<number>();
  for (const [index, stop] of value.stops.entries()) {
    const stopPath = `${path}.stops[${index}]`;
    if (!validStop(stop)) {
      diagnostics.push(diagnostic("plugin-contribution-stop-position", `${stopPath}.p`, "Contributed stop p must be finite."));
      continue;
    }
    if (stop.p < 0 || stop.p > 1) diagnostics.push(diagnostic("plugin-contribution-stop-range", `${stopPath}.p`, "Contributed stop p must be between 0 and 1."));
    if (previous !== undefined && stop.p < previous) diagnostics.push(diagnostic("plugin-contribution-stop-order", `${stopPath}.p`, "Contributed stop positions must be monotonic."));
    if (seen.has(stop.p)) diagnostics.push(diagnostic("plugin-contribution-stop-duplicate", `${stopPath}.p`, "Contributed stop positions must be unique."));
    seen.add(stop.p);
    previous = stop.p;
  }
  return true;
}
function normalizeContribution(value: unknown): ContributionResult {
  if (!isRecord(value)) return {};
  if ("keyframes" in value || "tweenVars" in value)
    return {
      ...(isRecord(value.keyframes) ? { keyframes: value.keyframes as Readonly<Record<string, AuthoredProperty>> } : {}),
      ...(isRecord(value.tweenVars) ? { tweenVars: value.tweenVars } : {}),
    };
  return { keyframes: value as Readonly<Record<string, AuthoredProperty>> };
}
function prepareContributions(authored: Readonly<Record<string, unknown>>, plugins: readonly PluginDefinition[], diagnostics: Diagnostic[]): ContributionResult {
  const keyframes: Record<string, AuthoredProperty> = {};
  const tweenVars: Record<string, unknown> = {};
  const authoredKeys = new Set(Object.keys(authored));
  const keyOwners = new Map<string, string>();
  const tweenOwners = new Map<string, string>();
  for (const plugin of plugins) {
    if (plugin.stage !== "prepare" || plugin.contribute === undefined) continue;
    const contribution = normalizeContribution(plugin.contribute(Object.freeze({ ...authored, ...keyframes })));
    for (const [key, property] of Object.entries(contribution.keyframes ?? {})) {
      if (authoredKeys.has(key)) {
        diagnostics.push(diagnostic("plugin-contribution-output-collision", `keyframes.${key}`, `Plugin "${plugin.name}" attempted to overwrite authored key "${key}".`, [plugin.name, key]));
        continue;
      }
      const owner = keyOwners.get(key);
      if (owner) {
        diagnostics.push(diagnostic("plugin-contribution-key-collision", `keyframes.${key}`, `Plugins "${owner}" and "${plugin.name}" both contributed key "${key}".`, [owner, plugin.name, key]));
        continue;
      }
      keyOwners.set(key, plugin.name);
      if (validateStops(property, `keyframes.${key}`, diagnostics)) keyframes[key] = property;
    }
    for (const [key, value] of Object.entries(contribution.tweenVars ?? {})) {
      const owner = tweenOwners.get(key);
      if (owner) {
        diagnostics.push(diagnostic("plugin-contribution-tween-vars-collision", `tweenVars.${key}`, `Plugins "${owner}" and "${plugin.name}" both contributed tween var "${key}".`, [owner, plugin.name, key]));
        continue;
      }
      tweenOwners.set(key, plugin.name);
      tweenVars[key] = value;
    }
  }
  const easeOwners = new Map<string, unknown>();
  for (const [key, property] of Object.entries(keyframes))
    for (const [index, stop] of property.stops.entries())
      if (stop.ease !== undefined) {
        const id = `${key}:${index}`;
        const previous = easeOwners.get(id);
        if (previous !== undefined && !Object.is(previous, stop.ease)) diagnostics.push(diagnostic("plugin-contribution-ease-collision", `keyframes.${key}.stops[${index}].ease`, `Conflicting contributed ease for ${key} stop ${index}.`, [key, String(index)]));
        else easeOwners.set(id, stop.ease);
      }
  return Object.freeze({ keyframes: Object.freeze(keyframes), tweenVars: Object.freeze(tweenVars) });
}

export class PluginRegistry {
  readonly #plugins = new Map<string, PluginDefinition>();
  #registrationOrder = 0;
  readonly #orders = new Map<string, number>();
  register(plugin: PluginDefinition): void {
    if (typeof plugin?.name !== "string" || plugin.name.trim() === "") throw new TypeError("Plugin name must be a non-empty string.");
    if (typeof plugin.compose !== "function") throw new TypeError("Plugin compose must be a function.");
    if (plugin.contribute !== undefined && typeof plugin.contribute !== "function") throw new TypeError("Plugin contribute must be a function.");
    if (plugin.internalKeys !== undefined && !Array.isArray(plugin.internalKeys)) throw new TypeError("Plugin internalKeys must be an array when provided.");
    if (plugin.outputSerializers !== undefined && typeof plugin.outputSerializers !== "object") throw new TypeError("Plugin outputSerializers must be an object when provided.");
    for (const serializer of Object.values(plugin.outputSerializers ?? {})) if (typeof serializer !== "function") throw new TypeError("Plugin outputSerializers must contain functions.");
    if (this.#plugins.has(plugin.name)) throw new Error(`Plugin "${plugin.name}" is already registered.`);
    this.#plugins.set(plugin.name, Object.freeze({ ...plugin, ...(plugin.keys ? { keys: Object.freeze([...plugin.keys]) } : {}), ...(plugin.outputs ? { outputs: Object.freeze([...plugin.outputs]) } : {}), ...(plugin.internalKeys ? { internalKeys: Object.freeze([...plugin.internalKeys]) } : {}), ...(plugin.outputSerializers ? { outputSerializers: Object.freeze({ ...plugin.outputSerializers }) } : {}) }));
    this.#orders.set(plugin.name, this.#registrationOrder++);
  }
  resolveForKeyframes(authored: Readonly<Record<string, unknown>>, path = "keyframes"): ResolvedPlugins {
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    for (const key of Object.keys(authored)) {
      const matches = [...this.#plugins.values()].filter((plugin) => claims(plugin, key));
      if (matches.length === 0) diagnostics.push(diagnostic("plugin-unknown-key", `${path}.${key}`, `No registered plugin claims authored key "${key}".`, [key]));
      for (const plugin of matches) if (!plugins.includes(plugin)) plugins.push(plugin);
    }
    plugins.sort((a, b) => comparePlugins(a, b) || (this.#orders.get(a.name) ?? 0) - (this.#orders.get(b.name) ?? 0));
    const owners = new Map<string, string>();
    for (const plugin of plugins) for (const output of plugin.outputs ?? []) {
      const owner = owners.get(output);
      if (owner) diagnostics.push(diagnostic("plugin-duplicate-output", `${path}.${output}`, `Plugins "${owner}" and "${plugin.name}" both claim output "${output}".`, [owner, plugin.name, output]));
      else owners.set(output, plugin.name);
    }
    const preparation = prepareContributions(authored, plugins, diagnostics);
    return Object.freeze({ plugins: Object.freeze(plugins), diagnostics: Object.freeze(diagnostics), preparation });
  }
  has(name: string): boolean { return this.#plugins.has(name); }
  get size(): number { return this.#plugins.size; }
}
