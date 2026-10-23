# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-23, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the identified-table plugin slice.

## Now

- **Plugins and dependency slots are live on the identified-table path:** a registered plugin id,
  record/table parameter inputs, dependency slots and named outputs run through the engine and
  publisher, with slot compatibility checked at load and input/output contracts validated at runtime.

## Next in line

- **Rebuild live edits, handles and observation wiring on identified tables:** authoring and live
  handle operations, dirty propagation and patch publication adapt to identified tables and slots.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
