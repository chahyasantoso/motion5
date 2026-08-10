import type { Patch, PatchListener } from "./runtime/patch-registry";

export type { Patch, PatchListener } from "./runtime/patch-registry";

export interface PatchSource {
  get(nodeId: string): Patch | undefined;
  subscribeNode(nodeId: string, listener: PatchListener): () => void;
}
