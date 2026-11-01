/**
 * One projection all 3D stages share: CSS `perspective: d` scales depth `z` by `d / (d - z)`,
 * and `threeCamera` matches it, so CSS and WebGL drags agree where the goal went. */
export interface PerspectiveView {
  readonly width: number;
  readonly height: number;
  /** Viewer distance, CSS `perspective`, in the frames' pixels. */
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
 * Screen rectangle a stage draws, in the box's unscaled pixels; may exceed the box nearer
 * the viewer. */
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
 * Box pixels a world marker of radius `radius` spans at depth `z`: scaled like its centre, so a
 * nearer handle draws larger. `undefined` at or behind the viewer. */
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
 * Centred frame drawing every `bounds` point plus its world-radius `radius` marker, margin scaled
 * by depth; throws behind the viewer, so no drag target is clipped. */
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
 * `point` with z clamped to `depth` and screen position pulled inside `frame`, so its `radius`
 * marker drawn there lies whole; `depth` must lie in front of the viewer. */
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
 * The three.js camera drawing what the CSS stage draws in `frame`, in y-up space: over the box
 * centre at `(width/2, -height/2, d)`, looking down `-z`, fov spanning the frame. */
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
