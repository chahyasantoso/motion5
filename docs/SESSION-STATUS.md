# Session status

Current project state only. Replace stale entries rather than append history. The four sections below
are the complete shape. **Now** and **Next in line** carry exactly one bullet each, and no bullet
states a phase; `packages/core/test/unit/scripts/session-status-shape.test.ts` enforces the shape and
byte ceiling.

- **Captured:** 2026-10-24, Asia/Jakarta.
- **Read against:** `refactor/v5-identified-tables` after the observes-deletion slice.

## Now

- **Dependency bindings are the only edge source:** the retired `observes` surface, its two live
  verbs and its twelve rule ids are gone, edges come only from `input.requires` and the grouped
  keyframes bridge, and slot binding derivation lives in `graph/dependency-edges.ts`.

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
