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

/**
 * The screen rectangle a stage draws, in the box's own unscaled pixels. It may be larger than the
 * box: a point toward the viewer is drawn outside the box it was authored in.
 */
export interface ScreenFrame {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/** An axis-aligned world region, such as where a drag may put a goal. */
export interface WorldBounds {
  readonly min: Point3;
  readonly max: Point3;
}

/** `d / (d - z)`, or `undefined` at or behind the viewer, where nothing is drawn. */
function depthScale(view: PerspectiveView, z: number): number | undefined {
  const distance = view.perspective - z;
  return distance > 0 ? view.perspective / distance : undefined;
}

/**
 * How many box pixels a marker of world radius `radius` spans when drawn at depth `z`: a marker
 * that lives in the 3D world (a CSS element translated in depth, or a mesh) is scaled by the same
 * perspective as its centre, so a handle toward the viewer is drawn larger than it was authored.
 * `undefined` at or behind the viewer.
 */
export function drawnRadius(view: PerspectiveView, radius: number, z: number): number | undefined {
  const scale = depthScale(view, z);
  return scale === undefined ? undefined : radius * scale;
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
 * The frame, centred on the box, that draws every point of `bounds` with a marker of world radius
 * `radius` around it, so nothing a drag can reach is ever clipped by the stage. The marker is
 * scaled by perspective like its centre (`drawnRadius`), so the margin a corner needs grows toward
 * the viewer; a constant screen margin under-framed the nearest corners by the depth scale.
 *
 * Centred because CSS `perspective-origin` and the three.js camera both look at the box centre; a
 * centred frame keeps them agreeing without an off-axis camera. `bounds` must lie in front of the
 * viewer, which a drag clamp guarantees.
 */
export function frameAround(
  view: PerspectiveView,
  bounds: WorldBounds,
  radius: number,
): ScreenFrame {
  const cx = view.width / 2;
  const cy = view.height / 2;
  let halfWidth = cx;
  let halfHeight = cy;
  for (const x of [bounds.min.x, bounds.max.x])
    for (const y of [bounds.min.y, bounds.max.y])
      for (const z of [bounds.min.z, bounds.max.z]) {
        const screen = projectPoint(view, { x, y, z });
        const margin = drawnRadius(view, radius, z);
        if (screen === undefined || margin === undefined)
          throw new RangeError("Bounds reach behind the viewer.");
        halfWidth = Math.max(halfWidth, Math.abs(screen.x - cx) + margin);
        halfHeight = Math.max(halfHeight, Math.abs(screen.y - cy) + margin);
      }
  return { x: cx - halfWidth, y: cy - halfHeight, width: 2 * halfWidth, height: 2 * halfHeight };
}

/**
 * The point nearest `point` at its (clamped) depth whose marker of world radius `radius`, drawn at
 * that depth (`drawnRadius`), lies whole inside `frame`: a drag can move the goal anywhere the stage
 * draws it whole, and no further. `depth` bounds the depth; it must lie in front of the viewer.
 */
export function clampToFrame(
  view: PerspectiveView,
  frame: ScreenFrame,
  radius: number,
  depth: { readonly min: number; readonly max: number },
  point: Point3,
): Point3 {
  const z = Math.min(depth.max, Math.max(depth.min, point.z));
  const screen = projectPoint(view, { ...point, z });
  const margin = drawnRadius(view, radius, z);
  if (screen === undefined || margin === undefined)
    throw new RangeError("Depth bounds reach behind the viewer.");
  const inside = {
    x: Math.min(frame.x + frame.width - margin, Math.max(frame.x + margin, screen.x)),
    y: Math.min(frame.y + frame.height - margin, Math.max(frame.y + margin, screen.y)),
  };
  if (inside.x === screen.x && inside.y === screen.y) return { ...point, z };
  return unprojectPoint(view, inside, z) ?? { ...point, z };
}

/**
 * The three.js camera that sees exactly what the CSS stage draws in `frame`, in the renderer's
 * y-up space.
 *
 * Frames publish in CSS space (y down, z toward the viewer). A stage that mirrors its rig group by
 * `scale.y = -1` puts world `(x, y, z)` at three.js `(x, -y, z)`, so the camera sits over the box
 * centre at `(width/2, -height/2, d)` looking down `-z`, with the field of view that spans the
 * frame's height at the box plane.
 */
export function threeCamera(
  view: PerspectiveView,
  frame: ScreenFrame,
): {
  readonly fov: number;
  readonly aspect: number;
  readonly position: Point3;
  readonly target: Point3;
} {
  const fov = (2 * Math.atan(frame.height / 2 / view.perspective) * 180) / Math.PI;
  const centre = { x: view.width / 2, y: -view.height / 2 };
  return {
    fov,
    aspect: frame.width / frame.height,
    position: { ...centre, z: view.perspective },
    target: { ...centre, z: 0 },
  };
}
