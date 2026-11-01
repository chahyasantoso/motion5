import type { Diagnostic } from "../contract/v5";

export interface DiagnosticsSnapshot {
  readonly entries: readonly Diagnostic[];
  readonly droppedCount: number;
}

const DEFAULT_CAPACITY = 500;

/**
 * Bounded, inspection-only ring of recent entries: recording at capacity overwrites the oldest;
 * `snapshot` reads oldest first. Patches and batches are the only notification path. */
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
