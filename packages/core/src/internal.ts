import type { LivePatch, PatchListener } from "./runtime/patch-registry";
import type { RenderMetadata } from "./domain/plugins";

export type { LivePatch, Patch, PatchListener } from "./runtime/patch-registry";
export { patchRender } from "./contract/patch-render";
export type { PatchRender } from "./contract/patch-render";
export type { RenderMetadata } from "./domain/plugins";
/**
 * The collapse an implementor of `PatchSource` owes, exported beside the interface that owes it.
 *
 * `get` answers the live union and `subscribeNode` delivers every variant, so a source built over a
 * wire that carries a terminal patch has to turn that one into absence. Narrowing `get` without
 * shipping this would tighten the obligation and leave every implementor to re-derive which variants
 * are live, which is the same duplication one step out from the store that used to spell it. One
 * owner, in `runtime/patch-registry.ts`, beside the eviction order that makes it true.
 */
export { liveOrAbsent } from "./runtime/patch-registry";

/**
 * The metadata half of a renderer-facing source: how a node's plugin output is serialized.
 *
 * Declared beside `PatchSource` rather than inside it, and required by the binding that needs it, so
 * a consumer that only reads values keeps the two-member contract while a consumer that renders
 * cannot be constructed without the channel. A DOM adapter built without metadata is not one owner
 * with one behaviour: it is the same implementation configured to write a serializing plugin's
 * output raw. See ADR-073.
 */
export interface RenderMetadataSource {
  renderMetadata(nodeId: string): RenderMetadata | undefined;
}
export interface PatchSource {
  /**
   * The patch this node last published, or nothing if it has published none or is gone.
   *
   * `LivePatch | undefined`, which is the answer `PatchRegistry.get` and `ProjectHandle.get` already
   * give, because this is the same question on a third member and this is the interface those two
   * satisfy. It stayed `Patch | undefined` while they were narrowed, and one invariant stated two
   * ways at three spellings is not a looser contract: an implementor could return a `destroyed`
   * patch, the compiler accepted it, and `createPatchStore` discarded it at run time. Widening the
   * abstraction past its own implementations is the Liskov defect rather than a deferred decision,
   * and `typecheck` is the gate that reports it now instead of a silent collapse doing so later.
   *
   * It does tighten what an implementor owes, which is the cost this takes rather than defers, and
   * `liveOrAbsent` above is why the cost is one call: the obligation is discharged by the function
   * that owns the partition, not re-derived per source. `subscribeNode` stays wide on purpose. A
   * subscriber has to hear a node's terminal publication, and that asymmetry is the entire content of
   * `LivePatch`; narrowing both members would delete the event rather than type it. See ADR-098.
   */
  get(nodeId: string): LivePatch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
}
