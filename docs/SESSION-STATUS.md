# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the removal gate.

## Now

- **One v5 contract is live:** identified tables and records under `input.values`, one
  `PluginCatalog`, one input-edge graph, one core selector and one React row projection. The grouped
  registry, authored grouped readers, output-edge merge, legacy plugin layer and v4 converter are
  deleted; the pending ledger is empty and all three apps build and pass their smoke evidence.

## Next in line

- **Await the owner's decision before any v5.1 work:** Phase 6 and Phase 7 are complete, and the
  validation-contract plan is not started until the owner says so.

## Open, and not scheduled

- Cache and measurement work remains deferred by the owner; no threshold, cache hook or Phase 8
  measurement is active.
- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
