import type { Patch } from "@motion5/core";
// Render decision and never sink belong to core; read through the same internal channel.
import { patchRender, selectRecord, unreachable } from "@motion5/core/internal";
import type { Object3D } from "three";
import { writeFrame3d } from "./index";

/** Applies core patches and caller values to resolved Three.js objects. */
export type Object3dPatchAdapter = {
  apply(patch: Patch): void;
  /**
   * Writes caller values onto the object for `nodeId` with no patch status or revision; freshness is the caller's.
   */
  applyValues(nodeId: string, values: Readonly<Record<string, unknown>>): void;
  /**
   * Clears revision state for a resolved object so a retained patch can re-pose it after rebinding.
   */
  clear(object?: Object3D): void;
};

/**
 * Creates a patch adapter for Three.js objects resolved by core node id. Retained and gone write
 * nothing; scene-graph ownership and removal stay with the caller. */
export function createObject3dPatchAdapter(
  resolve: (nodeId: string) => Object3D | undefined,
): Object3dPatchAdapter {
  const write = (nodeId: string, values: Readonly<Record<string, unknown>>): void => {
    const object = resolve(nodeId);
    if (object !== undefined) writeFrame3d(object, values);
  };
  // Local: revisions keyed by resolved target then node id; clear drops that target's map.
  const appliedRevisions = new WeakMap<Object3D, Map<string, number>>();

  return {
    apply(patch) {
      const decision = patchRender(patch);
      switch (decision.kind) {
        case "render": {
          const ready = decision.patch;
          const object = resolve(ready.nodeId);
          if (object === undefined) return;
          const revisions = appliedRevisions.get(object) ?? new Map<string, number>();
          const accepted = revisions.get(ready.nodeId);
          if (accepted !== undefined && ready.revision <= accepted) return;
          revisions.set(ready.nodeId, ready.revision);
          appliedRevisions.set(object, revisions);
          const picked = selectRecord(ready.outputs.values);
          switch (picked.kind) {
            case "record":
              writeFrame3d(object, picked.values);
              return;
            case "missing-output":
            case "wrong-kind":
              return;
            default:
              return unreachable(picked);
          }
        }
        case "retain":
        case "gone":
          return;
        default:
          return unreachable(decision);
      }
    },
    applyValues(nodeId, values) {
      write(nodeId, values);
    },
    clear(object) {
      if (object === undefined) return;
      appliedRevisions.delete(object);
    },
  };
}
