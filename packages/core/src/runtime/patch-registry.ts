import type {
  BlockedPatch,
  DestroyedPatch,
  Diagnostic,
  ErrorPatch,
  LivePatch,
  Outputs,
  Patch,
  PatchBatch,
  PatchListener,
  ReadyPatch,
} from "../contract/v5";
import { equalValues } from "../domain/values";
import { collect, report } from "../domain/completion";
import { unreachable } from "../lang/exhaustive";
import {
  REGISTRY_IDLE,
  closed,
  isDisposed,
  isNotifying,
  notificationOf,
  openBatch,
  opening,
  retain,
  retired,
  withNotification,
  type BatchRefusal,
  type RegistryPhase,
} from "./registry-phase";

export type {
  BlockedPatch,
  DestroyedPatch,
  ErrorPatch,
  LivePatch,
  Patch,
  PatchBatch,
  PatchListener,
  PatchStatus,
  ReadyPatch,
} from "../contract/v5";
export type BatchListener = (batch: PatchBatch) => void;

/** The live patch a delivered one stands for, or nothing when it says the node is gone. */
export function liveOrAbsent(patch: Patch): LivePatch | undefined {
  switch (patch.status) {
    case "ready":
    case "blocked":
    case "error":
      return patch;
    case "destroyed":
      return undefined;
    default:
      return unreachable(patch);
  }
}

/** One publication that composed: the pose and what it was measured against. */
export interface ReadyPublishInput {
  readonly nodeId: string;
  readonly status: "ready";
  readonly outputs: Outputs;
  readonly sourceProgress: number;
  readonly sourceRevisions?: Readonly<Record<string, number>>;
  readonly diagnostics?: readonly Diagnostic[];
}

/** One publication that did not compose: the refusal and what it refuses under. */
export interface RefusedPublishInput {
  readonly nodeId: string;
  readonly status: "blocked" | "error";
  readonly diagnostics?: readonly Diagnostic[];
}

/** What a caller may publish; eviction alone produces a `destroyed` patch. */
export type PublishInput = ReadyPublishInput | RefusedPublishInput;

export const REENTRANT_BATCH_MESSAGE =
  "Cannot open a patch batch while subscribers are being notified. " +
  "Queue one follow-up invalidation instead of recursing.";

function batchRefusal(reason: BatchRefusal): Error {
  switch (reason) {
    case "notifying":
      return new Error(REENTRANT_BATCH_MESSAGE);
    case "open":
      return new Error("A patch batch is already open.");
    default:
      return unreachable(reason);
  }
}

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
function samePayload(a: ReadyPatch, b: ReadyPatch): boolean {
  return (
    equalValues(a.outputs, b.outputs) &&
    Object.is(a.sourceProgress, b.sourceProgress) &&
    equalValues(a.sourceRevisions, b.sourceRevisions)
  );
}
/** Whether a candidate changes the retained patch; equal means publish suppresses it. */
function samePatch(a: LivePatch | undefined, b: LivePatch): boolean {
  if (a === undefined) return false;
  if (!sameDiagnostics(a.diagnostics, b.diagnostics)) return false;
  switch (b.status) {
    case "ready":
      return a.status === "ready" && samePayload(a, b);
    case "blocked":
    case "error":
      return a.status === b.status;
    default:
      return unreachable(b);
  }
}
/** The patch one publication becomes; the status alone decides what it carries. */
function candidateOf(input: PublishInput, revision: number): LivePatch {
  switch (input.status) {
    case "ready":
      return {
        nodeId: input.nodeId,
        revision,
        status: "ready",
        outputs: input.outputs,
        sourceProgress: input.sourceProgress,
        sourceRevisions: input.sourceRevisions ?? {},
        diagnostics: input.diagnostics ?? [],
      } satisfies ReadyPatch;
    case "blocked":
      return {
        nodeId: input.nodeId,
        revision,
        status: "blocked",
        diagnostics: input.diagnostics ?? [],
      } satisfies BlockedPatch;
    case "error":
      return {
        nodeId: input.nodeId,
        revision,
        status: "error",
        diagnostics: input.diagnostics ?? [],
      } satisfies ErrorPatch;
    default:
      return unreachable(input);
  }
}

export class PatchRegistry {
  // Both maps hold the live union: `evict` deletes before the terminal patch lands.
  readonly #patches = new Map<string, LivePatch>();
  readonly #lastReady = new Map<string, ReadyPatch>();
  readonly #nodeListeners = new Map<string, Set<PatchListener>>();
  readonly #batchListeners = new Set<BatchListener>();
  #phase: RegistryPhase = REGISTRY_IDLE;

