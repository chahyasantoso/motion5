# ADR-202: Subject-first scenes

**Date:** 2026-11-24
**Status:** Accepted, 2026-11-24

## Context

`sceneBuilder().element(x).motion(...)` kept a selected element as a cursor inside the chain:

- Prettier set `.element(x)` and `.motion(...)` in one flat column, so a chain did not show where one element's calls
  ended. `.element(card).element(dot).motion(...)` read as if `card` moved.
- A loop that mixed 2D and 3D steps had to declare `let builder: SceneBuilder` to widen the cursor back to a scene.
- `.include(scene)` was a second way to put elements into a scene, beside `.element`.

## Decision

1. **A piece is `scene([options,] ...items)`.** `options` is `{ name?, length?, cues? }`. `SceneItem` is a closed
   union read with an exhaustive `switch`: an `ElementBinding`, an `ObjectBinding`, a bare element (an element with no
   motion), or another `Scene`, merged onto the same clock. `sceneBuilder`, `SceneBuilder`, `SceneBuilderOptions`,
   `ElementStep`, `ObjectStep` and `.include` are deleted.
2. **The element is the subject.** `box`, `shape` and `text` carry `.moves(...)`, `.modifies(principle)`,
   `.shows(...windows)` and `.limits(limits)`. Each returns a frozen `ElementBinding` that records the call. `object`
   carries the same four methods typed for `Pose3d` and `travel`, returning an `ObjectBinding`. A binding has the same
   four methods, and each returns a new binding with the call appended. The element never changes. The methods are
   non-enumerable own properties, so equality checks and copies of an element skip them.
3. **One replay, one owner.** `scene` replays each binding's calls, in the order written, through the state
   transitions the builder ran. A piece written either way compiles to the same stage. `.moves`/`.modifies` layering,
   `.take()`, `.shows` windows and the duplicate-limit refusal keep their meaning.
4. **An element is bound once per scene.** `scene` refuses an element bound twice, directly or through a sub-scene,
   and names the place: "chain its calls on one binding". Read-only references (`view.canvas`, `travel.to`, edge
   points, `stayWith`) may still be shared across sub-scenes.
5. **Where the types live.** `elements.ts` owns the elements, their bindings and the motion-facing types an element's
   methods name (`MotionContext`, `SceneMotion`, `Principle`, `TravelMotion`, `ShowWindow`), so the stage package
   keeps no import cycle. `scene.ts` owns `scene`, its state and compilation.

## Consequences

- Each element's calls sit in one indented block under its name. A programmatic list spreads into `scene(...)`
  (`...cards.map((card) => card.moves(rise))`), with no cursor to widen.
- Samples of every piece under `apps/pieces/` are byte-identical before and after the rewrite. Builder-only tests
  (re-selecting an element, branching from a builder, `.motion` before `.element`, giving motions to an included
  scene's element) are deleted.
- `gerak new`, the Vite plugin and the repository's piece detection find a piece by `export default` and `scene(`.

## Supersedes

- [ADR-193](./ADR-193-scene-builder.md) Decision 1 (the `sceneBuilder` chain).
- [ADR-198](./ADR-198-authored-cast.md) Decision 5 (`.include`): merged scenes are items of `scene(...)`, and an
  element bound in one may not be bound again in another.
