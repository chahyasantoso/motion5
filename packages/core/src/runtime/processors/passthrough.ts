import type { DataType, Model, ResolvedRequires, Structure, ValueSpec } from "../../contract/v5";
import { describeDiagnostics } from "../../contract/diagnostics";
import type { ParsedValues } from "../../contract/v5-parse";
import type { Interpolator } from "../../ports/interpolator";
import { authoringValue } from "../authoring-value";
import { parseDataType, parseModel } from "../data-type-parse";
import { createValueEvaluator } from "../evaluate-values";
import type { PublisherComposition } from "../graph-publisher";
import type { LocalInput } from "../local-input";
import type { SlotSources } from "../source-ref";
import type { Processor } from "./processor";

export interface PassthroughProcessorOptions {
  readonly nodeId: string;
  readonly values: ParsedValues | undefined;
  readonly interpolator: Interpolator;
  readonly dataType?: DataType<unknown, unknown>;
  readonly model?: Model<unknown, unknown>;
  readonly spec?: ValueSpec;
}

export class PassthroughProcessor implements Processor {
  readonly kind = "passthrough" as const;
  readonly nodeId: string;
  readonly #dataType: DataType<unknown, unknown> | undefined;
  readonly #model: Model<unknown, unknown> | undefined;
  readonly #spec: ValueSpec | undefined;
  readonly #interpolator: Interpolator;
  #structure: Structure<unknown> | undefined;
  #ticked = false;

  constructor(options: PassthroughProcessorOptions) {
    this.nodeId = options.nodeId;
    this.#dataType = options.dataType;
    this.#model = options.model;
    this.#spec = options.spec ?? options.dataType?.spec ?? options.model?.spec;
    this.#interpolator = options.interpolator;
    this.#structure = this.#parseStructure(options.values);
  }

  #parseStructure(values: ParsedValues | undefined): Structure<unknown> | undefined {
    if (this.#dataType !== undefined) {
      const parsed = parseDataType(
        this.#dataType,
        authoringValue(values),
        `${this.nodeId}.input.values`,
      );
      if (parsed.kind === "refused") throw new TypeError(describeDiagnostics(parsed.diagnostics));
      return parsed.value;
    }
    if (this.#model !== undefined) {
      const parsed = parseModel(this.#model, authoringValue(values), `${this.nodeId}.input.values`);
      if (parsed.kind === "refused") throw new TypeError(describeDiagnostics(parsed.diagnostics));
      return parsed.value;
    }
    return undefined;
  }

  structureAtCommit(): Structure<unknown> | undefined {
    return this.#structure;
  }

  outputStructure(outputName: string): Structure<unknown> | undefined {
    return outputName === "values" ? this.#structure : undefined;
  }

  setProgress(value: number, localInput: LocalInput): boolean {
    const changed = localInput.setProgress(value);
    if (!changed) return false;
    if (localInput.timeInvariant && this.#ticked) return false;
    this.#ticked = true;
    return true;
  }

  replaceValues(values: ParsedValues | undefined, localInput: LocalInput): void {
    let nextStructure: Structure<unknown> | undefined;
    localInput.replaceEvaluator(
      () => {
        nextStructure = this.#parseStructure(values);
        return createValueEvaluator(values, this.#interpolator, this.#spec);
      },
      () => {
        this.#structure = nextStructure;
      },
    );
  }

  compose(
    _requires: ResolvedRequires,
    _sourceRefs: SlotSources,
    localInput: LocalInput,
  ): PublisherComposition {
    return {
      outputs: Object.freeze({ values: localInput.evaluate() }),
      sourceProgress: localInput.progress,
      sourceRevisions: {},
    };
  }

  dispose(): void {}
}
