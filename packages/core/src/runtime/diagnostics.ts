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
 */
export class Diagnostics {
  readonly #capacity: number;
  #entries: Diagnostic[] = [];
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

  /** Record one diagnostic, evicting the oldest retained entry once at capacity. */
  record(diagnostic: Diagnostic): void {
    if (this.#entries.length >= this.#capacity) {
      this.#entries.shift();
      this.#droppedCount += 1;
    }
    this.#entries.push(diagnostic);
  }

  /** Record every diagnostic in order, e.g. everything carried by one patch batch. */
  recordAll(diagnostics: readonly Diagnostic[]): void {
    for (const diagnostic of diagnostics) this.record(diagnostic);
  }

  /** A frozen, read-only view of retained diagnostics and the running drop count. */
  snapshot(): DiagnosticsSnapshot {
    return Object.freeze({
      entries: Object.freeze([...this.#entries]),
      droppedCount: this.#droppedCount,
    });
  }
}
