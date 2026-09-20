import type {
  BlockedPatch,
  DestroyedPatch,
  Diagnostic,
  ErrorPatch,
  LivePatch,
  Patch,
  PatchBatch,
  PatchListener,
  ReadyPatch,
} from "../contract/v5";
import { equalValues } from "../domain/values";
import { collect, report } from "../domain/completion";
import { unreachable } from "../domain/exhaustive";
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

/**
 * One publication of a node that composed: the pose, and what it was measured against.
 *
 * `values` is required, which is the input half of ADR-098. It was optional, and omitting it asked
 * the registry to carry the previous patch's values forward at every status, which is the asymmetry
 * issue #450's acceptance criterion missed. A caller with no values has not composed, so it publishes
 * a refusal below rather than a ready patch with a member left out.
 */
export interface ReadyPublishInput {
  readonly nodeId: string;
  readonly status: "ready";
  readonly values: Readonly<Record<string, unknown>>;
  readonly sourceProgress: number;
  readonly sourceRevisions?: Readonly<Record<string, number>>;
  readonly diagnostics?: readonly Diagnostic[];
}

/**
 * One publication of a node that did not compose: which refusal it is, and what it refuses under.
 *
 * One input shape for the two statuses, where the read side keeps `BlockedPatch` and `ErrorPatch` as
 * two variants. That is not an inconsistency. A reader narrows on `status` to decide what it may
 * read, so each variant has to be nameable; a caller already knows which of the two it is publishing
 * and the status is the only thing that differs, so mirroring the read side here would be one
 * declaration per literal and no question answered.
 *
 * There is no `sourceProgress`, and its absence is the point: the publisher passed `0` at both
 * statuses, which is a placeholder rather than a measurement, and the registry then overwrote it with
 * the previous patch's progress anyway.
 *
 * `diagnostics` stays optional rather than becoming required. Requiring a reason on a refusal is a
 * real refinement and a different one: it is a refusal this slice would be introducing, it owes a
 * failing case of its own, and it is not what issue #450 asks for. Owed rather than taken in passing.
 */
export interface RefusedPublishInput {
  readonly nodeId: string;
  readonly status: "blocked" | "error";
  readonly diagnostics?: readonly Diagnostic[];
}

/**
 * What a caller may ask this registry to publish, and the reason `destroyed` is not in it.
 *
 * The flat input declared `status: PatchStatus`, so `publish({ status: "destroyed" })` typechecked and
 * minted a terminal patch from the outside, past `#notifyTerminal`, which is the one owner of
 * destruction on the wire. Mirroring the read side stopped that being expressible: eviction is the
 * only producer of a `DestroyedPatch`, and the type says so now rather than a convention.
 */
export type PublishInput = ReadyPublishInput | RefusedPublishInput;

export const REENTRANT_BATCH_MESSAGE =
  "Cannot open a patch batch while subscribers are being notified. " +
  "Queue one follow-up invalidation instead of recursing.";

/**
 * The error one refused opening throws, and the one place these two messages are spelled.
 *
 * Which of them a phase earns is `opening`'s decision, in `registry-phase.ts`, because it is a
 * question about the phase. What the refusal reads like is this class's, because these are its
 * messages and callers anchor on them.
 */
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
/** The pose two ready patches carry, and the only payload comparison left in this module. */
function samePayload(a: ReadyPatch, b: ReadyPatch): boolean {
  return (
    equalValues(a.values, b.values) &&
    Object.is(a.sourceProgress, b.sourceProgress) &&
    equalValues(a.sourceRevisions, b.sourceRevisions)
  );
}
/**
 * Whether a candidate says anything the retained patch does not, which is what suppresses a
 * republication.
 *
 * Restructured rather than narrowed in place. It compared all five payload members at every status,
 * which only typechecked while every status declared all five; with the payload on one variant it has
 * to read the discriminant, and TypeScript will not correlate two independently narrowed operands, so
 * the ready comparison is reached through one discriminant read and one equality against it rather
 * than through two narrowings the compiler treats as unrelated.
 *
 * Both operands are the live union, because `#patches` never holds a destroyed patch: `evict` deletes
 * a node's entry before it delivers the terminal one, and nothing else writes that map.
 *
 * The switch is exhaustive rather than a chain ending in a ternary, so a fifth live status fails
 * `typecheck` here instead of being answered by whichever arm happened to be written last. See
 * ADR-092.
 */
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
/**
 * The patch one publication becomes, and the one place a status decides what it carries.
 *
 * Three arms rather than three carry-forward expressions. The deleted ones read `previous?.values`,
 * `previous?.sourceProgress` and `previous?.sourceRevisions`, and they were asymmetric in a way
 * nothing stated and nothing tested: `values` carried forward whenever the caller omitted it, at every
 * status, while the other two carried forward only when values were omitted and the status was not
 * ready. So a blocked publication republished the last good pose, the last progress and the last
 * source revisions, and a subscriber reading `values` on a blocked patch was reading a real answer for
 * as long as the member existed. That pose is `lastReady`'s now.
 *
 * Nothing here reads `previous` except the revision, which is identity rather than payload, so a
 * publication no longer depends on what the last one happened to carry. See ADR-098.
 */
