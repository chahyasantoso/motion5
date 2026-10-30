import type { Patch } from "@motion5/core";
// Render decision and never sink belong to core; read through the same internal channel.
import { patchRender, selectRecord, unreachable } from "@motion5/core/internal";
import { readFrame3d } from "@motion5/plugins/frame3d";
import { Euler, Matrix4, Quaternion, Vector3, type EulerOrder, type Object3D } from "three";

/** Three.js Euler order for core's CSS convention (`ZXY`, Rz·Rx·Ry). Core angles are degrees. */
export const EULER_ORDER_3D: EulerOrder = "ZXY";

/** writeFrame3d: published world frame onto an Object3D; absent or non-finite values read as `0`; degrees in, radians out; object must live in rig-root space. */
const DEGREES = 180 / Math.PI;
const scratchEuler = new Euler();
const scratchQuaternion = new Quaternion();
const scratchScale = new Vector3();

/** Sole degrees-to-radians owner for `ZXY`; angles reduce mod 360. */
function frameEuler(frame: ReturnType<typeof readFrame3d>, target: Euler): Euler {
  return target.set(
    ((frame.rotationX % 360) * Math.PI) / 180,
    ((frame.rotationY % 360) * Math.PI) / 180,
    ((frame.rotation % 360) * Math.PI) / 180,
    EULER_ORDER_3D,
  );
}

/** Frame values to a rigid matrix in the frame's own space. */
export function frameToMatrix(values: Readonly<Record<string, unknown>>, target: Matrix4): Matrix4 {
  const frame = readFrame3d(values);
  target.makeRotationFromEuler(frameEuler(frame, scratchEuler));
  return target.setPosition(frame.x, frame.y, frame.z);
}

/** Inverse of `frameToMatrix`: rigid matrix to published frame values; scale ignored. */
export function frameFromMatrix(matrix: Matrix4): Readonly<Record<string, number>> {
  const position = new Vector3();
  matrix.decompose(position, scratchQuaternion, scratchScale);
  const euler = scratchEuler.setFromQuaternion(scratchQuaternion, EULER_ORDER_3D);
  return {
    x: position.x,
    y: position.y,
    z: position.z,
    rotation: euler.z * DEGREES,
    rotationX: euler.x * DEGREES,
    rotationY: euler.y * DEGREES,
  };
}

export function writeFrame3d(object: Object3D, values: Readonly<Record<string, unknown>>): void {
  const frame = readFrame3d(values);
  object.position.set(frame.x, frame.y, frame.z);
  frameEuler(frame, object.rotation);
}

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
