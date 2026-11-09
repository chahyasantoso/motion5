import { readFrame3d } from "@motion5/rig";
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

export { applyPose2d } from "./pose2d";
