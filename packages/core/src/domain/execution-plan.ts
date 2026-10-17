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
import { ANY_CHAIN } from "../contract/solver-shape";
import type { AuthoredProperty, AuthoredStop, Diagnostic } from "../contract/v5";
import { validateKeyframes } from "../contract/validate-v5";
import type { OutputSerializer } from "../ports/render-metadata";
import { unreachable } from "../lang/exhaustive";
import type { PluginCapability } from "../ports/plugin-capabilities";
import type { EvaluatorServices } from "./cache";
import { claims } from "./plugin-admission";
import type {
  Contribution,
  PluginDefinition,
  PreparedContribution,
  ResolvedRequirement,
  TrackConfigView,
} from "./plugins";

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

export interface StatefulEvaluator<P = unknown, S = unknown> {
  prepare(local: unknown, committedState: S): { readonly prepared: P; readonly proposedState: S };
  collect?(prepared: P): Record<string, unknown>;
  fold?(
    prepared: P,
    priorFold: Record<string, unknown>,
  ): { readonly delta: Record<string, unknown>; readonly proposedState: S };
  dispose?(): void;
}

export type EvaluatorFactory<P = unknown, S = unknown> = (
  context: EvaluatorContext,
  services: EvaluatorServices,
) => StatefulEvaluator<P, S>;

export type ExecutionStrategy =
  | {
      readonly kind: "stateless";
      readonly collect?: (entry: unknown, context?: unknown) => Record<string, unknown>;
      readonly fold?: (
        entry: unknown,
        state?: unknown,
        context?: unknown,
      ) => Record<string, unknown>;
    }
  | {
      readonly kind: "factory";
      readonly createEvaluator: EvaluatorFactory;
    };

export interface CompiledCollectOperation {
  readonly output: string;
}

export interface CompiledFoldOperation {
  readonly outputs: readonly string[];
}

export interface CompiledEntryOperations {
  readonly collect?: CompiledCollectOperation;
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
  readonly capabilities: PluginCapability;
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
  readonly collectOutputs: readonly string[];
  readonly foldOutputs: readonly string[];
  readonly publishedOutputs: readonly string[];
  readonly diagnostics: readonly Diagnostic[];
}

export interface PluginLookup {
  get(name: string): PluginDefinition | undefined;
  capabilityOf?(name: string): PluginCapability | undefined;
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

function validateAndDetermineExecutionStrategy(plugin: PluginDefinition): ExecutionStrategy {
  const hasFactory = plugin.createEvaluator !== undefined;
  const hasCollectRun = typeof plugin.collect?.run === "function";
  const hasFoldRun = typeof plugin.fold?.run === "function";

  if (hasFactory) {
    if (typeof plugin.createEvaluator !== "function") {
      throw new TypeError(
        `Plugin "${plugin.name}" createEvaluator must be a function when provided.`,
      );
    }
    if (plugin.collect?.run !== undefined || plugin.fold?.run !== undefined) {
      throw new TypeError(
        `Plugin "${plugin.name}" declares both an evaluator factory and stateless run callbacks.`,
      );
    }
    return Object.freeze({
      kind: "factory",
      createEvaluator: plugin.createEvaluator,
    });
  }

  if (plugin.collect !== undefined && !hasCollectRun) {
    throw new TypeError(
      `Plugin "${plugin.name}" declares collect operation without run callback or evaluator factory.`,
    );
  }
  if (plugin.fold !== undefined && !hasFoldRun) {
    throw new TypeError(
      `Plugin "${plugin.name}" declares fold operation without run callback or evaluator factory.`,
    );
  }

  return Object.freeze({
    kind: "stateless",
    ...(hasCollectRun ? { collect: plugin.collect?.run } : {}),
    ...(hasFoldRun ? { fold: plugin.fold?.run } : {}),
  });
}

const DEFAULT_CAPABILITY: PluginCapability = Object.freeze({
  chain: ANY_CHAIN,
  pole: false,
  joint: false,
});

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

  const collectOutputs: string[] = [];
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

    if (!plugin.collect && !plugin.fold) {
      throw new TypeError(
        `Plugin "${plugin.name}" must declare collect, fold, or both operations.`,
      );
    }

    if (plugin.collect?.output === "id") {
      throw new TypeError(`Plugin "${plugin.name}" collect output cannot use reserved name "id".`);
    }
    if (plugin.keys?.includes("id") || claims(plugin, "id")) {
      throw new TypeError(
        `Plugin "${plugin.name}" cannot declare or claim reserved property "id".`,
      );
    }

    const execution = validateAndDetermineExecutionStrategy(plugin);

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
    const capabilities = registry.capabilityOf?.(plugin.name) ?? DEFAULT_CAPABILITY;

    const operations: CompiledEntryOperations = Object.freeze({
      ...(plugin.collect ? { collect: Object.freeze({ output: plugin.collect.output }) } : {}),
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
      capabilities,
      execution,
      lifecycle,
    });

    entries.push(entryPlan);
    entriesById.set(entryId, entryPlan);
    entriesByKey.set(compilerKey, entryPlan);
  }

  // Cross-entry validations: collect/fold overlap and output serializer consensus
  const collectSet = new Set<string>();
  const foldSet = new Set<string>();

  for (const entryPlan of entries) {
    if (entryPlan.operations.collect !== undefined) {
      const out = entryPlan.operations.collect.output;
      if (!collectSet.has(out)) {
        collectSet.add(out);
        collectOutputs.push(out);
      }
    }
    if (entryPlan.operations.fold !== undefined) {
      for (const out of entryPlan.operations.fold.outputs) {
        if (!foldSet.has(out)) {
          foldSet.add(out);
          foldOutputs.push(out);
        }
      }
    }
  }

  for (const collectOut of collectOutputs) {
    if (foldSet.has(collectOut)) {
      throw new TypeError(
        `Cross-operation conflict: output "${collectOut}" claimed by both collect and fold operations.`,
      );
    }
  }

  for (const entryPlan of entries) {
    const declaredOutputs = [
      ...(entryPlan.operations.collect ? [entryPlan.operations.collect.output] : []),
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

  const publishedOutputs = Object.freeze([...new Set([...collectOutputs, ...foldOutputs])].sort());
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
    collectOutputs: Object.freeze(collectOutputs),
    foldOutputs: Object.freeze(foldOutputs),
    publishedOutputs,
    diagnostics: Object.freeze(diagnostics),
  });
}

export function createEntryEvaluator(
  plan: CompiledEntryPlan,
  services: EvaluatorServices,
): StatefulEvaluator {
  if (plan.execution.kind !== "factory") {
    throw new TypeError(`Entry "${plan.entryId}" does not declare a factory execution strategy.`);
  }
  const context: EvaluatorContext = Object.freeze({
    ...(plan.lifecycle.trackId !== undefined ? { trackId: plan.lifecycle.trackId } : {}),
    entryId: plan.lifecycle.entryId,
    compilerKey: plan.lifecycle.compilerKey,
    generation: plan.lifecycle.generation,
    plugin: plan.lifecycle.pluginName,
  });
  return plan.execution.createEvaluator(context, services);
}

export function assertExecutionStrategy(strategy: ExecutionStrategy): "stateless" | "factory" {
  switch (strategy.kind) {
    case "stateless":
      return "stateless";
    case "factory":
      return "factory";
    default:
      return unreachable(strategy);
  }
}