function candidateOf(input: PublishInput, revision: number): LivePatch {
  switch (input.status) {
    case "ready":
      return {
        nodeId: input.nodeId,
        revision,
        status: "ready",
        values: input.values,
        sourceProgress: input.sourceProgress,
        sourceRevisions: input.sourceRevisions ?? {},
        diagnostics: input.diagnostics ?? [],
      } satisfies ReadyPatch;
    // Both refusals written rather than one reaching its shape through the other's declaration, which
    // is the shape slice 1's retention cases already ship.
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
  // Both maps hold the live union rather than `Patch`: `evict` deletes a node's entry before it
  // delivers the terminal patch, so a destroyed patch is never readable back out of either one.
  readonly #patches = new Map<string, LivePatch>();
  readonly #lastReady = new Map<string, ReadyPatch>();
  readonly #nodeListeners = new Map<string, Set<PatchListener>>();
  readonly #batchListeners = new Set<BatchListener>();
  #phase: RegistryPhase = REGISTRY_IDLE;

  get(nodeId: string): Patch | undefined {
    return this.#patches.get(nodeId);
  }
  /**
   * The last patch this node published as `ready`, or nothing if it never published one.
   *
   * Retention is this registry's question rather than a field on a patch that is about something
   * else, and that is the decision slice 1 of #450 owed. A blocked or errored node has no pose of
   * its own; the pose a consumer still wants to render is the last good one, which belongs to an
   * earlier `ready` publication together with the progress and the source revisions measured with
   * it. Carrying those forward onto a blocked patch, which is what `publish` below did until the
   * source half of this slice, made that patch say `blocked` while holding values no blocked
   * evaluation produced. ADR-098 has now deleted all three from every non-ready variant, so this
   * member is where the answer moved rather than where it was lost, and a consumer rendering the last
   * good pose keeps reading a real one.
   *
   * It answers `ReadyPatch | undefined` rather than `Patch | undefined`, which is the narrowing slice
   * 1 named as owed and could not take: the map is written only under `patch.status === "ready"`, and
   * a consumer asking for the last pose should not need a second narrowing to read `values`.
   *
   * What it answers is the frozen patch that was published rather than a copy of it, so identity
   * still tells a reader whether anything moved. A republication the registry suppressed is not a
   * publication and cannot move it, and a status that owns no pose cannot replace one. Unmount,
   * eviction and disposal all drop it, because a node with no retained patch has no last pose
   * either: a remount reading a pose from before it was detached would be reading exactly the
   * staleness `remove` exists to clear.
   */
  lastReady(nodeId: string): ReadyPatch | undefined {
    return this.#lastReady.get(nodeId);
  }
  get notifying(): boolean {
    return isNotifying(this.#phase);
  }
  get disposed(): boolean {
    return isDisposed(this.#phase);
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
    this.#lastReady.delete(nodeId);
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
  /**
   * Deliver the single terminal patch for a node that is being destroyed.
   *
   * Out of band on purpose. Eviction happens during a graph mutation, not inside a flush, so
   * this must not open a batch (it would collide with an in-flight one) and must not reach
   * batch subscribers, whose contract is "one flush produced exactly these patches". Listener
   * failures are swallowed because destruction cannot be allowed to fail halfway through and
   * leave the graph and the wire disagreeing about whether the node still exists.
   */
  #notifyTerminal(nodeId: string, previous: LivePatch, listeners: Set<PatchListener>): void {
    // Identity and the status, and nothing else. The four members this built empty were a payload a
    // reader narrows into to find `{}`, `0`, `{}` and `[]`: a node that will never publish again has
    // no pose, and nothing to refuse under either. See ADR-098.
    const terminal = deepFreeze({
      nodeId,
      revision: previous.revision + 1,
      status: "destroyed",
    } satisfies DestroyedPatch);
    // The notification this delivery interrupted is restored rather than assumed to have been none,
    // which is why every phase carries one: an eviction reached from inside a notification leaves
    // that notification running, and one reached while a batch is open leaves the batch open.
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
    // One assignment, because the batch a retired registry may not answer left with the variant that
    // owned it. Four fields were emptied here by hand and a fifth was the flag saying they had been.
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
      // One assignment opens the batch, because the tick, the seeds and both buffers arrive with the
      // variant that owns them rather than as four fields beside a flag.
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
    // Read off the accepted publication rather than off the input, so a republication this member
    // suppressed above cannot move what is retained, and a status owning no pose cannot replace one.
    if (patch.status === "ready") this.#lastReady.set(input.nodeId, patch);
    retain(phase, patch);
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
  /**
   * Publishes one batch to every subscriber, then answers it.
   *
   * Delivery is the ordered-steps mechanism `domain/completion` owns rather than a fourth hand-rolled
   * copy of it, and that changes the two-failure case and only that case. One subscriber failure is
   * still rethrown by identity; two are now one `AggregateError` carrying both in the order they
   * happened rather than the first with the second discarded. ADR-071 states that rule for every phase
   * that has no inverse, and a notification is one: nothing here can be retried, and a failure no
   * caller ever sees is a failure nobody fixes. Issue #443, phase B step 10.
   */
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
    // Node subscribers in patch order, then batch subscribers, which is the order this member has
    // always delivered in and the order the collector preserves.
    const steps: (() => void)[] = [];
    for (const patch of batch.patches)
      for (const listener of nodeListeners.get(patch.nodeId) ?? [])
        steps.push(() => listener(patch));
    for (const listener of batchListeners) steps.push(() => listener(batch));
    // One assignment closes the batch and raises the notification, because the tick, the seeds and
    // both buffers left with the variant that owned them.
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
