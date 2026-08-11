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
  const listeners = new Set<PatchListener>();
  let snapshot: Patch | undefined;
  let detachSource: (() => void) | undefined;

  // React mounts, unmounts, and remounts effects freely, and StrictMode does it on purpose.
  // The source subscription therefore follows the listener set instead of the store's own
  // construction: it is attached when the first listener arrives and released when the last
  // one leaves, so the same store can be mounted again rather than going permanently deaf
  // after its first teardown.
  function attach(): void {
    snapshot = source.get(nodeId);
    detachSource = source.subscribeNode(nodeId, (patch) => {
      snapshot = patch;
      for (const listener of [...listeners]) listener(patch);
    });
  }

  function detach(): void {
    const release = detachSource;
    detachSource = undefined;
    release?.();
  }

  return {
    getSnapshot() {
      // Patches published while detached were never delivered here, so the source is the only
      // truthful snapshot until the next attach. While attached the delivered patch is
      // memoized, which keeps snapshot identity stable for useSyncExternalStore.
      return detachSource === undefined ? source.get(nodeId) : snapshot;
    },
    subscribe(listener) {
      listeners.add(listener);
      if (detachSource === undefined) attach();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) detach();
      };
    },
  };
}
