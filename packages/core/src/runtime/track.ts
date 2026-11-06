import type { AdmittedPlugin, Model, SourceStructures, Structure, Value } from "../contract/v5";
import type { ParsedValues } from "../contract/v5-parse";
import type { Interpolator } from "../ports/interpolator";
import { createValueEvaluator } from "./evaluate-values";
import type { PublisherComposition } from "./graph-publisher";
import { LocalInput } from "./local-input";
import { ComputedProcessor, defaultPluginValues } from "./processors/computed";
import { PassthroughProcessor } from "./processors/passthrough";
import type { Processor } from "./processors/processor";
import type { BoundSlots } from "./bound-slot";

export interface SourceTrackOptions {
  readonly nodeId: string;
  readonly values: ParsedValues | undefined;
  readonly interpolator: Interpolator;
  readonly model: Model<unknown, unknown>;
}

export interface ComputedTrackOptions {
  readonly nodeId: string;
  readonly plugin: AdmittedPlugin;
  readonly values: ParsedValues | undefined;
  readonly param?: ParsedValues;
  readonly interpolator: Interpolator;
}

export class Track {
  readonly nodeId: string;
  readonly #localInput: LocalInput;
  readonly #processor: Processor;

  private constructor(nodeId: string, localInput: LocalInput, processor: Processor) {
    if (nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = nodeId;
    this.#localInput = localInput;
    this.#processor = processor;
  }

  static source(options: SourceTrackOptions): Track {
    const localInput = new LocalInput(
      createValueEvaluator(options.values, options.interpolator, options.model.spec),
    );
    const processor = new PassthroughProcessor({ ...options, localInput });
    return new Track(options.nodeId, localInput, processor);
  }

  static computed(options: ComputedTrackOptions): Track {
    const localInput = new LocalInput(
      createValueEvaluator(
        defaultPluginValues(options.values, options.plugin),
        options.interpolator,
        options.plugin.inputs.values?.spec,
      ),
    );
    const processor = new ComputedProcessor({ ...options, localInput });
    return new Track(options.nodeId, localInput, processor);
  }

  get processorKind(): Processor["kind"] {
    return this.#processor.kind;
  }

  get progress(): number {
    return this.#localInput.progress;
  }

  get plugins(): undefined {
    return undefined;
  }

  structureAtCommit(): Structure<unknown> | undefined {
    return this.#processor.structureAtCommit();
  }

  outputStructure(outputName: string): Structure<unknown> | undefined {
    return this.#processor.outputStructure(outputName);
  }

  prepareCommit(structures: SourceStructures): void {
    this.#processor.prepareCommit(structures);
  }

  invalidateOutputs(): void {
    this.#processor.invalidateOutputs();
  }

  setProgress(value: number): boolean {
    return this.#processor.setProgress(value);
  }

  replaceValues(values: ParsedValues | undefined): void {
    this.#processor.replaceValues(values);
  }

  replaceParam(param: ParsedValues | undefined): void {
    this.#processor.replaceParam(param);
  }

  replaceParamOverlay(value: Value | undefined): void {
    this.#processor.replaceParamOverlay(value);
  }

  replaceOverlay(value: Value | undefined): void {
    this.#localInput.replaceOverlay(value);
  }

  compose(slots: BoundSlots = {}): PublisherComposition {
    return this.#processor.compose(slots);
  }

  dispose(): void {
    this.#localInput.dispose();
    this.#processor.dispose();
  }
}
