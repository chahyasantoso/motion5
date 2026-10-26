# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-25, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the identified 3D FK cutover.

## Now

- **Phase 5 has six cutovers and both solver proofs:** public `transform`, `transform3d`, `ik`, `ik3d`,
  `fk` and `fk3d` now use identified tables, while grouped consumers stay behind explicit internal
  legacy paths. Both FK plugins select one solver row by canonical `memberId` before publishing one
  same-ID frame row, and the 3D boundary preserves orientation, pivot and weight math. No pending
  ledger entries were removed; 73 Phase 5, 4 Phase 6 and 2 Phase 7 entries remain.

## Next in line

- **Phase 5 continues with identified rig aggregation:** migrate rig to consume named bone and control
  tables by source row identity, preserve duplicate-row refusal and keep classifier migration after it.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
