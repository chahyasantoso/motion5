import {
  asAuthoredEntryId,
  asCompilerEntryKey,
  asGenerationToken,
  asPluginName,
  createCompilerEntryKey,
  encodeBindingTuple,
  qualifySourceAddress,
  type AuthoredEntryId,
  type CompilerEntryKey,
  type GenerationToken,
  type PluginName,
} from "../contract/address";
import {
  authoredLeafPartition,
  readAuthoredLeaf,
  readCompilableStops,
} from "../contract/authored-leaf";
import { diagnostic } from "../contract/diagnostics";
import { readKeyframeEntries, type TrustedKeyframeEntry } from "../contract/keyframe-shape";
import type { AuthoredProperty, AuthoredStop, Diagnostic } from "../contract/v5";
import { validateKeyframes } from "../contract/validate-v5";
import type { OutputSerializer } from "../ports/render-metadata";
import { unreachable } from "../lang/exhaustive";
import type { EvaluatorServices } from "./cache";
import { claims } from "./plugin-admission";
import { COLLECT_OUTPUT } from "../contract/collect";
import type {
  CollectRun,
  Contribution,
  PluginComposer,
  PluginDefinition,
  PreparedContribution,
  ResolvedRequirement,
  StatefulFold,
  StatefulPluginDefinition,
  StatelessFold,
  TrackConfigView,
} from "./plugins";
import { isLegacyComposeDefinition } from "./legacy-compose";
import type { StructuralDescriptor } from "../contract/derivation";

export interface EvaluatorContext {
  readonly trackId?: string;
  readonly entryId: AuthoredEntryId;
  readonly compilerKey: CompilerEntryKey;
  readonly generation: GenerationToken;
  readonly plugin: PluginName;
}

export type { EvaluatorServices };

export interface LocalEvaluationContext extends EvaluatorContext {
  readonly progress: number;
}

export interface LocalEvaluation {
  readonly values: Readonly<Record<string, unknown>>;
  readonly inputs: Readonly<Record<string, unknown>>;
  readonly context: LocalEvaluationContext;
  readonly [key: string]: unknown;
}

export type ExecutionStrategy =
  | {
      readonly kind: "stateless";
      readonly collect?: CollectRun;
      readonly fold?: StatelessFold["run"];
    }
  | {
      readonly kind: "stateful";
      readonly init: StatefulPluginDefinition["init"];
      readonly prepare: StatefulPluginDefinition["prepare"];
      readonly dispose?: StatefulPluginDefinition["dispose"];
      readonly collect?: StatefulPluginDefinition["collect"];
      readonly fold?: StatefulFold["run"];
    }
  | {
      // F2 deletes this strategy with the legacy compose channel.
      readonly kind: "legacy-compose";
      readonly compose: PluginComposer;
    };

export interface CompiledFoldOperation {
  readonly outputs: readonly string[];
}

export interface CompiledEntryOperations {
  readonly collect?: true;
  readonly fold?: CompiledFoldOperation;
}

export interface CompiledEntrySchema {
  readonly values: Readonly<Record<string, AuthoredProperty>>;
  readonly leafPaths: ReadonlyMap<string, string>;
}

export interface EvaluatorLifecycleDescriptor {
  readonly trackId?: string;
  readonly entryId: AuthoredEntryId;
  readonly compilerKey: CompilerEntryKey;
  readonly generation: GenerationToken;
  readonly pluginName: PluginName;
}

export interface NormalizedSingleBinding {
  readonly kind: "single";
  readonly qualifiedSource: string;
  readonly destinationTrack?: string;
  readonly entryId: AuthoredEntryId;
  readonly compilerKey: CompilerEntryKey;
  readonly plugin: PluginName;
  readonly slot: string;
  readonly memberKey?: never;
  readonly authoredPath: string;
  readonly tupleKey: string;
}

