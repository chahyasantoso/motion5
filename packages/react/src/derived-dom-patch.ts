import { useCallback, useEffect, useMemo, type RefCallback } from "react";
import type { DomPatchAdapter } from "@motion5/core/adapters";
import { patchRender, selectRecord, unreachable } from "@motion5/core/internal";
import type { PatchSource } from "@motion5/core/internal";
import { useDomBinding } from "./dom-binding";

/** Composed values of one source node, as a derivation receives them. */
export type PatchValues = Readonly<Record<string, unknown>>;

/**
 * Geometry as a pure function of source values: record to write, `undefined` to hide the target.
 * Called on every publication; keep it pure and its identity stable. */
export type PatchDerivation = (
  values: readonly PatchValues[],
) => Readonly<Record<string, unknown>> | undefined;

// Hide, not unmount: adapter's omitted-key removal restores once the derivation derives again.
const NOT_DERIVABLE: Readonly<Record<string, unknown>> = Object.freeze({ visibility: "hidden" });

/**
 * Binds a derivation over published nodes to one DOM or SVG target.
 * Owns fan-in and liveness; writes stay with the adapter. */
export function useDerivedDomPatch<T extends Element>(
  source: PatchSource,
  nodeIds: readonly string[],
  derive: PatchDerivation,
): RefCallback<T> {
  // Ids are the subscription: serialized to a stable key, reused as the write label.
  const key = JSON.stringify(nodeIds);
  const ids = useMemo(() => JSON.parse(key) as readonly string[], [key]);
  const pose = useCallback(
    (adapter: DomPatchAdapter) => {
      const values: PatchValues[] = [];
      for (const id of ids) {
        const patch = source.get(id);
        const decision = patchRender(patch);
        if (decision.kind !== "render") {
          adapter.applyValues(key, NOT_DERIVABLE);
          return;
        }
        const picked = selectRecord(decision.patch.outputs.values);
        switch (picked.kind) {
          case "record":
            values.push(picked.values);
            break;
          case "missing-output":
          case "wrong-kind":
            adapter.applyValues(key, NOT_DERIVABLE);
            return;
          default:
            return unreachable(picked);
        }
      }
      adapter.applyValues(key, derive(values) ?? NOT_DERIVABLE);
    },
    [derive, ids, key, source],
  );
  const binding = useDomBinding<T>(undefined, pose);

  // Subscribe before first write: a publication in between would otherwise be lost.
  useEffect(() => {
    const releases = ids.map((id) => source.subscribeNode(id, () => pose(binding.adapter)));
    pose(binding.adapter);
    return () => {
      for (const release of releases) release();
    };
  }, [binding, ids, pose, source]);

  return binding.ref;
}
