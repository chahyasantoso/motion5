import type { Anchor, Point2d, Pose2d } from "@gerak/core";
import { BufferGeometry, Vector3, type Object3D } from "three";
import { applyObjectOpacity } from "./materials";

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

/** The 2D pose fields `applyPose2d` writes on an object; custom numbers go to the piece's own writer. */
export const WRITTEN_2D = Object.freeze([
  "x",
  "y",
  "rotation",
  "scale",
  "scaleX",
  "scaleY",
  "opacity",
  "anchor",
] as const) satisfies readonly (keyof Pose2d)[];

const NO_PLACE = "A Three.js object has no place for it.";

/** The 2D pose fields `applyPose2d` leaves alone, each with the reason. */
export const UNWRITTEN_2D: Readonly<Partial<Record<keyof Pose2d, string>>> = Object.freeze({
  skewX: NO_PLACE,
  skewY: NO_PLACE,
  blur: NO_PLACE,
  shadowX: NO_PLACE,
  shadowY: NO_PLACE,
  shadowBlur: NO_PLACE,
  hue: NO_PLACE,
  lightness: NO_PLACE,
  tint: NO_PLACE,
  drawn: "A stroke is drawn by the dash of a stylesheet, which an object does not have.",
  drawnFrom: "A stroke is drawn by the dash of a stylesheet, which an object does not have.",
  clipX: "An object is not clipped.",
  clipY: "An object is not clipped.",
  clipRadius: "An object is not clipped.",
  clipWidth: "An object is not clipped.",
  clipHeight: "An object is not clipped.",
  shape: "A path's outline is a DOM attribute, which an object does not have.",
  layer: "Paint order of an object follows the scene's depth, not a layer number.",
});

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
  rest: Point2d = { x: 0, y: 0 },
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
  applyObjectOpacity(object, pose.opacity);
  writeCustom(object, pose.custom, custom);
}
