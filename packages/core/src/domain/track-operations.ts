import {
  type AuthoredEntryId,
  type CompilerEntryKey,
  type GenerationToken,
  type PluginName,
} from "../contract/address";
import { unreachable } from "../lang/exhaustive";
import type {
  CompiledEntryPlan,
  EvaluatorContext,
  EvaluatorServices,
  LocalEvaluation,
  LocalEvaluationContext,
  StatefulEvaluator,
  TrackExecutionPlan,
} from "./execution-plan";
import { createEntryEvaluator } from "./execution-plan";
import { DEFAULT_CACHE_PROVIDER } from "./cache-providers";
import type { PreparedTrack } from "./track-preparation";
import type { RequirementInputs } from "./plugins";
import { CompositionOutputError } from "./track";
import { freezeValue, type ImmutableRecord } from "./values";
import { COLLECT_OUTPUT } from "../contract/collect";

export type { LocalEvaluation, LocalEvaluationContext };

export interface ExecuteTrackOperationsOptions {
  readonly plan: TrackExecutionPlan;
  readonly sampleValues: ReadonlyMap<string, Readonly<Record<string, unknown>>>;
  readonly requirementInputs?: RequirementInputs | undefined;
  readonly progress?: number | undefined;
  readonly services?: EvaluatorServices | undefined;
  readonly committedStates?: ReadonlyMap<string, unknown> | undefined;
  readonly evaluators?: ReadonlyMap<string, StatefulEvaluator> | undefined;
}

export interface TrackOperationsResult {
  readonly publishedValues: Readonly<Record<string, unknown>>;
  readonly proposedStates: ReadonlyMap<string, unknown>;
  readonly evaluators: ReadonlyMap<string, StatefulEvaluator>;
}

export interface TrackEvaluationBatchItem extends ExecuteTrackOperationsOptions {
  readonly trackId: string;
}

export interface TrackEvaluationBatchResult {
  readonly publishedByTrack: ReadonlyMap<string, Readonly<Record<string, unknown>>>;
  readonly proposedStates: ReadonlyMap<string, unknown>;
  readonly evaluators: ReadonlyMap<string, StatefulEvaluator>;
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
  const inputs =
    (requirementInputs?.[entry.entryId] as Readonly<Record<string, unknown>> | undefined) ??
    (requirementInputs?.[entry.plugin.name] as Readonly<Record<string, unknown>> | undefined) ??
    Object.freeze({});

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

export function executeTrackOperations(
  options: ExecuteTrackOperationsOptions,
): TrackOperationsResult {
  const {
    plan,
    sampleValues,
    requirementInputs,
    progress = 0,
    services,
    committedStates,
    evaluators,
  } = options;

  const collected: Array<Readonly<Record<string, unknown>>> = [];

  let currentFold: Readonly<Record<string, unknown>> = Object.freeze({});
  const proposedStates = new Map<string, unknown>();
  const activeEvaluators = new Map<string, StatefulEvaluator>(evaluators);

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
      case "factory": {
        let evaluator = activeEvaluators.get(entry.compilerKey);
        if (evaluator === undefined) {
          const effectiveServices: EvaluatorServices = {
            cache: services?.cache ?? DEFAULT_CACHE_PROVIDER,
            ...(services ?? {}),
          };
          evaluator = createEntryEvaluator(entry, effectiveServices);
          activeEvaluators.set(entry.compilerKey, evaluator);
        }
        const committedState =
          committedStates?.get(entry.compilerKey) ?? committedStates?.get(entry.entryId);
        const prepResult = evaluator.prepare(local, committedState);
        if (!isPlainRecord(prepResult) || !Object.hasOwn(prepResult, "prepared")) {
          throw new CompositionOutputError(
            `Evaluator prepare for entry "${entry.entryId}" must return { prepared, proposedState }.`,
          );
        }
        let finalProposedState = prepResult.proposedState;

        if (entry.operations.collect === true) {
          if (typeof evaluator.collect !== "function") {
            throw new TypeError(`Evaluator for entry "${entry.entryId}" missing collect method.`);
          }
          const collectRecord = evaluator.collect(prepResult.prepared);
          executeCollectOperation(entry.entryId, collectRecord, collected);
        }

        if (entry.operations.fold) {
          if (typeof evaluator.fold !== "function") {
            throw new TypeError(`Evaluator for entry "${entry.entryId}" missing fold method.`);
          }
          const foldResult = evaluator.fold(prepResult.prepared, currentFold);
          if (!isPlainRecord(foldResult) || !Object.hasOwn(foldResult, "delta")) {
            throw new CompositionOutputError(
              `Evaluator fold for entry "${entry.entryId}" must return { delta, proposedState }.`,
            );
          }
          finalProposedState = foldResult.proposedState;
          currentFold = executeFoldOperation(
            entry.entryId,
            entry.operations.fold.outputs,
            foldResult.delta,
            currentFold,
          );
        }

        proposedStates.set(entry.compilerKey, finalProposedState);
        break;
      }
      default:
        unreachable(strategy);
    }
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
    evaluators: Object.freeze(activeEvaluators),
  });
}

export function evaluatePreparedTrack(
  prepared: PreparedTrack,
  options?: {
    readonly requirementInputs?: RequirementInputs | undefined;
    readonly progress?: number | undefined;
    readonly services?: EvaluatorServices | undefined;
    readonly committedStates?: ReadonlyMap<string, unknown> | undefined;
    readonly evaluators?: ReadonlyMap<string, StatefulEvaluator> | undefined;
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
    evaluators: options?.evaluators,
  });
}

export function executeTrackOperationsBatch(
  items: readonly TrackEvaluationBatchItem[],
): TrackEvaluationBatchResult {
  const stagedOutputs = new Map<string, Readonly<Record<string, unknown>>>();
  const stagedStates = new Map<string, unknown>();
  const allEvaluators = new Map<string, StatefulEvaluator>();

  for (const item of items) {
    const result = executeTrackOperations(item);
    stagedOutputs.set(item.trackId, result.publishedValues);
    for (const [key, state] of result.proposedStates) {
      stagedStates.set(key, state);
    }
    for (const [key, ev] of result.evaluators) {
      allEvaluators.set(key, ev);
    }
  }

  return Object.freeze({
    publishedByTrack: Object.freeze(stagedOutputs),
    proposedStates: Object.freeze(stagedStates),
    evaluators: Object.freeze(allEvaluators),
  });
}
