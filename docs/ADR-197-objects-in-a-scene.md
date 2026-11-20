# ADR-197: Three.js objects in a scene

**Status:** Accepted, 2026-11-21

## Context

A 3D piece was a scene module: a `scene(time, events)` function returning `Pose3d` targets, bound with
`useTarget3d` and `player.subscribe`. It got no beats, no `.show`, no element review limits and no page slots, and
its DOM labels were targets of the same function rather than elements. A page made with `sceneBuilder` could not hold
a 3D object at all.

## Decision

1. **The `object` element.** `@gerak/stage` exports `object(name, { view? })`, kind `"object"`, posed in `Pose3d`
   world units. It has no node, rest box, skin, content, pivot or pointer events; a page scene needs no `node` for
   it. `.element(object)` answers an `ObjectStep` whose `.motion` takes 3D motions and whose `.modify` takes 3D
   principles; layer motions join by `combine3d`, `take` replaces. `Pose2d` refuses the 3D-only fields, so a 3D
   motion on a box and a 2D one on an object fail to type-check. `context.read` refuses an object.
2. **Both mounts skip it.** `mountStage` keeps its place in member order and draws nothing; `mountPage` binds no node
   for it and never hands it to the browser.
3. **`bindScene3d`.** `@gerak/three` exports `bindScene3d(player, scene, objects, draw)`. On each player step it
   writes every object, an `Object3D` posed from its position when bound or a writer `(pose, visible) => void`, sets
   `visible` from `.show`, then calls `draw` once, so the canvas draws on the player's step (ADR-183). It throws on
   an object with no entry. A skeleton's bones are objects, one per bone, written through a writer to `applyBones`.
4. **Onto a page slot.** Core gains `unproject3d(point, lens, stage, depth)`. An object with
   `view: { canvas, lens }` takes `travel({ to: slot })`: it moves to the slot's centre on the canvas box at the depth
   along the lens it starts from. `arc` and `fit` are refused on an object, and so is a travel with no view.
5. `gerak new --three` writes a builder piece with one object bound through `bindScene3d`.

Supersedes ADR-190's clause that pose `"3d"` is gone until a renderer needs it.

## Consequences

- `overlay3d`, `principles3d`, `character3d`, `avatar-3d` and `dragon-intro` are builder pieces; four were moved by
  fresh agents that read only the docs and `overlay3d`, and each fact they learned by trial is now in
  `@gerak/three`'s 3D page. Their frames match the earlier ones within run-to-run noise.
- A list target (`props`, `bones`) becomes one object per entry; there are no objects inside groups or lists yet.
- `yuzu-3d` puts a Three.js can on the landing page, travelling between the same slots as yuzu's drink.

## Rejected

- A bone element: a writer per bone object routes poses to `applyBones` with no new kind.
- Letting an element read an object's pose: a 3D pose read as 2D is wrong in every field; a label computes from the
  same functions as its object.
- An arc or fit for an object's travel: an arc in px has no meaning at a depth, and a can keeps its size.
