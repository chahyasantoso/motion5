import type { Anchor, POSE_2D_FIELDS, Pose2d } from "@gerak/moves";
import { BufferGeometry, Vector3, type Object3D } from "three";

/** The anchor's point on the object's own geometry box, in its local space, y up; the origin without geometry. */
function pivotOf(object: Object3D, anchor: Anchor): Vector3 {
  const geometry: unknown = Reflect.get(object, "geometry");
  if (!(geometry instanceof BufferGeometry)) return new Vector3();
  if (geometry.boundingBox === null) geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  if (box === null) return new Vector3();
  const centre = box.getCenter(new Vector3());
  switch (anchor) {
    case "center":
      return centre;
    case "bottom":
      return new Vector3(centre.x, box.min.y, 0);
    case "top":
      return new Vector3(centre.x, box.max.y, 0);
    case "left":
      return new Vector3(box.min.x, centre.y, 0);
    case "right":
      return new Vector3(box.max.x, centre.y, 0);
    default: {
      const unknown: never = anchor;
      throw new TypeError(`Unknown anchor: ${JSON.stringify(unknown)}`);
    }
  }
}

/** The pose fields a Three.js object has a place for; it leaves blur, the stroke, the clip and the layer alone. */
export const THREE_POSE_FIELDS = Object.freeze([
  "x",
  "y",
  "rotation",
  "scale",
  "scaleX",
  "scaleY",
  "opacity",
  "anchor",
] as const) satisfies readonly (typeof POSE_2D_FIELDS)[number][];

/** Where a piece puts a custom number on an object; the renderer knows no meaning for it. */
export type CustomWriter = (name: string, value: number, object: Object3D) => void;

/** Hands each custom number of a value to the piece's `custom` writer, when it gives one. */
export function writeCustom(
  object: Object3D,
  values: Readonly<Record<string, number>> | undefined,
  custom: CustomWriter | undefined,
): void {
  if (custom === undefined) return;
  for (const [name, value] of Object.entries(values ?? {})) custom(name, value, object);
}

/** Writes a 2D pose on an object: y and rotation flip for its axes; calls `custom(name, value, object)`
 * for each custom number; leaves blur, stroke, clip and layer alone. */
export function applyPose2d(
  object: Object3D,
  pose: Pose2d,
  rest: { readonly x: number; readonly y: number } = { x: 0, y: 0 },
  custom?: CustomWriter,
): void {
  const scaleX = (pose.scale ?? 1) * (pose.scaleX ?? 1);
  const scaleY = (pose.scale ?? 1) * (pose.scaleY ?? 1);
  const turn = -(((pose.rotation ?? 0) % 360) * Math.PI) / 180;
  object.scale.set(scaleX, scaleY, object.scale.z);
  object.rotation.z = turn;
  const pivot = pivotOf(object, pose.anchor ?? "center");
  const moved = pivot.clone().multiply(new Vector3(scaleX, scaleY, 1));
  moved.applyAxisAngle(new Vector3(0, 0, 1), turn);
  object.position.set(
    rest.x + (pose.x ?? 0) + pivot.x - moved.x,
    rest.y - (pose.y ?? 0) + pivot.y - moved.y,
    object.position.z,
  );
  if (pose.opacity !== undefined) {
    const material: unknown = Reflect.get(object, "material");
    if (material !== null && typeof material === "object" && "opacity" in material) {
      Reflect.set(material, "opacity", pose.opacity);
      Reflect.set(material, "transparent", true);
    }
  }
  writeCustom(object, pose.custom, custom);
}
