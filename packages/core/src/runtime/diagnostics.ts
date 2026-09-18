import type { Diagnostic } from "../contract/v5";

export interface DiagnosticsSnapshot {
  readonly entries: readonly Diagnostic[];
  readonly droppedCount: number;
}

const DEFAULT_CAPACITY = 500;

/**
 * The one bounded, inspection-only diagnostic surface for a project.
 *
 * Every diagnostic that already flows inline on a patch or a batch summary (load-time
 * validation, pending-reference classification from `graph/references.ts`, composition
 * failure from `GraphPublisher`, and flush-level scheduler/clock errors from `GraphRuntime`)
 * is additionally recorded here so a project has exactly one place to inspect its diagnostic
 * history, capped so a long-running project cannot leak memory. This buffer never becomes a
 * second way to be *notified* of a diagnostic: there is no subscribe/emit surface here, only
 * a bounded, read-only inspection snapshot. Patches and batches remain the one live delivery
 * path; this is retained history only, and every entry is the exact same `Diagnostic` shape
 * used everywhere else, never a parallel shape.
 *
 * Retention is a ring rather than a queue. `record` evicted with `Array.prototype.shift()`, which
 * reindexes every entry still retained, so the cheapest surface in this folder cost O(n) per
 * diagnostic on the 500-entry buffer a busy project keeps full. Entries are written in place now and
 * `#oldest` names where the retained window starts, so recording is one assignment and one wrap
 * however full the buffer is, and eviction is what that assignment already did rather than a second
 * step. Nothing a caller can observe moves: `snapshot` answers oldest first and `droppedCount` counts
 * what the buffer let go. Issue #443, phase B step 13.
 */
export class Diagnostics {
  readonly #capacity: number;
  readonly #entries: Diagnostic[] = [];
  #oldest = 0;
  #droppedCount = 0;

  constructor(capacity: number = DEFAULT_CAPACITY) {
    if (!Number.isInteger(capacity) || capacity <= 0)
      throw new RangeError("Diagnostics capacity must be a positive integer.");
    this.#capacity = capacity;
  }

  get capacity(): number {
    return this.#capacity;
  }
  get droppedCount(): number {
    return this.#droppedCount;
  }

  /** Record one diagnostic in constant time, overwriting the oldest retained entry at capacity. */
  record(diagnostic: Diagnostic): void {
    if (this.#entries.length < this.#capacity) {
      this.#entries.push(diagnostic);
      return;
    }
    // The slot the oldest entry sits in is the slot the newest one takes, so eviction is what this
    // assignment already did rather than a step that moves everything behind it.
    this.#entries[this.#oldest] = diagnostic;
    this.#oldest = (this.#oldest + 1) % this.#capacity;
    this.#droppedCount += 1;
  }

  /** Record every diagnostic in order, e.g. everything carried by one patch batch. */
  recordAll(diagnostics: readonly Diagnostic[]): void {
    for (const diagnostic of diagnostics) this.record(diagnostic);
  }

  /** A frozen, read-only view of retained diagnostics, oldest first, and the running drop count. */
  snapshot(): DiagnosticsSnapshot {
    // Two slices rather than a walk over indices, because the retained window is contiguous on both
    // sides of the wrap and neither part can hold a hole: this array is never sparse and never longer
    // than the capacity.
    const entries =
      this.#oldest === 0
        ? [...this.#entries]
        : [...this.#entries.slice(this.#oldest), ...this.#entries.slice(0, this.#oldest)];
    return Object.freeze({
      entries: Object.freeze(entries),
      droppedCount: this.#droppedCount,
    });
  }
}
