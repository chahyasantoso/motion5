import type { Model, SourceStructures, Structure, Value } from "../../contract/v5";
import { describeDiagnostics } from "../../contract/diagnostics";
import type { ParsedValues } from "../../contract/v5-parse";
import type { Interpolator } from "../../ports/interpolator";
import { authoringValue } from "../authoring-value";
import { parseModel } from "../model-parse";
import { createValueEvaluator } from "../evaluate-values";
import type { PublisherComposition } from "../publisher-outcome";
import type { LocalInput } from "../local-input";
import type { BoundSlots } from "../bound-slot";
import type { Processor } from "./processor";

export interface PassthroughProcessorOptions {
  readonly nodeId: string;
  readonly values: ParsedValues | undefined;
  readonly interpolator: Interpolator;
  readonly model: Model<unknown, unknown>;
  readonly localInput: LocalInput;
}

export class PassthroughProcessor implements Processor {
  readonly kind = "passthrough" as const;
  readonly nodeId: string;
  readonly #model: Model<unknown, unknown>;
  readonly #interpolator: Interpolator;
  readonly #localInput: LocalInput;
  #structure: Structure<unknown> | undefined;
  #ticked = false;

  constructor(options: PassthroughProcessorOptions) {
    this.nodeId = options.nodeId;
    this.#model = options.model;
    this.#interpolator = options.interpolator;
    this.#localInput = options.localInput;
    this.#structure = this.#parseStructure(options.values);
  }

  #parseStructure(values: ParsedValues | undefined): Structure<unknown> | undefined {
    const parsed = parseModel(
      this.#model,
      authoringValue(values, this.#model.spec),
      `${this.nodeId}.input.values`,
    );
    if (parsed.kind === "refused") throw new TypeError(describeDiagnostics(parsed.diagnostics));
    return parsed.value;
  }

  structureAtCommit(): Structure<unknown> | undefined {
    return this.#structure;
  }

  outputStructure(outputName: string): Structure<unknown> | undefined {
    return outputName === "values" ? this.#structure : undefined;
  }

  setProgress(value: number): boolean {
    const changed = this.#localInput.setProgress(value);
    if (!changed) return false;
    if (this.#localInput.timeInvariant && this.#ticked) return false;
    this.#ticked = true;
    return true;
  }

  replaceValues(values: ParsedValues | undefined): void {
    this.#localInput.replaceEvaluator(() =>
      createValueEvaluator(values, this.#interpolator, this.#model.spec),
    );
  }

  compose(_slots: BoundSlots): PublisherComposition {
    return {
      outputs: Object.freeze({ values: this.#localInput.evaluate() }),
      sourceProgress: this.#localInput.progress,
      sourceRevisions: {},
    };
  }

  prepareCommit(_structures: SourceStructures): void {}

  invalidateOutputs(): void {}

  replaceParam(_param: ParsedValues | undefined): void {}

  replaceParamOverlay(_value: Value | undefined): void {}

  dispose(): void {}
}
