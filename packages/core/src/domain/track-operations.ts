import {
  type AuthoredEntryId,
  type CompilerEntryKey,
  type GenerationToken,
  type PluginName,
} from "../contract/address";
import { unreachable } from "../lang/exhaustive";
import type {
  CompiledEntryPlan,
  EvaluatorServices,
  LocalEvaluation,
  LocalEvaluationContext,
  TrackExecutionPlan,
} from "./execution-plan";
import { entryEvaluatorContext } from "./execution-plan";
import { DEFAULT_CACHE_PROVIDER } from "./cache-providers";
import type { PreparedTrack } from "./track-preparation";
import type { PluginComposer, RequirementInputs } from "./plugins";
import { CompositionOutputError } from "./composition-error";
import { freezeValue, type ImmutableRecord, type ImmutableValue } from "./values";
import { publishableValues } from "./publication";
import { COLLECT_OUTPUT } from "../contract/collect";

export type { LocalEvaluation, LocalEvaluationContext };

/**
 * One private state a candidate produced, tagged with where it came from.
 *
 * `continued` means the entry already had a committed state and this value derives from it, so the
 * two may share resources and disposing this one would release what the committed one still holds.
 * `initialized` means `init` ran in this candidate; the state belongs to the candidate alone.
 * See `docs/skeldata/LIFECYCLE.md` §4.3.
 */
export type ProposedEntryState =
  | { readonly origin: "continued"; readonly state: unknown }
  | { readonly origin: "initialized"; readonly state: unknown };

/**
 * The one chain of not-yet-migrated compose plugins a track evaluates through.
 *
 * The order is the resolved plugin chain's order, which is the order `Track.composeFrom` used. The
 * executor is handed it rather than deriving one from plan entries, because entries are authored
 * order and the resolved chain is not. F2 deletes this type with the legacy compose channel.
 */
export interface LegacyComposeChain {
  readonly nodeId: string;
  readonly plugins: readonly {
    readonly name: string;
    readonly compose: PluginComposer;
  }[];
  readonly internalKeys: readonly string[];
}

export interface ExecuteTrackOperationsOptions {
  readonly plan: TrackExecutionPlan;
  readonly sampleValues: ReadonlyMap<string, Readonly<Record<string, unknown>>>;
  /**
   * The track's pre-plugin value domain, as `Track.composeFrom` received it.
   *
   * Only `legacy-compose` reads it: the legacy chain replaces a running record and has no
   * per-entry local values to slice. F2 deletes the field with that strategy.
   */
  readonly seed?: Readonly<ImmutableRecord> | undefined;
  readonly legacyCompose?: LegacyComposeChain | undefined;
  readonly requirementInputs?: RequirementInputs | undefined;
  readonly progress?: number | undefined;
  readonly services?: EvaluatorServices | undefined;
  readonly committedStates?: ReadonlyMap<CompilerEntryKey, unknown> | undefined;
}

/**
 * This track's interpolated, plugin-composed output at a given progress.
 *
 * Defined here because it is the element type of TrackCandidate. track.ts re-exports it so
 * existing callers see no import change. Neither type depends on the Track class itself.
 */
export interface TrackSnapshot {
  readonly progress: number;
  readonly values: Readonly<Record<string, unknown>>;
}

export interface TrackOperationsResult {
  readonly publishedValues: Readonly<Record<string, unknown>>;
  readonly proposedStates: ReadonlyMap<CompilerEntryKey, ProposedEntryState>;
}

/**
 * The result of a Track.evaluate call: a proposed snapshot and state map, not yet committed.
 *
 * `kind: "candidate"` distinguishes this from a bare TrackSnapshot at call sites. The caller
 * passes the whole value to Track.commit unchanged; the two halves must not be separated.
 * See the C7b slice plan and track.ts §evaluate/commit.
 */
export type TrackCandidate = {
  readonly kind: "candidate";
  readonly snapshot: TrackSnapshot;
  readonly proposedStates: ReadonlyMap<CompilerEntryKey, ProposedEntryState>;
};

