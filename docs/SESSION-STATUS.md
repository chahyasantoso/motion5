# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-17, Asia/Jakarta.
- **Read against:** branch `feat/skeldata-v5-phase-c`.

## Now

- **Narrow generic structural derivation landed** in `packages/core/src/domain/structural-derivation.ts`
  and `packages/core/src/contract/derivation.ts`, producing immutable descriptors and diagnostics from
  validated structural declarations without runtime state access under C1.

## Next in line

- **Chain layout and root policy derivation:** produce ordered point IDs, parent indices, and root
  provenance from chain sources under `16-C2-chain-layout.md`.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning handover and pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost: [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation: [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
