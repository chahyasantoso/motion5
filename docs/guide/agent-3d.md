# 3D scenes

Read this when the brief is three-dimensional: depth, turns about more than one axis, a camera that moves. A 3D scene
is a code scene like any other; only its poses and its renderer change. Names are in
[the reference](./agent-reference.md#3d-poses).

## The loop

1. `npm run motion:new -- <name> --three` writes a page whose component is a Three.js stage: a renderer, a camera, a
   light and one mesh per target, each bound with `useTarget3d`. It sets no look.
2. Write the scene. It returns `Pose3d` targets: `{ x, y, z, rotation, rotationX, rotationY, scale, scaleX, scaleY,
   scaleZ, opacity }`, y up, turns in degrees, distances in world units, not px.
3. `npm run motion:review -- apps/pieces/src/<name>-scene.ts --jump 1` checks the values: jumps, a short final hold,
   a target still moving at the end. It needs no browser. `--jump` limits a position's step per frame in the scene's
   units, and its default of 150 is for px, so give a 3D scene its own. Give `--turn` (degrees a step) one too, about
   30: its default of 150 lets a bone flip in one step. `--ratio` (scale and opacity) keeps its default.
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
- **A bank into a turn:** a facing turn from `along3d(..., { face: true })` points local +x along the path. Bank with
  `combine3d([facing, { rotationX: bank }])`: it turns after the facing turn, so it rolls about the nose. Writing
  `rotationX` into the facing pose's own fields tilts about the world instead. Read the turn rate from the facing
  turn at two times with `timeAt`, and bank in proportion to it.
- **A camera move:** `const eye = orbit({ target, radius, azimuth: mix(a, b, pan.of(time).progress), elevation });`
  then `camera: { ...eye, ...aim(eye, target) }`. Bind the camera as a target like any mesh.
- **Staging:** move the camera or the subject, rarely both at once. A camera that drifts while the subject leaps hides
  the leap.

## A rigged character

- **The model:** a skinned `.glb` in `apps/pieces/references/`, listed in its README with source, creator and licence
  (CC0, or CC BY with its credit line), under 2 MB. Bone names are the model's own; read them from its joint table.
- **Its joint table:** `npm run motion:joints -- apps/pieces/references/<model>.glb` writes `<model>.joints.json`
  beside it: every bone's world rest point and parent. The scene imports it
  (`import rig from "../references/<model>.joints.json" with { type: "json" }`) and reads joints with
  `jointOf(rig.joints, "Jaw")` from `"@gerak/rig"`, typed by name, throwing on a name the model lacks. The scene runs
  before any page loads the model, so this table is how it rigs one; never copy coordinates by hand.
- **Chains:** `const arm = chainThrough3d([jointOf(...), jointOf(...), jointOf(...)])` answers `{ chain, rest }`;
  each joint but the last starts a bone named after it. `ik3d(arm.chain, { <bone>: goal }, { pole })` reaches a goal
  with the named bone's tip; `pole` is `[x, y, z]` and sets which way the middle joint bends.
  `bonesOf3d(arm.chain, solved)` answers each bone's turn for `applyBones`, `{}` at rest, turns only.
- **A chain under a posed chain:** a chain's base is its first bone's parent, and moves with it. To hang an arm from a
  torso you also pose, solve the torso first and pass `{ base: childBase3d(torso.chain, torsoNow, "<bone>") }` to the
  arm's `ik3d` and use the same base in `bonesOf3d`; nothing else is needed.
- **Bones by hand:** a bone's `Pose3d` turns it about the model's own axes as they were at capture, carried by its
  parents: `{ rotationX: 20 }` on a jaw or a head turns it about the model's x axis whatever way the exporter rolled
  the bone. Return a `bones` target `{ <bone>: Pose3d }`; a bone left out goes back to rest.
- **Writing bones on the page:** after loading with `GLTFLoader` (`three/addons/loaders/GLTFLoader.js`, URL from
  `new URL("../references/<model>.glb", import.meta.url).href`), call `captureSkeleton(gltf.scene)` from
  `"@gerak/three/skeleton"` once, then `player.subscribe("bones", (poses) => applyBones(skeleton, poses))`. Capture
  before moving or turning the model; place the model by a parent group instead.
- **Talking:** drive a jaw bone (`{ rotationX: open * 18 }`) or a morph target from
  `follow({ start: 0, on: { mouthOpen: "value" } })(time, events)`, with the samples (`talk.json`, imported with
  `with { type: "json" }`) exported as `cues`. Morph targets are custom numbers: `morphTargets(gltf.scene)` from
  `"@gerak/three"` is the fourth argument to `applyPose3d`, and `pose.custom` names the targets, clamped to `[0, 1]`.
- **Readiness:** the page entry (`<name>-main.tsx`), not the scene, sets `window.__motionReady` to a promise before
  anything awaits, resolves it once the model has loaded and the first frame has drawn, and rejects it from the
  loader's error callback, so the frame tools fail at once on a missing model instead of timing out.

## Bodies in depth

- **The engine:** `const rapier3d = await rapierEngine3d()` from `"@gerak/rapier"` at the scene module's top level,
  then `simulate(rapier3d(), (world) => { ... })` from `"@gerak/physics"`, as in 2D: `world.setGravity(0, -9.81, 0)`,
  `world.addCollider(...)`, `world.addBody(...)`. Bodies (`Shape3d`) are `"sphere"` or `"box"`; fixed colliders
  (`Collider3d`) are `"floor"`, `"wall"` and `"box"`. World units, y up; spins in degrees a second. `drag` lets a body
  settle before the final hold.
- **A character among bodies:** a character has no collider of its own. Give it fixed `"box"` colliders where its
  feet, legs and body stand, or props settle inside it.
- **Reading a body:** `bodyPose3d(sim.pose("<id>", time))` from `"@gerak/rig"` answers its movement from where it
  was spawned and its turn, as a `Pose3d`. Place its mesh at the body's spawn point and bind it with `useTarget3d`.

## Limits

- No skew and no anchors in `Pose3d`; nest groups instead.
- Euler turns near 90 degrees about x lose a degree of freedom when you write them by hand. Blend through `mixPose3d`,
  never field by field.
- `trailTurn` and `velocity3d` take the scene's time, never `span.of(time, ease)`.
- `smear3d`'s `stretch` is a share per unit a second, where `smear` counts per 1000 px a second: a 3D body moves a
  few units a second.
- Not yet scaffolded: React Three Fiber (`--r3f`).
