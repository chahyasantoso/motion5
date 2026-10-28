# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-28, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the aggregate IK slices.

## Now

- **2D and 3D IK read aggregate tables:** `ik` and `ik3d` take one body table, one goals table
  and one base record through single-source slots, share the topology reader and goal join, and
  publish the same solved rows byte for byte. Grouped authoring is refused by name at load, so
  the app's grouped rig no longer loads until its slice migrates it. No pending ledger entries
  were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Aggregate 2D FK:** compose one whole pose table from the body and solved tables and the base
  record.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
