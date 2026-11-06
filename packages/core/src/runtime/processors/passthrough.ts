import type { Model, Structure } from "../../contract/v5";
import { describeDiagnostics } from "../../contract/diagnostics";
import type { ParsedValues } from "../../contract/v5-parse";
import type { Interpolator } from "../../ports/interpolator";
import { authoringValue } from "../authoring-value";
import { parseModel } from "../model-parse";
import { createValueEvaluator } from "../evaluate-values";
import type { PublisherComposition } from "../graph-publisher";
import type { LocalInput } from "../local-input";
import type { BoundSlots } from "../bound-slot";
import type { Processor } from "./processor";

export interface PassthroughProcessorOptions {
  readonly nodeId: string;
  readonly values: ParsedValues | undefined;
  readonly interpolator: Interpolator;
  readonly model: Model<unknown, unknown>;
}

export class PassthroughProcessor implements Processor {
  readonly kind = "passthrough" as const;
  readonly nodeId: string;
  readonly #model: Model<unknown, unknown>;
  readonly #interpolator: Interpolator;
  #structure: Structure<unknown> | undefined;
  #ticked = false;

  constructor(options: PassthroughProcessorOptions) {
    this.nodeId = options.nodeId;
    this.#model = options.model;
    this.#interpolator = options.interpolator;
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

  setProgress(value: number, localInput: LocalInput): boolean {
    const changed = localInput.setProgress(value);
    if (!changed) return false;
    if (localInput.timeInvariant && this.#ticked) return false;
    this.#ticked = true;
    return true;
  }

  replaceValues(values: ParsedValues | undefined, localInput: LocalInput): void {
    localInput.replaceEvaluator(() =>
      createValueEvaluator(values, this.#interpolator, this.#model.spec),
    );
  }

  compose(_slots: BoundSlots, localInput: LocalInput): PublisherComposition {
    return {
      outputs: Object.freeze({ values: localInput.evaluate() }),
      sourceProgress: localInput.progress,
      sourceRevisions: {},
    };
  }

  invalidateOutputs(): void {}

  dispose(): void {}
}
