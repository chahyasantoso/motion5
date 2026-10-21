# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-21, Asia/Jakarta.
- **Read against:** branch `feat/skeldata-v5-phase-c`.

## Now

- **Candidate acceptance:** every planned track evaluates through the one operation runner; Track
  swaps output and per-entry evaluator state together, keys requirement inputs by entry, and carries
  the temporary `legacy-compose` strategy (with mixed tracks refused) under
  `21-C7-candidate-acceptance.md`; implemented locally with CI pending.

## Next in line

- **Frame math:** begin `22-D1-frame-math.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
