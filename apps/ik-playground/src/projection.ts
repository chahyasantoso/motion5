/**
 * The one perspective projection every 3D stage on the page shares.
 *
 * CSS `perspective: d` with the default centred `perspective-origin` scales a point at depth `z`
 * about the box centre by `d / (d - z)`; a three.js camera placed at the box centre, `d` in front
 * of it, with a vertical field of view of `2·atan(height / 2d)` projects the same point to the same
 * pixel (`threeCamera` below). So one pair of functions answers both "where is this frame drawn"
 * and "which world point is under this pointer at this depth", and the CSS and WebGL drags cannot
 * disagree about where the goal went.
 */
export interface PerspectiveView {
  readonly width: number;
  readonly height: number;
  /** The viewer distance, CSS `perspective`, in the same pixels as the frames. */
  readonly perspective: number;
}

export interface Point2 {
  readonly x: number;
  readonly y: number;
}

export interface Point3 extends Point2 {
  readonly z: number;
}

/** `d / (d - z)`, or `undefined` at or behind the viewer, where nothing is drawn. */
function depthScale(view: PerspectiveView, z: number): number | undefined {
  const distance = view.perspective - z;
  return distance > 0 ? view.perspective / distance : undefined;
}

/** Where a world point is drawn, in the box's own unscaled pixels. */
export function projectPoint(view: PerspectiveView, point: Point3): Point2 | undefined {
  const scale = depthScale(view, point.z);
  if (scale === undefined) return undefined;
  const cx = view.width / 2;
  const cy = view.height / 2;
  return { x: cx + (point.x - cx) * scale, y: cy + (point.y - cy) * scale };
}

/** The world point drawn at `screen` (box pixels) that lies at depth `z`: `projectPoint`'s inverse. */
export function unprojectPoint(
  view: PerspectiveView,
  screen: Point2,
  z: number,
): Point3 | undefined {
  const scale = depthScale(view, z);
  if (scale === undefined) return undefined;
  const cx = view.width / 2;
  const cy = view.height / 2;
  return { x: cx + (screen.x - cx) / scale, y: cy + (screen.y - cy) / scale, z };
}

/**
 * The three.js camera that sees exactly what the CSS stage draws, in the renderer's y-up space.
 *
 * Frames publish in CSS space (y down, z toward the viewer). A stage that mirrors its rig group by
 * `scale.y = -1` puts world `(x, y, z)` at three.js `(x, -y, z)`, so the camera sits over the box
 * centre at `(width/2, -height/2, d)` looking down `-z`.
 */
export function threeCamera(view: PerspectiveView): {
  readonly fov: number;
  readonly aspect: number;
  readonly position: Point3;
  readonly target: Point3;
} {
  const fov = (2 * Math.atan(view.height / 2 / view.perspective) * 180) / Math.PI;
  const centre = { x: view.width / 2, y: -view.height / 2 };
  return {
    fov,
    aspect: view.width / view.height,
    position: { ...centre, z: view.perspective },
    target: { ...centre, z: 0 },
  };
}
