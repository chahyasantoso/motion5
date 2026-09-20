import type { LivePatch, PatchListener, PatchSource } from "@motion5/core/internal";
import { liveOrAbsent } from "@motion5/core/internal";

/**
 * Framework-neutral external store used by the React binding. React owns the hook and
 * subscription lifecycle; this object owns neither runtime internals nor composition.
 */
export interface PatchStore {
  getSnapshot(): LivePatch | undefined;
  subscribe(listener: PatchListener): () => void;
}


export function unhandledLifecycle(value: never): never {
  throw new TypeError(`Unhandled variant: ${JSON.stringify(value)}`);
}

export type PatchStoreLifecycle =
  | { readonly kind: "detached" }
  | { readonly kind: "attached"; snapshot: LivePatch | undefined; readonly detach: () => void };

export function createPatchStore(source: PatchSource, nodeId: string): PatchStore {
  const listeners = new Set<PatchListener>();
  // The live union rather than `Patch`, and it is a statement of what this variable already held.
  // Both of its writers answer it: `source.get` cannot produce a terminal patch, and the delivered
  // one below is collapsed before it is stored. Declaring it wider than that asked every reader of
  // `getSnapshot` to narrow past a variant the store has never served.
  const DETACHED: PatchStoreLifecycle = Object.freeze({ kind: "detached" });
  let lifecycle: PatchStoreLifecycle = DETACHED;

  // React mounts, unmounts, and remounts effects freely, and StrictMode does it on purpose.
  // The source subscription therefore follows the listener set instead of the store's own
  // construction: it is attached when the first listener arrives and released when the last
  // one leaves, so the same store can be mounted again rather than going permanently deaf
  // after its first teardown.
  function attach(): void {
    let release = (): void => undefined;
    const attached: Extract<PatchStoreLifecycle, { readonly kind: "attached" }> = {
      kind: "attached",
      snapshot: source.get(nodeId),
      detach: () => release(),
    };
    lifecycle = attached;
    release = source.subscribeNode(nodeId, (patch) => {
      // A terminal patch says the node is gone, not that it has new values, and collapsing it to
      // `undefined` is what lets a consumer render "absent" instead of freezing on the last live
      // pose: the memoized snapshot is authoritative while attached, so without this the destroyed
      // node's final patch would be served forever. The collapse itself is core's to define rather
      // than this store's to spell, because `source.get` already answers the narrow union and the
      // two writers of one variable cannot be allowed to disagree about which variants it holds.
      if (lifecycle.kind !== "attached") return;
      lifecycle.snapshot = liveOrAbsent(patch);
      for (const listener of [...listeners]) listener(patch);
    });
  }

  function detach(): void {
    const current = lifecycle;
    lifecycle = DETACHED;
    switch (current.kind) {
      case "detached":
        return;
      case "attached":
        current.detach();
        return;
      default:
        return unhandledLifecycle(current);
    }
  }

  return {
    getSnapshot() {
      // Patches published while detached were never delivered here, so the source is the only
      // truthful snapshot until the next attach. While attached the delivered patch is
      // memoized, which keeps snapshot identity stable for useSyncExternalStore.
      switch (lifecycle.kind) {
        case "detached":
          return source.get(nodeId);
        case "attached":
          return lifecycle.snapshot;
        default:
          return unhandledLifecycle(lifecycle);
      }
    },
    subscribe(listener) {
      listeners.add(listener);
      if (lifecycle.kind === "detached") attach();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) detach();
      };
    },
  };
}
