import type { Outputs, Value } from "../contract/v5";
import type { ParsedValues } from "../contract/v5-parse";
import type { Interpolator } from "../ports/interpolator";
import { createValueEvaluator, type ValueEvaluator } from "./evaluate-values";
import { replaceEvaluator } from "./evaluator-replacement";

/**
 * Compiled form of a no-plugin track: authored values evaluated at `progress`, not grouped keyframes. `outputs` is `{ values }`; `evaluate-values.ts` owns slot ids.
 */
export class ValueTrack {
  readonly kind = "values";
  readonly nodeId: string;
  readonly #interpolator: Interpolator;
  #evaluator: ValueEvaluator;
  #overlay: Value | undefined;
  #progress = 0;
  #disposed = false;

  constructor(options: {
    readonly nodeId: string;
    readonly values: ParsedValues | undefined;
    readonly interpolator: Interpolator;
  }) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.#interpolator = options.interpolator;
    this.#evaluator = createValueEvaluator(options.values, options.interpolator);
  }

  get progress(): number {
    return this.#progress;
  }

  /**
   * Rebuilds the evaluator for the given authored values, the whole cost of an authored edit. Candidate builds before the prior evaluator is disposed; a throwing rebuild keeps it active.
   */
  replaceValues(values: ParsedValues | undefined): void {
    this.assertActive();
    replaceEvaluator(
      this.#evaluator,
      () => createValueEvaluator(values, this.#interpolator),
      (next) => {
        this.#evaluator = next;
      },
    );
  }

  /**
   * Sets the whole live value, or `undefined` to resume authored evaluation. A write never merges; a release removes one record.
   */
  replaceOverlay(value: Value | undefined): void {
    this.assertActive();
    this.#overlay = value;
  }

  /** A no-plugin track has no plugin chain; `renderMetadata` reads this. */
  get plugins(): undefined {
    return undefined;
  }

  setProgress(value: number): boolean {
    this.assertActive();
    if (!Number.isFinite(value)) throw new TypeError("Track progress must be finite.");
    const next = Math.max(0, Math.min(1, value));
    if (Object.is(next, this.#progress)) return false;
    this.#progress = next;
    return true;
  }

  /** Live value when set, else the authored shape evaluated at this progress. */
  outputs(): Outputs {
    this.assertActive();
    const value = this.#overlay ?? this.#evaluator.evaluate(this.#progress);
    return Object.freeze({ values: value });
  }

  dispose(): void {
    if (this.#disposed) return;
    this.#disposed = true;
    this.#evaluator.dispose();
  }

  private assertActive(): void {
    if (this.#disposed) throw new Error("Track is disposed.");
  }
}
