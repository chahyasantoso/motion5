import type { Patch } from "@motion5/core";
// The render decision and the never sink have one owner each in core, reached through the same
// first-party channel `@motion5/react` reads them from, rather than restated here (ADR-094,
// ADR-099).
import { patchRender, unreachable } from "@motion5/core/internal";
import { readFrame3d } from "@motion5/plugins/frame3d";
import type { EulerOrder, Object3D } from "three";

/**
 * The three.js Euler order for exactly core's CSS convention (`frame3d.ts`): `ZXY` composes
 * Rz·Rx·Ry.
 * Core angles are degrees; three.js angles are radians.
 */
export const EULER_ORDER_3D: EulerOrder = "ZXY";

/**
 * Writes a published 3D world frame onto an Object3D.
 *
 * Core's frame reader treats an absent key or a non-finite number as `0`. The frame's angles
 * arrive in degrees, while three.js expects radians. fk3d publishes world frames, not
 * parent-relative ones, so a bound object must live in the space of the rig root, for example as a
 * direct child of an untransformed scene or group.
 */
export function writeFrame3d(object: Object3D, values: Readonly<Record<string, unknown>>): void {
  const frame = readFrame3d(values);
  object.position.set(frame.x, frame.y, frame.z);
  object.rotation.set(
    (frame.rotationX * Math.PI) / 180,
    (frame.rotationY * Math.PI) / 180,
    (frame.rotation * Math.PI) / 180,
    EULER_ORDER_3D,
  );
}

/** An adapter that applies core patches and caller-derived values to resolved Three.js objects. */
export type Object3dPatchAdapter = {
  apply(patch: Patch): void;
  /**
   * Writes caller-derived values onto the object resolved for `nodeId`, without fabricating a
   * patch status or revision. Freshness and derivation belong to the caller, as in core's DOM
   * adapter.
   */
  applyValues(nodeId: string, values: Readonly<Record<string, unknown>>): void;
  /**
   * Clears this adapter's revision state for a resolved object so a retained patch can re-pose a
   * rebound object, matching the DOM adapter's target lifecycle protocol.
   */
  clear(object?: Object3D): void;
};

/**
 * Creates a patch adapter for Three.js objects resolved by core node id.
 *
 * Retained and gone decisions deliberately write nothing: retained objects keep their last render,
 * while scene-graph ownership and removal remain with the caller.
 */
export function createObject3dPatchAdapter(
  resolve: (nodeId: string) => Object3D | undefined,
): Object3dPatchAdapter {
  const write = (nodeId: string, values: Readonly<Record<string, unknown>>): void => {
    const object = resolve(nodeId);
    if (object !== undefined) writeFrame3d(object, values);
  };
  // Keep this local: sharing it would require widening this slice into the already-tested DOM
  // adapter, while a generic helper adds no semantic value for this tiny target/node protocol.
  // Both adapters accept revisions per resolved target and node, and clear drops that target state.
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
          writeFrame3d(object, ready.values);
          return;
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
