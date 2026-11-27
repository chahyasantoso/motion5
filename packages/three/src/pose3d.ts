import type { Point3d, Pose3d } from "@gerak/core";
import { Euler, Quaternion, type EulerOrder, type Material, type Object3D } from "three";
import {
  applyObjectOpacity,
  captureMaterials,
  restoreMaterials,
  type MaterialStore,
} from "./materials";
import { writeCustom, type CustomWriter } from "./pose2d";

/** Three.js Euler order for core's CSS convention (`ZXY`, Rz·Rx·Ry). Core angles are degrees. */
export const EULER_ORDER_3D: EulerOrder = "ZXY";

/** Full rest transform, visibility, and Euler order captured from an `Object3D`. */
export interface Rest3d {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly quaternion: readonly [number, number, number, number];
  readonly scale: readonly [number, number, number];
  readonly visible: boolean;
  readonly order: EulerOrder;
}

const TEMP_EULER = new Euler(0, 0, 0, EULER_ORDER_3D);
const TEMP_REST_QUAT = new Quaternion();
const TEMP_POSE_QUAT = new Quaternion();

function isRest3d(rest: Point3d | Rest3d): rest is Rest3d {
  return "quaternion" in rest;
}

function hasNonIdentityQuaternion(q: readonly [number, number, number, number]): boolean {
  return q[0] !== 0 || q[1] !== 0 || q[2] !== 0 || Math.abs(q[3] - 1) > 1e-12;
}

/** Captures position, rotation quaternion, scale, visibility, and material baseline into `store`. */
export function captureRest3dWithStore(
  object: Object3D,
  sharedMaterials?: ReadonlySet<Material>,
  store?: MaterialStore,
): Rest3d {
  captureMaterials(object, sharedMaterials, store);
  const quaternion: readonly [number, number, number, number] = Object.freeze([
    object.quaternion.x,
    object.quaternion.y,
    object.quaternion.z,
    object.quaternion.w,
  ]);
  const scale: readonly [number, number, number] = Object.freeze([
    object.scale.x,
    object.scale.y,
    object.scale.z,
  ]);
  return Object.freeze({
    x: object.position.x,
    y: object.position.y,
    z: object.position.z,
    quaternion,
    scale,
    visible: object.visible,
    order: object.rotation.order,
  });
}

/** Captures position, rotation quaternion, scale, visibility, and material baseline of `object`. */
export function captureRest3d(object: Object3D, sharedMaterials?: ReadonlySet<Material>): Rest3d {
  return captureRest3dWithStore(object, sharedMaterials);
}

/** Restores `object` to its captured `Rest3d` transform, visibility, and materials in `store`. */
export function restoreRest3dWithStore(
  object: Object3D,
  rest: Rest3d,
  store?: MaterialStore,
): void {
  object.position.set(rest.x, rest.y, rest.z);
  object.rotation.order = rest.order;
  object.quaternion.set(
    rest.quaternion[0],
    rest.quaternion[1],
    rest.quaternion[2],
    rest.quaternion[3],
  );
  object.scale.set(rest.scale[0], rest.scale[1], rest.scale[2]);
  object.visible = rest.visible;
  restoreMaterials(object, store);
}

/** Restores `object` to its captured `Rest3d` transform, visibility, and materials. */
export function restoreRest3d(object: Object3D, rest: Rest3d): void {
  restoreRest3dWithStore(object, rest);
}

/** Sole degrees-to-radians owner for `ZXY`; angles reduce mod 360. */
export function setEulerDegrees(
  target: Euler,
  rotation: number,
  rotationX: number,
  rotationY: number,
): Euler {
  return target.set(
    ((rotationX % 360) * Math.PI) / 180,
    ((rotationY % 360) * Math.PI) / 180,
    ((rotation % 360) * Math.PI) / 180,
    EULER_ORDER_3D,
  );
}

/** The 3D pose fields `applyPose3d` writes on an object; custom numbers go to the piece's own writer. */
export const WRITTEN_3D = Object.freeze([
  "x",
  "y",
  "z",
  "rotation",
  "rotationX",
  "rotationY",
  "scale",
  "scaleX",
  "scaleY",
  "scaleZ",
  "opacity",
] as const) satisfies readonly (keyof Pose3d)[];

/** The 3D pose fields `applyPose3d` leaves alone, each with the reason; it writes every one. */
export const UNWRITTEN_3D: Readonly<Partial<Record<keyof Pose3d, string>>> = Object.freeze({});

/** Writes a `Pose3d` on an object using `store` for material opacity isolation. */
export function applyPose3dWithStore(
  object: Object3D,
  pose: Pose3d,
  rest: Point3d | Rest3d = { x: 0, y: 0, z: 0 },
  custom?: CustomWriter,
  store?: MaterialStore,
): void {
  const all = pose.scale ?? 1;
  object.position.set(rest.x + (pose.x ?? 0), rest.y + (pose.y ?? 0), rest.z + (pose.z ?? 0));
  if (isRest3d(rest) && hasNonIdentityQuaternion(rest.quaternion)) {
    setEulerDegrees(TEMP_EULER, pose.rotation ?? 0, pose.rotationX ?? 0, pose.rotationY ?? 0);
    TEMP_POSE_QUAT.setFromEuler(TEMP_EULER);
    TEMP_REST_QUAT.set(
      rest.quaternion[0],
      rest.quaternion[1],
      rest.quaternion[2],
      rest.quaternion[3],
    );
    object.rotation.order = EULER_ORDER_3D;
    object.quaternion.multiplyQuaternions(TEMP_REST_QUAT, TEMP_POSE_QUAT);
  } else {
    setEulerDegrees(object.rotation, pose.rotation ?? 0, pose.rotationX ?? 0, pose.rotationY ?? 0);
  }
  const [rx, ry, rz] = isRest3d(rest) ? rest.scale : [1, 1, 1];
  object.scale.set(
    rx * all * (pose.scaleX ?? 1),
    ry * all * (pose.scaleY ?? 1),
    rz * all * (pose.scaleZ ?? 1),
  );
  applyObjectOpacity(object, pose.opacity, store);
  writeCustom(object, pose.custom, custom);
}

/** Writes a `Pose3d` on an object: y up, degrees on Z-X-Y; a missing field writes its rest, and each
 * custom number goes to `custom(name, value, object)`. */
export function applyPose3d(
  object: Object3D,
  pose: Pose3d,
  rest: Point3d | Rest3d = { x: 0, y: 0, z: 0 },
  custom?: CustomWriter,
): void {
  applyPose3dWithStore(object, pose, rest, custom);
}
