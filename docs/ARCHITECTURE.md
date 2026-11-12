# gerak architecture

**Status:** Who owns what. Current implementation state lives in [SESSION-STATUS.md](./SESSION-STATUS.md); where code
lives is in [MAP.md](./MAP.md).

## 1. The one invariant

**Motion is a pure function.** A scene maps time, and the events so far, to one value per target. The same time and
events always give the same values, so a scene can be sampled, sought, tested and reviewed with no browser and no
clock. Everything else in this document follows from keeping that true: a scene owns every number of motion, a
driver owns only time, a player owns only playback, and a renderer owns only writing.

## 2. Layers

```text
            tools (page, scene)        dom        react        three
                    \                    \          |           /
                     +--------------------+---------+----------+
                                          |
                                       player
                                          |
                      moves  <--  rig          physics  <--  rapier
```

- **Pure:** `moves`, `rig`, `player` and `physics`. Their manifests say `"gerak": { "layer": "pure" }`, and the
  boundary scan refuses a pure file that imports anything outside the pure layer. They touch no DOM, no clock and no
  global state.
- **Renderers:** `dom` (CSS strings, element writes and the page drivers), `react` (hooks over a player) and `three`
  (writes a pose on an `Object3D`). A renderer never computes motion.
- **Engines behind a port:** `rapier` puts Rapier behind `physics`' `PhysicsWorld`.
- **Tools:** `tools/scene` reads a scene module with no browser; `tools/page` drives a real page with Playwright and
  Vite, and the scan holds it to `node:`, `playwright-core` and `vite`.

## 2a. What a piece is built from

Five layers, each using only the ones below it. A piece stops at the highest layer it needs; an explainer stops at
the scene.

| Layer | Answers | In gerak |
| --- | --- | --- |
| 1. Parts | how a value changes over time | `span`, `sequence`, `spring`, `trail`, `mix`, `along`, eases: `npm run motion:moves -- --parts` |
| 2. Moves | what the common motions are | `defineMove` with a role, held by the gate, listed by `motion:moves`; an app's own in `src/moves` |
| 3. Scene | what happens, and when | a scene function of time and events; `sequence` for beats; the cast and text are written by hand today |
| 4. Logic | what happens because of what a person did | the event log, `react` and `follow` today; rules, score and state wait for a brief |
| 5. App | the thing that ships | the web overlay, the instrument, video, and later a game or a quiz |

- A lower layer never knows a higher one: a spring does not know it is in a game. The boundary scan's pure layer
  enforces it for layers 1 to 3.
- Logic is a fold over the event log, never state changed in place. Score, position and collisions are worked out
  from the events so far, as physics is replayed from snapshots, so a piece with logic can still be sought, reviewed,
  edited live and rendered frame-exact.
- A move written for one piece lives in that app's `src/moves` and moves down into `@gerak/moves` when a second
  piece uses it. Any agent may write a part or a move; promotion is the review step, not a separate author.

## 3. Ownership

| Question | Owner |
| --- | --- |
| What a value is at a time | the scene, built from `moves` |
| Time, eases, spans, lanes, poses, blends and the moves | `@gerak/moves` |
| Bones, chains, FK, IK and frames, 2D and 3D | `@gerak/rig` |
| Bodies, contacts and a seekable simulation | `@gerak/physics` |
| Which moment is shown, and who hears a value or a cue | `@gerak/player` |
| Where time comes from on a page: a clock, scroll, events | the drivers in `@gerak/dom` |
| The CSS a pose becomes | `@gerak/dom` |
| A pose on a Three.js object | `@gerak/three` |
| Binding a player to React | `@gerak/react` |
| Reading, checking and photographing motion | `@gerak/tools` |

One owner per question. A second place that answers one of these is the defect to fix, not a convenience to keep.

## 4. Invariants

1. A scene is pure: no `Date`, no randomness without a seed, no DOM reads. A value the page measures reaches a scene
   through an object the scene reads and `player.refresh()`.
2. A driver reports time and events only; it never changes a value.
3. A move ends at its rest pose, the element's layout position, so the page's layout is the final frame.
4. A renderer writes what a value says and nothing else, and owns every CSS string it writes.
5. Physics is seekable: `simulate` replays from the start to any time, so a physics scene stays a function of time.
6. Reading a closed union is an exhaustive `switch`.

## 5. Public surface

Each package declares its entries in its `exports` map, and the reference names every export
([agent-reference.md](./guide/agent-reference.md), held complete by a test). The boundary scan refuses a workspace
import of a subpath a package does not declare.

## 6. Deliberately excluded

- A second way to make motion. JSON projects and the engine that ran them were retired (ADR-170); the archive branch
  `archive/core-plugins` holds them.
- A house look. Scenes choose their own style; the examples' looks are not a template.
- Hidden state in a renderer or a hook that a scene cannot see.
