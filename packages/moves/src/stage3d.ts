import { eulerFromMatrix3d, type Matrix3, type Vec3 } from "@motion5/rig";
import type { Pose3d } from "./pose3d";

type Point3 = { readonly x: number; readonly y: number; readonly z: number };

const EPSILON = 1e-9;

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function unit(v: Vec3): Vec3 | undefined {
  const size = Math.hypot(v[0], v[1], v[2]);
  return size > EPSILON ? [v[0] / size, v[1] / size, v[2] / size] : undefined;
}

/** The turn that points local -z (a camera's forward) from `from` at `to`, `up` keeping the horizon, no roll. */
export function aim(from: Point3, to: Point3, up: Point3 = { x: 0, y: 1, z: 0 }): Pose3d {
  const forward = unit([to.x - from.x, to.y - from.y, to.z - from.z]);
  if (forward === undefined) return {};
  const back: Vec3 = [-forward[0], -forward[1], -forward[2]];
  const candidates: readonly Vec3[] = [
    [up.x, up.y, up.z],
    [0, 0, -1],
    [1, 0, 0],
  ];
  let right: Vec3 | undefined;
  for (const candidate of candidates) {
    right = unit(cross(forward, candidate));
    if (right !== undefined) break;
  }
  if (right === undefined) return {};
  const top = cross(back, right);
  const matrix: Matrix3 = [
    right[0],
    top[0],
    back[0],
    right[1],
    top[1],
    back[1],
    right[2],
    top[2],
    back[2],
  ];
  const turn = eulerFromMatrix3d(matrix);
  return { rotation: turn.rotation, rotationX: turn.rotationX, rotationY: turn.rotationY };
}

/** A point `radius` from `target`: azimuth about +y from +z toward +x, elevation up from the xz plane, degrees. */
export function orbit(options: {
  readonly target: Point3;
  readonly radius: number;
  readonly azimuth: number;
  readonly elevation: number;
}): { readonly x: number; readonly y: number; readonly z: number } {
  const azimuth = (options.azimuth * Math.PI) / 180;
  const elevation = (options.elevation * Math.PI) / 180;
  const flat = options.radius * Math.cos(elevation);
  return {
    x: options.target.x + flat * Math.sin(azimuth),
    y: options.target.y + options.radius * Math.sin(elevation),
    z: options.target.z + flat * Math.cos(azimuth),
  };
}
