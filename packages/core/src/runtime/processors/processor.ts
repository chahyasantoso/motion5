import type { SourceStructures, Structure, Value } from "../../contract/v5";
import type { ParsedValues } from "../../contract/v5-parse";
import type { PublisherComposition } from "../graph-publisher";
import type { LocalInput } from "../local-input";
import type { BoundSlots } from "../bound-slot";

export interface Processor {
  readonly kind: "passthrough" | "computed";
  structureAtCommit(): Structure<unknown> | undefined;
  outputStructure(outputName: string): Structure<unknown> | undefined;
  prepareCommit?(structures: SourceStructures): void;
  setProgress(value: number, localInput: LocalInput): boolean;
  replaceValues?(values: ParsedValues | undefined, localInput: LocalInput): void;
  replaceParam?(param: ParsedValues | undefined): void;
  replaceParamOverlay?(value: Value | undefined): void;
  compose(slots: BoundSlots, localInput: LocalInput): PublisherComposition;
  dispose?(): void;
}
