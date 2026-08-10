import type { Diagnostic } from "../contract/v5";
import type { ImmutableRecord } from "./values";

export type PluginComposer = (
  values: Readonly<ImmutableRecord>,
  progress: number,
) => ImmutableRecord;

export interface PluginDefinition {
  readonly name: string;
  readonly compose: PluginComposer;
}

export interface ResolvedPlugins {
  readonly plugins: readonly PluginDefinition[];
  readonly diagnostics: readonly Diagnostic[];
}

function diagnostic(ruleId: string, path: string, message: string, ids?: readonly string[]): Diagnostic {
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

/**
 * Owns plugin registration and resolution. A resolved list is detached from the registry
 * so later registry mutation cannot change an already-constructed Track.
 */
export class PluginRegistry {
  readonly #plugins = new Map<string, PluginDefinition>();

  register(plugin: PluginDefinition): void {
    assertName(plugin?.name);
    assertComposer(plugin?.compose);
    if (this.#plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" is already registered.`);
    }
    this.#plugins.set(plugin.name, Object.freeze({ name: plugin.name, compose: plugin.compose }));
  }

  resolve(names: readonly string[], path = "plugins"): ResolvedPlugins {
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    const requested = new Set<string>();

    names.forEach((name, index) => {
      const itemPath = `${path}[${index}]`;
      if (typeof name !== "string" || name.trim() === "") {
        diagnostics.push(diagnostic("plugin-name", itemPath, "Plugin name must be a non-empty string."));
        return;
      }
      if (requested.has(name)) {
        diagnostics.push(
          diagnostic("plugin-duplicate-use", itemPath, `Plugin "${name}" is requested more than once.`, [name]),
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

    return Object.freeze({
      plugins: Object.freeze(plugins),
      diagnostics: Object.freeze(diagnostics),
    });
  }

  has(name: string): boolean {
    return this.#plugins.has(name);
  }

  get size(): number {
    return this.#plugins.size;
  }
}
