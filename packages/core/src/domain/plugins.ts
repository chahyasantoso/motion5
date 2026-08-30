import { readAuthoredLeaf, readCompilableStops } from "../contract/authored-leaf";
import { validateKeyframes } from "../contract/validate-v5";
import type {
  AuthoredProperty,
  AuthoredStop,
  Diagnostic,
  PluginRequiresBinding,
} from "../contract/v5";
import { flattenAuthoredKeyframes, type FlattenedKeyframe } from "./keyframe-groups";
import type { ImmutableRecord } from "./values";

/**
 * The values one plugin's declared requirement slots resolved to, keyed by slot name.
 *
 * Each slot holds the source's published values under the source's own key names. There is no
 * projection and no renaming, because the slot itself is the scope: `inputs.base.rotation` and the
 * observer's authored `rotation` are distinguished by where they live rather than by being spelled
 * differently. That is what makes an upstream value structurally unable to overwrite an authored
 * one, and it is why `fkPlugin` needs no `parentRotation`. See ADR-044.
 *
 * A dict-valued slot holds one entry per authored key, keyed by that key, so the nesting mirrors the
 * authored section exactly: `inputs.spring.tensions["seg-a"]`. See ADR-057.
 */
export type PluginInputs = Readonly<ImmutableRecord>;
/** Every plugin's scoped inputs for one composition, keyed by plugin name. */
export type RequirementInputs = Readonly<Record<string, PluginInputs>>;

/**
 * `inputs` and `nodeId` are appended rather than inserted, so every composer written against the
 * two- or three-argument form stays assignable, a plugin that needs no upstream value simply does
 * not declare it, and a plugin that does not need to identify itself never asks for it.
 */
export type PluginComposer = (
  values: Readonly<ImmutableRecord>,
  progress: number,
  inputs: PluginInputs,
  nodeId: string,
) => ImmutableRecord;
export interface TrackConfigView {
  readonly id?: string;
  readonly duration?: number;
}
export interface Contribution {
  readonly keyframes?: Readonly<Record<string, AuthoredProperty>>;
  readonly tweenVars?: Readonly<Record<string, unknown>>;
}
/**
 * A prepare-stage hook, called once per authored entry the plugin owns.
 *
 * `stops` stays the second parameter through ADR-050. A static leaf has none, and rather than hand
 * the hook an empty list it is refused by name as `plugin-contribution-static-unsupported`, so the
 * signature keeps saying that a contribution is derived from an interpolated property.
 */
export type PluginContributor = (
  key: string,
  stops: readonly AuthoredStop[],
  track: TrackConfigView,
) => Contribution | undefined;
export type PluginKeyClaim = (key: string) => boolean;
export type OutputSerializer = (value: unknown) => unknown;
/**
 * One input slot a plugin declares and an author may bind through `keyframes.<plugin>.requires`.
 *
 * Every slot is optional to bind. A plugin that wants a default owns it in its own `compose`, which
 * is the only place that knows what an unbound slot means: `fk` composes against the origin, and a
 * plugin for which no base is meaningless would refuse in its own composition instead. See ADR-044.
 */
