# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after Slice 9 classifier and consumer migration.

## Now

- **Classifier reads aggregate pose tables:** `packages/plugins/src/pose-classify.ts` binds directly
  to FK pose tables, publishing flat label records. 24 pending suites retired; 35 Phase 5, 4 Phase 6
  and 2 Phase 7 pending entries remain.

## Next in line

- **Rig retirement and Phase 5 closeout:** delete v5 and legacy rig plugins, remove rig subpaths and
  catalogs, add deletion tests, and retire final Phase 5 pending suites.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