export interface TrackEvaluationBatchItem extends ExecuteTrackOperationsOptions {
  readonly trackId: string;
}

export interface TrackEvaluationBatchResult {
  readonly publishedByTrack: ReadonlyMap<string, Readonly<Record<string, unknown>>>;
  readonly proposedStates: ReadonlyMap<CompilerEntryKey, ProposedEntryState>;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function buildLocalEvaluation(
  plan: TrackExecutionPlan,
  entry: CompiledEntryPlan,
  sampleValues: ReadonlyMap<string, Readonly<Record<string, unknown>>>,
  requirementInputs: RequirementInputs | undefined,
  progress: number,
): LocalEvaluation {
  const values = sampleValues.get(entry.entryId) ?? Object.freeze({});
  const inputs = requirementInputs?.[entry.entryId] ?? Object.freeze({});

  const context: LocalEvaluationContext = Object.freeze({
    ...(plan.trackId !== undefined ? { trackId: plan.trackId } : {}),
    entryId: entry.entryId,
    compilerKey: entry.compilerKey,
    generation: entry.lifecycle.generation,
    plugin: entry.lifecycle.pluginName,
    progress,
  });

  return Object.freeze({
    ...values,
    values,
    inputs,
    context,
  });
}

function executeCollectOperation(
  entryId: AuthoredEntryId,
  rawRecord: unknown,
  collected: Array<Readonly<Record<string, unknown>>>,
): void {
  if (!isPlainRecord(rawRecord)) {
    throw new CompositionOutputError(
      `Collect operation for entry "${entryId}" must return a record.`,
    );
  }
  if (Object.hasOwn(rawRecord, "id") || "id" in rawRecord) {
    throw new CompositionOutputError(
      `Collect operation for entry "${entryId}" cannot supply its own id.`,
    );
  }
  collected.push(
    Object.freeze({
      ...rawRecord,
      id: entryId,
    }),
  );
}

function executeFoldOperation(
  entryId: AuthoredEntryId,
  declaredOutputs: readonly string[],
  delta: unknown,
  priorFold: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  if (!isPlainRecord(delta)) {
    throw new CompositionOutputError(
      `Fold operation for entry "${entryId}" must return a record delta.`,
    );
  }
  const declaredSet = new Set(declaredOutputs);
  for (const key of Object.keys(delta)) {
    if (!declaredSet.has(key)) {
      throw new CompositionOutputError(
        `Entry "${entryId}" returned undeclared fold output "${key}".`,
      );
    }
    const val = delta[key];
    if (val === undefined || val === null) {
      throw new CompositionOutputError(
        `Fold output "${key}" of entry "${entryId}" cannot be null or undefined.`,
      );
    }
    if (typeof val === "number" && !Number.isFinite(val)) {
      throw new CompositionOutputError(
        `Fold output "${key}" of entry "${entryId}" must be a finite number.`,
      );
    }
  }
  return Object.freeze({
    ...priorFold,
    ...delta,
  });
}

/** The legacy chain's seed: the caller's record, or every local value when none was handed over. */
function legacySeed(
  seed: Readonly<ImmutableRecord> | undefined,
  sampleValues: ReadonlyMap<string, Readonly<Record<string, unknown>>>,
): Readonly<ImmutableRecord> {
  if (seed !== undefined) return seed;
  const merged: Record<string, unknown> = {};
  for (const values of sampleValues.values()) Object.assign(merged, values);
  return freezeValue(merged as ImmutableRecord);
}

/**
 * Rebuilds one legacy plugin's scoped input record from entry-keyed inputs.
 *
 * The plugin-name lookup is the old scoping, kept only here so the quarantined members injection
 * and object-form callers keep reaching a legacy composer. F2 deletes it with the strategy.
 */
function legacyInputs(
  pluginName: string,
  plan: TrackExecutionPlan,
  requirementInputs: RequirementInputs | undefined,
): Readonly<ImmutableRecord> {
  if (requirementInputs === undefined) return Object.freeze({});
  const scoped: Record<string, ImmutableValue> = {};
  for (const entry of plan.entries) {
    if (entry.plugin.name !== pluginName) continue;
    const entryInputs = requirementInputs[entry.entryId];
    if (entryInputs !== undefined) Object.assign(scoped, entryInputs);
  }
  const byPluginName = requirementInputs[pluginName];
  if (byPluginName !== undefined) Object.assign(scoped, byPluginName);
  return Object.freeze(scoped);
}

function freezeLegacy(
  values: Readonly<Record<string, unknown>>,
): Readonly<Record<string, unknown>> {
  if (!isPlainRecord(values))
    throw new CompositionOutputError("Composition output must be a renderer-neutral record.");
  try {
    return freezeValue(values as ImmutableRecord);
  } catch (error) {
    throw new CompositionOutputError(
      `Composition output is not renderer-neutral: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function disposeState(plan: TrackExecutionPlan, key: CompilerEntryKey, state: unknown): unknown {
  const entry = plan.entriesByKey.get(key);
  const execution = entry?.execution;
  if (execution?.kind !== "stateful" || execution.dispose === undefined) return undefined;
  try {
    execution.dispose(state);
    return undefined;
  } catch (error) {
    return error;
  }
}

function shouldRetireCommitted(proposal: ProposedEntryState | undefined): boolean {
  if (proposal === undefined) return true;
  const origin: ProposedEntryState["origin"] = proposal.origin;
  switch (origin) {
    case "continued":
      return false;
    case "initialized":
      return true;
    default:
      return unreachable(origin);
  }
}

/**
 * Disposes the committed generations the accepted candidate did not continue.
 *
 * Called after the output and state swap, never before: the key is retired when the candidate
 * proposed nothing for it or proposed a fresh `initialized` generation. Returns the failures so the
 * caller reports a postcommit delivery error without un-committing. See LIFECYCLE §4.3.
 */
export function disposeRetiredStates(
  plan: TrackExecutionPlan,
  retired: ReadonlyMap<CompilerEntryKey, unknown>,
  proposals: ReadonlyMap<CompilerEntryKey, ProposedEntryState>,
): readonly unknown[] {
  const failures: unknown[] = [];
  for (const [key, state] of retired) {
    if (!shouldRetireCommitted(proposals.get(key))) continue;
    const failure = disposeState(plan, key, state);
    if (failure !== undefined) failures.push(failure);
  }
  return failures;
}

/** Abandonment releases only what `init` created in this candidate; continued states are shared. */
function disposeInitialized(
  plan: TrackExecutionPlan,
  proposals: ReadonlyMap<CompilerEntryKey, ProposedEntryState>,
): readonly unknown[] {
  const failures: unknown[] = [];
  for (const [key, proposal] of proposals) {
    const origin: ProposedEntryState["origin"] = proposal.origin;
    switch (origin) {
      case "continued":
        break;
      case "initialized": {
        const failure = disposeState(plan, key, proposal.state);
        if (failure !== undefined) failures.push(failure);
        break;
      }
      default:
        unreachable(origin);
    }
  }
  return failures;
}

function abandon(
  error: unknown,
  plan: TrackExecutionPlan,
  proposals: TrackOperationsResult["proposedStates"],
): never {
  const failures = disposeInitialized(plan, proposals);
  if (failures.length === 0) throw error;
  throw new AggregateError(
    [error, ...failures],
    "Track candidate was abandoned and disposing a freshly initialized state failed.",
    { cause: error },
  );
}

export function executeTrackOperations(
  options: ExecuteTrackOperationsOptions,
): TrackOperationsResult {
  const {
    plan,
    sampleValues,
    seed,
    legacyCompose,
    requirementInputs,
    progress = 0,
    services,
    committedStates,
  } = options;

  const effectiveServices: EvaluatorServices = {
    cache: services?.cache ?? DEFAULT_CACHE_PROVIDER,
    ...(services ?? {}),
  };

  const collected: Array<Readonly<Record<string, unknown>>> = [];

  let currentFold: Readonly<Record<string, unknown>> = Object.freeze({});
  const proposedStates = new Map<CompilerEntryKey, ProposedEntryState>();
  let legacyEvaluated = false;
  let legacyValues: Readonly<ImmutableRecord> | undefined;

  try {
    for (const entry of plan.entries) {
      const local = buildLocalEvaluation(plan, entry, sampleValues, requirementInputs, progress);
      const strategy = entry.execution;

      switch (strategy.kind) {
        case "stateless": {
          if (entry.operations.collect === true) {
            if (!strategy.collect) {
              throw new TypeError(`Entry "${entry.entryId}" missing collect runner.`);
            }
            const collectRecord = strategy.collect(local, local.context);
            executeCollectOperation(entry.entryId, collectRecord, collected);
          }
          if (entry.operations.fold) {
            if (!strategy.fold) {
              throw new TypeError(`Entry "${entry.entryId}" missing fold runner.`);
            }
            const delta = strategy.fold(local, currentFold, local.context);
            currentFold = executeFoldOperation(
              entry.entryId,
              entry.operations.fold.outputs,
              delta,
              currentFold,
            );
          }
          break;
        }
        case "stateful": {
          let state: unknown;
          let origin: ProposedEntryState["origin"];
          if (committedStates?.has(entry.compilerKey) === true) {
            state = committedStates.get(entry.compilerKey);
            origin = "continued";
          } else {
            state = strategy.init(entryEvaluatorContext(entry), effectiveServices);
            if (state === undefined) {
              throw new TypeError(
                `Plugin "${entry.plugin.name}" init must return a defined state.`,
              );
            }
            origin = "initialized";
            // Recorded before `prepare`, so a throwing prepare still leaves this candidate's own
            // generation for abandonment to release rather than leaking what `init` created.
            proposedStates.set(entry.compilerKey, Object.freeze({ origin, state }));
          }
          const prepResult = strategy.prepare(local, state, effectiveServices);
          if (!isPlainRecord(prepResult) || !Object.hasOwn(prepResult, "prepared")) {
            throw new CompositionOutputError(
              `Prepare for entry "${entry.entryId}" must return { prepared, state }.`,
            );
          }
          let finalState = prepResult.state;
          // Prepare succeeded and returned a new state for an initialized entry; update the
          // proposal so abandonment from collect or fold disposes prepare's generation rather than
          // leaking it. The pre-prepare record above covered a throwing prepare; a successful
          // prepare that changed state moves ownership forward.
          if (origin === "initialized" && finalState !== undefined) {
            proposedStates.set(entry.compilerKey, Object.freeze({ origin, state: finalState }));
          }

          if (entry.operations.collect === true) {
            if (!strategy.collect) {
              throw new TypeError(`Entry "${entry.entryId}" missing collect runner.`);
            }
            const collectRecord = strategy.collect(prepResult.prepared, local.context);
            executeCollectOperation(entry.entryId, collectRecord, collected);
          }

          if (entry.operations.fold) {
            if (!strategy.fold) {
              throw new TypeError(`Entry "${entry.entryId}" missing fold runner.`);
            }
            const foldResult = strategy.fold(prepResult.prepared, currentFold, local.context);
            if (!isPlainRecord(foldResult) || !Object.hasOwn(foldResult, "delta")) {
              throw new CompositionOutputError(
                `Fold for entry "${entry.entryId}" must return { delta, state? }.`,
              );
            }
            if (foldResult.state !== undefined) {
              finalState = foldResult.state;
              // Fold returned a new state for an initialized entry; update the proposal before
              // delta validation so abandonment disposes fold's generation rather than the prior.
              if (origin === "initialized") {
                proposedStates.set(entry.compilerKey, Object.freeze({ origin, state: finalState }));
              }
            }
            currentFold = executeFoldOperation(
              entry.entryId,
              entry.operations.fold.outputs,
              foldResult.delta,
              currentFold,
            );
          }

          // Use `state` (init's or the committed generation's) when neither prepare nor fold
          // changed it so the proposal never records undefined as the committed state.
          proposedStates.set(
            entry.compilerKey,
            Object.freeze({ origin, state: finalState ?? state }),
          );
          break;
        }
        case "legacy-compose": {
          // F2 deletes this case with the legacy compose channel.
          if (legacyEvaluated) break;
          legacyEvaluated = true;
          if (legacyCompose === undefined) {
            throw new TypeError(
              `Track "${plan.trackId ?? ""}" has legacy compose entries but no resolved chain.`,
            );
          }
          let values = legacySeed(seed, sampleValues);
          for (const link of legacyCompose.plugins) {
            const scoped = legacyInputs(link.name, plan, requirementInputs);
            const composed = link.compose(values, progress, scoped, legacyCompose.nodeId);
            if (!isPlainRecord(composed))
              throw new CompositionOutputError(
                `Plugin "${link.name}" must return a renderer-neutral record.`,
              );
            values = composed;
          }
          legacyValues = publishableValues(values, legacyCompose.internalKeys);
          break;
        }
        default:
          unreachable(strategy);
      }
    }

    if (legacyValues !== undefined) {
      return Object.freeze({
        publishedValues: freezeLegacy(legacyValues),
        proposedStates: Object.freeze(new Map<CompilerEntryKey, ProposedEntryState>()),
      });
    }

    const stagedPublished: Record<string, unknown> = {};

    if (plan.collects) {
      stagedPublished[COLLECT_OUTPUT] = Object.freeze(collected);
    }

    for (const output of plan.foldOutputs) {
      if (Object.hasOwn(currentFold, output)) {
        stagedPublished[output] = currentFold[output];
      }
    }

    for (const [output, serializer] of Object.entries(plan.outputSerializers)) {
      if (Object.hasOwn(stagedPublished, output)) {
        try {
          stagedPublished[output] = serializer(stagedPublished[output]);
        } catch (error) {
          throw new CompositionOutputError(
            `Output serializer for "${output}" failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        }
      }
    }

