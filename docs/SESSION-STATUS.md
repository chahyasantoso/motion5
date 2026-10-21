# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-21, Asia/Jakarta.
- **Read against:** branch `feat/skeldata-v5-phase-c`.

## Now

- **Legacy quarantine:** kinematic readers in the graph and publisher now sit behind one shared
  `isLegacyComposeDefinition` predicate, and the new execution path carries no solver capability or
  chain shape, under `20-C6-generic-core.md`; implemented locally with CI pending.

## Next in line

- **Candidate acceptance:** add the temporary `legacy-compose` execution strategy, key inputs by
  entry, and remove the committed-state fallback under `21-C7-candidate-acceptance.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
