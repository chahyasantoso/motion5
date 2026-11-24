# 3D scenes

Read this when the brief is three-dimensional: depth, turns about more than one axis, a camera that moves. A 3D scene
is a code scene like any other; only its poses and its binder change. Names are in
[the reference](../../core/docs/reference/fields.md).

## The loop

1. `npx gerak new <name> --three` writes a page (`<name>.html`), its entry, a React component and `<name>-scene.ts`, a `sceneBuilder`
   piece with one `object("box")` and one `box("label")` pinned over it, starting `threeBinder(world, { draw }).start(player, stage)`. To measure and play DOM and 3D together under one cast without repeating renderer/camera boilerplate, use `createStage3d(canvas, lens, { near?, far?, maxPixelRatio?, objects?, fallbackSize? })` (which wires an empty `Scene`, `PerspectiveCamera(lens)`, `WebGLRenderer`, DPR-clamped `resize`, `draw`, `dispose`, and `threeBinder`, adding zero preset lights, materials, tone mapping, or shadows) and pass `stage3d.binder` to `mount(piece, { clock, root, binders })` over `data-cast` elements on the page.
2. Write the piece. An object takes motions that return `Pose3d`: `{ x, y, z, rotation, rotationX, rotationY,
   scale, scaleX, scaleY, scaleZ, opacity }`, y up, turns in degrees, distances in world units, not px. A 2D motion
   on an object, or a 3D one on a box, does not compile.
3. Run `npx gerak measure <brief>/<name>.html` when the page mounts with `mount`, then `npx gerak review <pieces>/<brief>/src/<name>-scene.ts` to check the values: jumps, a short final hold, a target
   still moving at the end, headless. Give each object `.limits({ jump, turn })` in world units: a jump
   about a fifth of the subject's height (0.1 for a character 0.5 units tall) and `turn: 30`, since the command's
   defaults are for px and let a bone flip in one step. The labels keep the defaults.
4. `npx gerak review <name>.html --watch canvas --to <ms>` gives the frame sheet. Read it: the page tools see
   no element inside a canvas, so the sheet is how you see framing, silhouettes and whether the motion reads.

## Poses

- `rotation` turns about z, `rotationX` about x, `rotationY` about y, in that order (Z-X-Y). Blend poses with
  `mixPose3d` and stack them with `combine3d`. Both turn through real rotations, so a pose never flips when two axes
  turn. To spin past a full turn, mix the angle itself: `mixPose3d` takes the short way.
- An object's motions stack as an element's do: layer motions combine by `combine3d`, a `.take()` motion replaces
  its fields from the start of its window, `.in(beat, ease)` plays it over a beat, and `.show(...)` (clock or scroll
  windows) drives visibility from `frameVisible(player.values)` on each step. A motion with no window gets the scene's
  time. A plain function `(time, context)`
  reads `context.time` and `context.events`, which `smear3d`, `velocity3d` and `trailTurn` take; a pose's
  `opacity` never sets `visible`.
- An object's origin is the `Object3D`'s origin. To turn or squash about another point, place the mesh in a parent `THREE.Group` and pose the parent.
- Every 2D move works in 3D through `lift2d(pose, { unitsPerPx })`: it scales px to units and flips y.
- `threeBinder(world, { objects?, resize?, draw? })` matches each scene `object` by `world.getObjectByName(name)` or by the override map `objects[name]`, invokes optional `resize` before initial `measure()` and inside `remeasure()` before measuring DOM and 3D bounds, and measures local `Box3` rest `{ width, height, depth }` per bound `Object3D` via `.measure()`. For an `Object3D`, its position when bound is its rest, and turns and scales are written whole. For `object(name, { parts: true })`, `threeBinder` binds an `Object3D[]` override or the `children` of a named `THREE.Group`, calls the list's `(index, count) => Pose3d` target via `listPose3d`, reports part counts in `.counts()`, and writes per-part bounds `name.<i>` beside `name` in `.measure()`. `objects` also accepts a writer `(pose, visible) => void` for anything not posed whole, such as a bone, or a model whose `custom` numbers drive morph targets
  (`(pose) => applyPose3d(model, pose, undefined, morphTargets(model))`). When passed in `mount`'s `binders`, every object must be claimed by exactly one binder or `mount` throws and names it.

