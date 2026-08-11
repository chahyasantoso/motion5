import { useMemo, useSyncExternalStore } from "react";
import type { Patch, PatchSource } from "@motion5/core/internal";
import { createPatchStore } from "./patch-store";

// A consumer must be able to type the hook's argument and result from this entry alone.
// Re-exporting the observation contract keeps @motion5/core/internal a private channel
// between the two packages instead of a required import for anyone using the hook.
export type { Patch, PatchListener, PatchSource } from "@motion5/core/internal";

/** Subscribe to one published node from a React component. */
export function usePatch(source: PatchSource, nodeId: string): Patch | undefined {
  const store = useMemo(() => createPatchStore(source, nodeId), [source, nodeId]);
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}
