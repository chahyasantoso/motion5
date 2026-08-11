import type { Diagnostic } from "../contract/v5";

export type PatchStatus = "ready" | "blocked" | "error";

export interface Patch {
  readonly nodeId: string;
  readonly revision: number;
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions: Readonly<Record<string, number>>;
  readonly status: PatchStatus;
  readonly diagnostics: readonly Diagnostic[];
}

export interface PatchBatch {
  readonly tick: number;
  readonly seeds: readonly string[];
  readonly patches: readonly Patch[];
  readonly diagnostics: readonly Diagnostic[];
}

export type PatchListener = (patch: Patch) => void;
export type BatchListener = (batch: PatchBatch) => void;

export interface PublishInput {
  readonly nodeId: string;
  readonly values?: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions?: Readonly<Record<string, number>>;
  readonly status: PatchStatus;
  readonly diagnostics?: readonly Diagnostic[];
}

export const REENTRANT_BATCH_MESSAGE =
  "Cannot open a patch batch while subscribers are being notified. " +
  "Queue one follow-up invalidation instead of recursing.";

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value)) deepFreeze(child, seen);
  return Object.freeze(value);
}

function sameRecord(
  a: Readonly<Record<string, unknown>>,
  b: Readonly<Record<string, unknown>>,
): boolean {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key, index) => key === bKeys[index] && Object.is(a[key], b[key]));
}

function sameDiagnostics(a: readonly Diagnostic[], b: readonly Diagnostic[]): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

function samePatch(a: Patch | undefined, b: Patch): boolean {
  return (
    a !== undefined &&
    sameRecord(a.values, b.values) &&
    Object.is(a.sourceProgress, b.sourceProgress) &&
    sameRecord(a.sourceRevisions, b.sourceRevisions) &&
    a.status === b.status &&
    sameDiagnostics(a.diagnostics, b.diagnostics)
  );
}

export class PatchRegistry {
  readonly #patches = new Map<string, Patch>();
  readonly #nodeListeners = new Map<string, Set<PatchListener>>();
  readonly #batchListeners = new Set<BatchListener>();
  #batch: Patch[] = [];
  #batchDiagnostics: Diagnostic[] = [];
  #batchTick = 0;
  #batchSeeds: string[] = [];
  #batchOpen = false;
  #notifying = false;

  get(nodeId: string): Patch | undefined {
    return this.#patches.get(nodeId);
  }

  /**
   * True only while closeBatch() is delivering a settled batch to its listeners. Callers that
   * own scheduling (the runtime) read this to queue a follow-up instead of recursing.
   */
  get notifying(): boolean {
    return this.#notifying;
  }

  beginBatch(tick: number, seeds: readonly string[]): void {
    // A subscriber running inside closeBatch() must never be able to start a nested batch:
    // the outer batch is already settled and its remaining listeners have not run yet, so a
    // nested publication would be delivered out of order.
    if (this.#notifying) throw new Error(REENTRANT_BATCH_MESSAGE);
    if (this.#batchOpen) throw new Error("A patch batch is already open.");
    this.#batchOpen = true;
    this.#batchTick = tick;
    this.#batchSeeds = [...seeds];
    this.#batch = [];
    this.#batchDiagnostics = [];
  }

  publish(input: PublishInput): Patch | undefined {
    const previous = this.#patches.get(input.nodeId);
    const candidate = {
      nodeId: input.nodeId,
      revision: (previous?.revision ?? 0) + 1,
      values: input.values ?? {},
      sourceProgress: input.sourceProgress,
      sourceRevisions: input.sourceRevisions ?? {},
      status: input.status,
      diagnostics: input.diagnostics ?? [],
    } satisfies Patch;
    if (samePatch(previous, candidate)) return undefined;
    const patch = deepFreeze(candidate);
    this.#patches.set(input.nodeId, patch);
    this.#batch.push(patch);
    this.#batchDiagnostics.push(...patch.diagnostics);
    return patch;
  }

  subscribeNode(nodeId: string, listener: PatchListener): () => void {
    const listeners = this.#nodeListeners.get(nodeId) ?? new Set<PatchListener>();
    listeners.add(listener);
    this.#nodeListeners.set(nodeId, listeners);
    return () => listeners.delete(listener);
  }

  subscribeBatch(listener: BatchListener): () => void {
    this.#batchListeners.add(listener);
    return () => this.#batchListeners.delete(listener);
  }

  closeBatch(): PatchBatch {
    if (!this.#batchOpen) throw new Error("No patch batch is open.");
    const batch = deepFreeze({
      tick: this.#batchTick,
      seeds: [...this.#batchSeeds],
      patches: [...this.#batch],
      diagnostics: [...this.#batchDiagnostics],
    }) as PatchBatch;
    const nodeListeners = new Map(this.#nodeListeners);
    const batchListeners = new Set(this.#batchListeners);
    this.#batchOpen = false;
    this.#batch = [];
    this.#batchDiagnostics = [];
    this.#batchSeeds = [];
    // A listener's own bug must not prevent other listeners from being notified, and must
    // not leave the registry's batch state inconsistent. Every listener runs regardless of
    // whether an earlier one threw; the first thrown error (if any) is rethrown only after
    // every listener has had its turn, once state is already fully settled.
    let firstError: unknown;
    let hasError = false;
    this.#notifying = true;
    try {
      for (const patch of batch.patches) {
        for (const listener of nodeListeners.get(patch.nodeId) ?? []) {
          try {
            listener(patch);
          } catch (error) {
            if (!hasError) {
              hasError = true;
              firstError = error;
            }
          }
        }
      }
      for (const listener of batchListeners) {
        try {
          listener(batch);
        } catch (error) {
          if (!hasError) {
            hasError = true;
            firstError = error;
          }
        }
      }
    } finally {
      // The notification window closes before any error leaves this method, so a caller that
      // recovers from a listener failure can immediately open the next batch.
      this.#notifying = false;
    }
    if (hasError) throw firstError;
    return batch;
  }
}
