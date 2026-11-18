import { eulerFromMatrix3d, IDENTITY_MATRIX3, swingFrame3d } from "../geometry/rotation3d";
import { arcLength } from "./arc-length";
import type { Pose3d } from "../fields/pose3d";
import type { Cubic3d } from "../geometry/shapes";
import type { Curve } from "../time/shapes";

type Triple = readonly [number, number, number];

function pointOf(c: Cubic3d, t: number): Triple {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const d = 3 * u * t * t;
  const e = t * t * t;
  return [
    a * c.x0 + b * c.x1 + d * c.x2 + e * c.x3,
    a * c.y0 + b * c.y1 + d * c.y2 + e * c.y3,
    a * c.z0 + b * c.z1 + d * c.z2 + e * c.z3,
  ];
}

function slopeOf(c: Cubic3d, t: number): Triple {
  const u = 1 - t;
  const a = 3 * u * u;
  const b = 6 * u * t;
  const d = 3 * t * t;
  return [
    a * (c.x1 - c.x0) + b * (c.x2 - c.x1) + d * (c.x3 - c.x2),
    a * (c.y1 - c.y0) + b * (c.y2 - c.y1) + d * (c.y3 - c.y2),
    a * (c.z1 - c.z0) + b * (c.z2 - c.z1) + d * (c.z3 - c.z2),
  ];
}

/** A curve of the pose at a share of a 3D path's distance; `face` adds the turn of local +x onto the tangent, no roll. */
export function along3d(
  cubics: readonly Cubic3d[],
  options: { readonly face?: boolean } = {},
): Curve<Pose3d> {
  const segments = [...cubics];
  const face = options.face === true;
  if (segments.length === 0) throw new RangeError("along3d: the path has no segments.");
  const arc = arcLength(segments.length, (index, t) => {
    const c = segments[index];
    if (c === undefined) throw new RangeError("along3d: the path has no segments.");
    return pointOf(c, t);
  });
  return (share) => {
    const { segment, t } = arc.locate(Math.max(0, Math.min(1, share)) * arc.total);
    const cubic = segments[segment];
    if (cubic === undefined) throw new RangeError("along3d: the path has no segments.");
    const [x, y, z] = pointOf(cubic, t);
    if (!face) return { x, y, z };
    const slope = slopeOf(cubic, t);
    const tangent: Triple =
      slope[0] === 0 && slope[1] === 0 && slope[2] === 0
        ? [cubic.x3 - cubic.x0, cubic.y3 - cubic.y0, cubic.z3 - cubic.z0]
        : slope;
    return { x, y, z, ...eulerFromMatrix3d(swingFrame3d(IDENTITY_MATRIX3, tangent)) };
  };
}
