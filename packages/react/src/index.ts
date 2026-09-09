import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type RefCallback,
} from "react";
import { createDomPatchAdapter, type DomTarget } from "@motion5/core/adapters";
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

/** Bind one published node directly to a DOM or SVG target without rendering through React. */
export function useDomPatch<T extends DomTarget>(
  source: PatchSource,
  nodeId: string,
): RefCallback<T> {
  const target = useRef<T | null>(null);
  const adapter = useMemo(
    () => createDomPatchAdapter({ style: {} }, undefined, () => target.current ?? undefined),
    [],
  );

  useLayoutEffect(() => {
    const apply = (patch: Patch): void => adapter.apply(patch);
    const unsubscribe = source.subscribeNode(nodeId, apply);
    const current = source.get(nodeId);
    if (current) apply(current);
    return unsubscribe;
  }, [adapter, nodeId, source]);

  return useCallback(
    (next) => {
      const previous = target.current;
      if (previous && previous !== next) adapter.clear(previous);
      target.current = next;
      const current = next ? source.get(nodeId) : undefined;
      if (current) adapter.apply(current);
    },
    [adapter, nodeId, source],
  );
}
