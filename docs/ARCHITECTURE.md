# gerak architecture

**Status:** Who owns what. Current implementation state lives in [SESSION-STATUS.md](./SESSION-STATUS.md); where code
lives is in [MAP.md](./MAP.md).

## 1. The one invariant

**Motion is a pure function.** A scene maps time, and the input so far, to one value per target. The same time and
input always give the same values, so a scene can be sampled, sought, tested and reviewed with no browser and no
clock. Everything else in this document follows from keeping that true: a scene owns every number of motion, a
driver owns time and its typed `inputLog`, a player owns playback, and a renderer owns writing.

## 2. Layers

```text
core:      core (pure) --> player (pure), stage (pure) --> dom, react, three, tools
modules:   rig (pure), physics (pure), rig-three (--> rig, three), rapier (--> physics)
library:   moves (pure --> core, rig, stage)
```

Three dependency groups enforce one direction of imports: `library` may import `modules` and `core`, and `modules` may import `core`, never the other way round. Each package declares `"gerak": { "group": "core" | "modules" | "library" }`, and the boundary scan enforces it.

- **Pure:** `core`, `stage`, `player`, `rig`, `physics` and `moves`. Their manifests say `"gerak": { "layer": "pure" }`, and the
  boundary scan refuses a pure file that imports anything outside the pure layer. They touch no DOM, no clock and no
  global state.
- **Renderers:** `dom` (CSS strings, element writes and the page drivers), `react` (hooks over a player) and `three`
  (writes a pose on an `Object3D`, paired with `rig-three` for skinned skeletons). A renderer never computes motion.
- **Engines behind a port:** `rapier` puts Rapier behind `physics`' `PhysicsWorld`.
- **Tools:** `tools/scene` reads a scene module with no browser; `tools/page` drives a real page with Playwright and
  Vite, and the scan holds it to `node:`, `@gerak/core`, `playwright-core` and `vite`.

## 2a. What a piece is built from

Layers, each using only the ones below it and each in its own folder. A piece stops at the highest layer it needs.

| Layer | Answers | Lives in |
| --- | --- | --- |
| 1. Fields | what can change on a target, where it rests, how two answers join, how the review judges it | `packages/core/src/fields/` |
| 2. Parts | how a number, point or pose changes over time, with no role, rest contract or option gate | `packages/core/src/` (time, blend, ease, envelope, geometry, path, measure); `packages/moves/src/parts/<group>/` |
| 3. Moves | a named behaviour: parts coupled on fields inside one progress, a function from options to a function of time | `packages/moves/src/moves/`; a brief's own in `apps/pieces/<brief>/src/moves/` |
| 4. Arranging time | moves placed in time and across targets: spans, phases, lanes, loops, chains, reshaped time; the piece format | `packages/core/src/time/`; `@gerak/stage` |
| 5. Pieces | one brief's motion, as content | `apps/pieces/<brief>/` |
| 6. Logic | what happens because of what a person did | the app owns rules and lasting state, sending `set`/`trigger` against a `Contract`; scenes read `value`/`valueAt`/`triggers`, and `@gerak/moves` provides `follow`/`react` |
| 7. App | the thing that ships | the web overlay, the instrument, video, and later a game or a quiz |

- A lower layer never knows a higher one: a spring does not know it is in a game. The boundary scan's pure layer holds
  layers 1 to 4.
- A move exists where parts couple inside one progress; parts merely side by side are arranged in time, not a move.
- A move outside `@gerak/moves` imports only `@gerak/core`, `@gerak/moves` and its own `src/parts/`, so it can travel
  to another project as it is.
- Rules and lasting state live in the app, never inside gerak. The app sends current values (`set`) and discrete triggers
  (`trigger`) through a typed `Contract` (`inputs`), while physics replays from checkpoints so timed pieces stay seekable,
  reviewed, edited live and rendered frame-exact.
- A move written for one brief lives in that brief's `src/moves/` and moves into `@gerak/moves` when a second brief
  imports it. Any agent may write a part or a move.

## 3. Ownership

| Question | Owner |
| --- | --- |
| What a value is at a time | the scene, built from `core` and optionally `moves` |
| Fields, time, eases, spans, lanes, envelopes, paths, 3D maths and blends | `@gerak/core` |
| Elements and their bindings, beats, `scene`, `slot3d`, layouts and `carry` | `@gerak/stage` |
| Named moves, couplings and signal parts | `@gerak/moves` |
| Bones, chains, FK, IK and frames, 2D and 3D | `@gerak/rig`, bound to Three.js skeletons by `@gerak/rig-three` |
| Bodies, contacts and a seekable simulation | `@gerak/physics`, backed by `@gerak/rapier` |
| Which moment is shown, its `RuntimeStore`, and who hears a value or a cue | `@gerak/player` |
| Where time comes from on a page: `liveClock` (with bounded input window), `clockDriver`, `scrollDriver`, and opt-in `listen` | `@gerak/dom` |
| The CSS a pose becomes | `@gerak/dom` |
| A pose on a Three.js object and opt-in `createStage3d` rig | `@gerak/three` |
| Binding a player or compiled stage to React | `@gerak/react` (and `@gerak/three/react`) |
| Reading, checking, measuring, live-reloading and photographing motion | `@gerak/tools` |

One owner per question. A second place that answers one of these is the defect to fix, not a convenience to keep.

## 4. Invariants

1. A scene is pure: no `Date`, no randomness without a seed, no DOM reads. A value the page measures reaches a scene
   through an object the scene reads and `player.refresh()`.
2. A driver reports time and typed input only; it never changes a pose.
3. A move ends at its rest pose, the element's layout position, so the page's layout is the final frame.
4. A renderer writes what a value says and nothing else, and owns every CSS string it writes.
5. Physics is seekable: `simulate` replays from the start to any time, so a physics scene stays a function of time.
6. Reading a closed union is an exhaustive `switch`.

## 5. Public surface

Each package declares its entries in its `exports` map, and each package's generated reference names every export
(`packages/<package>/docs/reference`, held current by a test). The boundary scan refuses a workspace
import of a subpath a package does not declare.

## 6. Deliberately excluded

- A second way to make motion. JSON projects and the engine that ran them were retired (ADR-170); the archive branch
  `archive/core-plugins` holds them.
- A house look. Scenes choose their own style; the examples' looks are not a template.
- Hidden state in a renderer or a hook that a scene cannot see.