## The principles in 3D

| Principle | Use |
| --- | --- |
| Squash and stretch | `squashed3d({ squash, axis })(weight)` keeps volume; `smear3d(velocity3d(...), { stretch, max })` stretches along travel |
| Anticipation | `squashed3d` on a span before the move, then `backEase({ amount, direction: "in" })` on a `mix` |
| Arcs | `along3d(toCubics3d(anchors), { face })(share)`; `face` points local +x along the path |
| Follow-through | `trailTurn(signal, { damping })` for a turn, the short way round; three `trail` calls for a position |
| Staging | the camera is the stage: `orbit` places it, `aim` points it, a `span` moves it |
| Stagger, timing, eases, settle | `lanes`, `span`, `ease`, `springEase`, as in 2D |

- **A smear on a body that must keep its face:** an outer `THREE.Group` takes `smear3d(...).pose` and the mesh inside takes
  `turn`. Reversing travel never flips the stretch.
- **A bank into a turn:** a facing turn from `along3d(..., { face: true })(share)` points local +x along the path. Bank with
  `combine3d([facing, { rotationX: bank }])`: it turns after the facing turn, so it rolls about the nose. Writing
  `rotationX` into the facing pose's own fields tilts about the world instead. Read the turn rate from the facing
  turn at two times with `timeAt`, and bank in proportion to it.
- **A camera move:** `const eye = orbit({ target, radius, azimuth: mix(a, b, pan.of(time).progress), elevation });`
  then an `object("camera")` whose motion returns `{ ...eye, ...aim(eye, target) }`, bound to the
  `PerspectiveCamera` like any mesh.
- **Staging:** move the camera or the subject, rarely both at once. A camera that drifts while the subject leaps hides
  the leap.

## A rigged character

- **The model:** a skinned `.glb` in `<pieces>/references/`, listed in its README with source, creator and licence
  (CC0, or CC BY with its credit line), under 2 MB. Bone names are the model's own; read them from its joint table.
- **Its joint table:** `npx gerak joints <pieces>/references/<model>.glb` writes `<model>.joints.json`
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
- **Bones by hand:** each bone that moves is an object of the piece, named after the bone, whose motion returns
  its `Pose3d`. It turns the bone about the model's own axes as they were at capture, carried by its parents:
  `{ rotationX: 20 }` on a jaw or a head turns it about the model's x axis whatever way the exporter rolled the
  bone. A bone with no object stays at rest.
- **Writing bones on the page:** after loading with `GLTFLoader` (`three/addons/loaders/GLTFLoader.js`, URL from
  `new URL("../references/<model>.glb", import.meta.url).href`), call `captureSkeleton(gltf.scene)` from
  `"@gerak/rig-three"` once. Give `threeBinder` a writer per bone object that keeps its pose in a record,
  `{ Jaw: (pose) => { poses["Jaw"] = pose; } }`, and call `applyBones(skeleton, poses)` in `draw` before rendering.
  Capture before moving or turning the model; place the model by a parent group instead.
- **Talking:** drive a jaw bone (`{ rotationX: open * 18 }`) or a morph target from
  `follow({ start: 0, on: { mouthOpen: "value" } })(time, events)`, with the samples (`talk.json`, imported with
  `with { type: "json" }`) exported as `cues`. Morph targets are custom numbers: `morphTargets(gltf.scene)` from
  `"@gerak/three"` is the fourth argument to `applyPose3d`, and `pose.custom` names the targets, clamped to `[0, 1]`.
