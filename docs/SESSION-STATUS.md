# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after Slice 6 explicit aggregate graph and publisher cleanup.

## Now

- **Explicit aggregate graph and publisher:** `packages/core/src/graph` and `packages/core/src/runtime`
  compose aggregate plugins purely through explicit declared requirement edges, with no hidden
  solver fan-in or member interpolation. 73 Phase 5, 4 Phase 6 and 2 Phase 7 pending entries remain.

## Next in line

- **Pose-gap-filler aggregate migration:** replace 28 member tracks with 5 aggregate tracks (`root`,
  `body`, `goals`, `solve`, `pose`) and whole-table batch writes.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
