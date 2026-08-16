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
  /**
   * Remove the retained patch for a detached node without touching subscriber identity
   * (remount-safe).
   *
   * Unmount is reversible and publishes no terminal patch: the node still exists in the graph
   * and may become a member again. Consumers observe absence through `get()` returning
   * `undefined` on their next read, which is exactly what a remount does.
   */
  remove(nodeId: string): void {
    this.#patches.delete(nodeId);
  }
  /**
   * Permanently evict a node: publish one terminal patch, then drop its retained patch.
   *
   * Destruction MUST be visible on the observation wire. Deleting the patch silently left the
   * node's last `"ready"` patch authoritative for every already-attached subscriber, because a
   * subscriber has no reason to re-read a source that never told it anything changed. That is
   * how a destroyed node keeps rendering its final pose forever.
   *
   * The listener Set is deliberately NOT dropped while it still holds subscribers. The
   * unsubscribe closures handed out by `subscribeNode` resolve the Set from the map at call
   * time, and discarding a live Set here would orphan every listener in it: a later
   * `subscribeNode` for the same id creates a fresh Set, so re-adoption of that node id would
   * be permanently undeliverable to anyone who subscribed before the eviction.
   */
  evict(nodeId: string): void {
    if (this.#disposed) return;
    const previous = this.#patches.get(nodeId);
    this.#patches.delete(nodeId);
    const listeners = this.#nodeListeners.get(nodeId);
    if (listeners === undefined || listeners.size === 0) {
      this.#nodeListeners.delete(nodeId);
      return;
    }
    if (previous !== undefined) this.#notifyTerminal(nodeId, previous, listeners);
  }
  /**
   * Deliver the single terminal patch for a node that is being destroyed.
   *
   * Out of band on purpose. Eviction happens during a graph mutation, not inside a flush, so
   * this must not open a batch (it would collide with an in-flight one) and must not reach
   * batch subscribers, whose contract is "one flush produced exactly these patches". Listener
   * failures are swallowed because destruction cannot be allowed to fail halfway through and
   * leave the graph and the wire disagreeing about whether the node still exists.
   */
  #notifyTerminal(nodeId: string, previous: Patch, listeners: Set<PatchListener>): void {
    const terminal = deepFreeze({
      nodeId,
      revision: previous.revision + 1,
      values: {},
      sourceProgress: 0,
      sourceRevisions: {},
      status: "destroyed",
      diagnostics: [],
    } satisfies Patch);
    const wasNotifying = this.#notifying;
    this.#notifying = true;
    try {
      for (const listener of [...listeners])
        try {
          listener(terminal);
        } catch {
          /* destruction completes regardless of subscriber failures */
        }
    } finally {
      this.#notifying = wasNotifying;
    }
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
    // The returned closure resolves the Set from the map at call time instead of capturing it.
    // An eviction between subscribe and unsubscribe must never leave this closure mutating a
    // Set that is no longer the one the registry publishes into.
    return () => {
      const current = this.#nodeListeners.get(nodeId);
      if (current === undefined) return;
      current.delete(listener);
      if (current.size === 0) this.#nodeListeners.delete(nodeId);
    };
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
