# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-07, Asia/Jakarta.
- **Read against:** `feat/agent-motion` after the full check gate.

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
  `Motion.stagger` finishes every track. A `time` trigger takes a `delay`, and `Word` binds text to tracks. `drop`, `hop` and `wipe` are pure moves in `builtinCatalog`,
  publishing the new `Sprite2d` and `Clip2d` models with their own pivot, and `/timing.html` in `apps/react-demo` runs a beat
  built from them.

## Next in line

- **Run the benchmark:** a fresh agent on a fixed brief, with and without the repo, to decide what comes next.

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
