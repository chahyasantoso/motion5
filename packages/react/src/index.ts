import { useMemo, useSyncExternalStore } from "react";
import type { Patch, PatchSource } from "@motion5/core/internal";
import { createPatchStore } from "./patch-store";

export type { Patch } from "@motion5/core/internal";

/** Subscribe to one published node from a React component. */
export function usePatch(source: PatchSource, nodeId: string): Patch | undefined {
  const store = useMemo(() => createPatchStore(source, nodeId), [source, nodeId]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
