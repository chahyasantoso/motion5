# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the identified 2D transform cutover.

## Now

- **Phase 5 has begun:** the existing plugin entrypoints now have an explicit internal legacy boundary,
  and the public 2D `transform` path is an identified-table plugin with declared input/output schemas
  and preserved source-row ids. Grouped consumers remain on the internal legacy path. No pending
  ledger entries were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Phase 5 continues with the 3D transform cutover:** migrate `transform3d` at its existing public
  entrypoint, keep grouped consumers explicitly legacy-only, and then prove the explicit 2D solver
  graph before FK or rig migration.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
