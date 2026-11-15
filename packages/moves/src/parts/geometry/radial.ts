import { definePart } from "../contract";
/** Where a point `distance` away sits at `angle` degrees clockwise from the right, with y pointing down. */
export function radial(angle: number, distance: number): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  return { x: distance * Math.cos(radians), y: distance * Math.sin(radians) };
}
definePart({ kind: "geometry" }, radial);
