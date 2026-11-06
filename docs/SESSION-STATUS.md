# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-11-05, Asia/Jakarta.
- **Read against:** `feat/v5.2-models-and-plugin-tracks` after the full check gate.

## Now

- **One track kind is live:** every authored track names `output: { model }` or `output: { plugin }`,
  `input.param` carries plugin parameters through `input.param.set` and `setField`, models are
  registered beside plugins, and an engine requires a catalog and gives every track a static guard
  and parses a source at commit. A computed track that publishes a model fixes its output static
  cells at first compose. Cheap writes and live writes refuse static-cell changes; `type`, top-level
  `plugin` and `input.schema` are refused by name. S1 to S6 are green; the `DataType`/typed-slot
  system, the Pose specs and the `legacyTypeId` bridge are gone.

## Next in line

- **S7 waits for the owner's go-ahead:** derive plugin slot, structure and state types from model
  declarations, and delete the hand-written kinematics input types and casts.

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
