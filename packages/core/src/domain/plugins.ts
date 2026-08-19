import { validateKeyframes } from "../contract/validate-v5";
import type { AuthoredProperty, AuthoredStop, Diagnostic } from "../contract/v5";
import { flattenAuthoredKeyframes, type FlattenedKeyframe } from "./keyframe-groups";
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
  /**
   * The authored keyframes with every plugin-named group flattened into its leaves. This is the
   * record the interpolator and the percent map must receive; the authored one may still be
   * grouped. Callers with no registry flatten through `flattenAuthoredKeyframes` themselves.
   */
  readonly authoredKeyframes: Readonly<Record<string, unknown>>;
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
const RESERVED_TWEEN_VARS = new Set(["keyframes", "duration", "paused", "id", "observes"]);
const AMBIGUOUS_KEY_HINT = "Author it inside a plugin-named group to name one.";
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
function sortedNames(plugins: readonly PluginDefinition[]): readonly string[] {
  return plugins.map(({ name }) => name).sort();
}
/** `"a" and "b"`, or `"a", "b" and "c"`: the wording every multi-plugin message here already uses. */
function listNames(names: readonly string[]): string {
  const quoted = names.map((name) => `"${name}"`);
  if (quoted.length < 2) return quoted.join("");
  return `${quoted.slice(0, -1).join(", ")} and ${quoted.at(-1)}`;
}
function stageRank(stage: string): number {
  return stage === "prepare" ? 0 : 1;
}
function comparePlugins(a: PluginDefinition, b: PluginDefinition): number {
  return stageRank(a.stage ?? "compose") - stageRank(b.stage ?? "compose");
}
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child, seen);
  return Object.freeze(value);
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
  for (const key of Object.keys(value))
    if (key !== "keyframes" && key !== "tweenVars")
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
function readStops(value: unknown): readonly AuthoredStop[] {
  return isRecord(value) && Array.isArray(value.stops)
    ? (value.stops as readonly AuthoredStop[])
    : [];
}
function validateContributionProperty(
  output: string,
  property: unknown,
  path: string,
  diagnostics: Diagnostic[],
): boolean {
  const before = diagnostics.length;
  validateKeyframes({ [output]: property }, path, diagnostics, {
    ruleIdPrefix: "plugin-contribution-",
    allowGroups: false,
    ruleIdAliases: {
      "stop-position": "stop",
      "stop-position-range": "stop-range",
      "stop-position-order": "stop-order",
      "stop-position-duplicate": "stop-duplicate",
    },
  });
  return !diagnostics.slice(before).some(({ severity }) => severity === "error");
}
/**
 * Runs the prepare-stage `contribute` hooks.
 *
 * `entryOwners` is the owner map the resolver already computed, not a second lookup: a key may have
 * several claimants, so the plugin whose hook runs for an authored entry has to be the same plugin
 * that entry resolved to. Re-deriving it from the registry's key map would run another claimant's
 * hook for a grouped leaf, and would run a hook at all for a group that named no plugin. See
 * ADR-043. `claimantsOf` answers for contributed keys only, which no author wrote and which no
 * group can therefore name.
 */