  /** The patch this node last published, or nothing if it published none or is gone. */
  get(nodeId: string): LivePatch | undefined {
    return this.#patches.get(nodeId);
  }
  /**
   * The last `ready` patch this node published, or nothing if it published none.
   * The published patch itself, not a copy, so identity shows whether anything moved. */
  lastReady(nodeId: string): ReadyPatch | undefined {
    return this.#lastReady.get(nodeId);
  }
  get notifying(): boolean {
    return isNotifying(this.#phase);
  }
  get disposed(): boolean {
    return isDisposed(this.#phase);
  }
  /** Drops a detached node's retained patch without touching subscribers, so remount is safe. */
  remove(nodeId: string): void {
    this.#patches.delete(nodeId);
    this.#lastReady.delete(nodeId);
  }
  /**
   * Evict a node: drop what it retained, then deliver one terminal patch to its subscribers.
   * A non-empty listener Set survives; its closures resolve it at call time. */
  evict(nodeId: string): void {
    if (isDisposed(this.#phase)) return;
    const previous = this.#patches.get(nodeId);
    this.#patches.delete(nodeId);
    this.#lastReady.delete(nodeId);
    const listeners = this.#nodeListeners.get(nodeId);
    if (listeners === undefined || listeners.size === 0) {
      this.#nodeListeners.delete(nodeId);
      return;
    }
    if (previous !== undefined) this.#notifyTerminal(nodeId, previous, listeners);
  }
  /** Delivers one terminal patch out of band: no batch opened, no batch listener reached. */
  #notifyTerminal(nodeId: string, previous: LivePatch, listeners: Set<PatchListener>): void {
    const terminal = deepFreeze({
      nodeId,
      revision: previous.revision + 1,
      status: "destroyed",
    } satisfies DestroyedPatch);
    const interrupted = notificationOf(this.#phase);
    this.#phase = withNotification(this.#phase, "notifying");
    try {
      for (const listener of [...listeners])
        try {
          listener(terminal);
        } catch {
          /* destruction completes regardless of subscriber failures */
        }
    } finally {
      this.#phase = withNotification(this.#phase, interrupted);
    }
  }
  dispose(): void {
    if (isDisposed(this.#phase)) return;
    this.#phase = retired(this.#phase);
    this.#patches.clear();
    this.#lastReady.clear();
    this.#nodeListeners.clear();
    this.#batchListeners.clear();
  }
  beginBatch(tick: number, seeds: readonly string[]): void {
    const opened = opening(this.#phase, tick, seeds);
    switch (opened.kind) {
      case "ignore":
        return;
      case "refuse":
        throw batchRefusal(opened.reason);
      case "collect":
        this.#phase = opened.phase;
        return;
      default:
        return unreachable(opened);
    }
  }
  publish(input: PublishInput): LivePatch | undefined {
    const phase = this.#phase;
    if (isDisposed(phase)) return undefined;
    const previous = this.#patches.get(input.nodeId);
    const candidate = candidateOf(input, (previous?.revision ?? 0) + 1);
    if (samePatch(previous, candidate)) return undefined;
    const patch = deepFreeze(candidate);
    this.#patches.set(input.nodeId, patch);
    // Read off the accepted patch, so a suppressed republication cannot move retention.
    if (patch.status === "ready") this.#lastReady.set(input.nodeId, patch);
    retain(phase, patch);
    return patch;
  }
  subscribeNode(nodeId: string, listener: PatchListener): () => void {
    const listeners = this.#nodeListeners.get(nodeId) ?? new Set<PatchListener>();
    listeners.add(listener);
    this.#nodeListeners.set(nodeId, listeners);
    // Resolves the Set from the map at call time, never a captured one.
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
  /** Publishes one batch to every subscriber, then answers it. */
  closeBatch(): PatchBatch {
    const open = openBatch(this.#phase);
    if (open === undefined) throw new Error("No patch batch is open.");
    const batch = deepFreeze({
      tick: open.tick,
      seeds: [...open.seeds],
      patches: [...open.patches],
      diagnostics: [...open.diagnostics],
    }) as PatchBatch;
    const nodeListeners = new Map<string, readonly PatchListener[]>(
      [...this.#nodeListeners].map(([nodeId, listeners]): [string, readonly PatchListener[]] => [
        nodeId,
        [...listeners],
      ]),
    );
    const batchListeners: readonly BatchListener[] = [...this.#batchListeners];
    // Node subscribers in patch order, then batch subscribers.
    const steps: (() => void)[] = [];
    for (const patch of batch.patches)
      for (const listener of nodeListeners.get(patch.nodeId) ?? [])
        steps.push(() => listener(patch));
    for (const listener of batchListeners) steps.push(() => listener(batch));
    this.#phase = withNotification(closed(this.#phase), "notifying");
    let failures: readonly unknown[] = [];
    try {
      failures = collect(steps);
    } finally {
      this.#phase = withNotification(this.#phase, "quiet");
    }
    report(failures, "Patch batch notification failed.");
    return batch;
  }
}
