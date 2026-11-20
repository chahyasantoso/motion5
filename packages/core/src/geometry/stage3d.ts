import { eulerFromMatrix3d, matrixFromEuler3d, type Matrix3, type Vec3 } from "./rotation3d";
import type { Point3d } from "./shapes";
import type { Pose3d } from "../fields/pose3d";

const EPSILON = 1e-9;

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}

function unit(v: Vec3): Vec3 | undefined {
  const size = Math.hypot(v[0], v[1], v[2]);
  return size > EPSILON ? [v[0] / size, v[1] / size, v[2] / size] : undefined;
}

/** The turn that points local -z (a camera's forward) from `from` at `to`, `up` +y when absent, no
 * roll; `{}` when they meet. */
export function aim(from: Point3d, to: Point3d, up: Point3d = { x: 0, y: 1, z: 0 }): Pose3d {
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
  readonly target: Point3d;
  readonly radius: number;
  readonly azimuth: number;
  readonly elevation: number;
}): Point3d {
  const azimuth = (options.azimuth * Math.PI) / 180;
  const elevation = (options.elevation * Math.PI) / 180;
  const flat = options.radius * Math.cos(elevation);
  return {
    x: options.target.x + flat * Math.sin(azimuth),
    y: options.target.y + options.radius * Math.sin(elevation),
    z: options.target.z + flat * Math.cos(azimuth),
  };
}

/** A camera for `project3d`: where it is and how it turns, as a `Pose3d` whose scale is ignored, and its vertical
 * field of view in degrees. */
export type Lens3d = Pose3d & { readonly fov: number };

/** Where a world point lands on a stage, in px from its top left, as a perspective camera draws it; `depth` runs
 * along the view, and `visible` is false behind the lens. */
export function project3d(
  point: Point3d,
  lens: Lens3d,
  stage: { readonly width: number; readonly height: number },
): { readonly x: number; readonly y: number; readonly depth: number; readonly visible: boolean } {
  if (!(lens.fov > 0 && lens.fov < 180))
    throw new RangeError("project3d: fov must be above 0 and below 180.");
  if (![point.x, point.y, point.z].every(Number.isFinite))
    throw new RangeError("project3d: the point must be finite.");
  if (!(stage.width > 0 && stage.height > 0))
    throw new RangeError("project3d: the stage needs a size.");
  const turn = matrixFromEuler3d({
    rotation: lens.rotation ?? 0,
    rotationX: lens.rotationX ?? 0,
    rotationY: lens.rotationY ?? 0,
  });
  const dx = point.x - (lens.x ?? 0);
  const dy = point.y - (lens.y ?? 0);
  const dz = point.z - (lens.z ?? 0);
  const right = turn[0] * dx + turn[3] * dy + turn[6] * dz;
  const up = turn[1] * dx + turn[4] * dy + turn[7] * dz;
  const depth = -(turn[2] * dx + turn[5] * dy + turn[8] * dz);
  const focal = 1 / Math.tan((lens.fov * Math.PI) / 360);
  const aspect = stage.width / stage.height;
  const across = depth > EPSILON ? (right * focal) / (aspect * depth) : 0;
  const down = depth > EPSILON ? (up * focal) / depth : 0;
  return {
    x: ((across + 1) / 2) * stage.width + 0,
    y: ((1 - down) / 2) * stage.height + 0,
    depth,
    visible: depth > EPSILON,
  };
}

/** The world point that `project3d` draws at `point` on the stage, `depth` along the view from the lens. */
export function unproject3d(
  point: { readonly x: number; readonly y: number },
  lens: Lens3d,
  stage: { readonly width: number; readonly height: number },
  depth: number,
): Point3d {
  if (!(lens.fov > 0 && lens.fov < 180))
    throw new RangeError("unproject3d: fov must be above 0 and below 180.");
  if (!(depth > EPSILON) || !Number.isFinite(depth))
    throw new RangeError("unproject3d: depth must be in front of the lens.");
  if (!(stage.width > 0 && stage.height > 0))
    throw new RangeError("unproject3d: the stage needs a size.");
  const turn = matrixFromEuler3d({
    rotation: lens.rotation ?? 0,
    rotationX: lens.rotationX ?? 0,
    rotationY: lens.rotationY ?? 0,
  });
  const focal = 1 / Math.tan((lens.fov * Math.PI) / 360);
  const aspect = stage.width / stage.height;
  const across = (point.x / stage.width) * 2 - 1;
  const down = 1 - (point.y / stage.height) * 2;
  const right = (across * aspect * depth) / focal;
  const up = (down * depth) / focal;
  const back = -depth;
  return {
    x: (lens.x ?? 0) + turn[0] * right + turn[1] * up + turn[2] * back,
    y: (lens.y ?? 0) + turn[3] * right + turn[4] * up + turn[5] * back,
    z: (lens.z ?? 0) + turn[6] * right + turn[7] * up + turn[8] * back,
  };
}
