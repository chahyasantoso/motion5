import type { Diagnostic, Patch, PatchBatch, PatchListener, PatchStatus } from "../contract/v5";
import { equalValues } from "../domain/values";

export type { Patch, PatchBatch, PatchListener, PatchStatus } from "../contract/v5";
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
function sameIds(a: readonly string[] | undefined, b: readonly string[] | undefined): boolean {
  if (a === undefined || b === undefined) return a === b;
  if (a.length !== b.length) return false;
  return a.every((id, index) => id === b[index]);
}
function sameDiagnostic(a: Diagnostic, b: Diagnostic): boolean {
  return (
    a.ruleId === b.ruleId &&
    a.path === b.path &&
    a.message === b.message &&
    a.severity === b.severity &&
    sameIds(a.ids, b.ids)
  );
}
function sameDiagnostics(a: readonly Diagnostic[], b: readonly Diagnostic[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((item, index) => {
    const other = b[index];
    return other !== undefined && sameDiagnostic(item, other);
  });
}
function samePatch(a: Patch | undefined, b: Patch): boolean {
  return (
    a !== undefined &&
    equalValues(a.values, b.values) &&
    Object.is(a.sourceProgress, b.sourceProgress) &&
    equalValues(a.sourceRevisions, b.sourceRevisions) &&
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
  #disposed = false;

  get(nodeId: string): Patch | undefined {
    return this.#patches.get(nodeId);
  }
  get notifying(): boolean {
    return this.#notifying;
  }
  get disposed(): boolean {
    return this.#disposed;
  }
  /** Remove retained patch for a detached node without touching subscriber identity (remount-safe). */
  remove(nodeId: string): void {
    this.#patches.delete(nodeId);
  }
  /**
   * Permanently evict a node: remove its patch AND its listener set.
   *
   * Use for adopted nodes that are destroyed and will never return. A subscriber that
   * holds the returned unsubscribe closure is already gone from its `listeners` Set;
   * deleting the map entry only frees the Set itself.
   */
  evict(nodeId: string): void {
    this.#patches.delete(nodeId);
    this.#nodeListeners.delete(nodeId);
  }
  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#patches.clear();
    this.#nodeListeners.clear();
    this.#batchListeners.clear();
    this.#batch = [];
    this.#batchDiagnostics = [];
    this.#batchSeeds = [];
    this.#batchOpen = false;
  }
  beginBatch(tick: number, seeds: readonly string[]): void {
    if (this.#disposed) return;
    if (this.#notifying) throw new Error(REENTRANT_BATCH_MESSAGE);
    if (this.#batchOpen) throw new Error("A patch batch is already open.");
    this.#batchOpen = true;
    this.#batchTick = tick;
    this.#batchSeeds = [...seeds];
    this.#batch = [];
    this.#batchDiagnostics = [];
  }
  publish(input: PublishInput): Patch | undefined {
    if (this.#disposed) return undefined;
    const previous = this.#patches.get(input.nodeId);
    const readyValues = input.values ?? previous?.values ?? {};
    const readyProgress =
      input.values === undefined && input.status !== "ready"
        ? (previous?.sourceProgress ?? input.sourceProgress)
        : input.sourceProgress;
    const readyRevisions =
      input.values === undefined && input.status !== "ready"
        ? (previous?.sourceRevisions ?? input.sourceRevisions ?? {})
        : (input.sourceRevisions ?? {});
    const candidate = {
      nodeId: input.nodeId,
      revision: (previous?.revision ?? 0) + 1,
      values: readyValues,
      sourceProgress: readyProgress,
      sourceRevisions: readyRevisions,
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
    const nodeListeners = new Map<string, readonly PatchListener[]>(
      [...this.#nodeListeners].map(([nodeId, listeners]): [string, readonly PatchListener[]] => [
        nodeId,
        [...listeners],
      ]),
    );
    const batchListeners: readonly BatchListener[] = [...this.#batchListeners];
    this.#batchOpen = false;
    this.#batch = [];
    this.#batchDiagnostics = [];
    this.#batchSeeds = [];
    let firstError: unknown;
    let hasError = false;
    this.#notifying = true;
    try {
      for (const patch of batch.patches)
        for (const listener of nodeListeners.get(patch.nodeId) ?? [])
          try {
            listener(patch);
          } catch (error) {
            if (!hasError) {
              hasError = true;
              firstError = error;
            }
          }
      for (const listener of batchListeners)
        try {
          listener(batch);
        } catch (error) {
          if (!hasError) {
            hasError = true;
            firstError = error;
          }
        }
    } finally {
      this.#notifying = false;
    }
    if (hasError) throw firstError;
    return batch;
  }
}
