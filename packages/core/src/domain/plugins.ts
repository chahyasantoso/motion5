import type { AuthoredProperty, AuthoredStop, Diagnostic } from "../contract/v5";
import type { ImmutableRecord } from "./values";

export type PluginComposer = (
  values: Readonly<ImmutableRecord>,
  progress: number,
) => ImmutableRecord;
export interface TrackConfigView {
  readonly id?: string;
  readonly duration?: number;
}
export interface Contribution {
  readonly keyframes?: Readonly<Record<string, AuthoredProperty>>;
  readonly tweenVars?: Readonly<Record<string, unknown>>;
}
export type PluginContributor = (
  key: string,
  stops: readonly AuthoredStop[],
  track: TrackConfigView,
) => Contribution | undefined;
export type PluginKeyClaim = (key: string) => boolean;
export type OutputSerializer = (value: unknown) => unknown;

export interface PreparedContribution {
  readonly keyframes: Readonly<Record<string, AuthoredProperty>>;
  readonly tweenVars: Readonly<Record<string, unknown>>;
}
export interface ResolvedPlugins {
  readonly plugins: readonly PluginDefinition[];
  readonly diagnostics: readonly Diagnostic[];
  readonly internalKeys: readonly string[];
  readonly outputSerializers: Readonly<Record<string, OutputSerializer>>;
  readonly preparation: PreparedContribution;
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

const VALID_STAGES = new Set(["prepare", "compose"]);
function diagnostic(
  ruleId: string,
  path: string,
  message: string,
  ids?: readonly string[],
): Diagnostic {
  return { ruleId, path, message, severity: "error", ...(ids ? { ids } : {}) };
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function claims(plugin: PluginDefinition, key: string): boolean {
  return Boolean(plugin.keys?.includes(key) || plugin.claimsKey?.(key));
}
function stageRank(stage: string): number {
  return stage === "prepare" ? 0 : 1;
}
function comparePlugins(a: PluginDefinition, b: PluginDefinition): number {
  return stageRank(a.stage ?? "compose") - stageRank(b.stage ?? "compose");
}
function validStop(stop: unknown): stop is AuthoredStop {
  return isRecord(stop) && typeof stop.p === "number" && Number.isFinite(stop.p) && "v" in stop;
}
function validProperty(
  value: unknown,
  path: string,
  diagnostics: Diagnostic[],
): value is AuthoredProperty {
  if (!isRecord(value) || !Array.isArray(value.stops)) {
    diagnostics.push(
      diagnostic(
        "plugin-contribution-stops-shape",
        path,
        "Contributed property must contain a stops array.",
      ),
    );
    return false;
  }
  let previous: number | undefined;
  const seen = new Set<number>();
  let valid = true;
  for (const [index, stop] of value.stops.entries()) {
    const stopPath = `${path}.stops[${index}].p`;
    if (!validStop(stop)) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-stop-position",
          stopPath,
          "Contributed stop p must be finite.",
        ),
      );
      valid = false;
      continue;
    }
    if (stop.p < 0 || stop.p > 1) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-stop-range",
          stopPath,
          "Contributed stop p must be between 0 and 1.",
        ),
      );
      valid = false;
    }
    if (previous !== undefined && stop.p < previous) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-stop-order",
          stopPath,
          "Contributed stop positions must be monotonic.",
        ),
      );
      valid = false;
    }
    if (seen.has(stop.p)) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-stop-duplicate",
          stopPath,
          "Contributed stop positions must be unique.",
        ),
      );
      valid = false;
    }
    seen.add(stop.p);
    previous = stop.p;
  }
  return valid;
}
function normalizeContribution(
  value: unknown,
  plugin: PluginDefinition,
  path: string,
  diagnostics: Diagnostic[],
): Contribution {
  if (value === undefined) return {};
  if (!isRecord(value)) {
    diagnostics.push(
      diagnostic(
        "plugin-contribution-shape",
        path,
        `Plugin "${plugin.name}" must return a contribution object.`,
        [plugin.name],
      ),
    );
    return {};
  }
  const allowed = new Set(["keyframes", "tweenVars"]);
  for (const key of Object.keys(value))
    if (!allowed.has(key))
      diagnostics.push(
        diagnostic(
          "plugin-contribution-shape",
          `${path}.${key}`,
          `Plugin "${plugin.name}" returned an unknown contribution field.`,
          [plugin.name, key],
        ),
      );
  return {
    ...(isRecord(value.keyframes)
      ? { keyframes: value.keyframes as Readonly<Record<string, AuthoredProperty>> }
      : {}),
    ...(isRecord(value.tweenVars) ? { tweenVars: value.tweenVars } : {}),
  };
}
function prepareContributions(
  authored: Readonly<Record<string, unknown>>,
  owners: ReadonlyMap<string, PluginDefinition>,
  predicates: readonly PluginDefinition[],
  track: TrackConfigView,
  path: string,
  diagnostics: Diagnostic[],
): PreparedContribution {
  const keyframes: Record<string, AuthoredProperty> = {};
  const tweenVars: Record<string, unknown> = {};
  const authoredKeys = new Set(Object.keys(authored));
  const keyOwners = new Map<string, string>();
  const tweenOwners = new Map<string, string>();
  const ownerOf = (key: string): PluginDefinition | undefined =>
    owners.get(key) ?? predicates.find((plugin) => claims(plugin, key));

  for (const key of Object.keys(authored).sort()) {
    const plugin = ownerOf(key);
    if (plugin?.stage !== "prepare" || !plugin.contribute) continue;
    let contribution: Contribution;
    try {
      contribution = normalizeContribution(
        plugin.contribute(
          key,
          readStops(authored[key]),
          Object.freeze({ id: track.id, duration: track.duration }),
        ),
        plugin,
        `${path}.${key}`,
        diagnostics,
      );
    } catch (error) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-failure",
          `${path}.${key}`,
          `Plugin "${plugin.name}" failed: ${error instanceof Error ? error.message : String(error)}.`,
          [plugin.name, key],
        ),
      );
      continue;
    }
    for (const [output, property] of Object.entries(contribution.keyframes ?? {})) {
      if (authoredKeys.has(output)) {
        diagnostics.push(
          diagnostic(
            "plugin-contribution-output-collision",
            `${path}.${output}`,
            `Plugin "${plugin.name}" attempted to overwrite authored key "${output}".`,
            [plugin.name, output],
          ),
        );
        continue;
      }
      const owner = keyOwners.get(output);
      if (owner) {
        diagnostics.push(
          diagnostic(
            "plugin-contribution-key-collision",
            `${path}.${output}`,
            `Plugins "${owner}" and "${plugin.name}" both contributed key "${output}".`,
            [owner, plugin.name, output].sort(),
          ),
        );
        continue;
      }
      if (validProperty(property, `${path}.${output}`, diagnostics)) {
        keyOwners.set(output, plugin.name);
        keyframes[output] = property;
      }
    }
    for (const [name, value] of Object.entries(contribution.tweenVars ?? {})) {
      const owner = tweenOwners.get(name);
      if (owner && !Object.is(tweenVars[name], value))
        diagnostics.push(
          diagnostic(
            "plugin-contribution-tween-vars-conflict",
            `${path}.tweenVars.${name}`,
            `Plugins "${owner}" and "${plugin.name}" contributed conflicting tween var "${name}".`,
            [owner, plugin.name, name].sort(),
          ),
        );
      else {
        tweenOwners.set(name, owner ?? plugin.name);
        tweenVars[name] = value;
      }
    }
  }
  return Object.freeze({
    keyframes: Object.freeze(keyframes),
    tweenVars: Object.freeze(tweenVars),
  });
}
function result(
  plugins: PluginDefinition[],
  diagnostics: Diagnostic[],
  preparation: PreparedContribution,
): ResolvedPlugins {
  const internalKeys = Object.freeze(
    [...new Set(plugins.flatMap((plugin) => plugin.internalKeys ?? []))].sort(),
  );
  const outputSerializers: Record<string, OutputSerializer> = {};
  const owned = new Set(plugins.flatMap((plugin) => plugin.outputs ?? []));
  for (const plugin of plugins)
    for (const [key, serializer] of Object.entries(plugin.outputSerializers ?? {})) {
      if (!owned.has(key))
        diagnostics.push(
          diagnostic(
            "plugin-serializer-without-output",
            `plugins.${key}`,
            `Plugin "${plugin.name}" provides a serializer without owning output "${key}".`,
            [plugin.name, key],
          ),
        );
      else if (outputSerializers[key])
        diagnostics.push(
          diagnostic(
            "plugin-duplicate-serializer",
            `plugins.${key}`,
            `Multiple plugins provide a serializer for output "${key}".`,
            [key],
          ),
        );
      else outputSerializers[key] = serializer;
    }
  return Object.freeze({
    plugins: Object.freeze(plugins),
    diagnostics: Object.freeze(diagnostics),
    internalKeys,
    outputSerializers: Object.freeze(outputSerializers),
    preparation,
  });
}
function readStops(value: unknown): readonly AuthoredStop[] {
  return isRecord(value) && Array.isArray(value.stops) ? value.stops.filter(validStop) : [];
}

