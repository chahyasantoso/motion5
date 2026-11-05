import type {
  DataType,
  Outputs,
  ResolvedRequires,
  Structure,
  Value,
  ValueSpec,
} from "../contract/v5";
import { describeDiagnostics } from "../contract/diagnostics";
import type { ParsedValues } from "../contract/v5-parse";
import type { Interpolator } from "../ports/interpolator";
import { authoringValue } from "./authoring-value";
import { parseDataType } from "./data-type-parse";
import { createValueEvaluator } from "./evaluate-values";
import type { PublisherComposition } from "./graph-publisher";
import { LocalInput } from "./local-input";
import type { SlotSources } from "./source-ref";

/**
 * Compiled form of a no-plugin track: authored values evaluated at `progress`, not grouped keyframes. `outputs` is `{ values }`; `evaluate-values.ts` owns slot ids.
 */
export class ValueTrack {
  readonly kind = "values";
  readonly nodeId: string;
  readonly #dataType: DataType<unknown, unknown> | undefined;
  readonly #spec: ValueSpec | undefined;
  readonly #interpolator: Interpolator;
  readonly #localInput: LocalInput;
  #structure: Structure<unknown> | undefined;
  #ticked = false;

  constructor(options: {
    readonly nodeId: string;
    readonly values: ParsedValues | undefined;
    readonly interpolator: Interpolator;
    readonly dataType?: DataType<unknown, unknown>;
    readonly spec?: ValueSpec;
  }) {
    if (options.nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = options.nodeId;
    this.#interpolator = options.interpolator;
    this.#dataType = options.dataType;
    this.#spec = options.spec;
    this.#localInput = new LocalInput(
      createValueEvaluator(options.values, options.interpolator, options.spec),
    );
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
    return this.#localInput.progress;
  }

  /**
   * Rebuilds the evaluator for the given authored values, the whole cost of an authored edit. Candidate builds before the prior evaluator is disposed; a throwing rebuild keeps it active.
   */
  replaceValues(values: ParsedValues | undefined): void {
    let nextStructure: Structure<unknown> | undefined;
    this.#localInput.replaceEvaluator(
      () => {
        nextStructure = this.#parseStructure(values);
        return createValueEvaluator(values, this.#interpolator, this.#spec);
      },
      () => {
        this.#structure = nextStructure;
      },
    );
  }

  /**
   * Sets the whole live value, or `undefined` to resume authored evaluation. A write never merges; a release removes one record.
   */
  replaceOverlay(value: Value | undefined): void {
    this.#localInput.replaceOverlay(value);
  }

  /** A no-plugin track has no plugin chain; `renderMetadata` reads this. */
  get plugins(): undefined {
    return undefined;
  }

  setProgress(value: number): boolean {
    const changed = this.#localInput.setProgress(value);
    if (!changed) return false;
    // A static track still composes on its first move; later seeks cannot change its output.
    if (this.#localInput.timeInvariant && this.#ticked) return false;
    this.#ticked = true;
    return true;
  }

  /** Live value when set, else the authored shape evaluated at this progress. */
  outputs(): Outputs {
    return Object.freeze({ values: this.#localInput.evaluate() });
  }

  compose(_requires?: ResolvedRequires, _sources?: SlotSources): PublisherComposition {
    return {
      outputs: this.outputs(),
      sourceProgress: this.progress,
      sourceRevisions: {},
    };
  }

  dispose(): void {
    this.#localInput.dispose();
  }
}
