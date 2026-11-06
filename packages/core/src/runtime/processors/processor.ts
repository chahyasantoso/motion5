import type { SourceStructures, Structure, Value } from "../../contract/v5";
import type { ParsedValues } from "../../contract/v5-parse";
import type { PublisherComposition } from "../publisher-outcome";
import type { BoundSlots } from "../bound-slot";

export interface Processor {
  readonly kind: "passthrough" | "computed";
  structureAtCommit(): Structure<unknown> | undefined;
  outputStructure(outputName: string): Structure<unknown> | undefined;
  prepareCommit(structures: SourceStructures): void;
  invalidateOutputs(): void;
  setProgress(value: number): boolean;
  replaceValues(values: ParsedValues | undefined): void;
  replaceParam(param: ParsedValues | undefined): void;
  replaceParamOverlay(value: Value | undefined): void;
  compose(slots: BoundSlots): PublisherComposition;
  dispose(): void;
}
