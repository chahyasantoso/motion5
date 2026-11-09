# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `test/repo/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-08, Asia/Jakarta.
- **Read against:** `feat/pure-motion` after the full check gate.

## Now

- **One track kind and path models are live:** every authored track names `output: { model }` or
  `output: { plugin }`, `input.param` carries plugin parameters through `input.param.set` and
  `setField`, models are registered beside plugins, and an engine requires a catalog and gives every
  track a static guard and parses a source at commit. A computed track that publishes a model fixes
  its output static cells at first compose. Plugins declare only the input channels they use, and an
  authored channel the plugin does not declare is refused by name. Cheap writes and live writes refuse
  static-cell changes, live overlays cover both `input.values` and `input.param` independently, and a
  structural commit re-runs an affected reader's `prepare` and lets its computed outputs re-parse
  before accepting new static cells. Cheap writes run no `parse` or `prepare`, a plugin's local model
  parses at commit, a plugin's main output must be a model, and later frames keep their declared
  output names and shapes. `type`, top-level
  `plugin` and `input.schema` are refused by name. S1 to S8 are green; `definePlugin` derives slot,
  structure and state types from model declarations, and `Anchors2d`, `CubicPath2d`, `LocalAnchors2d`
  models and `anchorsToCubic`, `bezier`, `skinAnchors` plugins are exported and in `builtinCatalog`.
  `motion:catalog` and `motion:sample` report plugins and published values as JSON with no browser, and
  `motion:frames` returns PNGs of a real page at named times.
  An absent required param and an unknown ease are refused, `scaleX` and `scaleY` render, and
  `Motion.stagger` finishes every track. A `time` trigger takes a `delay`, and `Word` binds text to tracks or to the rows of one `cascade`
  track. `rope`, `trace`, `svgPath` and `layer` bend, draw on and combine moves, `useAnchor` measures a
  param from the page, and the page tools take `--root` or `--url` for any site. `@motion5/moves` holds
  `Time`, lanes, `Pose2d`, `defineMove`, `combine` and the moves `drop`, `hop`, `wipe`, `trace` and
  `rope` with no dependencies; `movePlugin` turns a move into its plugin, pinned by parity tests, and a
  `time` trigger's duration reaches plugins as each track's clock. `/timing.html` runs a beat of moves.
  `@motion5/rig` holds frames, the IK solvers, body topology and the joint vocabulary with no
  dependencies, and code rigs a 2D chain with `buildChain`, `fk` and `ik`. `@motion5/dom` renders poses,
  reveals, strokes and paths and owns every CSS string, its `/engine` holds the DOM patch adapter and
  browser clock, and `@motion5/three` renders a pose with `applyPose2d`. `@motion5/player` plays a code
  scene on a manual, clock or scroll driver, React reads it with `usePlayer`, `useTarget` and
  `useValue`, and `/timing.html` is now a code scene held equal to `timing-beat.json`. The motion tools
  live in `@motion5/tools`, and `motion:sample` and `motion:timeline` read a `.ts` scene with no browser. The agent guide is code-first and `motion:new` scaffolds a code scene. Core and plugins are frozen: fixes only. The main entries of `react`, `dom`, `three` and `tools` import nothing from core, and a boundary rule keeps it so; the engine parts sit behind their `/engine` entries. Moves state their moments, `span` and the eases live in moves, `buildChain` types its bone ids, and `/catch.html` is a second worked example. `keyframes` is in moves, the scaffold sets layout only, and the `make-motion` skill sends an agent to the agent guide. A fresh session showed it triggers on a motion brief, and `/splash.html` is a third worked example. `motion:read` reads any page's motion as moves with named eases, CSS animations follow the tools' paused clock, and `motion:check` reports faint or cut-off text and honours `data-motion-touch`. `motion:render` writes an MP4 or GIF from the paused clock, the same bytes every run. Scenes read page events beside time: `eventDriver` logs hover, press, focus and in-view, `follow` springs between goals, and every page tool takes `--action`; `/card.html` is the fourth worked example. Scenes have their own `cues`, `react` answers events with damped responses, `player.on` hears them, and the scene tools take `--events`. `@motion5/physics` gives an injectable `PhysicsWorld` with a built-in engine and a seekable `simulate`, `@motion5/rapier` puts Rapier behind it, and `/pile.html` is the fifth worked example, tumbling into a pile. Physics bodies turn on both engines, and pointer events carry where they happened. `simulate` spawns bodies on events into one world, and `motion:review` checks, reads and photographs a page in one call. `docs/guide/agent-reference.md` names every export and command, held complete by a test. The agent guide is a 6 KB core with events, physics, rigs and motion principles as parts read on demand. Motion principles are knobs, not presets: moves own one `spring`, `springEase` and `backEase` with amounts, `trail` follows a signal at a fixed cost per frame, `lanes` start from the end, centre, edges or a seed, `squashed` takes a side, `along` rides a path by distance, `velocity` and `smear` stretch along travel, `clockDriver` shows the last frame under reduced motion, and `/principles.html` is the sixth worked example. Code scenes reach 3D: `Pose3d` (y up, turns blended as rotations) with `combine3d`, `mixPose3d` and `lift2d` for every 2D move, `squashed3d`, `along3d`, `velocity3d`, `smear3d`, `trailTurn`, `aim` and `orbit`; `applyPose3d` and `useTarget3d` in `@motion5/three/react` write it on Three.js objects; `motion:new --three` scaffolds a Three.js scene, `motion:review` checks a scene file from its values with no page, and `/principles3d.html` is the seventh worked example.

## Next in line

- **Review the branch:** `feat/motion-principles-3d` holds the 3D motion-principles work, unpushed; one independent
  review of the whole branch, then a pull request for the owner.

## Open, and not scheduled

- No follower cache: [BENCH-FOLLOWER.md](./BENCH-FOLLOWER.md) records the numbers and when to measure
  again.
- Retargeting remains a proposed design only.
- 3D rigs, a skinned mesh's bones, 3D physics (Rapier is 2D today) and an R3F scaffold for code scenes: wanted, not
  started.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
