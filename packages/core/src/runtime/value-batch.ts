import type { Diagnostic, PatchBatch } from "../contract/v5";

export const DEFERRED_VALUE_BATCH_RULE = "value-batch-deferred";

/**
 * The batch a value verb answers while one is open: its own seed, no patches, one warning.
 *
 * The shape is `GraphRuntime`'s own `deferredBatch` under `reentrant-flush-deferred`, reused rather
 * than reinvented, because the answer a caller needs is identical: a publication was asked for, it
 * did not happen here, and this is the seed it will happen for. Owned by `ProjectRuntime` rather
 * than by `GraphRuntime` and given a rule id of its own, because the condition is different: that
 * one is a flush asked for while subscribers are being notified, and this one is a write inside a
 * batch the caller opened on purpose. Two conditions with one rule id would be one diagnostic a
 * consumer cannot branch on.
 *
 * Seeded rather than empty, because the seed is the one thing a caller can still act on: it names
 * the node whose publication is owed. `tick` carries the sequence the graph is still on, so a
 * consumer comparing it against the batch the enclosing `values()` answers can see that no
 * publication happened in between. See ADR-078.
 */
export function deferredValueBatch(sequence: number, seeds: readonly string[]): PatchBatch {
  const ids = Object.freeze([...seeds]);
  const diagnostic: Diagnostic = Object.freeze({
    ruleId: DEFERRED_VALUE_BATCH_RULE,
    path: "value-batch",
    message:
      "A value write inside an open batch staged its seed; the batch publishes once when the recipe returns.",
    severity: "warning",
    ids,
  });
  return Object.freeze({
    tick: sequence,
    seeds: ids,
    patches: Object.freeze([]),
    diagnostics: Object.freeze([diagnostic]),
  }) as PatchBatch;
}
/**
 * The batch a recipe that staged nothing answers.
 *
 * No diagnostic, deliberately: nothing was queued and nothing was skipped, so there is nothing to
 * report. A recipe that staged nothing publishes nothing at all, on ADR-064's rule that an empty
 * seed list costs a whole publication rather than a cheap one, and this is what the call answers
 * instead of a publication it declined to make.
 */
export function emptyValueBatch(sequence: number): PatchBatch {
  return Object.freeze({
    tick: sequence,
    seeds: Object.freeze([]),
    patches: Object.freeze([]),
    diagnostics: Object.freeze([]),
  }) as PatchBatch;
}