export interface NormalizedDictBinding {
  readonly kind: "dict";
  readonly qualifiedSource: string;
  readonly destinationTrack?: string;
  readonly entryId: AuthoredEntryId;
  readonly compilerKey: CompilerEntryKey;
  readonly plugin: PluginName;
  readonly slot: string;
  readonly memberKey: string;
  readonly authoredPath: string;
  readonly tupleKey: string;
}

/** Real single/dict union preserving separate fields and exact absence. */
export type NormalizedRequirementBinding = NormalizedSingleBinding | NormalizedDictBinding;

export interface CompiledEntryPlan {
  readonly compilerKey: CompilerEntryKey;
  readonly entryId: AuthoredEntryId;
  readonly authoredPath: string;
  readonly order: number;
  readonly plugin: PluginDefinition;
  readonly schema: CompiledEntrySchema;
  readonly requirements: readonly ResolvedRequirement[];
  readonly bindings: readonly NormalizedRequirementBinding[];
  readonly contribution?: PreparedContribution;
  readonly operations: CompiledEntryOperations;
  readonly execution: ExecutionStrategy;
  readonly lifecycle: EvaluatorLifecycleDescriptor;
}

export interface TrackExecutionPlan {
  readonly trackId?: string;
  readonly generation: GenerationToken;
  readonly entries: readonly CompiledEntryPlan[];
  readonly entriesById: ReadonlyMap<string, CompiledEntryPlan>;
  readonly entriesByKey: ReadonlyMap<string, CompiledEntryPlan>;
  readonly bindings: readonly NormalizedRequirementBinding[];
  readonly outputSerializers: Readonly<Record<string, OutputSerializer>>;
  readonly collects: boolean;
  readonly foldOutputs: readonly string[];
  readonly publishedOutputs: readonly string[];
  readonly descriptors?: readonly StructuralDescriptor[];
  readonly diagnostics: readonly Diagnostic[];
}

export interface PluginLookup {
  get(name: string): PluginDefinition | undefined;
  claimantsOf?(key: string): readonly PluginDefinition[];
}

export interface CompileTrackExecutionPlanOptions {
  readonly trackId?: string;
  readonly keyframes: unknown;
  readonly registry: PluginLookup;
  readonly generation?: number;
  readonly track?: TrackConfigView;
  readonly basePath?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalizeEntryContribution(
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
  for (const key of Object.keys(value)) {
    if (key !== "keyframes" && key !== "tweenVars") {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-shape",
          `${path}.${key}`,
          `Plugin "${plugin.name}" returned an unknown contribution field.`,
          [plugin.name, key],
        ),
      );
    }
  }
  return {
    ...(isRecord(value.keyframes)
      ? { keyframes: value.keyframes as Readonly<Record<string, AuthoredProperty>> }
      : {}),
    ...(isRecord(value.tweenVars) ? { tweenVars: value.tweenVars } : {}),
  };
}

const RESERVED_TWEEN_VARS = new Set(["keyframes", "duration", "paused", "id", "observes"]);

function validateContributionProperty(
  output: string,
  property: unknown,
  path: string,
  diagnostics: Diagnostic[],
): boolean {
  const before = diagnostics.length;
  validateKeyframes({ [output]: property as AuthoredProperty }, path, diagnostics, {
    scope: "contribution",
  });
  return !diagnostics.slice(before).some(({ severity }) => severity === "error");
}

