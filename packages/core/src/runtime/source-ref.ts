import type { Structure } from "../contract/v5";

/** The compiled source behind one bound slot edge. */
export interface SourceRef {
  readonly sourceId: string;
  /** Present for a typed data track; absent for a computed plugin output. */
  readonly structure?: Structure<unknown>;
}

/** Source refs by slot; map slots add one member level. */
export type SlotSources = Readonly<Record<string, SourceRef | Readonly<Record<string, SourceRef>>>>;