function prepareContributions(
  authored: Readonly<Record<string, unknown>>,
  entryOwners: ReadonlyMap<string, PluginDefinition>,
  claimantsOf: (key: string) => readonly PluginDefinition[],
  track: TrackConfigView,
  path: string,
  diagnostics: Diagnostic[],
  authoredPaths: ReadonlyMap<string, string> = new Map(),
): PreparedContribution {
  const keyframes: Record<string, AuthoredProperty> = {};
  const tweenVars: Record<string, unknown> = {};
  const authoredKeys = new Set(Object.keys(authored));
  const keyOwners = new Map<string, string>();
  const tweenOwners = new Map<string, string>();
  // The flattened key is what the hook is called with, but the author never typed it. Diagnostics
  // cite the authored spelling, so a mistake inside a group reads as `keyframes.fk.length`.
  const authoredPath = (key: string): string => `${path}.${authoredPaths.get(key) ?? key}`;
  for (const key of Object.keys(authored).sort()) {
    const plugin = entryOwners.get(key);
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
        authoredPath(key),
        diagnostics,
      );
    } catch (error) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-failure",
          authoredPath(key),
          `Plugin "${plugin.name}" failed: ${error instanceof Error ? error.message : String(error)}.`,
          [plugin.name, key],
        ),
      );
      continue;
    }
    for (const [output, property] of Object.entries(contribution.keyframes ?? {}).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
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
      const outputClaimants = claimantsOf(output);
      if (outputClaimants.length === 0) {
        diagnostics.push(
          diagnostic(
            "plugin-unknown-key",
            `${path}.${output}`,
            `No registered plugin claims contributed key "${output}".`,
            [output],
          ),
        );
        continue;
      }
      // Any claimant with a hook, not a nominated one: a contributed key that some claimant would
      // contribute from again is a second round however ownership of it would have been resolved.
      const cascading = sortedNames(
        outputClaimants.filter(({ contribute }) => contribute !== undefined),
      );
      if (cascading.length > 0) {
        diagnostics.push(
          diagnostic(
            "plugin-contribution-cascade",
            `${path}.${output}`,
            `Contributed key "${output}" would require another contribution round.`,
            [plugin.name, ...cascading, output].sort(),
          ),
        );
        continue;
      }
      if (validateContributionProperty(output, property, path, diagnostics)) {
        keyOwners.set(output, plugin.name);
        keyframes[output] = deepFreeze(property);
      }
    }
    for (const [name, value] of Object.entries(contribution.tweenVars ?? {}).sort(([a], [b]) =>
      a.localeCompare(b),
    )) {
      if (RESERVED_TWEEN_VARS.has(name)) {
        diagnostics.push(
          diagnostic(
            "plugin-contribution-reserved-tween-var",
            `${path}.tweenVars.${name}`,
            `Plugin "${plugin.name}" cannot contribute reserved tween var "${name}".`,
            [plugin.name, name],
          ),
        );
        continue;
      }
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
        tweenVars[name] = deepFreeze(value);
      }
    }
  }
  return Object.freeze({ keyframes: deepFreeze(keyframes), tweenVars: deepFreeze(tweenVars) });
}
function result(
  plugins: PluginDefinition[],
  diagnostics: Diagnostic[],
  authoredKeyframes: Readonly<Record<string, unknown>>,
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
    authoredKeyframes,
    internalKeys,
    outputSerializers: Object.freeze(outputSerializers),
    preparation,
  });
}

