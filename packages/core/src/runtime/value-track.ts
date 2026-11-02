import type { DataType, Outputs, Structure, Value } from "../contract/v5";
import { describeDiagnostics } from "../contract/diagnostics";
import type { ParsedValues } from "../contract/v5-parse";
import type { Interpolator } from "../ports/interpolator";
import { authoringValue } from "./authoring-value";
import { parseDataType } from "./data-type-parse";
import { createValueEvaluator, type ValueEvaluator } from "./evaluate-values";
import { replaceEvaluator } from "./evaluator-replacement";

/**
 * Compiled form of a no-plugin track: authored values evaluated at `progress`, not grouped keyframes. `outputs` is `{ values }`; `evaluate-values.ts` owns slot ids.
 */
export class ValueTrack {
  readonly kind = "values";
  readonly nodeId: string;
  readonly #dataType: DataType<unknown, unknown> | undefined;
  readonly #interpolator: Interpolator;
  #evaluator: ValueEvaluator;
  #structure: Structure<unknown> | undefined;
  #overlay: Value | undefined;
  #progress = 0;
  #ticked = false;
  #disposed = false;

  constructor(options: {
    readonly nodeId: string;
    readonly values: ParsedValues | undefined;
    readonly interpolator: Interpolator;
    readonly dataType?: DataType<unknown, unknown>;
  }) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.#interpolator = options.interpolator;
    this.#dataType = options.dataType;
    this.#evaluator = createValueEvaluator(options.values, options.interpolator);
    this.#structure = this.#parseStructure(options.values);
  }

  /** Commit-time structure for a typed data track; `undefined` for an untyped track. */
  get structure(): Structure<unknown> | undefined {
    return this.#structure;
  }

  #parseStructure(values: ParsedValues | undefined): Structure<unknown> | undefined {
    const type = this.#dataType;
    if (type === undefined) return undefined;
    const parsed = parseDataType(type, authoringValue(values), `${this.nodeId}.input.values`);
    if (parsed.kind === "refused") throw new TypeError(describeDiagnostics(parsed.diagnostics));
    return parsed.value;
  }

  get progress(): number {
    return this.#progress;
  }

  /**
   * Rebuilds the evaluator for the given authored values, the whole cost of an authored edit. Candidate builds before the prior evaluator is disposed; a throwing rebuild keeps it active.
   */
  replaceValues(values: ParsedValues | undefined): void {
    this.assertActive();
    let nextStructure: Structure<unknown> | undefined;
    replaceEvaluator(
      this.#evaluator,
      () => {
        nextStructure = this.#parseStructure(values);
        return createValueEvaluator(values, this.#interpolator);
      },
      (next) => {
        this.#evaluator = next;
        this.#structure = nextStructure;
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
    // A static track still composes on its first move; later seeks cannot change its output.
    if (this.#evaluator.timeInvariant && this.#ticked) return false;
    this.#ticked = true;
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
