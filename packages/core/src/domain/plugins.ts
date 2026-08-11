import type { Diagnostic } from "../contract/v5";
import type { ImmutableRecord } from "./values";

export type PluginComposer = (
  values: Readonly<ImmutableRecord>,
  progress: number,
) => ImmutableRecord;

export type PluginKeyClaim = (key: string) => boolean;

export interface PluginDefinition {
  readonly name: string;
  readonly keys?: readonly string[];
  readonly claimsKey?: PluginKeyClaim;
  readonly inputs?: readonly string[];
  readonly stage?: string;
  readonly priority?: number;
  readonly outputs?: readonly string[];
  readonly internalKeys?: readonly string[];
  readonly compose: PluginComposer;
}

export interface ResolvedPlugins {
  readonly plugins: readonly PluginDefinition[];
  readonly diagnostics: readonly Diagnostic[];
}

function diagnostic(
  ruleId: string,
  path: string,
  message: string,
  ids?: readonly string[],
): Diagnostic {
  return { ruleId, path, message, severity: "error", ...(ids ? { ids } : {}) };
}

function assertName(name: unknown): asserts name is string {
  if (typeof name !== "string" || name.trim() === "") {
    throw new TypeError("Plugin name must be a non-empty string.");
  }
}

function assertComposer(compose: unknown): asserts compose is PluginComposer {
  if (typeof compose !== "function") {
    throw new TypeError("Plugin compose must be a function.");
  }
}

function assertMetadata(plugin: PluginDefinition): void {
  if (plugin.keys !== undefined && !Array.isArray(plugin.keys))
    throw new TypeError("Plugin keys must be an array when provided.");
  if (plugin.claimsKey !== undefined && typeof plugin.claimsKey !== "function")
    throw new TypeError("Plugin claimsKey must be a function when provided.");
  if (plugin.priority !== undefined && !Number.isFinite(plugin.priority))
    throw new TypeError("Plugin priority must be finite when provided.");
}

function claims(plugin: PluginDefinition, key: string): boolean {
  return Boolean(plugin.keys?.includes(key) || plugin.claimsKey?.(key));
}

function comparePlugins(left: PluginDefinition, right: PluginDefinition): number {
  const stage = (left.stage ?? "compose").localeCompare(right.stage ?? "compose");
  if (stage !== 0) return stage;
  return (left.priority ?? 0) - (right.priority ?? 0);
}

/** Owns plugin registration and detached deterministic resolution. */
export class PluginRegistry {
  readonly #plugins = new Map<string, PluginDefinition>();
  #registrationOrder = 0;
  readonly #orders = new Map<string, number>();

  register(plugin: PluginDefinition): void {
    assertName(plugin?.name);
    assertComposer(plugin?.compose);
    assertMetadata(plugin);
    if (this.#plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered.`);
    }
    const detached = Object.freeze({
      ...plugin,
      ...(plugin.keys ? { keys: Object.freeze([...plugin.keys]) } : {}),
      ...(plugin.inputs ? { inputs: Object.freeze([...plugin.inputs]) } : {}),
      ...(plugin.outputs ? { outputs: Object.freeze([...plugin.outputs]) } : {}),
      ...(plugin.internalKeys ? { internalKeys: Object.freeze([...plugin.internalKeys]) } : {}),
    });
    this.#plugins.set(plugin.name, detached);
    this.#orders.set(plugin.name, this.#registrationOrder++);
  }

  resolve(names: readonly string[], path = "plugins"): ResolvedPlugins {
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    const requested = new Set<string>();

    names.forEach((name, index) => {
      const itemPath = `${path}[${index}]`;
      if (typeof name !== "string" || name.trim() === "") {
        diagnostics.push(
          diagnostic("plugin-name", itemPath, "Plugin name must be a non-empty string."),
        );
        return;
      }
      if (requested.has(name)) {
        diagnostics.push(
          diagnostic(
            "plugin-duplicate-use",
            itemPath,
            `Plugin "${name}" is requested more than once.`,
            [name],
          ),
        );
        return;
      }
      requested.add(name);
      const plugin = this.#plugins.get(name);
      if (!plugin) {
        diagnostics.push(
          diagnostic("plugin-unknown", itemPath, `Plugin "${name}" is not registered.`, [name]),
        );
        return;
      }
      plugins.push(plugin);
    });

    return this.#result(plugins, diagnostics);
  }

  resolveForKeyframes(
    keyframes: Readonly<Record<string, unknown>>,
    path = "keyframes",
  ): ResolvedPlugins {
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    for (const key of Object.keys(keyframes)) {
      const matches = [...this.#plugins.values()].filter((plugin) => claims(plugin, key));
      if (matches.length === 0) {
        diagnostics.push(
          diagnostic(
            "plugin-unknown-key",
            `${path}.${key}`,
            `No registered plugin claims authored key "${key}".`,
            [key],
          ),
        );
        continue;
      }
      for (const plugin of matches) if (!plugins.includes(plugin)) plugins.push(plugin);
    }
    plugins.sort((left, right) => {
      const result = comparePlugins(left, right);
      return result || (this.#orders.get(left.name) ?? 0) - (this.#orders.get(right.name) ?? 0);
    });
    return this.#result(plugins, diagnostics);
  }

  has(name: string): boolean {
    return this.#plugins.has(name);
  }

  get size(): number {
    return this.#plugins.size;
  }

  #result(plugins: PluginDefinition[], diagnostics: Diagnostic[]): ResolvedPlugins {
    return Object.freeze({
      plugins: Object.freeze(plugins),
      diagnostics: Object.freeze(diagnostics),
    });
  }
}
