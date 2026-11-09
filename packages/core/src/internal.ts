import type { LivePatch, PatchListener } from "./runtime/patch-registry";

export type { LivePatch, Patch, PatchListener } from "./runtime/patch-registry";
export { patchRender } from "./contract/patch-render";
export type { PatchRender } from "./contract/patch-render";
export { isFlatRecord, selectRecord, selectRow, selectSingleRow } from "./contract/output-select";
export type { RecordSelection, RowSelection } from "./contract/output-select";
/**
 * Collapse the terminal patch to absence for `PatchSource`, beside the eviction order in
 * `runtime/patch-registry.ts`; the export, not each implementor, owns that partition. */
export { liveOrAbsent } from "./runtime/patch-registry";

/**
 * One `never` sink for closed unions, internal so `packages/react` reads it too; off the
 * public entry and boundary allow-list, a second sink being a second answer on variants. */
export { unreachable } from "./lang/exhaustive";
export { explain } from "./graph/explain";
export type { ExplainNode, ExplainReport, ExplainSlot } from "./graph/explain";

export interface PatchSource {
  /**
   * Last published patch, `LivePatch | undefined` like `PatchRegistry.get`; terminal must
   * collapse through `liveOrAbsent`. `subscribeNode` stays wide: it must hear the end. */
  get(nodeId: string): LivePatch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
}
