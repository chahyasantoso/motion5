# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-17, Asia/Jakarta.
- **Read against:** base branch `feat/skeldata-v5-base`.

## Now

- **Canonical fixtures, invalid cases, and FK oracle landed** in
  `packages/core/test/fixtures/skeldata-fixtures.ts`; final-schema test fixtures, 10 single-defect
  invalid variants, and deterministic tree generator pinned in slice A4 on `feat/skeldata-v5-base`.

## Next in line

- **Slice A5 execution:** inventory removals, consumer impacts, and maintained behaviors under
  `05-A5-deletions.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
