import type { Patch, PatchListener, PatchRegistry } from "../../core/src/runtime/patch-registry";

/**
 * Framework-neutral external store used by the React binding. React owns the hook and
 * subscription lifecycle; this object owns neither runtime internals nor composition.
 */
export interface PatchStore {
  getSnapshot(): Patch | undefined;
  subscribe(listener: PatchListener): () => void;
}

export function createPatchStore(registry: PatchRegistry, nodeId: string): PatchStore {
  let snapshot = registry.get(nodeId);
  const listeners = new Set<PatchListener>();
  const unsubscribeRegistry = registry.subscribeNode(nodeId, (patch) => {
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
        if (listeners.size === 0) unsubscribeRegistry();
      };
    },
  };
}
