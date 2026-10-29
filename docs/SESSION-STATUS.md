# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-29, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the consumer-migration gate.

## Now

- **Aggregate consumer migration complete:** one core selector owns record and row selection; React
  exposes `rowPatchSource` over that selector with one cached snapshot per publication; DOM and
  Three adapters stay record-only while callers apply selected cells; both playground rigs author
  body and goals tables and read solver rows plus `inspect`; the react-demo suite runs its real
  walker project. Four consumer-migration ledger entries retired, the two removal entries remain.

## Next in line

- **Remove superseded paths:** delete the grouped plugin registry and compose surface, the grouped
  keyframe readers, the graph output-edge merge machinery and the legacy plugin layer, then
  reconcile docs, rules, exports and this status.

## Open, and not scheduled

- Retargeting remains a proposed design only.

## Where the rest of it lives

- Exact commits, runs, decisions and equivalence evidence: the owning pull request.
- Standing rules: [GUARDRAILS.md](./GUARDRAILS.md). Caller cost:
  [LIVE-EDIT-COST.md](./LIVE-EDIT-COST.md).
- Contributor discipline: [PR-WORKFLOW.md](./PR-WORKFLOW.md). API navigation:
  [API-CAPABILITIES.md](./API-CAPABILITIES.md).
- Earlier long-form history remains in Git, not in this status file.
