import type { Pose3d } from "@motion5/moves";
import { Euler, type EulerOrder, type Object3D } from "three";

/** Three.js Euler order for core's CSS convention (`ZXY`, Rz·Rx·Ry). Core angles are degrees. */
export const EULER_ORDER_3D: EulerOrder = "ZXY";

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

/** Writes a 3D pose on an object: y up, turns in degrees on `ZXY`; a missing field writes its rest. */
export function applyPose3d(
  object: Object3D,
  pose: Pose3d,
  rest: { readonly x: number; readonly y: number; readonly z: number } = { x: 0, y: 0, z: 0 },
): void {
  const all = pose.scale ?? 1;
  object.position.set(rest.x + (pose.x ?? 0), rest.y + (pose.y ?? 0), rest.z + (pose.z ?? 0));
  setEulerDegrees(object.rotation, pose.rotation ?? 0, pose.rotationX ?? 0, pose.rotationY ?? 0);
  object.scale.set(all * (pose.scaleX ?? 1), all * (pose.scaleY ?? 1), all * (pose.scaleZ ?? 1));
  if (pose.opacity !== undefined) {
    const material: unknown = Reflect.get(object, "material");
    if (material !== null && typeof material === "object" && "opacity" in material) {
      Reflect.set(material, "opacity", pose.opacity);
      Reflect.set(material, "transparent", true);
    }
  }
}
