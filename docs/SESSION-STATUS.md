# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the lifecycle-and-scheduling slice.

## Now

- **Lifecycle and scheduling hold on the v5 engine:** thirteen previously pended suites run against
  identified tables, covering unmount/remount closure and retention, cross-motion pending references,
  terminal destroy patches, add/remove and replacement cycles, mount flush ownership, and the
  manual, time, looping and scroll trigger paths. The pending ledger is at 107.

## Next in line

- **Port the remaining Phase 4 pended suites:** move every edit and value test that can run now onto
  the builders, keep anything that needs built-in plugins pended with a Phase 5 reason, and lower the
  ledger ceiling to the new count.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
