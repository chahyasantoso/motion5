import type { Patch, PatchListener } from "./runtime/patch-registry";
import type { RenderMetadata } from "./domain/plugins";

export type { Patch, PatchListener } from "./runtime/patch-registry";
export type { RenderMetadata } from "./domain/plugins";

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
  get(nodeId: string): Patch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
}
