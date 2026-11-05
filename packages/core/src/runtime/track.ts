import type {
  Diagnostic,
  Outputs,
  ResolvedRequires,
  SourceStructures,
  Structure,
  Value,
} from "../contract/v5";
import type { ParsedValues } from "../contract/v5-parse";
import type { PublisherComposition } from "./graph-publisher";
import { LocalInput } from "./local-input";
import type { Processor } from "./processors/processor";
import type { SlotSources } from "./source-ref";

export class Track {
  readonly nodeId: string;
  readonly #localInput: LocalInput;
  readonly #processor: Processor;

  constructor(nodeId: string, localInput: LocalInput, processor: Processor) {
    if (nodeId.length === 0) throw new TypeError("Track node id must be non-empty.");
    this.nodeId = nodeId;
    this.#localInput = localInput;
    this.#processor = processor;
  }

  get processorKind(): "passthrough" | "computed" {
    return this.#processor.kind;
  }

  get processor(): Processor {
    return this.#processor;
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

  markSourcesChecked(
    structures: SourceStructures,
    diagnostics: readonly Diagnostic[] = Object.freeze([]),
  ): void {
    this.#processor.markSourcesChecked?.(structures, diagnostics);
  }

  prepareCommit(structures: SourceStructures): void {
    this.#processor.prepareCommit?.(structures);
  }

  setProgress(value: number): boolean {
    return this.#processor.setProgress(value, this.#localInput);
  }

  replaceValues(values: ParsedValues | undefined): void {
    if (this.#processor.replaceValues) {
      this.#processor.replaceValues(values, this.#localInput);
    }
  }

  replaceOverlay(value: Value | undefined): void {
    this.#localInput.replaceOverlay(value);
  }

  outputs(): Outputs {
    return Object.freeze({ values: this.#localInput.evaluate() });
  }

  compose(requires: ResolvedRequires, sourceRefs: SlotSources = {}): PublisherComposition {
    return this.#processor.compose(requires, sourceRefs, this.#localInput);
  }

  dispose(): void {
    this.#localInput.dispose();
    this.#processor.dispose?.();
  }
}
