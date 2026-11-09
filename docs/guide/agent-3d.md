# 3D scenes

Read this when the brief is three-dimensional: depth, turns about more than one axis, a camera that moves. A 3D scene
is a code scene like any other; only its poses and its renderer change. Names are in
[the reference](./agent-reference.md#3d-poses). `apps/react-demo/src/principles3d-scene.ts` uses most of what follows.

## The loop

1. `npm run motion:new -- <name> --three` writes a page whose component is a Three.js stage: a renderer, a camera, a
   light and one mesh per target, each bound with `useTarget3d`. It sets no look.
2. Write the scene. It returns `Pose3d` targets: `{ x, y, z, rotation, rotationX, rotationY, scale, scaleX, scaleY,
   scaleZ, opacity }`, y up, turns in degrees, distances in world units, not px.
3. `npm run motion:review -- apps/react-demo/src/<name>-scene.ts --jump 1` checks the values: jumps, a short final hold,
   a target still moving at the end. It needs no browser. `--jump` limits a position's step per frame in the scene's
   units, and its default of 150 is for px, so give a 3D scene its own; `--turn` (degrees) and `--ratio` (scale and
   opacity) keep their defaults.
4. `npm run motion:review -- <name>.html --watch canvas --to <ms>` gives the frame sheet. Read it: the page tools see
   no element inside a canvas, so the sheet is how you see framing, silhouettes and whether the motion reads.

## Poses

- `rotation` turns about z, `rotationX` about x, `rotationY` about y, in that order (Z-X-Y). Blend poses with
  `mixPose3d` and stack them with `combine3d`. Both turn through real rotations, so a pose never flips when two axes
  turn. To spin past a full turn, mix the angle itself: `mixPose3d` takes the short way.
- A pivot is the object's origin. To turn or squash about another point, put the mesh in a group and pose the group.
- Every 2D move works in 3D through `lift2d(pose, { unitsPerPx })`: it scales px to units and flips y. A `Pose2d` passed
  as a `Pose3d` does not compile.
- In React, `useTarget3d(player, "name")` gives a ref for any `Object3D`, plain Three.js or React Three Fiber. The
  object's position when it binds is its rest, as an element's layout is in 2D; turns and scales are written whole.
  With `frameloop="demand"` pass R3F's `invalidate`.

## The principles in 3D

| Principle | Use |
| --- | --- |
| Squash and stretch | `squashed3d(squash, weight, axis)` keeps volume; `smear3d(velocity3d(...), { stretch, max })` stretches along travel |
| Anticipation | `squashed3d` on a span before the move, then `backEase({ amount, direction: "in" })` on a `mix` |
| Arcs | `along3d(toCubics3d(anchors), share, { face })`; `face` points local +x along the path |
| Follow-through | `trailTurn(signal, { damping })` for a turn, the short way round; three `trail` calls for a position |
| Staging | the camera is the stage: `orbit` places it, `aim` points it, a `span` moves it |
| Stagger, timing, eases, settle | `lanes`, `span`, `ease`, `springEase`, as in 2D |

- **A smear on a body that must keep its face:** an outer group takes `smear3d(...).pose` and the mesh inside takes
  `turn`. Reversing travel never flips the stretch.
- **A camera move:** `const eye = orbit({ target, radius, azimuth: mix(a, b, pan.of(time).progress), elevation });`
  then `camera: { ...eye, ...aim(eye, target) }`. Bind the camera as a target like any mesh.
- **Staging:** move the camera or the subject, rarely both at once. A camera that drifts while the subject leaps hides
  the leap.

## Limits

- No skew and no anchors in `Pose3d`; nest groups instead.
- Euler turns near 90 degrees about x lose a degree of freedom when you write them by hand. Blend through `mixPose3d`,
  never field by field.
- `trailTurn` and `velocity3d` take the scene's time, never `span.of(time, ease)`.
- `smear3d`'s `stretch` counts per 1000 units a second, and a 3D body moves a few units a second, so useful values
  are large: the worked example uses 75.
- Not yet for code scenes: 3D rigs, a skinned mesh's bones, 3D physics.
