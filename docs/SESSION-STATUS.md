# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-07, Asia/Jakarta.
- **Read against:** `feat/v5.2-models-and-plugin-tracks` after the full check gate.

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

## Next in line

- **Measure follower cost and evaluate caches:** record per-frame cost for N followers over a path
  of M segments, then decide whether to add a shared arc-length track or segment cache.

## Open, and not scheduled

- Cache and measurement work remains deferred by the owner; no threshold, cache hook or Phase 8
  measurement is active.
- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [AGENTS.md](../AGENTS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
