# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-17, Asia/Jakarta.
- **Read against:** base branch `feat/skeldata-v5-base`.

## Now

- **Skeldata address, identity, and lifecycle types landed** in `packages/core/src/contract/address.ts`;
  disjoint namespaces, collision-free tuple encoding, prototype safety and generation-backed handles
  pinned in slice A2 on `feat/skeldata-v5-base`.

## Next in line

- **Slice A3 execution:** pin coordinate systems, 2D units, exact `Object.is` numeric comparisons,
  and solver finite-domain guarantees under `03-A3-numerics.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
