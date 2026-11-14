# 3D scenes

Read this when the brief is three-dimensional: depth, turns about more than one axis, a camera that moves. A 3D scene
is a code scene like any other; only its poses and its renderer change. Names are in
[the reference](./agent-reference.md#3d-poses).

## The loop

1. `npm run motion:new -- <name> --three` writes a page whose component is a Three.js stage: a renderer, a camera, a
   light and one mesh per target, each bound with `useTarget3d`, and an entry that owns the page's readiness. It
   sets no look. A scene that plays samples takes `(time, events)`, exports `cues`, and its component passes them as
   `usePlayer(scene, clock, cues)`.
2. Write the scene. It returns `Pose3d` targets: `{ x, y, z, rotation, rotationX, rotationY, scale, scaleX, scaleY,
   scaleZ, opacity }`, y up, turns in degrees, distances in world units, not px.
3. `npm run motion:review -- apps/pieces/src/<name>-scene.ts --jump 1` checks the values: jumps, a short final hold,
   a target still moving at the end. It needs no browser. `--jump` limits a position's step per frame in the scene's
   units, and its default of 150 is for px, so give a 3D scene its own, about a fifth of the subject's height: 0.1
   for a character 0.5 units tall. Give `--turn` (degrees a step) one too, about 30: its default of 150 lets a bone
   flip in one step. `--ratio` (scale and opacity) keeps its default.
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
  with the named bone's tip. A goal is `{ x, y, z }`, with `influence` (0 to 1) to pull it only partly; options are
  `{ pole, base }`. `pole` is `[x, y, z]`, a point on the side the middle joint bends towards; without one, the chain
  bends in its rest plane (a chain straight at rest has none), and a goal at rest answers the rest exactly. No bone
  twists about its own length, except in a chain with joint limits or a bone offset from its parent's tip, solved as
  is, and a bone given an `orient` goal. Keep goals within reach: an arm at full
  stretch snaps when its goal comes back in reach, and a pole on the far side flips the elbow on the first solve.
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
  anything awaits, resolves it once the model has loaded and the component has rendered one frame synchronously
  (never from `requestAnimationFrame`: the page tools pause the clock), and rejects it from the loader's error
  callback, so the frame tools fail at once on a missing model instead of timing out.

## Bodies in depth

- **The engine:** `const rapier3d = await rapierEngine3d()` from `"@gerak/rapier"` at the scene module's top level,
  then `simulate(rapier3d(), (world) => { ... })` from `"@gerak/physics"`, as in 2D: `world.setGravity(0, -9.81, 0)`,
  `world.addCollider(...)`, `world.addBody(...)`. World units, y up.
  - A body: `{ id, shape, x, y, z }`, with `vx`, `vy`, `vz`, a starting `rotation` quaternion `{ w, x, y, z }`, spins
    `wx`, `wy`, `wz` in degrees a second, `drag` (damping, so it settles before the final hold), `mass`,
    `fixedRotation`, `restitution` and `friction`. `shape` is `{ kind: "sphere", radius }` or
    `{ kind: "box", width, height, depth }`.
  - A fixed collider: `{ kind: "floor", y }`, `{ kind: "wall", axis: "x" | "z", at, side: "min" | "max" }` (a wall at
    `at` keeping bodies on its `side`), or `{ kind: "box", x, y, z, width, height, depth }`; a surface
    `{ restitution, friction }` is the third argument.
  - A tumbling body turns fast: lower drops, smaller spins and less bounce keep it within `--turn`.
- **A character among bodies:** a character has no collider of its own. Give it fixed `"box"` colliders where its
  feet, legs and body stand, or props settle inside it.
- **Reading a body:** `bodyPose3d(sim.pose("<id>", time))` from `"@gerak/rig"` answers its movement from where it
  was spawned and its turn, as a `Pose3d`. Place its mesh at the body's spawn point and bind it with `useTarget3d`.
- **The camera's rest:** `useTarget3d` takes an object's position when it binds as its rest, so a camera posed by
  `orbit`, which answers absolute points, binds at the origin.

## 2D over 3D

Words, captions and callouts over a 3D scene are DOM targets in the same scene, pinned by the scene itself, so they
sample, review and scrub with everything else.

- **The lens is the scene's.** Export `stage = { width, height }` and `lens: Lens3d` (a camera `Pose3d` plus `fov`,
  vertical degrees), or a `lens` target if the camera moves. The page builds its `PerspectiveCamera` from them and
  sizes its renderer and stage from `stage`; it holds no number of its own. A page with its own `fov` drifts every
  label.
- **A point to pixels:** `project3d(point, lens, stage)` from `"@gerak/moves"` answers `{ x, y, depth, visible }`,
  px from the stage's top left. Return `{ x, y, opacity }` for the label; the element's top-left corner lands there,
  so offset it in CSS to centre a bubble or put its tail on the point.
- **A point on a moving object:** turn and move the point with the object's pose in the scene before projecting. A
  joint of a posed model: `posedJoints3d(rig.joints, bones, root)` from `"@gerak/rig"` answers every joint's world
  point under the same `bones` the scene returns, `root` being the pose of the model's parent group.
- **Hiding:** a label whose point is behind the lens (`visible: false`) or turned to the far side of its object
  (`depth` greater than the object centre's) fades out over a few frames; never pop it.
- **Drawing on the step:** the page renders once when built, then whenever a target it binds is written: pass a
  render function as `useTarget3d`'s `invalidate`, or render inside `player.subscribe`. A free-running
  `requestAnimationFrame` loop can show the canvas a step behind the labels.
- **Text from samples:** reveal a caption's words from a sample through `follow`, and let the component turn the
  number into words shown.
- **Reviewing a mixed scene:** export `limits`, target name to `{ jump?, turn?, ratio? }`: the 3D targets get a jump
  about a fifth of the subject's size and `turn: 30`, the px labels keep the command's defaults. A `custom` number
  is judged as a ratio.
- **Values that are not poses** (words shown, a lid's shut, a share): return them as `custom` numbers on a target and
  read them on the page in `player.subscribe`; the review judges them as ratios.
- **A model without eyelids:** add a lid per eye on the page, a mesh in the skin colour attached to the eye's bone,
  placed from the model's eye file in `apps/pieces/references/` (each iris's box in model units). The box's centre
  lies inside the head: the eye's front surface is near `z + depth / 2`. Attach the lids before the model joins a
  group the scene poses, since `worldToLocal` reads the parents' current matrices. Drive them from a custom number (0
  open, 1 shut) and hide them when open. Random blinks come from `seeded(n)` from `"@gerak/moves"`, drawn once at the
  top of the scene module so every play and seek blinks at the same times.
- **Ending at rest:** the review asks every target to hold still before the end. A `follow` keeps settling after its
  last sample, and an idle sway never stops by itself: end the samples early, raise `follow`'s stiffness or give it a
  `rest`, and fade idle loops out before the final hold.

## Limits

- No skew and no anchors in `Pose3d`; nest groups instead.
- Euler turns near 90 degrees about x lose a degree of freedom when you write them by hand. Blend through `mixPose3d`,
  never field by field.
- `trailTurn` and `velocity3d` take the scene's time, never `span.of(time, ease)`.
- `smear3d`'s `stretch` is a share per unit a second, where `smear` counts per 1000 px a second: a 3D body moves a
  few units a second.
- Not yet scaffolded: React Three Fiber (`--r3f`).
