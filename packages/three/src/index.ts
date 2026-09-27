import type { Patch } from "@motion5/core";
// The render decision and the never sink have one owner each in core, reached through the same
// first-party channel `@motion5/react` reads them from, rather than restated here (ADR-094,
// ADR-099).
import { patchRender, unreachable } from "@motion5/core/internal";
import type { EulerOrder, Object3D } from "three";

/**
 * The three.js Euler order for exactly core's CSS convention (`frame3d.ts`): `ZXY` composes
 * Rz·Rx·Ry.
 * Core angles are degrees; three.js angles are radians.
 */
export const EULER_ORDER_3D: EulerOrder = "ZXY";

function readFrameNumber(values: Readonly<Record<string, unknown>>, key: string): number {
  const value = values[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

/**
 * Writes a published 3D world frame onto an Object3D.
 *
 * This mirrors core's frame reader: an absent key or a non-finite number reads as `0`. The frame's
 * angles arrive in degrees, while three.js expects radians. fk3d publishes world frames, not
 * parent-relative ones, so a bound object must live in the space of the rig root, for example as a
 * direct child of an untransformed scene or group.
 */
export function writeFrame3d(object: Object3D, values: Readonly<Record<string, unknown>>): void {
  object.position.set(
    readFrameNumber(values, "x"),
    readFrameNumber(values, "y"),
    readFrameNumber(values, "z"),
  );
  object.rotation.set(
    (readFrameNumber(values, "rotationX") * Math.PI) / 180,
    (readFrameNumber(values, "rotationY") * Math.PI) / 180,
    (readFrameNumber(values, "rotation") * Math.PI) / 180,
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

  return {
    apply(patch) {
      const decision = patchRender(patch);
      switch (decision.kind) {
        case "render":
          write(decision.patch.nodeId, decision.patch.values);
          return;
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
  };
}
