# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-21, Asia/Jakarta.
- **Read against:** branch `feat/skeldata-v5-phase-c`.

## Now

- **Joined topology derivation:** multi-chain tree layout, point locators, root policy, and the
  `skeleton-imported-chain-has-root` rule under `17-C3-joined-layout.md`; implemented locally with CI
  pending.

## Next in line

- **IK solver derivation:** derive solver goals and member bindings under
  `18-C4-solver-derivation.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