- **Readiness:** a page that awaits an async asset before calling `mount` registers `ready(bootstrap())` from `"@gerak/dom"`, warming shaders synchronously via `renderer.compile(world, camera)` + `draw()` + `renderer.getContext().finish()` (never `compileAsync` or `requestAnimationFrame`: timer-polled waits stall paused-clock page tools) so the promise settles right after mounting, and rejects from the loader's error callback, so the frame tools fail at once on a missing model instead of timing out.

## Bodies in depth

- **The engine:** `const rapier3d = await rapierEngine3d()` from `"@gerak/rapier"` at the piece's top level,
  then `simulate(rapier3d(), (world) => { ... })` from `"@gerak/physics"`, as in 2D: `world.setGravity(0, -9.81, 0)`,
  `world.addCollider(...)`, `world.addBody(...)`. World units, y up.
  - A body: `{ id, shape, x, y, z }`, with `vx`, `vy`, `vz`, a starting `rotation` quaternion `{ w, x, y, z }`, spins
    `wx`, `wy`, `wz` in degrees a second, `drag` (damping, so it settles before the final hold), `mass`,
    `fixedRotation`, `restitution` and `friction`. `shape` is `{ kind: "sphere", radius }`,
    `{ kind: "box", width, height, depth }` or `{ kind: "cylinder", radius, height }`.
  - A fixed collider: `{ kind: "floor", y }`, `{ kind: "wall", axis: "x" | "z", at, side: "min" | "max" }` (a wall at
    `at` keeping bodies on its `side`), `{ kind: "box", x, y, z, width, height, depth }` or
    `{ kind: "cylinder", x, y, z, radius, height }`; a surface
    `{ restitution, friction }` is the third argument.
  - A tumbling body turns fast: lower drops, smaller spins and less bounce keep it within `--turn`.
- **A character among bodies:** a character has no collider of its own. Give it fixed `"box"` colliders where its
  feet, legs and body stand, or props settle inside it.
- **Reading a body:** `bodyPose3d(sim.pose("<id>", time))` from `"@gerak/rig"` answers its movement from where it
  was spawned and its turn, as a `Pose3d`; return it from the object's motion. Place its mesh at the body's spawn
  point and bind it with `threeBinder`.
- **The camera's rest:** `threeBinder` takes an `Object3D`'s position when it binds as its rest, so a camera posed
  by `orbit`, which answers absolute points, binds at the origin, or through a writer
  `(pose) => applyPose3d(camera, pose)`, which takes no rest.

## 2D over 3D

Words, captions and callouts over a 3D scene are boxes in the same piece, pinned by the piece itself, so they
sample, review and scrub with everything else.

- **The lens is the piece's.** Export the stage's size `{ width, height }` and `lens: Lens3d` (a camera `Pose3d` plus `fov`, vertical degrees). Size `.stage` and the WebGL renderer to those dimensions and build the `PerspectiveCamera` from `lens`; a page with its own `fov` drifts every label.
- **Reading an object:** `context.read(object)` returns typed `Pose3d` for both follower 3D objects and 2D DOM labels (`project3d` from `"@gerak/core"`), with runtime cycle refusal across 2D, 3D, mixed, and list-part reads. Raw string `context.read("name")` stays 2D-typed and refuses objects.
- **A point to pixels:** `project3d(point, lens, stage)` from `"@gerak/core"` answers `{ x, y, depth, visible }`,
  px from the stage's top left. Return `{ x, y, opacity }` for the label; the element's top-left corner lands there,
  so offset it in CSS to centre a bubble or put its tail on the point.
- **A point on a moving object:** turn and move the point with the object's pose in the scene before projecting. A
  joint of a posed model: `posedJoints3d(rig.joints, bones, root)` from `"@gerak/rig"` answers every joint's world
  point under the same `bones` the scene returns, `root` being the pose of the model's parent `THREE.Group`.