export interface PluginRequirement {
  /** What the slot is for. Documentation for the plugin's author; carries no behavior. */
  readonly description?: string;
  /**
   * Whether an author binds this slot to a dict of keys rather than to one source id.
   *
   * Data rather than a predicate, and that is the whole of what replaced `claimsSlot`. A record of
   * declared slots could not express a family whose members are named by the rig rather than by the
   * plugin, which is what a goal per chain member is, so the family arrived through a predicate the
   * plugin answered with code. How many entries there are is still the rig's property; that the slot
   * takes entries at all is the plugin's, and a field on the shape that already owns declared slots
   * says so without giving any plugin a second way to declare one.
   *
   * One owner reads it, `#resolveRequirements`, and it answers in both directions: a dict at a slot
   * without it is `plugin-requirement-dict-unsupported`, and one source at a slot with it is
   * `plugin-requirement-dict-required`. The second half is worth as much as the first, because a
   * plugin that reads this slot as a keyed record would otherwise be handed one source's values
   * under the slot itself and have no way to say the author meant something else. See ADR-057.
   *
   * `true` rather than `boolean`. `dict: false` would be a second spelling of an absent field, which
   * is the shape `TimeTriggerDefinition.autoplay` reserves for the same reason.
   */
  readonly dict?: true;
}
/** One authored binding that resolved against a declared slot of a registered plugin. */
export interface ResolvedRequirement {
  readonly plugin: string;
  readonly slot: string;
  readonly source: string;
  /** The key a dict entry was authored under, absent for a slot that takes one source. */
  readonly memberKey?: string;
}
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
  /**
   * The bindings that resolved against a declared slot, ordered by plugin, then slot, then key.
   *
   * Reporting rather than wiring. The graph derives its edges from the authored form directly, so
   * this exists to tell a compiled-track owner which slots a track actually bound, and a second
   * derivation from it would be a second owner of the same dependency. See ADR-044.
   *
   * It carries `memberKey` for the same reason the edge does: without it, two entries of one
   * dict-valued slot are two identical rows here, and a report that cannot distinguish two real
   * dependencies is a report that quietly loses one. See ADR-057.
   */
  readonly requirements: readonly ResolvedRequirement[];
  readonly internalKeys: readonly string[];
  readonly outputSerializers: Readonly<Record<string, OutputSerializer>>;
  readonly preparation: PreparedContribution;
}
export interface PluginDefinition {
  readonly name: string;
  readonly keys?: readonly string[];
  readonly claimsKey?: PluginKeyClaim;
  readonly inputs?: readonly string[];
  readonly requirements?: Readonly<Record<string, PluginRequirement>>;
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
 *
 * The stops a hook receives come from `readCompilableStops`, the one owner of the leaf shape, so a
 * hook sees exactly the stops the interpolation compiler would rather than a second reading of the
 * same authored record. See issue #192.
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
    // A static leaf never enters compilation, so there is no percent grid for a contribution to
    // land on. Calling the hook with an empty stop list instead would be a field accepted and then
    // ignored, which rule 6 of ADR-033 forbids, and it would read as a hook that ran and declined.
    // Refused by name, so the author is told which leaf the plugin cannot work from. See ADR-050.
    if (readAuthoredLeaf(authored[key]).kind === "static") {
      const detail = `cannot contribute from static key "${key}"`;
      diagnostics.push(
        diagnostic(
          "plugin-contribution-static-unsupported",
          authoredPath(key),
          `Plugin "${plugin.name}" ${detail}.`,
          [plugin.name, key],
        ),
      );
      continue;
    }
    let contribution: Contribution;
    try {
      contribution = normalizeContribution(
        plugin.contribute(
          key,
          readCompilableStops(authored[key]),
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
  requirements: readonly ResolvedRequirement[],
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
    requirements,
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
    if (plugin.requirements !== undefined && !isRecord(plugin.requirements))
      throw new TypeError("Plugin requirements must be an object when provided.");
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
    const slots = Object.keys(plugin.requirements ?? {});
    for (const slot of slots)
      if (!slot.trim())
        throw new TypeError(`Plugin "${plugin.name}" requirement slot must be non-empty.`);
    // No reservation for the goals slot any more. It was reserved as a declared slot name because a
    // goal reached its plugin through `claimsSlot`, so a named `targets` would have been a second,
    // unreachable spelling of the same binding while the authored dict expanded straight past it.
    // Declaring it is now how the capability is declared at all, and `ikPlugin` does exactly that.
    // See ADR-057.
    //
    // The colon belongs to the internal-key rule, and this is where that reservation becomes real
    // rather than a convention. A plugin free to declare an output named `fk:world` would have its
    // public output treated as private and silently dropped before publication. A requirement slot
    // is held to the same rule, because a namespaced slot would name a scoped input the author can
    // never spell inside a group: `keyframes` rejects the colon in every authored name.
    for (const name of [...keys, ...inputs, ...outputs, ...slots]) {
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
    // could ever name an owner for one and this is the only owner that rule has. `requirements`
    // needs no such guard for the opposite reason: a slot is addressed through its owning plugin's
    // group and delivered scoped to it, so two plugins declaring `base` never share a namespace.
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
      ...(plugin.requirements ? { requirements: deepFreeze({ ...plugin.requirements }) } : {}),
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
  /**
   * The registry-dependent half of binding validation.
   *
   * Three questions only: does the group name a registered plugin, does that plugin declare the
   * bound slot, and does the declaration agree with the shape the author bound it to. The shape of
   * the section is already proven by `validateKeyframes`, and whether the source resolves to a node
   * belongs to graph construction, which runs on the authored form and needs no registry at all.
   * See ADR-044.
   *
   * "Declares" has one source again. It was the `requirements` record for a slot the plugin named
   * plus `claimsSlot` for a family it could not name, which is two owners of one question kept
   * consistent by hand; the record answers alone now, and the third question above is what the
   * predicate was really for. `PluginRequirement.dict` is that answer, and it is data, so no plugin
   * gets to answer with code. See ADR-057.
   *
   * Both directions are refused, because a mismatch is silent in both. A dict at a slot that takes
   * one source is a binding accepted and then ignored, which is what ADR-033 rule 6 forbids, and
   * nothing below this layer can catch it: the parser holds no registry, and the slot name is
   * legitimately declared. One source at a slot that takes a dict hands a plugin one node's values
   * where it reads a keyed record, which is the same silence with the shapes swapped.
   *
   * `reportedGroups` is shared with `#ownerForEntry` so a group naming no registered plugin is one
   * diagnostic whether the author got there through a leaf, a binding, or both.
   *
   * The owning plugin joins `plugins` here, because a group may author nothing but bindings. Left
   * out, such a track would derive its edge, receive its scoped input, and then run no composer at
   * all: an edge with no consumer, which reads as a held value rather than as an error. It joins
   * after the refusals, so a plugin reached only through a refused binding does not compose.
   */
  #resolveRequirements(
    bindings: readonly PluginRequiresBinding[],
    path: string,
    diagnostics: Diagnostic[],
    reportedGroups: Set<string>,
    plugins: PluginDefinition[],
  ): readonly ResolvedRequirement[] {
    const resolved: ResolvedRequirement[] = [];
    for (const binding of bindings) {
      const named = this.#plugins.get(binding.plugin);
      if (named === undefined) {
        if (reportedGroups.has(binding.plugin)) continue;
        reportedGroups.add(binding.plugin);
        const message = `No registered plugin is named "${binding.plugin}".`;
        const groupPath = `${path}.${binding.plugin}`;
        diagnostics.push(diagnostic("plugin-unknown-key", groupPath, message, [binding.plugin]));
        continue;
      }
      const bindingPath = `${path}.${binding.authoredPath}`;
      const declared = named.requirements ?? {};
      if (!(binding.slot in declared)) {
        const detail = `does not declare requirement "${binding.slot}"`;
        diagnostics.push(
          diagnostic(
            "plugin-unknown-requirement",
            bindingPath,
            `Plugin "${binding.plugin}" ${detail}.`,
            [binding.plugin, binding.slot],
          ),
        );
        continue;
      }
      const acceptsDict = declared[binding.slot]?.dict === true;
      const boundDict = binding.memberKey !== undefined;
      if (boundDict && !acceptsDict) {
        const detail = `does not accept a dict of keys at requirement "${binding.slot}"`;
        diagnostics.push(
          diagnostic(
            "plugin-requirement-dict-unsupported",
            bindingPath,
            `Plugin "${binding.plugin}" ${detail}.`,
            [binding.plugin, binding.slot],
          ),
        );
        continue;
      }
      if (!boundDict && acceptsDict) {
        const detail = `requires a dict of keys at requirement "${binding.slot}"`;
        diagnostics.push(
          diagnostic(
            "plugin-requirement-dict-required",
            bindingPath,
            `Plugin "${binding.plugin}" ${detail}.`,
            [binding.plugin, binding.slot],
          ),
        );
        continue;
      }
      if (!plugins.includes(named)) plugins.push(named);
      resolved.push(
        Object.freeze({
          plugin: binding.plugin,
          slot: binding.slot,
          source: binding.source,
          ...(binding.memberKey === undefined ? {} : { memberKey: binding.memberKey }),
        }),
      );
    }
    return Object.freeze(resolved);
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
    // After the entry loop, so an unknown group name is reported once, and before the sort, so a
    // plugin reached only through a binding takes its place in stage and priority order.
    const requirements = this.#resolveRequirements(
      flattened.bindings,
      path,
      diagnostics,
      reportedGroups,
      plugins,
    );
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
    return result(plugins, diagnostics, flattened.keyframes, preparation, requirements);
  }
  has(name: string): boolean {
    return this.#plugins.has(name);
  }
  get size(): number {
    return this.#plugins.size;
  }
}
