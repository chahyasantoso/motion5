# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after aggregate 2D FK.

## Now

- **2D FK reads aggregate tables:** `fk` takes one body table, one solved table and one base
  record through single-source slots, walks canonical topology, and publishes the whole pose table
  in one pass. Grouped authoring is refused by name at load. No pending ledger entries were removed;
  73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Aggregate 3D FK:** the same chain, solved and base contract for `fk3d`, preserving orientation
  blending, 3D pivot offsets, segment extent and Euler world-frame pose publishing.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
