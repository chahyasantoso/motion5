import type { Diagnostic, ResolvedRequires, SourceStructures, Structure } from "../../contract/v5";
import type { ParsedValues } from "../../contract/v5-parse";
import type { PublisherComposition } from "../graph-publisher";
import type { LocalInput } from "../local-input";
import type { SlotSources } from "../source-ref";

export interface Processor {
  readonly kind: "passthrough" | "computed";
  structureAtCommit(): Structure<unknown> | undefined;
  outputStructure(outputName: string): Structure<unknown> | undefined;
  markSourcesChecked?(structures: SourceStructures, diagnostics: readonly Diagnostic[]): void;
  prepareCommit?(structures: SourceStructures): void;
  setProgress(value: number, localInput: LocalInput): boolean;
  replaceValues?(values: ParsedValues | undefined, localInput: LocalInput): void;
  compose(
    requires: ResolvedRequires,
    sourceRefs: SlotSources,
    localInput: LocalInput,
  ): PublisherComposition;
  dispose?(): void;
}
