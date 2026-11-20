import type { Point2d } from "./shapes";

/** Where a point `distance` away sits at `angle` degrees clockwise from the right, with y pointing down. */
export function radial(angle: number, distance: number): Point2d {
  const radians = (angle * Math.PI) / 180;
  return { x: distance * Math.cos(radians), y: distance * Math.sin(radians) };
}
