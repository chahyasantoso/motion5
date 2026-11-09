# ADR-169: A 3D pose for code scenes

**Status:** Accepted, 2026-11-09

## Context

Code scenes have `Pose2d`, and `applyPose2d` writes it on a Three.js object's plane. A Three.js scene that moves
in depth, turns about more than one axis, or keeps a body's volume has no pose to say it. Rig already owns 3D
orientation: Euler `{ rotation, rotationX, rotationY }` in degrees, `ZXY`, with quaternion blending. ADR-168's tools
for motion principles are numbers, so most of them already work in 3D.

## Decision

- `Pose3d` lives in `@motion5/moves` beside `Pose2d`: `{ x, y, z, rotation, rotationX, rotationY, scale, scaleX,
  scaleY, scaleZ, opacity }`, all optional, with turns in degrees on rig's `ZXY` Euler. Rig stays the one owner of
  3D orientation math. Moves calls it and adds no quaternion code.
- `y` is up, as in Three.js. Field names match `Pose2d` and mean the same, apart from the axis direction and the
  unit.
- `Pose3d` declares `anchor?: never`, so TypeScript refuses a `Pose2d` where a `Pose3d` goes.
  `lift2d(pose, { unitsPerPx })` is the one conversion: it scales, flips `y` and the turn, and drops the anchor.
- `combine3d` adds offsets and multiplies scales. Turns from a single pose pass through exactly, and turns about one
  shared axis add exactly, so a spin keeps its winding. Any other turns compose as rotations, in list order.
  `mixPose3d` blends turns along the short arc. Neither ever adds Euler angles across different axes.
- A 3D pivot is the object's origin. A pivot elsewhere is a parent group. `squashed3d` names the axis it shortens.
- A stretch along a 3D direction uses an outer object turned to it and an inner object turned back, as in 2D.
- `useTarget3d` lives in a `@motion5/three/react` entry, so `@motion5/react` never depends on three. It works in
  plain Three.js and in React Three Fiber.
- The page tools learn nothing about WebGL. A 3D scene is checked from its sampled values and its frame sheet.

## Consequences

Every 2D move reaches a 3D scene through `lift2d`. A turned composite comes back canonical in `(-180, 180]` on each
axis. A spin wider than a turn survives only on one axis, which `combine3d` keeps exact. Core and plugins are
untouched.

## Rejected

- One pose type for both: page y points down, px are not world units, and a silent mix moves things the wrong way.
- Quaternions as the authored form: harder to write by hand; rig converts at the edges instead.
- Adding Euler angles field by field: the result flips once two axes turn.
- `anchor` in `Pose3d`: a box anchor has no single meaning in depth, and a parent group does it exactly.
