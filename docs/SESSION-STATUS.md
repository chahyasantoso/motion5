# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-05, Asia/Jakarta.
- **Read against:** `main` at `699581b005083082333b8b52ce2167114f57aca3`, merged PR #554.

## Now

- **PR #554 is merged: core reads solver declarations through registry-owned capabilities, with no
  plugin names in graph or contract source.**

## Next in line

- **#534 review alignment:** Phase 8 labels and the non-null renderer-neutral value policy are
  prepared on `fix/534-null-policy-labels`; the cumulative handover is the source of truth until CI
  verifies the branch.

## Open, and not scheduled

- Rig, pose classification, 3D avatar driving, and runners remain unmerged.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
