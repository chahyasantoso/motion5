import type { Patch, PatchListener, PatchSource } from "@motion5/core/internal";

/**
 * Framework-neutral external store used by the React binding. React owns the hook and
 * subscription lifecycle; this object owns neither runtime internals nor composition.
 */
export interface PatchStore {
  getSnapshot(): Patch | undefined;
  subscribe(listener: PatchListener): () => void;
}

export function createPatchStore(source: PatchSource, nodeId: string): PatchStore {
  let snapshot = source.get(nodeId);
  const listeners = new Set<PatchListener>();
  const unsubscribeSource = source.subscribeNode(nodeId, (patch) => {
    snapshot = patch;
    for (const listener of [...listeners]) listener(patch);
  });
  return {
    getSnapshot() {
      return snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) unsubscribeSource();
      };
    },
  };
}