function deriveEntryContribution(
  entry: TrustedKeyframeEntry,
  plugin: PluginDefinition,
  track: TrackConfigView,
  diagnostics: Diagnostic[],
  registry: PluginLookup,
): PreparedContribution | undefined {
  if (typeof plugin.contribute !== "function") return undefined;
  const keyframes: Record<string, AuthoredProperty> = {};
  const tweenVars: Record<string, unknown> = {};

  for (const [key, property] of Object.entries(entry.values)) {
    const partition = authoredLeafPartition(readAuthoredLeaf(property));
    if (partition.kind === "value") {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-static-unsupported",
          `${entry.authoredPath}.values.${key}`,
          `Plugin "${plugin.name}" cannot contribute from static key "${key}".`,
          [plugin.name, key],
        ),
      );
      continue;
    }
    const stops: readonly AuthoredStop[] =
      partition.kind === "stops" ? readCompilableStops(partition.stops) : [];
    if (stops.length === 0) continue;

    let contributed: unknown;
    try {
      contributed = plugin.contribute(key, stops, track);
    } catch (error) {
      diagnostics.push(
        diagnostic(
          "plugin-contribution-failure",
          `${entry.authoredPath}.values.${key}`,
          `Plugin "${plugin.name}" failed: ${error instanceof Error ? error.message : String(error)}.`,
          [plugin.name, key],
        ),
      );
      continue;
    }

    const normalized = normalizeEntryContribution(
      contributed,
      plugin,
      `${entry.authoredPath}.values.${key}`,
      diagnostics,
    );
    if (normalized.keyframes) {
      for (const [output, val] of Object.entries(normalized.keyframes)) {
        if (Object.hasOwn(entry.values, output)) {
          diagnostics.push(
            diagnostic(
              "plugin-contribution-output-collision",
              `${entry.authoredPath}.values.${output}`,
              `Plugin "${plugin.name}" attempted to overwrite authored key "${output}".`,
              [plugin.name, output],
            ),
          );
          continue;
        }

        if (!claims(plugin, output)) {
          diagnostics.push(
            diagnostic(
              "plugin-unknown-key",
              `${entry.authoredPath}.values.${key}`,
              `Plugin "${plugin.name}" cannot contribute unclaimed key "${output}".`,
              [plugin.name, output],
            ),
          );
          continue;
        }

        const claimants = registry.claimantsOf?.(output) ?? [];
        const cascading = claimants.filter(
          (c) => c.name !== plugin.name && c.contribute !== undefined,
        );
        if (cascading.length > 0) {
          diagnostics.push(
            diagnostic(
              "plugin-contribution-cascade",
              `${entry.authoredPath}.values.${key}`,
              `Contributed key "${output}" would require another contribution round.`,
              [plugin.name, ...cascading.map((c) => c.name), output].sort(),
            ),
          );
          continue;
        }

        if (
          validateContributionProperty(
            output,
            val,
            `${entry.authoredPath}.values.${key}`,
            diagnostics,
          )
        ) {
          keyframes[output] = val;
        }
      }
    }
    if (normalized.tweenVars) {
      for (const [varKey, val] of Object.entries(normalized.tweenVars)) {
        if (RESERVED_TWEEN_VARS.has(varKey)) {
          diagnostics.push(
            diagnostic(
              "plugin-contribution-reserved-tween-var",
              `${entry.authoredPath}.tweenVars.${varKey}`,
              `Plugin "${plugin.name}" cannot contribute reserved tween var "${varKey}".`,
              [plugin.name, varKey],
            ),
          );
          continue;
        }
        if (varKey in tweenVars && !Object.is(tweenVars[varKey], val)) {
          diagnostics.push(
            diagnostic(
              "plugin-contribution-tween-vars-conflict",
              `${entry.authoredPath}.tweenVars.${varKey}`,
              `Plugin "${plugin.name}" contributed conflicting tween var "${varKey}".`,
              [plugin.name, varKey],
            ),
          );
        } else {
          tweenVars[varKey] = val;
        }
      }
    }
  }

  if (Object.keys(keyframes).length === 0 && Object.keys(tweenVars).length === 0) {
    return undefined;
  }
  return Object.freeze({
    keyframes: Object.freeze(keyframes),
    tweenVars: Object.freeze(tweenVars),
  });
}