    let publishedValues: Readonly<Record<string, unknown>>;
    try {
      publishedValues = freezeValue(stagedPublished as ImmutableRecord);
    } catch (error) {
      throw new CompositionOutputError(
        `Composition output is not renderer-neutral: ${error instanceof Error ? error.message : String(error)}`,
      );
    }

    return Object.freeze({
      publishedValues,
      proposedStates: Object.freeze(proposedStates),
    });
  } catch (error) {
    abandon(error, plan, proposedStates);
  }
}

export function evaluatePreparedTrack(
  prepared: PreparedTrack,
  options?: {
    readonly requirementInputs?: RequirementInputs | undefined;
    readonly progress?: number | undefined;
    readonly services?: EvaluatorServices | undefined;
    readonly committedStates?: ReadonlyMap<CompilerEntryKey, unknown> | undefined;
  },
): TrackOperationsResult {
  const progress = options?.progress ?? prepared.progress;
  const sampleValues = prepared.sample(progress);
  return executeTrackOperations({
    plan: prepared.plan,
    sampleValues,
    requirementInputs: options?.requirementInputs,
    progress,
    services: options?.services,
    committedStates: options?.committedStates,
  });
}

export function executeTrackOperationsBatch(
  items: readonly TrackEvaluationBatchItem[],
): TrackEvaluationBatchResult {
  const stagedOutputs = new Map<string, Readonly<Record<string, unknown>>>();
  const stagedStates = new Map<CompilerEntryKey, ProposedEntryState>();

  for (const item of items) {
    const result = executeTrackOperations(item);
    stagedOutputs.set(item.trackId, result.publishedValues);
    for (const [key, state] of result.proposedStates) {
      stagedStates.set(key, state);
    }
  }

  return Object.freeze({
    publishedByTrack: Object.freeze(stagedOutputs),
    proposedStates: Object.freeze(stagedStates),
  });
}