- **Hiding:** a label whose point is behind the lens (`visible: false`) or turned to the far side of its object
  (`depth` greater than the object centre's) fades out over a few frames; never pop it.
- **Drawing on the step:** `threeBinder` calls `draw` once a step, after it writes every object, and once when it
  binds. A free-running `requestAnimationFrame` loop can show the canvas a step behind the labels.
- **Text from samples:** reveal a caption's words by how much has been said, `tally(...)(time, events) /
  total`, from `"@gerak/core"`, and update the text element from `mounted.player.subscribe(...)`.
- **Reviewing a mixed piece:** the objects' `.limits` hold a jump about a fifth of the subject's size and
  `turn: 30`; the px labels keep the command's defaults. A `custom` number is judged as a ratio.
- **Values that are not poses** (words shown, a lid's shut, a share): return them as `custom` numbers on a label's or
  an object's pose and read them on the page in `mounted.player.subscribe` or a writer; the review judges them as ratios.
- **Onto a page slot:** an object with `object(name, { view: { canvas, lens } })`, where `canvas` is a box bound to
  the page's canvas node and `lens` the page's lens, takes `travel({ to: slot, fit? })`: it moves to the slot's centre on
  the canvas at the depth along the lens it starts from, and `viewSize3d(lens, stage, depth)` from `"@gerak/core"` computes the viewport span in world units at that depth. `fit` accepts `"none"` (default) or `"contain"` (uniform scaling from `viewSize3d` and measured `rest.object(name)` bounds); `arc`, `fit: "fill"` and `.take()` are refused on objects, and its
  `Object3D` rests at the world origin, since its position is measured from there. Custom motions that need a slot's projected world-unit center, width, height, or `ViewSize3d` call `slot3d(slot, view, context, { depth?, fit?, scrollY? })` from `"@gerak/stage"`, which shares the exact same projection helper as `travel`.
- **Order on a step:** `threeBinder` writes and draws in one player listener, taken when it binds; a listener
  subscribed after it runs after the draw. The rest it reads is the `Object3D`'s position at that moment.
- **An object on a bone:** `attach(skeleton, "<bone>", object, { at, turn })` from `"@gerak/rig-three"` makes
  `object` ride the bone, placed at `at`, a `Vector3` in the model's space (the space of the joint table and the eye
  file), and turned by `turn`, a `Quaternion` in that space. It reads only the captured rest, so it is right
  whatever the model's hierarchy is posed to. Lids, hats, held props and glasses are each one call.
- **A model without eyelids:** attach a lid per eye, a mesh in the skin colour, to the eye's bone at a point from the
  model's eye file in `<pieces>/references/` (each iris's box in model units). The box's centre lies inside the
  head: the eye's front surface is near `z + depth / 2`. Drive them from a custom number (0
  open, 1 shut) and hide them when open. Random blinks come from `seeded(n)` from `"@gerak/core"`, drawn once at the
  top of the piece's file so every play and seek blinks at the same times.
- **Ending at rest:** the review asks every target to hold still before the end. A `follow` keeps settling after its
  last sample, and an idle sway never stops by itself: end the samples early, raise `follow`'s stiffness or give it a
  `rest`, and fade idle loops out before the final hold.

## Limits

- No skew and no anchors in `Pose3d`; nest `THREE.Group` containers instead.
- Euler turns near 90 degrees about x lose a degree of freedom when you write them by hand. Blend through `mixPose3d`,
  never field by field.
- `trailTurn` and `velocity3d` take the scene's time, never `span.of(time, ease)`.
- `smear3d`'s `stretch` is a share per unit a second, where `smear` counts per 1000 px a second: a 3D body moves a
  few units a second.
- Not yet scaffolded: React Three Fiber (`--r3f`).
- Not yet: pointer events on an object.
- A pose's `opacity` turns its material transparent and has Three.js rebuild it, so it fades however it was
  first drawn.