export class PluginRegistry {
  readonly #plugins = new Map<string, PluginDefinition>();
  readonly #keyOwners = new Map<string, PluginDefinition>();
  readonly #inputOwners = new Map<string, PluginDefinition>();
  readonly #predicates: PluginDefinition[] = [];
  readonly #orders = new Map<string, number>();
  #registrationOrder = 0;

  register(plugin: PluginDefinition): void {
    if (typeof plugin?.name !== "string" || !plugin.name.trim())
      throw new TypeError("Plugin name must be a non-empty string.");
    if (typeof plugin.compose !== "function")
      throw new TypeError("Plugin compose must be a function.");
    if (plugin.keys !== undefined && !Array.isArray(plugin.keys))
      throw new TypeError("Plugin keys must be an array when provided.");
    if (plugin.claimsKey !== undefined && typeof plugin.claimsKey !== "function")
      throw new TypeError("Plugin claimsKey must be a function when provided.");
    if (plugin.inputs !== undefined && !Array.isArray(plugin.inputs))
      throw new TypeError("Plugin inputs must be an array when provided.");
    if (plugin.outputs !== undefined && !Array.isArray(plugin.outputs))
      throw new TypeError("Plugin outputs must be an array when provided.");
    if (plugin.stage !== undefined && !VALID_STAGES.has(plugin.stage))
      throw new TypeError(`Unknown plugin stage "${plugin.stage}".`);
    if (plugin.contribute && plugin.stage !== "prepare")
      throw new TypeError(`Plugin "${plugin.name}" contribute requires stage "prepare".`);
    if (plugin.priority !== undefined && (!Number.isFinite(plugin.priority) || !Number.isInteger(plugin.priority)))
      throw new TypeError("Plugin priority must be a finite integer when provided.");
    if (this.#plugins.has(plugin.name))
      throw new Error(`Plugin "${plugin.name}" is already registered.`);

    const keys = [...(plugin.keys ?? [])];
    const inputs = [...(plugin.inputs ?? [])];
    for (const key of keys) {
      const owner = this.#keyOwners.get(key);
      if (owner)
        throw new TypeError(
          `plugin-key-collision: Plugin "${owner.name}" already owns key "${key}".`,
        );
    }
    for (const input of inputs) {
      const owner = this.#inputOwners.get(input);
      if (owner)
        throw new TypeError(
          `plugin-input-collision: Plugin "${owner.name}" already owns input "${input}".`,
        );
    }

    const frozen = Object.freeze({
      ...plugin,
      ...(plugin.keys ? { keys: Object.freeze(keys) } : {}),
      ...(plugin.inputs ? { inputs: Object.freeze(inputs) } : {}),
      ...(plugin.outputs ? { outputs: Object.freeze([...plugin.outputs]) } : {}),
    });
    this.#plugins.set(plugin.name, frozen);
    this.#orders.set(plugin.name, this.#registrationOrder++);
    for (const key of keys) this.#keyOwners.set(key, frozen);
    for (const input of inputs) this.#inputOwners.set(input, frozen);
    if (keys.length === 0 && plugin.claimsKey) this.#predicates.push(frozen);
  }

  resolve(names: readonly string[], path = "plugins"): ResolvedPlugins {
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    const requested = new Set<string>();
    names.forEach((name, index) => {
      const itemPath = `${path}[${index}]`;
      if (typeof name !== "string" || !name.trim())
        diagnostics.push(diagnostic("plugin-name", itemPath, "Plugin name must be a non-empty string."));
      else if (requested.has(name))
        diagnostics.push(diagnostic("plugin-duplicate-use", itemPath, `Plugin "${name}" is requested more than once.`, [name]));
      else {
        requested.add(name);
        const plugin = this.#plugins.get(name);
        if (!plugin) diagnostics.push(diagnostic("plugin-unknown", itemPath, `Plugin "${name}" is not registered.`, [name]));
        else plugins.push(plugin);
      }
    });
    return result(plugins, diagnostics, Object.freeze({ keyframes: Object.freeze({}), tweenVars: Object.freeze({}) }));
  }

  resolveForKeyframes(
    authored: Readonly<Record<string, unknown>>,
    path = "keyframes",
    track: TrackConfigView = {},
  ): ResolvedPlugins {
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    const ownerOf = (key: string): PluginDefinition | undefined =>
      this.#keyOwners.get(key) ?? this.#predicates.find((plugin) => claims(plugin, key));
    for (const key of Object.keys(authored).sort()) {
      const owner = ownerOf(key);
      if (!owner)
        diagnostics.push(
          diagnostic("plugin-unknown-key", `${path}.${key}`, `No registered plugin claims authored key "${key}".`, [key]),
        );
      else if (!plugins.includes(owner)) plugins.push(owner);
    }
    plugins.sort(
      (a, b) =>
        comparePlugins(a, b) ||
        (a.priority ?? 0) - (b.priority ?? 0) ||
        (this.#orders.get(a.name) ?? 0) - (this.#orders.get(b.name) ?? 0),
    );
    const owners = new Map<string, string>();
    for (const plugin of plugins)
      for (const output of plugin.outputs ?? []) {
        const owner = owners.get(output);
        if (owner)
          diagnostics.push(
            diagnostic(
              "plugin-duplicate-output",
              `${path}.${output}`,
              `Plugins "${owner}" and "${plugin.name}" both claim output "${output}".`,
              [owner, plugin.name, output].sort(),
            ),
          );
        else owners.set(output, plugin.name);
      }
    return result(
      plugins,
      diagnostics,
      prepareContributions(authored, this.#keyOwners, this.#predicates, track, path, diagnostics),
    );
  }

  has(name: string): boolean {
    return this.#plugins.has(name);
  }
  get size(): number {
    return this.#plugins.size;
  }
}