function resolveEntryRequirements(
  entry: TrustedKeyframeEntry,
  compilerKey: CompilerEntryKey,
  plugin: PluginDefinition,
  trackId: string | undefined,
  diagnostics: Diagnostic[],
): {
  readonly requirements: readonly ResolvedRequirement[];
  readonly bindings: readonly NormalizedRequirementBinding[];
} {
  const resolved: ResolvedRequirement[] = [];
  const normalized: NormalizedRequirementBinding[] = [];
  const declared = plugin.requirements ?? {};

  for (const binding of entry.bindings) {
    const slotPath = binding.authoredPath;
    if (!(binding.slot in declared)) {
      diagnostics.push(
        diagnostic(
          "plugin-unknown-requirement",
          slotPath,
          `Plugin "${plugin.name}" does not declare requirement "${binding.slot}".`,
          [plugin.name, binding.slot],
        ),
      );
      continue;
    }
    const acceptsDict = declared[binding.slot]?.dict === true;
    const boundDict = binding.memberKey !== undefined;
    if (boundDict && !acceptsDict) {
      diagnostics.push(
        diagnostic(
          "plugin-requirement-dict-unsupported",
          slotPath,
          `Plugin "${plugin.name}" does not accept a dict of keys at requirement "${binding.slot}".`,
          [plugin.name, binding.slot],
        ),
      );
      continue;
    }
    if (!boundDict && acceptsDict) {
      diagnostics.push(
        diagnostic(
          "plugin-requirement-dict-required",
          slotPath,
          `Plugin "${plugin.name}" requires a dict of keys at requirement "${binding.slot}".`,
          [plugin.name, binding.slot],
        ),
      );
      continue;
    }
    resolved.push(
      Object.freeze({
        entryId: entry.entryId,
        compilerKey,
        plugin: binding.plugin,
        slot: binding.slot,
        source: binding.source,
        ...(binding.memberKey === undefined ? {} : { memberKey: binding.memberKey }),
      }),
    );

    const qualifiedSource = qualifySourceAddress(binding.source);
    const entryId = asAuthoredEntryId(entry.entryId);
    const pluginName = asPluginName(binding.plugin);
    const tupleKey = encodeBindingTuple(qualifiedSource, entryId, binding.slot, binding.memberKey);

    if (binding.memberKey !== undefined) {
      const dictBinding: NormalizedDictBinding = Object.freeze({
        kind: "dict",
        qualifiedSource,
        ...(trackId !== undefined ? { destinationTrack: trackId } : {}),
        entryId,
        compilerKey,
        plugin: pluginName,
        slot: binding.slot,
        memberKey: binding.memberKey,
        authoredPath: slotPath,
        tupleKey,
      });
      normalized.push(dictBinding);
    } else {
      const singleBinding: NormalizedSingleBinding = Object.freeze({
        kind: "single",
        qualifiedSource,
        ...(trackId !== undefined ? { destinationTrack: trackId } : {}),
        entryId,
        compilerKey,
        plugin: pluginName,
        slot: binding.slot,
        authoredPath: slotPath,
        tupleKey,
      });
      normalized.push(singleBinding);
    }
  }
  return {
    requirements: Object.freeze(resolved),
    bindings: Object.freeze(normalized),
  };
}

function executionStrategyOf(plugin: PluginDefinition): ExecutionStrategy {
  // F2 deletes this arm with the legacy compose channel. The one shared predicate decides, so a
  // definition cannot be legacy for admission and new-path for execution.
  if (isLegacyComposeDefinition(plugin)) {
    return Object.freeze({ kind: "legacy-compose", compose: plugin.compose });
  }
  if (plugin.init !== undefined) {
    return Object.freeze({
      kind: "stateful",
      init: plugin.init,
      prepare: plugin.prepare,
      ...(plugin.dispose !== undefined ? { dispose: plugin.dispose } : {}),
      ...(plugin.collect !== undefined ? { collect: plugin.collect } : {}),
      ...(plugin.fold !== undefined ? { fold: plugin.fold.run } : {}),
    });
  }
  const fold = plugin.fold ? plugin.fold.run : undefined;
  const collect = plugin.collect;
  return Object.freeze({
    kind: "stateless",
    ...(collect !== undefined ? { collect } : {}),
    ...(fold !== undefined ? { fold } : {}),
  });
}

