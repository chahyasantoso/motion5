# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
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
  live in `@motion5/tools`, and `motion:sample` and `motion:timeline` read a `.ts` scene with no browser. The agent guide is code-first and `motion:new` scaffolds a code scene. Core and plugins are frozen: fixes only. Moves state their moments, `span` and the eases live in moves, `buildChain` types its bone ids, and `/catch.html` is a second worked example. `keyframes` is in moves, the scaffold sets layout only, and the `make-motion` skill sends an agent to the agent guide.

## Next in line

- **Skill and look:** check in a fresh session that `make-motion` triggers on a motion brief, then run a
  benchmark to see whether pieces now choose their own look.

## Open, and not scheduled

- No follower cache: [BENCH-FOLLOWER.md](./BENCH-FOLLOWER.md) records the numbers and when to measure
  again.
- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
