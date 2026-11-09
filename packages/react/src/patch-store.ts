import type { LivePatch, PatchListener, PatchSource } from "@motion5/core/internal";
import { liveOrAbsent, unreachable } from "@motion5/core/internal";

/** Framework-neutral external store for the React binding; React owns the hook and subscription lifecycle. */
export interface PatchStore {
  getSnapshot(): LivePatch | undefined;
  subscribe(listener: PatchListener): () => void;
}

export type PatchStoreLifecycle =
  | { readonly kind: "detached" }
  | { readonly kind: "attached"; snapshot: LivePatch | undefined; readonly detach: () => void };

export function createPatchStore(source: PatchSource, nodeId: string): PatchStore {
  const listeners = new Set<PatchListener>();
  // Live union: both writers narrow off terminal — source.get cannot produce one, delivery is collapsed first.
  const DETACHED: PatchStoreLifecycle = Object.freeze({ kind: "detached" });
  let lifecycle: PatchStoreLifecycle = DETACHED;

  // React remounts effects freely (StrictMode deliberately): subscription follows the listener
  // set, first → attach, last → detach, so a remount reattaches instead of staying deaf.
  function attach(): void {
    let release = (): void => undefined;
    const attached: Extract<PatchStoreLifecycle, { readonly kind: "attached" }> = {
      kind: "attached",
      snapshot: source.get(nodeId),
      detach: () => release(),
    };
    lifecycle = attached;
    release = source.subscribeNode(nodeId, (patch) => {
      // Terminal patch means gone, not new values: collapse → absent, else the memoized snapshot
      // serves the final patch forever; core's `liveOrAbsent` owns that, matching `source.get`.
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
        return unreachable(current);
    }
  }

  return {
    getSnapshot() {
      // Detached: source is the only truthful snapshot, patches published then never arrived.
      // Attached: delivered patch is memoized, which keeps identity stable for useSyncExternalStore.
      switch (lifecycle.kind) {
        case "detached":
          return source.get(nodeId);
        case "attached":
          return lifecycle.snapshot;
        default:
          return unreachable(lifecycle);
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
