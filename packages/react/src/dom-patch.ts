import { useCallback, useEffect, useMemo, type RefCallback } from "react";
import type { DomPatchAdapter } from "@motion5/core/adapters";
import type { PatchSource, RenderMetadata, RenderMetadataSource } from "@motion5/core/internal";
import { useDomBinding } from "./dom-binding";

const NO_SERIALIZERS: RenderMetadata["outputSerializers"] = Object.freeze({});

/**
 * Binds one published node to one DOM or SVG target and returns the callback ref that attaches it.
 *
 * React owns the subscription and the ref lifecycle. `createDomPatchAdapter` remains the single
 * owner of which published values are renderable and how they are applied, so a new plugin output
 * reaches the target without this hook or a consumer learning its key. Values are written outside
 * React: no state, no render per publication, and no second scheduler beside the registry's batch.
 *
 * A patch that is not ready is a no-op in the adapter, so a blocked, errored, or destroyed node
 * leaves its target at the last applied pose. Reach for `useDerivedDomPatch` when the values a
 * target needs are a function of more than one node, or of one node's values rather than its pose,
 * and for `usePatch` when absence must be rendered or a diagnostic read. See ADR-073 and ADR-075.
 */
export function useDomPatch<T extends Element>(
  source: PatchSource & RenderMetadataSource,
  nodeId: string,
): RefCallback<T> {
  // A live view rather than a snapshot: a recompiled node resolves to a new plugin chain, and a
  // serializer record captured at construction would write the next output raw.
  const metadata = useMemo<RenderMetadata>(
    () => ({
      get outputSerializers() {
        return source.renderMetadata(nodeId)?.outputSerializers ?? NO_SERIALIZERS;
      },
    }),
    [nodeId, source],
  );
  const pose = useCallback(
    (adapter: DomPatchAdapter) => {
      const retained = source.get(nodeId);
      if (retained) adapter.apply(retained);
    },
    [nodeId, source],
  );
  const binding = useDomBinding<T>(metadata, pose);

  // Subscribe, then write the retained patch, so a value published between the two is applied rather
  // than lost and an already-published node renders on mount.
  useEffect(() => {
    const unsubscribe = source.subscribeNode(nodeId, (patch) => {
      binding.adapter.apply(patch);
    });
    pose(binding.adapter);
    return unsubscribe;
  }, [binding, nodeId, pose, source]);

  return binding.ref;
}
