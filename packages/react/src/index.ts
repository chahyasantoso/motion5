import { useSyncExternalStore } from "react";
import type { Patch, PatchSource } from "@motion5/core/internal";
import { createPatchStore } from "./patch-store";

export type { Patch } from "@motion5/core/internal";

/**
 * Subscribe to one published node from a React component.
 *
 * The store is created once per source/node pair for the lifetime of this hook call. React
 * owns the render subscription through useSyncExternalStore; the store owns source attach and
 * detach through C1's listener lifecycle.
 */
export function usePatch(source: PatchSource, nodeId: string): Patch | undefined {
  const store = createPatchStore(source, nodeId);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