export function compileTrackExecutionPlan(
  options: CompileTrackExecutionPlanOptions,
): TrackExecutionPlan {
  const { trackId, keyframes, registry, basePath = "keyframes" } = options;
  const generation = asGenerationToken(options.generation ?? 1);
  const trackConfig = options.track ?? {};
  const trustedEntries = readKeyframeEntries(keyframes, basePath);

  const entries: CompiledEntryPlan[] = [];
  const diagnostics: Diagnostic[] = [];
  const entriesById = new Map<string, CompiledEntryPlan>();
  const entriesByKey = new Map<string, CompiledEntryPlan>();

  const foldOutputs: string[] = [];
  const outputSerializers: Record<string, OutputSerializer> = {};
  const serializerOwners = new Map<string, { plugin: string; serializer: OutputSerializer }>();

  let compilerCounter = 0;

  for (let order = 0; order < trustedEntries.length; order++) {
    const entry = trustedEntries[order];
    if (entry === undefined) continue;

    const plugin = registry.get(entry.plugin);
    if (plugin === undefined) {
      diagnostics.push(
        diagnostic(
          "plugin-unknown-key",
          entry.authoredPath,
          `No registered plugin is named "${entry.plugin}".`,
          [entry.plugin],
        ),
      );
      continue;
    }

    if (!plugin.collect && !plugin.fold && !isLegacyComposeDefinition(plugin)) {
      throw new TypeError(
        `Plugin "${plugin.name}" must declare collect, fold, or both operations.`,
      );
    }

    if (plugin.keys?.includes("id") || claims(plugin, "id")) {
      throw new TypeError(
        `Plugin "${plugin.name}" cannot declare or claim reserved property "id".`,
      );
    }

    const execution = executionStrategyOf(plugin);

    const leafPaths = new Map<string, string>();
    for (const leaf of Object.keys(entry.values)) {
      const leafPath = `${entry.authoredPath}.values.${leaf}`;
      leafPaths.set(leaf, leafPath);
      if (!claims(plugin, leaf)) {
        diagnostics.push(
          diagnostic(
            "plugin-unknown-key",
            leafPath,
            `Plugin "${plugin.name}" does not claim authored key "${leaf}".`,
            [plugin.name, leaf],
          ),
        );
      }
    }

    const schema: CompiledEntrySchema = Object.freeze({
      values: entry.values,
      leafPaths,
    });

    const entryId = asAuthoredEntryId(entry.entryId);
    const pluginName = asPluginName(plugin.name);
    const compilerKey = createCompilerEntryKey(entry.entryId, ++compilerCounter);

    const { requirements, bindings: entryBindings } = resolveEntryRequirements(
      entry,
      compilerKey,
      plugin,
      trackId,
      diagnostics,
    );
    const contribution = deriveEntryContribution(entry, plugin, trackConfig, diagnostics, registry);

    const operations: CompiledEntryOperations = Object.freeze({
      ...(typeof plugin.collect === "function" ? { collect: true as const } : {}),
      ...(plugin.fold
        ? { fold: Object.freeze({ outputs: Object.freeze([...plugin.fold.outputs]) }) }
        : {}),
    });

    const lifecycle: EvaluatorLifecycleDescriptor = Object.freeze({
      ...(trackId !== undefined ? { trackId } : {}),
      entryId,
      compilerKey,
      generation,
      pluginName,
    });

    const entryPlan: CompiledEntryPlan = Object.freeze({
      compilerKey,
      entryId,
      authoredPath: entry.authoredPath,
      order,
      plugin,
      schema,
      requirements,
      bindings: entryBindings,
      ...(contribution !== undefined ? { contribution } : {}),
      operations,
      execution,
      lifecycle,
    });

    entries.push(entryPlan);
    entriesById.set(entryId, entryPlan);
    entriesByKey.set(compilerKey, entryPlan);
  }

  // F2 deletes this mixed-track refusal with the legacy-compose strategy.
  const legacyEntries = entries.filter((entry) => entry.execution.kind === "legacy-compose");
  const legacyHasOperations = legacyEntries.some(
    (entry) => entry.operations.collect === true || entry.operations.fold !== undefined,
  );
  if (
    legacyEntries.length > 0 &&
    (legacyEntries.length !== entries.length || legacyHasOperations)
  ) {
    const legacyNames = legacyEntries.map((entry) => entry.plugin.name).sort();
    diagnostics.push(
      diagnostic(
        "legacy-compose-mixed-track",
        basePath,
        "A track cannot combine legacy compose entries with collect/fold entries; replacement chaining and delta folds have no defined order.",
        [...new Set(legacyNames)],
      ),
    );
  }

  // Cross-entry validations: collect presence, fold outputs, and output serializer consensus
  const foldSet = new Set<string>();

  for (const entryPlan of entries) {
    if (entryPlan.operations.fold !== undefined) {
      for (const out of entryPlan.operations.fold.outputs) {
        if (!foldSet.has(out)) {
          foldSet.add(out);
          foldOutputs.push(out);
        }
      }
    }
  }

  const collects = entries.some((entry) => entry.operations.collect === true);

  for (const entryPlan of entries) {
    const declaredOutputs = [
      ...(entryPlan.operations.collect === true ? [COLLECT_OUTPUT] : []),
      ...(entryPlan.operations.fold ? entryPlan.operations.fold.outputs : []),
    ];
    for (const out of declaredOutputs) {
      const ser = entryPlan.plugin.outputSerializers?.[out];
      if (ser !== undefined) {
        const existing = serializerOwners.get(out);
        if (existing !== undefined && existing.serializer !== ser) {
          throw new TypeError(
            `Conflicting serializers for shared output "${out}" between plugins "${existing.plugin}" and "${entryPlan.plugin.name}".`,
          );
        }
        serializerOwners.set(out, { plugin: entryPlan.plugin.name, serializer: ser });
        outputSerializers[out] = ser;
      }
    }
  }

  const publishedOutputs = Object.freeze(
    [...new Set([...(collects ? [COLLECT_OUTPUT] : []), ...foldOutputs])].sort(),
  );
  const trackBindings: NormalizedRequirementBinding[] = [];
  for (const entryPlan of entries) {
    trackBindings.push(...entryPlan.bindings);
  }

  return Object.freeze({
    ...(trackId !== undefined ? { trackId } : {}),
    generation,
    entries: Object.freeze(entries),
    entriesById,
    entriesByKey,
    bindings: Object.freeze(trackBindings),
    outputSerializers: Object.freeze(outputSerializers),
    collects,
    foldOutputs: Object.freeze(foldOutputs),
    publishedOutputs,
    diagnostics: Object.freeze(diagnostics),
  });
}

export function entryEvaluatorContext(plan: CompiledEntryPlan): EvaluatorContext {
  return Object.freeze({
    ...(plan.lifecycle.trackId !== undefined ? { trackId: plan.lifecycle.trackId } : {}),
    entryId: plan.lifecycle.entryId,
    compilerKey: plan.lifecycle.compilerKey,
    generation: plan.lifecycle.generation,
    plugin: plan.lifecycle.pluginName,
  });
}

export function assertExecutionStrategy(
  strategy: ExecutionStrategy,
): "stateless" | "stateful" | "legacy-compose" {
  switch (strategy.kind) {
    case "stateless":
      return "stateless";
    case "stateful":
      return "stateful";
    case "legacy-compose":
      return "legacy-compose";
    default:
      return unreachable(strategy);
  }
}