export class PluginRegistry {
  readonly #plugins = new Map<string, PluginDefinition>();
  readonly #keyClaimants = new Map<string, PluginDefinition[]>();
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
    if (
      plugin.priority !== undefined &&
      (!Number.isFinite(plugin.priority) || !Number.isInteger(plugin.priority))
    )
      throw new TypeError("Plugin priority must be a finite integer when provided.");
    if (this.#plugins.has(plugin.name))
      throw new Error(`Plugin "${plugin.name}" is already registered.`);
    const keys = [...(plugin.keys ?? [])];
    const inputs = [...(plugin.inputs ?? [])];
    const outputs = [...(plugin.outputs ?? [])];
    // The colon belongs to the internal-key rule, and this is where that reservation becomes real
    // rather than a convention. A plugin free to declare an output named `fk:world` would have its
    // public output treated as private and silently dropped before publication.
    for (const name of [...keys, ...inputs, ...outputs]) {
      if (!name.includes(":")) continue;
      const detail = `metadata name "${name}" must not contain ':'`;
      throw new TypeError(`Plugin "${plugin.name}" ${detail}.`);
    }
    // No key-collision guard. Two plugins may claim one key, and which of them owns an authored
    // entry is a question about that entry rather than about registration order: a group names the
    // owner, and a flat spelling with several claimants is `plugin-ambiguous-key` at resolve time.
    // Refusing the second claimant here is what forced a plugin author to mangle a key name to
    // route around a namespace they could not share. See ADR-043.
    //
    // `inputs` keeps its guard, because an input is not addressable by a group name, so nothing
    // could ever name an owner for one and this is the only owner that rule has.
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
      ...(plugin.outputs ? { outputs: Object.freeze(outputs) } : {}),
    });
    this.#plugins.set(plugin.name, frozen);
    this.#orders.set(plugin.name, this.#registrationOrder++);
    for (const key of keys) this.#claimantsFor(key).push(frozen);
    for (const input of inputs) this.#inputOwners.set(input, frozen);
    if (keys.length === 0 && plugin.claimsKey) this.#predicates.push(frozen);
  }
  #claimantsFor(key: string): PluginDefinition[] {
    const existing = this.#keyClaimants.get(key);
    if (existing !== undefined) return existing;
    const created: PluginDefinition[] = [];
    this.#keyClaimants.set(key, created);
    return created;
  }
  /**
   * Every plugin that claims `key`, in registration order.
   *
   * An exact claim outranks a predicate, unchanged, and at most one predicate is ever returned. A
   * predicate is the fallback for keys nobody named rather than a declaration of ownership, so two
   * overlapping predicates keep first-registered precedence instead of becoming ambiguous: that
   * rule has its own owner and its own evidence, and widening ambiguity to reach it would make
   * every exactly-claimed key in a registry with a catch-all predicate unauthorable.
   */
  #claimantsOf(key: string): readonly PluginDefinition[] {
    const exact = this.#keyClaimants.get(key);
    if (exact !== undefined && exact.length > 0) return exact;
    const predicate = this.#predicates.find((plugin) => claims(plugin, key));
    return predicate === undefined ? [] : [predicate];
  }
  /**
   * A grouped leaf resolves against the plugin the group names and nothing else, which is the
   * granularity the group form exists for: routing the leaf through the claimant map instead would
   * accept a leaf under any group name and report nothing at all for a group that names no
   * registered plugin.
   *
   * A flat key resolves against its claimants. One claimant owns it. Several is refused rather than
   * won, because the alternative is registration order deciding which plugin an authored key meant
   * and the losing plugin's keys becoming quietly unreachable. See ADR-043.
   */
  #ownerForEntry(
    entry: FlattenedKeyframe,
    path: string,
    diagnostics: Diagnostic[],
    reportedGroups: Set<string>,
  ): PluginDefinition | undefined {
    if (entry.group === undefined) {
      const claimants = this.#claimantsOf(entry.key);
      const keyPath = `${path}.${entry.key}`;
      if (claimants.length === 1) return claimants[0];
      if (claimants.length === 0) {
        const unknown = `No registered plugin claims authored key "${entry.key}".`;
        diagnostics.push(diagnostic("plugin-unknown-key", keyPath, unknown, [entry.key]));
        return undefined;
      }
      const names = sortedNames(claimants);
      const message = [
        `Authored key "${entry.key}" is claimed by plugins ${listNames(names)}.`,
        AMBIGUOUS_KEY_HINT,
      ].join(" ");
      diagnostics.push(
        diagnostic("plugin-ambiguous-key", keyPath, message, [...names, entry.key].sort()),
      );
      return undefined;
    }
    const named = this.#plugins.get(entry.group);
    if (named === undefined) {
      // Once per group, not once per leaf: the author made one mistake.
      if (reportedGroups.has(entry.group)) return undefined;
      reportedGroups.add(entry.group);
      const message = `No registered plugin is named "${entry.group}".`;
      const groupPath = `${path}.${entry.group}`;
      diagnostics.push(diagnostic("plugin-unknown-key", groupPath, message, [entry.group]));
      return undefined;
    }
    if (claims(named, entry.key)) return named;
    const message = `Plugin "${entry.group}" does not claim authored key "${entry.key}".`;
    const leafPath = `${path}.${entry.authoredPath}`;
    const ids = [entry.group, entry.key];
    diagnostics.push(diagnostic("plugin-unknown-key", leafPath, message, ids));
    return undefined;
  }
  resolveForKeyframes(
    authored: Readonly<Record<string, unknown>>,
    path = "keyframes",
    track: TrackConfigView = {},
  ): ResolvedPlugins {
    const flattened = flattenAuthoredKeyframes(authored);
    const plugins: PluginDefinition[] = [];
    const diagnostics: Diagnostic[] = [];
    const reportedGroups = new Set<string>();
    // One owner per authored entry, decided once. Preparation reads this map rather than asking the
    // registry again, so the hook that runs for an entry is the plugin that entry resolved to.
    const entryOwners = new Map<string, PluginDefinition>();
    for (const entry of flattened.entries) {
      const owner = this.#ownerForEntry(entry, path, diagnostics, reportedGroups);
      if (owner === undefined) continue;
      entryOwners.set(entry.key, owner);
      if (!plugins.includes(owner)) plugins.push(owner);
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
    // Flattened, so a prepare-stage plugin's `contribute` hook receives each leaf with its real
    // stops. Handed the group instead, the hook would be called once with an empty stop list.
    const preparation = prepareContributions(
      flattened.keyframes,
      entryOwners,
      (key) => this.#claimantsOf(key),
      track,
      path,
      diagnostics,
      flattened.authoredPaths,
    );
    return result(plugins, diagnostics, flattened.keyframes, preparation);
  }
  has(name: string): boolean {
    return this.#plugins.has(name);
  }
  get size(): number {
    return this.#plugins.size;
  }
}
